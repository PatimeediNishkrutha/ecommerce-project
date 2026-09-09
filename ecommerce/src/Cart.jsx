import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "./redux/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <h1>My Cart</h1>

      {cartItems.length === 0 ? (
        <h2>Your cart is empty 🛒</h2>
      ) : (
        <>
          <div className="cart-container">

            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={item._id || item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-details">

                  <h2>{item.name}</h2>

                  <p>
                    Price: ₹{item.price}
                  </p>

                  <div className="quantity">

                    <button
                      onClick={() =>
                        dispatch(
                          decreaseQuantity(item._id || item.id)
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          increaseQuantity(item._id || item.id)
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <p>
                    Item Total: ₹
                    {item.price * item.quantity}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch(
                        removeFromCart(item._id || item.id)
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="cart-total">

            <h2>
              Total: ₹{totalAmount}
            </h2>

            {/* Proceed to Billing */}
            <Link
              to="/billing"
              className="checkout-btn"
            >
              Proceed to Billing
            </Link>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;