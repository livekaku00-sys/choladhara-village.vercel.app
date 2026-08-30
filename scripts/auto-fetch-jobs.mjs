import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// 1. Bypass legacy NIC certificate validation errors on Indian Govt portals
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 2. Auto-load Supabase credentials from local .env
let envUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
let envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!envUrl || !envKey) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1].trim();
          let val = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
          if ((key === 'VITE_SUPABASE_URL' || key === 'SUPABASE_URL') && !envUrl) envUrl = val;
          if ((key === 'VITE_SUPABASE_ANON_KEY' || key === 'SUPABASE_ANON_KEY' || key === 'SUPABASE_SERVICE_ROLE_KEY') && !envKey) envKey = val;
        }
      }
    }
  } catch (e) {}
}

if (!envUrl || !envKey) {
  console.error('❌ Supabase credentials missing from .env');
  process.exit(1);
}

const supabase = createClient(envUrl, envKey);

// 3. Noise Filter (Block Non-Job Content)
const IGNORE_KEYWORDS = [
  'result', 'marksheet', 'mark sheet', 'answer key', 'omr sheet',
  'interview schedule', 'viva-voce', 'rejection list', 'rejected candidates',
  'admit card', 'call letter', 'cancellation notice', 'corrigendum regarding exam',
  'departmental exam', 'promotional exam', 'tender', 'quotation', 'auction', 'nit no'
];

// 4. Strict Expiry & Date Extraction
function extractAndValidateDeadline(text, fullContent = '') {
  const combined = `${text} ${fullContent}`;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Match explicit closing date patterns (e.g., "Last Date: 15/09/2026", "Closing: 20-10-2026")
  const explicitPattern = /(?:last\s*date|closing\s*date|apply\s*before|upto|till)\s*[:\-\s]*(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})/i;
  const explicitMatch = combined.match(explicitPattern);

  if (explicitMatch) {
    const day = parseInt(explicitMatch[1], 10);
    const month = parseInt(explicitMatch[2], 10) - 1;
    const year = parseInt(explicitMatch[3], 10);
    const parsedDate = new Date(year, month, day);

    if (!isNaN(parsedDate.getTime())) {
      if (parsedDate < now) return { valid: false, reason: `Expired on ${year}-${month + 1}-${day}` };
      return { valid: true, date: parsedDate.toISOString().split('T')[0] };
    }
  }

  // Match textual month dates (e.g., "15 September 2026", "30 Oct 2026")
  const textMonthPattern = /(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*,?\s*(\d{4})/i;
  const textMatch = combined.match(textMonthPattern);

  if (textMatch) {
    const parsed = new Date(`${textMatch[2]} ${textMatch[1]}, ${textMatch[3]}`);
    if (!isNaN(parsed.getTime())) {
      if (parsed < now) return { valid: false, reason: `Expired on ${parsed.toISOString().split('T')[0]}` };
      return { valid: true, date: parsed.toISOString().split('T')[0] };
    }
  }

  // Reject legacy announcements containing past years without current year
  const pastYearMatch = combined.match(/\b(2018|2019|2020|2021|2022|2023|2024|2025)\b/);
  if (pastYearMatch && !combined.includes('2026') && !combined.includes('2027')) {
    return { valid: false, reason: `Past year archive notice (${pastYearMatch[0]})` };
  }

  // Active notice without hardcoded date: assign default 21 days application window
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 21);
  return { valid: true, date: fallback.toISOString().split('T')[0], isEstimated: true };
}

// 5. Official Assam Recruitment Endpoints
const VERIFIED_GOVT_BOARDS = [
  {
    name: 'APSC (Assam Public Service Commission)',
    url: 'https://apsc.nic.in',
    category: 'Graduate',
    organization: 'Assam Public Service Commission',
    organization_as: 'অসম লোকসেৱা আয়োগ (APSC)'
  },
  {
    name: 'SLRC / ADRE (SEBA Online)',
    url: 'https://sebaonline.org',
    category: '12th',
    organization: 'State Level Recruitment Commission, Assam',
    organization_as: 'ৰাজ্যিক পৰ্যায়ৰ নিযুক্তি আয়োগ, অসম'
  },
  {
    name: 'SLPRB Assam Police',
    url: 'https://slprbassam.in',
    category: '10th',
    organization: 'State Level Police Recruitment Board, Assam',
    organization_as: 'অসম আৰক্ষী নিযুক্তি ব’ৰ্ড (SLPRB)'
  },
  {
    name: 'Gauhati High Court Recruitment',
    url: 'https://ghconline.gov.in',
    category: 'Graduate',
    organization: 'Gauhati High Court',
    organization_as: 'গুৱাহাটী উচ্চ ন্যায়ালয়'
  }
];

