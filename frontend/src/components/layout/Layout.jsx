import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../ui/Header'
import Footer from '../ui/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-500">
        <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
        <Footer />
    </div>
  )
}

export default Layout