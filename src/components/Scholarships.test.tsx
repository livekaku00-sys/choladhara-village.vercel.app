// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { Scholarships } from './Scholarships';

// Result the mocked query resolves to, and the filters the component applied
let queryResult: { data: unknown; error: unknown } = { data: [], error: null };
const calls: { method: string; args: unknown[] }[] = [];

vi.mock('../lib/supabase', () => {
  const chain: Record<string, (...args: unknown[]) => unknown> = {};
  for (const method of ['select', 'eq', 'or']) {
    chain[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return chain;
    };
  }
  chain.order = () => Promise.resolve(queryResult);
  return { supabase: { from: () => chain } };
});

// A row shaped like the real `scholarships` table (sql/schema.sql)
const row = {
  id: 1,
  title_en: 'National Means-cum-Merit Scholarship (NMMSS)',
  title_as: 'মেধা-ভিত্তিক ৰাষ্ট্ৰীয় ছাত্ৰবৃত্তি',
  provider: 'Ministry of Education',
  eligibility_en: 'Class 8 passed',
  eligibility_as: 'অষ্টম শ্ৰেণী উত্তীৰ্ণ',
  benefit_amount: '₹12,000 / annum',
  apply_link: 'https://scholarships.gov.in/nmmss',
  deadline: '2026-10-04',
  is_approved: true,
};

const renderSection = async (lang: 'en' | 'as' = 'en') => {
  localStorage.setItem('portal_language', lang);
  render(
    <LanguageProvider>
      <Scholarships />
    </LanguageProvider>
  );
  // Wait until loading has finished
  await screen.findAllByText(/NMMSS|মেধা|Could not load|No active scholarship/);
};

describe('Scholarships', () => {
  beforeEach(() => {
    calls.length = 0;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 3, 10, 0)); // 3 Oct 2026, 10:00 local
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('uses the apply_link and benefit_amount columns', async () => {
    queryResult = { data: [row], error: null };
    await renderSection();
    expect(screen.getByText('Apply Now').closest('a')?.getAttribute('href')).toBe('https://scholarships.gov.in/nmmss');
    expect(screen.getByText('₹12,000 / annum')).toBeTruthy();
  });

  it('asks only for approved, unexpired scholarships', async () => {
    queryResult = { data: [], error: null };
    await renderSection();
    expect(calls).toContainEqual({ method: 'eq', args: ['is_approved', true] });
    expect(calls).toContainEqual({ method: 'or', args: ['deadline.is.null,deadline.gte.2026-10-03'] });
  });

  it('shows readable deadlines and days left', async () => {
    queryResult = { data: [row], error: null };
    await renderSection();
    expect(screen.getByText('1 day left')).toBeTruthy();
    expect(screen.getByText('4 Oct 2026')).toBeTruthy();
  });

  it('shows an error with retry when loading fails', async () => {
    queryResult = { data: null, error: new Error('network down') };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderSection();
    expect(screen.queryByText(/No active scholarship/)).toBeNull();
    queryResult = { data: [row], error: null };
    fireEvent.click(screen.getByText('Try Again'));
    expect(await screen.findByText(row.title_en)).toBeTruthy();
  });

  it('shares in the selected language', async () => {
    queryResult = { data: [row], error: null };
    const open = vi.spyOn(window, 'open').mockReturnValue({} as Window);
    await renderSection('en');
    fireEvent.click(screen.getByTitle('Share on WhatsApp'));
    const text = decodeURIComponent(String(open.mock.calls[0][0]).split('text=')[1]);
    expect(text).toContain('Benefit: ₹12,000 / annum');
    expect(text).toContain('Last date: 4 Oct 2026');
    expect(text).not.toContain('বিভাগ');
  });

  it('does not repeat the section anchor id', async () => {
    queryResult = { data: [], error: null };
    await renderSection();
    expect(document.querySelectorAll('#sec-scholarships').length).toBe(0);
  });
});
