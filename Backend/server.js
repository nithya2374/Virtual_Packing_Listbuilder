import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Show values for debugging (REMOVE in production)
console.log("✅ JWT_SECRET:", process.env.JWT_SECRET);
console.log("✅ MONGO_URL:", process.env.MONGO_URL);

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// ✅ Enable CORS for frontend with credentials
app.use(cors({
  origin: "http://localhost:5173", // Your frontend (React + Vite)
  credentials: true               // Allow sending cookies
}));

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
