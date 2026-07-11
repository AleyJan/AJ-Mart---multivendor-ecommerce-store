import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import { loadSeller } from "./redux/actions/seller.js";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import "./index.css";

// Load session + the whole catalogue (seller products/events) on app start
Store.dispatch(loadUser());
Store.dispatch(loadSeller());
Store.dispatch(getAllProducts());
Store.dispatch(getAllEvents());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);
