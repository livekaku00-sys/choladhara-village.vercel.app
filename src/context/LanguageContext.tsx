import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'as' | 'en';

export interface Translations {
  siteTitle: string;
  siteSub: string;
  communityBadge: string;
  welcomeHeading: string;
  welcomeDesc: string;
  weatherTitle: string;
  weatherTip: string;
  mspTag: string;
  mspTitle: string;
  mspUnit: string;
  mspDesc: string;
  mgnregaTag: string;
  mgnregaTitle: string;
  mgnregaUnit: string;
  mgnregaDesc: string;
  noticesTitle: string;
  liveBadge: string;
  agriTitle: string;
  oppsTitle: string;
  workersTitle: string;
  workersSub: string;
  btnRegWorker: string;
  footerCopy: string;
  footerNote: string;
}

const translations: Record<Language, Translations> = {
  as: {
    siteTitle: "চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল",
    siteSub: "চৰাইদেউ, অসম - ৭৮৫৬৮৬ | স্বতন্ত্ৰ স্বেচ্ছাসেৱী পদক্ষেপ",
    communityBadge: "ৰাইজৰ সেৱাত স্থানীয় যুৱসমাজ",
    welcomeHeading: "স্বাগতম! চোলাধৰা ডিজিটেল সেৱা কেন্দ্ৰ",
    welcomeDesc: "কৃষি দিহা, চৰকাৰী মজুৰিৰ নিৰিখ, ছাত্ৰবৃত্তি, স্থানীয় কাৰিকৰ আৰু গাঁৱৰ সকলো জৰুৰী জাননী একেটা স্থানতে উপলব্ধ।",
    weatherTitle: "বতৰৰ আগজাননী",
    weatherTip: "কৃষি কাম-কাজৰ বাবে অনুকূল বতৰ।",
    mspTag: "চৰকাৰী সমৰ্থন মূল্য",
    mspTitle: "ধানৰ ক্ৰয় মূল্য (MSP)",
    mspUnit: "/ প্ৰতি কুইণ্টল",
    mspDesc: "সাধাৰণ ধানৰ নিৰ্ধাৰিত চৰকাৰী মূল্য।",
    mgnregaTag: "নৰেগা আঁচনি",
    mgnregaTitle: "MGNREGA দৈনিক মজুৰি",
    mgnregaUnit: "/ প্ৰতি দিন",
    mgnregaDesc: "অসমৰ নিৰ্ধাৰিত দৈনিক জব কাৰ্ড মজুৰি।",
    noticesTitle: "ৰাজহুৱা জাননী আৰু বাৰ্তা",
    liveBadge: "শেহতীয়া",
    agriTitle: "কৃষি দিহা আৰু সাহায্য",
    oppsTitle: "ছাত্ৰবৃত্তি আৰু নিয়োগ বাৰ্তা",
    workersTitle: "গাঁৱৰ দক্ষ কাৰিকৰৰ তালিকা",
    workersSub: "মিস্ত্ৰী, ইলেক্ট্ৰিচিয়ান, চালক আদিৰ পোনপটীয়া যোগাযোগ",
    btnRegWorker: "নতুন কৰ্মী পঞ্জীয়ন",
    footerCopy: "© 2026 চোলাধৰা গ্ৰাম্য সেৱা প’ৰ্টেল | চৰাইদেউ, অসম - ৭৮৫৬৮৬",
    footerNote: "স্থানীয় যুৱ স্বেচ্ছাসেৱকৰ দ্বাৰা পৰিচালিত এটা স্বতন্ত্ৰ তথ্য কেন্দ্ৰ।"
  },
  en: {
    siteTitle: "Choladhara Community Portal",
    siteSub: "Charaideo, Assam - 785686 | Independent Volunteer Initiative",
    communityBadge: "Youth Volunteer Initiative",
    welcomeHeading: "Welcome to Choladhara Digital Hub",
    welcomeDesc: "Single window for agriculture advisories, daily rates, scholarships, skilled local artisans, and community updates.",
    weatherTitle: "Weather Forecast",
    weatherTip: "Favorable conditions for local farming.",
    mspTag: "Procurement Price",
    mspTitle: "Paddy MSP (Common)",
    mspUnit: "/ per quintal",
    mspDesc: "Official minimum support price.",
    mgnregaTag: "NREGA Scheme",
    mgnregaTitle: "MGNREGA Daily Wage",
    mgnregaUnit: "/ per day",
    mgnregaDesc: "Official daily wage in Assam.",
    noticesTitle: "Community Notices & Alerts",
    liveBadge: "Latest",
    agriTitle: "Agriculture Hub & Advisory",
    oppsTitle: "Scholarships & Opportunities",
    workersTitle: "Skilled Worker Directory",
    workersSub: "Direct contacts for electricians, drivers, mechanics, and technicians",
    btnRegWorker: "Register Skilled Worker",
    footerCopy: "© 2026 Choladhara Community Portal | Charaideo, Assam - 785686",
    footerNote: "An independent community initiative managed by local volunteers."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('as');
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
