import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import "./AdminSignup.css";

import ThemeToggle from "../theme/ThemeToggle";

function AdminSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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

    // =============================================
    // PASSWORD MATCH
    // =============================================

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );

      return;
    }

    // =============================================
    // PASSWORD LENGTH
    // =============================================

    if (
      formData.password.length < 6
    ) {
      setMessage(
        "Password must contain at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await axios.post(
          "http://localhost:5000/api/auth/admin-signup",
          {
            name:
              formData.name.trim(),

            email:
              formData.email
                .trim()
                .toLowerCase(),

            password:
              formData.password,
          }
        );

      console.log(
        "ADMIN SIGNUP SUCCESS:",
        response.data
      );

      setMessage(
        "Admin account created successfully!"
      );

      setTimeout(() => {
        navigate("/admin/login");
      }, 1000);

    } catch (error) {
      console.error(
        "ADMIN SIGNUP ERROR:",
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
          "Unable to create admin account."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-container">

      {/* =================================================
          THEME TOGGLE
      ================================================= */}

      <div className="admin-theme-toggle">
        <ThemeToggle />
      </div>

      {/* =================================================
          SIGNUP BOX
      ================================================= */}

      <div className="admin-signup-box">

        <h2>
          Create Admin Account
        </h2>

        <p>
          Register a new administrator
        </p>

        {/* MESSAGE */}

        {message && (
          <div className="admin-signup-message">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* =================================================
              NAME
          ================================================= */}

          <div className="form-group">

            <label>
              Admin Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={
                formData.confirmPassword
              }
              onChange={
                handleChange
              }
              required
            />

          </div>

          {/* =================================================
              BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Admin Account"}
          </button>

        </form>

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <p>
          Already have an admin account?{" "}

          <Link to="/admin/login">
            Admin Login
          </Link>
        </p>

        {/* =================================================
            NORMAL USER LOGIN
        ================================================= */}

        <p>
          Are you a normal user?{" "}

          <Link to="/login">
            User Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default AdminSignup;