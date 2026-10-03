// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Admin } from './Admin';

type Result = { data: unknown; error: { message: string } | null };

// Per-table read results, the result of the next update/delete, and a log of calls
let tables: Record<string, Result> = {};
let mutationResult: Result = { data: [{ id: 1 }], error: null };
const reads: { table: string; order: unknown[] }[] = [];

vi.mock('../lib/supabase', () => {
  const session = { user: { id: 'u1', email: 'admin@example.com' } };
  const from = (table: string) => {
    const mutation = {
      eq: () => mutation,
      in: () => mutation,
      select: () => Promise.resolve(mutationResult),
    };
    return {
      select: () => ({
        order: (...order: unknown[]) => {
          reads.push({ table, order });
          return Promise.resolve(tables[table] ?? { data: [], error: null });
        },
      }),
      update: () => mutation,
      delete: () => mutation,
      insert: () => mutation,
    };
  };
  return {
    supabase: {
      from,
      rpc: () => Promise.resolve({ data: true, error: null }),
      auth: {
        getSession: () => Promise.resolve({ data: { session } }),
        onAuthStateChange: (cb: (event: string, s: unknown) => void) => {
          // Supabase fires INITIAL_SESSION right after subscribing
          setTimeout(() => cb('INITIAL_SESSION', session), 0);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signOut: () => Promise.resolve({ error: null }),
      },
    },
  };
});

const renderAdmin = async () => {
  render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>
  );
  await screen.findByText(/Sync Complete|Failed to load/);
};

describe('Admin', () => {
  beforeEach(() => {
    reads.length = 0;
    tables = {};
    mutationResult = { data: [{ id: 1 }], error: null };
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 3, 10, 0));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('loads each table once, newest first', async () => {
    await renderAdmin();
    await new Promise(r => setTimeout(r, 10)); // let INITIAL_SESSION fire
    const workerReads = reads.filter(r => r.table === 'skilled_workers');
    expect(workerReads).toHaveLength(1);
    expect(workerReads[0].order).toEqual(['id', { ascending: false }]);
  });

  it('reports tables that failed to load instead of "Sync Complete"', async () => {
    tables.worker_removal_requests = { data: null, error: { message: 'relation does not exist' } };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderAdmin();
    expect(screen.getByText(/Failed to load\): প্ৰত্যাহাৰ অনুৰোধ \(removals\)/)).toBeTruthy();
    expect(screen.queryByText(/Sync Complete/)).toBeNull();
  });

  const pendingWorker = {
    id: 1, full_name: 'Ram', skill_en: 'Electrician', skill_as: 'বিদ্যুৎ মিস্ত্ৰী',
    phone_number: '9876543210', chuburi_ward: 'Choladhara', is_verified: false,
  };

  it('says when an approval changed nothing (blocked by row-level security)', async () => {
    tables.skilled_workers = { data: [pendingWorker], error: null };
    await renderAdmin();
    mutationResult = { data: [], error: null };
    fireEvent.click(screen.getByText('অনুমোদন (Approve)'));
    expect(await screen.findByText(/Nothing changed/)).toBeTruthy();
  });

  it('shows database errors from actions', async () => {
    tables.skilled_workers = { data: [pendingWorker], error: null };
    await renderAdmin();
    mutationResult = { data: null, error: { message: 'permission denied' } };
    fireEvent.click(screen.getByText('অনুমোদন (Approve)'));
    expect(await screen.findByText(/permission denied/)).toBeTruthy();
  });

  it('keeps the success message visible after an action', async () => {
    tables.skilled_workers = { data: [pendingWorker], error: null };
    await renderAdmin();
    fireEvent.click(screen.getByText('অনুমোদন (Approve)'));
    expect(await screen.findByText(/কাৰিকৰৰ নাম অনুমোদন কৰা হ’ল/)).toBeTruthy();
    await new Promise(r => setTimeout(r, 10)); // quiet refresh finishes
    expect(screen.getByText(/কাৰিকৰৰ নাম অনুমোদন কৰা হ’ল/)).toBeTruthy();
  });

  it('marks expired exams and shows exam titles', async () => {
    tables.entrance_exams = {
      data: [
        { id: 2, exam_name_en: 'CAT 2026', exam_name_as: 'কেট ২০২৬', conducting_body: 'IIM', deadline: '2026-10-01', is_approved: true },
        { id: 3, exam_name_en: 'GATE 2027', exam_name_as: 'গেট ২০২৭', conducting_body: 'IIT', deadline: '2026-10-20', is_approved: true },
      ],
      error: null,
    };
    await renderAdmin();
    fireEvent.click(screen.getByText(/^পৰীক্ষা \(/));
    expect(screen.getByText('কেট ২০২৬')).toBeTruthy();
    expect(screen.getByText('গেট ২০২৭')).toBeTruthy();
    expect(screen.getAllByText(/Expired/)).toHaveLength(1);
  });
});
