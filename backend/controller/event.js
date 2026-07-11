const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const Event = require("../model/event");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller } = require("../middleware/auth");

// -------------------- CREATE EVENT --------------------
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      const files = req.files || [];
      const imageUrls = files.map((file) => ({
        public_id: file.filename,
        url: `uploads/${file.filename}`,
      }));

      const eventData = { ...req.body };
      eventData.images = imageUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData);

      res.status(201).json({ success: true, event });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// -------------------- GET ALL EVENTS OF A SHOP --------------------
router.get(
  "/get-all-events-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    const events = await Event.find({ shopId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, events });
  })
);

// -------------------- DELETE A SHOP EVENT --------------------
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new ErrorHandler("Event not found with this id!", 404));
    }

    (event.images || []).forEach((img) => {
      const filepath = path.join(__dirname, "../uploads", img.public_id);
      fs.unlink(filepath, () => {});
    });

    await event.deleteOne();
    res.status(200).json({ success: true, message: "Event deleted successfully!" });
  })
);

// -------------------- GET ALL EVENTS --------------------
router.get(
  "/get-all-events",
  catchAsyncErrors(async (req, res, next) => {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  })
);

module.exports = router;
