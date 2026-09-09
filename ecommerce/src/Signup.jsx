import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setUser((previousUser) => ({
      ...previousUser,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // =============================================
    // CHECK ALL FIELDS
    // =============================================

    if (
      !user.name.trim() ||
      !user.email.trim() ||
      !user.phone.trim() ||
      !user.password ||
      !user.confirmPassword
    ) {
      alert(
        "Please fill all the fields"
      );
      return;
    }

    // =============================================
    // PASSWORD MATCH
    // =============================================

    if (
      user.password !==
      user.confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    // =============================================
    // PASSWORD LENGTH
    // =============================================

    if (
      user.password.length < 6
    ) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    // =============================================
    // PHONE VALIDATION
    // =============================================

    if (
      !/^[0-9]{10}$/.test(
        user.phone.trim()
      )
    ) {
      alert(
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================="
      );

      console.log(
        "NORMAL USER REGISTER REQUEST"
      );

      console.log(
        "Name:",
        user.name
      );

      console.log(
        "Email:",
        user.email
      );

      console.log(
        "Phone:",
        user.phone
      );

      // =========================================
      // API REQUEST
      // =========================================

      const response =
        await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                user.name.trim(),

              email:
                user.email
                  .trim()
                  .toLowerCase(),

              phone:
                user.phone.trim(),

              password:
                user.password,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "REGISTER RESPONSE:",
        data
      );

      // =========================================
      // ERROR
      // =========================================

      if (!response.ok) {
        alert(
          data.message ||
            "Registration failed"
        );

        return;
      }

      // =========================================
      // SUCCESS
      // =========================================

      alert(
        "Account created successfully!"
      );

      // =========================================
      // GO TO LOGIN
      // =========================================

      navigate("/login");

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        {/* LOGO */}

        <div className="signup-logo">
          🛍️
        </div>

        {/* TITLE */}

        <h1>
          Create Account
        </h1>

        <p className="signup-subtitle">
          Join us and start shopping
        </p>

        {/* FORM */}

        <form
          className="signup-form"
          onSubmit={handleSignup}
        >

          {/* NAME */}

          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={user.name}
            onChange={handleChange}
            autoComplete="name"
          />

          {/* EMAIL */}

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            autoComplete="email"
          />

          {/* PHONE */}

          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter 10-digit phone number"
            value={user.phone}
            onChange={handleChange}
            maxLength="10"
            autoComplete="tel"
          />

          {/* PASSWORD */}

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={user.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {/* CONFIRM PASSWORD */}

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={
              user.confirmPassword
            }
            onChange={handleChange}
            autoComplete="new-password"
          />

          {/* BUTTON */}

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN */}

        <p className="signup-login">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

        {/* HOME */}

        <Link
          to="/"
          className="signup-back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Signup;