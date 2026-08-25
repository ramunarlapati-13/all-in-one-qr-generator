import { render, act } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseDb from 'firebase/database';

vi.mock('./firebase', () => ({
  auth: {},
  db: {},
  rtdb: {},
}));

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof firebaseAuth>();
  return {
    ...actual,
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    doc: vi.fn(),
    getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
    setDoc: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock('firebase/database', async (importOriginal) => {
  const actual = await importOriginal<typeof firebaseDb>();
  return {
    ...actual,
    ref: vi.fn(),
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({ val: () => null }),
    onDisconnect: vi.fn().mockReturnValue({
      update: vi.fn().mockResolvedValue(undefined),
    }),
  };
});

describe('App - IP API Caching on Interval Heartbeat', () => {
  const mockUser = {
    uid: 'user123',
    email: 'user@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation((_auth, callback) => {
      (callback as (user: unknown) => void)(mockUser);
      return () => {};
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ip: '192.168.1.1',
        city: 'New York',
        region: 'NY',
        country_name: 'United States',
      }),
    } as Response);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('caches IP API response and avoids redundant fetches on heartbeat intervals', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const ipFetchCalls = () =>
      vi.mocked(globalThis.fetch).mock.calls.filter(([url]) =>
        String(url).includes('ipapi.co')
      ).length;

    expect(ipFetchCalls()).toBe(1);

    // Advance timers by 2.5 minutes for heartbeat 1
    await act(async () => {
      vi.advanceTimersByTime(150000);
      await Promise.resolve();
    });

    // Advance timers by another 2.5 minutes for heartbeat 2
    await act(async () => {
      vi.advanceTimersByTime(150000);
      await Promise.resolve();
    });

    // After heartbeats, no additional fetch calls should have occurred
    expect(ipFetchCalls()).toBe(1);
  });

  it('retries fetching IP on subsequent heartbeat if initial fetch fails', async () => {
    // First call fails
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const ipFetchCalls = () =>
      vi.mocked(globalThis.fetch).mock.calls.filter(([url]) =>
        String(url).includes('ipapi.co')
      ).length;

    expect(ipFetchCalls()).toBe(1);

    // Next call succeeds
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ip: '10.0.0.1',
        city: 'London',
        region: 'ENG',
        country_name: 'United Kingdom',
      }),
    } as Response);

    // Advance timers by 2.5 minutes for heartbeat
    await act(async () => {
      vi.advanceTimersByTime(150000);
      await Promise.resolve();
    });

    // It should have tried fetching again and now cached it
    expect(ipFetchCalls()).toBe(2);

    // Subsequent heartbeats should now use cached data
    await act(async () => {
      vi.advanceTimersByTime(150000);
      await Promise.resolve();
    });

    expect(ipFetchCalls()).toBe(2);
  });
});
