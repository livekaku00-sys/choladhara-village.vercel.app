import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Building2,
  Clock,
  Sparkles,
  Briefcase,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Opportunity {
  id: string;
  title_as: string;
  title_en: string;
  category: 'all' | '10th' | '12th' | 'graduate' | 'entrance';
  categoryBadge_as: string;
  categoryBadge_en: string;
  department_as: string;
  department_en: string;
  deadline: string;
  applyUrl: string;
  description_as: string;
  description_en: string;
}

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'pmegp-2026',
    title_as: "প্ৰধানমন্ত্ৰী নিয়োগ সৃষ্টি কাৰ্যসূচী (PMEGP)",
    title_en: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: '10th',
    categoryBadge_as: '১০ম উত্তীৰ্ণ / সাধাৰণ (General & 10th+)',
    categoryBadge_en: '10th Pass / General (General & 10th+)',
    department_as: 'ক্ষুদ্ৰ আৰু মজলীয়া উদ্যোগ মন্ত্ৰালয় / KVIC',
    department_en: 'Ministry of MSME / KVIC',
    deadline: '2026-12-31',
    applyUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    description_as: 'গ্ৰাম্য উদ্যোগ, পশুপালন, আৰু ক্ষুদ্ৰ কাৰখানা স্থাপনৰ বাবে ৩৫% পৰ্যন্ত ৰাজসাহায্য (Subsidy) যুক্ত চৰকাৰী ঋণ আঁচনি।',
    description_en: 'Government subsidized loan scheme with up to 35% capital subsidy for rural enterprises, livestock, and small manufacturing units.'
  },
  {
    id: 'pm-vishwakarma-2026',
    title_as: 'পিএম বিশ্বকৰ্মা যোজনা - গাঁৱৰ কাৰিকৰ আৰু শিল্পীৰ সাহাৰ্য',
    title_en: 'PM Vishwakarma Yojana - Support for Village Artisans & Craftsmen',
    category: '10th',
    categoryBadge_as: 'কাৰিকৰ / সাধাৰণ (Artisans & 8th/10th)',
    categoryBadge_en: 'Artisans & Craftsmen (8th/10th Pass)',
    department_as: 'দক্ষতা বিকাশ আৰু উদ্যোগ মন্ত্ৰালয়',
    department_en: 'Ministry of Skill Development & Entrepreneurship',
    deadline: '2026-12-31',
    applyUrl: 'https://pmvishwakarma.gov.in/',
    description_as: '১৮ বিধ পৰম্পৰাগত কাৰিকৰ (মিস্ত্ৰী, কমাৰ, কুমাৰ, কাঠমিস্ত্ৰী ইত্যাদি)ৰ বাবে বিনামূলীয়া প্ৰশিক্ষণ, ₹১,০০০ টুলকিট অনুদান আৰু কম সুতৰ ঋণ।',
    description_en: 'Free certified skill training, ₹1,000 daily toolkit grant, and low-interest collateral-free loans for 18 traditional trades.'
  },
  {
    id: 'cmaaa-assam-2026',
    title_as: "মুখ্যমন্ত্ৰীৰ আত্মনিৰ্ভৰ অসম অভিযান (CMAAA 2.0)",
    title_en: "Chief Minister's Atmanirbhar Asom Abhijan (CMAAA 2.0)",
    category: '12th',
    categoryBadge_as: '১২শ উত্তীৰ্ণ / স্নাতক (12th / Degree)',
    categoryBadge_en: '12th / Graduate (12th / Degree)',
    department_as: 'অসম চৰকাৰ (Govt. of Assam)',
    department_en: 'Govt. of Assam',
    deadline: '2026-11-15',
    applyUrl: 'https://cmaaa.assam.gov.in/',
    description_as: 'অসমৰ নিবনুৱা যুৱক-যুৱতীসকলক স্ব-নিয়োজন আৰু ব্যৱসায় স্থাপনৰ বাবে ₹২ লাখৰ পৰা ₹৫ লাখ টকাৰ এককালীন সাহায্য আৰু ঋণ।',
    description_en: 'Financial seed grant of ₹2 Lakh to ₹5 Lakh (combination of government subsidy and low-interest loan) for youth entrepreneurs.'
  },
  {
    id: 'ssc-gd-2026',
    title_as: 'SSC GD কনিষ্টবল নিযুক্তি (BSF, CISF, CRPF, অসম ৰাইফলছ)',
    title_en: 'SSC GD Constable Recruitment (BSF, CISF, CRPF, Assam Rifles)',
    category: '10th',
    categoryBadge_as: '১০ম উত্তীৰ্ণ (10th Pass)',
    categoryBadge_en: '10th Pass (Matriculation)',
    department_as: 'কৰ্মচাৰী বাচনি আয়োগ (SSC)',
    department_en: 'Staff Selection Commission (SSC)',
    deadline: '2026-10-14',
    applyUrl: 'https://ssc.gov.in/',
    description_as: 'কেন্দ্ৰীয় অৰ্ধসামৰিক বাহিনী আৰু অসম ৰাইফলছত কনিষ্টবল পদৰ বাবে সৰ্বভাৰতীয় পৰ্যায়ৰ পোনপটীয়া নিযুক্তি।',
    description_en: 'All-India direct recruitment for General Duty Constable posts across Central Armed Police Forces and Assam Rifles.'
  },
  {
    id: 'slprb-assam-police-2026',
    title_as: 'অসম আৰক্ষী SLPRB কনিষ্টবল আৰু উপ-পৰিদৰ্শক (SI) নিযুক্তি',
    title_en: 'Assam Police SLPRB Constable & Sub-Inspector Recruitment',
    category: '12th',
    categoryBadge_as: '১২শ উত্তীৰ্ণ (12th / HS Pass)',
    categoryBadge_en: '12th / HS Pass (Higher Secondary)',
    department_as: 'ৰাজ্যিক পৰ্যায়ৰ আৰক্ষী নিযুক্তি ব’ৰ্ড (SLPRB Assam)',
    department_en: 'State Level Police Recruitment Board (SLPRB Assam)',
    deadline: '2026-10-30',
    applyUrl: 'https://slprbassam.in/',
    description_as: 'অসম আৰক্ষীৰ কনিষ্টবল (UB/AB), কমাণ্ডো বেটেলিয়ন আৰু উপ-পৰিদৰ্শক (SI) পদৰ আনুষ্ঠানিক আবেদন পৰ্টেল।',
    description_en: 'Official application portal for Assam Police Constable (UB/AB), Commando Battalions, and Sub-Inspector (SI) positions.'
  },
  {
    id: 'ongc-apprentice-nazira-2026',
    title_as: 'ONGC শিক্ষানবিশী প্ৰশিক্ষণ (নাজিৰা আৰু অসম এছেট)',
    title_en: 'ONGC Apprentice Engagement (Nazira & Assam Asset)',
    category: 'graduate',
    categoryBadge_as: 'স্নাতক / ডিপ্লমা / ITI',
    categoryBadge_en: 'Graduate / Diploma / ITI',
    department_as: 'তেল আৰু প্ৰাকৃতিক গেছ নিগম (ONGC Nazira)',
    department_en: 'Oil and Natural Gas Corporation (ONGC Nazira)',
    deadline: '2026-10-25',
    applyUrl: 'https://ongcindia.com/web/eng/career',
    description_as: 'নাজিৰা আৰু অসম এছেটৰ বিভিন্ন বিভাগত ১ বছৰীয়া পেছাদাৰী প্ৰশিক্ষণ আৰু মাহেকীয়া ষ্টাইপেণ্ডৰ সুবিধা।',
    description_en: '1-year certified industrial apprentice training with monthly stipend across technical & trade disciplines at ONGC Assam Asset.'
  },
  {
    id: 'ddugky-skill-assam-2026',
    title_as: 'DDU-GKY বিনামূলীয়া আৱাসিক দক্ষতা প্ৰশিক্ষণ আৰু সংস্থাপন',
    title_en: 'DDU-GKY Free Residential Skill Training & Placement Drive',
    category: '10th',
    categoryBadge_as: '১০ম /১২শ উত্তীৰ্ণ (10th & 12th Pass)',
    categoryBadge_en: '10th & 12th Pass (Youth Skilling)',
    department_as: 'অসম ৰাজ্যিক গ্ৰামীণ জীৱিকা অভিযান (ASRLMS)',
    department_en: 'Assam State Rural Livelihoods Mission (ASRLMS)',
    deadline: '2026-11-30',
    applyUrl: 'https://asrlms.assam.gov.in/',
    description_as: 'গ্ৰাম্য যুৱক-যুৱতীসকলৰ বাবে সম্পূৰ্ণ বিনামূলীয়া থকা-খোৱাৰ সুবিধা সহ ঔদ্যোগিক দক্ষতা প্ৰশিক্ষণ আৰু ১০০% সংস্থাপন সহায়তা।',
    description_en: 'Fully free residential placement-linked skill training with boarding, lodging, and direct job placements for rural youth.'
  },
  {
    id: 'assam-bed-cet-2026',
    title_as: 'অসম বি.এড উমৈহতীয়া প্ৰৱেশ পৰীক্ষা (GUBEDCET / DUBEDCET)',
    title_en: 'Assam B.Ed Common Entrance Test (GUBEDCET / DUBEDCET)',
    category: 'entrance',
    categoryBadge_as: 'প্ৰৱেশ পৰীক্ষা (Entrance Exam - B.Ed)',
    categoryBadge_en: 'Entrance Exam (B.Ed Admission)',
    department_as: 'গুৱাহাটী আৰু ডিব্ৰুগড় বিশ্ববিদ্যালয়',
    department_en: 'Gauhati & Dibrugarh University',
    deadline: '2026-09-30',
    applyUrl: 'https://dibru.ac.in/',
    description_as: 'অসমৰ চৰকাৰী আৰু ব্যক্তিগত শিক্ষক প্ৰশিক্ষণ মহাবিদ্যালয়ত ২ বছৰীয়া বি.এড (B.Ed) নামভৰ্তিৰ বাবে বাচনি পৰীক্ষা।',
    description_en: 'State common entrance test for admission into 2-year B.Ed degree courses across affiliated government & private colleges.'
  },
  {
    id: 'assam-pat-polytechnic-2026',
    title_as: 'অসম পলিটেকনিক নামভৰ্তি পৰীক্ষা (PAT)',
    title_en: 'Assam Polytechnic Admission Test (PAT)',
    category: 'entrance',
    categoryBadge_as: 'প্ৰৱেশ পৰীক্ষা (Polytechnic / Diploma)',
    categoryBadge_en: 'Entrance Exam (Engineering Diploma)',
    department_as: 'কাৰিকৰী শিক্ষা সঞ্চালকালয় (DTE Assam)',
    department_en: 'Directorate of Technical Education (DTE Assam)',
    deadline: '2026-09-15',
    applyUrl: 'https://dte.assam.gov.in/',
    description_as: 'অসমৰ ৰাজ্যিক পলিটেকনিক প্ৰতিষ্ঠানসমূহত ৩ বছৰীয়া ইঞ্জিনিয়াৰিং ডিপ্লমা পাঠ্যক্ৰমত নামভৰ্তিৰ বাবে প্ৰৱেশ পৰীক্ষা।',
    description_en: 'Statewide entrance examination for admission into 3-year Diploma Engineering programs in State Polytechnics of Assam.'
  }
];

