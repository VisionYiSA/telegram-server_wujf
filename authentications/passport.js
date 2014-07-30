
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

  function checkPasswordOnLogin(dbPassword, inputPassword){
    // console.log(' ');
    // console.log(" !!!!!! CHECK PASS !!!!!");
    // console.log(dbPassword);
    // console.log(inputPassword);
    bcrypt.compare(inputPassword, dbPassword, function(err, res) {
      // console.log(res);
      return res;
    });
  }

  passport.use('local', new LocalStrategy({
      usernameField: 'username'
    },
    function(username, password, done) {
      User.findOne({
        'username': username
      }, function(err, user){
        if(err){ return done(err); }
        if(!user){ return done(null, false); }
        if(checkPasswordOnLogin(user.password, password)){ return done(null, false); }
        return done(null, user);
      });
    }
  ));
};