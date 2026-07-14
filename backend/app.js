const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const ErrorHandler = require("./middleware/error");

const primaryOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const extraOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([primaryOrigin, ...extraOrigins])];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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
const subscriber = require("./controller/subscriber");
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
app.use("/api/v2/subscriber", subscriber);

app.get("/", (req, res) => {
  res.send("Multi-vendor API is running");
});

// Error handling middleware (must be last)
app.use(ErrorHandler);

module.exports = app;
