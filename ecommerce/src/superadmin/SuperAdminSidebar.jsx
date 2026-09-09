import React from "react";
import { Link } from "react-router-dom";
import "./SuperAdminSidebar.css";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from "@mui/material/Typography";
function SuperAdminSidebar() {
  return (
    <aside className="super-admin-sidebar">

      <div className="super-admin-sidebar-title">
        👑 Super Admin
      </div>

      <nav className="super-admin-sidebar-nav">

        <Link to="/superadmin">
          <SpaceDashboardIcon/> Dashboard
        </Link>

        <Link to="/superadmin/admins">
          <AdminPanelSettingsRoundedIcon/> Manage Admins
        </Link>

        <Link to="/superadmin/products">
          <Inventory2RoundedIcon/> All Products
        </Link>

        <Link to="/superadmin/orders">
          <ReceiptLongTwoToneIcon/> All Orders
        </Link>

        <Link to="/superadmin/users">
          <GroupsIcon/> Customers
        </Link>

        <Link to="/superadmin/reports">
          <PaymentsRoundedIcon/> Revenue & Reports
        </Link>

        <Link to="/superadmin/settings">
          <SettingsIcon/> Settings
        </Link>

      </nav>

      <div className="super-admin-sidebar-bottom">

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("superAdminToken");
            localStorage.removeItem("superAdminUser");

            window.location.href =
              "/superadmin/login";
          }}
        >
          <LogoutIcon/> Logout
        </button>

      </div>

    </aside>
  );
}

export default SuperAdminSidebar;