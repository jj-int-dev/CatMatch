import type {
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  AuthError,
  OAuthResponse,
  User
} from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../utils/supabase-client';

type AuthStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
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
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
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
  logUserOut: () => supabase.auth.signOut()
}));
