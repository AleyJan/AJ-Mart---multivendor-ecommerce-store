// Create a JWT, store it in an httpOnly cookie and send the response.
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true behind HTTPS in production
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
