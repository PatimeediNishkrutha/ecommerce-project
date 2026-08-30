const jwt = require("jsonwebtoken");

// =====================================================
// PROTECT USER / ADMIN / SUPER ADMIN
// =====================================================

const protect = (req, res, next) => {
  try {
    // ================================================
    // GET AUTHORIZATION HEADER
    // ================================================

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized. Please login.",
      });
    }

    // ================================================
    // GET TOKEN
    // ================================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    // ================================================
    // VERIFY TOKEN
    // ================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ================================================
    // STORE DECODED USER INFORMATION
    // ================================================

    req.user = decoded;

    // ================================================
    // CONTINUE
    // ================================================

    next();

  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired token. Please login again.",
    });
  }
};


// =====================================================
// ADMIN ONLY
// =====================================================

const adminOnly = (req, res, next) => {
  try {
    // ================================================
    // CHECK AUTHENTICATION
    // ================================================

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized.",
      });
    }

    // ================================================
    // CHECK ADMIN ROLE
    // ================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    // ================================================
    // ALLOW ADMIN
    // ================================================

    next();

  } catch (error) {
    console.error(
      "ADMIN AUTHORIZATION ERROR:",
      error
    );

    return res.status(403).json({
      message: "Admin access denied.",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  protect,
  adminOnly,
};