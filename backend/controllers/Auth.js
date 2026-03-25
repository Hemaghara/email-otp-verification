import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../middleware/Email.js";
import { generateTokenAndSetCookies } from "../middleware/GenerateToken.js";
import { Usermodel } from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const Register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = crypto.randomInt(100000, 999999).toString();

    const user = new Usermodel({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    generateTokenAndSetCookies(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    const {
      password: _pw,
      verificationToken: _vt,
      ...safeUser
    } = user.toObject();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is required" });
    }

    const user = await Usermodel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("VerifyEmail error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { Register, VerifyEmail };
