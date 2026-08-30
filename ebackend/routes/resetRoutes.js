const express = require("express");

const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

router.delete("/reset-all", async (req, res) => {
  try {
    // Delete ALL users
    const users = await User.deleteMany({});

    // Delete ALL products
    const products = await Product.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All users and products deleted successfully",
      deletedUsers: users.deletedCount,
      deletedProducts: products.deletedCount,
    });

  } catch (error) {
    console.error("RESET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reset data",
      error: error.message,
    });
  }
});

module.exports = router;