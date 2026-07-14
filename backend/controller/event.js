const express = require("express");
const router = express.Router();

const Event = require("../model/event");
const Shop = require("../model/shop");
const SubscribedEmail = require("../model/subscriber");
const { upload } = require("../multer");
const { uploadBuffer, destroy } = require("../utils/cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isSeller } = require("../middleware/auth");

// Best-effort: email every newsletter subscriber about a new event.
const notifySubscribers = async (event, shop) => {
  const subscribers = await SubscribedEmail.find().select("email");
  if (!subscribers.length) return;

  const base = process.env.FRONTEND_URL || "";
  const eventsUrl = `${base}/events`;

  await Promise.allSettled(
    subscribers.map((s) => {
      const unsubUrl = `${base}/unsubscribe?email=${encodeURIComponent(
        s.email
      )}`;
      const html = `
        <h2>New event from ${shop.name}!</h2>
        <p><b>${event.name}</b> is now live${
        event.discountPrice ? ` for just $${event.discountPrice}` : ""
      }.</p>
        <p>${event.description || ""}</p>
        <a href="${eventsUrl}" style="display:inline-block;padding:10px 20px;background:#3321c8;color:#fff;text-decoration:none;border-radius:5px;">View Event</a>
        <p style="font-size:12px;color:#888;margin-top:24px;">
          You received this because you subscribed to AJ MART.
          <a href="${unsubUrl}">Unsubscribe</a>
        </p>
      `;
      return sendMail({
        email: s.email,
        subject: `New event from ${shop.name}: ${event.name}`,
        message: `${shop.name} just launched a new event "${event.name}". See it here: ${eventsUrl}\n\nUnsubscribe: ${unsubUrl}`,
        html,
      });
    })
  );
};

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
      const imageUrls = await Promise.all(
        files.map((file) => uploadBuffer(file.buffer, "events"))
      );

      const eventData = { ...req.body };
      eventData.images = imageUrls;
      eventData.shop = shop;

      const event = await Event.create(eventData);

      // notify newsletter subscribers (don't fail the request if mail breaks)
      try {
        await notifySubscribers(event, shop);
      } catch (e) {
        console.log("Subscriber notification failed:", e.message);
      }

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

    await Promise.all(
      (event.images || []).map((img) =>
        img.public_id ? destroy(img.public_id).catch(() => {}) : null
      )
    );

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
