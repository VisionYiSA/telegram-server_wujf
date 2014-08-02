var passport = require('passport'),
    bcrypt = require('bcrypt'),
    config = require('../config');
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
      hasedPassword = hash;
      var newUser = new User({
        username: req.body.user.username,
        name: req.body.user.name,
        email: req.body.user.email,
        password: hasedPassword,
        avatar: avatar
      });

      newUser.save(function(err, user){
        req.login(user, function(err) { // Set cookie here 
          if (err) { return res.send(400); }  
          return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
        });
      });
    });
  });
};

exports.userQueryHandlers = function(req, res, next){
  var username      = req.query.username,
      password      = req.query.password,
      email         = req.query.email,
      operation     = req.query.operation,
      currentUserAsFollower = req.query.follower,
      currentUserAsFollowee = req.query.followee;

  function getFollowees(currentUserAsFollower, authenticatedUser){
    var emberFollowees = [];
    User.find({'followers': currentUserAsFollower}).sort({date:-1}).limit(20).exec(function(err, followees){
      if(followees){
        followees.forEach(function(user){
          emberFollowees.push(emberObjWrapper.emberUser(user, authenticatedUser));
        })
        return res.send(200, {users: emberFollowees});
      };
    });
  }

  function getFollowers(currentUserAsFollowee, authenticatedUser){
    var emberFollowers = [];
    User.find({'followees': currentUserAsFollowee}).sort({date:-1}).limit(20).exec(function(err, followers){
      if(followers){
        followers.forEach( function(user){
          emberFollowers.push(emberObjWrapper.emberUser(user, authenticatedUser));
        })
        return res.send(200, {users: emberFollowers});
      };
    });
  }

  if(operation == 'login'){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(400); }
      if (!user) { return res.send(400); }
      req.login(user, function(err) { // Set cookie here 
        if (err) { return res.send(400); }
        return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
      });
    })(req, res, next);
  } else if(currentUserAsFollower){
    // ======= GET Followees (users that current URL user follows)=======
    getFollowees(currentUserAsFollower, req.user.username);
  }
  else if(currentUserAsFollowee){
    // ======= GET Followers (users that follows current URL user)=======
    getFollowers(currentUserAsFollowee, req.user.username);
  } else if(operation == 'resetPassword'){
    User.findOne({'username': username}, function(err, user){
      if(email == user.email) { 
        // ====== Send Email ======
        var Mailgun = require('mailgun-js');
        var mailgun = new Mailgun({
          apiKey: config.API_KEY, 
          domain: config.DOMAIN
        });

        var data = {
          from: 'Telegram Admin <postmaster@'+config.DOMAIN+'>',
          to: email,
          subject: '[Telegram Admin] - Password Reset',
          text: 'Test Email'//'../email/resetPassMsg.hbs'
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

  function getTheUser(user_id, authenticatedUser){
    User.findOne({'username': userId}, function(err, user){
      if(user != null) { 
        if(authenticatedUser){
          return res.send(200, {user: emberObjWrapper.emberUser(user, authenticatedUser)});
        } else {
          return res.send(200, {user: emberObjWrapper.emberUser(user)});
        }
      } else {
        return res.send(404);
      }
    });  
  }

  if(!req.user){
    if(req.params.user_id) {
      var userId = req.params.user_id;

      getTheUser(userId);
    } else {
      return res.send(404);
    }  
  } else {
    var authenticatedUser = req.user.username,
        userId            = req.params.user_id;

    if(authenticatedUser && userId){
      getTheUser(userId, authenticatedUser);
    } else {
      return res.send(404);
    }  
  }
};

exports.logout = function(req, res){
  req.logout();
  res.send(200);
};