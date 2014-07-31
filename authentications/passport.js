
var passport = require('passport'),
    bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


module.exports = function(passport) {
  passport.serializeUser(function(user, done) { // Sets Cookie on login
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) { // Check user's cookie
    User.findOne({'_id': id}, function(err, user){ // instead of find()
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
        if(err){ return done(err); }
        if(!user){ return done(null, false); }
        // console.log('Password: ' + password);
        // console.log('User.password: ' + user.password);
        bcrypt.compare(password, user.password, function(err, res) {
          // console.log('Password - 2: ' + password);
          // console.log('User.password - 2: ' + user.password);
          if(res) {
            console.log(res);
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  ));
};