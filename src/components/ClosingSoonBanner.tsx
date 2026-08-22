import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

interface UrgentItem {
  id: string | number;
  type: 'scholarship' | 'exam';
  title_as: string;
  title_en: string;
  provider: string;
  deadline: string;
  daysLeft: number;
  apply_link: string;
}

export const ClosingSoonBanner: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [urgentItems, setUrgentItems] = useState<UrgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClosingSoon = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const todayIso = today.toISOString().split('T')[0];

        const targetDate = new Date();
        targetDate.setDate(today.getDate() + 15);
        const targetIso = targetDate.toISOString().split('T')[0];

        const { data: sData } = await supabase
          .from('scholarships')
          .select('id, title_as, title_en, provider, deadline, apply_link')
          .eq('is_approved', true)
          .gte('deadline', todayIso)
          .lte('deadline', targetIso);

        const { data: eData } = await supabase
          .from('entrance_exams')
          .select('id, exam_name_as, exam_name_en, conducting_body, deadline, apply_link')
          .eq('is_approved', true)
          .gte('deadline', todayIso)
          .lte('deadline', targetIso);

        const combined: UrgentItem[] = [];

        if (sData) {
          sData.forEach(s => {
            const diffDays = Math.ceil((new Date(s.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            combined.push({
              id: s.id,
              type: 'scholarship',
              title_as: s.title_as,
              title_en: s.title_en,
              provider: s.provider,
              deadline: s.deadline,
              daysLeft: Math.max(0, diffDays),
              apply_link: s.apply_link
            });
          });
        }

        if (eData) {
          eData.forEach(e => {
            const diffDays = Math.ceil((new Date(e.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            combined.push({
              id: e.id,
              type: 'exam',
              title_as: e.exam_name_as,
              title_en: e.exam_name_en,
              provider: e.conducting_body,
              deadline: e.deadline,
              daysLeft: Math.max(0, diffDays),
              apply_link: e.apply_link
            });
          });
        }

        combined.sort((a, b) => a.daysLeft - b.daysLeft);
        setUrgentItems(combined);
      } catch (err) {
        console.error('Error loading closing soon alert feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClosingSoon();
  }, []);

  if (loading || urgentItems.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden ring-2 ring-red-400/40">
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-white text-red-600 rounded-xl shadow-md animate-bounce">
            <AlertCircle className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base md:text-lg font-black tracking-tight flex items-center gap-2">
              <span>{isAs ? 'অতি জৰুৰী: অন্তিম তাৰিখ সমাগত (১৫ দিনৰ ভিতৰত)' : 'Urgent: Registration Closing Soon (Within 15 Days)'}</span>
            </h3>
            <p className="text-xs text-rose-100 font-medium">
              {isAs ? 'সময়সীমা সমাপ্ত হোৱাৰ পূৰ্বে চৰকাৰী প’ৰ্টেলত আবেদন নিশ্চিত কৰক' : 'Submit applications on official portals before deadline lapses'}
            </p>
          </div>
        </div>

        <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold border border-white/30 flex items-center gap-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>{urgentItems.length} {isAs ? 'টা সুযোগৰ ম্যাদ শেষ হ’ব' : 'Programs Expiring Soon'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
        {urgentItems.map((item) => (
          <div 
            key={`${item.type}-${item.id}`}
            className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between hover:bg-slate-950 transition hover:border-amber-400/50"
          >
            <div>
              <div className="flex justify-between items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-rose-200 border border-white/10 flex items-center gap-1">
                  {item.type === 'scholarship' ? <GraduationCap className="w-3 h-3 text-amber-300" /> : <FileText className="w-3 h-3 text-blue-300" />}
                  <span>{item.type === 'scholarship' ? (isAs ? 'ছাত্ৰবৃত্তি' : 'Scholarship') : (isAs ? 'প্ৰৱেশ পৰীক্ষা' : 'Entrance Exam')}</span>
                </span>

                <span className="text-xs font-black bg-red-500/80 text-white px-2.5 py-0.5 rounded-md border border-red-300 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.daysLeft === 0 
                    ? (isAs ? 'আজি অন্তিম দিন!' : 'Last Day Today!')
                    : (isAs ? `${item.daysLeft} দিন বাকী` : `${item.daysLeft} days left`)}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                {isAs ? item.title_as : item.title_en}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 truncate">
                {item.provider}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-rose-200">
                {isAs ? `অন্তিম: ${item.deadline}` : `Closes: ${item.deadline}`}
              </span>

              <a 
                href={item.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded-lg transition shadow"
              >
                <span>{isAs ? 'আবেদন লিংক' : 'Apply'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
