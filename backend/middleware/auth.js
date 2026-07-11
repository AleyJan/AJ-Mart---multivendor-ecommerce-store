const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

// Reads the JWT from the httpOnly cookie and attaches the user to the request.
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);

  next();
});

// Reads the seller JWT from the "seller_token" cookie and attaches the seller.
exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  req.seller = await Shop.findById(decoded.id);

  next();
});

// Restricts a route to users whose role is in the allowed list (use after isAuthenticated).
exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user?.role || "You"} cannot access this resource!`,
          403
        )
      );
    }
    next();
  };
};
