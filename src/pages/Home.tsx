import { Opportunities } from '../components/Opportunities';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  GraduationCap, 
  Wrench, 
  Phone, 
  Bell, 
   
  UserPlus, 
  UserMinus,
  X, 
  MapPin, 
  Briefcase, 
  AlertCircle,
    MessageSquare,
  ShieldAlert,
      FileText,
  Sparkles,
  ShieldCheck,
  Waves
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WeatherSection } from '../components/WeatherSection';
import { ClosingSoonBanner } from '../components/ClosingSoonBanner';
import { AgricultureSection } from '../components/AgricultureSection';
import { ScholarshipsSection } from '../components/ScholarshipsSection';
import { ExamsSection } from '../components/ExamsSection';
import { JobsSection } from '../components/JobsSection';
import { supabase } from '../lib/supabase';
import type { SkilledWorker, Notice } from '../types/database';

const SKILL_OPTIONS = [
  { value: 'driver_light', en: 'Driver (Car / Auto / Van)', as: 'চালক (চাৰিচকীয়া / অটো / ভ্যান)' },
  { value: 'driver_heavy', en: 'Driver (Truck / Bus / Heavy)', as: 'চালক (ট্ৰাক / বাছ / গধুৰ বাহন)' },
  { value: 'tractor_operator', en: 'Tractor / Power Tiller Operator', as: 'ট্ৰেক্টৰ / পাৱাৰ টিলাৰ চালক' },
  { value: 'jcb_operator', en: 'JCB / Excavator Operator', as: 'জেচিবি (JCB) / খনন অপাৰেটৰ' },
  { value: 'electrician', en: 'Electrician & House Wiring', as: 'ইলেক্ট্ৰিচিয়ান (বিদ্যুৎ মিস্ত্ৰী)' },
  { value: 'plumber', en: 'Plumber & Pipe Fitting', as: 'প্লাম্বাৰ (নল-সংযোগকাৰী)' },
  { value: 'mason', en: 'Mason (Building Construction)', as: 'ৰাজমিস্ত্ৰী (গৃহ নিৰ্মাণ)' },
  { value: 'carpenter', en: 'Carpenter (Wood Work)', as: 'কাঠমিস্ত্ৰী (আচবাব নিৰ্মাণ)' },
  { value: 'welder', en: 'Welder & Grill Fabrication', as: 'ৱেল্ডাৰ / গ্ৰিল ফেব্ৰিকেশ্বন' },
  { value: 'mechanic_2w', en: 'Bike / Scooter Mechanic', as: 'বাইক / স্কুটাৰ মেকানিক' },
  { value: 'mechanic_4w', en: 'Motor Vehicle Mechanic (4W)', as: 'মটৰ মেকানিক (৪-চকীয়া বাহন)' },
  { value: 'painter', en: 'Painter & Wall Putty Worker', as: 'ৰং মিস্ত্ৰী (Painter)' },
  { value: 'tiles_marble', en: 'Tiles & Marble Fitter', as: 'টাইলচ আৰু মাৰ্বল ফিটাৰ' },
  { value: 'tailor', en: 'Tailor & Stitching Expert', as: 'দৰ্জী (চিলাই কাৰিকৰ)' },
  { value: 'cook_catering', en: 'Cook / Event Catering / Halwai', as: 'ৰান্ধনী / কেটাৰিং কাৰিকৰ' },
  { value: 'ac_fridge', en: 'AC, Fridge & Electronics Repair', as: 'এচি আৰু ফ্ৰিজ মেকানিক' },
  { value: 'sound_generator', en: 'Sound System & Generator Operator', as: 'সাউণ্ড আৰু জেনাৰেটৰ অপাৰেটৰ' },
  { value: 'photo_video', en: 'Photographer & Videographer', as: 'ফটোগ্ৰাফাৰ / ভিডিঅ’গ্ৰাফাৰ' },
  { value: 'computer_dtp', en: 'Computer / DTP / Online Services', as: 'কম্পিউটাৰ / অনলাইন সেৱা কাৰিকৰ' },
  { value: 'cctv_security', en: 'CCTV & Inverter Technician', as: 'চিচিটিভি আৰু ইনভাৰ্টাৰ টেকনিচিয়ান' },
  { value: 'other', en: 'Other Skilled Work', as: 'অন্যান্য বিশেষ কাৰিকৰ' }
];

