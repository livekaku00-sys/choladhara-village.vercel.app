import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Clock,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { EntranceExam } from '../types/database';

export const ExamsSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [exams, setExams] = useState<EntranceExam[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchActiveExams = async () => {
      const todayIso = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('entrance_exams')
        .select('*')
        .eq('is_approved', true)
        .gte('deadline', todayIso)
        .order('deadline', { ascending: true });

      if (data && !error) {
        setExams(data);
      }
    };

    fetchActiveExams();
  }, []);

  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const filteredExams = selectedCategory === 'ALL'
    ? exams
    : exams.filter(e => e.category === selectedCategory);

  return (
    <section id="sec-entrance-exams" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm scroll-mt-20">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAs ? 'প্ৰৱেশ পৰীক্ষা আৰু প্ৰতিযোগিতামূলক জাননী' : 'Entrance & Competitive Exam Notifications'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAs ? 'চিকিৎসা, অভিযান্ত্ৰিক, বিশ্ববিদ্যালয় আৰু প্ৰতিৰক্ষা বাহিনীৰ নামভৰ্তিৰ খতিয়ান' : 'Official entrance examinations for Medical, Engineering, Universities & Defense'}
            </p>
          </div>
        </div>

        <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAs ? 'পৰীক্ষিত চৰকাৰী প্ৰৱেশিকা' : 'Official Portal Directory'}</span>
        </span>
      </div>

      {/* Safe-Harbor Legal Disclaimer */}
      <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isAs ? 'দাবী অস্বীকাৰ (Safe-Harbor Notice):' : 'Legal Disclaimer & Outbound Routing:'}</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          {isAs 
            ? 'পৰীক্ষাৰ সকলো তথ্য ৰাজহুৱা বিভাগীয় ৱেবছাইটৰ পৰা সংগ্ৰহ কৰা হৈছে। এই ৱেবছাইটত কোনো আবেদন গ্ৰহণ বা মাচুল লোৱা নহয়। পঞ্জীয়ন আৰু নামভৰ্তিৰ বাবে চৰকাৰী মূল প’ৰ্টেল ব্যৱহাৰ কৰক।' 
            : 'All exam notifications are gathered strictly for citizen awareness. This portal does not conduct exams or charge application fees. Always apply directly on official government servers.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs font-semibold">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {[
          { key: 'ALL', en: 'All Exams', as: 'সকলো পৰীক্ষা' },
          { key: 'medical', en: 'Medical (NEET/Nursing)', as: 'চিকিৎসা বিজ্ঞান' },
          { key: 'engineering', en: 'Engineering (JEE/PAT)', as: 'অভিযান্ত্ৰিক' },
          { key: 'assam_state', en: 'Assam State CEE', as: 'অসম ৰাজ্যিক পৰীক্ষা' },
          { key: 'university', en: 'University (CUET)', as: 'বিশ্ববিদ্যালয়' },
          { key: 'agriculture', en: 'Agriculture (AAU)', as: 'কৃষি ও পশুচিকিৎসা' },
          { key: 'defense', en: 'Defense (NDA/UPSC)', as: 'প্ৰতিৰক্ষা বাহিনী' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
              selectedCategory === cat.key 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isAs ? cat.as : cat.en}
          </button>
        ))}
      </div>

      {/* Grid of Verified Read-Only Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.length > 0 ? (
          filteredExams.map((e) => {
            const daysLeft = getDaysRemaining(e.deadline);
            const isClosingSoon = daysLeft <= 10;

            return (
              <div 
                key={e.id} 
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between transition hover:shadow-md hover:bg-white hover:border-blue-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-100/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-700" />
                      <span>{e.conducting_body}</span>
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
                    {isAs ? e.exam_name_as : e.exam_name_en}
                  </h4>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>{isAs ? 'প্ৰয়োজনীয় অৰ্হতা:' : 'Eligibility:'}</strong> {isAs ? e.eligibility_as : e.eligibility_en}
                  </p>

                  {e.exam_date && (
                    <div className="mt-2 text-xs text-slate-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isAs ? 'পৰীক্ষাৰ সম্ভাৱ্য তাৰিখ:' : 'Tentative Exam Date:'}</span>
                      <strong className="text-slate-900">{e.exam_date}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isAs ? `আবেদনৰ অন্তিম তাৰিখ: ${e.deadline}` : `Apply by: ${e.deadline}`}
                  </span>

                  <a 
                    href={e.apply_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                    title={isAs ? 'চৰকাৰী পৰীক্ষা প’ৰ্টেললৈ যাওক' : 'Open official testing agency portal'}
                  >
                    <span>{isAs ? 'পৰীক্ষা প’ৰ্টেল' : 'Official Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {isAs ? 'বৰ্তমান এই বিভাগত কোনো সক্ৰিয় প্ৰৱেশ পৰীক্ষাৰ জাননী নাই।' : 'No active entrance examination notifications in this category.'}
          </div>
        )}
      </div>

    </section>
  );
};
