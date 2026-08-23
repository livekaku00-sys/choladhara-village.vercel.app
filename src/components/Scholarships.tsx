import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  IndianRupee,
  Share2,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

export interface ScholarshipRecord {
  id: string | number;
  provider_as?: string;
  provider_en?: string;
  provider?: string;
  title_as?: string;
  title_en?: string;
  title?: string;
  eligibility_as?: string;
  eligibility_en?: string;
  eligibility?: string;
  amount_as?: string;
  amount_en?: string;
  amount?: string;
  deadline?: string;
  apply_url?: string;
  applyUrl?: string;
  badge_as?: string;
  badge_en?: string;
  badge?: string;
  is_active?: boolean;
}

export const Scholarships: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch scholarships dynamically from Supabase
  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .order('deadline', { ascending: true });

        if (error) {
          console.error('Error fetching scholarships:', error);
        } else if (data) {
          setScholarships(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Calculate remaining days dynamically
  const getDaysRemaining = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleShare = (
    title: string,
    provider: string,
    amount: string,
    deadline: string,
    applyUrl: string
  ) => {
    const text = 
      `🎓 *${title}*\n` +
      `🏛️ বিভাগ: ${provider}\n` +
      `💰 আৰ্থিক সাহায্য: ${amount}\n` +
      (deadline ? `⏳ অন্তিম তাৰিখ: ${deadline}\n\n` : '\n') +
      `🔗 আবেদন লিংক:\n${applyUrl}\n\n` +
      `🌐 চোলাধৰা ডিজিটেল গ্ৰাম্য প’ৰ্টেল: https://choladhara-village.vercel.app`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      window.location.href = url;
    }
  };

  return (
    <section id="sec-scholarships" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Decorative Background Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none"></div>

        {/* Section Header */}
        <div className="text-center space-y-3 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAs ? 'পৰীক্ষিত চৰকাৰী আঁচনি' : 'Verified Educational Grants'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAs ? 'সক্ৰিয় ছাত্ৰবৃত্তি আৰু আৰ্থিক সাহাৰ্য হাব' : 'Active Scholarships & Financial Aid Hub'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {isAs 
              ? 'বিদ্যালয় আৰু মহাবিদ্যালয়ৰ ছাত্ৰ-ছাত্ৰীৰ বাবে চৰকাৰী অনুদান আৰু উচ্চ শিক্ষাৰ আৰ্থিক সহায়।' 
              : 'Direct financial assistance and central/state scholarship portals for students.'}
          </p>
        </div>

        {/* Safe Harbor Alert Banner */}
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-amber-300">
              {isAs ? 'সতৰ্কবাৰ্তা আৰু নিৰাপদ আবেদন (Safe Harbor Notice):' : 'Safe Harbor Application Advisory:'}
            </span>
            <p className="text-amber-200/90 leading-relaxed">
              {isAs 
                ? 'সকলো ছাত্ৰবৃত্তিৰ আবেদন কেৱল ৰাষ্ট্ৰীয় ছাত্ৰবৃত্তি প’ৰ্টেল (NSP) অথবা চৰকাৰী মূল প’ৰ্টেলৰ জৰিয়তেহে কৰিব লাগিব। কোনো ব্যক্তিগত মাধ্যম বা দালালক টকা নিদিব।'
                : 'All applications must be submitted exclusively via the official National Scholarship Portal (NSP) or verified authority portals. Never pay fees to unauthorized intermediaries.'}
            </p>
          </div>
        </div>

        {/* Scholarship Content: Loading / Empty / Dynamic List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400">ছাত্ৰবৃত্তিৰ তথ্য সংগ্ৰহ কৰা হৈছে...</p>
          </div>
        ) : scholarships.length === 0 ? (
          <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              {isAs ? 'বৰ্তমান কোনো সক্ৰিয় ছাত্ৰবৃত্তিৰ তথ্য উপলব্ধ নাই।' : 'No active scholarship records found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((item) => {
              const title = isAs ? (item.title_as || item.title || item.title_en || '') : (item.title_en || item.title || item.title_as || '');
              const provider = isAs ? (item.provider_as || item.provider || item.provider_en || '') : (item.provider_en || item.provider || item.provider_as || '');
              const eligibility = isAs ? (item.eligibility_as || item.eligibility || item.eligibility_en || '') : (item.eligibility_en || item.eligibility || item.eligibility_as || '');
              const amount = isAs ? (item.amount_as || item.amount || item.amount_en || '') : (item.amount_en || item.amount || item.amount_as || '');
              const badge = isAs ? (item.badge_as || item.badge || item.badge_en || 'সাধাৰণ') : (item.badge_en || item.badge || item.badge_as || 'General');
              const applyUrl = item.apply_url || item.applyUrl || 'https://scholarships.gov.in/';
              const deadline = item.deadline || '';
              const daysLeft = getDaysRemaining(deadline);

              return (
                <div 
                  key={item.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/30 group"
                >
                  <div className="space-y-3">
                    {/* Badge & Days Left */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
                        {badge}
                      </span>
                      {daysLeft !== null && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{daysLeft} {isAs ? 'দিন বাকী' : 'days left'}</span>
                        </span>
                      )}
                    </div>

                    {provider && (
                      <p className="text-[11px] text-slate-400 font-medium">
                        {provider}
                      </p>
                    )}

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                      {title}
                    </h3>

                    {eligibility && (
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          {isAs ? 'যোগ্যতা:' : 'Eligibility:'}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {eligibility}
                        </p>
                      </div>
                    )}

                    {/* Amount Highlight */}
                    {amount && (
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded-xl">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{amount}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <span>{isAs ? 'আবেদন লিংক' : 'Apply Now'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleShare(title, provider, amount, deadline, applyUrl)}
                      className="p-2.5 bg-slate-800 hover:bg-[#25D366] text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-[#25D366] transition active:scale-95"
                      title={isAs ? 'হোৱাটছএপত শ্বেয়াৰ কৰক' : 'Share on WhatsApp'}
                    >
                      <Share2 className="w-4 h-4" />
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

export default Scholarships;
