
var passport      = require('passport');
var bcrypt        = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var conn          = require('../dbconnection').defaultConnection;
var User          = conn.model('User');
var logger        = require('nlogger').logger(module);

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    logger.error('passport.serializeUser() user: ', user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({'_id': id}, function(err, user){
      if(err) {
        logger.error('passport.deserializeUser() error: ', err);
      }
      logger.info('passport.deserializeUser() No Error')
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

        if(err){ 
          logger.error('LocalStrategy() error: ', err); 
          return done(err); 
        }
        if(!user){ 
          logger.error('LocalStrategy() User not found');
          return done(null, false); 
        }

        bcrypt.compare(password, user.password, function(err, res) {
          if(res) {
            logger.info('Passwords matched');
            return done(null, user);
            
          } else {

            if(err){
              logger.error('Inside - bcrypt.compare err: ', err);
              return done(err);
            } else {
              return done(new Error('Passwords did not match'));
            }
          }
        });

      });
    }
  ));
};