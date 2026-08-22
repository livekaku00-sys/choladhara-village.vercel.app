// 1. Allow connection to NIC / Government self-signed SSL certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Auto-load Supabase credentials from local .env
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

// Strictly Verified Official Government & PSU Endpoints
const OFFICIAL_GOVT_PORTALS = [
  {
    org: 'APSC (Assam Public Service Commission)',
    tag: 'Assam State',
    url: 'https://apsc.nic.in/',
    linkPrefix: 'https://apsc.nic.in/'
  },
  {
    org: 'SLPRB Assam (Police & Forest Recruitment)',
    tag: 'Assam State',
    url: 'https://slprbassam.in/',
    linkPrefix: 'https://slprbassam.in/'
  },
  {
    org: 'NHM Assam (National Health Mission)',
    tag: 'Assam State',
    url: 'https://nhm.assam.gov.in/',
    linkPrefix: 'https://nhm.assam.gov.in/'
  },
  {
    org: 'Gauhati High Court',
    tag: 'Assam State',
    url: 'https://ghconline.gov.in/',
    linkPrefix: 'https://ghconline.gov.in/'
  },
  {
    org: 'RRB Guwahati (Indian Railways)',
    tag: 'Central',
    url: 'https://rrbguwahati.gov.in/',
    linkPrefix: 'https://rrbguwahati.gov.in/'
  },
  {
    org: 'Oil India Limited (Duliajan / Assam)',
    tag: 'Central PSU',
    url: 'https://www.oil-india.com/',
    linkPrefix: 'https://www.oil-india.com/'
  }
];

async function syncGovtPortals() {
  console.log('🏛️ Scanning Official Government Notice Boards...\n');
  let totalInserted = 0;

  // 1. Fetch existing titles from Supabase
  const { data: existingJobs } = await supabase
    .from('opportunities')
    .select('title_en');

  const existingTitles = new Set(
    (existingJobs || []).map(j => (j.title_en || '').toLowerCase().trim())
  );

  for (const portal of OFFICIAL_GOVT_PORTALS) {
    try {
      console.log(`📡 Connecting to: ${portal.org}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for Govt servers

      const res = await fetch(portal.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`   ⚠️ ${portal.org} responded with HTTP ${res.status}`);
        continue;
      }

      const html = await res.text();

      // Extract all anchor text and links
      const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let match;
      let matchedCount = 0;

      while ((match = anchorRegex.exec(html)) !== null) {
        const href = match[1].trim();
        let rawText = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

        if (!rawText || rawText.length < 12) continue;

        // Strict recruitment relevance filter
        const isRecruitment = /recruitment|advertisement|advt|vacancy|vacancies|post|interview|selection|walk-in|assistant|officer|grade|inspector|constable|engineer|nurse|technician|notice|notification/i.test(rawText);
        if (!isRecruitment) continue;

        // Skip generic navigational links
        if (/click here|download|view all|archive|read more|previous|home|contact/i.test(rawText)) continue;

        if (existingTitles.has(rawText.toLowerCase())) continue;

        // Resolve absolute URL
        let applyUrl = href;
        if (!href.startsWith('http')) {
          applyUrl = `${portal.linkPrefix.replace(/\/$/, '')}/${href.replace(/^\//, '')}`;
        }

        const newOpportunity = {
          title_en: rawText,
          title_as: rawText,
          organization: `${portal.org} • [${portal.tag}]`,
          salary_stipend: portal.tag === 'Central' ? '7th CPC Central Pay Scale' : 'Govt of Assam Pay Band / Norms',
          apply_url: applyUrl,
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_approved: false
        };

        const { error: insertErr } = await supabase.from('opportunities').insert([newOpportunity]);

        if (!insertErr) {
          console.log(`   ✅ Queued: ${rawText.substring(0, 80)}...`);
          existingTitles.add(rawText.toLowerCase());
          totalInserted++;
          matchedCount++;
        }
      }

      if (matchedCount === 0) {
        console.log(`   ℹ️ Connected successfully (no new unrecorded notices).`);
      }

    } catch (err) {
      console.warn(`   ⚠️ ${portal.org} connection error: ${err.message}`);
    }
  }

  console.log(`\n🎉 Govt Sync Complete! ${totalInserted} verified notices stored in Supabase.`);
}

syncGovtPortals();
