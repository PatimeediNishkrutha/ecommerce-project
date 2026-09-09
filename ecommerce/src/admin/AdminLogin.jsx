import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "./AdminLogin.css";

import ThemeToggle from "../theme/ThemeToggle";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response =
        await axios.post(
          "http://localhost:5000/api/auth/admin-login",
          {
            email:
              formData.email
                .trim()
                .toLowerCase(),

            password:
              formData.password,
          }
        );

      console.log(
        "ADMIN LOGIN RESPONSE:",
        response.data
      );

      const {
        token,
        user,
      } = response.data;

      if (!token) {
        setMessage(
          "Admin token was not received."
        );

        return;
      }

      if (!user) {
        setMessage(
          "Admin information was not received."
        );

        return;
      }

      if (
        user.role !== "admin"
      ) {
        setMessage(
          "This account is not an administrator."
        );

        return;
      }

      // =========================================
      // CLEAR OLD ADMIN SESSION
      // =========================================

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminUser"
      );

      // =========================================
      // SAVE ADMIN SESSION
      // =========================================

      localStorage.setItem(
        "adminToken",
        token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(user)
      );

      // =========================================
      // CLEAR NORMAL USER SESSION
      // =========================================

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      console.log(
        "ADMIN TOKEN SAVED:",
        localStorage.getItem(
          "adminToken"
        )
      );

      console.log(
        "ADMIN USER SAVED:",
        JSON.parse(
          localStorage.getItem(
            "adminUser"
          )
        )
      );

      // =========================================
      // GO ADMIN DASHBOARD
      // =========================================

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "ADMIN LOGIN ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "Invalid admin email or password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">

      {/* THEME TOGGLE */}

      <ThemeToggle />

      <div className="admin-login-box">

        <h2>
          Admin Login
        </h2>

        <p className="admin-login-subtitle">
          Login to access the Admin Dashboard
        </p>

        {message && (
          <p className="admin-login-message">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Admin Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              autoComplete="username"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter admin password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              autoComplete="current-password"
              required
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>

        </form>

        <p className="admin-signup-link">
          Don't have an admin account?{" "}

          <Link to="/admin/signup">
            Create Admin Account
          </Link>
        </p>

        <p className="user-login-link">
          Are you a normal user?{" "}

          <Link to="/login">
            User Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;