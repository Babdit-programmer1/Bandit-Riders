
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Order from './pages/Order';
import Deliveries from './pages/Deliveries';
import Track from './pages/Track';
import RiderDashboard from './pages/RiderDashboard';
import Wallet from './pages/Wallet';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BackButton from './components/BackButton';
import { INITIAL_DELIVERIES } from './data/mockData';

const App: React.FC = () => {
  useEffect(() => {
    if (!localStorage.getItem('bandit_deliveries')) {
      localStorage.setItem('bandit_deliveries', JSON.stringify(INITIAL_DELIVERIES));
    }
  }, []);

  return (
    <HashRouter>
      <Navbar />
      <BackButton />
      <main className="relative z-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth" element={<Login />} />

          {/* Sender Hub */}
          <Route path="/order" element={
            <ProtectedRoute requiredRole="sender">
              <Order />
            </ProtectedRoute>
          } />
          <Route path="/deliveries" element={
            <ProtectedRoute requiredRole="sender">
              <Deliveries />
            </ProtectedRoute>
          } />
          <Route path="/track/:id" element={
            <ProtectedRoute requiredRole="sender">
              <Track />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute requiredRole="sender">
              <Wallet />
            </ProtectedRoute>
          } />

          {/* Rider Hub */}
          <Route path="/rider-dashboard" element={
            <ProtectedRoute requiredRole="rider">
              <RiderDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;
