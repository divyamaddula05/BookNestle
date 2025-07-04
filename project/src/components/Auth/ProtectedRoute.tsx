import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { User } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { state } = useAppContext();

  if (!state.auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(state.auth.user!.role)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}