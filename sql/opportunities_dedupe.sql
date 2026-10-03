-- Stop the job scraper (scripts/auto-fetch-jobs.mjs) from queuing the same notice
-- on every run. Run once in the Supabase SQL Editor.

-- Columns the scraper writes (no-ops if they already exist).
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS official_application_url TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS apply_url TEXT;

-- 1. Preview the duplicates that will be removed.
--    For each link this keeps one row: an approved one if there is one, otherwise the oldest.
SELECT id, title_en, is_approved, official_application_url
FROM (
    SELECT *, ROW_NUMBER() OVER (
        PARTITION BY official_application_url
        ORDER BY is_approved DESC, id ASC
    ) AS rn
    FROM public.opportunities
    WHERE official_application_url IS NOT NULL
) d
WHERE rn > 1;

-- 2. Delete those duplicates.
DELETE FROM public.opportunities
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY official_application_url
            ORDER BY is_approved DESC, id ASC
        ) AS rn
        FROM public.opportunities
        WHERE official_application_url IS NOT NULL
    ) d
    WHERE rn > 1
);

-- 3. One row per link from now on (manual entries without a link are unaffected).
CREATE UNIQUE INDEX IF NOT EXISTS opportunities_official_application_url_key
    ON public.opportunities (official_application_url);
