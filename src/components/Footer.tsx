import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  UserMinus, 
  Info, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [lang, setLang] = useState<'as' | 'en'>('as');

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      
      {/* ১. মূল যোগাযোগ আৰু গাঁৱৰ তথ্য */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* স্তম্ভ ১ */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full inline-block"></span>
              প’ৰ্টেলৰ বিষয়ে (About Portal)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              চোলাধৰা গ্ৰাম্য সেৱা আৰু তথ্য প’ৰ্টেল হৈছে স্থানীয় যুৱ স্বেচ্ছাসেৱকসকলৰ দ্বাৰা পৰিচালিত এক স্বতন্ত্ৰ ডিজিটেল তথ্য কেন্দ্ৰ।
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>চোলাধৰা, চৰাইদেউ, অসম - ৭৮৫৬৮৬</span>
            </div>
          </div>

          {/* স্তম্ভ ২ */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-rose-500" />
              জৰুৰী যোগাযোগ (Emergency Contacts)
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">এম্বুলেন্স সেৱা (Ambulance):</span>
                <a href="tel:108" className="font-bold text-rose-400 hover:text-rose-300 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">108</a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">আৰক্ষী / জৰুৰীকালীন (Police):</span>
                <a href="tel:112" className="font-bold text-blue-400 hover:text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40">112</a>
              </li>
              <li className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-xs">চৰাইদেউ জিলা নিয়ন্ত্ৰণ কক্ষ:</span>
                <div className="flex gap-1.5 font-bold text-amber-400 text-xs">
                  <a href="tel:1077" className="hover:underline">1077</a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:03772252000" className="hover:underline">03772-252000</a>
                </div>
              </li>
            </ul>
          </div>

          {/* স্তম্ভ ৩ */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Mail className="w-4 h-4 text-sky-400" />
              স্বেচ্ছাসেৱকৰ যোগাযোগ (Help Desk)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              তালিকাত তথ্য অন্তৰ্ভুক্ত কৰিবলৈ অথবা যিকোনো ভুল তথ্য শুধৰণিৰ বাবে যোগাযোগ কৰক:
            </p>
            <a 
              href="mailto:choladhara.village@gmail.com" 
              className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 bg-sky-950/40 border border-sky-800/40 p-2.5 rounded-lg break-all font-medium transition hover:border-sky-700"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              choladhara.village@gmail.com
            </a>
          </div>

          {/* স্তম্ভ ৪: কেৱল ১টা বুটাম */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <UserMinus className="w-4 h-4 text-rose-400" />
              প্ৰপত্ৰ (Request Form)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              প’ৰ্টেলৰ তালিকাৰ পৰা কোনো কাৰিকৰ বা ব্যক্তিৰ নাম আঁতৰাবৰ বাবে অনুৰোধ জনাওক:
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

      {/* ২. দ্বৈতভাষিক আইনী অস্বীকৃতি আৰু গোপনীয়তা নীতি (Legal Disclaimer & Privacy Strip) */}
      <div className="w-full bg-slate-900 border-t border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>
                {lang === 'as' ? 'আইনী অস্বীকৃতি, গোপনীয়তা নীতি আৰু ব্যৱহাৰৰ চৰ্তসমূহ' : 'Legal Disclaimer, Privacy Policy & Terms of Service'}
              </span>
            </div>

            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setLang('as')}
                className={`px-3 py-1 rounded font-medium transition ${
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
                className={`px-3 py-1 rounded font-medium transition ${
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  ১. অনা-চৰকাৰী সমাজ কল্যাণ সেৱা
                </span>
                <p>
                  এই পৰ্টেলটো সমাজ কল্যাণ আৰু যুৱক-যুৱতীসকলক নিযুক্তিৰ তথ্য যোগান ধৰাৰ এক বিনামূলীয়া স্বতন্ত্ৰ ডিজিটেল তথ্য সেৱা। ই কোনো চৰকাৰী বিভাগ বা আয়োগৰ আনুষ্ঠানিক ৱেবছাইট নহয়।
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ২. তথ্যৰ উৎস আৰু সতৰ্কতা
                </span>
                <p>
                  সকলো তথ্য চৰকাৰী মূল পৰ্টেল (.gov.in / .nic.in) আৰু ৰাজহুৱা বিজ্ঞাপনৰ পৰা সংগ্ৰহ কৰা হৈছে। প্ৰাৰ্থীয়ে আবেদন কৰাৰ পূৰ্বে মূল বিজ্ঞাপন ভালদৰে পৰীক্ষা কৰা উচিত।
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  ৩. কোনো মাচুল বা ধন লোৱা নহয়
                </span>
                <p>
                  এই পৰ্টেলৰ দ্বাৰা কোনো ধৰণৰ পঞ্জীয়ন মাচুল বা ধন লোৱা নহয়। সকলো আবেদন লিংক চৰকাৰী ৱেবছাইটলৈ প্ৰেৰণ কৰা হয়। কোনো ভুৱা ব্যক্তিক ধন নিদিব।
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  1. Independent Welfare Initiative
                </span>
                <p>
                  This portal is a community-driven initiative created solely for public awareness and youth guidance. It is not affiliated with any government agency.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. Official Sourcing & Fair Use
                </span>
                <p>
                  All notices are aggregated directly from public government bulletin boards (.gov.in / .nic.in). Users must verify eligibility on the authentic authority portals.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  3. Zero Financial Transactions
                </span>
                <p>
                  We never charge application fees or collect banking data. All application buttons redirect to official portals. Beware of fraudulent recruitment agents.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ৩. কপিৰাইট বাৰ */}
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
