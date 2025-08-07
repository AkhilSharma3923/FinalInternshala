import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const receivedToken = res.data.token;
      setToken(receivedToken);
      setUser(res.data.user);
      setIsLoggedIn(true);
      localStorage.setItem("token", receivedToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/signup`, userData, {
        withCredentials: true,
      });
      const receivedToken = res.data.token;
      setToken(receivedToken);
      setUser(res.data.user);
      setIsLoggedIn(true);
      localStorage.setItem("token", receivedToken);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    }
  };

  const checkAuth = async (storedToken) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/profile/view`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        withCredentials: true,
      });

      if (res.data.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkAuth(token);
    } else {
      setAuthLoading(false);
    }
  }, [token]);

  // ✅ Fetch user profile (if needed elsewhere)
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/profile/view`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // ✅ Corrected: fetch post feed
  const fetchAllPosts = async () => {
    try {
      setPostLoading(true);
      const res = await axios.get(`${BASE_URL}/api/post/feed`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching all posts:", error);
      setPostError(error);
    } finally {
      setPostLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setPostLoading(true);
      const res = await axios.get(`${BASE_URL}/api/post/loggedUser`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching my posts:", error);
      setPostError(error);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // Auth
        user,
        token,
        isLoggedIn,
        authLoading,
        login,
        signup,
        logout,

        // Post
        allPosts,
        myPosts,
        postLoading,
        postError,
        fetchAllPosts,
        fetchMyPosts,
        fetchProfile,

        // Comment
        comments,
        commentLoading,
        commentError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
