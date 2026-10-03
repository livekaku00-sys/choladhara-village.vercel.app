// Date helpers for "YYYY-MM-DD" deadline strings stored in Supabase.
// new Date('YYYY-MM-DD') is parsed as UTC midnight, which shifts the day for
// visitors outside UTC, so these always work with local calendar dates.

const pad = (n: number) => String(n).padStart(2, '0');

/** A date as YYYY-MM-DD in the visitor's timezone. */
export const localDateString = (d: Date = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Parse YYYY-MM-DD as local midnight. */
export const parseLocalDate = (ymd: string) => new Date(`${ymd}T00:00`);

/** Whole days from today until the given date: 0 = today, negative = past. */
export const daysUntil = (ymd: string, now: Date = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseLocalDate(ymd).getTime() - today.getTime()) / 86_400_000);
};

/** "Last day today" / "1 day left" / "5 days left" in either language. */
export const daysLeftLabel = (days: number, isAs: boolean) => {
  if (days <= 0) return isAs ? 'আজি শেষ দিন' : 'Last day today';
  if (isAs) return `${days} দিন বাকী`;
  return days === 1 ? '1 day left' : `${days} days left`;
};

const MONTHS_AS = ['জানুৱাৰী', 'ফেব্ৰুৱাৰী', 'মাৰ্চ', 'এপ্ৰিল', 'মে', 'জুন', 'জুলাই', 'আগষ্ট', 'ছেপ্তেম্বৰ', 'অক্টোবৰ', 'নৱেম্বৰ', 'ডিচেম্বৰ'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const AS_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toAsDigits = (s: string) => s.replace(/\d/g, d => AS_DIGITS[Number(d)]);

/** "31 Oct 2026" / "৩১ অক্টোবৰ ২০২৬"; returns the input unchanged if it is not YYYY-MM-DD. */
export const formatDate = (ymd: string, isAs: boolean) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(ymd);
  if (!m) return ymd;
  const [, y, mo, d] = m;
  const day = String(Number(d));
  return isAs
    ? toAsDigits(`${day} `) + MONTHS_AS[Number(mo) - 1] + toAsDigits(` ${y}`)
    : `${day} ${MONTHS_EN[Number(mo) - 1]} ${y}`;
};
