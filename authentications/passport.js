
var passport = require('passport'),
    bcrypt = require('bcrypt'),
    LocalStrategy = require('passport-local').Strategy,
    conn = require('../dbconnection'),
    User = conn.model('User'),
    logger = require('nlogger').logger(module);

logger.error(conn)

module.exports = function(passport) {
  passport.serializeUser(function(user, done) { // Sets Cookie on login
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
        console.log(' ====== before bcrypt.compare ======');
        if(err){ logger.error(err); return done(err); }
        if(!user){ return done(null, false); }
        // console.log('Password: ' + password);
        // console.log('User.password: ' + user.password);
        bcrypt.compare(password, user.password, function(err, res) {
          // console.log('Password - 2: ' + password);
          // console.log('User.password - 2: ' + user.password);
          if(res) {
            // console.log(res);
            return done(null, user);
          } else {
            logger.error(err);
            return done(null, false);
          }
        });
      });
    }
  ));
};