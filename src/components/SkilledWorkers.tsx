import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Search,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

interface SkilledWorker {
  id: string | number;
  full_name: string;
  skill_as?: string;
  skill_en?: string;
  trade?: string;
  area_as?: string;
  area_en?: string;
  village_area?: string;
  phone?: string;
  phone_number?: string;
  is_verified?: boolean;
}

export const SkilledWorkers: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [workers, setWorkers] = useState<SkilledWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skilled_workers')
        .select('*')
        .order('is_verified', { ascending: false });

      if (error) throw error;
      if (data) {
        setWorkers(data);
      }
    } catch (err) {
      console.error('Error loading skilled workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const q = searchQuery.toLowerCase().trim();
    const tradeMatch = selectedTrade === 'all' || 
      (worker.trade && worker.trade.toLowerCase() === selectedTrade.toLowerCase()) ||
      (worker.skill_en && worker.skill_en.toLowerCase().includes(selectedTrade.toLowerCase())) ||
      (worker.skill_as && worker.skill_as.toLowerCase().includes(selectedTrade.toLowerCase()));

    const name = (worker.full_name || '').toLowerCase();
    const skillAs = (worker.skill_as || '').toLowerCase();
    const skillEn = (worker.skill_en || '').toLowerCase();
    const areaAs = (worker.area_as || worker.village_area || '').toLowerCase();
    const areaEn = (worker.area_en || worker.village_area || '').toLowerCase();

    const searchMatch = !q || 
      name.includes(q) || 
      skillAs.includes(q) || 
      skillEn.includes(q) || 
      areaAs.includes(q) || 
      areaEn.includes(q);

    return tradeMatch && searchMatch;
  });

  return (
    <section id="sec-artisans" className="space-y-6">
      {/* 1. Header & Live Counter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {isAs ? 'গাঁৱৰ দক্ষ কাৰিকৰ আৰু সেৱা নিৰ্দেশিকা' : 'Village Artisans & Skilled Workers Directory'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAs 
                ? 'বিদ্যুৎ মিস্ত্ৰী, কাঠমিস্ত্ৰী, প্লাম্বাৰ আৰু স্থানীয় কাৰিকৰৰ সত্যাপিক যোগাযোগ' 
                : 'Verified local electricians, carpenters, plumbers, and trade specialists'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-700/60 px-3.5 py-2 rounded-xl text-amber-300 self-start md:self-auto shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-bold tracking-tight">
            {workers.length} {isAs ? 'জন পঞ্জীয়নভুক্ত কাৰিকৰ' : 'Registered Artisans'}
          </span>
        </div>
      </div>

      {/* 2. Search and Trade Filter Pills */}
      <div className="space-y-3">
        <div className="relative max-w-xl mx-auto group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAs ? 'কাৰিকৰৰ নাম, কাম বা এলেকা সন্ধান কৰক...' : 'Search artisan name, skill, or locality...'}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-inner transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { key: 'all', label_as: 'সকলো কাৰিকৰ', label_en: 'All Trades' },
            { key: 'electrician', label_as: 'বিদ্যুৎ মিস্ত্ৰী', label_en: 'Electrician' },
            { key: 'carpenter', label_as: 'কাঠমিস্ত্ৰী', label_en: 'Carpenter' },
            { key: 'plumber', label_as: 'প্লাম্বাৰ', label_en: 'Plumber' },
            { key: 'mason', label_as: 'ৰাজমিস্ত্ৰী', label_en: 'Mason' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedTrade(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedTrade === tab.key
                  ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isAs ? tab.label_as : tab.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Workers Grid */}
      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400">
            {isAs ? 'কাৰিকৰসকলৰ তথ্য লোড কৰা হৈছে...' : 'Loading artisan directory...'}
          </p>
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
          {isAs ? 'কোনো কাৰিকৰৰ তথ্য পোৱা নগ’ল।' : 'No artisans found matching your query.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((worker) => {
            const skill = isAs 
              ? (worker.skill_as || worker.skill_en || worker.trade || '') 
              : (worker.skill_en || worker.skill_as || worker.trade || '');
            const area = isAs
              ? (worker.area_as || worker.village_area || worker.area_en || '')
              : (worker.area_en || worker.village_area || worker.area_as || '');
            const phone = worker.phone || worker.phone_number || '';

            return (
              <div
                key={worker.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white">
                      {worker.full_name}
                    </h3>
                    {worker.is_verified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        <span>{isAs ? 'প্ৰমাণিত' : 'Verified'}</span>
                      </span>
                    )}
                  </div>

                  {skill && (
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 mt-1">
                      <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{skill}</span>
                    </p>
                  )}

                  {area && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{area}</span>
                    </p>
                  )}
                </div>

                {phone && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAs ? 'কল কৰক' : 'Call'}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition active:scale-95 shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SkilledWorkers;
