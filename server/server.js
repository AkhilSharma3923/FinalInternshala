const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile");
const postRouter = require("./routes/post");


// Connect to MongoDB
connectDB();

// Middlewares
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("LinkedIn Mini API is running");
});

// API routes (prefix with /api for good practice)
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
