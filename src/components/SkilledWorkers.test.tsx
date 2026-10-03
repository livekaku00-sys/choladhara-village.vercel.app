// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { SkilledWorkers } from './SkilledWorkers';

let listResult: { data: unknown; error: unknown } = { data: [], error: null };
const inserts: { table: string; rows: unknown }[] = [];

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      const chain = {
        select: () => chain,
        order: () => Promise.resolve(listResult),
        insert: (rows: unknown) => {
          inserts.push({ table, rows });
          return Promise.resolve({ error: null });
        },
      };
      return chain;
    },
  },
}));

const worker = (id: number, over: Record<string, unknown> = {}) => ({
  id,
  full_name: `Worker ${id}`,
  skill_en: 'Electrician',
  skill_as: 'বিদ্যুৎ', // truncated value saved by the old form
  phone_number: '9876543210',
  chuburi_ward: 'Charaideo',
  is_verified: true,
  ...over,
});

const renderSection = async (lang: 'en' | 'as' = 'en') => {
  localStorage.setItem('portal_language', lang);
  render(
    <LanguageProvider>
      <SkilledWorkers />
    </LanguageProvider>
  );
  await screen.findAllByText(/Worker \d|No skilled workers|Could not load|কাৰিকৰ পোৱা নগ’ল/);
};

describe('SkilledWorkers', () => {
  beforeEach(() => {
    inserts.length = 0;
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows the full Assamese trade name even for old truncated rows', async () => {
    listResult = { data: [worker(1)], error: null };
    await renderSection('as');
    expect(screen.getByText('বিদ্যুৎ মিস্ত্ৰী')).toBeTruthy();
  });

  it('builds a working WhatsApp link for numbers saved with +91', async () => {
    listResult = { data: [worker(1, { phone_number: '+91 98765 43210' })], error: null };
    await renderSection();
    expect(screen.getByText('WhatsApp').closest('a')?.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/919876543210\?/);
  });

  it('filters areas exactly ("Charaideo" excludes "Near Charaideo")', async () => {
    listResult = { data: [worker(1), worker(2, { chuburi_ward: 'Near Charaideo' })], error: null };
    await renderSection();
    const areaSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(areaSelect, { target: { value: 'charaideo' } });
    expect(screen.getByText('Worker 1')).toBeTruthy();
    expect(screen.queryByText('Worker 2')).toBeNull();
  });

  it('saves removal requests to the database with a cleaned number', async () => {
    listResult = { data: [worker(1)], error: null };
    const open = vi.spyOn(window, 'open');
    await renderSection();
    fireEvent.click(screen.getByText('Request Removal'));
    const form = screen.getByText('Worker Removal Request').closest('div')!.parentElement!;
    fireEvent.change(within(form).getByPlaceholderText('Registered name'), { target: { value: 'Worker 1' } });
    fireEvent.change(within(form).getByPlaceholderText('9876543210'), { target: { value: '+91 98765 43210' } });
    fireEvent.click(within(form).getByText('Send Request'));
    await vi.waitFor(() => expect(inserts).toHaveLength(1));
    expect(inserts[0]).toEqual({
      table: 'worker_removal_requests',
      rows: [{ worker_name: 'Worker 1', phone_number: '9876543210', reason: null }],
    });
    expect(open).not.toHaveBeenCalled();
  });

  it('requires consent and a valid number to register, and saves the full trade name', async () => {
    listResult = { data: [], error: null };
    await renderSection();
    fireEvent.click(screen.getByText('Add Worker'));
    const nameInput = document.querySelector('form input[type="text"]') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'New Worker' } });
    const phoneInput = document.querySelector('form input[type="tel"]') as HTMLInputElement;
    const form = phoneInput.closest('form')!;

    fireEvent.change(phoneInput, { target: { value: '12345' } });
    fireEvent.submit(form);
    expect(inserts).toHaveLength(0);

    fireEvent.change(phoneInput, { target: { value: '098765 43210' } });
    fireEvent.submit(form);
    expect(inserts).toHaveLength(0); // no consent yet

    fireEvent.click(within(form).getByRole('checkbox'));
    fireEvent.submit(form);
    await vi.waitFor(() => expect(inserts).toHaveLength(1));
    expect(inserts[0].table).toBe('skilled_workers');
    expect((inserts[0].rows as Record<string, unknown>[])[0]).toMatchObject({
      full_name: 'New Worker',
      skill_en: 'Electrician',
      skill_as: 'বিদ্যুৎ মিস্ত্ৰী',
      phone_number: '9876543210',
      is_verified: false,
    });
  });

  it('shows an error with retry when loading fails', async () => {
    listResult = { data: null, error: new Error('network down') };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderSection();
    expect(screen.getByText(/Could not load the directory/)).toBeTruthy();
    listResult = { data: [worker(1)], error: null };
    fireEvent.click(screen.getByText('Try Again'));
    expect(await screen.findByText('Worker 1')).toBeTruthy();
  });
});
