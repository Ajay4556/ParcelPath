// controllers/userController.js

import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Signup Controller
export const signupController = async (req, res) => {
  try {
    const { fullName, email, password, phonenumber, city, address, role } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with the new fields including role
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phonenumber,
      city,
      address,
      role,
    });

    // Save user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Sign Up Successful",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phonenumber: newUser.phonenumber,
        city: newUser.city,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
