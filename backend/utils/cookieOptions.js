const isProd =
  String(process.env.NODE_ENV).toLowerCase() === "production";

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // matches JWT_EXPIRES (1d)

// maxAge is applied per-response, so the cookie lifetime is measured from each
// login rather than from server start-up.
const authCookieOptions = {
  maxAge: ONE_DAY_MS,
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

const clearCookieOptions = {
  expires: new Date(0), // always in the past -> tells the browser to delete it
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
};

module.exports = { authCookieOptions, clearCookieOptions };
