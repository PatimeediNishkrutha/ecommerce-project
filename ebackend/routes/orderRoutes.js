const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  protect,
  adminOnly,
} = require("../middleware/protect");

const router = express.Router();


// ======================================================
// CREATE ORDER
// LOGGED-IN CUSTOMER
// ======================================================

router.post("/", protect, async (req, res) => {

  console.log("🔥 NEW ORDER ROUTE IS RUNNING");

  try {

    console.log("================================");
    console.log("CREATE ORDER");
    console.log("USER FROM TOKEN:", req.user);
    console.log("ORDER BODY:", req.body);
    console.log("================================");

    const {
      products,
      totalAmount,
      customer,
    } = req.body;


    // ==================================================
    // CHECK USER
    // ==================================================

    if (!req.user || !req.user.id) {

      return res.status(401).json({
        message:
          "User information is missing. Please login again.",
      });

    }


    // ==================================================
    // CHECK PRODUCTS
    // ==================================================

    if (
      !Array.isArray(products) ||
      products.length === 0
    ) {

      return res.status(400).json({
        message: "Products are required",
      });

    }


    // ==================================================
    // CHECK TOTAL
    // ==================================================

    if (
      totalAmount === undefined ||
      totalAmount === null
    ) {

      return res.status(400).json({
        message: "Total amount is required",
      });

    }


    // ==================================================
    // CHECK CUSTOMER DETAILS
    // ==================================================

    if (!customer) {

      return res.status(400).json({
        message: "Delivery details are required",
      });

    }


    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode
    ) {

      return res.status(400).json({
        message:
          "Please provide all delivery details",
      });

    }


    // ==================================================
    // FIND ADMIN OWNER
    // ==================================================

    let orderAdmin = null;


    // ==================================================
    // CHECK PRODUCTS AND STOCK
    // ==================================================

    for (const product of products) {

      console.log(
        "Checking product:",
        product.productId
      );


      // ================================================
      // PRODUCT ID REQUIRED
      // ================================================

      if (!product.productId) {

        return res.status(400).json({
          message:
            "A product in your cart has an invalid ID. Please remove it and add the product again.",
        });

      }


      // ================================================
      // VALID MONGODB ID
      // ================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          product.productId
        )
      ) {

        return res.status(400).json({
          message:
            "A product in your cart has an invalid ID. Please remove it and add the product again.",
        });

      }


      // ================================================
      // GET PRODUCT
      // ================================================

      const dbProduct =
        await Product.findById(
          product.productId
        );


      // ================================================
      // PRODUCT NOT FOUND
      // ================================================

      if (!dbProduct) {

        return res.status(404).json({
          message:
            `Product "${product.name || "Unknown"}" no longer exists.`,
        });

      }


      // ================================================
      // PRODUCT MUST HAVE ADMIN
      // ================================================

      if (!dbProduct.admin) {

        return res.status(400).json({
          message:
            `${dbProduct.name} does not have an admin owner assigned.`,
        });

      }


      // ================================================
      // FIRST PRODUCT ADMIN
      // ================================================

      if (!orderAdmin) {

        orderAdmin =
          dbProduct.admin.toString();

      }


      // ================================================
      // PREVENT MIXED ADMIN ORDERS
      // ================================================

      if (
        orderAdmin !==
        dbProduct.admin.toString()
      ) {

        return res.status(400).json({
          message:
            "Products from different admins cannot be placed in the same order. Please place separate orders.",
        });

      }


      // ================================================
      // QUANTITY
      // ================================================

      const quantity =
        Number(product.quantity);


      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {

        return res.status(400).json({
          message:
            `Invalid quantity for ${dbProduct.name}.`,
        });

      }


      // ================================================
      // STOCK
      // ================================================

      if (dbProduct.stock <= 0) {

        return res.status(400).json({
          message:
            `${dbProduct.name} is out of stock.`,
        });

      }


      if (
        quantity >
        dbProduct.stock
      ) {

        return res.status(400).json({
          message:
            `Only ${dbProduct.stock} ${dbProduct.name} available in stock.`,
        });

      }


      console.log(
        "PRODUCT:",
        dbProduct.name
      );

      console.log(
        "STOCK:",
        dbProduct.stock
      );

      console.log(
        "QUANTITY:",
        quantity
      );

    }


    // ==================================================
    // CHECK ADMIN
    // ==================================================

    if (!orderAdmin) {

      return res.status(400).json({
        message:
          "Unable to determine product owner.",
      });

    }


    console.log(
      "ORDER ADMIN:",
      orderAdmin
    );


    // ==================================================
    // REDUCE STOCK
    // ==================================================

    for (const product of products) {

      const quantity =
        Number(product.quantity);


      const updatedProduct =
        await Product.findByIdAndUpdate(

          product.productId,

          {
            $inc: {
              stock: -quantity,
            },
          },

          {
            new: true,
          }

        );


      if (!updatedProduct) {

        return res.status(404).json({
          message:
            "Product could not be updated.",
        });

      }


      console.log(
        "STOCK UPDATED:",
        updatedProduct.name,
        updatedProduct.stock
      );

    }


    // ==================================================
    // CREATE ORDER
    // ==================================================

    const order = new Order({

      // Customer
      user: req.user.id,

      // Product owner/admin
      admin: orderAdmin,

      // Products
      products: products.map(
        (product) => ({

          productId:
            product.productId,

          name:
            product.name,

          price:
            Number(product.price),

          quantity:
            Number(product.quantity),

        })
      ),

      // Total
      totalAmount:
        Number(totalAmount),

      // Delivery details
      customer: {

        name:
          customer.name,

        phone:
          customer.phone,

        address:
          customer.address,

        city:
          customer.city,

        pincode:
          customer.pincode,

      },

      // Initial status
      status: "Pending",

    });


    // ==================================================
    // SAVE ORDER
    // ==================================================

    const savedOrder =
      await order.save();


    console.log(
      "================================"
    );

    console.log(
      "ORDER SAVED SUCCESSFULLY"
    );

    console.log(
      "ORDER ID:",
      savedOrder._id
    );

    console.log(
      "ADMIN ID:",
      savedOrder.admin
    );

    console.log(
      "================================"
    );


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({

      success: true,

      message:
        "Order placed successfully",

      order:
        savedOrder,

    });


  } catch (error) {

    console.error(
      "ORDER CREATION ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to place order",

      error:
        error.message,

    });

  }

});


