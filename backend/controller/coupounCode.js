const express = require("express");
const router = express.Router();

const CouponCode = require("../model/couponCode");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller } = require("../middleware/auth");

// -------------------- CREATE COUPON --------------------
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const exists = await CouponCode.find({ name: req.body.name });
      if (exists.length !== 0) {
        return next(new ErrorHandler("Coupon code already exists!", 400));
      }
      const couponCode = await CouponCode.create(req.body);
      res.status(201).json({ success: true, couponCode });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- GET A SHOP'S COUPONS --------------------
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const couponCodes = await CouponCode.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, couponCodes });
  })
);

// -------------------- DELETE A COUPON --------------------
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const couponCode = await CouponCode.findByIdAndDelete(req.params.id);
    if (!couponCode) {
      return next(new ErrorHandler("Coupon code doesn't exist!", 400));
    }
    res.status(200).json({ success: true, message: "Coupon code deleted!" });
  })
);

// -------------------- GET A COUPON BY NAME (public, for checkout) --------------------
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    const couponCode = await CouponCode.findOne({ name: req.params.name });
    res.status(200).json({ success: true, couponCode });
  })
);

module.exports = router;
