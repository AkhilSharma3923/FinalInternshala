import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
};

const getAvatarUrl = (author) => {
  const name = author?.name || 'U N';
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff&bold=true`;
};

const PostCard = ({ post }) => {
  const { user, token } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.some(like => like === user.id));
    }
  }, [user, post.likes]);

  const handleLike = useCallback(async () => {
    if (!token) {
      console.error("User not authenticated.");
      return;
    }
    try {
      const response = await axios.put(`${BASE_URL}/api/post/like/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setLikes(response.data.likes.length);
      setLiked(response.data.likes.includes(user.id));
    } catch (err) {
      console.error("Like error:", err);
    }
  }, [token, post._id, user]);

  const handleComment = useCallback(async () => {
    if (!token || commentText.trim() === "") {
      console.error("Authentication token is missing or comment is empty.");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/post/comment/${post._id}`, {
        text: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setComments(response.data.comments);
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  }, [token, commentText, post._id]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-neutral-800 text-white p-6 rounded-3xl shadow-xl border border-neutral-700 w-full"
    >
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <img
          src={getAvatarUrl(post.author)}
          alt="Author Avatar"
          className="w-12 h-12 rounded-full border-2 border-indigo-500 mr-4"
        />
        <div>
          <h3 className="font-bold text-lg text-white">{post.author?.name || "Anonymous"}</h3>
          <p className="text-gray-400 text-sm">{timeSince(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-base leading-relaxed text-gray-200 mb-6 border-b border-neutral-700 pb-6">
        {post.content}
      </p>

      {/* Actions and Stats */}
      <div className="flex items-center space-x-6 mb-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart size={20} fill={liked ? "#EF4444" : "none"} strokeWidth={1.5} className={liked ? "text-red-500" : ""} />
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <MessageCircle size={20} strokeWidth={1.5} />
          <span>{comments?.length} {comments?.length === 1 ? 'Comment' : 'Comments'}</span>
        </motion.button>
      </div>

      {/* Comment Section (Conditionally Rendered) */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Comment Input */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-neutral-700 border border-neutral-600 rounded-full px-5 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleComment}
                disabled={commentText.trim() === ""}
                className="bg-indigo-600 text-white text-sm px-6 py-3 ml-2 rounded-full font-semibold hover:bg-indigo-700 transition disabled:bg-neutral-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Post
              </motion.button>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-52 overflow-y-auto custom-scrollbar">
              {comments?.length > 0 ? (
                comments.map((c, index) => (
                  <div
                    key={index}
                    className="bg-neutral-700 text-gray-200 text-sm p-4 rounded-xl flex items-start"
                  >
                    <img
                      src={getAvatarUrl(c.user)}
                      alt="Commenter Avatar"
                      className="w-8 h-8 rounded-full border-2 border-indigo-400 mr-3 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-indigo-400">{c.user?.name || "Anonymous"}</span>
                      <p className="text-gray-300 mt-1 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;