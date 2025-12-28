
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = authService.getCurrentUser();
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    console.warn('ProtectedRoute: Access denied, redirecting to login');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.warn(`ProtectedRoute: Role mismatch. Required: ${requiredRole}, Found: ${user?.role}`);
    const redirectPath = user?.role === 'rider' ? '/rider-dashboard' : '/order';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
