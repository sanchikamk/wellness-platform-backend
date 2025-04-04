import User from "../model/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, role, specialization, experience, availability } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      specialization,
      experience,
      availability,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", err });
  }
};

// Get all users with role "counselor"
export const getCouncelors = async (req, res) => {
  try {
    const counselors = await User.find({ role: "counselor" });

    res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch counselors",
      error: error.message,
    });
  }
};
