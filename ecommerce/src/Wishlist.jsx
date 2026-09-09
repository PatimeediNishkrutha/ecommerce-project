import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  removeFromWishlist,
} from "./redux/wishlistSlice";

import {
  addToCart,
} from "./redux/cartSlice";

import "./wishlist.css";

function Wishlist() {

  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  return (
    <div className="wishlist-page">

      {/* ================= NAVBAR ================= */}

      <nav className="wishlist-navbar">

        <Link
          to="/"
          className="wishlist-logo"
        >
          🛍️ ShopEase
        </Link>

        <div className="wishlist-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link
            to="/wishlist"
            className="wishlist-active"
          >
            Wishlist
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link
            to="/signup"
            className="wishlist-signup"
          >
            Signup
          </Link>

        </div>

      </nav>


      {/* ================= CONTENT ================= */}

      <main className="wishlist-main">

        <div className="wishlist-title">

          <div>

            <span>
              MY COLLECTION
            </span>

            <h1>
              My Wishlist ❤️
            </h1>

            <p>
              Products you love and want to save.
            </p>

          </div>

          <Link
            to="/"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>


        {/* ================= EMPTY ================= */}

        {wishlistItems.length === 0 ? (

          <div className="empty-wishlist">

            <div className="empty-heart">
              ♡
            </div>

            <h2>
              Your Wishlist is Empty
            </h2>

            <p>
              Add your favorite products to
              your wishlist.
            </p>

            <Link
              to="/"
              className="shop-btn"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="wishlist-grid">

            {wishlistItems.map((item) => (

              <div
                className="wishlist-card"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="wishlist-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>


                {/* DETAILS */}

                <div className="wishlist-details">

                  <h2>
                    {item.name}
                  </h2>

                  <p className="wishlist-price">
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString()}
                  </p>


                  {/* CART */}

                  <button
                    type="button"
                    className="wishlist-cart-btn"
                    onClick={() =>
                      dispatch(
                        addToCart({
                          ...item,
                          id:
                            item.id ||
                            item._id,
                        })
                      )
                    }
                  >
                    🛒 Add to Cart
                  </button>


                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-wishlist-btn"
                    onClick={() =>
                      dispatch(
                        removeFromWishlist(
                          item.id
                        )
                      )
                    }
                  >
                    ♡ Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="wishlist-footer">

        <div>

          <h2>
            🛍️ ShopEase
          </h2>

          <p>
            Your simple and trusted online
            shopping destination.
          </p>

        </div>

        <div className="wishlist-footer-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Signup
          </Link>

        </div>

        <div className="wishlist-footer-bottom">
          © 2026 ShopEase. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Wishlist;