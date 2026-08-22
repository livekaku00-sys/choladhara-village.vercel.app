import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 1. Load .env config
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 1. SCHOLARSHIPS FEED
// ==========================================
const SCHOLARSHIPS_FEED = [
  {
    title_en: "Ishan Uday Special Scholarship Scheme for NER",
    title_as: "উত্তৰ-পূৰ্বাঞ্চলৰ ছাত্ৰ-ছাত্ৰীৰ বাবে ঈশান উদয় বিশেষ ছাত্ৰবৃত্তি",
    provider: "UGC / National Scholarship Portal (NSP)",
    eligibility_en: "12th Pass from NER admitted to degree colleges (Income < ₹4.5 LPA).",
    eligibility_as: "দ্বাদশ উত্তীৰ্ণ মহাবিদ্যালয়/বিশ্ববিদ্যালয়ত প্ৰথম বৰ্ষত নামভৰ্তি কৰা ছাত্ৰ-ছাত্ৰী।",
    benefit_amount: "₹5,400 to ₹7,800 / month",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-10-31"
  },
  {
    title_en: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    title_as: "মেধা-ভিত্তিক ৰাষ্ট্ৰীয় ছাত্ৰবৃত্তি আঁচনি (NMMSS)",
    provider: "Ministry of Education, Govt. of India",
    eligibility_en: "Class 8 passed meritorious students in State Govt. / Local Body schools.",
    eligibility_as: "চৰকাৰী বিদ্যালয়ত অধ্যয়নৰত অষ্টম শ্ৰেণী উত্তীৰ্ণ মেধাৱী ছাত্ৰ-ছাত্ৰীৰ বাবে।",
    benefit_amount: "₹12,000 / annum",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-11-15"
  },
  {
    title_en: "AICTE Pragati Scholarship for Girl Students",
    title_as: "কাৰিকৰী শিক্ষাৰ ছাত্ৰীসকলৰ বাবে প্ৰগতি ছাত্ৰবৃত্তি",
    provider: "AICTE",
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
    benefit_amount: "Institutional Fee Support + Stipend",
    apply_link: "https://scholarships.gov.in",
    deadline: "2026-11-30"
  },
  {
    title_en: "ONGC Foundation Meritorious Scholarship",
    title_as: "অ'এনজিচি (ONGC) মেধাৱী ছাত্ৰবৃত্তি আঁচনি",
    provider: "ONGC Foundation CSR Trust (Nazira & Charaideo)",
    eligibility_en: "1st year MBBS, Engineering, MBA, or Master in Geophysics students.",
    eligibility_as: "চিকিৎসা আৰু কাৰিকৰী মহাবিদ্যালয়ৰ প্ৰথম বৰ্ষৰ মেধাৱী শিক্ষাৰ্থী।",
    benefit_amount: "₹48,000 / annum",
    apply_link: "https://ongcscholar.org",
    deadline: "2026-12-15"
  }
];

