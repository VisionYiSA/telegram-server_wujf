var passport = require('passport'),
    bcrypt = require('bcrypt');
require('../authentications/passport')(passport);
var User = require('../models/user');
var emberObjWrapper = require('../wrappers/emberObjWrapper');

exports.checkLoggedInUserExistance = function(req, res){
  // console.log('req.user: ' + req.user);
  // console.log('Before req.user : isAuthenticated = ' + req.isAuthenticated());
  if (req.user){
    return res.send(200, {user: emberObjWrapper.emberUser(req.user)});
  } else {
    return res.send(200, {user: null});
  }
};


exports.register = function(req, res){
  var randomNum = Math.floor(5*Math.random());
  var avatar = 'images/avatar-'+randomNum+'.png';
  var hasedPassword;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.user.password, salt, function(err, hash) {
      // console.log(" ");
      // console.log(" ======= HASHED PASS ========");
      // console.log(hash);
      hasedPassword = hash;
      // callback();
      var newUser = new User({
        username: req.body.user.username,
        name: req.body.user.name,
        eamil: req.body.user.email,
        password: hasedPassword,
        avatar: avatar
      });
      // console.log(newUser);

      newUser.save(function(err, user){
        req.login(user, function(err) { // Set cookie here 
          if (err) { return res.send(400); }  
          return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
        });
      });
    });
  });
};

exports.loginOrGetFolloweesOrFollowers = function(req, res, next){
  // console.log(req);
  var username      = req.query.username,
      password      = req.query.password,
      email         = req.query.email,
      operation     = req.query.operation,
      currentUserAsFollower      = req.query.follower,
      currentUserAsFollowee      = req.query.followee;

  if(operation == 'login'){
    // console.log(' ======= login =====');

    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(400); }
      if (!user) { return res.send(400); }
      // console.log(user);
      req.login(user, function(err) { // Set cookie here 
        if (err) { return res.send(400); }
        // console.log(' ====== req.login passed =======');
        // console.log(user);
        return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
      });
    })(req, res, next);

  // ======= GET Followees (users that current URL user follows)=======
  // Check if current URL user is in the array of followers of any users
  } else if(currentUserAsFollower){
    // console.log(' ');
    var emberFollowees = [];
    var authenticatedUser = req.user.username;
    // console.log("currentUser As Follower: "+currentUserAsFollower);
    User.find({'followers': currentUserAsFollower}).sort({date:-1}).limit(20).exec(function(err, followees){
      // console.log(currentUserAsFollower+"'s followees : " + followees);
      if(followees){
        followees.forEach(
          function(user){
            emberFollowees.push(emberObjWrapper.emberUser(user, authenticatedUser));
          }
        )
        return res.send(200, {users: emberFollowees});
      };
    });
  }
  // ======= GET Followers (users that follows current URL user)=======
  // Check if current URL user is in the array of followees of any users
  else if(currentUserAsFollowee){
    console.log(' ');
    var emberFollowers = [];
    var authenticatedUser = req.user.username;
    // console.log("currentUser As Followee: "+currentUserAsFollowee);
    User.find({'followees': currentUserAsFollowee}).sort({date:-1}).limit(20).exec(function(err, followers){
      console.log(currentUserAsFollowee + "'s followers : "+followers);
      if(followers){
        followers.forEach(
          function(user){
            emberFollowers.push(emberObjWrapper.emberUser(user, authenticatedUser));
          }
        )
        return res.send(200, {users: emberFollowers});
      };
    });
  } else if(operation == 'resetPassword'){
    console.log("username = "+username);
    console.log("email = "+email);
    User.find({'username': username}, function(err, user){
      if(email == user.email) { 
        console.log(' ======== SENDING EMAIL ======= ');

        // ====== Send Email ======
        var dotenv = require('dotenv');
        dotenv.load();
        var Mailgun = require('mailgun-js');

        var mailgun = new Mailgun({
           apiKey: process.env.API_KEY, 
           domain: process.env.DOMAIN});

        var data = {
          from: 'Telegram Admin <postmaster@'+process.env.DOMAIN+'>',
          to: email,
          subject: '[Telegram Admin] - Password Reset',
          html: '../email/resetPassMsg.hbs'
        };

        mailgun.messages().send(data, function (error, body) {
          console.log(body);
        });

        return res.send(200);
      } else {
        console.log('====== User Not Found =======');
        return res.send(404);
      }
    });
  }
};

exports.getUser = function(req, res){
  // console.log(' ');
  // console.log('===== getUser ======');
  var authenticatedUser = req.user.username
      userId            = req.params.user_id;

  if(authenticatedUser && userId){
    User.findOne({'username': userId}, function(err, user){
      if(user != null) { 
        return res.send(200, {user: emberObjWrapper.emberUser(user, authenticatedUser)});
      } else {
        console.log('====== NOP =======');
        return res.send(404);
      }
    });
  } else {
    return res.send(404);
  }
};

exports.logout = function(req, res){
  req.logout();
  res.send(200);
};