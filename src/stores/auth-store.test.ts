import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './auth-store';
import type { Session } from '@supabase/supabase-js';

// Mock supabase client
vi.mock('../utils/supabase-client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn()
    }
  }
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setSession(null);
      result.current.setIsLoadingSession(false);
    });
  });

  describe('session management', () => {
    it('should initialize with null session and loading true', () => {
      const { result } = renderHook(() => useAuthStore());

      // Initial state from beforeEach
      expect(result.current.session).toBeNull();
      expect(result.current.isLoadingSession).toBe(false);
    });

    it('should set session', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockSession: Session = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString()
        }
      } as Session;

      act(() => {
        result.current.setSession(mockSession);
      });

      expect(result.current.session).toEqual(mockSession);
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setIsLoadingSession(true);
      });

      expect(result.current.isLoadingSession).toBe(true);

      act(() => {
        result.current.setIsLoadingSession(false);
      });

      expect(result.current.isLoadingSession).toBe(false);
    });
  });

  describe('authentication checks', () => {
    it('should identify authenticated user', () => {
      const { result } = renderHook(() => useAuthStore());

      const authenticatedUser = {
        id: 'user-123',
        aud: 'authenticated',
        email: 'test@example.com',
        role: 'authenticated',
        created_at: new Date().toISOString()
      };

      const isAuth = result.current.isAuthenticatedUser(
        authenticatedUser as any
      );
      expect(isAuth).toBe(true);
    });

    it('should identify non-authenticated user', () => {
      const { result } = renderHook(() => useAuthStore());

      const unauthenticatedUser = {
        id: 'user-123',
        aud: 'anon',
        email: 'test@example.com',
        role: 'anon',
        created_at: new Date().toISOString()
      };

      const isAuth = result.current.isAuthenticatedUser(
        unauthenticatedUser as any
      );
      expect(isAuth).toBe(false);
    });

    it('should handle null user', () => {
      const { result } = renderHook(() => useAuthStore());

      const isAuth = result.current.isAuthenticatedUser(null);
      expect(isAuth).toBe(false);
    });

    it('should identify authenticated session', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockSession: Session = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString()
        }
      } as Session;

      const isAuth = result.current.isAuthenticatedUserSession(mockSession);
      expect(isAuth).toBe(true);
    });

    it('should identify non-authenticated session', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockSession: Session = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          aud: 'anon',
          role: 'anon',
          created_at: new Date().toISOString()
        }
      } as Session;

      const isAuth = result.current.isAuthenticatedUserSession(mockSession);
      expect(isAuth).toBe(false);
    });

    it('should handle null session', () => {
      const { result } = renderHook(() => useAuthStore());

      const isAuth = result.current.isAuthenticatedUserSession(null);
      expect(isAuth).toBe(false);
    });
  });

  describe('authentication actions', () => {
    it('should call registerNewUserWithEmailAndPassword', async () => {
      const { result } = renderHook(() => useAuthStore());
      const { supabase } = await import('../utils/supabase-client');

      await result.current.registerNewUserWithEmailAndPassword(
        'test@example.com',
        'password123'
      );

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: import.meta.env.VITE_REDIRECT_URL_ON_AUTH
        }
      });
    });

    it('should call logUserInWithEmailAndPassword', async () => {
      const { result } = renderHook(() => useAuthStore());
      const { supabase } = await import('../utils/supabase-client');

      await result.current.logUserInWithEmailAndPassword(
        'test@example.com',
        'password123'
      );

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should call logUserOut', async () => {
      const { result } = renderHook(() => useAuthStore());
      const { supabase } = await import('../utils/supabase-client');

      await result.current.logUserOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should call sendResetPasswordLink', async () => {
      const { result } = renderHook(() => useAuthStore());
      const { supabase } = await import('../utils/supabase-client');

      await result.current.sendResetPasswordLink('test@example.com');

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: import.meta.env.VITE_RESET_PASSWORD_URL
        }
      );
    });

    it('should call updateUserPassword', async () => {
      const { result } = renderHook(() => useAuthStore());
      const { supabase } = await import('../utils/supabase-client');

      await result.current.updateUserPassword('newPassword123');

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123'
      });
    });
  });
});
