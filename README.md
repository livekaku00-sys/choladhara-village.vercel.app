# Choladhara Village Portal

Bilingual (Assamese / English) village portal: notices, weather and farm advisories,
jobs and entrance exams, scholarships, and a skilled-workers directory. Built with
React + Vite + Tailwind, backed by Supabase, deployed on Vercel.

## Development

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Other scripts: `npm run build`, `npm run type-check`, `npm run test`.

## Database setup (Supabase SQL Editor)

Run these in order:

1. `sql/schema.sql`
2. `sql/entrance_exams_schema.sql`
3. `sql/admin_security.sql` — admin-only write policies

Then give your account admin access:

```sql
INSERT INTO public.admins (user_id)
SELECT id FROM auth.users WHERE email = 'you@example.com';
```

Only users listed in `public.admins` can edit data or use `/admin`. Signed-in users
who are not in that table get read access only, like everyone else.
