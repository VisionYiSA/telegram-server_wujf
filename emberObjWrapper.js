// Check if the current user follows mongoUser
var isFollowed = function(mongoUser, currentUser){
	console.log('=== isFollower ===');
	console.log('mongoUser : '+mongoUser);
	console.log('currentUser : '+currentUser);
	if(mongoUser.followees.indexOf(currentUser)){
		return true;
	} else {
		return false;
	}
};

// Check if mongoUser follows the current user
var isFollower = function(mongoUser, currentUser){
	console.log('=== isFollowed ===');
	console.log('mongoUser : '+mongoUser);
	console.log('currentUser : '+currentUser);
	if(mongoUser.followers.indexOf(currentUser)){
		return true;
	} else {
		return false;
	}
};

exports.emberUser = function(mongoUser, currentUser){
	var user = {
		'id': 			mongoUser.username,
		'username': mongoUser.username,
		'name': 		mongoUser.name,
		'email': 		mongoUser.email,
		'followedByCurrentUser': currentUser ? isFollowed(mongoUser, currentUser) : false,
		'followingCurrentUser':  currentUser ? isFollower(mongoUser, currentUser) : false
	};
	return user;
};

exports.emberPost = function(mongoPost){
	var post = {
    'id':       mongoPost._id,
    'body':     mongoPost.body,
    'user':     mongoPost.user,
    'date':     mongoPost.date
	};
	return post;
}