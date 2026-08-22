import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Filter,
  Award,
  Coins
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Opportunity } from '../types/database';

export const JobsSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const todayIso = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('is_approved', true)
          .gte('deadline', todayIso)
          .order('deadline', { ascending: true });

        if (data && !error) {
          setJobs(data);
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      }
    };

    fetchActiveJobs();
  }, []);

  const getDaysRemaining = (deadlineStr?: string) => {
    if (!deadlineStr) return null;
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const filteredJobs = selectedCategory === 'ALL'
    ? jobs
    : jobs.filter(j => j.category === selectedCategory);

  return (
    <section id="sec-jobs-opps" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-teal-50 text-teal-700 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAs ? 'চাকৰি, শিক্ষানবিচ আৰু কাৰিকৰী সুযোগ' : 'Jobs, Apprenticeships & Skill Training'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAs ? 'অসম আৰু কেন্দ্ৰীয় চৰকাৰৰ আধিকাৰিক নিযুক্তি আৰু আত্মসংস্থাপনৰ জাননী' : 'Official recruitment notifications & verified self-employment schemes'}
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAs ? 'পৰীক্ষিত চৰকাৰী নিযুক্তি ও অনুদান' : 'Verified Public Schemes'}</span>
        </span>
      </div>

      <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isAs ? 'আইনী স্পষ্টীকৰণ আৰু দাবী অস্বীকাৰ (Legal Disclaimer):' : 'Legal Disclaimer & Direct Routing:'}</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          {isAs 
            ? 'এই প’ৰ্টেলটো কেৱল তথ্য সজাগতাৰ বাবেহে পৰিচালিত। কোনো চাকৰি বা চৰকাৰী অনুদানৰ বাবে কোনো মধ্যভোগীক ধন বা ব্যক্তিগত নথি নিদিব।' 
            : 'This portal is a non-profit community repository. Always apply directly via verified government portals.'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs font-semibold">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {[
          { key: 'ALL', en: 'All Opportunities', as: 'সকলো সুযোগ' },
          { key: 'job', en: 'Govt & PSU Jobs', as: '১. চৰকাৰী চাকৰি' },
          { key: 'training', en: 'Free Skill Training', as: '২. প্ৰশিক্ষণ ও শিক্ষানবিচ' },
          { key: 'self_employment', en: 'Self-Employment & Subsidies', as: '৩. আত্মসংস্থাপন ও ঋণ ৰেহাই' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
              selectedCategory === cat.key 
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isAs ? cat.as : cat.en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((j) => {
            const daysLeft = getDaysRemaining(j.deadline);
            const isClosingSoon = daysLeft !== null && daysLeft <= 10;

            const getCategoryBadge = () => {
              if (j.category === 'self_employment') {
                return {
                  label: isAs ? 'আত্মসংস্থাপন ও অনুদান' : 'Self-Employment & Grant',
                  style: 'bg-amber-100 text-amber-900 border-amber-200',
                  icon: Coins
                };
              }
              if (j.category === 'training') {
                return {
                  label: isAs ? 'বিনামূলীয়া প্ৰশিক্ষণ' : 'Skill Training',
                  style: 'bg-purple-100 text-purple-900 border-purple-200',
                  icon: Award
                };
              }
              return {
                label: isAs ? 'চৰকাৰী চাকৰি' : 'Govt Job',
                style: 'bg-teal-100 text-teal-900 border-teal-200',
                icon: Briefcase
              };
            };

            const badge = getCategoryBadge();
            const BadgeIcon = badge.icon;

            return (
              <div 
                key={j.id} 
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between transition hover:shadow-md hover:bg-white hover:border-teal-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border ${badge.style}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    {daysLeft !== null && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        isClosingSoon 
                          ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {isAs ? `${daysLeft} দিন বাকী` : `${daysLeft} days left`}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {isAs ? j.title_as : j.title_en}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>{isAs ? 'প্ৰয়োজনীয় অৰ্হতা/সুবিধা:' : 'Eligibility / Benefit:'}</strong> {isAs ? j.eligibility_as : j.eligibility_en}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {j.deadline 
                      ? (isAs ? `অন্তিম তাৰিখ: ${j.deadline}` : `Apply by: ${j.deadline}`) 
                      : (isAs ? 'সক্ৰিয় পঞ্জীয়ন' : 'Open Registration')}
                  </span>

                  {j.official_link && (
                    <a 
                      href={j.official_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      <span>{isAs ? 'চৰকাৰী প’ৰ্টেল' : 'Official Portal'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {isAs ? 'বৰ্তমান এই শ্ৰেণীত কোনো সক্ৰিয় জাননী নাই।' : 'No active notices found in this category.'}
          </div>
        )}
      </div>
    </section>
  );
};
