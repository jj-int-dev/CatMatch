import type { Session } from '@supabase/supabase-js';

export type NavigationProps = {
  userType: string | null;
  userSession: Session | null;
  isAuthenticatedUserSession: (session: Session | null) => boolean;
  onLogout: () => Promise<void>;
};
