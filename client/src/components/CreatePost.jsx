import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { AuthContext } from '../context/AuthContext';
import { RotateCcw } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    if (content.length > 1000) {
      setError('Post cannot exceed 1000 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Make the API call using axios
      const response = await axios.post(
        `${BASE_URL}/api/post/create`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      navigate('/'); // Redirect to home after successful post
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-700"
      >
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-white mb-6">Create a New Post</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-3">
                What's on your mind?
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-5 py-3 bg-neutral-700 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border border-neutral-600 resize-none"
                rows={6}
                placeholder="Share your thoughts, ideas, or updates with the community..."
                maxLength={1000}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{content.length}/1000 characters</span>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900 text-red-300 rounded-lg text-sm border border-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-neutral-600 rounded-xl text-gray-300 hover:bg-neutral-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`px-6 py-3 rounded-xl text-white font-semibold transition duration-200 ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <RotateCcw size={16} className="animate-spin mr-2" />
                    Posting...
                  </span>
                ) : 'Post'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePost;
