import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

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
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Active Open / Upcoming Exam Cycles (Deadlines: Sep - Dec 2026)
const ACTIVE_2026_EXAMS = [
  {
    exam_name_en: "Common Admission Test (CAT 2026 - IIMs & MBA)",
    exam_name_as: "সৰ্বভাৰতীয় ব্যৱস্থাপনা প্ৰৱেশ পৰীক্ষা (CAT 2026)",
    conducting_body: "Indian Institutes of Management (IIMs)",
    category: "university",
    eligibility_en: "Bachelor's Degree in any stream (min 50% marks) or final year appearing.",
    eligibility_as: "যিকোনো শাখাত ৫০% নম্বৰসহ স্নাতক বা অন্তিম বৰ্ষৰ শিক্ষাৰ্থীৰ বাবে IIM ত নামভৰ্তি।",
    apply_link: "https://iimcat.ac.in",
    deadline: "2026-09-15",
    exam_date: "2026-11-29"
  },
  {
    exam_name_en: "GATE 2027 - Graduate Aptitude Test in Engineering",
    exam_name_as: "গে'ট (GATE 2027) অভিযান্ত্ৰিক আৰু পি.এছ.ইউ নিযুক্তি প্ৰৱেশ পৰীক্ষা",
    conducting_body: "IIT Madras",
    category: "engineering",
    eligibility_en: "3rd year or completed degree in Engineering, Technology, Architecture, or Science.",
    eligibility_as: "অভিযান্ত্ৰিক/বিজ্ঞান শাখাৰ ৩য় বৰ্ষ বা উত্তীৰ্ণ শিক্ষাৰ্থী (M.Tech আৰু PSU নিযুক্তিৰ বাবে)।",
    apply_link: "https://gate2027.iitm.ac.in",
    deadline: "2026-09-27",
    exam_date: "2027-02-06"
  },
  {
    exam_name_en: "CLAT 2027 - Common Law Admission Test",
    exam_name_as: "ৰাষ্ট্ৰীয় আইন বিশ্ববিদ্যালয় প্ৰৱেশ পৰীক্ষা (CLAT 2027)",
    conducting_body: "Consortium of National Law Universities",
    category: "university",
    eligibility_en: "Class 12th pass/appearing (min 45% marks) for 5-Year Integrated BA LLB / BBA LLB.",
    eligibility_as: "দ্বাদশ শ্ৰেণী উত্তীৰ্ণ বা অৱতীৰ্ণ শিক্ষার্থীসকলৰ বাবে ৫-বছৰীয়া সমন্বিত আইন পাঠ্যক্ৰম।",
    apply_link: "https://consortiumofnlus.ac.in",
    deadline: "2026-10-31",
    exam_date: "2026-12-06"
  },
  {
    exam_name_en: "SSC GD Constable Examination 2026-27",
    exam_name_as: "এছ.এছ.চি জিডি কনিষ্টবল নিযুক্তি প্ৰৱেশ পৰীক্ষা",
    conducting_body: "Staff Selection Commission (SSC)",
    category: "defense",
    eligibility_en: "10th Standard (Matriculation) pass for BSF, CISF, CRPF, Assam Rifles.",
    eligibility_as: "মেট্ৰিক উত্তীৰ্ণ নিবনুৱা যুৱক-যুৱতীসকলৰ বাবে অৰ্ধসামৰিক বাহিনীত কনিষ্টবল পদ।",
    apply_link: "https://ssc.gov.in",
    deadline: "2026-10-14",
    exam_date: "2027-01-15"
  },
  {
    exam_name_en: "UGC NET (December 2026 Cycle)",
    exam_name_as: "ইউজিচি নেট (UGC NET - সহকাৰী অধ্যাপক আৰু JRF)",
    conducting_body: "National Testing Agency (NTA)",
    category: "university",
    eligibility_en: "Master's Degree (min 55% marks) in Humanities, Science, or Commerce.",
    eligibility_as: "স্নাতকোত্তৰ উত্তীৰ্ণ বা অন্তিম বৰ্ষৰ ছাত্ৰ-ছাত্ৰীৰ বাবে মহাবিদ্যালয় শিক্ষকতাৰ যোগ্যতা।",
    apply_link: "https://ugcnet.nta.ac.in",
    deadline: "2026-11-10",
    exam_date: "2026-12-20"
  }
];

async function syncExams() {
  const todayIso = new Date().toISOString().split('T')[0];
  console.log(`\n🕒 Current Date: ${todayIso}`);
  console.log('🔄 Ingesting active 2026–2027 exam cycles into Supabase...');

  let added = 0;

  for (const item of ACTIVE_2026_EXAMS) {
    const { data: existing } = await supabase
      .from('entrance_exams')
      .select('id')
      .eq('exam_name_en', item.exam_name_en)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from('entrance_exams').insert([{
        ...item,
        is_approved: false,
        source_type: 'automated_public_feed'
      }]);

      if (!error) {
        console.log(`✅ [Queued for Admin Approval]: ${item.exam_name_en}`);
        added++;
      }
    } else {
      console.log(`ℹ️ Already exists: ${item.exam_name_en}`);
    }
  }

  console.log(`\n✨ Success: ${added} active exams are now queued in Supabase.\n`);
}

syncExams();
