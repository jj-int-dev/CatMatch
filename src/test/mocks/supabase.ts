import { vi } from 'vitest';

export const mockSupabaseClient = {
  auth: {
    getSession: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: {
        subscription: {
          unsubscribe: vi.fn()
        }
      }
    }))
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    limit: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis()
  })),
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn()
  })),
  removeChannel: vi.fn()
};

export const createMockSession = (overrides = {}) => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides
  }
});

export const createMockUser = (overrides = {}) => ({
  id: 'mock-user-id',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  ...overrides
});
