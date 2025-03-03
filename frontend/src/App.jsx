import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/pages/Home'
import MyBlogs from './components/pages/MyBlogs'
import Activity from './components/pages/Activity'
import Layout from './components/layout/Layout'
import ErrorPage from './components/pages/ErrorPage'
import Create from './components/pages/Create'
import LoginSignup from './components/pages/LoginSignup'

const App = () => {

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: '/',
            element: <Home />,
            index: true,
          },
          {
            path: '/create',
            element: <Create />
          },
          {
            path: '/myblogs',
            element: <MyBlogs />
          },
          {
            path: '/activity',
            element: <Activity />
          }
        ]
      },
      {
        path: '/login',
        element: <LoginSignup />
      }
    ]
  )

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App