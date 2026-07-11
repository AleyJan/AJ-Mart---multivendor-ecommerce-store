const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../model/user");
const { upload } = require("../multer");
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

    const userEmail = await User.findOne({ email });

    // If the email already exists, remove the just-uploaded file and stop.
    if (userEmail) {
      if (req.file) {
        const filepath = path.join(__dirname, "../uploads", req.file.filename);
        fs.unlink(filepath, (err) => {
          if (err) console.log("Error deleting file:", err);
        });
      }
      return next(new ErrorHandler("User already exists", 400));
    }

    if (!req.file) {
      return next(new ErrorHandler("Please upload a profile picture", 400));
    }

    // Use forward slashes so the URL works when served over HTTP (path.join
    // would produce backslashes on Windows).
    const fileUrl = `uploads/${req.file.filename}`;

    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: req.file.filename,
        url: fileUrl,
      },
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
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

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

module.exports = router;
