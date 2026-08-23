import React, { useEffect, useMemo, useState } from 'react';
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
import { supabase } from '../lib/supabase';

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

interface SupabaseOpportunity {
  id: string | number;

  title?: string | null;
  title_en?: string | null;
  title_as?: string | null;
  title_assamese?: string | null;

  organization?: string | null;

  category?: string | null;
  job_sub_category?: string | null;

  eligibility?: string | null;
  eligibility_en?: string | null;
  eligibility_as?: string | null;
  eligibility_assamese?: string | null;

  description?: string | null;
  description_assamese?: string | null;

  official_notification_url?: string | null;
  official_application_url?: string | null;
  official_link?: string | null;
  apply_url?: string | null;

  deadline?: string | null;
  application_end_date?: string | null;

  is_approved?: boolean | null;
  publication_status?: string | null;
  admin_expired?: boolean | null;

  salary_stipend?: string | null;
  number_of_posts?: number | null;
}

/*
|--------------------------------------------------------------------------
| Category mapping
|--------------------------------------------------------------------------
|
| The existing UI uses:
| all / 10th / 12th / graduate / entrance
|
| Supabase category is a free text field, so we normalize it here.
|
*/

const normalizeCategory = (
  category: string | null | undefined,
  subCategory: string | null | undefined
): Opportunity['category'] => {

  const value = `${category || ''} ${subCategory || ''}`
    .toLowerCase()
    .trim();

  if (
    value.includes('10th') ||
    value.includes('class 10') ||
    value.includes('class10') ||
    value.includes('matric') ||
    value.includes('hs lc') ||
    value.includes('10 pass')
  ) {
    return '10th';
  }

  if (
    value.includes('12th') ||
    value.includes('class 12') ||
    value.includes('class12') ||
    value.includes('higher secondary') ||
    value.includes('hs pass') ||
    value.includes('h.s. pass')
  ) {
    return '12th';
  }

  if (
    value.includes('graduate') ||
    value.includes('graduation') ||
    value.includes('degree') ||
    value.includes('post graduate') ||
    value.includes('pg')
  ) {
    return 'graduate';
  }

  if (
    value.includes('entrance') ||
    value.includes('entrance exam') ||
    value.includes('admission')
  ) {
    return 'entrance';
  }

  return 'all';
};

/*
|--------------------------------------------------------------------------
| Category badges
|--------------------------------------------------------------------------
*/

const getCategoryBadgeAs = (
  category: string | null | undefined,
  subCategory: string | null | undefined
): string => {

  const value = `${category || ''} ${subCategory || ''}`
    .toLowerCase();

  if (
    value.includes('10th') ||
    value.includes('matric') ||
    value.includes('class 10')
  ) {
    return '১০ম উত্তীৰ্ণ';
  }

  if (
    value.includes('12th') ||
    value.includes('higher secondary') ||
    value.includes('hs pass')
  ) {
    return '১২শ উত্তীৰ্ণ';
  }

  if (
    value.includes('graduate') ||
    value.includes('degree') ||
    value.includes('graduation')
  ) {
    return 'স্নাতক / ডিগ্ৰী';
  }

  if (
    value.includes('entrance') ||
    value.includes('admission')
  ) {
    return 'প্ৰৱেশ পৰীক্ষা';
  }

  if (value.includes('training')) {
    return 'দক্ষতা প্ৰশিক্ষণ';
  }

  if (value.includes('self employment')) {
    return 'স্ব-নিয়োজন';
  }

  return 'চাকৰি / সুযোগ';
};

const getCategoryBadgeEn = (
  category: string | null | undefined,
  subCategory: string | null | undefined
): string => {

  const value = `${category || ''} ${subCategory || ''}`
    .toLowerCase();

  if (
    value.includes('10th') ||
    value.includes('matric') ||
    value.includes('class 10')
  ) {
    return '10th Pass';
  }

  if (
    value.includes('12th') ||
    value.includes('higher secondary') ||
    value.includes('hs pass')
  ) {
    return '12th / HS Pass';
  }

  if (
    value.includes('graduate') ||
    value.includes('degree') ||
    value.includes('graduation')
  ) {
    return 'Graduate / Degree';
  }

  if (
    value.includes('entrance') ||
    value.includes('admission')
  ) {
    return 'Entrance Exam';
  }

  if (value.includes('training')) {
    return 'Skill Training';
  }

  if (value.includes('self employment')) {
    return 'Self Employment';
  }

  return 'Job / Opportunity';
};

/*
|--------------------------------------------------------------------------
| Database row → Existing UI model
|--------------------------------------------------------------------------
*/

