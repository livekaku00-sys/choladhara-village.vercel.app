process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Auto-load credentials from local .env
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

const VERIFIED_GOVT_BOARDS = [
  {
    org: 'APSC (Assam Public Service Commission)',
    tag: 'Assam State',
    url: 'https://apsc.nic.in/',
    baseUrl: 'https://apsc.nic.in'
  },
  {
    org: 'SLRC / ADRE (SEBA Online)',
    tag: 'Assam State',
    url: 'https://site.sebaonline.org/',
    baseUrl: 'https://site.sebaonline.org'
  },
  {
    org: 'Gauhati High Court',
    tag: 'Assam State',
    url: 'https://ghconline.gov.in/',
    baseUrl: 'https://ghconline.gov.in'
  },
  {
    org: 'SLPRB Assam Police',
    tag: 'Assam State',
    url: 'https://slprbassam.in/',
    baseUrl: 'https://slprbassam.in'
  },
  {
    org: 'Oil India Limited (Assam Field HQ)',
    tag: 'Central PSU',
    url: 'https://www.oil-india.com/',
    baseUrl: 'https://www.oil-india.com'
  }
];

function resolveUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href.startsWith('http') ? href : `${baseUrl.replace(/\/$/, '')}/${href.replace(/^\//, '')}`;
  }
}

function cleanTitle(raw) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/^\s*\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\s*/g, '') // remove leading dates like 26/02/2026
    .replace(/\b(NEW|new|New)\b/g, '')                            // remove 'new' badges
    .replace(/\s+/g, ' ')
    .trim();
}

async function syncVerifiedPortals() {
  console.log('🏛️ Scanning Official Boards with Strict Noise Filters...\n');
  let totalInserted = 0;

  const { data: existingJobs } = await supabase
    .from('opportunities')
    .select('title_en, apply_url');

  const existingTitles = new Set((existingJobs || []).map(j => (j.title_en || '').toLowerCase().trim()));
  const existingUrls = new Set((existingJobs || []).map(j => (j.apply_url || '').trim()));

  for (const board of VERIFIED_GOVT_BOARDS) {
    try {
      console.log(`📡 Scanning: ${board.org}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(board.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const html = await res.text();
      const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let boardCount = 0;

      while ((match = anchorRegex.exec(html)) !== null) {
        const href = match[1].trim();
        const rawText = match[2];
        const title = cleanTitle(rawText);

        if (!title || title.length < 15) continue;

        // 1. REJECT ADMINISTRATIVE NOISE, RESULTS, AND CANDIDATE LISTS
        const isJunk = /list of candidate|shortlist|interview|viva-voce|screening test|omr based|omr-based|written exam|postponement|stay order|promotional exam|departmental exam|leave order|cut-off|marks secured|result|answer key|admit card|corrigendum|rejection|syllabus|judges|vol-i|cfo|tender|quotation/i.test(title);
        if (isJunk) continue;

        // 2. REQUIRE EXPLICIT FRESH HIRING INTENT
        const isDirectJob = /advertisement|advt|direct recruitment|class iii posts|class iv posts|grade-iii|grade-iv|grade iii|grade iv|vacanc|recruitment to the post|assistant geologist|chemist|drilling engineer|mining engineer|geophysicist|research assistant|veterinary officer|assistant manager/i.test(title);
        if (!isDirectJob) continue;

        if (existingTitles.has(title.toLowerCase())) continue;

        const applyUrl = resolveUrl(href, board.baseUrl);
        if (existingUrls.has(applyUrl)) continue;

        const isCentral = board.tag.includes('Central');
        const isADRE = /adre|slrc|grade/i.test(title) || board.org.includes('ADRE');

        const newNotice = {
          title_en: title,
          title_as: title,
          organization: `${board.org} • [${board.tag}]`,
          salary_stipend: isADRE 
            ? 'Pay Band 2 / Pay Band 1 (Assam ROP Rules)' 
            : isCentral 
              ? 'Central Pay Scale (7th CPC)' 
              : 'Govt of Assam Pay Band / Norms',
          apply_url: applyUrl,
          deadline: null,
          is_approved: false
        };

        const { error: insertErr } = await supabase.from('opportunities').insert([newNotice]);

        if (!insertErr) {
          console.log(`   ✅ Queued Valid Job Notice: ${title.substring(0, 80)}...`);
          existingTitles.add(title.toLowerCase());
          existingUrls.add(applyUrl);
          totalInserted++;
          boardCount++;
        }
      }

      if (boardCount === 0) {
        console.log(`   ℹ️ No un-synced recruitment notices.`);
      }

    } catch (err) {
      console.warn(`   ⚠️ ${board.org} connection error:`, err.message);
    }
  }

  console.log(`\n🎉 Sync Complete! ${totalInserted} clean, genuine recruitment notices queued.`);
}

syncVerifiedPortals();
