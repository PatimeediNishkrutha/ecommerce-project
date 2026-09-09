import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "./redux/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "./redux/wishlistSlice";

import "./ProductCard.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  // =====================================================
  // CART ITEMS
  // =====================================================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // =====================================================
  // WISHLIST ITEMS
  // =====================================================

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  // =====================================================
  // PRODUCT ID
  // =====================================================

  const productId = product._id || product.id;

  // =====================================================
  // CHECK CART
  // =====================================================

  const cartItem = cartItems.find(
    (item) =>
      (item._id || item.id) === productId
  );

  const quantity = cartItem?.quantity || 0;

  // =====================================================
  // CHECK WISHLIST
  // =====================================================

  const isWishlisted = wishlistItems.some(
    (item) =>
      (item._id || item.id) === productId
  );

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
      })
    );
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const handleIncrease = () => {
    dispatch(
      increaseQuantity(productId)
    );
  };

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const handleDecrease = () => {
    dispatch(
      decreaseQuantity(productId)
    );
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(
        removeFromWishlist(productId)
      );
    } else {
      dispatch(
        addToWishlist(product)
      );
    }
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const image =
    product.image ||
    product.imageUrl ||
    "https://via.placeholder.com/400x300?text=Product";

  // =====================================================
  // PRICE
  // =====================================================

  const price = Number(product.price || 0);

  // =====================================================
  // DESCRIPTION
  // =====================================================

  const description =
    product.description ||
    "Quality product at an amazing price.";

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="product-card">

      {/* ==========================================
          IMAGE
      ========================================== */}

      <div className="product-image-container">

        <img
          src={image}
          alt={product.name}
          className="product-image"
        />

        {/* ========================================
            WISHLIST HEART
        ======================================== */}

        <button
          type="button"
          className={`wishlist-heart ${
            isWishlisted ? "active" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

      </div>


      {/* ==========================================
          PRODUCT DETAILS
      ========================================== */}

      <div className="product-details">

        {/* PRODUCT NAME */}

        <h3>
          {product.name}
        </h3>


        {/* DESCRIPTION */}

        <p className="product-description">
          {description}
        </p>


        {/* ========================================
            BOTTOM
        ======================================== */}

        <div className="product-bottom">

          {/* PRICE */}

          <span className="product-price">
            ₹{price.toLocaleString("en-IN")}
          </span>


          {/* ======================================
              ADD TO CART
          ====================================== */}

          {quantity === 0 ? (

            <button
              type="button"
              className="add-cart-button"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

          ) : (

            /* ====================================
               QUANTITY CONTROL
            ==================================== */

            <div className="cart-quantity-control">

              <button
                type="button"
                className="quantity-button"
                onClick={handleDecrease}
              >
                −
              </button>

              <span className="quantity-number">
                {quantity}
              </span>

              <button
                type="button"
                className="quantity-button"
                onClick={handleIncrease}
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

export default ProductCard;