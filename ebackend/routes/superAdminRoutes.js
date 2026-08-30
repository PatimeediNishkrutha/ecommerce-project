const express = require("express");

const {
  protect,
} = require("../middleware/protect");

const superAdminOnly = require("../middleware/superAdminOnly");

const {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deactivateAdmin,
  reactivateAdmin,
  getAdminCount,
  getProductCount,
  getOrderCount,
  getCustomerCount,
  getAllProducts,
  getAllOrders,
  getAllCustomers,
  getRevenueReports,
} = require("../Controller/superAdminController");
const router = express.Router();

// =====================================================
// GET ALL ADMINS
// GET /api/superadmin/admins
// =====================================================

router.get(
  "/admins",
  protect,
  superAdminOnly,
  getAllAdmins
);

// =====================================================
// CREATE ADMIN
// POST /api/superadmin/admins
// =====================================================

router.post(
  "/admins",
  protect,
  superAdminOnly,
  createAdmin
);

// =====================================================
// UPDATE ADMIN
// PUT /api/superadmin/admins/:id
// =====================================================

router.put(
  "/admins/:id",
  protect,
  superAdminOnly,
  updateAdmin
);

// =====================================================
// DEACTIVATE ADMIN
// PUT /api/superadmin/admins/:id/deactivate
// =====================================================

router.put(
  "/admins/:id/deactivate",
  protect,
  superAdminOnly,
  deactivateAdmin
);

// =====================================================
// REACTIVATE ADMIN
// PUT /api/superadmin/admins/:id/reactivate
// =====================================================

router.put(
  "/admins/:id/reactivate",
  protect,
  superAdminOnly,
  reactivateAdmin
);
// Get total admin count
router.get(
  "/stats/admins",
  protect,
  superAdminOnly,
  getAdminCount
);
// Get total product count
router.get(
  "/stats/products",
  protect,
  superAdminOnly,
  getProductCount
);
// Get total order count
router.get(
  "/stats/orders",
  protect,
  superAdminOnly,
  getOrderCount
);
// Get total customer count
router.get(
  "/stats/customers",
  protect,
  superAdminOnly,
  getCustomerCount
);
// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get(
  "/products",
  protect,
  superAdminOnly,
  getAllProducts
);
// =====================================================
// GET ALL ORDERS
// SUPER ADMIN ONLY
// =====================================================

router.get(
  "/orders",
  protect,
  superAdminOnly,
  getAllOrders
);
// =====================================================
// GET ALL CUSTOMERS
// =====================================================

router.get(
  "/customers",
  protect,
  superAdminOnly,
  getAllCustomers
);
// =====================================================
// GET REVENUE & REPORTS
// SUPER ADMIN ONLY
// =====================================================

router.get(
  "/reports",
  protect,
  superAdminOnly,
  getRevenueReports
);
module.exports = router;