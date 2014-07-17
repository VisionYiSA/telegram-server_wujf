// Check if the current user follows a user
var isFollower = function(mongoUser, currentUser){
	if(mongoUser.followers.indexOf(currentUser)){
		return true;
	} else {
		return false;
	}
};

// Check if a user follows the current user
var isFollowed = function(mongoUser, currentUser){
	if(mongoUser.followees.indexOf(currentUser)){
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
		'followedByCurrentUser': currentUser ? isFollower(mongoUser, currentUser) : false,
		'followingCurrentUser':  currentUser ? isFollowed(mongoUser, currentUser) : false
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