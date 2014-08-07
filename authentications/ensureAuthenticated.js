require('passport');
require('passport-local').Strategy;
var logger = require('nlogger').logger(module);

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) { // Check the cookie exists
    return next();
  } else {
  	logger.error('403');
    return res.send(403);
  }
}