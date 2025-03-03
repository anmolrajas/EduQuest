import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="bg-black shadow-md">
      <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
        {/* Left - App Name */}
        <div className="text-2xl font-bold text-yellow-500">
          <NavLink to="/home">Bloggy</NavLink>
        </div>

        {/* Center - Navigation Links */}
        <div className="space-x-10">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-white hover:text-yellow-500 font-bold ${isActive ? 'text-yellow-500 font-bold' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/create" 
            className={({ isActive }) => 
              `text-white hover:text-yellow-500 font-bold ${isActive ? 'text-yellow-500 font-bold' : ''}`
            }
          >
            Create
          </NavLink>
          <NavLink 
            to="/myblogs" 
            className={({ isActive }) => 
              `text-white hover:text-yellow-500 font-bold ${isActive ? 'text-yellow-500 font-bold' : ''}`
            }
          >
            My Blogs
          </NavLink>
          <NavLink 
            to="/activity" 
            className={({ isActive }) => 
              `text-white hover:text-yellow-500 font-bold ${isActive ? 'text-yellow-500 font-bold' : ''}`
            }
          >
            Activity
          </NavLink>
        </div>

        {/* Right - User Profile */}
        <div className="flex items-center space-x-3">
          <img
            src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
            alt="User Profile"
            className="w-10 h-10 rounded-full border"
          />
          <span className="text-white font-medium">John Doe</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
