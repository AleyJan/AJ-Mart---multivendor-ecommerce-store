// Wraps an async route handler so rejected promises are forwarded to Express's
// error middleware instead of crashing the process.
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
