import { BrowserRouter, Routes, Route } from 'react-router';
import Navigation from '../components/navigation/Navigation';
import LandingPage from '../features/landing-page/components/LandingPage';
import Login from '../features/log-in/components/Login';
import Registration from '../features/registration/components/Registration';
import UserProfile from '../features/user-profile/components/UserProfile';
import UserTypeSelection from '../features/user-type-selection/components/UserTypeSelection';
import ForgotPassword from '../features/forgot-password/components/ForgotPassword';
import NotFound from '../features/not-found/components/NotFound';
import './App.css';
import { Discovery } from '../features/discovery/components/Discovery';
import { RehomerDashboard } from '../features/rehomer-dashboard/components/RehomerDashboard';
import { DiscoveryPreferences } from '../features/discovery-preferences/components/DiscoveryPreferences';
import ResetPassword from '../features/reset-password/components/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="user-type-selection" element={<UserTypeSelection />} />
        <Route path="discovery" element={<Discovery />} />
        <Route path="rehomer-dashboard" element={<RehomerDashboard />} />
        <Route
          path="discovery-preferences"
          element={<DiscoveryPreferences />}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
