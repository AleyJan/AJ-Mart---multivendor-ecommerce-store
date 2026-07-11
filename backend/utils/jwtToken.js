const { authCookieOptions } = require("./cookieOptions");

// Create a JWT, store it in an httpOnly cookie and send the response.
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  res.status(statusCode).cookie("token", token, authCookieOptions).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
