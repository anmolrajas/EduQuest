import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './components/pages/Home'
import ErrorPage from './components/pages/ErrorPage'
import LoginSignup from './components/pages/LoginSignup'
import AuthProvider from "./contextData/AuthContextData";
import ProtectedRoutes from './routes/ProtectedRoutes';
import Content from './components/pages/admin/content/content'
import Layout from './components/layout/Layout'
import Subject from './components/pages/admin/content/Subject'
import Topic from './components/pages/admin/content/Topic'
import Question from './components/pages/admin/content/Question'
import Quiz from './components/pages/admin/content/Quiz'
import CreateSubject from './components/pages/admin/content/CreateSubject'
import EditSubject from './components/pages/admin/content/editSubject'
import CreateTopic from './components/pages/admin/content/createTopic'
import EditTopic from './components/pages/admin/content/EditTopic'
import CreateQuestion from './components/pages/admin/content/CreateQuestion'
import EditQuestion from './components/pages/admin/content/EditQuestion'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes />, // Check for auth
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />
          },
          {
            path: '/home',
            element: <Home />
          },
          {
            path: '/admin/content',
            element: <Content />
          },
          {
            path: '/admin/content/subjects',
            element: <Subject />
          },
          {
            path: '/admin/content/subjects/create',
            element: <CreateSubject />
          },
          {
            path: '/admin/content/subjects/edit',
            element: <EditSubject />
          },
          {
            path: '/admin/content/topics',
            element: <Topic />
          },
          {
            path: '/admin/content/topics/create',
            element: <CreateTopic />
          },
          {
            path: '/admin/content/topics/edit',
            element: <EditTopic />
          },
          {
            path: '/admin/content/questions',
            element: <Question />
          },
          {
            path: '/admin/content/questions/create',
            element: <CreateQuestion />
          },
          {
            path: '/admin/content/questions/edit',
            element: <EditQuestion />
          },
          {
            path: '/admin/content/quizzes',
            element: <Quiz />
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
