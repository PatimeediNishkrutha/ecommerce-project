import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";
import "./admin.css";
function AdminNavbar() {
  const navigate = useNavigate();

  // Get ONLY admin information
  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  const handleLogout = () => {
    // Remove ONLY admin login information
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // Go to ADMIN login page
    navigate("/admin/login");
  };

  return (
    <header className="admin-navbar">

      <div>
        <h3>Admin Dashboard</h3>
      </div>

      <div className="admin-user">

        {/* Dark / Light Theme Button */}
        <ThemeToggle />

        <div className="admin-avatar">
          {adminUser?.name
            ? adminUser.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div className="admin-user-info">

          <strong>
            {adminUser?.name || "Administrator"}
          </strong>

          <span>
            Admin
          </span>

        </div>

        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default AdminNavbar;