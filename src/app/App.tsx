import { BrowserRouter, Routes, Route } from 'react-router';
import Navigation from '../components/navigation/Navigation';
import LandingPage from '../features/landing-page/components/LandingPage';
import Login from '../features/log-in/components/Login';
import Registration from '../features/registration/components/Registration';
import OAuthCallback from '../features/oauth-callback/components/OAuthCallback';
import UserProfile from '../features/user-profile/components/UserProfile';
import UserTypeSelection from '../features/user-type-selection/components/UserTypeSelection';
import ForgotPassword from '../features/forgot-password/components/ForgotPassword';
import NotFound from '../features/not-found/components/NotFound';
import './App.css';
import { Discovery } from '../features/discovery/components/Discovery';
import { RehomerDashboard } from '../features/rehomer-dashboard/components/RehomerDashboard';
import { DiscoveryPreferences } from '../features/discovery-preferences/components/DiscoveryPreferences';
import ResetPassword from '../features/reset-password/components/ResetPassword';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase-client';
import { useAuthStore } from '../stores/auth-store';
import PrivacyPolicy from '../features/privacy-policy/components/PrivacyPolicy';
import UserDataDeletion from '../features/user-data-deletion/components/UserDataDeletion';

function App() {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Initial check for session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route path="oauth-callback" element={<OAuthCallback />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="user-data-deletion" element={<UserDataDeletion />} />
        <Route path="user-profile/:userId" element={<UserProfile />} />
        <Route path="user-type-selection" element={<UserTypeSelection />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="rehomer-dashboard" element={<RehomerDashboard />} />
        <Route
          path="discovery-preferences"
          element={<DiscoveryPreferences />}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
