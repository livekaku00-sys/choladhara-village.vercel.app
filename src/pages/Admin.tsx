import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Bell, 
  Users, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Notice, SkilledWorker } from '../types/database';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'notices' | 'workers'>('notices');

  const [notices, setNotices] = useState<Notice[]>([]);
  const [workers, setWorkers] = useState<SkilledWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'urgent' | 'general' | 'jobs' | 'agriculture'>('urgent');
  const [isPinned, setIsPinned] = useState(true);

  const ADMIN_PIN = '785689';

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: nData } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });
      if (nData) setNotices(nData);

      const { data: wData } = await supabase
        .from('skilled_workers')
        .select('*')
        .order('created_at', { ascending: false });
      if (wData) setWorkers(wData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN || pin === '1234') {
      setIsAuthenticated(true);
      setErrorMsg('');
      loadData();
    } else {
      setErrorMsg('ভুল PIN! অনুগ্ৰহ কৰি সঠিক প্ৰশাসক PIN প্ৰৱেশ কৰক।');
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    const { error } = await supabase.from('notices').insert([
      {
        title_as: noticeTitle,
        title_en: noticeTitle,
        content_as: noticeDesc,
        content_en: noticeDesc,
        category: noticeCategory,
        is_pinned: isPinned
      }
    ]);

    if (!error) {
      setNoticeTitle('');
      setNoticeDesc('');
      loadData();
    } else {
      alert('Error creating notice: ' + error.message);
    }
  };

  const handleDeleteNotice = async (id: string | number) => {
    if (!confirm('এই জাননীখন মচি পেলাব বিচাৰে নেকি?')) return;
    await supabase.from('notices').delete().eq('id', id);
    loadData();
  };

  const handleToggleWorker = async (id: string | number, currentStatus: boolean) => {
    await supabase.from('skilled_workers').update({ is_verified: !currentStatus }).eq('id', id);
    loadData();
  };

  const handleDeleteWorker = async (id: string | number) => {
    if (!confirm('এই কাৰিকৰজনৰ তথ্য মচি পেলাব বিচাৰে নেকি?')) return;
    await supabase.from('skilled_workers').delete().eq('id', id);
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-center mb-1">প্ৰশাসক প্ৰৱেশ (Admin Login)</h2>
          <p className="text-xs text-slate-400 text-center mb-6">চোলাধৰা গ্ৰাম্য সেৱা পৰ্টেল ব্যৱস্থাপনা কক্ষ</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">প্ৰশাসক সুৰক্ষা PIN:</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN দিয়ক (Default: 785689 বা 1234)"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg tracking-widest text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            {errorMsg && <p className="text-rose-400 text-xs text-center font-bold">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-lg active:scale-95"
            >
              প্ৰৱেশ কৰক (Login)
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> মুখ্য পৃষ্ঠালৈ উভতি যাওক
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">প্ৰশাসক নিয়ন্ত্ৰণ কক্ষ (Admin Dashboard)</h1>
              <p className="text-xs text-slate-400">চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              মুকলি ৱেবছাইট
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold rounded-xl transition"
            >
              প্ৰস্থান (Logout)
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'notices'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>জাননী ব্যৱস্থাপনা ({notices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'workers'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>কাৰিকৰ পঞ্জীয়ন প্ৰমাণীকৰণ ({workers.length})</span>
          </button>
        </div>

        {/* Notices Section */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Notice Form */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                নতুন জাননী প্ৰকাশ কৰক
              </h3>

              <form onSubmit={handleCreateNotice} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">জাননীৰ শিৰোনাম (Title):</label>
                  <input
                    type="text"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="উদাহৰণ: গাঁও সভাৰ বিশেষ বৈঠক..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">বিৱৰণ (Details):</label>
                  <textarea
                    rows={3}
                    value={noticeDesc}
                    onChange={(e) => setNoticeDesc(e.target.value)}
                    placeholder="জাননীৰ সম্পূৰ্ণ বিৱৰণ ইয়াত লিখক..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">বিভাগ (Category):</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="urgent">জৰুৰী জাননী (Urgent Alert)</option>
                    <option value="general">সাধাৰণ জাননী (General)</option>
                    <option value="jobs">চাকৰি / আঁচনি (Jobs/Schemes)</option>
                    <option value="agriculture">কৃষি বাৰ্তা (Agriculture)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <label htmlFor="pinned" className="text-xs text-slate-300">শীৰ্ষত পিন কৰক (Pin to Top)</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow mt-2"
                >
                  জাননী প্ৰকাশ কৰক
                </button>
              </form>
            </div>

            {/* Existing Notices List */}
            <div className="lg:col-span-2 space-y-3">
              {notices.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs">
                  কোনো সক্ৰিয় জাননী নাই।
                </div>
              ) : (
                notices.map((n) => {
                  const anyNotice = n as any;
                  const title = anyNotice.title_as || anyNotice.title_en || anyNotice.title;
                  const desc = anyNotice.content_as || anyNotice.content_en || anyNotice.description_as || anyNotice.description || '';

                  return (
                    <div
                      key={n.id}
                      className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {n.category}
                          </span>
                          {n.is_pinned && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              📌 Pinned
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{title}</h4>
                        {desc && <p className="text-xs text-slate-300">{desc}</p>}
                      </div>

                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="p-2 bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-800 rounded-xl transition"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Workers Section */}
        {activeTab === 'workers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-4 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-white">পঞ্জীয়নভুক্ত কাৰিকৰ তালিকা</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">নাম (Name)</th>
                    <th className="p-3">দক্ষতা (Skill)</th>
                    <th className="p-3">অঞ্চল (Area)</th>
                    <th className="p-3">ফোন (Phone)</th>
                    <th className="p-3">স্থিতি (Status)</th>
                    <th className="p-3 text-right">পদক্ষেপ (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        কোনো পঞ্জীয়ন তথ্য নাই।
                      </td>
                    </tr>
                  ) : (
                    workers.map((w) => {
                      const anyWorker = w as any;
                      const skill = anyWorker.skill_as || anyWorker.skill_en || anyWorker.skill_key || 'Skilled Work';
                      const area = anyWorker.working_area || anyWorker.chuburi_ward || anyWorker.area || 'Choladhara';

                      return (
                        <tr key={w.id} className="hover:bg-slate-950/50">
                          <td className="p-3 font-bold text-white">{w.full_name}</td>
                          <td className="p-3">{skill}</td>
                          <td className="p-3">{area}</td>
                          <td className="p-3 font-mono text-emerald-400">{w.phone_number}</td>
                          <td className="p-3">
                            {w.is_verified ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                                <CheckCircle className="w-3.5 h-3.5" /> প্ৰমাণিত
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                                <XCircle className="w-3.5 h-3.5" /> অপ্ৰমাণিত
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => handleToggleWorker(w.id, w.is_verified)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                w.is_verified
                                  ? 'bg-amber-950 border-amber-800 text-amber-300'
                                  : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                              }`}
                            >
                              {w.is_verified ? 'বাতিল কৰক' : 'অনুমোদন দিয়ক'}
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(w.id)}
                              className="p-1.5 bg-rose-950 border border-rose-800 text-rose-400 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
