import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isLoggedIn, authLoading, token } = useContext(AuthContext);

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        await signup(formData);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, token, navigate]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-neutral-800 shadow-2xl rounded-3xl p-8 md:p-12 space-y-8 border border-neutral-700"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          {mode === 'login' ? 'Welcome Back' : 'Join ConnectHub'}
        </h2>

        {error && (
          <div className="bg-red-900 text-red-300 p-4 rounded-lg text-sm border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-neutral-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-neutral-600"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-neutral-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-neutral-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            className="w-full px-5 py-3 bg-neutral-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-neutral-600"
          />

          {mode === 'signup' && (
            <textarea
              name="bio"
              rows="3"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-neutral-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-neutral-600"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={authLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {authLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-indigo-400 hover:underline font-medium transition-colors"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:underline font-medium transition-colors"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
