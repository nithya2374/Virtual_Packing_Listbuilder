import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Sample route
router.get('/test', (req, res) => {
  res.send("Auth route working");
});

router.post('/signup', async (req, res) => {
  const { firstname, email, password, contact } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User Already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname,
      email,
      contact,
      password: hashedPassword
    });

    res.status(201).json({ message: "User Created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "signup error", error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login success",
      token,
      userId: user._id,
      firstname: user.firstname
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

export default router;