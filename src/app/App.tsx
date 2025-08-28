import { BrowserRouter, Routes, Route } from 'react-router';
import Navigation from '../components/navigation/Navigation';
import LandingPage from '../features/landing-page/LandingPage';
import Login from '../features/log-in/components/Login';
import Registration from '../features/registration/components/Registration';
import NotFound from '../features/not-found/components/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Registration />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
