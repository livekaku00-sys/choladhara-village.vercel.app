import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Search,
  MessageCircle,
  UserPlus,
  MessageSquare,
  X,
  Send,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export interface SkilledWorker {
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
  is_available?: boolean;
  created_at?: string;
}

export const SkilledWorkers: React.FC = () => {
  const { language } = useLanguage();
  const isAs = language === 'as';

  // Core Data State
  const [workers, setWorkers] = useState<SkilledWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRemovalModal, setShowRemovalModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Add Worker Form State
  const [newName, setNewName] = useState('');
  const [newTrade, setNewTrade] = useState('Electrician');
  const [newArea, setNewArea] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Removal Request Form State
  const [removalWorkerName, setRemovalWorkerName] = useState('');
  const [removalPhone, setRemovalPhone] = useState('');
  const [removalReason, setRemovalReason] = useState('');

  // 1. Fetch Dynamic Data from Supabase
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
      console.error('Error fetching skilled workers:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Extract Dynamic Area List from Database Records
  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    workers.forEach((w) => {
      const area = w.area_as || w.area_en || w.village_area;
      if (area && area.trim()) {
        areas.add(area.trim());
      }
    });
    return Array.from(areas);
  }, [workers]);

  // 3. Trade Category Options
  const tradeOptions = [
    { key: 'ALL', label_as: 'সকলো বিভাগ (All Categories)', label_en: 'All Categories' },
    { key: 'Electrician', label_as: 'বিদ্যুৎ মিস্ত্ৰী (Electrician)', label_en: 'Electrician' },
    { key: 'Carpenter', label_as: 'কাঠমিস্ত্ৰী (Carpenter)', label_en: 'Carpenter' },
    { key: 'Plumber', label_as: 'প্লাম্বাৰ (Plumber)', label_en: 'Plumber' },
    { key: 'Mason', label_as: 'ৰাজমিস্ত্ৰী (Mason)', label_en: 'Mason' },
    { key: 'Mechanic', label_as: 'মেকানিক (Mechanic)', label_en: 'Mechanic' },
    { key: 'Tailor', label_as: 'টেইলৰ / দৰ্জী (Tailor)', label_en: 'Tailor' },
    { key: 'Painter', label_as: 'ৰং মিস্ত্ৰী (Painter)', label_en: 'Painter' },
    { key: 'Welder', label_as: 'ৱেল্ডাৰ (Welder)', label_en: 'Welder' },
    { key: 'Other', label_as: 'অন্যান্য (Other Trades)', label_en: 'Other Trades' }
  ];

  // 4. Combined Filtering Logic
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const q = searchQuery.toLowerCase().trim();
      const workerTrade = (worker.trade || worker.skill_en || worker.skill_as || '').toLowerCase();
      const workerArea = (worker.area_as || worker.area_en || worker.village_area || '').toLowerCase();
      const workerName = (worker.full_name || '').toLowerCase();
      const workerPhone = (worker.phone || worker.phone_number || '');

      // Area Filter
      const matchesArea = areaFilter === 'ALL' || workerArea.includes(areaFilter.toLowerCase());

      // Category Filter
      const matchesCategory = categoryFilter === 'ALL' || workerTrade.includes(categoryFilter.toLowerCase());

      // Search Query
      const matchesSearch = !q || 
        workerName.includes(q) || 
        workerTrade.includes(q) || 
        workerArea.includes(q) || 
        workerPhone.includes(q);

      return matchesArea && matchesCategory && matchesSearch;
    });
  }, [workers, searchQuery, areaFilter, categoryFilter]);

  // Handle Add Worker Submit
  const handleAddWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert(isAs ? 'অনুগ্ৰহ কৰি নাম আৰু ফোন নম্বৰ লিখক।' : 'Please provide name and phone number.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        full_name: newName.trim(),
        trade: newTrade,
        skill_en: newTrade,
        skill_as: tradeOptions.find(t => t.key === newTrade)?.label_as.split(' ')[0] || newTrade,
        area_as: newArea.trim(),
        area_en: newArea.trim(),
        village_area: newArea.trim(),
        phone: newPhone.trim(),
        phone_number: newPhone.trim(),
        is_verified: false
      };

      const { error } = await supabase.from('skilled_workers').insert([payload]);
      if (error) throw error;

      alert(isAs 
        ? 'আপোনাৰ তথ্য সফলতাৰে জমা হৈছে। পৰীক্ষণৰ পিছত ইয়াত প্ৰকাশ পাব।' 
        : 'Worker profile submitted successfully. It will be published after verification.');

      setShowAddModal(false);
      setNewName('');
      setNewArea('');
      setNewPhone('');
      fetchWorkers();
    } catch (err: any) {
      console.error('Error adding worker:', err);
      alert(`Error: ${err.message || 'Submission failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Removal Request Submit
  const handleRemovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removalWorkerName.trim() || !removalPhone.trim()) {
      alert(isAs ? 'অনুগ্ৰহ কৰি নাম আৰু ফোন নম্বৰ লিখক।' : 'Please provide name and phone number.');
      return;
    }

    const removalMsg = isAs
      ? `🚨 *কাৰিকৰ তালিকাৰ পৰা নাম আঁতৰোৱাৰ অনুৰোধ*\n👤 নাম: ${removalWorkerName}\n📱 ফোন: ${removalPhone}\n📝 কাৰণ: ${removalReason || 'ব্যক্তিগত কাৰণ'}`
      : `🚨 *Artisan Removal Request*\n👤 Name: ${removalWorkerName}\n📱 Phone: ${removalPhone}\n📝 Reason: ${removalReason || 'Personal preference'}`;

    window.open(`https://wa.me/919954000000?text=${encodeURIComponent(removalMsg)}`, '_blank');
    setShowRemovalModal(false);
    setRemovalWorkerName('');
    setRemovalPhone('');
    setRemovalReason('');
  };

  return (
    <section id="sec-artisans" className="space-y-6">
      {/* 1. Header & Live Action Buttons */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 flex-shrink-0 shadow-inner">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isAs ? 'গাঁৱৰ দক্ষ কাৰিকৰ আৰু সেৱা নিৰ্দেশিকা' : 'Village Artisans & Skilled Workers Directory'}
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800">
                {workers.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {isAs 
                ? 'বিদ্যুৎ মিস্ত্ৰী, কাঠমিস্ত্ৰী, প্লাম্বাৰ আৰু গাঁৱৰ স্থানীয় কাৰিকৰৰ সত্যাপিক যোগাযোগ নম্বৰ' 
                : 'Verified contact directory of local electricians, carpenters, plumbers, and skilled technicians'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Worker & Removal Request */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAs ? 'নাম পঞ্জীয়ন কৰক' : 'Add Worker'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRemovalModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition active:scale-95 cursor-pointer"
            title={isAs ? 'নাম আঁতৰোৱাৰ অনুৰোধ' : 'Request Removal'}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>{isAs ? 'নাম আঁতৰাওক' : 'Request Removal'}</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Double Dropdowns (Area & Trade Category) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-md backdrop-blur-sm grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Bar */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAs ? 'কাৰিকৰৰ নাম, কাম বা নম্বৰ সন্ধান কৰক...' : 'Search by name, skill, or phone...'}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-inner"
          />
        </div>

        {/* Trade Category Dropdown */}
        <div className="sm:col-span-3 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-700 text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 cursor-pointer appearance-none"
          >
            {tradeOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-slate-900 text-white">
                {isAs ? opt.label_as : opt.label_en}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>

        {/* Working Area Dropdown */}
        <div className="sm:col-span-3 relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-950/80 border border-slate-700 text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 cursor-pointer appearance-none"
          >
            <option value="ALL" className="bg-slate-900 text-white">
              {isAs ? 'সকলো অঞ্চল / চুবুৰি (All Areas)' : 'All Village Areas'}
            </option>
            {areaOptions.map((area) => (
              <option key={area} value={area} className="bg-slate-900 text-white">
                {area}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>
      </div>

      {/* 3. Workers Grid */}
      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs text-slate-400">{isAs ? 'কাৰিকৰসকলৰ তথ্য সংগ্ৰহ কৰা হৈছে...' : 'Loading artisans directory...'}</p>
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-300">
            {isAs ? 'এই শ্ৰেণী বা অঞ্চলত কোনো কাৰিকৰ পোৱা নগ’ল।' : 'No skilled workers found for the selected filters.'}
          </p>
          <p className="text-xs text-slate-500">
            {isAs ? 'অনুগ্ৰহ কৰি আন বিভাগ বা অঞ্চল নিৰ্বাচন কৰক।' : 'Try selecting another trade category or village area.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:shadow-amber-500/5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {worker.full_name}
                    </h3>
                    {worker.is_verified ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{isAs ? 'প্ৰমাণিত' : 'Verified'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {isAs ? 'পঞ্জীয়নভুক্ত' : 'Registered'}
                      </span>
                    )}
                  </div>

                  {skill && (
                    <p className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 mt-1 bg-amber-950/30 border border-amber-900/40 px-2.5 py-1 rounded-lg w-fit">
                      <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{skill}</span>
                    </p>
                  )}

                  {area && (
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{area}</span>
                    </p>
                  )}
                </div>

                {phone && (
                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center gap-2">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 text-xs font-bold transition active:scale-95 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAs ? 'কল কৰক' : 'Call'}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        isAs 
                          ? `নমস্কাৰ ${worker.full_name}, চোলাধৰা গ্ৰাম্য প'ৰ্টেলৰ পৰা আপোনাৰ সেৱাৰ বিষয়ে যোগাযোগ কৰিছোঁ।` 
                          : `Hello ${worker.full_name}, contacting you regarding your service from Choladhara Portal.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-bold transition active:scale-95 shadow-sm"
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

      {/* ========================================================
          MODAL 1: ADD WORKER FORM
         ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>{isAs ? 'নতুন কাৰিকৰৰ নাম পঞ্জীয়ন' : 'Register Skilled Worker'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAs ? 'গাঁৱৰ সকলো দক্ষ কাৰিকৰে নিজৰ নাম আৰু সেৱা অন্তৰ্ভুক্ত কৰিব পাৰিব।' : 'Add local artisan contact details to the village directory.'}
              </p>
            </div>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'কাৰিকৰৰ সম্পূৰ্ণ নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isAs ? 'যেনে: ৰাহুল ফুকন' : 'e.g. Rahul Phukon'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'কৰ্মৰ শ্ৰেণী / বিভাগ *' : 'Trade / Category *'}
                </label>
                <select
                  value={newTrade}
                  onChange={(e) => setNewTrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                >
                  {tradeOptions.filter(t => t.key !== 'ALL').map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {isAs ? opt.label_as : opt.label_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'গাঁও / চুবুৰিৰ নাম' : 'Village / Locality Area'}
                </label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder={isAs ? 'যেনে: বৰুৱা চুক' : 'e.g. Boruah Chuk'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'মোবাইল / হোৱাটছএপ নম্বৰ *' : 'Phone / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {isAs ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isAs ? 'জমা দিয়ক' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: REMOVAL REQUEST FORM
         ======================================================== */}
      {showRemovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowRemovalModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-400" />
                <span>{isAs ? 'নাম আঁতৰোৱাৰ অনুৰোধ' : 'Worker Removal Request'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAs ? 'কাৰিকৰৰ নাম তালিকাৰ পৰা আঁতৰাবলৈ অনুৰোধ প্ৰেৰণ কৰক।' : 'Request removal of a worker profile from the public directory.'}
              </p>
            </div>

            <form onSubmit={handleRemovalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'কাৰিকৰৰ নাম *' : 'Artisan Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={removalWorkerName}
                  onChange={(e) => setRemovalWorkerName(e.target.value)}
                  placeholder={isAs ? 'পঞ্জীয়নভুক্ত নাম' : 'Registered name'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'পঞ্জীয়নভুক্ত ফোন নম্বৰ *' : 'Registered Phone *'}
                </label>
                <input
                  type="tel"
                  required
                  value={removalPhone}
                  onChange={(e) => setRemovalPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {isAs ? 'আঁতৰোৱাৰ কাৰণ' : 'Reason for Removal'}
                </label>
                <textarea
                  rows={2}
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  placeholder={isAs ? 'যেনে: বৰ্তমান উপলব্ধ নহয় বা ঠাই সলনি' : 'e.g. Relocated or no longer offering service'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRemovalModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {isAs ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAs ? 'অনুৰোধ প্ৰেৰণ কৰক' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SkilledWorkers;
