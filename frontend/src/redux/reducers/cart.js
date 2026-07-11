import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const exists = state.cart.find((i) => i.id === item.id);
      if (exists) {
        // replace (qty was updated)
        state.cart = state.cart.map((i) => (i.id === exists.id ? item : i));
      } else {
        state.cart = [...state.cart, item];
      }
    })
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
    })
    .addCase("clearCart", (state) => {
      state.cart = [];
    });
});
