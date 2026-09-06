import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
}));

describe('Firebase Configuration Security', () => {
  it('loads config from import.meta.env without hardcoded fallback secrets', async () => {
    const { firebaseConfig } = await import('./firebase');
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.apiKey).toBe(import.meta.env.VITE_FIREBASE_API_KEY || '');
    expect(firebaseConfig.authDomain).toBe(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '');
    expect(firebaseConfig.projectId).toBe(import.meta.env.VITE_FIREBASE_PROJECT_ID || '');
    expect(firebaseConfig.storageBucket).toBe(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '');
    expect(firebaseConfig.messagingSenderId).toBe(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '');
    expect(firebaseConfig.appId).toBe(import.meta.env.VITE_FIREBASE_APP_ID || '');
    expect(firebaseConfig.measurementId).toBe(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '');
  });
});