// 6. Execution Loop
async function syncVerifiedPortals() {
  console.log('🏛️ Scanning Official Recruitment Boards with Active Expiry & Noise Filters...\n');
  let totalInserted = 0;
  let totalSkippedExpired = 0;
  let totalSkippedNoise = 0;

  const { data: existingJobs } = await supabase
    .from('opportunities')
    .select('title_en, official_application_url, apply_url');

  const existingTitles = new Set((existingJobs || []).map(j => (j.title_en || '').toLowerCase().trim()));
  const existingUrls = new Set((existingJobs || []).map(j => (j.official_application_url || j.apply_url || '').trim()));

  for (const board of VERIFIED_GOVT_BOARDS) {
    console.log(`📡 Scanning: ${board.name}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(board.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,as;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.log(`   ⚠️ HTTP ${res.status} received from ${board.name}`);
        continue;
      }

      const html = await res.text();
      const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let boardCount = 0;

      while ((match = linkRegex.exec(html)) !== null) {
        let rawHref = match[1].trim();
        let rawText = match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        if (rawText.length < 15) continue;

        const lowerText = rawText.toLowerCase();

        // 1. Blacklist noise
        if (IGNORE_KEYWORDS.some(kw => lowerText.includes(kw))) {
          totalSkippedNoise++;
          continue;
        }

        // 2. Recruitment keyword requirement
        const isRecruitment = lowerText.includes('recruitment') || 
                              lowerText.includes('advertisement') || 
                              lowerText.includes('advt') || 
                              lowerText.includes('post') || 
                              lowerText.includes('vacancy') ||
                              lowerText.includes('grade');

        if (!isRecruitment) continue;

        // Resolve absolute URL
        let applyUrl = rawHref;
        if (!applyUrl.startsWith('http')) {
          try {
            applyUrl = new URL(rawHref, board.url).href;
          } catch (e) {
            continue;
          }
        }

        // 3. Expiry & Date Verification
        const deadlineValidation = extractAndValidateDeadline(rawText, rawHref);
        if (!deadlineValidation.valid) {
          console.log(`   ⏳ Blocked Expired/Old Notice: "${rawText.substring(0, 50)}..." (${deadlineValidation.reason})`);
          totalSkippedExpired++;
          continue;
        }

        // 4. Duplicate Check
        if (existingTitles.has(lowerText) || existingUrls.has(applyUrl)) {
          continue;
        }

        // 5. Insert Valid Record into Supabase
        const newNotice = {
          title_en: rawText.substring(0, 240),
          title_as: `${board.organization_as}: ${rawText.substring(0, 180)}`,
          organization: board.organization,
          category: board.category,
          eligibility_en: 'As per official recruitment notification',
          eligibility_as: 'অফিচিয়েল নিযুক্তি জাননী অনুসৰি',
          description: `Direct official recruitment notice published by ${board.organization}.`,
          description_assamese: `${board.organization_as}ৰ দ্বাৰা প্ৰকাশিত আনুষ্ঠানিক নিযুক্তি জাননী।`,
          deadline: deadlineValidation.date,
          official_application_url: applyUrl,
          apply_url: applyUrl,
          is_approved: false
        };

        const { error: insertErr } = await supabase.from('opportunities').insert([newNotice]);

        if (!insertErr) {
          console.log(`   ✅ Queued Active Job Notice: ${rawText.substring(0, 60)}... [Deadline: ${deadlineValidation.date}]`);
          existingTitles.add(lowerText);
          existingUrls.add(applyUrl);
          totalInserted++;
          boardCount++;
        }
      }

      if (boardCount === 0) {
        console.log(`   ℹ️ All current active notices already synced.`);
      }

    } catch (err) {
      console.log(`   ⚠️ ${board.name} error: ${err.message || 'connection failed'}`);
    }
  }

  console.log(`\n==================================================`);
  console.log(`🎉 Sync Complete!`);
  console.log(`   • Active Notices Queued:   ${totalInserted}`);
  console.log(`   • Expired Notices Blocked: ${totalSkippedExpired}`);
  console.log(`   • Non-Job Noise Blocked:   ${totalSkippedNoise}`);
  console.log(`==================================================\n`);
}

syncVerifiedPortals();
