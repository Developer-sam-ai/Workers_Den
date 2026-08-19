import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let userRole = null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.role ? payload.role.replace('ROLE_', '') : null;
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const fallback = userRole === 'CUSTOMER' ? '/customer/dashboard' : '/worker/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}