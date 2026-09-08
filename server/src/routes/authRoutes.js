const nodemailer = require("nodemailer");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();


// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bio,
      teachSkills,
      learnSkills,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      bio,
      teachSkills,
      learnSkills,
    });

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully 🚀",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills,
      },
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful 🚀",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =========================
// GET ALL USERS
// =========================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.json(users);

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});


// =========================
// GET SINGLE USER PROFILE
// =========================
router.get("/user/:id", async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {

    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });

  }
});


// =========================
// UPDATE USER PROFILE
// =========================
router.put("/user/:id", async (req, res) => {
  try {

    const {
      name,
      bio,
      teachSkills,
      learnSkills,
    } = req.body;

    // Find and update user
    const user = await User.findByIdAndUpdate(

      req.params.id,

      {
        name,
        bio,
        teachSkills,
        learnSkills,
      },

      {
        new: true,
        runValidators: true,
      }

    ).select("-password");


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    res.json({

      message: "Profile updated successfully 🚀",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        teachSkills: user.teachSkills,
        learnSkills: user.learnSkills,
      },

    });

  } catch (error) {

    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });

  }
});


// =========================
// EXPORT ROUTER
// =========================
// =========================
// FORGOT PASSWORD
// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    // Create reset token
    const resetToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Reset URL
    const resetURL =
      `http://localhost:5173/reset-password/${resetToken}`;

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "SkillSwap Password Reset",

      html: `
        <h2>Reset Your SkillSwap Password</h2>

        <p>
          Click the link below to reset your password.
        </p>

        <a href="${resetURL}">
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>
      `,
    });

    res.json({
      message:
        "Password reset link sent to your email 📧",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to send reset email",
    });

  }
});
// =========================
// RESET PASSWORD
// =========================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Verify reset token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Update password
    user.password = hashedPassword;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });

  } catch (error) {

    console.error(error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({
        message:
          "This reset link is invalid or has expired",
      });
    }

    res.status(500).json({
      message: "Failed to reset password",
    });
  }
});
module.exports = router;