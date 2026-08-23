import React, { useState } from 'react';
import { 
  Building, 
  Globe, 
  Briefcase, 
  Wrench, 
  Menu, 
  X, 
  CheckCircle2,
  Home as HomeIcon,
  Sprout
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const isAs = language === 'as';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      key: 'home',
      label_as: 'প্ৰচ্ছদ',
      label_en: 'Home',
      targetIds: ['root', 'home-top'],
      icon: HomeIcon
    },
    {
      key: 'opportunities',
      label_as: 'সুযোগ / কেৰিয়াৰ',
      label_en: 'Opportunities',
      targetIds: ['sec-opportunities', 'opportunities', 'career'],
      icon: Briefcase
    },
    {
      key: 'artisans',
      label_as: 'কাৰিকৰ',
      label_en: 'Artisans',
      targetIds: ['sec-artisans', 'artisans', 'skilled-workers'],
      icon: Wrench
    },
    {
      key: 'agriculture',
      label_as: 'কৃষি সেৱা',
      label_en: 'Agriculture',
      targetIds: ['sec-agriculture', 'agriculture', 'krishi'],
      icon: Sprout
    }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetIds: string[]) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetIds.includes('root') || targetIds.includes('home-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let targetElement: HTMLElement | null = null;
    for (const id of targetIds) {
      const el = document.getElementById(id);
      if (el) {
        targetElement = el;
        break;
      }
    }

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060d17]/95 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Portal Title */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, ['root'])}
          className="flex items-center gap-3 group select-none"
        >
          <div className="p-2 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-400 group-hover:border-emerald-400 transition-colors">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black text-white tracking-tight block group-hover:text-emerald-300 transition-colors">
              {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {isAs ? 'ৰাজহুৱা তথ্য & ডিজিটেল সেৱা' : 'Public Digital Services'}
            </span>
          </div>
        </a>

        {/* Center: Navigation Pill Container (Matches Screenshot) */}
        <nav className="hidden md:flex items-center gap-6 bg-slate-900/80 px-5 py-2 rounded-2xl border border-slate-800 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={`#${link.targetIds[0]}`}
                onClick={(e) => handleNavClick(e, link.targetIds)}
                className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{isAs ? link.label_as : link.label_en}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Language Toggle Button (Matches Screenshot) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
            title="ভাষা সলনি কৰক / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'as' ? 'English' : 'অসমীয়া'}</span>
          </button>

          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060d17]/98 border-b border-slate-800 px-4 py-3 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={`#${link.targetIds[0]}`}
                onClick={(e) => handleNavClick(e, link.targetIds)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{isAs ? link.label_as : link.label_en}</span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
