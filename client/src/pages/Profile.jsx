import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/constants";
import PostCard from "../components/PostCard";
import ProfileView from "../components/ProfileView";
import { motion } from "framer-motion";

const Profile = () => {
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/profile/view`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setError("Failed to load profile");
    }
  };

  const fetchMyPosts = async () => {
    try {
      setPostLoading(true);
      const res = await axios.get(`${BASE_URL}/api/post/loggedUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMyPosts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setError("Failed to load posts");
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserProfile();
      await fetchMyPosts();
      setLoading(false);
    };

    init();
  }, [token]);

  if (loading) {
    return <div className="text-white text-center mt-20 text-lg">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center mt-20 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="mb-12">
            {profile && <ProfileView profile={profile} />}
          </div>

          {/* My Posts Section */}
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-gray-100 border-b border-gray-700 pb-2">My Posts</h2>

            {postLoading ? (
              <p className="text-gray-400 text-center">Loading posts...</p>
            ) : myPosts.length === 0 ? (
              <p className="text-gray-500 text-center">You haven’t created any posts yet.</p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                {myPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;