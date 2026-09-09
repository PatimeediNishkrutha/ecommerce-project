import React, { useEffect, useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import axios from "axios";
import "./SuperAdminOrders.css";

function SuperAdminOrders() {
  const [orders, setOrders] = useState([]);

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem("superAdminToken");

        const response = await axios.get(
          "http://localhost:5000/api/superadmin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "ALL ORDERS:",
          JSON.stringify(response.data, null, 2)
        );

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(
          "FETCH ALL ORDERS ERROR:",
          error
        );
      }
    };

    fetchAllOrders();
  }, []);

  return (
    <div className="super-admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SuperAdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="super-admin-main-content super-admin-orders-page">

        {/* HEADER */}

        <div className="super-admin-orders-header">

          <h1>All Orders</h1>

          <p>
            Manage and view all customer orders.
          </p>

        </div>


        {/* =====================================================
            ORDER COUNT
        ===================================================== */}

        <p>
          <strong>Total Orders:</strong>{" "}
          {orders.length}
        </p>


        {/* =====================================================
            ORDERS
        ===================================================== */}

        {orders.length > 0 ? (

          orders.map((order, index) => (

            <div
              className="super-admin-order-card"
              key={order._id}
            >

              {/* =================================================
                  ORDER HEADER
              ================================================= */}

              <div className="super-admin-order-header">

                <div>

                  <h2>
                    Order #{index + 1}
                  </h2>

                  <div className="super-admin-order-id">
                    Order ID: {order._id}
                  </div>

                </div>

                <div className="super-admin-order-status">
                  {order.status}
                </div>

              </div>


              {/* =================================================
                  CUSTOMER + ADMIN DETAILS
              ================================================= */}

              <div className="super-admin-order-details">

                {/* CUSTOMER */}

                <div className="super-admin-order-section">

                  <h3>
                    Customer Details
                  </h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.customer?.name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.user?.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customer?.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.customer?.address}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {order.customer?.city}
                  </p>

                  <p>
                    <strong>Pincode:</strong>{" "}
                    {order.customer?.pincode}
                  </p>

                </div>


                {/* ADMIN */}

                <div className="super-admin-order-section">

                  <h3>
                    Admin Details
                  </h3>

                  <p>
                    <strong>Admin:</strong>{" "}
                    {order.admin?.name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.admin?.email}
                  </p>

                </div>


                {/* ORDER */}

                <div className="super-admin-order-section">

                  <h3>
                    Order Information
                  </h3>

                  <p>
                    <strong>Status:</strong>{" "}
                    {order.status}
                  </p>

                  <p>
                    <strong>Total:</strong>{" "}
                    ₹{order.totalAmount}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>


              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div className="super-admin-order-products">

                <h3>
                  Products
                </h3>

                {order.products?.map(
                  (product, productIndex) => (

                    <div
                      className="super-admin-product"
                      key={productIndex}
                    >

                      {/* PRODUCT IMAGE */}

                      {product.productId?.image && (

                        <img
                          className="super-admin-product-image"
                          src={product.productId.image}
                          alt={product.name}
                        />

                      )}


                      {/* PRODUCT INFORMATION */}

                      <div className="super-admin-product-info">

                        <h4>
                          {product.name}
                        </h4>

                        <p>
                          Price: ₹{product.price}
                        </p>

                        <p>
                          Quantity: {product.quantity}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* =================================================
                  ORDER FOOTER
              ================================================= */}

              <div className="super-admin-order-footer">

                <div className="super-admin-order-total">

                  Total Amount: ₹
                  {order.totalAmount}

                </div>

                <div className="super-admin-order-date">

                  Ordered on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="super-admin-no-orders">
            No orders found.
          </div>

        )}

      </main>

    </div>
  );
}

export default SuperAdminOrders;