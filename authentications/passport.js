
var passport = require('passport');
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
        if(err){ return done(err); }
        if(!user){ return done(null, false); }
        if(user.password != password){ return done(null, false); }
        return done(null, user);
      });
    }
  ));

  // function ensureAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) { // Check the cookie exists
  //     return next();
  //   } else {
  //     return res.send(403);
  //   }
  // }
};