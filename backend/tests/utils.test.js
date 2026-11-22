import { describe, it, expect, vi } from 'vitest';
import { HttpError } from '../src/utils/httpError.js';

vi.mock('../src/db.js', () => ({ default: {} }));
const { publicUser } = await import('../src/services/auth.service.js');

describe('HttpError', () => {
  it('keeps the status code and the message', () => {
    const err = new HttpError(409, 'Conflict');
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(409);
    expect(err.message).toBe('Conflict');
  });
});

describe('publicUser', () => {
  it('never returns the password hash', () => {
    const user = publicUser({ id: 1, firstName: 'Ana', lastName: 'Kovač', email: 'a@b.c', role: 'Trainer', passwordHash: 'x' });
    expect(user).toEqual({ id: 1, firstName: 'Ana', lastName: 'Kovač', email: 'a@b.c', role: 'Trainer' });
  });
});