const mapDatabaseOpportunity = (
  row: SupabaseOpportunity
): Opportunity => {

  const titleAs =
    row.title_as ||
    row.title_assamese ||
    row.title ||
    '';

  const titleEn =
    row.title_en ||
    row.title ||
    titleAs;

  const organization =
    row.organization ||
    '';

  const eligibilityAs =
    row.eligibility_as ||
    row.eligibility_assamese ||
    '';

  const eligibilityEn =
    row.eligibility_en ||
    row.eligibility ||
    eligibilityAs;

  const descriptionAs =
    row.description_assamese ||
    row.eligibility_as ||
    row.eligibility_assamese ||
    '';

  const descriptionEn =
    row.description ||
    row.eligibility_en ||
    row.eligibility ||
    descriptionAs;

  const applyUrl =
    row.apply_url ||
    row.official_application_url ||
    row.official_link ||
    row.official_notification_url ||
    '#';

  const deadline =
    row.deadline ||
    row.application_end_date ||
    '';

  return {
    id: String(row.id),

    title_as: titleAs,
    title_en: titleEn,

    category: normalizeCategory(
      row.category,
      row.job_sub_category
    ),

    categoryBadge_as:
      getCategoryBadgeAs(
        row.category,
        row.job_sub_category
      ),

    categoryBadge_en:
      getCategoryBadgeEn(
        row.category,
        row.job_sub_category
      ),

    department_as: organization,
    department_en: organization,

    deadline,

    applyUrl,

    description_as:
      descriptionAs ||
      eligibilityAs,

    description_en:
      descriptionEn ||
      eligibilityEn
  };
};