const AREA_OPTIONS = [
  { value: 'Choladhara', en: 'Choladhara (চোলাধৰা)', as: 'চোলাধৰা' },
  { value: 'Tengapukhuri', en: 'Tengapukhuri (টেঙাপুখুৰী)', as: 'টেঙাপুখুৰী' },
  { value: 'Sonari', en: 'Sonari (সোণাৰি)', as: 'সোণাৰি' },
  { value: 'Simaluguri', en: 'Simaluguri (শিমলুগুৰি)', as: 'শিমলুগুৰি' },
  { value: 'Nazira', en: 'Nazira (নাজিৰা)', as: 'নাজিৰা' },
  { value: 'Lakwa', en: 'Lakwa (লাকুৱা)', as: 'লাকুৱা' },
  { value: 'Mathurapur', en: 'Mathurapur (মথুৰাপুৰ)', as: 'মথুৰাপুৰ' },
  { value: 'Borhat', en: 'Borhat (বৰহাট)', as: 'বৰহাট' },
  { value: 'Charaideo_All', en: 'Entire Charaideo Region', as: 'সমগ্ৰ চৰাইদেউ অঞ্চল' }
];

export const Home: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const isAs = language === 'as';
  
  const [workers, setWorkers] = useState<SkilledWorker[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState<boolean>(false);
  const [areaFilter, setAreaFilter] = useState<string>('ALL');

  const [formData, setFormData] = useState({
    full_name: '',
    skill_key: SKILL_OPTIONS[0].value,
    working_area: AREA_OPTIONS[0].value,
    phone_number: '',
    chuburi_ward: ''
  });

  const [removalForm, setRemovalForm] = useState({
    worker_name: '',
    phone_number: '',
    reason: ''
  });

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (data && !error) {
        setNotices(data);
      }
    } catch (err) {
      console.log('Notices error:', err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchNotices();

      try {
        const { data: workersData } = await supabase
          .from('skilled_workers')
          .select('*')
          .eq('is_verified', true)
          .order('full_name', { ascending: true });
        if (workersData) setWorkers(workersData);
      } catch (err) {
        console.log('Worker fetch fallback:', err);
      }
    };

    fetchInitialData();

    const noticeChannel = supabase
      .channel('realtime_notices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        () => {
          fetchNotices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(noticeChannel);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRegisterWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSkill = SKILL_OPTIONS.find(s => s.value === formData.skill_key);

    const payload = {
      full_name: formData.full_name,
      skill_en: selectedSkill?.en || formData.skill_key,
      skill_as: selectedSkill?.as || formData.skill_key,
      phone_number: formData.phone_number,
      chuburi_ward: `${formData.chuburi_ward} (${formData.working_area})`,
      is_verified: false
    };

    const { error } = await supabase.from('skilled_workers').insert([payload]);

    if (error) {
      alert(`Notice: ${error.message}`);
    } else {
      alert(isAs 
        ? 'আপোনাৰ আবেদন সফলতাৰে জমা হ’ল। পৰীক্ষাৰ পাছত প্ৰকাশ পাব।' 
        : 'Application submitted for volunteer review.');
      setIsModalOpen(false);
      setFormData({
        full_name: '',
        skill_key: SKILL_OPTIONS[0].value,
        working_area: AREA_OPTIONS[0].value,
        phone_number: '',
        chuburi_ward: ''
      });
    }
  };

  const handleRemovalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('worker_removal_requests').insert([{
      worker_name: removalForm.worker_name,
      phone_number: removalForm.phone_number,
      reason: removalForm.reason
    }]);

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(isAs 
        ? 'আপোনাৰ নাম প্ৰত্যাহাৰৰ অনুৰোধ এডমিনলৈ প্ৰেৰণ কৰা হ’ল। অতিশীঘ্ৰে ডাইৰেক্টৰিৰ পৰা আঁতৰোৱা হ’ব।' 
        : 'Your removal request has been submitted to the admin.');
      setIsRemovalModalOpen(false);
      setRemovalForm({ worker_name: '', phone_number: '', reason: '' });
    }
  };

  const filteredWorkers = areaFilter === 'ALL' 
    ? workers 
    : workers.filter(w => w.chuburi_ward.toLowerCase().includes(areaFilter.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* Background Ambient Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl opacity-70"></div>
        <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* 1. Sleek Top Status Ticker */}
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs border-b border-slate-800/80 px-4 py-1.5 relative z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-3 overflow-x-auto py-0.5 no-scrollbar">
            <div className="flex items-center gap-2 shrink-0 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-full shadow-inner">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">{isAs ? 'ধানৰ MSP:' : 'Paddy MSP:'}</span>
              <span className="font-bold text-white">₹২,৩০০/কুইণ্টল</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 bg-blue-950/60 text-blue-300 border border-blue-800/50 px-2.5 py-0.5 rounded-full">
              <span className="font-medium">{isAs ? 'নৰেগা মজুৰি:' : 'MGNREGA:'}</span>
              <span className="font-bold text-white">₹২৪৯/দিন</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAs ? 'প্ৰমাণিত চৰকাৰী তথ্য হাব' : '100% Verified Public Hub'}</span>
          </div>

        </div>
      </div>

      {/* 2. Glassmorphic Sticky Header */}
      <header className="bg-slate-900/90 backdrop-blur-md text-white sticky top-0 z-40 border-b border-slate-800/80 shadow-lg shadow-slate-950/5">
        <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-md shadow-emerald-950/40 group-hover:scale-105 transition">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition">
                  {t.siteTitle}
                </h1>
                <span className="hidden md:inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.2 rounded-md">
                  Community Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{t.siteSub}</p>
            </div>
          </Link>

          {/* Nav Links & Language Pill */}
          <nav className="flex items-center gap-1.5 sm:gap-2 flex-wrap" aria-label="Portal Navigation">
            {notices.length > 0 && (
              <button 
                onClick={() => scrollToSection('sec-notifications')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition animate-pulse"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAs ? 'জাননী' : 'Notices'}</span>
                <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {notices.length}
                </span>
              </button>
            )}

            <button 
              onClick={() => scrollToSection('sec-agriculture')}
              className="bg-slate-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAs ? 'কৃষি হাব' : 'Agri'}</span>
            </button>

            <button 
              onClick={() => scrollToSection('sec-scholarships-exams')}
              className="bg-slate-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAs ? 'ছাত্ৰবৃত্তি' : 'Grants'}</span>
            </button>

            <button 
              onClick={() => scrollToSection('sec-entrance-exams')}
              className="bg-slate-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAs ? 'পৰীক্ষা' : 'Exams'}</span>
            </button>

            <button 
              onClick={() => scrollToSection('sec-jobs-opps')}
              className="bg-slate-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAs ? 'নিয়োগ' : 'Jobs'}</span>
            </button>

            <button 
              onClick={() => scrollToSection('sec-skilled-workers')}
              className="bg-slate-800/80 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-700/60 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition"
            >
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              <span>{isAs ? 'কৰ্মী' : 'Workers'}</span>
            </button>

            <div className="flex bg-slate-950/90 p-1 rounded-xl border border-slate-800 ml-1 shadow-inner">
              <button 
                onClick={() => setLanguage('as')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${language === 'as' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                অসমীয়া
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${language === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </nav>

        </div>
      </header>

      {/* 3. Hero Civic Banner */}
      <section className="relative z-10 pt-8 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-800/30 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.communityBadge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                {t.welcomeHeading}
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal pt-1">
                {t.welcomeDesc}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Monsoon Awareness & Road Safety Advisory Card */}
      <section className="px-4 py-2 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg relative group">
                <img 
                  src="WhatsApp Image 2026-08-17 at 7.30.34 PM.jpeg" 
                  alt="Monsoon Waterlogging Archive Photo - Choladhara"
                  className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                  <Waves className="w-3 h-3 text-amber-400" />
                  <span>{isAs ? 'বৰষুণৰ প্ৰভাৱ (Monsoon Record)' : 'Monsoon Record'}</span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAs ? 'গাঁৱৰ বৰষুণ ও পথ সজাগতা' : 'Monsoon Preparedness & Safety'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {isAs 
                    ? 'বৰষুণৰ সময়ত জলমগ্ন পথ আৰু সুৰক্ষা নিৰ্দেশনা' 
                    : 'Monsoon Road Safety & Flood Advisory'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAs 
                    ? 'প্ৰৱল বৰষুণৰ সময়ত চোলাধৰাৰ কিছুমান নিম্নাঞ্চলৰ পথ জলমগ্ন হয়। যাতায়াতৰ সময়ত গাঁৱৰ ৰাইজ তথা পথচাৰীক সাৱধানতা অৱলম্বন কৰিবলৈ অনুৰোধ জনোৱা হ’ল। জৰুৰী প্ৰয়োজনত জিলা নিয়ন্ত্ৰণ কক্ষৰ লগত যোগাযোগ কৰক।' 
                    : 'Heavy rainfall often causes temporary waterlogging in low-lying village pathways across Choladhara. Residents and commuters are advised to exercise caution during monsoon seasons.'}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <a 
                    href="tel:1077" 
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isAs ? 'ডিজাস্টাৰ কণ্ট্ৰোল (1077)' : 'Disaster Helpline (1077)'}</span>
                  </a>

                  <a 
                    href="tel:108" 
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isAs ? 'এম্বুলেন্স (108)' : 'Ambulance (108)'}</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Main Body Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-4 flex-1 w-full space-y-8 relative z-10">
        
        <WeatherSection />

        {notices.length > 0 && (
          <section id="sec-notifications" className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white rounded-3xl p-6 border-2 border-amber-300/80 shadow-md scroll-mt-20 transition-all">
            <div className="flex justify-between items-center mb-4 border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
                  <Bell className="w-5 h-5 animate-bounce" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t.noticesTitle}</h3>
                  <p className="text-xs text-amber-900 font-medium">{isAs ? 'গাঁৱৰ শেহতীয়া জৰুৰী জাননী' : 'Active Community Announcements'}</p>
                </div>
              </div>
              <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-xs">
                {notices.length} {isAs ? 'টা জাননী' : 'Alerts'}
              </span>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 bg-white border-l-4 border-amber-500 rounded-2xl shadow-xs hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{isAs ? n.title_as : n.title_en}</span>
                    </h4>
                    {n.is_pinned && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold shrink-0">
                        {isAs ? 'জৰুৰী' : 'Pinned'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {isAs ? n.details_as : n.details_en}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <ClosingSoonBanner />
        <AgricultureSection />
        <ScholarshipsSection />
        <ExamsSection />
        <JobsSection />

        {/* Skilled Worker Directory with Prominent Registration and Removal Request Triggers */}
        <section id="sec-skilled-workers" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm scroll-mt-20">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <span>{t.workersTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{t.workersSub}</p>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <select 
                value={areaFilter} 
                onChange={e => setAreaFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">{isAs ? 'সকলো অঞ্চল (All Areas)' : 'All Areas'}</option>
                {AREA_OPTIONS.map(a => (
                  <option key={a.value} value={a.value}>
                    {isAs ? a.as : a.en}
                  </option>
                ))}
              </select>

              {/* 1. Register Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.btnRegWorker}</span>
              </button>

              {/* 2. Top Removal Request Button */}
              <button 
                onClick={() => setIsRemovalModalOpen(true)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
                title={isAs ? "নাম প্ৰত্যাহাৰ কৰক" : "Request name removal"}
              >
                <UserMinus className="w-4 h-4 text-rose-600" />
                <span>{isAs ? 'নাম প্ৰত্যাহাৰ' : 'Remove Name'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((w) => (
                <div key={w.id} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:shadow-md hover:bg-white hover:border-emerald-300 transition">
                  <div>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-md border border-amber-200">
                      {isAs ? w.skill_as : w.skill_en}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-2">{w.full_name}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{w.chuburi_ward}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center gap-2">
                    <a 
                      href={`tel:${w.phone_number}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      title={isAs ? "পোনপটীয়া ফোন কৰক" : "Call Directly"}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isAs ? 'কল কৰক' : 'Call'}</span>
                    </a>

                    <a 
                      href={`https://wa.me/91${w.phone_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition"
                      title={isAs ? "হোৱাটছএপ বাৰ্তা প্ৰেৰণ কৰক" : "WhatsApp Message"}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      <span>{isAs ? 'হোৱাটছএপ' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                {isAs ? 'বৰ্তমান কোনো পঞ্জীয়নভুক্ত কাৰিকৰ পোৱা নগ’ল।' : 'No registered skilled workers found in this category.'}
              </div>
            )}
          </div>

          {/* 3. Bottom Dedicated Removal Banner under Directory */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <UserMinus className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-xs text-slate-600">
                {isAs 
                  ? 'আপোনাৰ নাম বা নম্বৰ ডাইৰেক্টৰিৰ পৰা আঁতৰাব বিচাৰে নেকি?' 
                  : 'Want to update or remove your name and phone number from this list?'}
              </p>
            </div>
            <button
              onClick={() => setIsRemovalModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
            >
              <span>{isAs ? 'প্ৰত্যাহাৰৰ আবেদন ইয়াত কৰক' : 'Submit Removal Request'}</span>
              <span>→</span>
            </button>
          </div>
        </section>

      </main>

      {/* 6. Modern Minimalist Footer */}
      

      {/* 1. Worker Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {isAs ? 'দক্ষ কাৰিকৰ / কৰ্মী পঞ্জীয়ন প্ৰপত্ৰ' : 'Skilled Worker Registration Form'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isAs ? 'পৰীক্ষাৰ পাছত আপোনাৰ নাম আৰু যোগাযোগ তালিকাত প্ৰকাশ পাব।' : 'Your contact details will appear after volunteer verification.'}
            </p>

            <form onSubmit={handleRegisterWorker} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '১. সম্পূৰ্ণ নাম' : '1. Full Name'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.full_name} 
                  onChange={e => setFormData({...formData, full_name: e.target.value})} 
                  placeholder={isAs ? "উদা: প্ৰণৱ গগৈ" : "e.g. Pranab Gogoi"}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAs ? '২. আপোনাৰ মূল দক্ষতা / বৃত্তি বাছক' : '2. Select Primary Skill'}</span>
                </label>
                <select
                  required
                  value={formData.skill_key}
                  onChange={e => setFormData({...formData, skill_key: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {SKILL_OPTIONS.map(skill => (
                    <option key={skill.value} value={skill.value}>
                      {isAs ? skill.as : skill.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAs ? '৩. কাম কৰা প্ৰধান অঞ্চল বাছক (Working Area)' : '3. Select Working Hub'}</span>
                </label>
                <select
                  required
                  value={formData.working_area}
                  onChange={e => setFormData({...formData, working_area: e.target.value})}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {AREA_OPTIONS.map(area => (
                    <option key={area.value} value={area.value}>
                      {isAs ? area.as : area.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '৪. ফোন নম্বৰ (WhatsApp / Call)' : '4. Contact Phone'}
                </label>
                <input 
                  type="tel" 
                  required 
                  pattern="[0-9]{10}" 
                  value={formData.phone_number} 
                  onChange={e => setFormData({...formData, phone_number: e.target.value})} 
                  placeholder="10 digit mobile number" 
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '৫. নিৰ্দিষ্ট চুবুৰী / গাঁও / পথ' : '5. Specific Chuburi / Road'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={formData.chuburi_ward} 
                  onChange={e => setFormData({...formData, chuburi_ward: e.target.value})} 
                  placeholder={isAs ? "উদা: নামঘৰ পথ / খনিকৰ গাঁও" : "e.g. Near Namghar / Ward 3"} 
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition mt-3 shadow">
                {isAs ? 'পঞ্জীয়ন আবেদন জমা কৰক' : 'Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Worker Removal Request Modal */}
      {isRemovalModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200">
            <button onClick={() => setIsRemovalModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserMinus className="w-5 h-5 text-rose-500" />
              <span>{isAs ? 'নাম প্ৰত্যাহাৰৰ অনুৰোধ' : 'Request Name Removal'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isAs 
                ? 'ডাইৰেক্টৰিৰ পৰা আপোনাৰ নাম আঁতৰাবলৈ তলৰ তথ্যখিনি প্ৰদান কৰক। এডমিনে পৰীক্ষা কৰি আঁতৰাই দিব।' 
                : 'Provide your name and phone number to request removal from the public directory.'}
            </p>

            <form onSubmit={handleRemovalRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '১. পঞ্জীয়ন কৰা সম্পূৰ্ণ নাম' : '1. Registered Full Name'}
                </label>
                <input 
                  type="text" 
                  required 
                  value={removalForm.worker_name} 
                  onChange={e => setRemovalForm({...removalForm, worker_name: e.target.value})} 
                  placeholder={isAs ? "উদা: প্ৰণৱ গগৈ" : "e.g. Pranab Gogoi"}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '২. পঞ্জীয়ন কৰা ফোন নম্বৰ' : '2. Registered Phone Number'}
                </label>
                <input 
                  type="tel" 
                  required 
                  pattern="[0-9]{10}" 
                  value={removalForm.phone_number} 
                  onChange={e => setRemovalForm({...removalForm, phone_number: e.target.value})} 
                  placeholder="10 digit mobile number" 
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isAs ? '৩. আঁতৰোৱাৰ কাৰণ (ঐচ্ছিক)' : '3. Reason for Removal (Optional)'}
                </label>
                <input 
                  type="text" 
                  value={removalForm.reason} 
                  onChange={e => setRemovalForm({...removalForm, reason: e.target.value})} 
                  placeholder={isAs ? "উদা: অন্য ঠাইলৈ স্থানান্তৰিত / নম্বৰ সলনি হৈছে" : "e.g. Relocated / Changed phone number"}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500" 
                />
              </div>

              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-sm transition mt-3 shadow">
                {isAs ? 'প্ৰত্যাহাৰ অনুৰোধ প্ৰেৰণ কৰক' : 'Send Removal Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Opportunities />

    </div>
  );
};