// ==========================================
// 2. ENTRANCE & COMPETITIVE EXAMS FEED
// ==========================================
const EXAMS_FEED = [
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
    eligibility_as: "অভিযান্ত্ৰিক/বিজ্ঞান শাখাৰ ৩য় বৰ্ষ বা উত্তীৰ্ণ শিক্ষাৰ্থী (M.Tech আৰু PSU নিযুক্তি)।",
    apply_link: "https://gate2027.iitm.ac.in",
    deadline: "2026-09-27",
    exam_date: "2027-02-06"
  },
  {
    exam_name_en: "CLAT 2027 - Common Law Admission Test",
    exam_name_as: "ৰাষ্ট্ৰীয় আইন বিশ্ববিদ্যালয় প্ৰৱেশ পৰীক্ষা (CLAT 2027)",
    conducting_body: "Consortium of National Law Universities",
    category: "university",
    eligibility_en: "Class 12th pass/appearing (min 45% marks) for 5-Year Integrated Law.",
    eligibility_as: "দ্বাদশ শ্ৰেণী উত্তীৰ্ণ বা অৱতীৰ্ণ শিক্ষার্থীসকলৰ বাবে ৫-বছৰীয়া সমন্বিত আইন পাঠ্যক্ৰম।",
    apply_link: "https://consortiumofnlus.ac.in",
    deadline: "2026-10-31",
    exam_date: "2026-12-06"
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

// ==========================================
// 3. JOBS, TRAINING & SELF-EMPLOYMENT FEED
// ==========================================
const OPPORTUNITIES_FEED = [
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
    eligibility_en: "HSLC for Constable / Bachelor Degree for Sub-Inspector (Assam Domicile).",
    eligibility_as: "কনিষ্টবল পদৰ বাবে মেট্ৰিক আৰু উপ-পৰিদৰ্শক পদৰ বাবে স্নাতক ডিগ্ৰীধাৰী।",
    official_link: "https://slprbassam.in",
    deadline: "2026-10-30"
  },
  {
    title_en: "India Post Gramin Dak Sevak (GDS) Engagement (Assam Circle)",
    title_as: "ভাৰতীয় ডাক বিভাগৰ গ্ৰামীণ ডাক সেৱক (GDS) নিযুক্তি",
    category: "job",
    eligibility_en: "10th standard pass with Mathematics and English (Merit based, no exam).",
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
    title_en: "Chief Minister's Atmanirbhar Asom Abhijan (CMAAA 2.0)",
    title_as: "মুখ্যমন্ত্ৰীৰ আত্মনিৰ্ভৰ অসম অভিযান (CMAAA 2.0 স্ব-নিয়োজন অনুদান)",
    category: "self_employment",
    eligibility_en: "Financial assistance of ₹2 Lakh to ₹5 Lakh (50% Govt Grant) for unemployed youth.",
    eligibility_as: "অসমৰ নিবনুৱা যুৱক-যুৱতীসকললৈ ব্যৱসায় আৰু আত্মসংস্থাপনৰ বাবে ২ ৰ পৰা ৫ লাখ টকাৰ সাহাৰ্য (৫০% অনুদান)।",
    official_link: "https://cmaaa.assam.gov.in",
    deadline: "2026-11-15"
  },
  {
    title_en: "PM Vishwakarma Yojana - Support for Village Artisans & Craftsmen",
    title_as: "প্ৰধানমন্ত্ৰী বিশ্বকৰ্মা যোজনা (গাঁৱৰ কাৰিকৰ আৰু শিল্পীসকলৰ বাবে)",
    category: "self_employment",
    eligibility_en: "₹15,000 toolkits e-voucher + ₹3 Lakh collateral-free loan at 5% interest for 18 trades.",
    eligibility_as: "কাঠমিস্ত্ৰী, ৰাজমিস্ত্ৰী, দৰ্জী, কমাৰ আদি কাৰিকৰলৈ ১৫,০০০ টকাৰ টোলকীট আৰু ৫% সুতত ঋণ।",
    official_link: "https://pmvishwakarma.gov.in",
    deadline: "2026-12-31"
  },
  {
    title_en: "Prime Minister's Employment Generation Programme (PMEGP)",
    title_as: "প্ৰধানমন্ত্ৰী ৰোজগাৰ সৃষ্টি কাৰ্যসূচী (PMEGP ৩৫% ৰাজসাহায্য)",
    category: "self_employment",
    eligibility_en: "Up to 35% government subsidy on bank loans for setting up micro-enterprises & manufacturing.",
    eligibility_as: "নতুন ক্ষুদ্ৰ উদ্যোগ, পাম বা ব্যৱসায় আৰম্ভ কৰিবলৈ বেংক ঋণৰ ওপৰত সৰ্বোচ্চ ৩৫% চৰকাৰী ৰাজসাহায্য।",
    official_link: "https://www.kviconline.gov.in",
    deadline: "2026-12-31"
  }
];

