import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";
import ThemeToggle from "./theme/ThemeToggle";
// import "./theme.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem("userData");

      console.log(
        "NAVBAR USER DATA:",
        storedUser
      );

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser);

          console.log(
            "NAVBAR PARSED USER:",
            parsedUser
          );

          setUser(parsedUser);
        } catch (error) {
          console.error(
            "NAVBAR USER PARSE ERROR:",
            error
          );

          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes
    window.addEventListener(
      "storage",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser
      );
    };
  }, [location.pathname]);

  // =====================================================
  // CART
  // =====================================================

  const cartItems = useSelector(
    (state) =>
      state.cart?.items || []
  );

  // =====================================================
  // WISHLIST
  // =====================================================

  const wishlistItems = useSelector(
    (state) =>
      state.wishlist?.items || []
  );

  // =====================================================
  // COUNTS
  // =====================================================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + (item.quantity || 1),
      0
    );

  const wishlistCount =
    wishlistItems.length;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "userToken"
    );

    localStorage.removeItem(
      "userData"
    );

    setUser(null);

    navigate("/login");
  };

  return (
    <header className="main-header">

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <span className="logo-icon">
            🛍️
          </span>

          <span>
            ShopEase
          </span>
        </Link>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav
          className={`navbar-menu ${
            menuOpen
              ? "navbar-menu-open"
              : ""
          }`}
        >

          {/* HOME */}

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Home
          </Link>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="nav-icon-link"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <span>♡</span>

            Wishlist

            {wishlistCount > 0 && (
              <span className="nav-badge">
                {wishlistCount}
              </span>
            )}
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="nav-icon-link"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <span>🛒</span>

            Cart

            {cartCount > 0 && (
              <span className="nav-badge">
                {cartCount}
              </span>
            )}
          </Link>


          {/* CHECKOUT */}

          <Link
            to="/billing"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            Checkout
          </Link>


          {/* =================================================
              LOGGED IN USER
          ================================================= */}

          {user ? (
            <>
              <Link
                to="/profile"
                className="navbar-profile"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                👤{" "}
                {user.name ||
                  user.email}
              </Link>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (

            /* =================================================
               NOT LOGGED IN
            ================================================= */

            <>
              <Link
                to="/login"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Signup
              </Link>
            </>
          )}

        </nav>


        {/* =================================================
            MOBILE BUTTON
        ================================================= */}

        <button
          className="navbar-toggle"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >
          {menuOpen
            ? "✕"
            : "☰"}
        </button>
        <ThemeToggle />

      </div>

    </header>
  );
}

export default Navbar;