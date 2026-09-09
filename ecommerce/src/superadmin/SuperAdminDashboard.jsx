import React, { useEffect, useState } from "react";
import axios from "axios";

import SuperAdminSidebar from "./SuperAdminSidebar";
import ThemeToggle from "../theme/ThemeToggle";

import "./SuperAdminDashboard.css";

import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import GroupsIcon from "@mui/icons-material/Groups";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";

function SuperAdminDashboard() {

  // =====================================================
  // SUPER ADMIN USER
  // =====================================================

  const superAdminUser = JSON.parse(
    localStorage.getItem("superAdminUser")
  );

  // =====================================================
  // DASHBOARD COUNTS
  // =====================================================

  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // =====================================================
  // FETCH ALL DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    fetchAdminCount();
    fetchProductCount();
    fetchOrderCount();
    fetchCustomerCount();
  }, []);

  // =====================================================
  // FETCH ADMIN COUNT
  // =====================================================

  const fetchAdminCount = async () => {
    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/stats/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ADMIN COUNT RESPONSE:",
        response.data
      );

      setTotalAdmins(
        response.data.totalAdmins
      );

    } catch (error) {
      console.error(
        "FETCH ADMIN COUNT ERROR:",
        error
      );
    }
  };

  // =====================================================
  // FETCH PRODUCT COUNT
  // =====================================================

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/stats/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "PRODUCT COUNT RESPONSE:",
        response.data
      );

      setTotalProducts(
        response.data.totalProducts
      );

    } catch (error) {
      console.error(
        "FETCH PRODUCT COUNT ERROR:",
        error
      );
    }
  };

  // =====================================================
  // FETCH ORDER COUNT
  // =====================================================

  const fetchOrderCount = async () => {
    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/stats/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "ORDER COUNT RESPONSE:",
        response.data
      );

      setTotalOrders(
        response.data.totalOrders
      );

    } catch (error) {
      console.error(
        "FETCH ORDER COUNT ERROR:",
        error
      );
    }
  };

  // =====================================================
  // FETCH CUSTOMER COUNT
  // =====================================================

  const fetchCustomerCount = async () => {
    try {
      const token = localStorage.getItem(
        "superAdminToken"
      );

      const response = await axios.get(
        "http://localhost:5000/api/superadmin/stats/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CUSTOMER COUNT RESPONSE:",
        response.data
      );

      setTotalCustomers(
        response.data.totalCustomers
      );

    } catch (error) {
      console.error(
        "FETCH CUSTOMER COUNT ERROR:",
        error
      );
    }
  };

  // =====================================================
  // DASHBOARD UI
  // =====================================================

  return (
    <div className="super-admin-layout">

      {/* =====================================================
          THEME TOGGLE
      ===================================================== */}

      <ThemeToggle />

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SuperAdminSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="super-admin-main-content">

        {/* PAGE HEADER */}

        <h1>
          Super Admin Dashboard
        </h1>

        <p>
          Welcome,{" "}
          {superAdminUser?.name ||
            "Super Admin"}
          !
        </p>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="super-admin-stats">

          {/* =================================================
              TOTAL ADMINS
          ================================================= */}

          <div className="super-admin-stat-card">

            <div className="stat-icon">

              <AdminPanelSettingsRoundedIcon />

            </div>

            <div>

              <h3>
                Total Admins
              </h3>

              <strong>
                {totalAdmins}
              </strong>

            </div>

          </div>

          {/* =================================================
              TOTAL PRODUCTS
          ================================================= */}

          <div className="super-admin-stat-card">

            <div className="stat-icon">

              <Inventory2RoundedIcon />

            </div>

            <div>

              <h3>
                Total Products
              </h3>

              <strong>
                {totalProducts}
              </strong>

            </div>

          </div>

          {/* =================================================
              TOTAL ORDERS
          ================================================= */}

          <div className="super-admin-stat-card">

            <div className="stat-icon">

              <ReceiptLongTwoToneIcon />

            </div>

            <div>

              <h3>
                Total Orders
              </h3>

              <strong>
                {totalOrders}
              </strong>

            </div>

          </div>

          {/* =================================================
              TOTAL CUSTOMERS
          ================================================= */}

          <div className="super-admin-stat-card">

            <div className="stat-icon">

              <GroupsIcon />

            </div>

            <div>

              <h3>
                Total Customers
              </h3>

              <strong>
                {totalCustomers}
              </strong>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default SuperAdminDashboard;