var logger = require('nlogger').logger(module);

function isCurrentUserFollowing(mongoUser, currentUser){
	logger.info('Is ',mongoUser.username,' Followed by ',currentUser,' ?');
	
	if(mongoUser.followers.indexOf(currentUser) >= 0){
		logger.info('isCurrentUserFollowing?: True')
		return true;
	} else {
		logger.error('isCurrentUserFollowing?: false');
		return false;
	}
};

var isCurrentUserFollowed = function(mongoUser, currentUser){
	logger.info('Is ',mongoUser.username,' Following ',currentUser,' ?');

	if(mongoUser.followees.indexOf(currentUser) >= 0){
		logger.info('isCurrentUserFollowed?: True')
		return true;
	} else {
		logger.info('isCurrentUserFollowed?: False')
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
	logger.info('emberUser: ',user);
	return user;
};

emberWrapper.emberPost = function(mongoPost){
	logger.info('mongoPost in emberPost func: ',mongoPost);

	var post = {
    'id':       mongoPost._id,
    'body':     mongoPost.body,
    'user':     mongoPost.user,
    'date':     mongoPost.date,
    'originalAuthor': mongoPost.originalAuthor
	};
	logger.info('emberPost: ',post);
	return post;
};

emberWrapper.emberPostAuthor = function(mongoUser, currentUser){
	logger.info('mongoUser in emberPostAuthor func: ',mongoUser);

	var postUser = {
		'id': 			mongoUser.username,
		'username': mongoUser.username,
		'name': 		mongoUser.name,
		'email': 		mongoUser.email,
		'avatar': 	mongoUser.avatar,
		'followedByCurrentUser': currentUser ? isCurrentUserFollowing(mongoUser, currentUser): false,
		'followingCurrentUser':  currentUser ? isCurrentUserFollowed(mongoUser, currentUser) : false
	};
	logger.info('emberPostAuthor ',postUser);
	return postUser;
};