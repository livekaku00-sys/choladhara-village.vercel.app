import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ExternalLink, 
  PhoneCall, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

interface AgriService {
  id: string;
  category: 'paddy' | 'tea' | 'subsidy' | 'kvk';
  title_as: string;
  title_en: string;
  dept_as: string;
  dept_en: string;
  desc_as: string;
  desc_en: string;
  action_label_as: string;
  action_label_en: string;
  link: string;
  badge_as: string;
  badge_en: string;
  badge_color?: string;
  valid_until?: string | null;
  season?: string | null;
  is_active?: boolean;
}

export const AgricultureSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';
  const [activeTab, setActiveTab] = useState<string>('all');
  const [services, setServices] = useState<AgriService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAgriServices();
  }, []);

  const fetchAgriServices = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch active schemes: permanent (valid_until IS NULL) OR seasonal (valid_until >= today)
      const { data, error } = await supabase
        .from('agriculture_services')
        .select('*')
        .eq('is_active', true)
        .or(`valid_until.is.null,valid_until.gte.${today}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setServices(data as AgriService[]);
      }
    } catch (err) {
      console.error('Error loading agriculture services:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingDays = (validUntil: string) => {
    const target = new Date(validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <section id="sec-agriculture" className="space-y-6">
      {/* 1. Header & Live MSP Rate */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {isAs ? 'কৃষি সেৱা, ধান ক্ৰয় আৰু কৃষক কল্যাণ হাব' : 'Agriculture, Paddy MSP & Farmers Hub'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAs ? 'চৰকাৰী শস্য অনুদান, ধানৰ MSP, চাহ খেতিয়কৰ পৰামৰ্শ আৰু শস্য বীমা' : 'Government crop subsidies, Paddy MSP centers, Tea grower guidelines & PMFBY'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3.5 py-2 rounded-xl text-emerald-300 self-start md:self-auto shadow-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold tracking-tight">
            {isAs ? 'ধানৰ চৰকাৰী MSP: ₹২,৩০০/কুইণ্টল' : 'Paddy Govt MSP: ₹2,300/Quintal'}
          </span>
        </div>
      </div>

      {/* 2. Advisory Notice */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-amber-200/90 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">
            {isAs ? 'কৃষকৰ বাবে জৰুৰী পৰামৰ্শ (Farmers Advisory Notice): ' : 'Farmers Advisory Notice: '}
          </span>
          {isAs
            ? 'সকলো চৰকাৰী অনুদান (PM-KISAN, শস্য বীমা, ট্ৰেক্টৰ ৰেহাই)ৰ বাবে নিজৰ বেংক একাউণ্টৰ সৈতে আধাৰ আৰু ভূমি পঞ্জীয়ন (Land Seeding) লিংক থকাটো বাধ্যতামূলক।'
            : 'For all government schemes (PM-KISAN, PMFBY, SMAM), Aadhaar-seeded active bank accounts and updated land records are strictly required.'}
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            activeTab === 'all'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isAs ? 'সকলো সেৱা' : 'All Services'}
        </button>
        <button
          onClick={() => setActiveTab('paddy')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            activeTab === 'paddy'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isAs ? '১. ধান ক্ৰয় & MSP' : '1. Paddy MSP'}
        </button>
        <button
          onClick={() => setActiveTab('tea')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            activeTab === 'tea'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isAs ? '২. ক্ষুদ্ৰ চাহ খেতি' : '2. Small Tea Growers'}
        </button>
        <button
          onClick={() => setActiveTab('subsidy')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            activeTab === 'subsidy'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isAs ? '৩. চৰকাৰী অনুদান & বীমা' : '3. Subsidies & Insurance'}
        </button>
        <button
          onClick={() => setActiveTab('kvk')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
            activeTab === 'kvk'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
          }`}
        >
          {isAs ? '৪. KVK শস্য পৰামৰ্শ' : '4. KVK Advisory'}
        </button>
      </div>

      {/* 4. Dynamic Cards Grid */}
      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
          <p className="text-xs text-slate-400">
            {isAs ? 'কৃষি সেৱাসমূহ লোড কৰা হৈছে...' : 'Loading agricultural services...'}
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
          {isAs ? 'এই শ্ৰেণীত কোনো সক্ৰিয় আঁচনি উপলব্ধ নাই।' : 'No active schemes available under this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const daysRemaining = service.valid_until ? getRemainingDays(service.valid_until) : null;

            return (
              <div
                key={service.id}
                className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${service.badge_color || 'bg-emerald-950/80 text-emerald-300 border-emerald-800'}`}>
                      {isAs ? service.badge_as : service.badge_en}
                    </span>

                    {daysRemaining !== null ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        daysRemaining <= 7 
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse' 
                          : 'bg-amber-950/60 text-amber-300 border-amber-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{daysRemaining} {isAs ? 'দিন বাকী' : 'days left'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        {isAs ? 'নিয়মীয়া সেৱা' : 'Year-Round'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {isAs ? service.title_as : service.title_en}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{isAs ? service.dept_as : service.dept_en}</span>
                  </p>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {isAs ? service.desc_as : service.desc_en}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {service.valid_until ? (
                    <span className="text-[10px] text-slate-400">
                      {isAs ? 'সময়সীমা: ' : 'Valid until: '}
                      <span className="font-semibold text-slate-300">{service.valid_until}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      {isAs ? 'নিয়মীয়া সেৱা' : 'Permanent'}
                    </span>
                  )}

                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 text-xs font-semibold transition active:scale-95 shadow-sm"
                  >
                    <span>{isAs ? service.action_label_as : service.action_label_en}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Kisan Call Centre Helpline Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {isAs ? 'কিষাণ কল চেণ্টাৰ (Kisan Call Centre) - বিনামূলীয়া পৰামৰ্শ' : 'Kisan Call Centre - Free Helpline'}
            </h4>
            <p className="text-xs text-slate-400">
              {isAs ? 'শস্য ৰোগ, সাৰ প্ৰয়োগ আৰু বতৰৰ তথ্যৰ বাবে চৰকাৰী বিনামূলীয়া নম্বৰত যোগাযোগ কৰক' : 'Dial official toll-free number for expert crop and fertilizer advice'}
            </p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md self-start sm:self-auto"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>1800-180-1551 (টোল-ফ্ৰী)</span>
        </a>
      </div>
    </section>
  );
};

export default AgricultureSection;
