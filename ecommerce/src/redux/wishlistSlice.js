import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {

    // ==========================================
    // ADD TO WISHLIST
    // ==========================================

    addToWishlist: (state, action) => {

      const product = action.payload;

      const productId =
        product.id || product._id;

      const exists = state.items.some(
        (item) =>
          String(item.id) === String(productId)
      );

      // Don't add same product twice
      if (!exists) {

        state.items.push({
          ...product,
          id: productId,
        });

      }
    },

    // ==========================================
    // REMOVE
    // ==========================================

    removeFromWishlist: (state, action) => {

      state.items = state.items.filter(
        (item) =>
          String(item.id) !== String(action.payload)
      );

    },

    // ==========================================
    // CLEAR
    // ==========================================

    clearWishlist: (state) => {
      state.items = [];
    },

  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;