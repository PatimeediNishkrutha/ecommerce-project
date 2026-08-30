const mongoose = require("mongoose");


// =====================================================
// ORDER PRODUCT SCHEMA
// =====================================================

const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // CUSTOMER / USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ==========================================
    // ADMIN / PRODUCT OWNER
    // ==========================================

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ==========================================
    // PRODUCTS
    // ==========================================

    products: {
      type: [orderProductSchema],
      required: true,

      validate: {
        validator: function (value) {
          return value.length > 0;
        },

        message:
          "Order must contain at least one product",
      },
    },


    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },


    // ==========================================
    // CUSTOMER DELIVERY DETAILS
    // ==========================================

    customer: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },


    // ==========================================
    // ORDER STATUS
    // ==========================================

    status: {
      type: String,

      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);


// =====================================================
// ORDER MODEL
// =====================================================

const Order = mongoose.model(
  "Order",
  orderSchema
);


// =====================================================
// EXPORT
// =====================================================

module.exports = Order;