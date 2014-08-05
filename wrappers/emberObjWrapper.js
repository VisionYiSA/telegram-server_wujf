// Check if the current user follows mongoUser
// (Check if mongoUser is followed by current user)
function isCurrentUserFollowing(mongoUser, currentUser){
	console.log(' ');
	console.log('=== is '+mongoUser.username+' Followed by '+currentUser+' ? ===');
	if(mongoUser.followers.indexOf(currentUser) >= 0){
		console.log('TRUE!');
		return true;
	} else {
		console.log('NO!');
		return false;
	}
};

// Check if mongoUser follows the current user
// (Check if current user is followed by mongoUser)
var isCurrentUserFollowed = function(mongoUser, currentUser){
	console.log(' ');
	console.log('=== is '+mongoUser.username+' Following '+currentUser+' ? ===');
	if(mongoUser.followees.indexOf(currentUser) >= 0){
		console.log('TRUE!');
		return true;
	} else {
		console.log('NO!');
		return false;
	}
};

var emberWrapper = exports;

emberWrapper.emberUser = function(mongoUser, currentUser){
	var user = {
		'id': 			mongoUser.username,
		'username': mongoUser.username,
		'name': 		mongoUser.name,
		'email': 		mongoUser.email,
		'avatar': 	mongoUser.avatar,
		'followedByCurrentUser': currentUser ? isCurrentUserFollowing(mongoUser, currentUser): false,
		'followingCurrentUser':  currentUser ? isCurrentUserFollowed(mongoUser, currentUser) : false
	};
	return user;
};

emberWrapper.emberPost = function(mongoPost){
	var post = {
    'id':       mongoPost._id,
    'body':     mongoPost.body,
    'user':     mongoPost.user,
    'date':     mongoPost.date
	};
	return post;
}