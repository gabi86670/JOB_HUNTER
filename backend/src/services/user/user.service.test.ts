import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findUserById, createUser } from '@/repositories/user.repository.js';
import type { User } from '@/types/database.types.js';
import { getOrCreateUser } from './user.services.js';

// Replace every export from user.repository with a mock function.
// This means getOrCreateUser (which imports findUserById/createUser)
// never touches a real database during this test file — we're testing
// ONLY the branching logic in the service, not the SQL underneath it.
vi.mock('@/repositories/user.repository.js');

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  nameFirst: null,
  nameLast: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

describe('getOrCreateUser', () => {
  beforeEach(() => {
    // Reset mock call history + configured return values between tests,
    // so one test's setup can't leak into the next.
    vi.resetAllMocks();
  });

  it('returns the existing user without calling createUser, when one is found', async () => {
    vi.mocked(findUserById).mockResolvedValue(mockUser);

    const result = await getOrCreateUser(mockUser.id, mockUser.email);

    expect(result).toEqual(mockUser);
    expect(findUserById).toHaveBeenCalledWith(mockUser.id);
    expect(createUser).not.toHaveBeenCalled();
  });

  it('creates and returns a new user, when none is found', async () => {
    vi.mocked(findUserById).mockResolvedValue(null);
    vi.mocked(createUser).mockResolvedValue(mockUser);

    const result = await getOrCreateUser(mockUser.id, mockUser.email);

    expect(result).toEqual(mockUser);
    expect(findUserById).toHaveBeenCalledWith(mockUser.id);
    expect(createUser).toHaveBeenCalledWith(mockUser.id, mockUser.email);
    expect(createUser).toHaveBeenCalledTimes(1);
  });
});