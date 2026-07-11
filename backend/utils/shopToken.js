// Create a JWT for a seller, store it in a "seller_token" httpOnly cookie.
const sendShopToken = (seller, statusCode, res) => {
  const token = seller.getJwtToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true behind HTTPS in production
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller,
    token,
  });
};

module.exports = sendShopToken;
