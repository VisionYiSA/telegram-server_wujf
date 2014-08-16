var logger = require('nlogger').logger(module);

module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    logger.info('req.isAuthenticated() PASSED');
    return next();
    
  } else {
    logger.error('403');
    return res.send(403);
  }
}