const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");


// =====================================================
// GET ALL ADMINS
// =====================================================

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      admins,
    });

  } catch (error) {
    console.error(
      "GET ALL ADMINS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while fetching admins",
    });
  }
};


// =====================================================
// CREATE ADMIN
// =====================================================

const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // =================================================
    // CHECK REQUIRED FIELDS
    // =================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, email and password",
      });
    }

    // =================================================
    // CLEAN DATA
    // =================================================

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // =================================================
    // CHECK PASSWORD LENGTH
    // =================================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    // =================================================
    // CHECK EXISTING ACCOUNT
    // =================================================

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const bcrypt = require("bcryptjs");

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =================================================
    // CREATE ADMIN IN USER COLLECTION
    // =================================================

    const admin = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Admin account created successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });

  } catch (error) {
    console.error(
      "CREATE ADMIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating admin",
    });
  }
};


// =====================================================
// UPDATE ADMIN
// =====================================================

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name and email are required",
      });
    }

    // =================================================
    // CLEAN DATA
    // =================================================

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // =================================================
    // FIND ADMIN
    // =================================================

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // =================================================
    // CHECK EMAIL USED BY ANOTHER USER
    // =================================================

    const existingUser = await User.findOne({
      email: cleanEmail,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already in use",
      });
    }

    // =================================================
    // UPDATE ADMIN
    // =================================================

    admin.name = cleanName;
    admin.email = cleanEmail;

    await admin.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Admin updated successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });

  } catch (error) {
    console.error(
      "UPDATE ADMIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating admin",
    });
  }
};


// =====================================================
// DEACTIVATE ADMIN
// =====================================================

const deactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // =================================================
    // FIND ADMIN
    // =================================================

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // =================================================
    // DEACTIVATE
    // =================================================

    admin.isActive = false;

    await admin.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Admin deactivated successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });

  } catch (error) {
    console.error(
      "DEACTIVATE ADMIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deactivating admin",
    });
  }
};


// =====================================================
// REACTIVATE ADMIN
// =====================================================

const reactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // =================================================
    // FIND ADMIN
    // =================================================

    const admin = await User.findOne({
      _id: id,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // =================================================
    // REACTIVATE
    // =================================================

    admin.isActive = true;

    await admin.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Admin reactivated successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });

  } catch (error) {
    console.error(
      "REACTIVATE ADMIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while reactivating admin",
    });
  }
};


// =====================================================
// GET SUPER ADMIN DASHBOARD STATS
// ADMIN COUNT
// =====================================================

const getAdminCount = async (req, res) => {
  try {
    const totalAdmins =
      await User.countDocuments({
        role: "admin",
      });

    return res.status(200).json({
      success: true,
      totalAdmins,
    });

  } catch (error) {
    console.error(
      "GET ADMIN COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while getting admin count",
    });
  }
};


// =====================================================
// GET SUPER ADMIN DASHBOARD STATS
// PRODUCT COUNT
// =====================================================

const getProductCount = async (req, res) => {
  try {
    const totalProducts =
      await Product.countDocuments();

    return res.status(200).json({
      success: true,
      totalProducts,
    });

  } catch (error) {
    console.error(
      "GET PRODUCT COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while getting product count",
    });
  }
};


// =====================================================
// GET SUPER ADMIN DASHBOARD STATS
// ORDER COUNT
// =====================================================

const getOrderCount = async (req, res) => {
  try {
    const totalOrders =
      await Order.countDocuments();

    return res.status(200).json({
      success: true,
      totalOrders,
    });

  } catch (error) {
    console.error(
      "GET ORDER COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while getting order count",
    });
  }
};


// =====================================================
// GET SUPER ADMIN DASHBOARD STATS
// CUSTOMER COUNT
// =====================================================

const getCustomerCount = async (req, res) => {
  try {
    const totalCustomers =
      await User.countDocuments({
        role: "user",
      });

    return res.status(200).json({
      success: true,
      totalCustomers,
    });

  } catch (error) {
    console.error(
      "GET CUSTOMER COUNT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while getting customer count",
    });
  }
};


// =====================================================
// GET ALL PRODUCTS FOR SUPER ADMIN
// =====================================================

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: "admin",
        model: "User",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error(
      "GET ALL PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching all products",
    });
  }
};


// =====================================================
// GET ALL ORDERS FOR SUPER ADMIN
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "admin",
        model: "User",
        select: "name email",
      })
      .populate(
        "products.productId",
        "name price image stock"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching all orders",
    });
  }
};


// =====================================================
// UPDATE PRODUCT - SUPER ADMIN
// =====================================================

const updateProductBySuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    // =================================================
    // CHECK REQUIRED FIELDS
    // =================================================

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required product details",
      });
    }

    // =================================================
    // FIND PRODUCT
    // =================================================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =================================================
    // UPDATE PRODUCT
    // =================================================

    product.name = name.trim();
    product.description = description.trim();
    product.price = Number(price);
    product.category = category.trim();
    product.stock = Number(stock);

    if (image !== undefined) {
      product.image = image.trim();
    }

    await product.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "SUPER ADMIN UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating product",
    });
  }
};


// =====================================================
// GET ALL CUSTOMERS FOR SUPER ADMIN
// =====================================================

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      customers,
    });

  } catch (error) {
    console.error(
      "GET ALL CUSTOMERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching customers",
    });
  }
};


// =====================================================
// GET REVENUE & REPORTS FOR SUPER ADMIN
// =====================================================

const getRevenueReports = async (req, res) => {
  try {
    // =================================================
    // GET ALL ORDERS
    // =================================================

    const orders =
      await Order.find();

    // =================================================
    // TOTAL ORDERS
    // =================================================

    const totalOrders =
      orders.length;

    // =================================================
    // TOTAL REVENUE
    // =================================================

    const totalRevenue =
      orders.reduce(
        (total, order) => {
          return (
            total +
            (Number(order.totalAmount) || 0)
          );
        },
        0
      );

    // =================================================
    // ORDER STATUS COUNTS
    // =================================================

    const pendingOrders =
      orders.filter(
        (order) =>
          order.status === "Pending"
      ).length;

    const confirmedOrders =
      orders.filter(
        (order) =>
          order.status === "Confirmed"
      ).length;

    const shippedOrders =
      orders.filter(
        (order) =>
          order.status === "Shipped"
      ).length;

    const deliveredOrders =
      orders.filter(
        (order) =>
          order.status === "Delivered"
      ).length;

    const cancelledOrders =
      orders.filter(
        (order) =>
          order.status === "Cancelled"
      ).length;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      totalOrders,

      totalRevenue,

      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
    });

  } catch (error) {
    console.error(
      "GET REVENUE REPORTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while getting revenue reports",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
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
  updateProductBySuperAdmin,
  getAllCustomers,
  getRevenueReports,
};