var passport = require('passport');
require('../authentications/passport')(passport);

var conn = require('../dbconnection').defaultConnection;
var async = require("async"),
    User = conn.model('User'),
    Post = conn.model('User'),
    userPageOperation = exports,
    logger = require('nlogger').logger(module);
    
userPageOperation.follow = function(req, res){
  var newFollowingUser = req.query.user,
      loggedInUser     = req.user.username,
      asyncTasks       = [];

  logger.info(loggedInUser,' tries to follow ', newFollowingUser);

  function updateFollowees(callback){
    var query  = {username: loggedInUser};
    var update = {$addToSet: {followees: newFollowingUser}};
    User.findOneAndUpdate(query, update, function(err, result){
      logger.info(result.username, "'s followees: ", result.followees);
    });
    callback();
  }

  function updateFollowers(callback){
    var query  = {username: newFollowingUser};
    var update = {$addToSet: {followers: loggedInUser}};
    User.findOneAndUpdate(query, update, function(err, result){
      logger.info(result.username, "'s followers: ", result.followers);
    });
    callback();
  }

  asyncTasks.push(updateFollowees);
  asyncTasks.push(updateFollowers);

  async.parallel(asyncTasks, function(err, result){
    if(err){
      logger.error('follow - async.parallel() Error: ',err);
      return res.send(500);
    } else {
      logger.info("Followed successfully");
      return res.send(200);
    }
  });
};

userPageOperation.unfollow = function(req, res, next){
  var userToUnfollow = req.query.user,
      loggedInUser   = req.user.username,
      asyncTasks     = [];

  logger.info(loggedInUser,' tries to unfollow ', userToUnfollow);
  
  function updateFollowees(callback){
    var query  = {username: loggedInUser};
    var update = {$pull: {followees: userToUnfollow}};
    User.findOneAndUpdate(query, update, function(err, result){
      logger.info(result.username, "'s followees: ", result.followees);
    });
    callback();
  }

  function updateFollowers(callback){
    var query  = {username: userToUnfollow};
    var update = {$pull: {followers: loggedInUser}};
    User.findOneAndUpdate(query, update, function(err, result){
      logger.info(result.username, "'s followers: ", result.followers);
    });
    callback();
  }

  asyncTasks.push(updateFollowees);
  asyncTasks.push(updateFollowers);

  async.parallel(asyncTasks, function(err, result){
    if(err){
      logger.error('unfollow - async.parallel() Error: ',err);
      return res.send(500);
    } else {
      logger.info("Unfollowed successfully");
      return res.send(200);
    }
  });
};