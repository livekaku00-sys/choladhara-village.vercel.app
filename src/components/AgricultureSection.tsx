import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Leaf, 
  Phone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import type { AgriFeed } from '../types/database';

export const AgricultureSection: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  const [items, setItems] = useState<AgriFeed[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'scheme' | 'paddy_msp' | 'tea' | 'advisory'>('ALL');

  useEffect(() => {
    const fetchAgriFeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('agriculture_feeds')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: true });

        if (data && !error) {
          setItems(data);
        }
      } catch (err) {
        console.error('Error loading dynamic agriculture feeds:', err);
      }
    };

    fetchAgriFeeds();
  }, []);

  const filteredItems = activeTab === 'ALL'
    ? items
    : items.filter(item => item.category === activeTab);

  return (
    <section id="sec-agriculture" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm scroll-mt-20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
            <Sprout className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isAs ? 'কৃষি সেৱা, ধান ক্ৰয় আৰু কৃষক কল্যাণ হাব' : 'Agriculture, Paddy Procurement & Farmers Hub'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAs ? 'চৰকাৰী শস্য অনুদান, ধানৰ MSP, চাহ খেতিয়কৰ পৰামৰ্শ আৰু শস্য বীমা' : 'Government crop subsidies, Paddy MSP centers, Tea grower guidelines & PMFBY'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAs ? 'ধানৰ MSP: ₹২,৩০০/কুইণ্টল' : 'Paddy MSP: ₹2,300/qtl'}</span>
          </span>
        </div>
      </div>

      <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isAs ? 'কৃষক ৰাইজৰ জ্ঞাতাৰ্থে (Farmers Advisory Notice):' : 'Official Outbound Verification Notice:'}</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-600">
          {isAs 
            ? 'সকলো চৰকাৰী অনুদান (PM-KISAN, শস্য বীমা, ট্ৰেক্টৰ ৰাজসাহায্য) আৰু ধান বিক্ৰী কেৱল আধিকাৰিক চৰকাৰী প’ৰ্টেল আৰু জিলা কৃষি কাৰ্যালয়ৰ জৰিয়তে সম্পন্ন হয়।' 
            : 'All DBT subsidies and paddy procurement are executed strictly via official government servers (.gov.in).'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 text-xs font-semibold">
        {[
          { key: 'ALL', en: 'All Services', as: 'সকলো সেৱা' },
          { key: 'paddy_msp', en: 'Paddy MSP (₹2,300)', as: '১. ধান ক্ৰয় ও MSP' },
          { key: 'tea', en: 'Small Tea Growers', as: '২. ক্ষুদ্ৰ চাহ খেতি' },
          { key: 'scheme', en: 'Subsidies (PM-KISAN/PMFBY)', as: '৩. চৰকাৰী অনুদান ও বীমা' },
          { key: 'advisory', en: 'KVK Crop Advisory', as: '৪. KVK শস্য পৰামৰ্শ' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key as any)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
              activeTab === cat.key 
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isAs ? cat.as : cat.en}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between transition hover:shadow-md hover:bg-white hover:border-emerald-300"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                    {item.category === 'tea' ? <Leaf className="w-3 h-3 text-emerald-700" /> : <Sprout className="w-3 h-3 text-emerald-700" />}
                    <span>{isAs ? item.badge_as : item.badge_en}</span>
                  </span>

                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{isAs ? 'পৰীক্ষিত' : 'Verified'}</span>
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                  {isAs ? item.title_as : item.title_en}
                </h4>

                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  🏛️ {isAs ? item.authority_as : item.authority_en}
                </p>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/60">
                  {isAs ? item.benefit_as : item.benefit_en}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isAs ? 'সক্ৰিয় চৰকাৰী আঁচনি' : 'Active Scheme'}
                </span>

                {item.action_link && (
                  <a 
                    href={item.action_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    <span>{isAs ? (item.action_label_as || 'প’ৰ্টেললৈ যাওক') : (item.action_label_en || 'Visit Portal')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            {isAs ? 'কোনো কৃষি তথ্য পোৱা নগ’ল।' : 'No agriculture records found.'}
          </div>
        )}
      </div>

      <div className="mt-5 p-4 bg-gradient-to-r from-emerald-950 to-teal-950 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-emerald-800 text-emerald-200 rounded-xl">
            <Phone className="w-4 h-4" />
          </span>
          <div>
            <h5 className="font-bold text-emerald-200">
              {isAs ? 'কিষাণ কল চেণ্টাৰ (Kisan Call Centre - বিনামূলীয়া পৰামৰ্শ):' : 'Kisan Call Centre Toll-Free Helpline:'}
            </h5>
            <p className="text-slate-300 text-[11px]">
              {isAs ? 'শস্য ৰোগ, সাৰ আৰু বতৰৰ বিষয়ে কৃষি বিশেষজ্ঞৰ সৈতে পোনপটীয়া কথা পাতক' : 'Speak directly with agronomists regarding crop diseases, fertilizers & weather'}
            </p>
          </div>
        </div>

        <a 
          href="tel:18001801551" 
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
        >
          <span>1800-180-1551 (টোল-ফ্ৰী)</span>
        </a>
      </div>
    </section>
  );
};
