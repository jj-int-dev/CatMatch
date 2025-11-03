import type {
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  AuthError,
  OAuthResponse,
  User,
  UserResponse
} from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../utils/supabase-client';

type AuthStore = {
  session: Session | null;
  isLoadingSession: boolean;
  setSession: (session: Session | null) => void;
  setIsLoadingSession: (loading: boolean) => void;
  isAuthenticatedUser: (user: User | null) => boolean;
  isAuthenticatedUserSession: (session: Session | null) => boolean;
  registerNewUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logUserInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<AuthTokenResponsePassword>;
  logUserInWithFacebook: () => Promise<OAuthResponse>;
  logUserInWithGoogle: () => Promise<OAuthResponse>;
  logUserOut: () => Promise<{ error: AuthError | null }>;
  sendResetPasswordLink: (
    email: string
  ) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (newPassword: string) => Promise<UserResponse>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoadingSession: true,
  setSession: (session) => set({ session }),
  setIsLoadingSession: (loading) => set({ isLoadingSession: loading }),
  isAuthenticatedUser: (user) => user?.aud === 'authenticated',
  isAuthenticatedUserSession: (session) =>
    session?.user?.aud === 'authenticated',
  registerNewUserWithEmailAndPassword: (email, password) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.VITE_REDIRECT_URL_ON_AUTH
      }
    }),
  logUserInWithEmailAndPassword: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),
  logUserInWithFacebook: () =>
    supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: import.meta.env.VITE_REDIRECT_URL_ON_AUTH
      }
    }),
  logUserInWithGoogle: () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        redirectTo: import.meta.env.VITE_REDIRECT_URL_ON_AUTH
      }
    }),
  logUserOut: () => supabase.auth.signOut(),
  sendResetPasswordLink: (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.env.VITE_RESET_PASSWORD_URL
    }),
  updateUserPassword: (newPassword: string) =>
    supabase.auth.updateUser({ password: newPassword })
}));
