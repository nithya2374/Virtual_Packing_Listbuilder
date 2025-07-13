import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { body, validationResult } from "express-validator";


const router = express.Router();

// Sample route
router.get('/test', (req, res) => {
  res.send("Auth route working");
});

router.post('/signup', [
  body("firstname").notEmpty().withMessage("Firstname is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
  body("contact").matches(/^\d{10}$/).withMessage("Contact must be a valid 10-digit number")
],
async (req, res) => {
  const { firstname, email, password, contact } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ success:false, errors: errors.array() });
  }
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success:false, message: "User Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      email,
      contact,
      password: hashedPassword
    });
    await newUser.save();
    
    res.status(201).json({ 
      success:true, 
      message: "User Registered Sucessfully",
      user:{
         id: newUser._id,
         firstname: newUser.firstname,
         email: newUser.email 
      }
        });

  } catch (err) {
    res.status(500).json({ success:false, message: "signup error", error: err.message });
  }
});

router.post('/login', [

    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {

    console.log("Login attempt with:", email, password);
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
       return res.status(401).json({ success:false,  message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id , email:user.email}, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
       httpOnly: true,
       secure:false,
       sameSite: "Lax", // Or 'Lax'
       maxAge: 24 * 60 * 60 * 1000, // 1 day
     });

    res.status(200).json({
      success:true,
      message: "Login successful",
      user:
      { id: user._id,
        firstname: user.firstname,
        email:user.email,
      },
    });

  } 
  catch (err) {
    res.status(500).json({ success:false, message: "Login error", error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true, message: "Logged out" });
});

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: `Hello ${req.user.email}, you are authenticated!`
  });
});


router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("firstname email"); // include firstname
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user }); // send full user
});


export default router;
