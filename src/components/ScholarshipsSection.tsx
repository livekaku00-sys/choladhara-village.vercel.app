import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Coins
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Scholarship } from '../types/database';

export const ScholarshipsSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const todayIso = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('scholarships')
          .select('*')
          .eq('is_approved', true)
          .gte('deadline', todayIso)
          .order('deadline', { ascending: true });

        if (data && !error) {
          setScholarships(data);
        }
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      }
    };

    fetchScholarships();
  }, []);

  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <section id="sec-scholarships-exams" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAs ? 'সক্ৰিয় ছাত্ৰবৃত্তি আৰু আৰ্থিক সাহাৰ্য হাব' : 'Scholarships & Educational Grants'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAs ? 'বিদ্যালয় আৰু মহাবিদ্যালয়ৰ ছাত্ৰ-ছাত্ৰীৰ বাবে চৰকাৰী অনুদান' : 'Central, State & CSR scholarship schemes'}
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAs ? 'পৰীক্ষিত চৰকাৰী আঁচনি' : 'Verified Schemes'}</span>
        </span>
      </div>

      <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isAs ? 'সতৰ্কবাৰ্তা আৰু নিৰাপদ আবেদন (Safe Harbor Notice):' : 'Official Application Notice:'}</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          {isAs 
            ? 'সকলো ছাত্ৰবৃত্তিৰ আবেদন কেৱল ৰাষ্ট্ৰীয় ছাত্ৰবৃত্তি প’ৰ্টেল (NSP) অথবা চৰকাৰী মূল প’ৰ্টেলৰ জৰিয়তেহে কৰিব লাগিব।' 
            : 'All scholarships must be applied through National Scholarship Portal (NSP) or official department portals.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scholarships.length > 0 ? (
          scholarships.map((s) => {
            const daysLeft = getDaysRemaining(s.deadline);
            const isClosingSoon = daysLeft <= 10;

            return (
              <div 
                key={s.id} 
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between transition hover:shadow-md hover:bg-white hover:border-emerald-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {s.provider}
                    </span>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isClosingSoon 
                        ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      {isAs ? `${daysLeft} দিন বাকী` : `${daysLeft} days left`}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {isAs ? s.title_as : s.title_en}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>{isAs ? 'যোগ্যতা:' : 'Eligibility:'}</strong> {isAs ? s.eligibility_as : s.eligibility_en}
                  </p>

                  {s.benefit_amount && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s.benefit_amount}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {isAs ? `অন্তিম: ${s.deadline}` : `Deadline: ${s.deadline}`}
                  </span>

                  <a 
                    href={s.apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    <span>{isAs ? 'আবেদন লিংক' : 'Official Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {isAs ? 'বৰ্তমান কোনো সক্ৰিয় ছাত্ৰবৃত্তি পোৱা নগ’ল।' : 'No active scholarship notices found.'}
          </div>
        )}
      </div>
    </section>
  );
};
