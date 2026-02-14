import { BrowserRouter, Routes, Route } from 'react-router';
import Navigation from '../components/navigation/Navigation';
import LandingPage from '../features/landing-page/components/LandingPage';
import Login from '../features/log-in/components/Login';
import Registration from '../features/registration/components/Registration';
import OAuthCallback from '../features/oauth-callback/components/OAuthCallback';
import UserProfile from '../features/user-profile/components/UserProfile';
import NotFound from '../features/not-found/components/NotFound';
import './App.css';
import Discovery from '../features/discovery/components/Discovery';
import RehomerDashboard from '../features/rehomer-dashboard/components/RehomerDashboard';
import ResetPassword from '../features/reset-password/components/ResetPassword';
import { useEffect } from 'react';
import { supabase } from '../utils/supabase-client';
import { useAuthStore } from '../stores/auth-store';
import PrivacyPolicy from '../features/privacy-policy/components/PrivacyPolicy';
import UserDataDeletion from '../features/user-data-deletion/components/UserDataDeletion';
import AnimalDetails from '../features/discovery/components/AnimalDetails';
import EditAnimalListing from '../features/rehomer-dashboard/components/EditAnimalListing';
import AddAnimalListing from '../features/rehomer-dashboard/components/AddAnimalListing';
import Inbox from '../features/inbox/components/Inbox';
import { SendResetPasswordLinkDialog } from '../components/send-reset-password-link/SendResetPasswordLinkDialog';
import SafetyTips from '../features/safety-tips/SafetyTips';
import FAQ from '../features/faq/FAQ';
import About from '../features/about/About';

function App() {
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoadingSession = useAuthStore(
    (state) => state.setIsLoadingSession
  );

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Set loading to true when auth state changes, then false after session is set
      setIsLoadingSession(true);
      setSession(session);
      setIsLoadingSession(false);
    });

    // Initial check for session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Navigation />
      <SendResetPasswordLinkDialog />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route path="oauth-callback" element={<OAuthCallback />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="user-data-deletion" element={<UserDataDeletion />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="discovery/animal/:animalId" element={<AnimalDetails />} />
        <Route path="rehomer/dashboard" element={<RehomerDashboard />} />
        <Route path="rehomer/animal/add" element={<AddAnimalListing />} />
        <Route
          path="rehomer/animal/edit/:animalId"
          element={<EditAnimalListing />}
        />
        <Route path="inbox" element={<Inbox />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="safety-tips" element={<SafetyTips />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="about" element={<About />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
