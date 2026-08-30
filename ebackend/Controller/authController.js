const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

console.log("AUTH CONTROLLER LOADED");

// =====================================================
// CREATE JWT
// =====================================================

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// =====================================================
// NORMAL USER REGISTER
// POST /api/auth/register
// =====================================================

const registerUser = async (req, res) => {
  try {
    console.log("=================================");
    console.log("NORMAL USER REGISTER");

    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);

    // =============================================
    // CHECK REQUIRED FIELDS
    // =============================================

    if (
      !name ||
      !email ||
      !password ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Please provide name, email, phone and password",
      });
    }

    // =============================================
    // CLEAN DATA
    // =============================================

    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanPhone = phone.trim();

    // =============================================
    // PHONE VALIDATION
    // =============================================

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message:
          "Please enter a valid 10-digit phone number",
      });
    }

    // =============================================
    // PASSWORD LENGTH
    // =============================================

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters",
      });
    }

    // =============================================
    // CHECK EXISTING USER
    // =============================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email already exists",
      });
    }

    // =============================================
    // HASH PASSWORD
    // =============================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =============================================
    // CREATE NORMAL USER
    // =============================================

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "user",
      authProvider: "local",
    });

    console.log(
      "NORMAL USER CREATED:",
      user.email
    );

    console.log("ROLE:", user.role);

    console.log("=================================");

    return res.status(201).json({
      message:
        "User account created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "NORMAL REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during user registration",
      error: error.message,
    });
  }
};

// =====================================================
// NORMAL USER LOGIN
// POST /api/auth/login
// =====================================================

const loginUser = async (req, res) => {
  try {
    console.log("=================================");
    console.log("NORMAL USER LOGIN");

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password",
      });
    }

    // =============================================
    // CLEAN EMAIL
    // =============================================

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // =============================================
    // FIND USER
    // =============================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    console.log(
      "User found:",
      !!user
    );

    // =============================================
    // USER NOT FOUND
    // =============================================

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // =============================================
    // BLOCK ADMIN FROM USER LOGIN
    // =============================================

    if (user.role === "admin") {
      return res.status(403).json({
        message:
          "Admins cannot login here. Please use the Admin Login page.",
      });
    }

    // =============================================
    // GOOGLE USER
    // =============================================

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account uses Google Login. Please login with Google.",
      });
    }

    // =============================================
    // CHECK PASSWORD
    // =============================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // =============================================
    // CREATE TOKEN
    // =============================================

    const token =
      createToken(user);

    console.log(
      "NORMAL USER LOGIN SUCCESS:",
      user.email
    );

    console.log("=================================");

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "NORMAL LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN SIGNUP
// POST /api/auth/admin-signup
// =====================================================

const adminSignup = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN SIGNUP");

    const {
      name,
      email,
      password,
    } = req.body;

    console.log(
      "Admin Name:",
      name
    );

    console.log(
      "Admin Email:",
      email
    );

    // =============================================
    // CHECK FIELDS
    // =============================================

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Please provide name, email and password",
      });
    }

    // =============================================
    // CLEAN DATA
    // =============================================

    const cleanName =
      name.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    // =============================================
    // PASSWORD
    // =============================================

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters",
      });
    }

    // =============================================
    // CHECK EXISTING ACCOUNT
    // =============================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email already exists",
      });
    }

    // =============================================
    // HASH PASSWORD
    // =============================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =============================================
    // CREATE ADMIN
    // =============================================

    const admin =
      await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        role: "admin",
        authProvider: "local",
      });

    console.log(
      "ADMIN CREATED SUCCESSFULLY"
    );

    console.log(
      "Admin:",
      admin.email
    );

    console.log(
      "Role:",
      admin.role
    );

    console.log("=================================");

    return res.status(201).json({
      message:
        "Admin account created successfully",

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN SIGNUP ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during admin signup",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN LOGIN
// POST /api/auth/admin-login
// =====================================================

const adminLogin = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN LOGIN");

    const {
      email,
      password,
    } = req.body;

    console.log(
      "Admin Login Email:",
      email
    );


    // =============================================
    // CHECK FIELDS
    // =============================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password",
      });
    }

    // =============================================
    // CLEAN EMAIL
    // =============================================

    const cleanEmail =
      email.trim().toLowerCase();

    // =============================================
    // FIND USER
    // =============================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    console.log(
      "Admin found:",
      !!user
    );

    // =============================================
    // USER NOT FOUND
    // =============================================

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid admin email or password",
      });
    }

    // =============================================
    // CHECK ROLE
    // =============================================

    if (user.role !== "admin") {
      return res.status(403).json({
        message:
          "This account is not an administrator account.",
      });
    }
    // =============================================
// CHECK ACTIVE STATUS
// =============================================

if (user.isActive === false) {
  return res.status(403).json({
    message:
      "This admin account has been deactivated. Please contact the Super Admin.",
  });
}

    // =============================================
    // CHECK PASSWORD
    // =============================================

    if (!user.password) {
      return res.status(400).json({
        message:
          "Admin account does not have a password.",
      });
    }

    // =============================================
    // PASSWORD MATCH
    // =============================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "Password match:",
      passwordMatch
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid admin email or password",
      });
    }

    // =============================================
    // CREATE ADMIN TOKEN
    // =============================================

    const token =
      createToken(user);

    console.log(
      "ADMIN LOGIN SUCCESS"
    );

    console.log(
      "Admin:",
      user.email
    );

    console.log(
      "Role:",
      user.role
    );

    console.log("=================================");

    return res.status(200).json({
      message:
        "Admin login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during admin login",
      error: error.message,
    });
  }
};
// =====================================================
// SUPER ADMIN LOGIN
// POST /api/auth/superadmin-login
// =====================================================

const superAdminLogin = async (req, res) => {
  try {
    console.log("=================================");
    console.log("SUPER ADMIN LOGIN");

    const {
      email,
      password,
    } = req.body;

    // =============================================
    // CHECK FIELDS
    // =============================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password",
      });
    }

    // =============================================
    // CLEAN EMAIL
    // =============================================

    const cleanEmail =
      email.trim().toLowerCase();

    // =============================================
    // FIND SUPER ADMIN
    // =============================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    console.log(
      "Super Admin found:",
      !!user
    );

    // =============================================
    // USER NOT FOUND
    // =============================================

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid Super Admin email or password",
      });
    }

    // =============================================
    // CHECK SUPER ADMIN ROLE
    // =============================================

    if (user.role !== "superadmin") {
      return res.status(403).json({
        message:
          "This account is not a Super Admin account.",
      });
    }

    // =============================================
    // CHECK PASSWORD
    // =============================================

    if (!user.password) {
      return res.status(400).json({
        message:
          "Super Admin account does not have a password.",
      });
    }

    // =============================================
    // CHECK PASSWORD MATCH
    // =============================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "Password match:",
      passwordMatch
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid Super Admin email or password",
      });
    }

    // =============================================
    // CREATE JWT
    // =============================================

    const token =
      createToken(user);

    console.log(
      "SUPER ADMIN LOGIN SUCCESS"
    );

    console.log(
      "Super Admin:",
      user.email
    );

    console.log(
      "Role:",
      user.role
    );

    console.log("=================================");

    return res.status(200).json({
      message:
        "Super Admin login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during Super Admin login",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  adminSignup,
  adminLogin,
  superAdminLogin,
};