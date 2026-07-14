const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();

const Shop = require("../model/shop");
const { upload } = require("../multer");
const { uploadBuffer, destroy } = require("../utils/cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");

// Short-lived activation token holding the pending shop payload
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// -------------------- CREATE SHOP --------------------
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return next(new ErrorHandler("Please upload a shop avatar", 400));
    }

    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new ErrorHandler("Shop already exists with this email", 400));
    }

    const avatar = await uploadBuffer(req.file.buffer, "shop-avatars");

    const seller = {
      name: req.body.name,
      email,
      password: req.body.password,
      avatar,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);
    const activationUrl = `${process.env.FRONTEND_URL}/shop/activation/${activationToken}`;

    await sendMail({
      email: seller.email,
      subject: "Activate your Shop",
      message: `Hello ${seller.name}, please click the link to activate your shop: ${activationUrl}`,
      html: `
        <h2>Hello ${seller.name},</h2>
        <p>Thanks for registering your shop. Click the button below to activate it.</p>
        <a href="${activationUrl}" style="display:inline-block;padding:10px 20px;background:#3321c8;color:#fff;text-decoration:none;border-radius:5px;">Activate Shop</a>
        <p>This link expires in 5 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${seller.email}) to activate your shop!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// -------------------- ACTIVATE SHOP --------------------
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;

    const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (!newSeller) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar, zipCode, address, phoneNumber } =
      newSeller;

    let seller = await Shop.findOne({ email });
    if (seller) {
      return next(new ErrorHandler("Shop already exists", 400));
    }

    seller = await Shop.create({
      name,
      email,
      avatar,
      password,
      zipCode,
      address,
      phoneNumber,
    });

    sendShopToken(seller, 201, res);
  })
);

// -------------------- LOGIN SHOP --------------------
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all the fields!", 400));
    }

    const seller = await Shop.findOne({ email }).select("+password");
    if (!seller) {
      return next(new ErrorHandler("Shop doesn't exist!", 400));
    }

    const isPasswordValid = await seller.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide the correct information", 400));
    }

    sendShopToken(seller, 201, res);
  })
);

// -------------------- LOAD SELLER --------------------
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findById(req.seller._id);
    if (!seller) {
      return next(new ErrorHandler("Shop doesn't exist", 400));
    }
    res.status(200).json({ success: true, seller });
  })
);

// -------------------- LOGOUT SHOP --------------------
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    const { clearCookieOptions } = require("../utils/cookieOptions");
    res.cookie("seller_token", null, clearCookieOptions);
    res.status(201).json({ success: true, message: "Log out successful!" });
  })
);

// -------------------- CHECK IF A SHOP ACCOUNT EXISTS (by email) --------------------
router.get(
  "/exists",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    const exists = email ? Boolean(await Shop.findOne({ email })) : false;
    res.status(200).json({ success: true, exists });
  })
);

// -------------------- PUBLIC SHOP INFO --------------------
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({ success: true, shop });
  })
);

// -------------------- UPDATE SHOP AVATAR --------------------
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    if (!req.file) {
      return next(new ErrorHandler("Please upload an image", 400));
    }

    const existsSeller = await Shop.findById(req.seller._id);

    if (existsSeller.avatar && existsSeller.avatar.public_id) {
      try {
        await destroy(existsSeller.avatar.public_id);
      } catch (e) {
        console.log("Cloudinary destroy failed:", e.message);
      }
    }

    existsSeller.avatar = await uploadBuffer(req.file.buffer, "shop-avatars");
    await existsSeller.save();

    res.status(200).json({ success: true, seller: existsSeller });
  })
);

// -------------------- UPDATE SELLER INFO --------------------
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller._id);
    if (!shop) {
      return next(new ErrorHandler("Shop not found", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;
    await shop.save();

    res.status(201).json({ success: true, shop });
  })
);

// -------------------- ADMIN: ALL SELLERS --------------------
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const sellers = await Shop.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, sellers });
  })
);

// -------------------- ADMIN: DELETE A SELLER --------------------
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const seller = await Shop.findByIdAndDelete(req.params.id);
    if (!seller) {
      return next(new ErrorHandler("Seller not found", 400));
    }
    res.status(201).json({ success: true, message: "Seller deleted successfully!" });
  })
);

// -------------------- FORGOT PASSWORD (SHOP) --------------------
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const seller = await Shop.findOne({ email });
    if (!seller) {
      return next(new ErrorHandler("No shop found with this email", 404));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    seller.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    seller.resetPasswordTime = Date.now() + 15 * 60 * 1000;
    await seller.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/shop/${resetToken}`;
    try {
      await sendMail({
        email: seller.email,
        subject: "Reset your AJ MART shop password",
        message: `Reset your shop password using this link (valid 15 minutes): ${resetUrl}`,
        html: `
          <h2>Shop password reset requested</h2>
          <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#3321c8;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
          <p>If you didn't request this, you can ignore this email.</p>
        `,
      });
      res
        .status(200)
        .json({ success: true, message: `Reset link sent to ${seller.email}` });
    } catch (e) {
      seller.resetPasswordToken = undefined;
      seller.resetPasswordTime = undefined;
      await seller.save({ validateBeforeSave: false });
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  })
);

// -------------------- RESET PASSWORD (SHOP) --------------------
router.put(
  "/reset-password/:token",
  catchAsyncErrors(async (req, res, next) => {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const seller = await Shop.findOne({
      resetPasswordToken: hashed,
      resetPasswordTime: { $gt: Date.now() },
    }).select("+password");

    if (!seller) {
      return next(
        new ErrorHandler("Reset link is invalid or has expired", 400)
      );
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return next(
        new ErrorHandler("Password must be at least 6 characters", 400)
      );
    }

    seller.password = password;
    seller.resetPasswordToken = undefined;
    seller.resetPasswordTime = undefined;
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  })
);

module.exports = router;
