import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || !userRole) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role is not in the list, redirect to their respective dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "USER") return <Navigate to="/user" replace />;
    if (userRole === "DOCTOR") return <Navigate to="/doctor" replace />;
    if (userRole === "MEDICAL") return <Navigate to="/medical" replace />;
    if (userRole === "ADMIN") return <Navigate to="/admin/contacts" replace />;
    return <Navigate to="/" replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;
