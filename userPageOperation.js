var passport = require('passport');
require('./passport')(passport);
var async = require("async"),
		User = require('./models/user'),
		Post = require('./models/post');

exports.follow = function(req, res, next){
	var newFollowingUser = req.query.user;
	var loggedInUser = req.user.username;
	console.log('newFollowingUser : '+newFollowingUser);
	console.log('loggedInUser : '+loggedInUser);

	async.parallel([
		function(){
			var query  = {username: loggedInUser};
			var update = {$addToSet: {followees: newFollowingUser}}
				// function(follower){ 
				// 	if(follower && follower.followees.indexOf(newFollowingUser) < 0) {
				// 		follower.followees.push(newFollowingUser);
				// 	};
				// 	return follower.followees;
				// }
			User.findOneAndUpdate(query, update);
		},function(){
			// var addFollowers = function(loggedInUser){
	  //   	if(this.indexOf(loggedInUser) < 0){
	  //   		this.push(loggedInUser);
	  //   	};
			// };

	  //   User.findOneAndUpdate({'username': newFollowingUser}, {'followers': addFollowers(loggedInUser)}, function(err, followee){

	  //   	console.log(" == newFollowingUser : " + followee);
	  //   });

	    // User.findOne(
	    // 	{'username': newFollowingUser}, 
	    // 	function(err, followee){
		   //  	if(followee && followee.followers.indexOf(loggedInUser) < 0){
		   //  		followee.followers.push(loggedInUser);
		   //  	};
		   //  	console.log(" == newFollowingUser : " + followee);
		   //  },
		   //  {'followers': followee.followers}
	    // );

			var query  = {username: newFollowingUser};
			var update = {$addToSet: {followers: loggedInUser}}
			User.findOneAndUpdate(query, update);

		}], function(err, result){
		if(err){
			console.log("FAILED!");
			return res.send(500);
		} else {
			console.log("OK!");
			return res.send(200);
		}
	});

	// == Store the profile user at ths url to loggedIn user's followerings ==

	// User.findOne({'username': loggedInUser}, function(err, result){
	// 	// console.log("Before push result = "+ result);
	// 	if(result && result.followees.indexOf(newFollowingUser) < 0) {
	// 		result.followees.push(newFollowingUser);
	// 		// console.log("After push result = " + result);
	// 		result.save(function(err, user){
	// 			// console.log('save : '+user);
	// 			if(user) { 
	// 	      // console.log('saved : '+user);
	// 	      // console.log("==== Store loggedIn user to following user's followers ====")
	// 	      User.findOne({'username': newFollowingUser}, function(err, followee){
	// 	      	// console.log("followee : " + followee);
	// 	      	if(followee && followee.followers.indexOf(loggedInUser) < 0){
	// 	      		followee.followers.push(loggedInUser);
	// 	      		followee.save(function(err, aUser){
	// 	      			// console.log("Saved : " + aUser);
	// 	      			return res.send(200);
	// 	      		});
	// 	      		// console.log("Saved followee : " + followee);
	// 	      	} else {
	// 	      		return res.send(400);
	// 	      	}
	// 	      });
	// 			} else {
	// 				return res.send(400);
	// 			};
	// 		});
	// 	} else {
	// 		return res.send(404);
	// 	};
	// });
};

exports.unfollow = function(req, res, next){
	var userToUnfollow = req.query.user;
	var loggedInUser = req.user.username;

	async.parallel([
		function(){
      User.findOneAndUpdate({'username': loggedInUser}, function(err, follower){
				if(follower && follower.followees.indexOf(userToUnfollow) > -1){
					follower.followees.splice(index, 1);
      	};
      	console.log(" == loggedInUser : " + follower);
      });
		},function(){
      User.findOneAndUpdate({'username': userToUnfollow}, function(err, followee){
    		if(followee && followee.followers.indexOf(userToUnfollow) > -1){
    			followee.followers.splice(index, 1);
    		};
    		console.log(" == userToUnfollow : " + followee);
      });
		}], function(err, result){
		if(err){
			return res.send(500);
		} else {
			return res.send(200);
		}
	});


	// console.log('== Remove the profile user at ths url from loggedIn user s followerings ===');
	// console.log('userToUnfollow : '+userToUnfollow);
	// console.log('loggedInUser : '+loggedInUser);
	// User.findOne({'username': loggedInUser}, function(err, result){
	// 	console.log("Before push result = "+ result);
	// 	if(result) {
	// 		var index = result.followees.indexOf(userToUnfollow);
	// 		if(index > -1){
	// 			result.followees.splice(index, 1);
	// 			result.save(function(err, user){
	// 				// console.log('save : '+user);
	// 				if(user) { 
	// 		      // console.log('saved : '+user);
	// 		      // console.log("==== Remove loggedIn user from userToUnfollow's followers ====")
	// 		      User.findOne({'username': userToUnfollow}, function(err, followee){
	// 		      	// console.log("followee : " + followee);
	// 		      	if(followee){
	// 		      		var index = followee.followers.indexOf(userToUnfollow);
	// 		      		if(index > -1){
	// 		      			followee.followers.splice(index, 1);
	// 			      		followee.save(function(err, aUser){
	// 			      			// console.log("Saved : " + aUser);
	// 			      			return res.send(200);
	// 			      		});
	// 		      		}
	// 		      		// console.log("Saved followee : " + followee);
	// 		      	} else {
	// 		      		return res.send(400);
	// 		      	}
	// 		      });
	// 				} else {
	// 					return res.send(400);
	// 				};
	// 			});
	// 		}
	// 	} else {
	// 		return res.send(404);
	// 	};
	// });
};