const express = require("express");

const router = express.Router();

// =====================================================
// IMPORT PRODUCT CONTROLLER
// =====================================================

const productController =
  require("../controller/productController");

// =====================================================
// IMPORT AUTH MIDDLEWARE
// =====================================================

const authMiddleware =
  require("../middleware/protect");

// =====================================================
// CONTROLLER FUNCTIONS
// =====================================================

const {
  addProduct,
  getProducts,
  getAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = productController;

// =====================================================
// AUTH FUNCTIONS
// =====================================================

const {
  protect,
  adminOnly,
} = authMiddleware;

// =====================================================
// DEBUG
// =====================================================

console.log(
  "===================================="
);

console.log(
  "PRODUCT ROUTES LOADED"
);

console.log(
  "addProduct:",
  typeof addProduct
);

console.log(
  "getProducts:",
  typeof getProducts
);

console.log(
  "getAdminProducts:",
  typeof getAdminProducts
);

console.log(
  "getProductById:",
  typeof getProductById
);

console.log(
  "updateProduct:",
  typeof updateProduct
);

console.log(
  "deleteProduct:",
  typeof deleteProduct
);

console.log(
  "protect:",
  typeof protect
);

console.log(
  "adminOnly:",
  typeof adminOnly
);

console.log(
  "===================================="
);

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get ALL products
// Used by Home page

router.get(
  "/",
  getProducts
);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get ONLY logged-in admin's products

router.get(
  "/admin/my-products",
  protect,
  adminOnly,
  getAdminProducts
);

// =====================================================
// SINGLE PRODUCT
// =====================================================

router.get(
  "/:id",
  getProductById
);

// =====================================================
// ADD PRODUCT
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  protect,
  adminOnly,
  addProduct
);

// =====================================================
// UPDATE PRODUCT
// ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// =====================================================
// DELETE PRODUCT
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;