// ======================================================
// GET ORDERS FOR CURRENT ADMIN
// ADMIN ONLY
// ======================================================

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      console.log(
        "================================"
      );

      console.log(
        "ADMIN GETTING ORDERS"
      );

      console.log(
        "ADMIN ID:",
        req.user.id
      );

      console.log(
        "================================"
      );


      const orders =
        await Order.find({
          admin: req.user.id,
        })

          .populate(
            "user",
            "name email"
          )

          .populate(
            "admin",
            "name email"
          )

          .populate(
            "products.productId",
            "name price image stock"
          )

          .sort({
            createdAt: -1,
          });


      console.log(
        "ADMIN ORDERS:",
        orders.length
      );


      return res.status(200).json({

        success: true,

        orders,

      });


    } catch (error) {

      console.error(
        "GET ADMIN ORDERS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders",

        error:
          error.message,

      });

    }

  }
);


// ======================================================
// GET TOTAL ORDERS FOR CURRENT ADMIN
// ======================================================

router.get(
  "/count",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const totalOrders =
        await Order.countDocuments({

          admin:
            req.user.id,

        });


      console.log(
        "ADMIN ORDER COUNT:",
        totalOrders
      );


      return res.status(200).json({

        success: true,

        totalOrders,

      });


    } catch (error) {

      console.error(
        "ORDER COUNT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to get order count",

        error:
          error.message,

      });

    }

  }
);


// ======================================================
// GET CUSTOMERS FOR CURRENT ADMIN
// ======================================================

router.get(
  "/customers",
  protect,
  adminOnly,
  async (req, res) => {

    try {

      console.log(
        "================================"
      );

      console.log(
        "ADMIN GETTING CUSTOMERS"
      );

      console.log(
        "ADMIN ID:",
        req.user.id
      );

      console.log(
        "================================"
      );


      // ==================================================
      // GET ONLY THIS ADMIN'S ORDERS
      // ==================================================

      const orders =
        await Order.find({
          admin: req.user.id,
        })

          .populate(
            "user",
            "name email"
          )

          .sort({
            createdAt: -1,
          });


      // ==================================================
      // REMOVE DUPLICATE CUSTOMERS
      // ==================================================

      const customerMap =
        new Map();


      orders.forEach(
        (order) => {

          // ----------------------------------------------
          // CHECK USER
          // ----------------------------------------------

          if (!order.user) {
            return;
          }


          const userId =
            order.user._id.toString();


          // ----------------------------------------------
          // FIRST ORDER OF CUSTOMER
          // ----------------------------------------------

          if (
            !customerMap.has(
              userId
            )
          ) {

            customerMap.set(
              userId,
              {

                _id:
                  order.user._id,

                name:
                  order.user.name,

                email:
                  order.user.email,

                phone:
                  order.customer?.phone ||
                  "",

                address:
                  order.customer?.address ||
                  "",

                city:
                  order.customer?.city ||
                  "",

                pincode:
                  order.customer?.pincode ||
                  "",

                totalOrders:
                  1,

                totalSpent:
                  Number(
                    order.totalAmount
                  ) || 0,

                lastOrderDate:
                  order.createdAt,

              }
            );


          } else {

            // ------------------------------------------
            // EXISTING CUSTOMER
            // ------------------------------------------

            const existingCustomer =
              customerMap.get(
                userId
              );


            existingCustomer.totalOrders +=
              1;


            existingCustomer.totalSpent +=
              Number(
                order.totalAmount
              ) || 0;

          }

        }
      );


      // ==================================================
      // CONVERT MAP TO ARRAY
      // ==================================================

      const customers =
        Array.from(
          customerMap.values()
        );


      console.log(
        "ADMIN CUSTOMERS:",
        customers.length
      );


      // ==================================================
      // RESPONSE
      // ==================================================

      return res.status(200).json({

        success: true,

        customers,

      });


    } catch (error) {

      console.error(
        "GET ADMIN CUSTOMERS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch customers",

        error:
          error.message,

      });

    }

  }
);


module.exports = router;