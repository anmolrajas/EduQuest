// components/auth/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contextData/AuthContextData';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ProtectedRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="w-12 h-12 text-gray-600 mx-auto" />
          </motion.div>
          
          {/* Brand Name */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight"
          >
            upgradist
          </motion.h1>
          
          {/* Loading Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg"
          >
            Authenticating...
          </motion.p>
          
          {/* Subtle Progress Indicator */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 1.5, repeat: Infinity }}
            className="mt-6 h-0.5 bg-gray-200 rounded-full overflow-hidden mx-auto w-16"
          >
            <motion.div 
              className="h-full bg-gray-600 rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
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
