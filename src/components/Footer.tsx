import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  Bell, 
  Sprout, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Heart,
  ArrowUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const footerLinks = [
    {
      key: 'notices',
      label_as: 'জাননী',
      label_en: 'Notices',
      href: '#sec-notices',
      icon: Bell
    },
    {
      key: 'agriculture',
      label_as: 'কৃষি হাব',
      label_en: 'Agriculture Hub',
      href: '#sec-agriculture',
      icon: Sprout
    },
    {
      key: 'scholarships',
      label_as: 'ছাত্ৰবৃত্তি',
      label_en: 'Scholarships',
      href: '#sec-scholarships',
      icon: GraduationCap
    },
    {
      key: 'opportunities',
      label_as: 'সুযোগ / কেৰিয়াৰ',
      label_en: 'Opportunities',
      href: '#sec-opportunities',
      icon: Briefcase
    },
    {
      key: 'artisans',
      label_as: 'কাৰিকৰ',
      label_en: 'Artisans',
      href: '#sec-artisans',
      icon: Wrench
    }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#' || !href.startsWith('#')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Column 1: Portal Details */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}
                </h3>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAs ? 'ৰাজহুৱা তথ্য & ডিজিটেল সেৱা কেন্দ্ৰ' : 'Public Information & Digital Service Directory'}
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              {isAs
                ? 'চোলাধৰা আৰু সমীপৱৰ্তী অঞ্চলৰ ৰাইজৰ সুবিধাৰ্থে নিযুক্তি, কৃষি তথ্য, ছাত্ৰবৃত্তি আৰু দক্ষ কাৰিকৰৰ সত্যাপিক ডিজিটেল তথ্য কোষ।'
                : 'A dedicated public service directory providing verified notices, agriculture advisories, scholarships, career opportunities, and artisan services.'}
            </p>
          </div>

          {/* Column 2: Exact 5 Footer Section Links */}
          <div className="md:col-span-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAs ? 'প্ৰধান সেৱাসমূহ (Quick Services)' : 'Quick Services & Portals'}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {footerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="inline-flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-950/60 text-emerald-400 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{isAs ? link.label_as : link.label_en}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Scroll to top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}.</span>
            <span className="hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1">
              {isAs ? 'গাঁওবাসীৰ কল্যাণৰ বাবে উৎসৰ্গিত' : 'Dedicated to community empowerment'}
              <Heart className="w-3 h-3 text-red-500 fill-red-500/40" />
            </span>
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-sm"
          >
            <span>{isAs ? 'শীৰ্ষলৈ যাওক' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
