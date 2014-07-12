require('passport');
require('passport-local').Strategy;

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) { // Check the cookie exists
    return next();
  } else {
    return res.send(403);
  }
}