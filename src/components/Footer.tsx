import React from 'react';
import { LegalDisclaimer } from './LegalDisclaimer';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-200 mt-auto">
      <LegalDisclaimer />
    </footer>
  );
};

export default Footer;