export const Opportunities: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [activeTab, setActiveTab] = useState<
    'all' | '10th' | '12th' | 'graduate' | 'entrance'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return OPPORTUNITIES_DATA.filter(item => {
      const matchesTab =
        activeTab === 'all' || item.category === activeTab;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title_as.toLowerCase().includes(q) ||
        item.title_en.toLowerCase().includes(q) ||
        item.department_as.toLowerCase().includes(q) ||
        item.department_en.toLowerCase().includes(q) ||
        item.description_as.toLowerCase().includes(q) ||
        item.description_en.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const isDeadlineUrgent = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const handleWhatsAppShare = (item: Opportunity) => {
    const title = isAs ? item.title_as : item.title_en;
    const dept = isAs ? item.department_as : item.department_en;
    const badge = isAs ? item.categoryBadge_as : item.categoryBadge_en;

    const whatsappText = isAs
      ? `📢 *${title}*\n🏢 বিভাগ: ${dept}\n🎓 অৰ্হতা: ${badge}\n⏳ অন্তিম তাৰিখ: ${item.deadline}\n\n🔗 অফিচিয়েল লিংক:\n${item.applyUrl}\n\n🌐 চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল`
      : `📢 *${title}*\n🏢 Department: ${dept}\n🎓 Eligibility: ${badge}\n⏳ Deadline: ${item.deadline}\n\n🔗 Official Link:\n${item.applyUrl}\n\n🌐 Choladhara Village Portal`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/80 shadow-lg shadow-emerald-900/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAs ? 'প্ৰমাণিত নিযুক্তি আৰু উচ্চ শিক্ষা পৰ্টেল' : 'Verified Recruitment & Higher Education Portal'}</span>
          </div>

          <h2 className="relative text-2xl sm:text-4xl font-extrabold text-white tracking-tight pb-3">
            {isAs ? 'কেৰিয়াৰ আৰু নিযুক্তি তথ্য কেন্দ্ৰ' : 'Career & Employment Opportunities Hub'}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-60"></span>
          </h2>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold text-emerald-400 flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" />
              {isAs ? 'চাকৰি আৰু পাঠ্যক্ৰম প্ৰৱেশ পৰীক্ষাৰ জাননী' : 'Job & Entrance Exam Notifications'}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {isAs
                ? 'অসম আৰু কেন্দ্ৰীয় চৰকাৰৰ শেহতীয়া প্ৰমাণিত জাননী আৰু বি.এড/নিট/পলিটেকনিক প্ৰৱেশৰ সঠিক লিংক'
                : 'Latest verified Assam & Central Govt notifications with direct links for jobs, training, and exams.'}
            </p>
          </div>
        </div>

        <div className="relative space-y-5 mb-10">
          <div className="relative max-w-xl mx-auto group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAs ? 'পদবী, বিভাগ বা আঁচনিৰ নাম সন্ধান কৰক...' : 'Search designation, department, or scheme name...'}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-inner transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { key: 'all', label_as: 'সকলো সুবিধা (All Notices)', label_en: 'All Notices' },
              { key: '10th', label_as: '১০ম উত্তীৰ্ণ (10th Pass / Class IV)', label_en: '10th Pass / Class IV' },
              { key: '12th', label_as: '১২শ উত্তীৰ্ণ (12th / HS Pass)', label_en: '12th / HS Pass' },
              { key: 'graduate', label_as: 'স্নাতক / ডিগ্ৰী (Graduate / Degree)', label_en: 'Graduate / Degree' },
              { key: 'entrance', label_as: 'প্ৰৱেশ পৰীক্ষা (Entrance Exams)', label_en: 'Entrance Exams' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 border border-emerald-500 scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600'
                }`}
              >
                {isAs ? tab.label_as : tab.label_en}
              </button>
            ))}
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/80 mb-4 shadow-inner">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-base font-semibold text-slate-300 mb-1">
              {isAs ? 'কোনো ফলাফল পোৱা নগ’ল' : 'No Results Found'}
            </p>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {isAs
                ? 'আপুনি বিচৰা ধৰণৰ জাননী এতিয়া উপলব্ধ নাই। অনুগ্ৰহ কৰি আন কিৱৰ্ড বা শ্ৰেণী চেষ্টা কৰক।'
                : 'No notifications found matching your search. Please try another keyword or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredData.map((item) => {
              const urgent = isDeadlineUrgent(item.deadline);
              const title = isAs ? item.title_as : item.title_en;
              const dept = isAs ? item.department_as : item.department_en;
              const badge = isAs ? item.categoryBadge_as : item.categoryBadge_en;
              const desc = isAs ? item.description_as : item.description_en;

              return (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-md shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        {badge}
                      </span>

                      <div
                        className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border shadow-sm whitespace-nowrap ${
                          urgent
                            ? 'text-red-300 bg-red-950/60 border-red-800/60 animate-pulse'
                            : 'text-amber-300 bg-amber-950/60 border-amber-800/60'
                        }`}
                      >
                        <Clock
                          className={`w-3 h-3 ${
                            urgent ? 'text-red-400' : 'text-amber-400'
                          }`}
                        />
                        <span>{item.deadline}</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug group-hover:text-emerald-100 transition-colors line-clamp-2">
                        {title}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="line-clamp-1">{dept}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/50 pt-3 mt-auto line-clamp-3">
                      {desc}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-2.5 backdrop-blur-sm">
                    <a
                      href={item.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98] group/btn"
                    >
                      <span>{isAs ? 'মূল বিজ্ঞাপন / আবেদন' : 'Official Notice / Apply'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(item)}
                      title={isAs ? 'হোৱাটছএপত শ্বেয়াৰ কৰক' : 'Share on WhatsApp'}
                      aria-label={isAs ? 'হোৱাটছএপত শ্বেয়াৰ কৰক' : 'Share on WhatsApp'}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl text-xs font-bold shadow-md shadow-green-900/20 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M20.52 3.48A11.78 11.78 0 0 0 12.06 0C5.55 0 .25 5.3.25 11.81c0 2.08.54 4.11 1.56 5.9L.15 24l6.44-1.69a11.77 11.77 0 0 0 5.47 1.35h.01c6.51 0 11.81-5.3 11.81-11.81 0-3.15-1.23-6.11-3.36-8.37ZM12.07 21.67h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.82 1 1.02-3.72-.23-.38a9.82 9.82 0 1 1 8.41 4.68Zm5.39-7.36c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.91 1.12-.17.2-.33.22-.62.07-.29-.15-1.21-.45-2.3-1.42-.85-.76-1.43-1.69-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.49.15-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.64-1.55-.88-2.13-.23-.56-.47-.48-.64-.49h-.54c-.19 0-.5.07-.76.37-.26.29-1 1-.1 2.42.9 1.42 1.73 2.37 3.15 3.33.44.3.98.68 1.67 1.04.69.36 1.29.57 1.73.73.73.23 1.39.2 1.91.12.58-.09 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.54-.34Z" />
                      </svg>
                      <span>{isAs ? 'শ্বেয়াৰ' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Opportunities;