export const Opportunities: React.FC = () => {

  /*
  |--------------------------------------------------------------------------
  | EXISTING LANGUAGE SYSTEM
  |--------------------------------------------------------------------------
  */

  const { language } = useLanguage();

  const isAs = language === 'as';

  /*
  |--------------------------------------------------------------------------
  | EXISTING FILTER STATE
  |--------------------------------------------------------------------------
  */

  const [activeTab, setActiveTab] = useState<
    'all' | '10th' | '12th' | 'graduate' | 'entrance'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');

  /*
  |--------------------------------------------------------------------------
  | SUPABASE STATE
  |--------------------------------------------------------------------------
  */

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD REAL DATABASE DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    let cancelled = false;

    const loadOpportunities = async () => {

      setLoading(true);
      setLoadError(false);

      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .order('deadline', {
          ascending: true,
          nullsFirst: false
        });

      if (cancelled) {
        return;
      }

      if (error) {

        console.error(
          'Supabase opportunities error:',
          error
        );

        setOpportunities([]);
        setLoadError(true);

      } else {

        const mapped =
          ((data || []) as SupabaseOpportunity[])
            .map(mapDatabaseOpportunity)
            .filter(item =>
              item.title_as ||
              item.title_en
            );

        setOpportunities(mapped);
      }

      setLoading(false);
    };

    loadOpportunities();

    return () => {
      cancelled = true;
    };

  }, []);

  /*
  |--------------------------------------------------------------------------
  | SEARCH + CATEGORY FILTER
  |--------------------------------------------------------------------------
  */

  const filteredData = useMemo(() => {

    const q =
      searchQuery
        .toLowerCase()
        .trim();

    return opportunities.filter(item => {

      const matchesTab =
        activeTab === 'all' ||
        item.category === activeTab;

      if (!q) {
        return matchesTab;
      }

      const matchesSearch =
        item.title_as
          .toLowerCase()
          .includes(q) ||

        item.title_en
          .toLowerCase()
          .includes(q) ||

        item.department_as
          .toLowerCase()
          .includes(q) ||

        item.department_en
          .toLowerCase()
          .includes(q) ||

        item.description_as
          .toLowerCase()
          .includes(q) ||

        item.description_en
          .toLowerCase()
          .includes(q);

      return (
        matchesTab &&
        matchesSearch
      );
    });

  }, [
    opportunities,
    activeTab,
    searchQuery
  ]);

  /*
  |--------------------------------------------------------------------------
  | DEADLINE CONDITION
  |--------------------------------------------------------------------------
  */

  const isDeadlineUrgent = (
    deadlineStr: string
  ) => {

    if (!deadlineStr) {
      return false;
    }

    const deadline =
      new Date(deadlineStr);

    const now =
      new Date();

    const diffTime =
      deadline.getTime() -
      now.getTime();

    const diffDays =
      Math.ceil(
        diffTime /
        (1000 * 60 * 60 * 24)
      );

    return (
      diffDays <= 7 &&
      diffDays >= 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | WHATSAPP SHARE
  |--------------------------------------------------------------------------
  */

  const handleWhatsAppShare = (
    item: Opportunity
  ) => {

    const title =
      isAs
        ? item.title_as
        : item.title_en;

    const department =
      isAs
        ? item.department_as
        : item.department_en;

    const badge =
      isAs
        ? item.categoryBadge_as
        : item.categoryBadge_en;

    const description =
      isAs
        ? item.description_as
        : item.description_en;

    const text = isAs

      ? `📢 *${title}*

🏢 বিভাগ: ${department}

🎓 অৰ্হতা: ${badge}

📝 ${description}

⏳ অন্তিম তাৰিখ: ${item.deadline || 'উল্লেখ নাই'}

🔗 আবেদন / অফিচিয়েল লিংক:
${item.applyUrl}

🌐 চোলাধৰা গ্ৰাম্য সেৱা প'ৰ্টেল`

      : `📢 *${title}*

🏢 Department: ${department}

🎓 Eligibility: ${badge}

📝 ${description}

⏳ Deadline: ${item.deadline || 'Not specified'}

🔗 Official Application Link:
${item.applyUrl}

🌐 Choladhara Village Portal`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(text)}`;

    const popup =
      window.open(
        whatsappUrl,
        '_blank',
        'noopener,noreferrer'
      );

    if (!popup) {
      window.location.href =
        whatsappUrl;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <section id="sec-opportunities"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >

      <div
        className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden"
      >

        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"
        />

        <div
          className="relative text-center space-y-4 mb-12"
        >

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/80 shadow-lg shadow-emerald-900/20"
          >

            <Sparkles className="w-3.5 h-3.5" />

            <span>
              {isAs
                ? 'প্ৰমাণিত নিযুক্তি আৰু উচ্চ শিক্ষা পৰ্টেল'
                : 'Verified Recruitment & Higher Education Portal'}
            </span>

          </div>

          <h2
            className="relative text-2xl sm:text-4xl font-extrabold text-white tracking-tight pb-3"
          >

            {isAs
              ? 'কেৰিয়াৰ আৰু নিযুক্তি তথ্য কেন্দ্ৰ'
              : 'Career & Employment Opportunities Hub'}

            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full opacity-60"
            />

          </h2>

          <div className="space-y-1">

            <p
              className="text-sm sm:text-base font-bold text-emerald-400 flex items-center justify-center gap-2"
            >

              <Briefcase className="w-4 h-4" />

              {isAs
                ? 'চাকৰি আৰু পাঠ্যক্ৰম প্ৰৱেশ পৰীক্ষাৰ জাননী'
                : 'Jobs & Entrance Exam Notifications'}

            </p>

            <p
              className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >

              {isAs
                ? 'অসম আৰু কেন্দ্ৰীয় চৰকাৰৰ শেহতীয়া প্ৰমাণিত জাননী আৰু বি.এড/নিট/পলিটেকনিক প্ৰৱেশৰ সঠিক লিংক'
                : 'Verified Assam & Central Government notifications with direct links for jobs, training, and entrance tests.'}

            </p>

          </div>

        </div>

        <div
          className="relative space-y-5 mb-10"
        >

          <div
            className="relative max-w-xl mx-auto group"
          >

            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder={
                isAs
                  ? 'পদবী, বিভাগ বা আঁচনিৰ নাম সন্ধান কৰক...'
                  : 'Search designation, department or scheme name...'
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-inner transition-all"
            />

          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-2"
          >

            {[
              {
                key: 'all',
                label_as: 'সকলো সুবিধা (All Notices)',
                label_en: 'All Notices'
              },
              {
                key: '10th',
                label_as: '১০ম উত্তীৰ্ণ (10th Pass / Class IV)',
                label_en: '10th Pass / Class IV'
              },
              {
                key: '12th',
                label_as: '১২শ উত্তীৰ্ণ (12th / HS Pass)',
                label_en: '12th / HS Pass'
              },
              {
                key: 'graduate',
                label_as: 'স্নাতক / ডিগ্ৰী (Graduate / Degree)',
                label_en: 'Graduate / Degree'
              },
              {
                key: 'entrance',
                label_as: 'প্ৰৱেশ পৰীক্ষা (Entrance Exams)',
                label_en: 'Entrance Exams'
              }
            ].map((tab) => (

              <button
                key={tab.key}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.key as
                    | 'all'
                    | '10th'
                    | '12th'
                    | 'graduate'
                    | 'entrance'
                  )
                }
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 border border-emerald-500 scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-slate-600'
                }`}
              >

                {isAs
                  ? tab.label_as
                  : tab.label_en}

              </button>

            ))}

          </div>

        </div>

        {loading ? (

          <div
            className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 backdrop-blur-sm"
          >

            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/80 mb-4 shadow-inner"
            >

              <Clock
                className="w-8 h-8 text-emerald-500 animate-pulse"
              />

            </div>

            <p
              className="text-base font-semibold text-slate-300 mb-1"
            >
              {isAs
                ? 'তথ্য লোড হৈ আছে...'
                : 'Loading opportunities...'}
            </p>

          </div>

        ) : loadError ? (

          <div
            className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-red-800/60 backdrop-blur-sm"
          >

            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/40 mb-4"
            >

              <Clock
                className="w-8 h-8 text-red-400"
              />

            </div>

            <p
              className="text-base font-semibold text-red-300 mb-1"
            >
              {isAs
                ? 'তথ্য লোড কৰাত সমস্যা হৈছে'
                : 'Unable to load opportunities'}
            </p>

            <p
              className="text-sm text-slate-500 max-w-md mx-auto"
            >
              {isAs
                ? 'অনুগ্ৰহ কৰি পিছত পুনৰ চেষ্টা কৰক।'
                : 'Please try again later.'}
            </p>

          </div>

        ) : filteredData.length === 0 ? (

          <div
            className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 backdrop-blur-sm"
          >

            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/80 mb-4 shadow-inner"
            >

              <Search
                className="w-8 h-8 text-slate-500"
              />

            </div>

            <p
              className="text-base font-semibold text-slate-300 mb-1"
            >

              {isAs
                ? 'কোনো ফলাফল পোৱা নগ’ল'
                : 'No Results Found'}

            </p>

            <p
              className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed"
            >

              {isAs
                ? 'আপুনি বিচৰা ধৰণৰ জাননী এতিয়া উপলব্ধ নাই। অনুগ্ৰহ কৰি আন কিৱৰ্ড বা শ্ৰেণী চেষ্টা কৰক।'
                : 'No notifications found matching your search. Please try another keyword or category.'}

            </p>

          </div>

        ) : (

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >

            {filteredData.map((item) => {

              const urgent =
                isDeadlineUrgent(item.deadline);

              const title =
                isAs
                  ? item.title_as
                  : item.title_en;

              const department =
                isAs
                  ? item.department_as
                  : item.department_en;

              const badge =
                isAs
                  ? item.categoryBadge_as
                  : item.categoryBadge_en;

              const description =
                isAs
                  ? item.description_as
                  : item.description_en;

              return (

                <div
                  key={item.id}
                  className="group relative bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col"
                >

                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div
                    className="p-5 space-y-3 flex-1 flex flex-col"
                  >

                    <div
                      className="flex items-start justify-between gap-2"
                    >

                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-md shadow-sm"
                      >

                        <CheckCircle2
                          className="w-3 h-3"
                        />

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
                            urgent
                              ? 'text-red-400'
                              : 'text-amber-400'
                          }`}
                        />

                        <span>
                          {item.deadline || (
                            isAs
                              ? 'উল্লেখ নাই'
                              : 'Not specified'
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="mt-2">

                      <h3
                        className="text-sm sm:text-[15px] font-bold text-white leading-snug group-hover:text-emerald-100 transition-colors line-clamp-2"
                      >
                        {title}
                      </h3>

                      <p
                        className="text-xs text-slate-400 flex items-center gap-1.5 mt-2"
                      >

                        <Building2
                          className="w-3.5 h-3.5 text-slate-500 flex-shrink-0"
                        />

                        <span className="line-clamp-1">
                          {department || (
                            isAs
                              ? 'বিভাগ উল্লেখ নাই'
                              : 'Organization not specified'
                          )}
                        </span>

                      </p>

                    </div>

                    <p
                      className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/50 pt-3 mt-auto line-clamp-3"
                    >
                      {description || (
                        isAs
                          ? 'বিৱৰণ উপলব্ধ নহয়।'
                          : 'Description not available.'
                      )}
                    </p>

                  </div>

                  <div
                    className="p-4 bg-slate-950/80 border-t border-slate-800/60 flex items-center gap-2.5 backdrop-blur-sm"
                  >

                    <a
                      href={item.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98] group/btn"
                    >

                      <span>
                        {isAs
                          ? 'মূল বিজ্ঞাপন / আবেদন'
                          : 'Official Notice / Apply'}
                      </span>

                      <ArrowUpRight
                        className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                      />

                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsAppShare(item)
                      }
                      title={
                        isAs
                          ? 'হোৱাটছএপত শ্বেয়াৰ কৰক'
                          : 'Share on WhatsApp'
                      }
                      aria-label={
                        isAs
                          ? 'হোৱাটছএপত শ্বেয়াৰ কৰক'
                          : 'Share on WhatsApp'
                      }
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

                      <span>
                        {isAs
                          ? 'শ্বেয়াৰ'
                          : 'Share'}
                      </span>

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


