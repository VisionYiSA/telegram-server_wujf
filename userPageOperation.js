var passport = require('passport');
require('./passport')(passport);
var async = require("async"),
		User = require('./models/user'),
		Post = require('./models/post');

exports.follow = function(req, res){
	var newFollowingUser = req.query.user,
			loggedInUser 		 = req.user.username,
			asyncTasks 			 = [],
			callback 				 = function(){console.log('DONE');};

	var updateFollowees = function(callback){
		var query  = {username: loggedInUser};
		var update = {$addToSet: {followees: newFollowingUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			console.log('1 async ' + result);
		});
		callback();
	};

	var updateFollowers = function(callback){
		var query  = {username: newFollowingUser};
		var update = {$addToSet: {followers: loggedInUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			console.log('2 async ' + result);
		});
		callback();
	};

	asyncTasks.push(updateFollowees(callback));
	asyncTasks.push(updateFollowers(callback));

	async.parallel(asyncTasks, function(err, result){
		if(err){
			console.log("FAILED!");
			return res.send(500);
		} else {
			console.log("OK!");
			return res.send(200);
		}
	});
};

exports.unfollow = function(req, res, next){
	var userToUnfollow = req.query.user,
	    loggedInUser 	 = req.user.username,
		  asyncTasks 		 = [],
		  callback 			 = function(){console.log('DONE');};
	
	var updateFollowees = function(callback){
		var query  = {username: loggedInUser};
		var update = {$pull: {followees: userToUnfollow}};
		User.findOneAndUpdate(query, update, function(err, result){
			console.log('1 async ' + result);
		});
		callback();
	};

	var updateFollowers = function(callback){
		var query  = {username: userToUnfollow};
		var update = {$pull: {followers: loggedInUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			console.log('2 async ' + result);
		});
		callback();
	};

	asyncTasks.push(updateFollowees(callback));
	asyncTasks.push(updateFollowers(callback));

	async.parallel(asyncTasks, function(err, result){
		if(err){
			return res.send(500);
		} else {
			return res.send(200);
		}
	});
};