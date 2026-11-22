import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../src/stores/auth.js';

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('is not logged in without a token and a user', () => {
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.homePath).toBe('/login');
  });

  it('sends each role to its own start page', () => {
    const auth = useAuthStore();
    auth.token = 'token';
    auth.user = { role: 'Trainer' };
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.homePath).toBe('/trainer');
  });

  it('logout removes the token and the user', () => {
    localStorage.setItem('token', 'token');
    const auth = useAuthStore();
    auth.user = { role: 'Client' };
    auth.logout();
    expect(auth.isLoggedIn).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
