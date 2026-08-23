import React, { useState } from 'react';
import { 
  Building, 
  Globe, 
  Briefcase, 
  Wrench, 
  Menu, 
  X, 
  ShieldCheck,
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
      href: '#',
      icon: HomeIcon
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
    },
    {
      key: 'agriculture',
      label_as: 'কৃষি সেৱা',
      label_en: 'Agriculture',
      href: '#sec-agriculture',
      icon: Sprout
    }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

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

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Portal Title */}
        <a 
          href="#" 
          onClick={(e) => handleScrollTo(e, '#')}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-105 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black text-white tracking-tight block group-hover:text-emerald-300 transition-colors">
              {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {isAs ? 'ৰাজহুৱা তথ্য & ডিজিটেল সেৱা' : 'Public Digital Services'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAs ? link.label_as : link.label_en}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-emerald-500 text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
            title="ভাষা সলনি কৰক / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'as' ? 'English' : 'অসমীয়া'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-3 space-y-1.5 backdrop-blur-lg animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 border border-transparent hover:border-slate-800 transition"
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
