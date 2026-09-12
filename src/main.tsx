import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';

// We will create these shortly
import HomePage from './pages/home';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import ReportPage from './pages/report';
import TrackingPage from './pages/tracking';
import ProfilePage from './pages/profile';
import MapPage from './pages/map';
import AuthorityPortal from './pages/authority';
import AlertsPage from './pages/alerts';

import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places', 'geocoding']}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<AuthorityPortal />} />
          <Route path="/notifications" element={<AlertsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </APIProvider>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