// ==========================================
// 4. AGRICULTURE & FARMERS FEED
// ==========================================
const AGRI_FEED = [
  {
    item_key: 'paddy_msp_procurement',
    category: 'paddy_msp',
    title_as: 'চৰকাৰী ধান ক্ৰয় আৰু নূন্যতম সমৰ্থন মূল্য (MSP ₹২,৩০০)',
    title_en: 'Govt Paddy Procurement & MSP Support Price (₹2,300/qtl)',
    authority_as: 'অসম খাদ্য আৰু অসামৰিক যোগান নিগম (AFCSCL / FCI)',
    authority_en: 'Assam Food & Civil Supplies / FCI Procurement Hub',
    benefit_as: 'প্ৰতি কুইণ্টল সাধাৰণ ধানৰ চৰকাৰী মূল্য ₹২,৩০০। পোনপটীয়া বেংক একাউণ্টত ধন হস্তান্তৰ (DBT)। নিকটৱৰ্তী ধান ক্ৰয় কেন্দ্ৰ (PPC): সোণাৰি / শিমলুগুৰি।',
    benefit_en: 'Official Common Paddy MSP ₹2,300/quintal. Direct bank transfer within 48-72h. Nearest PPC centers at Sonari & Simaluguri.',
    badge_as: 'ধান ক্ৰয় আঁচনি',
    badge_en: 'Paddy MSP',
    action_link: 'https://feportal.assam.gov.in',
    action_label_as: 'ধান বিক্ৰী পঞ্জীয়ন',
    action_label_en: 'Paddy Sale Token'
  },
  {
    item_key: 'tea_growers_welfare',
    category: 'tea',
    title_as: 'ক্ষুদ্ৰ চাহ খেতিয়ক কল্যাণ আৰু সেউজ পাতৰ মূল্য নিৰ্ধাৰণ',
    title_en: 'Small Tea Growers Advisory & Green Leaf Benchmark Price',
    authority_as: 'চাহ ব’ৰ্ড (Tea Board of India) আৰু চৰাইদেউ জিলা সমিতি',
    authority_en: 'Tea Board of India & Charaideo District Committee',
    benefit_as: 'বটলীফ কাৰখানাত বিক্ৰী কৰা কেঁচা চাহপাতৰ ন্যূনতম মান নিৰ্ধাৰণ। চাহ ব’ৰ্ডৰ বায়’মেট্ৰিক পৰিচয় পত্ৰ আৰু উন্নত মানৰ সাৰৰ ৰাজসাহায্য।',
    benefit_en: 'Official monthly benchmark price for green leaf sold to Bought Leaf Factories (BLFs), Biometric grower card registration.',
    badge_as: 'চাহ খেতি সেৱা',
    badge_en: 'Tea Growers',
    action_link: 'https://www.teaboard.gov.in',
    action_label_as: 'চাহ ব’ৰ্ড প’ৰ্টেল',
    action_label_en: 'Tea Board Portal'
  },
  {
    item_key: 'pmfby_crop_insurance',
    category: 'scheme',
    title_as: 'প্ৰধানমন্ত্ৰী ফচল বীমা যোজনা (কেৱল ₹১ টকাত শস্য বীমা)',
    title_en: 'PM Fasal Bima Yojana (Crop Insurance at ₹1 Premium in Assam)',
    authority_as: 'কৃষি বিভাগ, অসম চৰকাৰ (Govt of Assam)',
    authority_en: 'Department of Agriculture, Govt of Assam',
    benefit_as: 'অসমত কৃষকৰ বাবে প্ৰিমিয়াম মাত্ৰ ₹১। বানপানী, অনাবৃষ্টি বা কীট-পতংগৰ আক্ৰমণত শালী ধান আৰু ৰবি শস্যৰ ক্ষতিপূৰণ।',
    benefit_en: 'State-subsidized crop insurance where farmers pay only ₹1 token. Covers Sali paddy against floods and pest damage.',
    badge_as: 'শস্য বীমা',
    badge_en: 'Crop Insurance',
    action_link: 'https://pmfby.gov.in',
    action_label_as: 'শস্য বীমা পঞ্জীয়ন',
    action_label_en: 'Apply PMFBY'
  },
  {
    item_key: 'pm_kisan_samman',
    category: 'scheme',
    title_as: 'প্ৰধানমন্ত্ৰী কিষাণ সন্মান নিধি (বাৰ্ষিক ₹৬,০০০ সাহাৰ্য)',
    title_en: 'PM-KISAN Samman Nidhi (Annual ₹6,000 Income Support)',
    authority_as: 'কৃষি আৰু কৃষক কল্যাণ মন্ত্ৰালয়, ভাৰত চৰকাৰ',
    authority_en: 'Ministry of Agriculture & Farmers Welfare, GoI',
    benefit_as: 'প্ৰতি ৪ মাহৰ মূৰে মূৰে ₹২,০০০ কৈ বাৰ্ষিক ₹৬,০০০ প্ৰত্যক্ষ একাউণ্টত। e-KYC আৰু মাটিৰ নথি (Land Seeding) পৰীক্ষা কৰক।',
    benefit_en: 'Direct Benefit Transfer of ₹6,000/yr in 3 installments of ₹2,000. Verify e-KYC and Aadhaar-seeded land records online.',
    badge_as: 'কৃষক সন্মান নিধি',
    badge_en: 'PM-KISAN',
    action_link: 'https://pmkisan.gov.in',
    action_label_as: 'হিতাধিকাৰী স্থিতি চাওক',
    action_label_en: 'Check Status'
  },
  {
    item_key: 'smam_machinery_subsidy',
    category: 'scheme',
    title_as: 'কৃষি যন্ত্ৰপাতি আৰু ট্ৰেক্টৰ ৰাজসাহায্য (SMAM Scheme)',
    title_en: 'Sub-Mission on Agricultural Mechanization (SMAM Subsidy)',
    authority_as: 'কৃষি সঞ্চালকালয়, অসম (Directorate of Agriculture)',
    authority_en: 'Directorate of Agriculture, Assam',
    benefit_as: 'পাৱাৰ টিলাৰ, ট্ৰেক্টৰ, ৰীপাৰ আৰু ৰ’টাভেটৰ ক্ৰয়ৰ বাবে ৫০% ৰ পৰা ৮০% লৈ চৰকাৰী ৰাজসাহায্য বা কাষ্টম হাইৰিং কেন্দ্ৰ স্থাপন।',
    benefit_en: '50% to 80% subsidy on Power Tillers, Tractors, Mini-Harvesters, and establishment of Custom Hiring Centers (CHCs).',
    badge_as: 'যন্ত্ৰপাতি অনুদান',
    badge_en: 'Machinery Subsidy',
    action_link: 'https://agrimachinery.nic.in',
    action_label_as: 'যন্ত্ৰ অনুদান প’ৰ্টেল',
    action_label_en: 'Agri Machinery'
  },
  {
    item_key: 'kvk_charaideo_advisory',
    category: 'advisory',
    title_as: 'কৃষি বিজ্ঞান কেন্দ্ৰ (KVK চৰাইদেউ) সাময়িক শস্য পৰামৰ্শ',
    title_en: 'Krishi Vigyan Kendra (KVK Charaideo) Seasonal Agro-Advisory',
    authority_as: 'অসম কৃষি বিশ্ববিদ্যালয় (AAU) / KVK চৰাইদেউ',
    authority_en: 'Assam Agricultural University / KVK Charaideo Hub',
    benefit_as: 'মাজফোৰা পোক আৰু ব্লাষ্ট ৰোগ প্ৰতিৰোধৰ বাবে অনুমোদিত ঔষধৰ স্প্ৰে’ আৰু মাটি পৰীক্ষা (Soil Health Card)ৰ সুবিধা।',
    benefit_en: 'Stem borer & leaf blast control protocols for Upper Assam riverine paddy belts, Soil Health Card testing at KVK.',
    badge_as: 'পথাৰৰ পৰামৰ্শ',
    badge_en: 'Crop Health',
    action_link: 'http://kvkcharaideo.aau.ac.in',
    action_label_as: 'KVK পৰামৰ্শ প’ৰ্টেল',
    action_label_en: 'KVK Advisory'
  }
];

