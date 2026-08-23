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
        
        {/* Top Section: Village Branding & Official Government Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between border-b border-slate-800/60 pb-8">
          
          {/* Village Information */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xl">🌾</span>
              <h3 className="text-white font-bold text-base">
                {isAs ? 'চোলাধৰা গ্ৰাম্য ডিজিটেল সেৱা প’ৰ্টেল' : 'Choladhara Digital Village Portal'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              {isAs 
                ? 'নাজিৰা / টেঙাপুখুৰী অঞ্চলৰ প্ৰমাণিত তথ্য, নিযুক্তি আৰু কাৰিকৰ ডাইৰেক্টৰী।'
                : 'Verified public notices, recruitment updates, and local artisan directory.'}
            </p>
          </div>

          {/* External Quick Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-xs font-semibold">
            <a 
              href="https://assam.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              <span>Govt. of Assam</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://sebaonline.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              <span>SEBA / AHSEC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://slprbassam.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              <span>SLPRB Assam</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright on Left, Initiative in Center, Admin Lock on Right */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Choladhara Village. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Public Service Initiative</span>
          </div>

          {/* Admin Login Lock Button (Bottom Right) */}
          <div className="flex items-center">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition active:scale-95 group shadow-sm"
              title={isAs ? 'প্ৰশাসক প্ৰৱেশ (Admin Login)' : 'Admin Login'}
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
              <span className="text-[11px]">{isAs ? 'প্ৰশাসক' : 'Admin'}</span>
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
