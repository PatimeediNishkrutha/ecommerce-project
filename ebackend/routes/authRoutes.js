const express = require("express");

const {
  registerUser,
  loginUser,
  adminSignup,
  adminLogin,
  superAdminLogin,
} = require("../Controller/authController");

const router = express.Router();

console.log("AUTH ROUTES LOADED");

// =====================================================
// NORMAL USER REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  registerUser
);

// =====================================================
// NORMAL USER LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  loginUser
);

// =====================================================
// ADMIN SIGNUP
// POST /api/auth/admin-signup
// =====================================================

router.post(
  "/admin-signup",
  adminSignup
);

// =====================================================
// ADMIN LOGIN
// POST /api/auth/admin-login
// =====================================================

router.post(
  "/admin-login",
  adminLogin
);

router.post(
  "/superadmin-login", 
  superAdminLogin
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;