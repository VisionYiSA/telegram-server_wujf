var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');
var Post = require('./models/post');

exports.follow = function(req, res, next){
	// console.log("User to follow = " + req.query.user);
	// console.log("LoggedInUser = " + req.user.username);
	var newFollowingUser = req.query.user;
	var loggedInUser = req.user.username;
	// == Store the profile user at ths url to loggedIn user's followerings ==
	User.findOne({'username': loggedInUser}, function(err, result){
		// console.log("Before push result = "+ result);
		if(result) {
			result.followings.push(newFollowingUser);
			// console.log("After push result = " + result);
			result.save(function(err, user){
				// console.log('save : '+user);
				if(user) { 
		      // console.log('saved : '+user);
		      // console.log("==== Store loggedIn user to following user's followers ====")
		      User.findOne({'username': newFollowingUser}, function(err, followee){
		      	// console.log("followee : " + followee);
		      	if(followee){
		      		followee.followers.push(loggedInUser);
		      		followee.save(function(err, aUser){
		      			// console.log("Saved : " + aUser);
		      			return res.send(200);
		      		});
		      		// console.log("Saved followee : " + followee);
		      	} else {
		      		return res.send(400);
		      	}
		      });
				} else {
					return res.send(400);
				};
			});
		} else {
			return res.send(404);
		};
	});
};

exports.unfollow = function(req, res, next){
	var userToUnfollow = req.query.user;
	var loggedInUser = req.user.username;
	// == Remove the profile user at ths url from loggedIn user's followerings ==
	User.findOne({'username': loggedInUser}, function(err, result){
		// console.log("Before push result = "+ result);
		if(result) {
			var index = result.followings.indexOf(userToUnfollow);
			if(index > -1){
				result.followings.splice(index, 1);
				result.save(function(err, user){
					// console.log('save : '+user);
					if(user) { 
			      // console.log('saved : '+user);
			      // console.log("==== Remove loggedIn user from userToUnfollow's followers ====")
			      User.findOne({'username': userToUnfollow}, function(err, followee){
			      	// console.log("followee : " + followee);
			      	if(followee){
			      		var index = followee.followers.indexOf(userToUnfollow);
			      		if(index > -1){
			      			followee.followers.splice(index, 1);
				      		followee.save(function(err, aUser){
				      			// console.log("Saved : " + aUser);
				      			return res.send(200);
				      		});
			      		}
			      		// console.log("Saved followee : " + followee);
			      	} else {
			      		return res.send(400);
			      	}
			      });
					} else {
						return res.send(400);
					};
				});
			}
		} else {
			return res.send(404);
		};
	});
};