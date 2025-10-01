import type { Session } from '@supabase/supabase-js';

export type NavigationProps = {
  userType: string | null;
  isLoadingSession: boolean;
  userSession: Session | null;
  isAuthenticatedUserSession: (session: Session | null) => boolean;
  onLogout: () => Promise<void>;
};
