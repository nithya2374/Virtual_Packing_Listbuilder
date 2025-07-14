import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();


// ✅ Health check
router.get("/test", (req, res) => {
  res.send("✅ Auth route working");
});


// ✅ Signup Route
router.post(
  "/signup",
  [
    body("firstname").notEmpty().withMessage("Firstname is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("contact").matches(/^\d{10}$/).withMessage("Contact must be a valid 10-digit number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstname, email, password, contact } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstname,
        email,
        contact,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          firstname: newUser.firstname,
          email: newUser.email,
        },
      });
    } catch (err) {
      console.error("Signup error:", err.message);
      res.status(500).json({ success: false, message: "Signup error", error: err.message });
    }
  }
);


// ✅ Login Route
router.post("/login", [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation failed:", errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log("🔍 Login attempt:", email, password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1h" }
    );

    console.log("✅ Token created:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login crash:", err);
    return res.status(500).json({
      success: false,
      message: "Login error",
      error: err.message
    });
  }
});


// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out" });
});


// ✅ /me Route — returns current logged-in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("firstname email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});


// ✅ Protected test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Hello ${req.user.email}, you are authenticated!`,
  });
});

export default router;
