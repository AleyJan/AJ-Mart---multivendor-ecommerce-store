const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    groupTitle: { type: String }, // unique key: sellerId + userId
    members: { type: Array }, // [userId, sellerId]
    lastMessage: { type: String },
    lastMessageId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
