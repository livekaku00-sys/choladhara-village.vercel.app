import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  UserMinus, 
  Info, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [lang, setLang] = useState<'as' | 'en'>('as');

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      {/* ১. মূল তথ্যৰ অংশ (Main Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* স্তম্ভ ১: প’ৰ্টেলৰ বিষয়ে */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full inline-block"></span>
              প’ৰ্টেলৰ বিষয়ে
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              চোলাধৰা গ্ৰাম্য সেৱা আৰু তথ্য প’ৰ্টেল হৈছে স্থানীয় যুৱ স্বেচ্ছাসেৱকসকলৰ দ্বাৰা পৰিচালিত এক স্বতন্ত্ৰ ডিজিটেল তথ্য কেন্দ্ৰ।
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>চোলাধৰা, চৰাইদেউ, অসম - ৭৮৫৬৮৬</span>
            </div>
          </div>

          {/* স্তম্ভ ২: জৰুৰী যোগাযোগ */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-rose-500" />
              জৰুৰী যোগাযোগ
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">এম্বুলেন্স সেৱা:</span>
                <a href="tel:108" className="font-bold text-rose-400 hover:text-rose-300 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">108</a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">আৰক্ষী / জৰুৰীকালীন:</span>
                <a href="tel:112" className="font-bold text-blue-400 hover:text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40">112</a>
              </li>
              <li className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-xs">জিলা নিয়ন্ত্ৰণ কক্ষ:</span>
                <div className="flex gap-1.5 font-bold text-amber-400 text-xs">
                  <a href="tel:1077" className="hover:underline">1077</a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:03772252000" className="hover:underline">03772-252000</a>
                </div>
              </li>
            </ul>
          </div>

          {/* স্তম্ভ ৩: স্বেচ্ছাসেৱকৰ যোগাযোগ */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Mail className="w-4 h-4 text-sky-400" />
              স্বেচ্ছাসেৱকৰ যোগাযোগ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              তালিকাত তথ্য অন্তৰ্ভুক্ত কৰিবলৈ অথবা যিকোনো ভুল তথ্য শুধৰণিৰ বাবে যোগাযোগ কৰক:
            </p>
            <a 
              href="mailto:choladhara.village@gmail.com" 
              className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 p-2 rounded-lg break-all font-medium transition hover:border-sky-700"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              choladhara.village@gmail.com
            </a>
          </div>

          {/* স্তম্ভ ৪: কেৱল ১টা মাত্ৰ বুটাম (প্ৰত্যাহাৰৰ অনুৰোধ প্ৰপত্ৰ) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <UserMinus className="w-4 h-4 text-rose-400" />
              প্ৰপত্ৰ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              প’ৰ্টেলৰ তালিকাৰ পৰা কোনো কাৰিকৰ বা ব্যক্তিৰ নাম আঁতৰাবৰ বাবে তলৰ বুটামটোত ক্লিক কৰক:
            </p>
            <a
              href="mailto:choladhara.village@gmail.com?subject=কাৰিকৰ%20বা%20নাম%20প্ৰত্যাহাৰৰ%20অনুৰোধ%20প্ৰপত্ৰ"
              className="w-full inline-flex items-center justify-between px-3 py-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-xs font-medium text-rose-300 hover:text-rose-200 transition group shadow-sm"
            >
              <span className="flex items-center gap-2">
                <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                কাৰিকৰ নাম প্ৰত্যাহাৰৰ অনুৰোধ প্ৰপত্ৰ
              </span>
              <span className="text-rose-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

        </div>
      </div>

      {/* ২. আইনী অস্বীকৃতি আৰু চৰ্তসমূহ (Legal Disclaimer Section) */}
      <div className="w-full bg-slate-900/70 border-t border-b border-slate-800/80 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>
                {lang === 'as' ? 'আইনী অস্বীকৃতি আৰু ব্যৱহাৰৰ চৰ্তসমূহ' : 'Legal Disclaimer & Terms of Service'}
              </span>
            </div>

            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setLang('as')}
                className={`px-2.5 py-0.5 rounded font-medium transition ${
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
                className={`px-2.5 py-0.5 rounded font-medium transition ${
                  lang === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {lang === 'as' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400 leading-relaxed">
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  ১. অনা-চৰকাৰী সমাজ সেৱা
                </span>
                <p>এই পৰ্টেলটো সমাজ কল্যাণ আৰু নিযুক্তিৰ তথ্য যোগানৰ এক স্বতন্ত্ৰ সেৱা। ই কোনো চৰকাৰী বিভাগ নহয়।</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ২. তথ্যৰ চৰকাৰী উৎস
                </span>
                <p>সকলো জাননী আনুষ্ঠানিক চৰকাৰী পৰ্টেল (.gov.in / .nic.in) পৰা সংগ্ৰহ কৰা। মূল বিজ্ঞাপন পৰীক্ষা কৰিবলৈ অনুৰোধ জনোৱা হ’ল।</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  ৩. কোনো মাচুল লোৱা নহয়
                </span>
                <p>পৰ্টেলৰ দ্বাৰা কোনো পঞ্জীয়ন ধন লোৱা নহয়। প্ৰাৰ্থীয়ে আবেদন কৰিবলৈ চৰকাৰী মূল লিংকহে ব্যৱহাৰ কৰিব লাগে।</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400 leading-relaxed">
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  1. Non-Government Initiative
                </span>
                <p>Independent community portal built for public awareness. Not affiliated with any govt authority.</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. Official Sourcing
                </span>
                <p>Recruitment data aggregated from verified .gov.in/.nic.in notice boards for public dissemination.</p>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/50 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  3. Zero Charges
                </span>
                <p>We do not collect application fees. All application buttons redirect to authentic government websites.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ৩. কপিৰাইট আৰু ক্ৰেডিট বাৰ (Copyright Bottom Bar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p className="text-center sm:text-left">
          © 2026 চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল। | গাঁৱৰ যুৱসমাজৰ দ্বাৰা নিৰ্মিত
        </p>
        <p className="text-slate-400">
          তথ্য প্ৰযুক্তি আইন, ২০০০ অনুসৰি নিৰ্মিত
        </p>
      </div>

    </footer>
  );
};

export default Footer;
