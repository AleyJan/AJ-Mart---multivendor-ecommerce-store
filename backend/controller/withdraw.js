const express = require("express");
const router = express.Router();

const Withdraw = require("../model/withdraw");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// -------------------- CREATE WITHDRAW REQUEST --------------------
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;

    const seller = await Shop.findById(req.seller._id);
    if (Number(amount) > (seller.availableBalance || 0)) {
      return next(new ErrorHandler("Insufficient balance to withdraw!", 400));
    }

    const withdraw = await Withdraw.create({
      seller: {
        _id: seller._id.toString(),
        name: seller.name,
        email: seller.email,
      },
      amount,
    });

    seller.availableBalance = seller.availableBalance - Number(amount);
    await seller.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, withdraw });
  })
);

// -------------------- SELLER'S WITHDRAW REQUESTS --------------------
router.get(
  "/get-all-withdraw-request-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const withdraws = await Withdraw.find({
      "seller._id": req.params.id,
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, withdraws });
  })
);

// -------------------- ADMIN: ALL WITHDRAW REQUESTS --------------------
router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, withdraws });
  })
);

// -------------------- ADMIN: APPROVE A WITHDRAW REQUEST --------------------
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const { sellerId } = req.body;

    const withdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      { status: "succeed", updatedAt: Date.now() },
      { new: true }
    );

    const seller = await Shop.findById(sellerId);
    if (seller) {
      const transaction = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };
      seller.transactions = [...(seller.transactions || []), transaction];
      await seller.save();
    }

    res.status(201).json({ success: true, withdraw });
  })
);

module.exports = router;
