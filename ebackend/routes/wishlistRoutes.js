const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const protect = require("../middleware/authMiddleware");

// =====================================================
// ADD PRODUCT TO WISHLIST
// =====================================================

router.post("/add", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check product ID
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Check whether product is already in wishlist
    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingWishlist) {
      return res.status(400).json({
        message: "Product is already in your wishlist",
      });
    }

    // Add product to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId,
    });

    res.status(201).json({
      message: "Product added to wishlist successfully",
      wishlist: wishlistItem,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
});

// =====================================================
// GET LOGGED-IN USER'S WISHLIST
// =====================================================

router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
});

// =====================================================
// REMOVE PRODUCT FROM WISHLIST
// =====================================================

router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        message: "Product not found in your wishlist",
      });
    }

    res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
});

module.exports = router;