import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaUser, FaTasks } from 'react-icons/fa';

const Navbar = ({ darkMode, setDarkMode, isAuthenticated, username, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      shadow-lg transition-all duration-300
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaTasks className={`
                text-2xl
                ${darkMode ? 'text-blue-200' : 'text-blue-900'}
              `} />
              <span className={`
                text-xl font-bold
                ${darkMode ? 'text-white' : 'text-gray-900'}
              `}>
                TaskMaster
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className={`
                  px-3 py-2 rounded-lg flex items-center space-x-2
                  ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                `}>
                  <FaUser className="inline-block" />
                  <span>{username}</span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`
                    p-2 rounded-lg transition-all duration-300
                    ${darkMode 
                      ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <FaSun /> : <FaMoon />}
                </button>
                <button
                  onClick={onLogout}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300
                    ${darkMode 
                      ? 'bg-red-700 text-white hover:bg-red-600' 
                      : 'bg-red-500 text-white hover:bg-red-600'}
                  `}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300
                    ${darkMode 
                      ? 'bg-blue-900 text-white hover:bg-blue-800' 
                      : 'bg-blue-900 text-white hover:bg-blue-800'}
                  `}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300
                    ${darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 