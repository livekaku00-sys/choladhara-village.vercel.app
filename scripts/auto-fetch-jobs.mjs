import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

// 1. Auto-load Supabase credentials
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
const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

// Expanded multi-source feed endpoints
const JOB_FEEDS = [
  { name: 'Assam Career', url: 'https://assamcareer.com/feed/' },
  { name: 'Assam Job Alerts', url: 'https://assamjobalerts.com/feed/' },
  { name: 'Assam Career Now', url: 'https://assamcareernow.com/feed/' }
];

const DEPT_PATTERNS = [
  { match: /SSC\b|Staff Selection Commission|CGL|CHSL|MTS|GD Constable/i, name: 'SSC (Central Govt)', tag: 'Central' },
  { match: /UPSC|Civil Services|NDA|CDS|CAPF/i, name: 'UPSC', tag: 'Central' },
  { match: /Railway|RRB|NFR|RPF|ALP|NTPC/i, name: 'Indian Railways / NFR Guwahati', tag: 'Central' },
  { match: /India Post|Postal|GDS|Postman/i, name: 'India Post (Assam Circle)', tag: 'Central' },
  { match: /IBPS|SBI|RBI|Gramin Vikash|AGVB|Apex Bank/i, name: 'Banking (IBPS / SBI / AGVB)', tag: 'Central' },
  { match: /Assam Rifles|Army|Agniveer|CISF|CRPF|BSF|ITBP|SSB/i, name: 'Assam Rifles & Defence', tag: 'Central' },
  { match: /Oil India|OIL|ONGC|IOCL|Digboi|NRL|Numaligarh/i, name: 'PSUs in Assam (OIL, ONGC, NRL)', tag: 'Central' },
  { match: /AIIMS|IIT Guwahati|NIT Silchar|Tezpur University/i, name: 'Central Institutes in Assam', tag: 'Central' },
  { match: /APSC/i, name: 'APSC (Assam Public Service Commission)', tag: 'Assam State' },
  { match: /SLPRB|Police|Constable|Sub-Inspector|Excise|Jail|Forest/i, name: 'SLPRB / Assam Police & Forests', tag: 'Assam State' },
  { match: /ADRE|Grade III|Grade IV|State Level Recruitment/i, name: 'SLRC / ADRE (Grade III & IV)', tag: 'Assam State' },
  { match: /SSA|Samagra Shiksha|Elementary TET/i, name: 'SSA Assam (Samagra Shiksha)', tag: 'Assam State' },
  { match: /DSE|Secondary Education|PGT|TGT|Teacher/i, name: 'Directorate of Secondary Education (DSE)', tag: 'Assam State' },
  { match: /DHE|Higher Education|Professor|College/i, name: 'Directorate of Higher Education (DHE)', tag: 'Assam State' },
  { match: /DTE|Polytechnic|Engineering/i, name: 'DTE Assam (Technical Education)', tag: 'Assam State' },
  { match: /NHM|DME|DHS|Health|Nurse|Medical|ANM|GNM/i, name: 'Health & Family Welfare Assam', tag: 'Assam State' },
  { match: /APDCL|AEGCL|APGCL|Power/i, name: 'Assam Power Sector (APDCL/AEGCL)', tag: 'Assam State' },
  { match: /PWD|Public Works|Roads/i, name: 'PWD Assam (Roads & Building)', tag: 'Assam State' },
  { match: /Irrigation|Water Resources/i, name: 'Irrigation & Water Resources Assam', tag: 'Assam State' },
  { match: /PNRD|Panchayat|Rural Development/i, name: 'PNRD Assam', tag: 'Assam State' },
  { match: /Agriculture|AAU|Veterinary|Fishery|Fisheries/i, name: 'Agriculture & Allied Depts Assam', tag: 'Assam State' },
  { match: /High Court|District Court|Judicial/i, name: 'Gauhati High Court & Judiciary', tag: 'Assam State' },
  { match: /DC Office|Deputy Commissioner|District Commissioner|Charaideo|Sivasagar|Jorhat|Dibrugarh/i, name: 'District Administration Assam', tag: 'Assam State' }
];

function identifyDepartment(title) {
  for (const dept of DEPT_PATTERNS) {
    if (dept.match.test(title)) {
      return { organization: dept.name, tag: dept.tag };
    }
  }
  return { organization: 'Govt of Assam / Central Dept', tag: 'General' };
}

async function runJobSync() {
  console.log('🚀 Connecting to Supabase...');
  let totalNewJobs = 0;

  // 1. Fetch existing titles
  const { data: existingJobs, error: fetchErr } = await supabase
    .from('opportunities')
    .select('title_en, title_as');

  if (fetchErr) {
    console.warn('⚠️ Existing jobs fetch notice:', fetchErr.message);
  }

  const existingTitles = new Set(
    (existingJobs || []).flatMap(j => [
      (j.title_en || '').toLowerCase().trim(),
      (j.title_as || '').toLowerCase().trim()
    ])
  );

  console.log(`📋 Existing jobs in database: ${existingTitles.size}`);

  // 2. Scan feeds
  for (const feedObj of JOB_FEEDS) {
    try {
      console.log(`\n📡 Fetching [${feedObj.name}]: ${feedObj.url}`);
      const feed = await parser.parseURL(feedObj.url);
      const items = feed.items || [];
      console.log(`   Found ${items.length} items in feed.`);

      for (const item of items.slice(0, 20)) {
        const rawTitle = (item.title || '').trim();
        if (!rawTitle) continue;

        // Skip non-recruitment articles (Admit cards, Answer keys, Results)
        if (/Admit Card|Answer Key|Result Declared|Exam Date|Syllabus/i.test(rawTitle)) {
          console.log(`   ⏩ Skipping non-job: ${rawTitle}`);
          continue;
        }

        // Check duplicate
        if (existingTitles.has(rawTitle.toLowerCase())) {
          console.log(`   🔁 Already exists in DB: ${rawTitle}`);
          continue;
        }

        const { organization, tag } = identifyDepartment(rawTitle);

        const newJob = {
          title_en: rawTitle,
          title_as: rawTitle,
          organization: `${organization} • [${tag}]`,
          salary_stipend: tag === 'Central' ? '7th CPC Central Pay Scale' : 'As per Assam ROP / Pay Band',
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_approved: false
        };

        const { error: insertErr } = await supabase.from('opportunities').insert([newJob]);
        if (!insertErr) {
          console.log(`   ✅ Queued [${tag} - ${organization}]: ${rawTitle}`);
          existingTitles.add(rawTitle.toLowerCase());
          totalNewJobs++;
        } else {
          console.warn(`   ⚠️ Insert error: ${insertErr.message}`);
        }
      }
    } catch (err) {
      console.warn(`   ⚠️ Feed fetch failed for ${feedObj.name}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Job Sync Complete! ${totalNewJobs} new recruitment notices queued into Supabase.`);
}

runJobSync();
