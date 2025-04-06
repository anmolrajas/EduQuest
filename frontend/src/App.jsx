import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './components/pages/Home'
import MyBlogs from './components/pages/MyBlogs'
import Activity from './components/pages/Activity'
import Layout from './components/layout/Layout'
import ErrorPage from './components/pages/ErrorPage'
import Create from './components/pages/Create'
import LoginSignup from './components/pages/LoginSignup'
import AuthProvider from "./contextData/AuthContextData";
import ProtectedRoutes from './routes/ProtectedRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes />, // Check for auth
    children: [
      {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />
          },
          {
            path: 'home',
            element: <Home />
          },
          {
            path: 'create',
            element: <Create />
          },
          {
            path: 'myblogs',
            element: <MyBlogs />
          },
          {
            path: 'activity',
            element: <Activity />
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <LoginSignup />
  }
])

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
