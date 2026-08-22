import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// 1. Load .env config
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLiveExams() {
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  console.log('\n======================================================================');
  console.log(`📡 CHOLADHARA PORTAL: LIVE EXAM APPLICATION AUDIT`);
  console.log(`📅 Current Date: ${todayIso}`);
  console.log('======================================================================\n');

  // Fetch all exams whose deadline has not expired yet
  const { data: exams, error } = await supabase
    .from('entrance_exams')
    .select('*')
    .gte('deadline', todayIso)
    .order('deadline', { ascending: true });

  if (error) {
    console.error('\x1b[31m%s\x1b[0m', `❌ Database query error: ${error.message}`);
    return;
  }

  if (!exams || exams.length === 0) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️ No open exam applications found in database with future deadlines.');
    console.log('👉 Run "npx tsx scripts/exam-tracker.ts" to scan and ingest upcoming cycles.\n');
    return;
  }

  const liveApproved = exams.filter(e => e.is_approved);
  const pendingReview = exams.filter(e => !e.is_approved);

  console.log(`📊 Summary: \x1b[32m${liveApproved.length} Live on Website\x1b[0m | \x1b[33m${pendingReview.length} Pending Admin Approval\x1b[0m\n`);

  exams.forEach((exam, idx) => {
    const deadlineDate = new Date(exam.deadline);
    const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    const statusTag = exam.is_approved 
      ? '\x1b[42m\x1b[30m LIVE ON PORTAL \x1b[0m' 
      : '\x1b[43m\x1b[30m PENDING APPROVAL \x1b[0m';

    const urgencyTag = daysLeft <= 15 
      ? `\x1b[31m[CLOSING SOON: ${daysLeft} days left]\x1b[0m`
      : `\x1b[36m[${daysLeft} days left]\x1b[0m`;

    console.log(`${idx + 1}. ${exam.exam_name_en} (${exam.exam_name_as})`);
    console.log(`   🏛️  Authority : ${exam.conducting_body}`);
    console.log(`   ⏳ Deadline  : ${exam.deadline} ${urgencyTag}`);
    console.log(`   🚦 Status    : ${statusTag}`);
    console.log(`   🔗 Link      : ${exam.apply_link}`);
    console.log('----------------------------------------------------------------------');
  });

  console.log('\n💡 Tip: To approve pending exams, log in at http://localhost:5173/admin\n');
}

checkLiveExams();
