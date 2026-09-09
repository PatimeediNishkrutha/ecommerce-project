import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-container">

        {/* BRAND */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <span>🛍️</span>
            ShopEase
          </Link>

          <p>
            Your simple and trusted destination
            for quality products and easy shopping.
          </p>

        </div>


        {/* QUICK LINKS */}

        <div className="footer-section">

          <h3>
            Quick Links
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/billing">
            Checkout
          </Link>

        </div>


        {/* CUSTOMER */}

        <div className="footer-section">

          <h3>
            Customer
          </h3>

          <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Create Account
          </Link>

          <a href="mailto:support@shopease.com">
            Contact Support
          </a>

        </div>


        {/* CONTACT */}

        <div className="footer-section">

          <h3>
            Contact Us
          </h3>

          <p>
            📧 support@shopease.com
          </p>

          <p>
            📞 +91 98765 43210
          </p>

          <p>
            📍 India
          </p>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} ShopEase.
          All rights reserved.
        </p>

        <div className="footer-socials">
          <span>Instagram</span>
          <span>Facebook</span>
          <span>Twitter</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;