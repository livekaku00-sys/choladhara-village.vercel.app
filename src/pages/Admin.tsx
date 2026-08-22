import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home as HomeIcon,
  Lock, 
  LogOut, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Wrench, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Bell, 
  ShieldCheck, 
  AlertCircle, 
  Pin, 
  PinOff, 
  UserMinus 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SkilledWorker, Notice, Scholarship, EntranceExam, Opportunity } from '../types/database';

interface RemovalRequest {
  id: number | string;
  worker_name: string;
  phone_number: string;
  reason?: string;
  created_at?: string;
}

export const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form states for login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data states
  const [workers, setWorkers] = useState<SkilledWorker[]>([]);
  const [removalRequests, setRemovalRequests] = useState<RemovalRequest[]>([]);
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [exams, setExams] = useState<EntranceExam[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Tab State & Worker Filter
  const [activeTab, setActiveTab] = useState<'workers' | 'removals' | 'jobs' | 'exams' | 'scholarships' | 'notices'>('workers');
  const [workerFilter, setWorkerFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');

  // Notice Form State
  const [noticeTitleEn, setNoticeTitleEn] = useState('');
  const [noticeTitleAs, setNoticeTitleAs] = useState('');
  const [noticeDetailsEn, setNoticeDetailsEn] = useState('');
  const [noticeDetailsAs, setNoticeDetailsAs] = useState('');
  const [noticePinned, setNoticePinned] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        fetchAllData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchAllData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setRefreshing(true);
    setStatusMsg('তথ্য সংগ্ৰহ কৰা হৈছে (Fetching all records)...');
    try {
      // Fetch each table independently with simple select('*') to prevent column errors
      const [wRes, rRes, jRes, eRes, sRes, nRes] = await Promise.all([
        supabase.from('skilled_workers').select('*'),
        supabase.from('worker_removal_requests').select('*'),
        supabase.from('opportunities').select('*'),
        supabase.from('entrance_exams').select('*'),
        supabase.from('scholarships').select('*'),
        supabase.from('notices').select('*')
      ]);

      if (wRes.data) {
        const sorted = [...wRes.data].reverse();
        setWorkers(sorted as SkilledWorker[]);
      }
      if (rRes.data) {
        const sorted = [...rRes.data].reverse();
        setRemovalRequests(sorted as RemovalRequest[]);
      }
      if (jRes.data) {
        const sorted = [...jRes.data].reverse();
        setJobs(sorted as Opportunity[]);
      }
      if (eRes.data) {
        const sorted = [...eRes.data].reverse();
        setExams(sorted as EntranceExam[]);
      }
      if (sRes.data) {
        const sorted = [...sRes.data].reverse();
        setScholarships(sorted as Scholarship[]);
      }
      if (nRes.data) {
        const sorted = [...nRes.data].reverse();
        setNotices(sorted as Notice[]);
      }

      setStatusMsg('✅ সকলো তথ্য সফলতাৰে লোড হ’ল (Sync Complete)!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setStatusMsg(`ত্রুটি: ${err.message || 'Error connecting to database'}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- Worker Actions ---
  const handleToggleWorkerStatus = async (id: string | number, currentVerified: boolean) => {
    const nextStatus = !currentVerified;
    const { error } = await supabase.from('skilled_workers').update({ is_verified: nextStatus }).eq('id', id);
    if (!error) {
      setStatusMsg(nextStatus ? '✅ কাৰিকৰৰ নাম অনুমোদন কৰা হ’ল (Approved)' : '⚠️ কাৰিকৰৰ নাম স্থগিত কৰা হ’ল (Pending)');
      fetchAllData();
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteWorker = async (id: string | number) => {
    if (window.confirm('নিশ্চিতনে এই কাৰিকৰৰ নাম সম্পূৰ্ণৰূপে মচি পেলাব? (Permanently remove worker?)')) {
      const { error } = await supabase.from('skilled_workers').delete().eq('id', id);
      if (!error) fetchAllData();
      else alert(`Delete error: ${error.message}`);
    }
  };

  // --- Process Removal Request ---
  const handleApproveRemovalRequest = async (req: RemovalRequest) => {
    if (window.confirm(`নিশ্চিতনে ${req.worker_name} (${req.phone_number})-ৰ নাম ডাইৰেক্টৰিৰ পৰা আঁতৰাব?`)) {
      await supabase.from('skilled_workers').delete().eq('phone_number', req.phone_number);
      await supabase.from('worker_removal_requests').delete().eq('id', req.id);
      setStatusMsg(`✅ ${req.worker_name}-ৰ নাম সফলতাৰে আঁতৰোৱা হ’ল!`);
      fetchAllData();
    }
  };

  const handleDismissRemovalRequest = async (id: string | number) => {
    if (window.confirm('এই অনুৰোধ নাকচ কৰিব বিচাৰিছেনে?')) {
      await supabase.from('worker_removal_requests').delete().eq('id', id);
      fetchAllData();
    }
  };

  // --- Opportunity Actions ---
  const handleToggleJobStatus = async (id: string | number, currentApproved: boolean) => {
    const nextStatus = !currentApproved;
    const { error } = await supabase.from('opportunities').update({ is_approved: nextStatus }).eq('id', id);
    if (!error) {
      setStatusMsg(nextStatus ? '✅ নিয়োগ পদ অনুমোদন কৰা হ’ল' : '⚠️ নিয়োগ পদ প্ৰত্যাখ্যান / লুকুওৱা হ’ল');
      fetchAllData();
    }
  };

  const handleDeleteJob = async (id: string | number) => {
    if (window.confirm('নিশ্চিতনে এই নিয়োগ বাৰ্তা মচি পেলাব? (Delete opportunity?)')) {
      const { error } = await supabase.from('opportunities').delete().eq('id', id);
      if (!error) fetchAllData();
    }
  };

  // --- Scholarship Actions ---
  const handleToggleScholarshipStatus = async (id: string | number, currentApproved: boolean) => {
    const nextStatus = !currentApproved;
    const { error } = await supabase.from('scholarships').update({ is_approved: nextStatus }).eq('id', id);
    if (!error) {
      setStatusMsg(nextStatus ? '✅ ছাত্ৰবৃত্তি অনুমোদন কৰা হ’ল' : '⚠️ ছাত্ৰবৃত্তি প্ৰত্যাখ্যান / লুকুওৱা হ’ল');
      fetchAllData();
    }
  };

  const handleDeleteScholarship = async (id: string | number) => {
    if (window.confirm('নিশ্চিতনে এই ছাত্ৰবৃত্তি মচি পেলাব? (Delete scholarship?)')) {
      const { error } = await supabase.from('scholarships').delete().eq('id', id);
      if (!error) fetchAllData();
    }
  };

  // --- Entrance Exam Actions ---
  const handleToggleExamStatus = async (id: string | number, currentApproved: boolean) => {
    const nextStatus = !currentApproved;
    const { error } = await supabase.from('entrance_exams').update({ is_approved: nextStatus }).eq('id', id);
    if (!error) {
      setStatusMsg(nextStatus ? '✅ প্ৰৱেশ পৰীক্ষা অনুমোদন কৰা হ’ল' : '⚠️ প্ৰৱেশ পৰীক্ষা প্ৰত্যাখ্যান / লুকুওৱা হ’ল');
      fetchAllData();
    }
  };

  const handleDeleteExam = async (id: string | number) => {
    if (window.confirm('নিশ্চিতনে এই পৰীক্ষা মচি পেলাব? (Delete exam?)')) {
      const { error } = await supabase.from('entrance_exams').delete().eq('id', id);
      if (!error) fetchAllData();
    }
  };

  // --- Notice Actions ---
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('notices').insert([{
      title_en: noticeTitleEn,
      title_as: noticeTitleAs,
      details_en: noticeDetailsEn,
      details_as: noticeDetailsAs,
      is_pinned: noticePinned
    }]);

    if (!error) {
      setNoticeTitleEn('');
      setNoticeTitleAs('');
      setNoticeDetailsEn('');
      setNoticeDetailsAs('');
      setNoticePinned(false);
      fetchAllData();
      alert('জাননী সফলভাৱে প্ৰকাশ পালে! (Notice Published)');
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  const handleToggleNoticePin = async (id: string | number, currentPinned: boolean) => {
    const { error } = await supabase.from('notices').update({ is_pinned: !currentPinned }).eq('id', id);
    if (!error) fetchAllData();
  };

  const handleDeleteNotice = async (id: string | number) => {
    if (window.confirm('এই জাননীখন মচি পেলাব বিচাৰিছেনে? (Delete notice?)')) {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (!error) fetchAllData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">স্বেচ্ছাসেৱক এডমিন লগ-ইন</h2>
            <p className="text-xs text-slate-400 mt-1">Volunteer Admin Authentication</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="admin@choladhara.village"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-3 rounded-xl text-sm transition shadow-lg mt-2"
            >
              লগ ইন কৰক (Sign In)
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition">
              <HomeIcon className="w-3.5 h-3.5" />
              <span>মুখ্য পৃষ্ঠালৈ ঘূৰি যাওক (Back to Home)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayedWorkers = workers.filter(w => {
    if (workerFilter === 'APPROVED') return w.is_verified;
    if (workerFilter === 'PENDING') return !w.is_verified;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              title="Return to Public Homepage"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <HomeIcon className="w-4 h-4" />
              <span>মুখ্য পৃষ্ঠা (Home)</span>
            </Link>

            <div>
              <h1 className="text-sm sm:text-base font-black flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>চোলাধৰা এডমিন পেনেল</span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{session.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'আপডেট হৈছে...' : 'ৰিফ্ৰেছ (Refresh)'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগ আউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {statusMsg && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 text-emerald-300 text-xs py-2 px-4 text-center font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6 w-full space-y-6">
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button 
            onClick={() => { setActiveTab('workers'); setWorkerFilter('ALL'); }}
            className={`p-4 rounded-2xl border text-left transition ${activeTab === 'workers' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>দক্ষ কৰ্মী</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black mt-2 text-white">{workers.length}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">{workers.filter(w => w.is_verified).length} অনুমোদিত • {workers.filter(w => !w.is_verified).length} বাকী</p>
          </button>

          <button 
            onClick={() => setActiveTab('removals')}
            className={`p-4 rounded-2xl border text-left transition ${activeTab === 'removals' ? 'bg-rose-950/60 border-rose-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>প্ৰত্যাহাৰ অনুৰোধ</span>
              <UserMinus className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black mt-2 text-rose-400">{removalRequests.length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">নতুন অনুৰোধ</p>
          </button>

          <button 
            onClick={() => setActiveTab('jobs')}
            className={`p-4 rounded-2xl border text-left transition ${activeTab === 'jobs' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>নিয়োগ বাৰ্তা</span>
              <Briefcase className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-black mt-2 text-white">{jobs.length}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">{jobs.filter(j => j.is_approved).length} অনুমোদিত</p>
          </button>

          <button 
            onClick={() => setActiveTab('exams')}
            className={`p-4 rounded-2xl border text-left transition ${activeTab === 'exams' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>প্ৰৱেশ পৰীক্ষা</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black mt-2 text-white">{exams.length}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">{exams.filter(e => e.is_approved).length} অনুমোদিত</p>
          </button>

          <button 
            onClick={() => setActiveTab('scholarships')}
            className={`p-4 rounded-2xl border text-left transition ${activeTab === 'scholarships' ? 'bg-emerald-950/60 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>ছাত্ৰবৃত্তি</span>
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black mt-2 text-white">{scholarships.length}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">{scholarships.filter(s => s.is_approved).length} অনুমোদিত</p>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
          <button 
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'workers' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            দক্ষ কৰ্মী ব্যৱস্থাপনা ({workers.length})
          </button>

          <button 
            onClick={() => setActiveTab('removals')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'removals' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            প্ৰত্যাহাৰ অনুৰোধ ({removalRequests.length})
          </button>

          <button 
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'notices' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            জাননী প্ৰকাশ ({notices.length})
          </button>

          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'jobs' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            নিয়োগ ({jobs.length})
          </button>

          <button 
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'scholarships' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            ছাত্ৰবৃত্তি ({scholarships.length})
          </button>

          <button 
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${activeTab === 'exams' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            পৰীক্ষা ({exams.length})
          </button>
        </div>

        {/* Section 1: Worker Management with All / Approved / Pending Filters */}
        {activeTab === 'workers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>কাৰিকৰ আবেদন নিয়ন্ত্ৰণ ({displayedWorkers.length})</span>
                </h3>
                <p className="text-xs text-slate-400">অনুমোদিত কাৰিকৰসকল পোনপটীয়াকৈ মুখ্য ৱেবচাইটৰ ডাইৰেক্টৰিত দৃশ্যমান হ’ব।</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setWorkerFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${workerFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                >
                  সকলো ({workers.length})
                </button>
                <button
                  onClick={() => setWorkerFilter('APPROVED')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${workerFilter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-emerald-400'}`}
                >
                  অনুমোদিত ({workers.filter(w => w.is_verified).length})
                </button>
                <button
                  onClick={() => setWorkerFilter('PENDING')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${workerFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-amber-400'}`}
                >
                  অনুমোদন বাকী ({workers.filter(w => !w.is_verified).length})
                </button>
              </div>
            </div>

            {displayedWorkers.length > 0 ? (
              <div className="space-y-3">
                {displayedWorkers.map(w => (
                  <div key={w.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-3 hover:border-slate-700 transition">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-sm">{w.full_name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${w.is_verified ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                          {w.is_verified ? '✓ প্ৰমাণিত (Approved)' : '⏳ অনুমোদন বাকী (Pending)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{w.skill_as || w.skill_en} • <span className="text-slate-300">{w.chuburi_ward}</span></p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">📞 {w.phone_number}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {!w.is_verified ? (
                        <button
                          onClick={() => handleToggleWorkerStatus(w.id, false)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>অনুমোদন (Approve)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleWorkerStatus(w.id, true)}
                          className="bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>প্ৰত্যাখ্যান (Reject)</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteWorker(w.id)}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>মচক (Remove)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">বৰ্তমান এই শ্ৰেণীত কোনো কৰ্মী নাই।</p>
            )}
          </div>
        )}

        {/* Section 2: Worker Removal Requests */}
        {activeTab === 'removals' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-rose-400" />
                <span>কাৰিকৰৰ নাম প্ৰত্যাহাৰৰ অনুৰোধ ({removalRequests.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">যিসকল কৰ্মীয়ে নিজৰ নাম বা ফোন নম্বৰ ডাইৰেক্টৰিৰ পৰা আঁতৰাব বিচাৰিছে।</p>
            </div>

            {removalRequests.length > 0 ? (
              <div className="space-y-3">
                {removalRequests.map(req => (
                  <div key={req.id} className="p-4 bg-slate-950 border border-rose-900/40 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{req.worker_name}</h4>
                        <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold">
                          প্ৰত্যাহাৰ অনুৰোধ
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-1">📞 ফোন: {req.phone_number}</p>
                      {req.reason && (
                        <p className="text-xs text-slate-400 mt-0.5">কাৰণ: <span className="text-slate-300 italic">"{req.reason}"</span></p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveRemovalRequest(req)}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>নাম আঁতৰাওক (Remove Worker)</span>
                      </button>

                      <button
                        onClick={() => handleDismissRemovalRequest(req.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition"
                      >
                        <span>নাকচ (Dismiss)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">বৰ্তমান কোনো নাম প্ৰত্যাহাৰৰ অনুৰোধ নাই।</p>
            )}
          </div>
        )}

        {/* Section 3: Notices */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>নতুন জাননী প্ৰকাশ কৰক</span>
              </h3>

              <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Title (অসমীয়া)</label>
                  <input
                    type="text"
                    required
                    value={noticeTitleAs}
                    onChange={e => setNoticeTitleAs(e.target.value)}
                    placeholder="উদা: বিনামূলীয়া চকু পৰীক্ষা শিবিৰ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={noticeTitleEn}
                    onChange={e => setNoticeTitleEn(e.target.value)}
                    placeholder="e.g. Free Eye Checkup Camp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Details (অসমীয়া)</label>
                  <textarea
                    rows={3}
                    required
                    value={noticeDetailsAs}
                    onChange={e => setNoticeDetailsAs(e.target.value)}
                    placeholder="বিস্তাৰিত বিৱৰণ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Details (English)</label>
                  <textarea
                    rows={2}
                    value={noticeDetailsEn}
                    onChange={e => setNoticeDetailsEn(e.target.value)}
                    placeholder="Detailed notice in English..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={noticePinned}
                    onChange={e => setNoticePinned(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <label htmlFor="pinned" className="text-slate-300">জৰুৰী / Pinned জাননী হিচাপে ৰাখক</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition mt-2 shadow"
                >
                  জাননী প্ৰকাশ কৰক (Publish Notice)
                </button>
              </form>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">সক্ৰিয় জাননী নিয়ন্ত্ৰণ ({notices.length})</h3>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {notices.map(n => (
                  <div key={n.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs">{n.title_as || n.title_en}</h4>
                        {n.is_pinned && (
                          <span className="text-[9px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.2 rounded">জৰুৰী Pinned</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.details_as || n.details_en}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleNoticePin(n.id, n.is_pinned)}
                        className="p-1.5 text-amber-400 hover:bg-amber-950/50 rounded-lg transition"
                      >
                        {n.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-950/50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Jobs */}
        {activeTab === 'jobs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">নিয়োগ আৰু আত্মসংস্থাপন পদ নিয়ন্ত্ৰণ ({jobs.length})</h3>
            <div className="space-y-3">
              {jobs.map(j => {
                const item = j as any;
                return (
                  <div key={j.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{j.title_as || j.title_en}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${j.is_approved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                          {j.is_approved ? 'অনুমোদিত' : 'লুকুওৱা (Hidden)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.organization || item.department_en || 'Govt / Scheme'} {item.salary_stipend ? `• ${item.salary_stipend}` : ''} • শেষ তাৰিখ: {j.deadline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleJobStatus(j.id, j.is_approved)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${j.is_approved ? 'bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                      >
                        {j.is_approved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{j.is_approved ? 'প্ৰত্যাখ্যান' : 'অনুমোদন'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteJob(j.id)}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মচক</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 5: Scholarships */}
        {activeTab === 'scholarships' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">ছাত্ৰবৃত্তি আঁচনি নিয়ন্ত্ৰণ ({scholarships.length})</h3>
            <div className="space-y-3">
              {scholarships.map(s => {
                const item = s as any;
                return (
                  <div key={s.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{s.title_as || s.title_en}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${s.is_approved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                          {s.is_approved ? 'অনুমোদিত' : 'লুকুওৱা (Hidden)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.provider || 'Govt'} {item.amount ? `• ${item.amount}` : ''} • শেষ তাৰিখ: {s.deadline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleScholarshipStatus(s.id, s.is_approved)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${s.is_approved ? 'bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                      >
                        {s.is_approved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{s.is_approved ? 'প্ৰত্যাখ্যান' : 'অনুমোদন'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteScholarship(s.id)}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মচক</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 6: Entrance Exams */}
        {activeTab === 'exams' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">প্ৰৱেশ পৰীক্ষা নিয়ন্ত্ৰণ ({exams.length})</h3>
            <div className="space-y-3">
              {exams.map(e => {
                const item = e as any;
                return (
                  <div key={e.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">{item.exam_as || item.exam_name || item.title_as || item.title_en}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${e.is_approved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                          {e.is_approved ? 'অনুমোদিত' : 'লুকুওৱা (Hidden)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.conducting_body || 'Authority'} • পৰীক্ষা: {item.exam_date || item.deadline}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleExamStatus(e.id, e.is_approved)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${e.is_approved ? 'bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                      >
                        {e.is_approved ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        <span>{e.is_approved ? 'প্ৰত্যাখ্যান' : 'অনুমোদন'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteExam(e.id)}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মচক</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
