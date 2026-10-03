// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { AgricultureSection } from './AgricultureSection';

// Result the mocked Supabase query resolves to
let queryResult: { data: unknown; error: unknown } = { data: [], error: null };

vi.mock('../lib/supabase', () => {
  const chain = {
    select: () => chain,
    eq: () => chain,
    or: () => chain,
    order: () => Promise.resolve(queryResult),
  };
  return { supabase: { from: () => chain } };
});

const service = (id: string, validUntil: string | null) => ({
  id,
  category: 'subsidy',
  title_as: `আঁচনি ${id}`,
  title_en: `Scheme ${id}`,
  dept_as: 'বিভাগ',
  dept_en: 'Department',
  desc_as: 'বিৱৰণ',
  desc_en: 'Description',
  action_label_as: 'আবেদন',
  action_label_en: 'Apply',
  link: 'https://example.gov.in',
  badge_as: 'অনুদান',
  badge_en: 'Subsidy',
  valid_until: validUntil,
});

const renderSection = async (lang: 'en' | 'as' = 'en') => {
  localStorage.setItem('portal_language', lang);
  render(
    <LanguageProvider>
      <AgricultureSection />
    </LanguageProvider>
  );
  // Wait until loading has finished
  await screen.findAllByText(/Scheme|আঁচনি|Could not load|No active schemes/);
};

describe('AgricultureSection', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    // 3 Oct 2026, 10:00 local time
    vi.setSystemTime(new Date(2026, 9, 3, 10, 0));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows the 2026-27 paddy MSP', async () => {
    queryResult = { data: [], error: null };
    await renderSection();
    expect(screen.getByText('Paddy Govt MSP (2026-27): ₹2,441/Quintal')).toBeTruthy();
  });

  it('counts deadlines from the local date', async () => {
    queryResult = {
      data: [service('a', '2026-10-03'), service('b', '2026-10-04'), service('c', '2026-10-13')],
      error: null,
    };
    await renderSection();
    expect(screen.getByText('Last day today')).toBeTruthy();
    expect(screen.getByText('1 day left')).toBeTruthy();
    expect(screen.getByText('10 days left')).toBeTruthy();
  });

  it('shows an error with retry instead of "no schemes" when loading fails', async () => {
    queryResult = { data: null, error: new Error('network down') };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderSection();
    expect(screen.queryByText(/No active schemes/)).toBeNull();
    expect(screen.getByText(/Could not load agricultural services/)).toBeTruthy();

    queryResult = { data: [service('a', null)], error: null };
    fireEvent.click(screen.getByText('Try Again'));
    expect(await screen.findByText('Scheme a')).toBeTruthy();
  });

  it('labels the helpline in the selected language', async () => {
    queryResult = { data: [], error: null };
    await renderSection('en');
    expect(screen.getByText('1800-180-1551 (Toll-free)')).toBeTruthy();
  });

  it('does not repeat the section anchor id', async () => {
    queryResult = { data: [], error: null };
    await renderSection();
    expect(document.querySelectorAll('#sec-agriculture').length).toBe(0);
  });
});
