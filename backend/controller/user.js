const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();

const User = require("../model/user");
const { upload } = require("../multer");
const { uploadBuffer, destroy } = require("../utils/cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Create activation token (short-lived JWT holding the pending user data)
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// -------------------- REGISTER (create user) --------------------
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!req.file) {
      return next(new ErrorHandler("Please upload a profile picture", 400));
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const avatar = await uploadBuffer(req.file.buffer, "avatars");

    const user = {
      name,
      email,
      password,
      avatar,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `${process.env.FRONTEND_URL}/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click the link to activate your account: ${activationUrl}`,
      html: `
        <h2>Hello ${user.name},</h2>
        <p>Thank you for registering. Please click the button below to activate your account.</p>
        <a href="${activationUrl}" style="display:inline-block;padding:10px 20px;background:#3321c8;color:#fff;text-decoration:none;border-radius:5px;">Activate Account</a>
        <p>This link will expire in 5 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: `Please check your email (${user.email}) to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// -------------------- ACTIVATE USER --------------------
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    user = await User.create({ name, email, password, avatar });

    sendToken(user, 201, res);
  })
);

// -------------------- LOGIN --------------------
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all the fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    sendToken(user, 201, res);
  })
);

// -------------------- LOAD LOGGED-IN USER --------------------
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  })
);

// -------------------- CHECK IF A USER ACCOUNT EXISTS (by email) --------------------
router.get(
  "/exists",
  catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    const exists = email ? Boolean(await User.findOne({ email })) : false;
    res.status(200).json({ success: true, exists });
  })
);

// -------------------- PUBLIC USER INFO (for chat) --------------------
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(201).json({ success: true, user });
  })
);

// -------------------- LOGOUT --------------------
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    const { clearCookieOptions } = require("../utils/cookieOptions");
    res.cookie("token", null, clearCookieOptions);

    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  })
);

// -------------------- ADMIN: ALL USERS --------------------
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(201).json({ success: true, users });
  })
);

// -------------------- ADMIN: DELETE A USER --------------------
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    res.status(201).json({ success: true, message: "User deleted successfully!" });
  })
);

// -------------------- UPDATE USER INFO --------------------
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, phoneNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorHandler("User not found", 400));

    if (email && email !== user.email) {
      const taken = await User.findOne({ email });
      if (taken) return next(new ErrorHandler("Email already in use", 400));
      user.email = email;
    }
    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- UPDATE USER AVATAR --------------------
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    if (!req.file) return next(new ErrorHandler("Please upload an image", 400));

    const user = await User.findById(req.user.id);
    if (user.avatar && user.avatar.public_id) {
      try {
        await destroy(user.avatar.public_id);
      } catch (e) {
        console.log("Cloudinary destroy failed:", e.message);
      }
    }

    user.avatar = await uploadBuffer(req.file.buffer, "avatars");
    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- FORGOT PASSWORD --------------------
router.post(
  "/forgot-password",
  catchAsyncErrors(async (req, res, next) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("No user found with this email", 404));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordTime = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/user/${resetToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Reset your AJ MART password",
        message: `Reset your password using this link (valid 15 minutes): ${resetUrl}`,
        html: `
          <h2>Password reset requested</h2>
          <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#3321c8;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
          <p>If you didn't request this, you can ignore this email.</p>
        `,
      });
      res
        .status(200)
        .json({ success: true, message: `Reset link sent to ${user.email}` });
    } catch (e) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  })
);

// -------------------- RESET PASSWORD --------------------
router.put(
  "/reset-password/:token",
  catchAsyncErrors(async (req, res, next) => {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordTime: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
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

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  })
);

// -------------------- ADD / UPDATE AN ADDRESS --------------------
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const { country, city, address1, address2, zipCode, addressType } =
      req.body;

    // one address per type: update in place if the type already exists
    const existing = user.addresses.find((a) => a.addressType === addressType);
    if (existing) {
      existing.country = country;
      existing.city = city;
      existing.address1 = address1;
      existing.address2 = address2;
      existing.zipCode = zipCode;
    } else {
      user.addresses.push({
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
      });
    }

    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- DELETE AN ADDRESS --------------------
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      (a) => String(a._id) !== String(req.params.id)
    );
    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- ADD A PAYMENT METHOD (only last4 + expiry kept) --------------------
const detectBrand = (digits) => {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "Discover";
  return "Card";
};

router.put(
  "/update-payment-methods",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { cardHolderName, cardNumber, expiryDate, makeDefault } = req.body;

    const digits = String(cardNumber || "").replace(/\D/g, "");
    if (digits.length < 4) {
      return next(new ErrorHandler("Please enter a valid card number", 400));
    }

    const user = await User.findById(req.user.id);
    const makeDef = user.paymentMethods.length === 0 || Boolean(makeDefault);
    if (makeDef) user.paymentMethods.forEach((m) => (m.isDefault = false));

    user.paymentMethods.push({
      cardHolderName,
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiryDate,
      isDefault: makeDef,
    });

    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- SET A PAYMENT METHOD AS DEFAULT --------------------
router.put(
  "/set-default-payment/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    user.paymentMethods.forEach((m) => {
      m.isDefault = String(m._id) === String(req.params.id);
    });
    await user.save();
    res.status(200).json({ success: true, user });
  })
);

// -------------------- DELETE A PAYMENT METHOD --------------------
router.delete(
  "/delete-payment-method/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const removed = user.paymentMethods.find(
      (m) => String(m._id) === String(req.params.id)
    );
    user.paymentMethods = user.paymentMethods.filter(
      (m) => String(m._id) !== String(req.params.id)
    );
    // if we deleted the default, promote the first remaining card
    if (removed?.isDefault && user.paymentMethods.length) {
      user.paymentMethods[0].isDefault = true;
    }
    await user.save();
    res.status(200).json({ success: true, user });
  })
);

module.exports = router;
