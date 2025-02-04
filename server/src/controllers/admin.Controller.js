import adminModel from '../model/admin.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token validity
    );

    // Send the token as an HTTP-only cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for cross-origin in dev
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    
    console.log("Token sent: "+token);
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// src/controllers/auth.controller.js

export const adminLogout = async (req, res) => {
  try {
    console.log("Before"+res.cookie);
    // If you're using an HTTP-only cookie for the JWT
    res.clearCookie("adminToken", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for cross-origin in dev
   });
   console.log("After"+res.cookie);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout",
    });
  }
};

export const checkAuth = (req, res)=>{
  try {
    res.status(200).json({ message: "Authenticated" });
  } catch (error) {
      console.log("Error in checkAuth", error.message);
      return res.status(500).json({message: "Internal server error"});
  }
};