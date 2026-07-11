const express = require("express");
const router = express.Router();

const Messages = require("../model/messages");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// -------------------- CREATE MESSAGE --------------------
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = {
        conversationId: req.body.conversationId,
        text: req.body.text,
        sender: req.body.sender,
      };

      if (req.file) {
        messageData.images = {
          public_id: req.file.filename,
          url: `uploads/${req.file.filename}`,
        };
      }

      const message = new Messages(messageData);
      await message.save();

      res.status(201).json({ success: true, message });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- GET ALL MESSAGES OF A CONVERSATION --------------------
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });
    res.status(201).json({ success: true, messages });
  })
);

module.exports = router;
