import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Shield, 
  FileText, 
  X, 
  AlertTriangle, 
  PhoneCall, 
  Phone 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const emergencyContacts = [
    {
      title_as: 'ৰাষ্ট্ৰীয় জৰুৰীকালীন সেৱা (National Emergency)',
      title_en: 'National Emergency',
      number: '112',
      badge: '24x7',
      color: 'text-rose-400'
    },
    {
      title_as: 'চিকিৎসা আৰু এম্বুলেন্স (Medical & Ambulance)',
      title_en: 'Ambulance & Medical',
      number: '108',
      badge: 'Free',
      color: 'text-emerald-400'
    },
    {
      title_as: 'শিশু হেল্পলাইন (Childline)',
      title_en: 'Childline Helpline',
      number: '1098',
      badge: '24x7',
      color: 'text-sky-400'
    },
    {
      title_as: 'চৰাইদেউ উপায়ুক্ত নিয়ন্ত্ৰণ কক্ষ (DC Control Room)',
      title_en: 'Charaideo DC Control Room',
      number: '1077',
      badge: 'District',
      color: 'text-amber-400'
    },
    {
      title_as: 'মহিলা হেল্পলাইন (Women Helpline)',
      title_en: 'Women Helpline',
      number: '181',
      badge: 'Toll-Free',
      color: 'text-purple-400'
    }
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* 1. Village Branding & Overview */}
          <div className="md:col-span-1 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="text-2xl">🌾</span>
              <div>
                <h3 className="text-white font-black text-base tracking-tight">
                  {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}
                </h3>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  {isAs ? 'নাজিৰা / টেঙাপুখুৰী, চৰাইদেউ' : 'Nazira / Tengapukhuri, Charaideo'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAs 
                ? 'নাজিৰা আৰু টেঙাপুখুৰী অঞ্চলৰ ৰাইজৰ বাবে জৰুৰীকালীন হেল্পলাইন, প্ৰমাণিত জাননী আৰু স্থানীয় কাৰিকৰ সংযোগৰ এটি মুক্ত মঞ্চ।'
                : 'Free community portal providing emergency contacts, verified village notices, and skilled artisan directory.'}
            </p>
          </div>

          {/* 2. Emergency & Civic Helplines (2 Columns wide) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isAs ? 'প্ৰয়োজনীয় জৰুৰীকালীন হেল্পলাইন' : 'Emergency & Essential Helplines'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyContacts.map((item, idx) => (
                <a
                  key={idx}
                  href={`tel:${item.number}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition group shadow-sm"
                >
                  <div className="space-y-0.5 text-left">
                    <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition">
                      {isAs ? item.title_as : item.title_en}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span className={`text-xs font-bold font-mono ${item.color}`}>
                        {item.number}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* 3. Policy & Legal Links */}
          <div className="space-y-3 text-center md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isAs ? 'নীতি আৰু নিৰ্দেশনা' : 'Policies & Terms'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-emerald-400 transition inline-flex items-center gap-1.5 text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isAs ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-emerald-400 transition inline-flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isAs ? 'সেৱাৰ চৰ্তসমূহ (Terms of Use)' : 'Terms of Service'}</span>
                </button>
              </li>
              <li>
                <p className="text-[11px] text-slate-500 leading-tight pt-1">
                  {isAs 
                    ? 'ডাইৰেক্টৰীৰ পৰা নাম আঁতৰাবলৈ "নাম প্ৰত্যাহাৰ" ব্যৱহাৰ কৰক।' 
                    : 'Use "Name Removal" to withdraw artisan contact info.'}
                </p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright | Non-Profit Tag | Discrete Lock Symbol ONLY */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <p>© {new Date().getFullYear()} Choladhara Village Portal. All rights reserved.</p>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Public Service Initiative</span>
          </div>

          {/* DISCRETE LOCK SYMBOL ONLY - text-slate-700 (invisible to visitors) */}
          <Link
            to="/admin"
            className="p-2 rounded-lg text-slate-700 hover:text-slate-500 transition active:scale-90"
            title="Admin Login"
            aria-label="Admin Login"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>

        </div>

      </div>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-200 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                <span>{isAs ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                {isAs 
                  ? '১. এই প’ৰ্টেলত সংগ্ৰহ কৰা কাৰিকৰ তথ্যসমূহ (নাম, ফোন নম্বৰ, অঞ্চল) কেৱল গ্ৰাম্য যোগাযোগ আৰু স্থানীয় সহায়ৰ বাবে প্ৰকাশ কৰা হয়।'
                  : '1. Contact details shared by skilled workers are published solely for community connection and direct voluntary hire.'}
              </p>
              <p>
                {isAs
                  ? '২. কোনো ব্যক্তিৰ ব্যক্তিগত তথ্য বাণিজ্যিক বিজ্ঞাপন বা তৃতীয় পক্ষৰ হাতত বিক্ৰী কৰা নহয়।'
                  : '2. Personal phone numbers and details are never sold or shared with commercial marketers.'}
              </p>
              <p>
                {isAs
                  ? '৩. যিকোনো সময়ত নিজৰ নাম ডাইৰেক্টৰীৰ পৰা আঁতৰাবলৈ "নাম প্ৰত্যাহাৰ" বিকল্প ব্যৱহাৰ কৰিব পাৰে।'
                  : '3. Anyone can request permanent removal of their contact listing anytime.'}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                {isAs ? 'বুজি পালোঁ (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-200 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{isAs ? 'সেৱাৰ চৰ্তসমূহ (Terms of Use)' : 'Terms of Service'}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                {isAs
                  ? '১. এই প’ৰ্টেলটো কেৱল সামাজিক সংযোগ আৰু জনহিতৈষী তথ্যৰ বাবে পৰিচালিত এটা অবাণিজ্যিক উদ্যোগ।'
                  : '1. This portal is an informational, non-commercial public initiative for local community members.'}
              </p>
              <p>
                {isAs
                  ? '২. কাৰিকৰ আৰু গ্ৰাহকৰ মাজত হোৱা ব্যক্তিগত কাম-কাজ বা পাৰিশ্ৰমিক লেনদেনৰ ক্ষেত্ৰত প’ৰ্টেল কোনো ধৰণে দায়বদ্ধ নহয়।'
                  : '2. The directory acts purely as a public contact directory without financial or legal liability for independent work.'}
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
              >
                {isAs ? 'বুজি পালোঁ (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};

export default Footer;
