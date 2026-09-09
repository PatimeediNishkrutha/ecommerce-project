import React from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";

import ProductionQuantityLimitsRoundedIcon from "@mui/icons-material/ProductionQuantityLimitsRounded";

import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";

import GroupsIcon from "@mui/icons-material/Groups";

import StoreIcon from "@mui/icons-material/Store";

import LogoutIcon from "@mui/icons-material/Logout";


function AdminSidebar() {

  const navigate = useNavigate();


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    // Remove admin authentication

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );


    // Also remove old normal-user values
    // if they exist

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );


    navigate(
      "/admin/login"
    );

  };


  return (

    <aside className="admin-sidebar">


      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="admin-logo">

        <h2>
          My E-Shop
        </h2>

        <span>
          Admin Panel
        </span>

      </div>


      {/* ==================================================
          MENU
      ================================================== */}

      <ul className="admin-menu">


        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <li>

          <Link to="/admin">

            <SpaceDashboardIcon />

            Dashboard

          </Link>

        </li>


        {/* ==================================================
            PRODUCTS
        ================================================== */}

        <li>

          <Link to="/admin/products">

            <ProductionQuantityLimitsRoundedIcon />

            Products

          </Link>

        </li>


        {/* ==================================================
            ORDERS
        ================================================== */}

        <li>

          <Link to="/admin/orders">

            <ReceiptLongTwoToneIcon />

            Orders

          </Link>

        </li>


        {/* ==================================================
            CUSTOMERS
        ================================================== */}

        <li>

          <Link to="/admin/users">

            <GroupsIcon />

            Customers

          </Link>

        </li>


        {/* ==================================================
            BACK TO STORE
        ================================================== */}

        <li>

          <Link to="/">

            <StoreIcon />

            Back to Store

          </Link>

        </li>


      </ul>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div className="admin-sidebar-bottom">

        <button
          onClick={handleLogout}
        >

          <LogoutIcon />

          Logout

        </button>

      </div>


    </aside>

  );

}

export default AdminSidebar;