// components/auth/ProtectedRoute.js
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import { AuthContext } from '../contextData/AuthContextData';

const ProtectedRoutes = () => {
  const authToken = Cookies.get("authToken");
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10 text-yellow-500">Checking session...</div>;
  }

  if (!authToken) {
    console.log("Authenticated...", authToken);
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
