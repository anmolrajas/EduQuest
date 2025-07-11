// components/auth/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contextData/AuthContextData';

const ProtectedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-10 text-yellow-500">
        Checking session…
      </div>
    );
  }

  // Not authenticated – send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated – render child routes
  return <Outlet />;
};

export default ProtectedRoutes;
