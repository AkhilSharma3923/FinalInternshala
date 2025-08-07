import React, { useEffect, useContext, useReducer } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import ProfileView from '../components/ProfileView';
import { BASE_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for data fetching logic
const useFetchData = (token) => {
  const initialState = {
    profile: null,
    posts: [],
    loadingProfile: true,
    loadingPosts: true,
    error: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_PROFILE_SUCCESS':
        return { ...state, profile: action.payload, loadingProfile: false };
      case 'FETCH_POSTS_SUCCESS':
        return { ...state, posts: action.payload, loadingPosts: false };
      case 'FETCH_FAILURE':
        return { ...state, error: action.payload, loadingProfile: false, loadingPosts: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/profile/view`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: response.data });
      } catch (err) {
        console.error('Error fetching profile:', err);
        dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load profile. Please check your connection.' });
      }
    };

    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/post/feed`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        dispatch({ type: 'FETCH_POSTS_SUCCESS', payload: response.data });
      } catch (err) {
        console.error('Error fetching posts:', err);
        dispatch({ type: 'FETCH_FAILURE', payload: 'Failed to load posts. Please try again later.' });
      }
    };

    fetchProfile();
    fetchAllPosts();
  }, [token]);

  return state;
};

const Home = () => {
  const { token } = useContext(AuthContext);
  const { profile, posts, loadingProfile, loadingPosts, error } = useFetchData(token);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-red-400 flex items-center justify-center p-8 text-center">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8 lg:p-12">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side - Profile Section */}
        <motion.div
          className="w-full lg:w-1/3 xl:w-1/4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:sticky lg:top-8">
            <AnimatePresence mode="wait">
              {loadingProfile ? (
                <motion.div
                  key="profile-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-800 p-8 rounded-3xl text-center text-gray-400 min-h-[300px] flex items-center justify-center"
                >
                  Loading profile...
                </motion.div>
              ) : (
                profile && (
                  <motion.div
                    key="profile-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProfileView profile={profile} />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side - Posts Section */}
        <div className="w-full lg:w-2/3 xl:w-3/4">
          <motion.div
            className="max-w-4xl mx-auto space-y-6 md:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {loadingPosts ? (
                <motion.div
                  key="posts-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-400 mt-10"
                >
                  Loading posts...
                </motion.div>
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500 mt-10 p-8 bg-neutral-800 rounded-3xl"
                >
                  <p className="text-lg font-semibold">No posts to show right now.</p>
                  <p className="text-sm text-gray-600 mt-2">Check back later for new content!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;