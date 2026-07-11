const { authCookieOptions } = require("./cookieOptions");

// Create a JWT for a seller, store it in a "seller_token" httpOnly cookie.
const sendShopToken = (seller, statusCode, res) => {
  const token = seller.getJwtToken();

  res
    .status(statusCode)
    .cookie("seller_token", token, authCookieOptions)
    .json({
      success: true,
      seller,
      token,
    });
};

module.exports = sendShopToken;
