import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { cartReducer } from "./reducers/cart";
import { wishlistReducer } from "./reducers/wishlist";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { orderReducer } from "./reducers/order";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    events: eventReducer,
    order: orderReducer,
  },
});

export default Store;
