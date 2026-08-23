import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-between border-b border-slate-800/60 pb-8">
          
          {/* Village Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl">🌾</span>
              <h3 className="text-white font-bold text-base">
                {isAs ? 'চোলাধৰা গ্ৰাম্য ডিজিটেল সেৱা প’ৰ্টেল' : 'Choladhara Digital Village Portal'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {isAs 
                ? 'নাজিৰা / টেঙাপুখুৰী অঞ্চলৰ প্ৰমাণিত তথ্য, নিযুক্তি আৰু কাৰিকৰ ডাইৰেক্টৰী।'
                : 'Verified public notices, recruitment updates, and local artisan directory.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <a 
              href="https://assam.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>Govt. of Assam</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://sebaonline.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>SEBA / AHSEC</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://slprbassam.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1"
            >
              <span>SLPRB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Admin Login Button */}
          <div className="flex justify-center md:justify-end">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/60 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
              title="প্ৰশাসক নিয়ন্ত্ৰণ কক্ষত প্ৰৱেশ কৰক"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAs ? 'প্ৰশাসক প্ৰৱেশ (Admin Login)' : 'Admin Login'}</span>
            </Link>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Choladhara Village. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Public Service Initiative</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
