const express = require("express");
const router = express.Router();

const SubscribedEmail = require("../model/subscriber");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// -------------------- SUBSCRIBE TO NEWSLETTER --------------------
router.post(
  "/subscribe",
  catchAsyncErrors(async (req, res, next) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      return next(new ErrorHandler("Please provide a valid email", 400));
    }

    const existing = await SubscribedEmail.findOne({ email });
    if (existing) {
      return res
        .status(200)
        .json({ success: true, message: "You are already subscribed!" });
    }

    await SubscribedEmail.create({ email });
    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  })
);

// -------------------- UNSUBSCRIBE (public, via email link) --------------------
router.put(
  "/unsubscribe",
  catchAsyncErrors(async (req, res, next) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      return next(new ErrorHandler("Please provide an email", 400));
    }
    // idempotent: succeeds whether or not the email was subscribed
    await SubscribedEmail.deleteOne({ email });
    res
      .status(200)
      .json({ success: true, message: "You have been unsubscribed." });
  })
);

// -------------------- ADMIN: LIST ALL SUBSCRIBERS --------------------
router.get(
  "/admin-subscribers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const subscribers = await SubscribedEmail.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscribers });
  })
);

// -------------------- ADMIN: DELETE A SUBSCRIBER --------------------
router.delete(
  "/admin-delete/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const removed = await SubscribedEmail.findByIdAndDelete(req.params.id);
    if (!removed) {
      return next(new ErrorHandler("Subscriber not found", 404));
    }
    res.status(200).json({ success: true, message: "Subscriber removed" });
  })
);

module.exports = router;
