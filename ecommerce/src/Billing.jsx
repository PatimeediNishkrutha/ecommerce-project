
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Billing.css";

function Billing() {
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  // ======================================================
  // SUBTOTAL
  // ======================================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ======================================================
  // DELIVERY
  // ======================================================

  const deliveryCharge = subtotal > 0 ? 100 : 0;

  // ======================================================
  // TOTAL
  // ======================================================

  const finalTotal = subtotal + deliveryCharge;

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // PLACE ORDER
  // ======================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (placingOrder) {
      return;
    }

    // ==================================================
    // CUSTOMER VALIDATION
    // ==================================================

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim() ||
      !customer.city.trim() ||
      !customer.pincode.trim()
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    // ==================================================
    // CART VALIDATION
    // ==================================================

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ==================================================
    // PRODUCT ID VALIDATION
    // ==================================================

    const invalidProduct = cartItems.find(
      (item) => !item._id
    );

    if (invalidProduct) {
      console.error(
        "INVALID CART PRODUCT:",
        invalidProduct
      );

      alert(
        "A product in your cart has an invalid ID. Please remove it and add the product again."
      );

      return;
    }

    try {
      setPlacingOrder(true);

      // ==================================================
      // GET NORMAL USER JWT
      // IMPORTANT:
      // Login.jsx saves token as "userToken"
      // ==================================================

      const token = localStorage.getItem("userToken");

      console.log("================================");
      console.log("USER TOKEN:", token);
      console.log(
        "USER TOKEN EXISTS:",
        Boolean(token)
      );
      console.log("================================");

      // ==================================================
      // CHECK LOGIN
      // ==================================================

      if (!token) {
        alert(
          "Please login before placing an order."
        );

        navigate("/login");

        return;
      }

      // ==================================================
      // PREPARE PRODUCTS
      // ==================================================

      const products = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      // ==================================================
      // ORDER DATA
      // ==================================================

      const orderData = {
        products,

        totalAmount: Number(finalTotal),

        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
          city: customer.city.trim(),
          pincode: customer.pincode.trim(),
        },
      };

      console.log(
        "SENDING ORDER:",
        orderData
      );

      // ==================================================
      // SEND ORDER
      // ==================================================

      const response = await axios.post(
        "http://52.66.240.219:5000",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ORDER RESPONSE:",
        response.data
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      alert(
        `Order placed successfully!\n\nTotal Amount: ₹${finalTotal.toLocaleString(
          "en-IN"
        )}`
      );

      navigate("/");

    } catch (error) {
      console.error(
        "ORDER ERROR:",
        error
      );

      // ==================================================
      // SERVER ERROR
      // ==================================================

      if (error.response) {
        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "SERVER RESPONSE:",
          error.response.data
        );

        // ==================================================
        // UNAUTHORIZED
        // ==================================================

        if (error.response.status === 401) {
          alert(
            "Your login session has expired. Please login again."
          );

          localStorage.removeItem(
            "userToken"
          );

          localStorage.removeItem(
            "userData"
          );

          navigate("/login");

          return;
        }

        alert(
          error.response.data?.error ||
            error.response.data?.message ||
            "Failed to place order."
        );

      } else if (error.request) {
        alert(
          "Cannot connect to the backend server. Please make sure your backend is running."
        );

      } else {
        alert(
          "Something went wrong while placing the order."
        );
      }

    } finally {
      setPlacingOrder(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="billing-page">

      {/* HEADER */}

      <div className="billing-header">

        <h1>
          Billing & Checkout
        </h1>

        <Link
          to="/cart"
          className="back-btn"
        >
          ← Back to Cart
        </Link>

      </div>

      {/* EMPTY CART */}

      {cartItems.length === 0 ? (

        <div className="empty-billing">

          <h2>
            Your cart is empty 🛒
          </h2>

          <Link
            to="/"
            className="shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="billing-container">

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="order-summary">

            <h2>
              Order Summary
            </h2>

            {cartItems.map((item) => (

              <div
                className="billing-item"
                key={item._id}
              >

                <div className="billing-product">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                  ) : (

                    <div>
                      No Image
                    </div>

                  )}

                  <div>

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}

                      {" × "}

                      {item.quantity}
                    </p>

                  </div>

                </div>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            ))}

            <hr />

            <div className="bill-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="bill-row">

              <span>
                Delivery Charge
              </span>

              <span>
                ₹
                {deliveryCharge.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <hr />

            <div className="bill-total">

              <span>
                Total Amount
              </span>

              <span>
                ₹
                {finalTotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

          {/* ==================================================
              CUSTOMER DETAILS
          ================================================== */}

          <div className="customer-details">

            <h2>
              Delivery Details
            </h2>

            <form
              onSubmit={handlePlaceOrder}
            >

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={customer.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={customer.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Delivery Address"
                value={customer.address}
                onChange={handleChange}
                rows="4"
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={customer.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={customer.pincode}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="place-order-btn"
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Billing;