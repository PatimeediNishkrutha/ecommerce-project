const Product = require("../models/Product");

// =====================================================
// ADD PRODUCT
// ADMIN ONLY
// =====================================================

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Admin information is missing",
      });
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required product fields",
      });
    }

    // ==========================================
    // PRICE VALIDATION
    // ==========================================

    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // ==========================================
    // STOCK VALIDATION
    // ==========================================

    if (Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // ==========================================
    // CREATE PRODUCT
    // ==========================================

    const product = new Product({
      name: name.trim(),

      description: description.trim(),

      price: Number(price),

      category: category.trim(),

      stock: Number(stock),

      image: image || "",

      // Store the logged-in admin
      admin: req.user.id,
    });

    // ==========================================
    // SAVE
    // ==========================================

    await product.save();

    console.log(
      "===================================="
    );

    console.log(
      "PRODUCT CREATED:",
      product._id
    );

    console.log(
      "PRODUCT NAME:",
      product.name
    );

    console.log(
      "PRODUCT OWNER ADMIN:",
      req.user.id
    );

    console.log(
      "===================================="
    );

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while adding product",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL PRODUCTS
// PUBLIC
//
// Used by Home/customer website
// Shows products created by ALL admins
// =====================================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate(
        "admin",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    console.log(
      "TOTAL PRODUCTS:",
      products.length
    );

    return res.status(200).json(
      products
    );

  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching products",
      error: error.message,
    });
  }
};

// =====================================================
// GET ADMIN PRODUCTS
// ADMIN ONLY
//
// Shows ONLY products created by current admin
// =====================================================

const getAdminProducts = async (req, res) => {
  try {
    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Admin information is missing",
      });
    }

    // ==========================================
    // FIND CURRENT ADMIN PRODUCTS
    // ==========================================

    const products = await Product.find({
      admin: req.user.id,
    })
      .sort({
        createdAt: -1,
      });

    console.log(
      "===================================="
    );

    console.log(
      "CURRENT ADMIN:",
      req.user.id
    );

    console.log(
      "ADMIN PRODUCTS:",
      products.length
    );

    console.log(
      "===================================="
    );

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error(
      "GET ADMIN PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching admin products",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE PRODUCT
// PUBLIC
// =====================================================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // VALIDATE ID
    // ==========================================

    if (
      !id.match(
        /^[0-9a-fA-F]{24}$/
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid product ID",
      });
    }

    // ==========================================
    // FIND PRODUCT
    // ==========================================

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    return res.status(200).json(
      product
    );

  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching product",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PRODUCT
// ADMIN ONLY
//
// Admin can update ONLY their own product
// =====================================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Admin information is missing",
      });
    }

    // ==========================================
    // VALIDATE ID
    // ==========================================

    if (
      !id.match(
        /^[0-9a-fA-F]{24}$/
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid product ID",
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    // ==========================================
    // PRICE VALIDATION
    // ==========================================

    if (
      price !== undefined &&
      Number(price) < 0
    ) {
      return res.status(400).json({
        message:
          "Price cannot be negative",
      });
    }

    // ==========================================
    // STOCK VALIDATION
    // ==========================================

    if (
      stock !== undefined &&
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message:
          "Stock cannot be negative",
      });
    }

    // ==========================================
    // BUILD UPDATE DATA
    // ==========================================

    const updateData = {};

    if (name !== undefined) {
      updateData.name =
        name.trim();
    }

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    if (price !== undefined) {
      updateData.price =
        Number(price);
    }

    if (category !== undefined) {
      updateData.category =
        category.trim();
    }

    if (stock !== undefined) {
      updateData.stock =
        Number(stock);
    }

    if (image !== undefined) {
      updateData.image =
        image;
    }

    // ==========================================
    // UPDATE ONLY CURRENT ADMIN'S PRODUCT
    // ==========================================

    const product =
      await Product.findOneAndUpdate(
        {
          _id: id,
          admin: req.user.id,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or you do not own this product",
      });
    }

    console.log(
      "PRODUCT UPDATED:",
      product._id
    );

    return res.status(200).json({
      message:
        "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while updating product",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PRODUCT
// ADMIN ONLY
//
// Admin can delete ONLY their own product
// =====================================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:
          "Admin information is missing",
      });
    }

    // ==========================================
    // VALIDATE ID
    // ==========================================

    if (
      !id.match(
        /^[0-9a-fA-F]{24}$/
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid product ID",
      });
    }

    // ==========================================
    // DELETE ONLY CURRENT ADMIN'S PRODUCT
    // ==========================================

    const product =
      await Product.findOneAndDelete({
        _id: id,
        admin: req.user.id,
      });

    // ==========================================
    // NOT FOUND
    // ==========================================

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or you do not own this product",
      });
    }

    console.log(
      "PRODUCT DELETED:",
      product._id
    );

    return res.status(200).json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while deleting product",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  addProduct,
  getProducts,
  getAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
