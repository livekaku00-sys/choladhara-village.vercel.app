// 1. Bypass NIC / Government SSL certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load credentials from local .env
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

// Canonical Root Endpoints for Assam & Central Recruitment
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

async function syncVerifiedPortals() {
  console.log('🏛️ Connecting to Verified Government Root Notice Boards...\n');
  let totalInserted = 0;

  // Retrieve existing records to avoid duplicates
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
      console.log(`📡 Scanning: ${board.org}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(board.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        redirect: 'follow',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`   ⚠️ ${board.org} returned HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Extract all anchor tags with valid links
      const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let boardCount = 0;

      while ((match = anchorRegex.exec(html)) !== null) {
        const href = match[1].trim();
        let rawText = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

        if (!rawText || rawText.length < 12) continue;

        // Recruitment filter matching official terminology
        const isRecruitment = /recruitment|advertisement|advt|vacancy|vacancies|post of|appointment|walk-in|adre|slrc|grade-iii|grade-iv|grade iii|grade iv|officer|assistant|engineer/i.test(rawText);
        if (!isRecruitment) continue;

        // Exclude generic navigation or examination administrative steps
        if (/admit card|result|answer key|corrigendum|rejection|syllabus|click here|download|view all|archive/i.test(rawText)) continue;

        if (existingTitles.has(rawText.toLowerCase())) continue;

        const applyUrl = resolveUrl(href, board.baseUrl);
        if (existingUrls.has(applyUrl)) continue;

        const isCentral = board.tag.includes('Central');
        const isADRE = /adre|slrc|grade/i.test(rawText) || board.org.includes('ADRE');

        const newNotice = {
          title_en: rawText,
          title_as: rawText,
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
          console.log(`   ✅ Queued Official Notice: ${rawText.substring(0, 75)}...`);
          existingTitles.add(rawText.toLowerCase());
          existingUrls.add(applyUrl);
          totalInserted++;
          boardCount++;
        }
      }

      if (boardCount === 0) {
        console.log(`   ℹ️ Connected successfully. No new un-synced notices found.`);
      }

    } catch (err) {
      console.warn(`   ⚠️ ${board.org} connection error:`, err.message);
    }
  }

  console.log(`\n🎉 Verification Complete! ${totalInserted} authentic notices queued in Supabase.`);
}

syncVerifiedPortals();
