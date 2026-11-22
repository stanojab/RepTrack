import { describe, it, expect } from 'vitest';
import { apiBaseUrl, errorMessage } from '../src/api/client.js';

describe('apiBaseUrl', () => {
  it('uses /api when no backend URL is set (local development)', () => {
    expect(apiBaseUrl('')).toBe('/api');
  });

  it('uses the deployed backend URL and removes a trailing slash', () => {
    expect(apiBaseUrl('https://api.example.com/')).toBe('https://api.example.com/api');
  });
});

describe('errorMessage', () => {
  it('returns the message sent by the backend', () => {
    expect(errorMessage({ response: { data: { message: 'Plan not found' } } })).toBe('Plan not found');
  });

  it('returns a general message when the backend sent none', () => {
    expect(errorMessage(new Error('Network Error'))).toBe('Something went wrong. Please try again.');
  });
});
