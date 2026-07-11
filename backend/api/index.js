// Vercel serverless entry point — exports the Express app instead of calling listen()
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

const app = require("../app");
const connectDatabase = require("../db/Database");
const User = require("../model/user");

// Runs once per cold start; Vercel reuses warm instances so this won't
// reconnect or re-seed on every request.
connectDatabase().then(async () => {
  try {
    if (!process.env.ADMIN_EMAIL) return;
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing) {
      await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "Admin",
        avatar: {
          public_id: "admin_avatar",
          url: "https://i.ibb.co/4pDNDk1/avatar.png",
        },
      });
    }
  } catch (_) {}
});

module.exports = app;
