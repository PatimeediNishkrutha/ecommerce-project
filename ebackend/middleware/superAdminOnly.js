// =====================================================
// SUPER ADMIN ONLY MIDDLEWARE
// =====================================================

const superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        message: "Super Admin access required",
      });
    }

    next();

  } catch (error) {
    console.error(
      "SUPER ADMIN AUTHORIZATION ERROR:",
      error
    );

    return res.status(403).json({
      message: "Super Admin access denied",
    });
  }
};

module.exports = superAdminOnly;