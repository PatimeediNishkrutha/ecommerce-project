import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./theme/ThemeToggle";
import "./Login.css";
import "./theme/theme.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // =====================================================
      // LOGIN REQUEST
      // =====================================================

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // =====================================================
      // GET USER DATA FROM SERVER
      // =====================================================

      const userData = response.data.user;

      console.log(
        "USER DATA FROM SERVER:",
        userData
      );

      // =====================================================
      // CHECK TOKEN
      // =====================================================

      if (!response.data.token) {
        throw new Error(
          "Token was not received from server"
        );
      }

      // =====================================================
      // CHECK USER DATA
      // =====================================================

      if (!userData) {
        throw new Error(
          "User data was not received from server"
        );
      }

      // =====================================================
      // SAVE NORMAL USER TOKEN
      // =====================================================

      localStorage.setItem(
        "userToken",
        response.data.token
      );

      // =====================================================
      // SAVE NORMAL USER DATA
      // =====================================================

      localStorage.setItem(
        "userData",
        JSON.stringify(userData)
      );

      // =====================================================
      // VERIFY DATA WAS SAVED
      // =====================================================

      console.log(
        "SAVED USER DATA:",
        localStorage.getItem("userData")
      );

      console.log(
        "SAVED USER TOKEN:",
        localStorage.getItem("userToken")
      );

      // =====================================================
      // GO TO HOME PAGE
      // =====================================================

      navigate("/");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =================================================
          THEME TOGGLE
      ================================================= */}

      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>


      <div className="login-box">

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Login to continue shopping
        </p>


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="login-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="login-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* =================================================
            SIGNUP LINK
        ================================================= */}

        <p className="signup-text">

          Don't have an account?{" "}

          <Link to="/signup">
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;