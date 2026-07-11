const express = require("express");
const router = express.Router();

const Product = require("../model/product");
const Shop = require("../model/shop");
const Order = require("../model/order");
const { upload } = require("../multer");
const { uploadBuffer, destroy } = require("../utils/cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// -------------------- CREATE PRODUCT --------------------
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      const files = req.files || [];
      const imageUrls = await Promise.all(
        files.map((file) => uploadBuffer(file.buffer, "products"))
      );

      const productData = { ...req.body };
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({ success: true, product });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- GET ALL PRODUCTS OF A SHOP --------------------
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, products });
  })
);

// -------------------- DELETE A SHOP PRODUCT --------------------
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found with this id!", 404));
    }

    await Promise.all(
      (product.images || []).map((img) =>
        img.public_id ? destroy(img.public_id).catch(() => {}) : null
      )
    );

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully!" });
  })
);

// -------------------- GET ALL PRODUCTS --------------------
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  })
);

// -------------------- CREATE / UPDATE A REVIEW --------------------
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    const review = { user, rating, comment, productId };

    const alreadyReviewed = product.reviews.find(
      (r) => String(r.user?._id) === String(req.user._id)
    );

    if (alreadyReviewed) {
      product.reviews.forEach((r) => {
        if (String(r.user?._id) === String(req.user._id)) {
          r.rating = rating;
          r.comment = comment;
          r.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    // recompute the average rating
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    // mark this item as reviewed in the order
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.cart = order.cart.map((item) =>
          String(item.id) === String(productId)
            ? { ...item, isReviewed: true }
            : item
        );
        order.markModified("cart");
        await order.save();
      }
    }

    res.status(200).json({ success: true, message: "Reviewed successfully!" });
  })
);

// -------------------- ADMIN: ALL PRODUCTS --------------------
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, products });
  })
);

module.exports = router;