async function masterAutonomousSync() {
  const todayIso = new Date().toISOString().split('T')[0];
  console.log(`\n======================================================`);
  console.log(`🤖 48-HOUR AUTONOMOUS MASTER SYNC: ${todayIso}`);
  console.log(`======================================================\n`);

  // 1. AUTO-WIPE EXPIRED RECORDS (Past Deadline)
  console.log('🧹 [1/4 Auto-Wipe]: Purging expired listings across tables...');
  await supabase.from('scholarships').delete().lt('deadline', todayIso);
  await supabase.from('entrance_exams').delete().lt('deadline', todayIso);
  await supabase.from('opportunities').delete().lt('deadline', todayIso);
  console.log('✅ Expired programs wiped clean.');

  // 2. SCHOLARSHIPS
  console.log('\n📚 [2/4 Scholarships]: Syncing & Auto-Publishing...');
  for (const s of SCHOLARSHIPS_FEED) {
    if (s.deadline >= todayIso) {
      const { data: existing } = await supabase
        .from('scholarships')
        .select('id')
        .eq('title_en', s.title_en)
        .maybeSingle();

      if (!existing) {
        await supabase.from('scholarships').insert([{
          ...s,
          is_approved: true,
          source_type: 'automated_official_feed'
        }]);
        console.log(`  🌟 [Scholarship Added]: ${s.title_en}`);
      }
    }
  }

  // 3. EXAMS & JOBS / SELF-EMPLOYMENT
  console.log('\n📝 [3/4 Exams & Jobs]: Syncing & Auto-Publishing...');
  for (const e of EXAMS_FEED) {
    if (e.deadline >= todayIso) {
      const { data: existing } = await supabase
        .from('entrance_exams')
        .select('id')
        .eq('exam_name_en', e.exam_name_en)
        .maybeSingle();

      if (!existing) {
        await supabase.from('entrance_exams').insert([{
          ...e,
          is_approved: true,
          source_type: 'automated_public_feed'
        }]);
        console.log(`  🌟 [Exam Added]: ${e.exam_name_en}`);
      }
    }
  }

  for (const j of OPPORTUNITIES_FEED) {
    if (j.deadline >= todayIso) {
      const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title_en', j.title_en)
        .maybeSingle();

      if (!existing) {
        await supabase.from('opportunities').insert([{
          title: j.title_en,
          ...j,
          is_approved: true,
          created_at: new Date().toISOString()
        }]);
        console.log(`  🌟 [Opportunity Added]: ${j.title_en}`);
      }
    }
  }

  // 4. AGRICULTURE & FARMERS FEEDS
  console.log('\n🌾 [4/4 Agriculture]: Syncing Agriculture Feeds...');
  for (const item of AGRI_FEED) {
    const { data: existing } = await supabase
      .from('agriculture_feeds')
      .select('id')
      .eq('item_key', item.item_key)
      .maybeSingle();

    if (!existing) {
      await supabase.from('agriculture_feeds').insert([{
        ...item,
        is_active: true
      }]);
      console.log(`  🌟 [Agri Created]: ${item.title_en}`);
    } else {
      await supabase.from('agriculture_feeds').update({
        ...item,
        updated_at: new Date().toISOString()
      }).eq('item_key', item.item_key);
      console.log(`  🔄 [Agri Synced]: ${item.title_en}`);
    }
  }

  console.log(`\n🎉 Master Sync Completed Successfully! All portal hubs are live and updated.\n`);
}

masterAutonomousSync();
