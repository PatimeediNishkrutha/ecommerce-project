import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./SuperAdminLogin.css";
import Typography from "@mui/material/Typography";

// THEME TOGGLE
import ThemeToggle from "../theme/ThemeToggle";

function SuperAdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/superadmin-login",
        formData
      );

      console.log(
        "SUPER ADMIN LOGIN RESPONSE:",
        response.data
      );

      // ==========================================
      // STORE SUPER ADMIN TOKEN
      // ==========================================

      localStorage.setItem(
        "superAdminToken",
        response.data.token
      );

      localStorage.setItem(
        "superAdminUser",
        JSON.stringify(response.data.user)
      );

      setMessage(
        "Super Admin login successful!"
      );

      navigate("/superadmin");

    } catch (error) {
      console.error(
        "SUPER ADMIN LOGIN ERROR:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Super Admin login failed"
      );
    }
  };

  return (
    <div className="super-admin-login-page">

      {/* ==========================================
          THEME TOGGLE
      ========================================== */}

      <div className="super-admin-theme-toggle">
        <ThemeToggle />
      </div>

      {/* ==========================================
          LOGIN CARD
      ========================================== */}

      <div className="super-admin-login-card">

        <div className="super-admin-login-header">

          <div className="super-admin-icon">
            <Typography />
          </div>

          <h2>
            Super Admin Login
          </h2>

          <p>
            Sign in to manage your application
          </p>

        </div>

        <form
          className="super-admin-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="super-admin-input-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Super Admin email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="super-admin-input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="super-admin-login-button"
          >
            Login as Super Admin
          </button>

        </form>

        {/* MESSAGE */}

        {message && (
          <p className="super-admin-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default SuperAdminLogin;