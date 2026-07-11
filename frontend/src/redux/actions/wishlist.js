// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({ type: "addToWishlist", payload: data });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch({ type: "removeFromWishlist", payload: data.id });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};

// clear the whole wishlist (e.g. on logout)
export const clearWishlist = () => async (dispatch) => {
  dispatch({ type: "clearWishlist" });
  localStorage.removeItem("wishlistItems");
};
