import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Sprout, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Languages, 
  Menu, 
  X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isAs = language === 'as';
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/${id}`;
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    {
      id: '#sec-notices',
      label_as: 'জাননী',
      label_en: 'Notices',
      icon: Bell,
      color: 'text-amber-400'
    },
    {
      id: '#sec-agriculture',
      label_as: 'কৃষি হাব',
      label_en: 'Agri Hub',
      icon: Sprout,
      color: 'text-emerald-400'
    },
    {
      id: '#sec-scholarships',
      label_as: 'ছাত্ৰবৃত্তি',
      label_en: 'Scholarships',
      icon: GraduationCap,
      color: 'text-sky-400'
    },
    {
      id: '#sec-opportunities',
      label_as: 'সুযোগ / কেৰিয়াৰ',
      label_en: 'Opportunities',
      icon: Briefcase,
      color: 'text-purple-400'
    },
    {
      id: '#sec-skilled-workers',
      label_as: 'কাৰিকৰ',
      label_en: 'Artisans',
      icon: Users,
      color: 'text-teal-400'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🌾</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-sm sm:text-base tracking-tight leading-none">
                {isAs ? 'চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল' : 'Choladhara Village Portal'}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Community
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
              {isAs ? 'নাজিৰা / টেঙাপুখুৰী অঞ্চল, চৰাইদেউ' : 'Nazira / Tengapukhuri, Charaideo'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <IconComponent className={`w-3.5 h-3.5 ${link.color}`} />
                <span>{isAs ? link.label_as : link.label_en}</span>
              </button>
            );
          })}
        </nav>

        {/* Language Switcher & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(isAs ? 'en' : 'as')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAs ? 'English' : 'অসমীয়া'}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 flex items-center gap-2.5 text-xs font-semibold"
              >
                <IconComponent className={`w-4 h-4 ${link.color}`} />
                <span>{isAs ? link.label_as : link.label_en}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
