import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth-store';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';

// user gets redirected here after logging in with third part oauth provider (e.g., facebook)
// we check if they are logged in and redirect to their profile or to login page
export default function OAuthCallback() {
  const navigate = useNavigate();
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToUserProfile = (userId: string) =>
    navigate(`/user-profile/${userId}`);

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      } else {
        goToUserProfile(userSession!.user.id);
      }
    }
  }, [userSession, isLoadingSession]);

  return <LoadingScreen />;
}
