import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, token, authLoading } = useContext(AuthContext);
  const isAuthenticated = !!token;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use framer-motion for subtle animations
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const dropdownVariants = {
    open: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  if (authLoading) {
    return (
      <nav className="bg-neutral-900 shadow-lg border-b border-neutral-700 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          Loading...
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-neutral-900 shadow-lg border-b border-neutral-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-white hover:text-indigo-400 transition-colors tracking-wide"
        >
          ConnectHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                <span>Create Post</span>
              </Link>
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U N'}&background=6366f1&color=fff&bold=true`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-500 transition-all"
                  />
                </motion.button>

                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    className="absolute right-0 mt-3 w-56 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-4 border-b border-neutral-700">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-200 hover:bg-neutral-700 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} className="mr-3 text-indigo-400" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={authLoading}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-200 hover:bg-neutral-700 transition-colors"
                    >
                      <LogOut size={16} className="mr-3 text-red-400" />
                      {authLoading ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-400 font-medium hover:text-indigo-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-800 focus:outline-none transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          className="md:hidden absolute top-full left-0 right-0 bg-neutral-900 border-t border-neutral-700 shadow-xl z-40"
        >
          <div className="px-2 pt-2 pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-neutral-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus size={18} className="mr-3 text-indigo-400" />
                  Create Post
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-neutral-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-3 text-indigo-400" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={authLoading}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-neutral-800 text-left transition-colors"
                >
                  <LogOut size={18} className="mr-3 text-red-400" />
                  {authLoading ? 'Signing Out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-neutral-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn size={18} className="mr-3" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus size={18} className="mr-3" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;