var passport = require('passport');
require('../authentications/passport')(passport);
var conn = require('../dbconnection');
var async = require("async"),
		User = conn.model('User'),
		Post = conn.model('User'),
		userPageOperation = exports;
		
userPageOperation.follow = function(req, res){
	console.log('===== F O L L O W ===== ');
	var newFollowingUser = req.query.user,
			loggedInUser 		 = req.user.username,
			asyncTasks 			 = [];

	function updateFollowees(callback){
		var query  = {username: loggedInUser};
		var update = {$addToSet: {followees: newFollowingUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			// console.log('===== updateFollowees ===== ');
			// console.log(result.username + "'s followees: " + result.followees);
		});
		callback();
	}

	function updateFollowers(callback){
		var query  = {username: newFollowingUser};
		var update = {$addToSet: {followers: loggedInUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			// console.log('==== updateFollowers =====');
			// console.log(result.username + "'s followers: " + result.followers);
		});
		callback();
	}

	asyncTasks.push(updateFollowees);
	asyncTasks.push(updateFollowers);

	async.parallel(asyncTasks, function(err, result){
		if(err){
			console.log("FAILED!");
			return res.send(500);
		} else {
			console.log("NO ERROR ON FOLLOW");
			return res.send(200);
		}
	});
};

userPageOperation.unfollow = function(req, res, next){
	// console.log('===== U N F O L L O W ===== ');
	var userToUnfollow = req.query.user,
	    loggedInUser 	 = req.user.username,
		  asyncTasks 		 = [];
	
	function updateFollowees(callback){
		var query  = {username: loggedInUser};
		var update = {$pull: {followees: userToUnfollow}};
		User.findOneAndUpdate(query, update, function(err, result){
			// console.log('===== updateFollowees ===== ');
			// console.log(result.username + "'s followees: " + result.followees);
		});
		callback();
	}

	function updateFollowers(callback){
		var query  = {username: userToUnfollow};
		var update = {$pull: {followers: loggedInUser}};
		User.findOneAndUpdate(query, update, function(err, result){
			// console.log('==== updateFollowers =====');
			// console.log(result.username + "'s followers: " + result.followers);
		});
		callback();
	}

	asyncTasks.push(updateFollowees);
	asyncTasks.push(updateFollowers);

	async.parallel(asyncTasks, function(err, result){
		if(err){
			// console.log("FAILED!");
			return res.send(500);
		} else {
			// console.log("NO ERROR ON UNFOLLOW");
			return res.send(200);
		}
	});
};