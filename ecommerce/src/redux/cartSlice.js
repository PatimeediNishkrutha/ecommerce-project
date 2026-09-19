import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {

    // ==========================================
    // ADD TO CART
    // ==========================================

    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.id === product.id ||
          item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          id: product.id || product._id,
          quantity: 1,
        });
      }
    },

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload ||
          item._id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload ||
          item._id === action.payload
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (cartItem) =>
              cartItem.id !== action.payload &&
              cartItem._id !== action.payload
          );
        }
      }
    },

    // ==========================================
    // REMOVE COMPLETELY
    // ==========================================

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          item.id !== action.payload &&
          item._id !== action.payload
      );
    },

    // ==========================================
    // CLEAR CART
    // ==========================================

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;