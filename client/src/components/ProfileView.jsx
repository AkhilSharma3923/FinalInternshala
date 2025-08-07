import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, BarChart, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView = ({ profile }) => {
  const navigate = useNavigate();

  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-800 text-white rounded-3xl shadow-2xl border border-neutral-700 overflow-hidden"
    >
      {/* Header */}
      <div className="relative h-32 md:h-40 bg-gradient-to-r from-purple-600 to-indigo-500">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </div>

      {/* Main content */}
      <div className="px-6 pb-6 relative -mt-16 md:-mt-20 flex flex-col items-center">
        <div className="relative mb-3">
          <img
            src={`https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff&bold=true&size=100`}
            alt={profile.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-neutral-800 shadow-lg object-cover"
          />
          <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-neutral-800" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-100 text-center">{profile.name}</h2>
        <p className="text-sm text-gray-400 font-mono mt-0.5 text-center">{profile.email}</p>

        {profile.bio && (
          <p className="mt-3 text-center text-gray-300 text-sm max-w-sm italic px-2">"{profile.bio}"</p>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-neutral-900 border-y border-neutral-700 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <BarChart size={20} className="text-indigo-400 mb-1" />
          <p className="text-lg font-bold text-gray-100">{profile.posts?.length || 0}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Posts</p>
        </div>
        <div className="flex flex-col items-center">
          <Heart size={20} className="text-red-400 mb-1" />
          <p className="text-lg font-bold text-gray-100">
            {profile.posts?.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Likes</p>
        </div>
        <div className="flex flex-col items-center">
          <MessageCircle size={20} className="text-blue-400 mb-1" />
          <p className="text-lg font-bold text-gray-100">
            {profile.posts?.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
          </p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Comments</p>
        </div>
      </div>
      
      {/* View Profile Button and Join Date */}
      <div className="p-6 bg-neutral-900 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={18} className="text-gray-500" />
          <span>Joined {joinDate}</span>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition duration-200"
        >
          View Full Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileView;