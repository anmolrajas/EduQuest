// components/auth/ProtectedRoute.js
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoutes = () => {
  const authToken = Cookies.get("authToken");

  if (!authToken) {
    console.log("Authenticated...", authToken);
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
