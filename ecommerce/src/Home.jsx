import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { Link } from "react-router-dom";

import axios from "axios";

import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

import Navbar from "./Navbar.jsx";

import {
  addToWishlist,
  removeFromWishlist,
} from "./redux/wishlistSlice";

import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "./redux/cartSlice";

import "./Home.css";

function Home() {
  const dispatch = useDispatch();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // WISHLIST
  // ======================================================

  const wishlistItems =
    useSelector(
      (state) =>
        state.wishlist?.items || []
    );

  // ======================================================
  // CART
  // ======================================================

  const cartItems =
    useSelector(
      (state) =>
        state.cart?.items || []
    );

  // ======================================================
  // GET ALL PRODUCTS
  // ======================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "FETCHING PRODUCTS..."
      );

      const response =
        await axios.get(
          "http://localhost:5000/api/products",
          {
            params: {
              // Prevent cached response
              t: Date.now(),
            },
          }
        );

      console.log(
        "PRODUCTS RECEIVED FROM SERVER:",
        response.data
      );

      // ==========================================
      // MAKE SURE RESPONSE IS ARRAY
      // ==========================================

      if (
        !Array.isArray(
          response.data
        )
      ) {
        console.error(
          "PRODUCT RESPONSE IS NOT AN ARRAY:",
          response.data
        );

        setProducts([]);

        setError(
          "Invalid product data received from server."
        );

        return;
      }

      setProducts(
        response.data
      );

    } catch (err) {
      console.error(
        "PRODUCT FETCH ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setError(
        "Unable to load products."
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FETCH PRODUCTS WHEN HOME LOADS
  // ======================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // ======================================================
  // WISHLIST CHECK
  // ======================================================

  const isWishlisted = (
    productId
  ) => {
    return wishlistItems.some(
      (item) =>
        String(item.id) ===
        String(productId)
    );
  };

  // ======================================================
  // TOGGLE WISHLIST
  // ======================================================

  const handleWishlist = (
    product
  ) => {
    const productId =
      product._id ||
      product.id;

    if (
      isWishlisted(productId)
    ) {
      dispatch(
        removeFromWishlist(
          productId
        )
      );
    } else {
      dispatch(
        addToWishlist({
          ...product,
          id: productId,
        })
      );
    }
  };

  // ======================================================
  // GET CART QUANTITY
  // ======================================================

  const getCartQuantity = (
    productId
  ) => {
    const item =
      cartItems.find(
        (cartItem) =>
          String(
            cartItem.id
          ) ===
          String(productId)
      );

    return item
      ? item.quantity
      : 0;
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = (
    product
  ) => {
    const stock =
      Number(
        product.stock || 0
      );

    if (stock <= 0) {
      alert(
        `${product.name} is currently out of stock.`
      );

      return;
    }

    const productId =
      product._id ||
      product.id;

    const currentQuantity =
      getCartQuantity(
        productId
      );

    if (
      currentQuantity >= stock
    ) {
      alert(
        `Only ${stock} ${product.name} available in stock.`
      );

      return;
    }

    dispatch(
      addToCart({
        ...product,
        id: productId,
      })
    );
  };

  // ======================================================
  // INCREASE CART QUANTITY
  // ======================================================

  const handleIncreaseQuantity = (
    product
  ) => {
    const productId =
      product._id ||
      product.id;

    const currentQuantity =
      getCartQuantity(
        productId
      );

    const stock =
      Number(
        product.stock || 0
      );

    if (
      currentQuantity >= stock
    ) {
      alert(
        `Only ${stock} ${product.name} available in stock.`
      );

      return;
    }

    dispatch(
      increaseQuantity(
        productId
      )
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <>
        <Navbar
          wishlistCount={
            wishlistItems.length
          }
        />

        <div className="products-loading">

          <div className="loading-spinner"></div>

          <h2>
            Loading Products...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

        <Footer />
      </>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <>
        <Navbar
          wishlistCount={
            wishlistItems.length
          }
        />

        <div className="products-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            className="retry-button"
            onClick={
              fetchProducts
            }
          >
            Try Again
          </button>

        </div>

        <Footer />
      </>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <div className="home">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar
        wishlistCount={
          wishlistItems.length
        }
      />

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-small-title">

            <LocalMallOutlinedIcon />

            OUR ONLINE STORE

          </div>

          <h1>

            Find Something

            <span>
              You'll Love
            </span>

          </h1>

          <p>
            Discover quality products
            at amazing prices and enjoy
            a simple shopping experience.
          </p>

          <Link
            to="#products"
            className="hero-shop-button"
          >

            Shop Now

            <span>
              →
            </span>

          </Link>

        </div>

        <div className="hero-decoration">

          <LocalMallOutlinedIcon />

        </div>

      </section>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <section
        className="products-section"
        id="products"
      >

        <div className="products-heading">

          <div>

            <span className="section-label">
              OUR COLLECTION
            </span>

            <h2>
              Featured Products
            </h2>

            <p>
              Explore our latest products
            </p>

          </div>

          <span className="product-count">

            {products.length} Products

          </span>

        </div>

        {/* ==================================================
            NO PRODUCTS
        ================================================== */}

        {products.length === 0 ? (

          <div className="no-products">

            <div className="no-products-icon">
              📦
            </div>

            <h2>
              No Products Available
            </h2>

            <p>
              Products will appear here
              once they are added.
            </p>

          </div>

        ) : (

          <div className="product-container">

            {products.map(
              (product) => {

                const productId =
                  product._id ||
                  product.id;

                const quantity =
                  getCartQuantity(
                    productId
                  );

                const wishlisted =
                  isWishlisted(
                    productId
                  );

                const stock =
                  Number(
                    product.stock || 0
                  );

                const isOutOfStock =
                  stock <= 0;

                return (
                  <div
                    className="product-card"
                    key={productId}
                  >

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div className="product-image-container">

                      {product.image ? (

                        <img
                          className="product-image"
                          src={product.image}
                          alt={
                            product.name
                          }
                        />

                      ) : (

                        <div className="product-image-placeholder">
                          📦
                        </div>

                      )}

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className={`wishlist-heart ${
                          wishlisted
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleWishlist(
                            product
                          )
                        }
                        aria-label="Wishlist"
                      >

                        {wishlisted
                          ? "♥"
                          : "♡"}

                      </button>

                      {/* OUT OF STOCK */}

                      {isOutOfStock && (

                        <div className="out-of-stock-overlay">

                          OUT OF STOCK

                        </div>

                      )}

                    </div>

                    {/* ==================================================
                        DETAILS
                    ================================================== */}

                    <div className="product-details">

                      <h3>
                        {product.name}
                      </h3>

                      <p className="product-description">

                        {product.description ||
                          "Latest quality product"}

                      </p>

                      {/* LOW STOCK */}

                      {!isOutOfStock &&
                        stock <= 5 && (

                          <p className="low-stock-text">

                            Only {stock} left
                            in stock

                          </p>

                        )}

                      {/* ==================================================
                          BOTTOM
                      ================================================== */}

                      <div className="product-bottom">

                        <span className="product-price">

                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </span>

                        {/* OUT OF STOCK */}

                        {isOutOfStock ? (

                          <span className="out-of-stock-label">

                            OUT OF STOCK

                          </span>

                        ) : quantity === 0 ? (

                          /* ADD TO CART */

                          <button
                            type="button"
                            className="add-cart-button"
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                          >

                            🛒 Add to Cart

                          </button>

                        ) : (

                          /* QUANTITY CONTROL */

                          <div className="cart-quantity-control">

                            <button
                              type="button"
                              className="quantity-button"
                              onClick={() =>
                                dispatch(
                                  decreaseQuantity(
                                    productId
                                  )
                                )
                              }
                            >
                              −
                            </button>

                            <span className="quantity-number">

                              {quantity}

                            </span>

                            <button
                              type="button"
                              className="quantity-button"
                              disabled={
                                quantity >=
                                stock
                              }
                              onClick={() =>
                                handleIncreaseQuantity(
                                  product
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* FOOTER */}

      <Footer />

    </div>
  );
}

// =====================================================
// FOOTER
// =====================================================

function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-content">

        <div>

          <h2>
            🛍️ ShopEase
          </h2>

          <p>
            Your simple and trusted
            online shopping destination.
          </p>

        </div>

        <div className="footer-links">

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

      </div>

      <div className="footer-bottom">

        © 2026 ShopEase.
        All rights reserved.

      </div>

    </footer>
  );
}

export default Home;