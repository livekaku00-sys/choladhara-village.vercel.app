import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  Building2, 
  Clock,
  Sparkles
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  category: 'all' | '10th' | '12th' | 'graduate' | 'entrance';
  categoryBadge: string;
  department: string;
  deadline: string;
  applyUrl: string;
  description: string;
}

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'pmegp-2026',
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: '10th',
    categoryBadge: '১০ম উত্তীৰ্ণ / সাধাৰণ (General & 10th+)',
    department: 'Ministry of MSME / KVIC',
    deadline: '2026-12-31',
    applyUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    description: 'গ্ৰাম্য উদ্যোগ, পশুপালন, আৰু ক্ষুদ্ৰ কাৰখানা স্থাপনৰ বাবে ৩৫% পৰ্যন্ত ৰাজসাহায্য (Subsidy) যুক্ত চৰকাৰী ঋণ আঁচনি।'
  },
  {
    id: 'pm-vishwakarma-2026',
    title: 'PM Vishwakarma Yojana - Support for Village Artisans & Craftsmen',
    category: '10th',
    categoryBadge: 'কাৰিকৰ / সাধাৰণ (Artisans & 8th/10th)',
    department: 'Ministry of Skill Development & Entrepreneurship',
    deadline: '2026-12-31',
    applyUrl: 'https://pmvishwakarma.gov.in/',
    description: '১৮ বিধ পৰম্পৰাগত কাৰিকৰ (মিস্ত্ৰী, কমাৰ, কুমাৰ, কাঠমিস্ত্ৰী ইত্যাদি)ৰ বাবে বিনামূলীয়া প্ৰশিক্ষণ, ₹১৫,০০০ টুলকিট অনুদান আৰু কম সুতৰ ঋণ।'
  },
  {
    id: 'cmaaa-assam-2026',
    title: "Chief Minister's Atmanirbhar Asom Abhijan (CMAAA 2.0)",
    category: '12th',
    categoryBadge: '১২শ উত্তীৰ্ণ / স্নাতক (12th / Degree)',
    department: 'Govt. of Assam',
    deadline: '2026-11-15',
    applyUrl: 'https://cmaaa.assam.gov.in/',
    description: 'অসমৰ নিবনুৱা যুৱক-যুৱতীসকলক স্ব-নিয়োজন আৰু ব্যৱসায় স্থাপনৰ বাবে ₹২ লাখৰ পৰা ₹৫ লাখ টকাৰ এককালীন সাহায্য আৰু ঋণ।'
  },
  {
    id: 'ssc-gd-2026',
    title: 'SSC GD Constable Recruitment (BSF, CISF, CRPF, Assam Rifles)',
    category: '10th',
    categoryBadge: '১০ম উত্তীৰ্ণ (10th Pass)',
    department: 'Staff Selection Commission (SSC)',
    deadline: '2026-10-14',
    applyUrl: 'https://ssc.gov.in/',
    description: 'কেন্দ্ৰীয় অৰ্ধসামৰিক বাহিনী আৰু অসম ৰাইফলছত কনিষ্টবল পদৰ বাবে সৰ্বভাৰতীয় পৰ্যায়ৰ পোনপটীয়া নিযুক্তি।'
  },
  {
    id: 'slprb-assam-police-2026',
    title: 'Assam Police SLPRB Constable & Sub-Inspector Recruitment',
    category: '12th',
    categoryBadge: '১২শ উত্তীৰ্ণ (12th / HS Pass)',
    department: 'State Level Police Recruitment Board (SLPRB Assam)',
    deadline: '2026-10-30',
    applyUrl: 'https://slprbassam.in/',
    description: 'অসম আৰক্ষীৰ কনিষ্টবল (UB/AB), কমাণ্ডো বেটেলিয়ন আৰু উপ-পৰিদৰ্শক (SI) পদৰ আনুষ্ঠানিক আবেদন পৰ্টেল।'
  },
  {
    id: 'ongc-apprentice-nazira-2026',
    title: 'ONGC Apprentice Engagement (Nazira & Assam Asset)',
    category: 'graduate',
    categoryBadge: 'স্নাতক / ডিপ্লমা / ITI',
    department: 'Oil and Natural Gas Corporation (ONGC Nazira)',
    deadline: '2026-10-25',
    applyUrl: 'https://ongcindia.com/web/eng/career',
    description: 'নাজিৰা আৰু অসম এছেটৰ বিভিন্ন বিভাগত ১ বছৰীয়া পেছাদাৰী প্ৰশিক্ষণ আৰু মাহেকীয়া ষ্টাইপেণ্ডৰ সুবিধা।'
  },
  {
    id: 'ddugky-skill-assam-2026',
    title: 'DDU-GKY Free Residential Skill Training & Placement Drive',
    category: '10th',
    categoryBadge: '১০ম /১২শ উত্তীৰ্ণ (10th & 12th Pass)',
    department: 'Assam State Rural Livelihoods Mission (ASRLMS)',
    deadline: '2026-11-30',
    applyUrl: 'https://asrlms.assam.gov.in/',
    description: 'গ্ৰাম্য যুৱক-যুৱতীসকলৰ বাবে সম্পূৰ্ণ বিনামূলীয়া থকা-খোৱাৰ সুবিধা সহ ঔদ্যোগিক দক্ষতা প্ৰশিক্ষণ আৰু ১০০% সংস্থাপন সহায়তা।'
  },
  {
    id: 'assam-bed-cet-2026',
    title: 'Assam B.Ed Common Entrance Test (GUBEDCET / DUBEDCET)',
    category: 'entrance',
    categoryBadge: 'প্ৰৱেশ পৰীক্ষা (Entrance Exam - B.Ed)',
    department: 'Gauhati & Dibrugarh University',
    deadline: '2026-09-30',
    applyUrl: 'https://dibru.ac.in/',
    description: 'অসমৰ চৰকাৰী আৰু ব্যক্তিগত শিক্ষক প্ৰশিক্ষণ মহাবিদ্যালয়ত ২ বছৰীয়া বি.এড (B.Ed) নামভৰ্তিৰ বাবে বাচনি পৰীক্ষা।'
  },
  {
    id: 'assam-pat-polytechnic-2026',
    title: 'Assam Polytechnic Admission Test (PAT)',
    category: 'entrance',
    categoryBadge: 'প্ৰৱেশ পৰীক্ষা (Polytechnic / Diploma)',
    department: 'Directorate of Technical Education (DTE Assam)',
    deadline: '2026-09-15',
    applyUrl: 'https://dte.assam.gov.in/',
    description: 'অসমৰ ৰাজ্যিক পলিটেকনিক প্ৰতিষ্ঠানসমূহত ৩ বছৰীয়া ইঞ্জিনিয়াৰিং ডিপ্লমা পাঠ্যক্ৰমত নামভৰ্তিৰ প্ৰৱেশ পৰীক্ষা।'
  }
];

