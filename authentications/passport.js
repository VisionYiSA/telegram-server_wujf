
var passport      = require('passport'),
    bcrypt        = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy,
    conn          = require('../dbconnection').defaultConnection,
    User          = conn.model('User'),
    logger        = require('nlogger').logger(module);

module.exports = function(passport) {
  logger.info('Passport process');

  passport.serializeUser(function(user, done) {
    logger.error('user._id: ', user._id);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({'_id': id}, function(err, user){
      if(err) logger.error('passport.deserializeUser() error: ', err);
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

        if(err){ logger.error('On finding user - bcrypt.compare err: ', err); return done(err); }
        if(!user){ return done(null, false); }

        bcrypt.compare(password, user.password, function(err, res) {
          if(res) {
            return done(null, user);
            
          } else {
            if(err){
              logger.error('Inside - bcrypt.compare err: ', err);
            } else {
              logger.debug('Inside - bcrypt.compare something went wrong');
            }
            return done(null, false);
          }
        });

      });
    }
  ));
};