const express = require("express");
const router = express.Router();

const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller, isAuthenticated } = require("../middleware/auth");

// -------------------- CREATE (or find) CONVERSATION --------------------
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      const isConversationExist = await Conversation.findOne({ groupTitle });
      if (isConversationExist) {
        return res
          .status(201)
          .json({ success: true, conversation: isConversationExist });
      }

      const conversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle,
      });

      res.status(201).json({ success: true, conversation });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// -------------------- SELLER'S CONVERSATIONS --------------------
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });
    res.status(201).json({ success: true, conversations });
  })
);

// -------------------- USER'S CONVERSATIONS --------------------
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    }).sort({ updatedAt: -1, createdAt: -1 });
    res.status(201).json({ success: true, conversations });
  })
);

// -------------------- UPDATE LAST MESSAGE --------------------
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    const { lastMessage, lastMessageId } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { lastMessage, lastMessageId },
      { new: true }
    );
    res.status(201).json({ success: true, conversation });
  })
);

module.exports = router;
