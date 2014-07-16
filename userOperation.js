var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');

exports.register = function(req, res){
  console.log(req.body.user);
  var newUser = new User({
    username: req.body.user.username,
    name: req.body.user.name,
    eamil: req.body.user.email,
    password: req.body.user.password
  });

  newUser.save(function(err, result){
    // console.log(result);
    req.login(result, function(err) { // Set cookie here 
      if (err) { return res.send(400); }
      var emberUser = {
        'id':       result.username, // _id
        'username': result.username,
        'name':     result.name,
        'email':    result.email
      };   
      return res.send(200, {user: [emberUser]});
    });
  });
};

exports.loginOrGetFollowingsFollowers = function(req, res, next){
  var username      = req.query.username,
      password      = req.query.password,
      operation     = req.query.operation,
      follower      = req.query.followers,
      followingUser = req.query.followings;

  if(operation == 'login'){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(400); }
      if (!user) { return res.send(400); }
      req.login(user, function(err) { // Set cookie here 
        if (err) { return res.send(400); }
        var emberUser = {
          'id':       user.username, // _id
          'username': user.username,
          'name':     user.name,
          'email':    user.email
        };   
        return res.send(200, {user: [emberUser]});
      });
    })(req, res, next);

  // ======= GET Following users (users that current URL user follows)=======

  } else if(follower){
    var emberFollwingUsers = [];
    // console.log("follower : "+follower);
    User.find({'followers': follower}, function(err, theUsers){
      // console.log("theUsers : "+theUsers);
      if(theUsers){
        theUsers.forEach(
          function(user){
            var eachUser = {
              'id':        user.username,
              'username':  user.username   
            }
            emberFollwingUsers.push(eachUser);
          }
        )
        return res.send(200, {users: emberFollwingUsers});
      } else {
        return res.send(404);
      };
    });
  }
  // ======= GET Followers (users that follows current URL user)=============

  else if(followingUser){
    var emberFollowers = [];
    // console.log("followingUser : "+followingUser);
    User.find({'followings': followingUser}, function(err, theUsers){
      // console.log("theUsers : "+theUsers);
      if(theUsers){
        theUsers.forEach(
          function(user){
            var eachUser = {
              'id':        user.username,
              'username':  user.username   
            }
            emberFollowers.push(eachUser);
          }
        )
        return res.send(200, {users: emberFollowers});
      } else {
        return res.send(404);
      };
    });
  }
};

exports.getUser = function(req, res){
  var userId = req.params.user_id;
  User.findOne({'username': userId}, function(err, result){
    // console.log('====== result =======');
    // console.log(result);

    if(result != null) {
      var emberUser = {
        'id':       result.username, // _id
        'username': result.username,
        'name':     result.name,
        'email':    result.email
      };   

      return res.send(200, {user: emberUser});
    } else {
      console.log('====== NOP =======');
      return res.send(404);
    }
  });
};

exports.logout = function(req, res){
  req.logout();
  res.send(200);
};