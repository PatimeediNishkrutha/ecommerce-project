const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();

// =====================================================
// ADMIN SIGNUP
// POST /api/admin/signup
// =====================================================

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // =================================================
    // CLEAN EMAIL
    // =================================================

    const cleanEmail = email.toLowerCase().trim();

    // =================================================
    // CHECK EXISTING ADMIN
    // =================================================

    const existingAdmin = await Admin.findOne({
      email: cleanEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin email already registered",
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // =================================================
    // CREATE ADMIN
    // =================================================

    const admin = await Admin.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      message: "Admin account created successfully",

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(
      "ADMIN SIGNUP ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error during admin signup",
    });
  }
});


// =====================================================
// ADMIN LOGIN
// POST /api/admin/login
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // =================================================
    // CLEAN EMAIL
    // =================================================

    const cleanEmail = email.toLowerCase().trim();

    console.log(
      "ADMIN LOGIN ATTEMPT:",
      cleanEmail
    );

    // =================================================
    // FIND ADMIN
    // =================================================

    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    if (!admin) {
      console.log(
        "ADMIN NOT FOUND"
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log(
      "ADMIN FOUND:",
      admin.email
    );

    // =================================================
    // CHECK ACTIVE STATUS
    // =================================================

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Admin account is inactive",
      });
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      console.log(
        "ADMIN PASSWORD INCORRECT"
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // =================================================
    // CHECK JWT SECRET
    // =================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
    }

    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(
      "ADMIN JWT CREATED"
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      message: "Admin login successful",

      token,

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error during admin login",
    });
  }
});

module.exports = router;