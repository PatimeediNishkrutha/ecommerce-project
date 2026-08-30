const mongoose = require("mongoose");

// =====================================================
// PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // PRODUCT NAME
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // PRICE
    // ==========================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // STOCK
    // ==========================================

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ==========================================
    // IMAGE
    // ==========================================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // ADMIN / PRODUCT OWNER
    // ==========================================

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// PRODUCT MODEL
// =====================================================

const Product = mongoose.model(
  "Product",
  productSchema
);

// =====================================================
// EXPORT
// =====================================================

module.exports = Product;