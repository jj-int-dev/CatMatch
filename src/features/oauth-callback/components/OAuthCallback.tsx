import { useEffect } from 'react';
import { /*useNavigate, */ useParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth-store';

// user gets redirected here after logging in with third part oauth provider (e.g., facebook)
// we check if they are logged in and redirect to their profile or to login page
export default function OAuthCallback() {
  const location = useLocation();
  //const navigate = useNavigate();
  const params = useParams();
  const userSession = useAuthStore((state) => state.session);
  // const isAuthenticatedUser = useAuthStore(
  //   (state) => state.isAuthenticatedUser
  // );

  useEffect(() => {
    console.log('OAuthCallback location:', location);
    console.log('OAuthCallback params:', params);
    console.log('OAuthCallback userSession:', userSession);
    // if (isAuthenticatedUser(userSession)) {
    //   navigate(`/user-profile/${userSession!.user!.id}`);
    // } else {
    //   navigate('/login');
    // }
  }, [userSession]);

  return <div>Logging in...</div>;
}
