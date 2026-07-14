import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    // create
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // update
    .addCase("updateProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("updateProductSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase("updateProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    // get all products of a shop
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllProductsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // get ALL products (whole catalogue, all shops)
    .addCase("getAllProductsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
    })
    .addCase("getAllProductsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // delete
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    })
    .addCase("deleteProductFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessages", (state) => {
      state.success = false;
      state.message = null;
    });
});
