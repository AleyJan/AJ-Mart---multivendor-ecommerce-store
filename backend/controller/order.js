const express = require("express");
const router = express.Router();

const Order = require("../model/order");
const Product = require("../model/product");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// -------------------- CREATE ORDER (one order per shop) --------------------
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, paymentInfo } = req.body;

      // Group cart items by their shopId. Demo items with no shopId are skipped
      // (they don't belong to a real seller).
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopId) continue;
        if (!shopItemsMap.has(shopId)) shopItemsMap.set(shopId, []);
        shopItemsMap.get(shopId).push(item);
      }

      const orders = [];
      for (const [, items] of shopItemsMap) {
        const totalPrice = items.reduce(
          (acc, i) => acc + i.discountPrice * i.qty,
          0
        );
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });

        // reduce stock / bump sold_out for each ordered product
        for (const i of items) {
          const product = await Product.findById(i.id || i._id);
          if (product) {
            product.stock = Math.max(0, product.stock - i.qty);
            product.sold_out = (product.sold_out || 0) + i.qty;
            await product.save({ validateBeforeSave: false });
          }
        }

        orders.push(order);
      }

      res.status(201).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- GET A USER'S ORDERS --------------------
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ "user._id": req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  })
);

// -------------------- GET A SELLER'S ORDERS --------------------
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({
      "cart.shopId": req.params.shopId,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  })
);

// -------------------- UPDATE ORDER STATUS (seller) --------------------
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }

    order.status = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
      if (order.paymentInfo) order.paymentInfo.status = "Succeeded";

      // credit the seller's balance (order total minus a 10% service charge)
      const shopId = order.cart[0]?.shopId;
      const shop = await Shop.findById(shopId);
      if (shop) {
        shop.availableBalance = (shop.availableBalance || 0) + order.totalPrice * 0.9;
        await shop.save({ validateBeforeSave: false });
      }
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, order });
  })
);

// -------------------- BUYER REQUESTS A REFUND --------------------
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    order.status = req.body.status; // "Processing refund"
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      order,
      message: "Order refund request sent successfully!",
    });
  })
);

// -------------------- SELLER APPROVES A REFUND --------------------
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("Order not found with this id", 400));
    }
    order.status = req.body.status; // "Refund Success"
    await order.save();

    // if it was already delivered, restore the stock
    if (req.body.status === "Refund Success") {
      for (const item of order.cart) {
        const product = await Product.findById(item.id || item._id);
        if (product) {
          product.stock += item.qty;
          product.sold_out = Math.max(0, (product.sold_out || 0) - item.qty);
          await product.save({ validateBeforeSave: false });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order refund approved successfully!",
    });
  })
);

// -------------------- ADMIN: ALL ORDERS --------------------
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find().sort({ deliveredAt: -1, createdAt: -1 });
    res.status(201).json({ success: true, orders });
  })
);

module.exports = router;
