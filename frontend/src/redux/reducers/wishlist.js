import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const exists = state.wishlist.find((i) => i.id === item.id);
      if (exists) {
        state.wishlist = state.wishlist.map((i) =>
          i.id === exists.id ? item : i
        );
      } else {
        state.wishlist = [...state.wishlist, item];
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i.id !== action.payload);
    })
    .addCase("clearWishlist", (state) => {
      state.wishlist = [];
    });
});
