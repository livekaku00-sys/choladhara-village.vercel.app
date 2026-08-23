import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Briefcase, 
  GraduationCap, 
  ExternalLink, 
  Calendar, 
  Share2, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { supabase } from '../lib/supabase'; // Falls back gracefully if supabase client is exported here

interface Opportunity {
  id: string;
  title_en: string;
  title_as?: string;
  organization: string;
  salary_stipend?: string;
  apply_url: string;
  deadline?: string | null;
  is_approved: boolean;
  created_at?: string;
}

type FilterCategory = 'all' | '10th' | '12th' | 'graduate' | 'entrance';

export const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');

  useEffect(() => {
    fetchApprovedOpportunities();
  }, []);

  const fetchApprovedOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (err) {
      console.error('Error loading opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to deduce qualification badge
  const getBadgeInfo = (item: Opportunity) => {
    const text = `${item.title_en} ${item.title_as || ''} ${item.organization} ${item.salary_stipend || ''}`.toLowerCase();

    if (/entrance|admission|প্ৰৱেশ|b\.ed|bed cet|gubedcet|dubedcet|neet|jee|cuet|cee|pet|pat|nursing|vet|nda|cet/i.test(text)) {
      return { label: 'প্ৰৱেশ পৰীক্ষা (Entrance)', color: 'bg-purple-950/60 text-purple-300 border-purple-800/50' };
    }
    if (/10th|8th|class iv|grade iv|grade-iv|peon|chowkidar|mts|multi tasking|gds|dak sevak|helper|group d/i.test(text)) {
      return { label: '৮ম / ১০ম উত্তীৰ্ণ (10th Pass)', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' };
    }
    if (/12th|hslc|hs pass|higher secondary|chsl|constable|forest guard|jail warder|anm|gnm|polytechnic/i.test(text)) {
      return { label: '১২শ উত্তীৰ্ণ (12th / HS Pass)', color: 'bg-sky-950/60 text-sky-300 border-sky-800/50' };
    }
    if (/graduate|degree|class iii|grade iii|grade-iii|sub-inspector|sub inspector|si |junior assistant|lda|cgl|ntpc|research assistant|master/i.test(text)) {
      return { label: 'স্নাতক / ডিগ্ৰী (Graduate / PG)', color: 'bg-amber-950/60 text-amber-300 border-amber-800/50' };
    }
    return { label: 'সাধাৰণ নিযুক্তি (General)', color: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  // Filter matching logic
  const filteredList = opportunities.filter((item) => {
    const text = `${item.title_en} ${item.title_as || ''} ${item.organization} ${item.salary_stipend || ''}`.toLowerCase();

    // 1. Search Query
    if (searchQuery.trim() && !text.includes(searchQuery.toLowerCase().trim())) {
      return false;
    }

    // 2. Qualification Filter Category
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'entrance') {
      return /entrance|admission|প্ৰৱেশ|b\.ed|bed cet|gubedcet|dubedcet|neet|jee|cuet|cee|pet|pat|nursing|vet|nda|cet/i.test(text);
    }
    if (selectedFilter === '10th') {
      return /10th|8th|class iv|grade iv|grade-iv|peon|chowkidar|mts|multi tasking|gds|dak sevak|helper|group d/i.test(text);
    }
    if (selectedFilter === '12th') {
      return /12th|hslc|hs pass|higher secondary|chsl|constable|forest guard|jail warder|anm|gnm|polytechnic|nda/i.test(text);
    }
    if (selectedFilter === 'graduate') {
      return /graduate|degree|class iii|grade iii|grade-iii|sub-inspector|sub inspector|si |junior assistant|lda|cgl|ntpc|research assistant|master|pg/i.test(text);
    }
    return true;
  });

  const handleShareWhatsApp = (item: Opportunity) => {
    const text = `📢 *${item.title_en}*\n🏛️ ${item.organization}\n💼 ${item.salary_stipend || 'Pay as per official norms'}\n🔗 আবেদন লিংক: ${item.apply_url}\n\nচোলাধৰা গ্ৰাম্য তথ্য সেৱা পৰ্টেলৰ পৰা প্ৰাপ্ত`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filterButtons: { id: FilterCategory; labelAs: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'all', labelAs: 'সকলো সুবিধা', labelEn: 'All Notices', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: '10th', labelAs: '১০ম উত্তীৰ্ণ', labelEn: '10th Pass / Class IV', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: '12th', labelAs: '১২শ উত্তীৰ্ণ (HS)', labelEn: '12th / HS Pass', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'graduate', labelAs: 'স্নাতক / ডিগ্ৰী', labelEn: 'Graduate / Degree', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'entrance', labelAs: 'প্ৰৱেশ পৰীক্ষা', labelEn: 'Entrance Exams', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
          <Briefcase className="w-3.5 h-3.5" />
          <span>কেৰিয়াৰ আৰু নিযুক্তি তথ্য কেন্দ্ৰ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          চাকৰি আৰু পাঠ্যক্ৰম প্ৰৱেশ পৰীক্ষাৰ জাননী
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          অসম আৰু কেন্দ্ৰীয় চৰকাৰৰ শেহতীয়া প্ৰমাণিত জাননী আৰু বি.এড/নিট/পলিটেকনিক প্ৰৱেশৰ সঠিক লিংক
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        
        {/* Search Field */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পদৰ নাম, বিভাগ বা পৰীক্ষা বিচাৰক (e.g., ADRE, B.Ed, Constable, NEET)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Qualification Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {filterButtons.map((btn) => {
            const isActive = selectedFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedFilter(btn.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {btn.icon}
                <span>{btn.labelAs}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({btn.labelEn})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities Card Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs sm:text-sm">তথ্য সংগ্ৰহ কৰি থকা হৈছে...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-14 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 max-w-lg mx-auto space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">কোনো তথ্য পোৱা নগ’ল</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            আপুনি বিচৰা শাখা বা শব্দৰ কোনো সক্ৰিয় বিজ্ঞাপন বৰ্তমান উপলব্ধ নহয়। ফিল্টাৰ সলনি কৰি পুনৰ চেষ্টা কৰক।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const badge = getBadgeInfo(item);
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-sm hover:shadow-md hover:bg-slate-900"
              >
                <div className="space-y-3">
                  
                  {/* Category Badge & Deadline */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.deadline ? item.deadline : 'চৰকাৰী জাননী চাওক'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-2">
                    {item.title_en}
                  </h3>

                  {/* Organization */}
                  <p className="text-xs text-emerald-400 font-medium">
                    {item.organization}
                  </p>

                  {/* Benefits / Pay */}
                  {item.salary_stipend && (
                    <div className="bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                      <span className="text-slate-400 font-normal">সুবিধা / পে-স্কেল: </span>
                      <span className="font-semibold text-slate-200">{item.salary_stipend}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-5 mt-4 border-t border-slate-800/80">
                  <a
                    href={item.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                  >
                    <span>মূল বিজ্ঞাপন / আবেদন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(item)}
                    title="হোৱাটছএপত শ্বেয়াৰ কৰক"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-950/70 border border-slate-700 hover:border-emerald-700 text-slate-300 hover:text-emerald-300 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};

export default Opportunities;
