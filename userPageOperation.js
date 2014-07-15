var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');
var Post = require('./models/post');

exports.follow = function(req, res, next){
	// console.log('FOLLOW');
	// console.log(req.query.user);
	// console.log(req.user.username);
	var newFollowing = req.query.user;
	var loggedInUser = req.user.username;
	User.findOne({'username': loggedInUser}, function(err, result){
		// console.log(user);
		if(result) {
			result.followings.push(newFollowing);
			// console.log(user);
			result.save(function(err, user){
				console.log('save : '+user);
				if(user) { 
		      // var emberUser = {
		      //   'id':       user.username, // _id
		      //   'username': user.username,
		      //   'name':     user.name,
		      //   'followings': user.followings
		      // }; 
		      console.log('saved : '+user);
					return res.send(200);
				} else {
					return res.send(400);
				};
			});
		} else {
			return res.send(404);
		};
	});
};

exports.getFollowingUsers = function(req, res){
	// return the followings array
	// var thisUser = req.query.user;
	// var followingUsers = [];
	// User.findOne({'username': thisUser}, function(err, theUser){
	// 	if(theUser){
	// 		theUser.followings.forEach(function(eachUser){
	// 			User.find({'username': eachUser}, function(err, oneUser){
	// 				if(oneUser){
	// 					var emberUser = {
	// 		        'id':       oneUser.username,
	// 		        'username': oneUser.username
	// 					}
	// 					followingUsers.push(emberUser);
	// 				}
	// 			});
	// 		});
	// 		return res.send(200, {users: followingUsers});
	// 	} else {
	// 		return res.send(404);
	// 	}
	// });
	
	var thisUser = req.query.user;
	var emberFollwingUsers = [];
	User.find({'followings': thisUser}, function(err, theUsers){
		if(theUsers){
      theUsers.forEach(
        function(user){
          var theUser = {
            'id':    		 user.username,
            'username':  user.username   
          }
          emberFollwingUsers.push(theUser);
        }
      )
			return res.send(200, {users: emberFollwingUsers});
		} else {
			return res.send(404);
		};
	});
	
};