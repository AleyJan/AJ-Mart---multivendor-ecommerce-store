const express = require("express");
const router = express.Router();

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// -------------------- CREATE A STRIPE PAYMENT INTENT --------------------
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: Math.round(req.body.amount),
      currency: "usd",
      metadata: { company: "AJ MART" },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

// -------------------- GIVE THE FRONTEND THE STRIPE PUBLISHABLE KEY --------------------
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
