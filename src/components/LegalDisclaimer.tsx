import React, { useState } from 'react';
import { ShieldAlert, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export const LegalDisclaimer: React.FC = () => {
  const [lang, setLang] = useState<'as' | 'en'>('as');

  return (
    <div className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Language Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>
              {lang === 'as' ? 'আইনী অস্বীকৃতি আৰু ব্যৱহাৰৰ চৰ্তসমূহ' : 'Legal Disclaimer & Terms of Service'}
            </span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setLang('as')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                lang === 'as'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              অসমীয়া
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Assamese Version */}
        {lang === 'as' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-400 leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-400" />
                ১. অনা-চৰকাৰী সমাজ সেৱা
              </h4>
              <p>
                এই পৰ্টেলটো সম্পূৰ্ণৰূপে সমাজ কল্যাণ আৰু স্থানীয় যুৱক-যুৱতীসকলক নিযুক্তিৰ তথ্য যোগান ধৰাৰ উদ্দেশ্যে নিৰ্মিত এক বিনামূলীয়া তথ্য সেৱা। এই ৱেবছাইটটো কোনো চৰকাৰী বিভাগ, আয়োগ বা নিযুক্তি প্ৰাধিকৰণৰ আনুষ্ঠানিক পৰ্টেল নহয়।
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ২. তথ্যৰ উৎস আৰু স্বত্বাধিকাৰ
              </h4>
              <p>
                ইয়াত প্ৰকাশিত সকলো নিযুক্তিৰ জাননী কেৱল আনুষ্ঠানিক চৰকাৰী পৰ্টেল (<code className="text-slate-300">.gov.in</code>, <code className="text-slate-300">.nic.in</code>) আৰু ৰাজহুৱা অধিসূচনাৰ পৰা সংগ্ৰহ কৰা হৈছে। প্ৰাৰ্থীসকলক সদায় সংশ্লিষ্ট বিভাগৰ মূল বিজ্ঞাপন পৰীক্ষা কৰিবলৈ পৰামৰ্শ দিয়া হয়।
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-amber-400" />
                ৩. কোনো আৰ্থিক লেনদেন নাই
              </h4>
              <p>
                এই পৰ্টেলৰ দ্বাৰা কোনো ধৰণৰ অনলাইন মাচুল, পঞ্জীয়ন ধন বা প্ৰৱেশ মাচুল লোৱা নহয়। প্ৰাৰ্থীয়ে আবেদন কৰিবলৈ সদায় মূল চৰকাৰী ৱেবছাইটৰ লিংক ব্যৱহাৰ কৰিব লাগে। কোনো ভুৱা ব্যক্তিক ধন নিদিব।
              </p>
            </div>
          </div>
        )}

        {/* English Version */}
        {lang === 'en' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-400 leading-relaxed">
            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4 text-sky-400" />
                1. Non-Government Initiative
              </h4>
              <p>
                This website is an independent community welfare platform designed solely to deliver employment information to rural youth. It is NOT affiliated with, sponsored by, or an official representative of any government ministry or recruiting agency.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2. Data Source & Fair Use
              </h4>
              <p>
                All recruitment notices and examination links are gathered directly from public government notice boards (<code className="text-slate-300">.gov.in</code> / <code className="text-slate-300">.nic.in</code>) under fair use for public dissemination. Users must verify notifications on original authority portals.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-medium flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-amber-400" />
                3. Zero Financial Transactions
              </h4>
              <p>
                This platform never charges fees, processes application forms, or collects personal financial data. All "Apply" buttons route directly to official recruiting portals. Users are cautioned against fraudulent payment demands.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Micro Copy */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} চলাপথাৰ গ্ৰাম্য তথ্য সেৱা পৰ্টেল | Public Information Hub</p>
          <p className="text-slate-400">Compliant with Information Technology Act, 2000 & Fair Use Guidelines.</p>
        </div>

      </div>
    </div>
  );
};

export default LegalDisclaimer;