export const Opportunities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | '10th' | '12th' | 'graduate' | 'entrance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return OPPORTUNITIES_DATA.filter(item => {
      const matchesTab = activeTab === 'all' || item.category === activeTab;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleShare = (item: Opportunity) => {
    const shareText = `📢 *${item.title}*\n🏢 বিভাগ: ${item.department}\n🎓 অৰ্হতা: ${item.categoryBadge}\n⏳ অন্তিম তাৰিখ: ${item.deadline}\n\n🔗 অফিচিয়েল বিজ্ঞাপন আৰু আবেদন লিংক:\n${item.applyUrl}\n\n🌐 চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল: https://choladhara-village.vercel.app`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* High-Contrast Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>প্ৰমাণিত নিযুক্তি আৰু উচ্চ শিক্ষা পৰ্টেল</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          কেৰিয়াৰ আৰু নিযুক্তি তথ্য কেন্দ্ৰ
        </h2>
        
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-semibold text-emerald-400">
            চাকৰি আৰু পাঠ্যক্ৰম প্ৰৱেশ পৰীক্ষাৰ জাননী
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            অসম আৰু কেন্দ্ৰীয় চৰকাৰৰ শেহতীয়া প্ৰমাণিত জাননী আৰু বি.এড/নিট/পলিটেকনিক প্ৰৱেশৰ সঠিক লিংক
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4 mb-8">
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পদবী, বিভাগ বা আঁচনিৰ নাম সন্ধান কৰক..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-inner"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { key: 'all', label: 'সকলো সুবিধা (All Notices)' },
            { key: '10th', label: '১০ম উত্তীৰ্ণ (10th Pass / Class IV)' },
            { key: '12th', label: '১২শ উত্তীৰ্ণ (12th / HS Pass)' },
            { key: 'graduate', label: 'স্নাতক / ডিগ্ৰী (Graduate / Degree)' },
            { key: 'entrance', label: 'প্ৰৱেশ পৰীক্ষা (Entrance Exams)' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-500'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700">
          <p className="text-sm text-slate-400">আপুনি বিচৰা ধৰণৰ কোনো জাননী পোৱা নগ’ল।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-950/40 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {item.categoryBadge}
                  </span>
                  
                  <div className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.deadline}</span>
                  </div>
                </div>

                {/* Title & Department */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug hover:text-emerald-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{item.department}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2">
                <a
                  href={item.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 hover:shadow-emerald-900/50"
                >
                  <span>মূল বিজ্ঞাপন / আবেদন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleShare(item)}
                  title="হোৱাটছএপত শ্বেয়াৰ কৰক"
                  className="inline-flex items-center justify-center p-2.5 bg-slate-800 hover:bg-emerald-950/60 text-emerald-400 border border-slate-700 hover:border-emerald-700 rounded-lg transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default Opportunities;
