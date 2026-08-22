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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UPCOMING_2026_EXAMS = [
  {
    exam_name_en: "Common Admission Test (CAT 2026 - MBA/IIMs)",
    exam_name_as: "সৰ্বভাৰতীয় ব্যৱস্থাপনা প্ৰৱেশ পৰীক্ষা (CAT 2026)",
    conducting_body: "Indian Institutes of Management (IIMs)",
    category: "university",
    eligibility_en: "Bachelor's Degree in any discipline (min 50% marks) or final year appearing.",
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
    eligibility_as: "অভিযান্ত্ৰিক/বিজ্ঞান শাখাৰ তৃতীয় বৰ্ষ বা উত্তীৰ্ণ শিক্ষাৰ্থী (M.Tech আৰু PSU চাকৰিৰ বাবে)।",
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
  }
];

async function syncUpcoming() {
  const todayIso = new Date().toISOString().split('T')[0];
  let queued = 0;

  for (const item of UPCOMING_2026_EXAMS) {
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
      if (!error) queued++;
    }
  }
  console.log(`✅ Queued ${queued} active 2026 registration feeds for Admin approval.`);
}

syncUpcoming();
