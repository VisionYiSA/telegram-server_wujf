
var passport = require('passport'),
    bcrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy,
    conn = require('../dbconnection').defaultConnection,
    User = conn.model('User'),
    logger = require('nlogger').logger(module);

module.exports = function(passport) {
  logger.info('==== Passport ====');
  passport.serializeUser(function(user, done) { // Sets Cookie on login
    logger.error('user._id: '+user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) { // Check user's cookie
    User.findOne({'_id': id}, function(err, user){ // instead of find()
      if(err) logger.error(err);
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy({
      usernameField: 'username'
    },
    function(username, password, done) {
      User.findOne({
        'username': username
      }, function(err, user){
        logger.info(' ====== before bcrypt.compare ======');
        if(err){ logger.error(err); return done(err); }
        if(!user){ return done(null, false); }
        logger.info('Password: ' + password);
        logger.info('User.password: ' + user.password);
        bcrypt.compare(password, user.password, function(err, res) {
          logger.info('Password - bcrypt.compare: ' + password);
          logger.info('User.password - bcrypt.compare: ' + user.password);
          if(res) {
            logger.info('res: '+res);
            return done(null, user);
          } else {
            logger.error('err: '+err);
            return done(null, false);
          }
        });
      });
    }
  ));
};