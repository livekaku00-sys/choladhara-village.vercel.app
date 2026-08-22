import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env keys safely
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
}

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_ID')) {
  console.error('❌ Supabase URL/Key missing in .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TrackedScholarship {
  title_en: string;
  title_as: string;
  provider: string;
  eligibility_en: string;
  eligibility_as: string;
  benefit_amount: string;
  apply_link: string;
  deadline: string;
}

const OFFICIAL_SCHEMES_FEED: TrackedScholarship[] = [
  {
    title_en: "Ishan Uday Special Scholarship Scheme for NER",
    title_as: "উত্তৰ-পূৰ্বাঞ্চলৰ ছাত্ৰ-ছাত্ৰীৰ বাবে ঈশান উদয় বিশেষ ছাত্ৰবৃত্তি",
    provider: "UGC / National Scholarship Portal (NSP)",
    eligibility_en: "12th Pass from NER admitted to recognized degree colleges (Income < ₹4.5 LPA).",
    eligibility_as: "দ্বাদশ উত্তীৰ্ণ মহাবিদ্যালয়/বিশ্ববিদ্যালয়ত প্ৰথম বৰ্ষত নামভৰ্তি কৰা ছাত্ৰ-ছাত্ৰী (বাৰ্ষিক আয় ৪.৫ লাখৰ তলত)।",
    benefit_amount: "₹5,400 to ₹7,800 / month",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-10-31"
  },
  {
    title_en: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    title_as: "মেধা-ভিত্তিক ৰাষ্ট্ৰীয় ছাত্ৰবৃত্তি আঁচনি (NMMSS)",
    provider: "Department of School Education & Literacy, Govt. of India",
    eligibility_en: "Class 8 passed meritorious students studying in State Govt. / Local Body schools.",
    eligibility_as: "চৰকাৰী বিদ্যালয়ত অধ্যয়নৰত অষ্টম শ্ৰেণী উত্তীৰ্ণ মেধাৱী ছাত্ৰ-ছাত্ৰীৰ বাবে।",
    benefit_amount: "₹12,000 / annum",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-11-15"
  },
  {
    title_en: "AICTE Pragati Scholarship for Girl Students",
    title_as: "কাৰিকৰী শিক্ষাৰ ছাত্ৰীসকলৰ বাবে প্ৰগতি ছাত্ৰবৃত্তি",
    provider: "All India Council for Technical Education (AICTE)",
    eligibility_en: "Girls admitted to 1st year AICTE-approved Degree / Diploma technical programs.",
    eligibility_as: "কাৰিকৰী শিক্ষা (Diploma / Degree)ত নামভৰ্তি কৰা মেধাৱী ছাত্ৰীসকলৰ বাবে।",
    benefit_amount: "₹50,000 / annum",
    apply_link: "https://www.aicte-india.org",
    deadline: "2026-10-15"
  },
  {
    title_en: "Assam Post-Matric Scholarship for SC/ST/OBC Students",
    title_as: "অসম চৰকাৰৰ মেট্ৰিক-উত্তৰ অনুসূচীত জাতি/জনজাতি/অন্যান্য পিছপৰা শ্ৰেণীৰ ছাত্ৰবৃত্তি",
    provider: "Directorate of WPT & BC, Govt. of Assam",
    eligibility_en: "Post-matric students enrolled in recognized institutions across Assam.",
    eligibility_as: "মেট্ৰিক উত্তীৰ্ণ উচ্চতৰ মাধ্যমিক আৰু মহাবিদ্যালয়ৰ সংৰক্ষিত শ্ৰেণীৰ শিক্ষাৰ্থী।",
    benefit_amount: "Institutional Fee Support + Monthly Stipend",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-11-30"
  },
  {
    title_en: "ONGC Foundation Meritorious Scholarship",
    title_as: "অ'এনজিচি (ONGC) মেধাৱী ছাত্ৰবৃত্তি আঁচনি",
    provider: "ONGC Foundation CSR Trust (Charaideo & Nazira Hub)",
    eligibility_en: "1st year MBBS, Engineering, MBA, or Master in Geophysics students.",
    eligibility_as: "চিকিৎসা আৰু কাৰিকৰী মহাবিদ্যালয়ৰ প্ৰথম বৰ্ষৰ মেধাৱী শিক্ষাৰ্থী।",
    benefit_amount: "₹48,000 / annum",
    apply_link: "https://ongcscholar.org",
    deadline: "2026-12-15"
  }
];

async function syncAndWipeScholarships() {
  const todayIso = new Date().toISOString().split('T')[0];
  console.log(`🕒 Today's Date: ${todayIso}`);

  // 1. AUTO-WIPE EXPIRED SCHEMES FROM DATABASE
  console.log('🧹 [Auto-Wipe]: Purging expired scholarships past deadline...');
  const { error: wipeError } = await supabase
    .from('scholarships')
    .delete()
    .lt('deadline', todayIso);

  if (wipeError) {
    console.error('Wipe error:', wipeError.message);
  } else {
    console.log('✅ Expired programs successfully wiped from database.');
  }

  // 2. SYNC ACTIVE OFFICIAL FEEDS
  console.log('🔄 Scanning active official schemes...');
  let newQueued = 0;

  for (const item of OFFICIAL_SCHEMES_FEED) {
    // Only queue if deadline is still in the future
    if (item.deadline >= todayIso) {
      const { data: existing } = await supabase
        .from('scholarships')
        .select('id')
        .eq('title_en', item.title_en)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('scholarships').insert([{
          ...item,
          is_approved: false,
          source_type: 'automated_official_feed'
        }]);

        if (!error) {
          console.log(`📑 [Queued for Verification]: "${item.title_en}"`);
          newQueued++;
        }
      }
    }
  }

  console.log(`✨ [Completed]: Database cleaned & ${newQueued} valid schemes queued.`);
}

syncAndWipeScholarships();
