process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Auto-load Supabase credentials from local .env
let envUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
let envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!envUrl || !envKey) {
  try {
    const envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
        if (key === 'VITE_SUPABASE_URL' && !envUrl) envUrl = val;
        if ((key === 'VITE_SUPABASE_ANON_KEY' || key === 'SUPABASE_SERVICE_ROLE_KEY') && !envKey) envKey = val;
      }
    }
  } catch (e) {}
}

if (!envUrl || !envKey) {
  console.error('❌ Supabase credentials missing from .env');
  process.exit(1);
}

const supabase = createClient(envUrl, envKey);

// Strictly Verified Notice Boards (Direct Notification Tables Only)
const VERIFIED_GOVT_BOARDS = [
  {
    org: 'APSC (Assam Public Service Commission)',
    tag: 'Assam State',
    url: 'https://apsc.nic.in/notices.asp',
    linkPrefix: 'https://apsc.nic.in/'
  },
  {
    org: 'Gauhati High Court (Recruitment)',
    tag: 'Assam State',
    url: 'https://ghconline.gov.in/NoticeRecruitment.html',
    linkPrefix: 'https://ghconline.gov.in/'
  },
  {
    org: 'RRB Guwahati (Indian Railways)',
    tag: 'Central',
    url: 'https://rrbguwahati.gov.in/notices.html',
    linkPrefix: 'https://rrbguwahati.gov.in/'
  },
  {
    org: 'Oil India Limited (Careers)',
    tag: 'Central PSU',
    url: 'https://www.oil-india.com/current-openings',
    linkPrefix: 'https://www.oil-india.com'
  }
];

async function syncVerifiedPortals() {
  console.log('🏛️ Running Strict Govt Notice Board Verification...\n');
  let totalInserted = 0;

  // Fetch existing approved/draft titles to avoid duplicates
  const { data: existingJobs } = await supabase
    .from('opportunities')
    .select('title_en, apply_url');

  const existingTitles = new Set(
    (existingJobs || []).map(j => (j.title_en || '').toLowerCase().trim())
  );
  const existingUrls = new Set(
    (existingJobs || []).map(j => (j.apply_url || '').trim())
  );

  for (const board of VERIFIED_GOVT_BOARDS) {
    try {
      console.log(`📡 Checking Official Board: ${board.org}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(board.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`   ⚠️ ${board.org} responded with HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();
      // Match links specifically targeting .pdf, .htm, .asp, or notice documents
      const anchorRegex = /<a\s+[^>]*href=["']([^"']+\.(?:pdf|htm|html|asp|aspx|php)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let boardCount = 0;

      while ((match = anchorRegex.exec(html)) !== null) {
        const href = match[1].trim();
        let rawText = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

        if (!rawText || rawText.length < 15) continue;

        // Strict recruitment filter
        const isRecruitment = /recruitment|advertisement|advt|vacancy|vacancies|post of|walk-in-interview|appointment|selection list|grade-iii|grade-iv/i.test(rawText);
        if (!isRecruitment) continue;

        // Skip non-recruitment administrative updates
        if (/corrigendum|result|admit card|answer key|cancellation|rejection|syllabus|marks/i.test(rawText)) continue;
        if (existingTitles.has(rawText.toLowerCase())) continue;

        let applyUrl = href.startsWith('http') 
          ? href 
          : `${board.linkPrefix.replace(/\/$/, '')}/${href.replace(/^\//, '')}`;

        if (existingUrls.has(applyUrl)) continue;

        const newNotice = {
          title_en: rawText,
          title_as: rawText,
          organization: `${board.org} • [${board.tag}]`,
          salary_stipend: board.tag === 'Central' ? 'Central Pay Norms (7th CPC)' : 'Govt of Assam Pay Norms',
          apply_url: applyUrl,
          deadline: null, // Left null so the UI indicates "Check Official PDF"
          is_approved: false
        };

        const { error: insertErr } = await supabase.from('opportunities').insert([newNotice]);

        if (!insertErr) {
          console.log(`   ✅ Verified Notice Queued: ${rawText.substring(0, 75)}...`);
          existingTitles.add(rawText.toLowerCase());
          existingUrls.add(applyUrl);
          totalInserted++;
          boardCount++;
        }
      }

      if (boardCount === 0) {
        console.log(`   ℹ️ No active unrecorded recruitment notices.`);
      }

    } catch (err) {
      console.warn(`   ⚠️ ${board.org} connection error: ${err.message}`);
    }
  }

  console.log(`\n🎉 Verification Complete! ${totalInserted} authentic notices queued.`);
}

syncVerifiedPortals();
