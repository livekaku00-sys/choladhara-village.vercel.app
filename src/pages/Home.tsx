import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Pin, 
  Calendar, 
  ExternalLink, 
  Loader2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { Notice } from '../types/database';

import { ClosingSoonBanner } from '../components/ClosingSoonBanner';
import { WeatherSection } from '../components/WeatherSection';
import { AgricultureSection } from '../components/AgricultureSection';
import { Scholarships } from '../components/Scholarships';
import { Opportunities } from '../components/Opportunities';
import { SkilledWorkers } from '../components/SkilledWorkers';

export const Home: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState<boolean>(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setNotices(data as Notice[]);
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoadingNotices(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 1. Deadlines Banner */}
      <ClosingSoonBanner />

      {/* 2. Weather & Local Agro Advisory */}
      <WeatherSection />

      {/* 3. Official Notice Board */}
      <section id="sec-notices" className="space-y-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {isAs ? 'ৰাজহুৱা জাননী আৰু চৰকাৰী বাৰ্তা' : 'Official Public Notices & Announcements'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAs ? 'গাঁও পঞ্চায়ত, প্ৰশাসন আৰু স্থানীয় উন্নয়ন সম্পৰ্কীয় শেহতীয়া তথ্য' : 'Latest updates from local administration and panchayat'}
              </p>
            </div>
          </div>
        </div>

        {loadingNotices ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            <p className="text-xs text-slate-400">
              {isAs ? 'জাননীসমূহ লোড কৰা হৈছে...' : 'Loading notices...'}
            </p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
            {isAs ? 'বৰ্তমান কোনো নতুন জাননী উপলব্ধ নাই।' : 'No active announcements at the moment.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => {
              const displayTitle = isAs ? notice.title_as : notice.title_en;
              const displayDetails = isAs ? notice.details_as : notice.details_en;

              return (
                <div
                  key={notice.id}
                  className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between shadow-sm transition hover:border-slate-700 ${
                    notice.is_pinned ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      {notice.is_pinned ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <Pin className="w-3 h-3 text-amber-400" />
                          <span>{isAs ? 'গুৰুত্বপূৰ্ণ' : 'Pinned'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {isAs ? 'জাননী' : 'Notice'}
                        </span>
                      )}

                      {notice.created_at && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{new Date(notice.created_at).toLocaleDateString(isAs ? 'as-IN' : 'en-IN')}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {displayTitle}
                    </h3>

                    {displayDetails && (
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line">
                        {displayDetails}
                      </p>
                    )}
                  </div>

                  {notice.file_url && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                      <a
                        href={notice.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                      >
                        <span>{isAs ? 'নথি / সবিশেষ চাওক' : 'View Document / Details'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Dynamic Agriculture Hub */}
      <div id="sec-agriculture"><AgricultureSection /></div>

      {/* 5. Dynamic Scholarships Hub */}
      <div id="sec-scholarships"><Scholarships /></div>

      {/* 6. Dynamic Opportunities & Careers Hub */}
      <Opportunities />

      {/* 7. Dynamic Artisans & Skilled Workers Directory */}
      <SkilledWorkers />
    </div>
  );
};

export default Home;

