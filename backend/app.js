const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const ErrorHandler = require("./middleware/error");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const order = require("./controller/order");
const coupon = require("./controller/coupounCode");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const payment = require("./controller/payment");
const withdraw = require("./controller/withdraw");
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/order", order);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

app.get("/", (req, res) => {
  res.send("Multi-vendor API is running");
});

// Error handling middleware (must be last)
app.use(ErrorHandler);

module.exports = app;
