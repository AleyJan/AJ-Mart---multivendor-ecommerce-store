const mongoose = require("mongoose");

// Newsletter subscribers. Model name -> collection "subscribedemails".
const subscribedEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscribedEmail", subscribedEmailSchema);
