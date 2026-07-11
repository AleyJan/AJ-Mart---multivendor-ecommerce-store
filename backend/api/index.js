// Vercel serverless entry point — exports the Express app instead of calling listen()
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

const app = require("../app");
const connectDatabase = require("../db/Database");
const User = require("../model/user");

let seeded = false;

const seedAdmin = async () => {
  if (seeded) return;
  seeded = true;
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
  } catch (_) {
    seeded = false;
  }
};

module.exports = async (req, res) => {
  try {
    await connectDatabase();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    return res
      .status(503)
      .json({ success: false, message: "Database unavailable" });
  }
  seedAdmin();
  return app(req, res);
};
