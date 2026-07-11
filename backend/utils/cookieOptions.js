const isProd =
  String(process.env.NODE_ENV).toLowerCase() === "production";

const authCookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

const clearCookieOptions = {
  expires: new Date(Date.now()),
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

module.exports = { authCookieOptions, clearCookieOptions };
