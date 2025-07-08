import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './components/pages/Home'
import ErrorPage from './components/pages/ErrorPage'
import LoginSignup from './components/pages/LoginSignup'
import AuthProvider from "./contextData/AuthContextData";
import ProtectedRoutes from './routes/ProtectedRoutes';
import Content from './components/pages/admin/content/Content.jsx'
import Layout from './components/layout/Layout'
import Subject from './components/pages/admin/content/Subject'
import Topic from './components/pages/admin/content/Topic'
import Question from './components/pages/admin/content/Question'
import Quiz from './components/pages/admin/content/Quiz'
import CreateSubject from './components/pages/admin/content/CreateSubject'
import EditSubject from './components/pages/admin/content/EditSubject'
import CreateTopic from './components/pages/admin/content/CreateTopic'
import EditTopic from './components/pages/admin/content/EditTopic'
import CreateQuestion from './components/pages/admin/content/CreateQuestion'
import EditQuestion from './components/pages/admin/content/EditQuestion'
import Practice from './components/practice-components/Practice'
import TestDashboard from './components/pages/admin/content/test-components/TestDashboard'
import CreateTestForm from './components/pages/admin/content/test-components/CreateTestForm.jsx'
import EditTestForm from './components/pages/admin/content/test-components/EditTestForm.jsx'
import TestQuizDashboard from './components/exam-test-components/TestQuizDashboard.jsx'
import TestScreen from './components/exam-test-components/TestScreen.jsx'
import TestLeaderboard from './components/exam-test-components/TestLeaderboard.jsx'
import ComprehensiveLeaderboard from './components/exam-test-components/ComprehensiveLeaderboard.jsx'

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
            path:"/learn/practice",
            element:<Practice /> 
          },
          {
            path:"/learn/practice/subject/:subjectId",
            element:<Practice /> 
          },
          {
            path:"/learn/practice/:subjectId/:topicId",
            element:<Practice /> 
          },
          {
            path:"/tests/test-dashboard",
            element:<TestQuizDashboard /> 
          },
          {
            path:"/tests/test-dashboard/start-test/:testId",
            element:<TestScreen /> 
          },
          {
            path:"/tests/leaderboard/:testId",
            element:<TestLeaderboard /> 
          },
          {
            path:"/tests/leaderboard",
            element:<ComprehensiveLeaderboard /> 
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
          },
          {
            path: '/admin/content/tests',
            element: <TestDashboard />
          },
          {
            path: '/admin/content/tests/create',
            element: <CreateTestForm />
          },
          {
            path: '/admin/content/tests/edit-test/:testId',
            element: <EditTestForm />
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
