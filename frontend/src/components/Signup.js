import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

const Signup = ({ onSignup, darkMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      onSignup(response.data.token, response.data.username);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`
        max-w-md w-full space-y-8 p-8 rounded-2xl shadow-lg
        ${darkMode ? 'bg-gray-800' : 'bg-white'}
        transition-all duration-300
      `}>
        <div>
          <h2 className={`
            text-center text-3xl font-extrabold tracking-tight
            ${darkMode ? 'text-white' : 'text-gray-900'}
          `}>
            Create your account
          </h2>
          <p className={`
            mt-2 text-center text-sm
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            Join TaskMaster and start organizing your tasks
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`
              p-3 rounded-lg text-sm
              ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}
            `}>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <FaUser />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-lg
                    ${darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'}
                    border focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
                    transition-all duration-300
                  `}
                  placeholder="Username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <FaEnvelope />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-lg
                    ${darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'}
                    border focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
                    transition-all duration-300
                  `}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-lg
                    ${darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'}
                    border focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
                    transition-all duration-300
                  `}
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <FaLock />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 rounded-lg
                    ${darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'}
                    border focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
                    transition-all duration-300
                  `}
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex justify-center items-center py-3 px-4 rounded-lg
                ${darkMode 
                  ? 'bg-blue-900 hover:bg-blue-800 text-white' 
                  : 'bg-blue-900 hover:bg-blue-800 text-white'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900
                transition-all duration-300
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Sign up
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className={`
              text-sm
              ${darkMode ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`
                  font-medium
                  ${darkMode 
                    ? 'text-blue-200 hover:text-blue-100' 
                    : 'text-blue-900 hover:text-blue-800'}
                  transition-colors duration-300
                `}
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
