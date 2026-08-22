import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 1. Read .env configuration
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TrackedJob {
  title_en: string;
  title_as: string;
  category: 'job' | 'training';
  eligibility_en: string;
  eligibility_as: string;
  official_link: string;
  deadline: string;
}

const OFFICIAL_JOBS_FEED: TrackedJob[] = [
  {
    title_en: "SSC GD Constable Recruitment 2026-27 (BSF, CISF, CRPF, Assam Rifles)",
    title_as: "এছ.এছ.চি জিডি কনিষ্টবল নিযুক্তি (বি.এছ.এফ, চি.আৰ.পি.এফ, অসম ৰাইফলছ)",
    category: "job",
    eligibility_en: "10th Standard (Matriculation) pass from a recognized Board.",
    eligibility_as: "স্বীকৃতিপ্ৰাপ্ত ব’ৰ্ডৰ পৰা মেট্ৰিক (HSLC) উত্তীৰ্ণ নিবনুৱা যুৱক-যুৱতী।",
    official_link: "https://ssc.gov.in",
    deadline: "2026-10-14"
  },
  {
    title_en: "Assam Police SLPRB Constable & Sub-Inspector Recruitment",
    title_as: "অসম আৰক্ষী কনিষ্টবল আৰু উপ-পৰিদৰ্শক (SI) নিযুক্তি বাৰ্তা",
    category: "job",
    eligibility_en: "HSLC for Constable / Bachelor's Degree for Sub-Inspector (Assam Domicile).",
    eligibility_as: "কনিষ্টবল পদৰ বাবে মেট্ৰিক আৰু উপ-পৰিদৰ্শক পদৰ বাবে স্নাতক ডিগ্ৰীধাৰী।",
    official_link: "https://slprbassam.in",
    deadline: "2026-10-30"
  },
  {
    title_en: "India Post Gramin Dak Sevak (GDS) Engagement (Assam Circle)",
    title_as: "ভাৰতীয় ডাক বিভাগৰ গ্ৰামীণ ডাক সেৱক (GDS) নিযুক্তি",
    category: "job",
    eligibility_en: "10th standard pass with Mathematics and English (No exam, 10th merit based).",
    eligibility_as: "গণিত আৰু ইংৰাজীসহ দশম শ্ৰেণী উত্তীৰ্ণ (কোনো লিখিত পৰীক্ষা নহয়, মেধা তালিকাৰ ভিত্তিত)।",
    official_link: "https://indiapostgdsonline.gov.in",
    deadline: "2026-09-20"
  },
  {
    title_en: "DDU-GKY Free Residential Skill Training & Placement Drive",
    title_as: "দীনদয়াল উপাধ্যায় গ্ৰামীণ কৌশল্য যোজনা (DDU-GKY) বিনামূলীয়া কাৰিকৰী প্ৰশিক্ষণ",
    category: "training",
    eligibility_en: "Rural youth aged 18-35 (Class 5th to 12th pass) with free food, lodging & placement.",
    eligibility_as: "১৮-৩৫ বছৰৰ গ্ৰাম্য যুৱক-যুৱতীৰ বাবে থকা-খোৱাৰ সুবিধাসহ বিনামূলীয়া প্ৰশিক্ষণ আৰু চাকৰি।",
    official_link: "https://ddugky.gov.in",
    deadline: "2026-11-30"
  },
  {
    title_en: "ONGC Apprentice Engagement (Nazira & Assam Asset)",
    title_as: "অ'এনজিচি (ONGC) শিক্ষানবিচ (Apprentice) প্ৰশিক্ষণ আঁচনি",
    category: "training",
    eligibility_en: "ITI in relevant trade, Diploma in Engineering, or BA/BSc/BCom graduate.",
    eligibility_as: "আই.টি.আই (ITI), অভিযান্ত্ৰিক ডিপ্লমা অথবা সাধাৰণ স্নাতক উত্তীৰ্ণ প্ৰাৰ্থী।",
    official_link: "https://ongcindia.com",
    deadline: "2026-10-25"
  },
  {
    title_en: "IBPS Regional Rural Banks (Assam Gramin Vikash Bank) Recruitment",
    title_as: "অসম গ্ৰামীণ বিকাশ বেংক সহকাৰী আৰু বিষয়া নিযুক্তি",
    category: "job",
    eligibility_en: "Bachelor's degree in any discipline with proficiency in Assamese/local language.",
    eligibility_as: "যিকোনো শাখাৰ স্নাতক উত্তীৰ্ণ আৰু স্থানীয় ভাষাৰ জ্ঞান থকা প্ৰাৰ্থী।",
    official_link: "https://ibps.in",
    deadline: "2026-09-30"
  }
];

async function syncAndWipeJobs() {
  const todayIso = new Date().toISOString().split('T')[0];
  console.log(`\n🕒 Current Date: ${todayIso}`);
  console.log('🧹 [Auto-Wipe]: Purging expired job notices past closing date...');

  // 1. Wipe expired jobs
  await supabase
    .from('opportunities')
    .delete()
    .lt('deadline', todayIso);

  // 2. Queue active government circulars
  console.log('🔄 Scanning active Assam & Central Govt job opportunities...');
  let newQueued = 0;

  for (const item of OFFICIAL_JOBS_FEED) {
    if (item.deadline >= todayIso) {
      const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title_en', item.title_en)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('opportunities').insert([{
          ...item,
          is_approved: false, // Queued for Volunteer Admin verification
          created_at: new Date().toISOString()
        }]);

        if (!error) {
          console.log(`📑 [Queued for Admin Review]: "${item.title_en}"`);
          newQueued++;
        }
      }
    }
  }

  console.log(`✨ [Completed]: ${newQueued} recruitment notices queued for verification.\n`);
}

syncAndWipeJobs();
