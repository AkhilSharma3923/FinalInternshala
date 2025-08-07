const express = require("express");
const postRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const Post = require("../models/post");
const User = require("../models/user");
const { post } = require("./auth");

// Create post
postRouter.post("/create", userAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const post = await Post.create({
      content,
      author: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.error("Create Post Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

postRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $ne: req.user._id },
    })
      .populate("author", "name email")
      .populate("comments.user", "name") // ✅ add this line
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Feed Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


postRouter.get("/loggedUser", userAuth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("author", "name email")
      .populate("comments.user", "name") // ✅ add this
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Logged User Posts Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// Get single post by ID
postRouter.get("/:id", userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("Get Post Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Delete post by ID
postRouter.delete("/:id", userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: post._id } });

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete Post Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Update post by ID
postRouter.put("/:id", userAuth, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    post.content = content || post.content;
    await post.save();

    res.status(200).json({ success: true, message: "Post updated successfully", data: post });
  } catch (err) {
    console.error("Update Post Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// Like or unlike a post
postRouter.put('/like/:id', userAuth, async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user ID
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.status(200).json({ 
      message: isLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST /api/post/comment/:id
postRouter.post('/comment/:id', userAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate comments' user data
    const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name');

    res.status(201).json({
      message: 'Comment added',
      comments: updatedPost.comments,
    });
  } catch (err) {
    console.error("Comment error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



// GET /api/post/comments/:id
postRouter.get('/comments/:id', userAuth,async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








module.exports = postRouter;
