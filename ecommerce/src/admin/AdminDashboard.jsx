import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

import ProductionQuantityLimitsRoundedIcon from "@mui/icons-material/ProductionQuantityLimitsRounded";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import GroupsIcon from "@mui/icons-material/Groups";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

function AdminDashboard() {
  // ======================================================
  // STATES
  // ======================================================

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");

  // ======================================================
  // GET TOKEN
  // IMPORTANT:
  // Login.jsx saves token as:
  // localStorage.setItem("token", response.data.token)
  // ======================================================

  const getToken = () => {
    const token = localStorage.getItem("adminToken");

    console.log("=================================");
    console.log("TOKEN:", token);
    console.log("TOKEN EXISTS:", Boolean(token));
    console.log("TOKEN LENGTH:", token?.length);
    console.log("=================================");

    return token;
  };

  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // ======================================================
  // FETCH ORDERS
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrderError("");

      const token = getToken();

      if (!token) {
        setOrderError(
          "Admin login token not found. Please login again."
        );
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("ORDERS RESPONSE:", response.data);

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("FAILED TO FETCH ORDERS:", error);
      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        setOrderError(
          "Your admin login session has expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        setOrderError("Admin access required.");
      } else {
        setOrderError(
          error.response?.data?.message ||
            "Failed to load orders"
        );
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      console.log("ADMIN TOKEN NOT FOUND");
      return;
    }

    const response = await axios.get(
      "http://localhost:5000/api/products/admin/my-products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "MY ADMIN PRODUCTS RESPONSE:",
      response.data
    );

    if (Array.isArray(response.data)) {
      setProducts(response.data);
    } else {
      setProducts(response.data.products || []);
    }

  } catch (error) {
    console.error(
      "FAILED TO FETCH ADMIN PRODUCTS:",
      error
    );

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
    );

    setProducts([]);
  }
};

  // ======================================================
  // TOTAL PRODUCTS
  // ======================================================

  const totalProducts = products.length;

  // ======================================================
  // TOTAL ORDERS
  // ======================================================

  const totalOrders = orders.length;

  // ======================================================
  // TOTAL REVENUE
  // ======================================================

  const totalRevenue = orders.reduce(
    (total, order) => {
      return (
        total +
        Number(order.totalAmount || 0)
      );
    },
    0
  );

  // ======================================================
  // TOTAL CUSTOMERS
  // ======================================================

  const customerIds = orders
    .map((order) => {
      return (
        order.user?._id ||
        order.user ||
        order.customer?._id ||
        order.customer?.phone ||
        order.customer?.email ||
        order.customer?.name
      );
    })
    .filter(Boolean);

  const totalCustomers = new Set(
    customerIds
  ).size;

  // ======================================================
  // STATS
  // ======================================================

  const stats = [
    {
      icon: (
        <ProductionQuantityLimitsRoundedIcon />
      ),
      title: "Total Products",
      value: totalProducts,
      text: "active products",
    },

    {
      icon: (
        <ReceiptLongTwoToneIcon />
      ),
      title: "Total Orders",
      value: totalOrders,
      text: "orders received",
    },

    {
      icon: <GroupsIcon />,
      title: "Total Customers",
      value: totalCustomers,
      text: "customers",
    },

    {
      icon: <CurrencyRupeeRoundedIcon />,
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString(
        "en-IN"
      )}`,
      text: "total sales",
    },
  ];

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="admin-main">

        {/* NAVBAR */}
        <AdminNavbar />

        {/* CONTENT */}
        <main className="admin-content">

          {/* HEADER */}
          <div className="dashboard-header">

            <div>
              <h1>Dashboard</h1>

              <p>
                Welcome back, Admin! Here's what's
                happening with your store today.
              </p>
            </div>

            <button
              className="dashboard-date"
              type="button"
            >
              <span>Today</span>
            </button>

          </div>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <div className="dashboard-stats">

            {stats.map((stat, index) => (
              <div
                className="dashboard-stat-card"
                key={index}
              >

                <div className="stat-top">

                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span className="stat-menu">
                    ⋮
                  </span>

                </div>

                <p className="stat-title">
                  {stat.title}
                </p>

                <h2 className="stat-value">
                  {stat.value}
                </h2>

                <div className="stat-bottom">

                  <span className="stat-text">
                    {stat.text}
                  </span>

                </div>

              </div>
            ))}

          </div>

          {/* ==================================================
              STORE OVERVIEW
          ================================================== */}

          <div className="dashboard-grid">

            <div className="dashboard-card store-overview-card">

              <div className="dashboard-card-header">

                <div>
                  <h2>
                    Store Overview
                  </h2>

                  <p>
                    Current store status
                  </p>
                </div>

              </div>

              <div className="overview-list">

                {/* PRODUCTS */}

                <div className="overview-item">

                  <span className="overview-icon">
                    <ProductionQuantityLimitsRoundedIcon />
                  </span>

                  <div>
                    <strong>
                      Products
                    </strong>

                    <small>
                      {totalProducts} active products
                    </small>
                  </div>

                  <b>
                    {totalProducts}
                  </b>

                </div>

                {/* ORDERS */}

                <div className="overview-item">

                  <span className="overview-icon">
                    <ReceiptLongTwoToneIcon />
                  </span>

                  <div>
                    <strong>
                      Orders
                    </strong>

                    <small>
                      {totalOrders} orders received
                    </small>
                  </div>

                  <b>
                    {totalOrders}
                  </b>

                </div>

                {/* CUSTOMERS */}

                <div className="overview-item">

                  <span className="overview-icon">
                    <GroupsIcon />
                  </span>

                  <div>
                    <strong>
                      Customers
                    </strong>

                    <small>
                      Customers who placed orders
                    </small>
                  </div>

                  <b>
                    {totalCustomers}
                  </b>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              RECENT ORDERS
          ================================================== */}

          <div className="dashboard-card recent-orders">

            <div className="dashboard-card-header">

              <div>

                <h2>
                  Recent Orders
                </h2>

                <p>
                  Latest customer orders
                </p>

              </div>

              <button
                className="view-all-button"
                type="button"
                onClick={() => {
                  fetchOrders();
                  fetchProducts();
                }}
              >
                Refresh ↻
              </button>

            </div>

            {/* TABLE */}

            <div className="orders-table-wrapper">

              {/* LOADING */}

              {loadingOrders && (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                  }}
                >
                  Loading orders...
                </div>
              )}

              {/* ERROR */}

              {!loadingOrders &&
                orderError && (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    {orderError}
                  </div>
                )}

              {/* NO ORDERS */}

              {!loadingOrders &&
                !orderError &&
                orders.length === 0 && (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                    }}
                  >
                    No orders found.
                  </div>
                )}

              {/* ORDERS */}

              {!loadingOrders &&
                !orderError &&
                orders.length > 0 && (
                  <table className="orders-table">

                    <thead>
                      <tr>
                        <th>ORDER</th>
                        <th>CUSTOMER</th>
                        <th>PRODUCT</th>
                        <th>AMOUNT</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>

                      {orders
                        .slice(0, 10)
                        .map((order) => {

                          const customerName =
                            order.user?.name ||
                            order.customer?.name ||
                            "Customer";

                          const orderProducts =
                            order.products || [];

                          const productNames =
                            orderProducts
                              .map(
                                (product) =>
                                  `${product.name} × ${
                                    product.quantity || 1
                                  }`
                              )
                              .join(", ");

                          const status =
                            order.status ||
                            "Pending";

                          return (
                            <tr
                              key={order._id}
                            >

                              {/* ORDER */}

                              <td>
                                <strong>
                                  #
                                  {order._id
                                    ?.slice(-6)
                                    .toUpperCase()}
                                </strong>
                              </td>

                              {/* CUSTOMER */}

                              <td>

                                <div className="customer">

                                  <div className="customer-avatar">

                                    {customerName
                                      .charAt(0)
                                      .toUpperCase()}

                                  </div>

                                  <span>
                                    {customerName}
                                  </span>

                                </div>

                              </td>

                              {/* PRODUCT */}

                              <td>
                                {productNames ||
                                  "No products"}
                              </td>

                              {/* AMOUNT */}

                              <td>

                                <strong>
                                  ₹
                                  {Number(
                                    order.totalAmount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </strong>

                              </td>

                              {/* STATUS */}

                              <td>

                                <span
                                  className={`order-status ${
                                    status
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )
                                  }`}
                                >

                                  <span className="status-dot"></span>

                                  {status}

                                </span>

                              </td>

                            </tr>
                          );
                        })}

                    </tbody>

                  </table>
                )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;