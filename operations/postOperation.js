var conn = require('../dbconnection').defaultConnection,
    User = conn.model('User'),
    Post = conn.model('Post'),
    emberObjWrapper = require('../wrappers/emberObjWrapper'),
    postOperation = exports,
    logger = require('nlogger').logger(module);


function getUsers(postAuthorUsernames, callback){
  logger.info('postAuthorUsernames: '+postAuthorUsernames);
  var emberPostAuthors = [];
  User.find({'username': {$in: postAuthorUsernames}}, function(err, users){
    users.forEach(
      function(user){
        logger.info(user);
        emberPostAuthors.push(emberObjWrapper.emberPostAuthor(user));
      }
    )
    logger.info('Return callback in getUsers');
    logger.info('emberPostAuthors: '+emberPostAuthors);
    callback(err, emberPostAuthors); 
  });
}

function getPostsOfOneUser(userId, callback){
  logger.info('getPostsOfOneUser in PROCESS');
  var emberUserPosts = [],
      postAuthorUsernames = [];
      
  Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('posts found: '+posts);
      posts.forEach(
        function(post){
          emberUserPosts.push(emberObjWrapper.emberPost(post));
          logger.info('each post to push: '+post);
          postAuthorUsernames.push(post.user);
        }
      )
    }
    logger.info(postAuthorUsernames);
    getUsers(postAuthorUsernames, function(err, users){
      logger.info('emberUserPosts: '+emberUserPosts);
      logger.info('users: '+users);
      callback(err, {posts: emberUserPosts, users: users});
    });
    
  });
}

function getPostsOnLoggedIn(authenticatedUser, callback){
  logger.info('getPostsOnLoggedIn in PROCESS');
  var emberUserPosts = [],
      postAuthorUsernames = [];

  Post.find(
    {$or: 
      [
        {'user': {$in: authenticatedUser.followees}},
        {'user': authenticatedUser.username}
      ]
    }
  ).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('posts found: '+posts);
      posts.forEach(
        function(post){
          emberUserPosts.push(emberObjWrapper.emberPost(post));
          logger.info('each post to push: '+post);
          postAuthorUsernames.push(post.user);
        }
      )
    }
    logger.info(postAuthorUsernames);
    getUsers(postAuthorUsernames, function(err, users){
      logger.info('emberUserPosts: '+emberUserPosts);
      logger.info('users: '+users);
      callback(err, {posts: emberUserPosts, users: users});
    });

  });
}

postOperation.getPosts = function(req, res){
  var followeesOf = req.query.followeesOf;
  var authenticatedUser = req.user;
  var userId = req.query.user;
  var emberUserPosts = [];
  var postAuthorUsernames = [];
  var emberPostAuthors = [];

  logger.info('GET Posts PROCESS');
  if(userId){
    // At UserRoute
    logger.info("At an User Route, user: " + userId);

    getPostsOfOneUser(userId, function(err, result){
      if(err){
        logger.error('Error on getPostsOfOneUser: '+err);
        res.send(404);
      } else {
        logger.info('result = '+ result);
        logger.info('posts: '+result.posts);
        logger.info('users: '+result.users);
        res.send(200, {posts: result.posts, users: result.users});
      }
    });
  } else if(!userId && authenticatedUser.username === followeesOf){ // For authenticated user to see posts from followees
    logger.info("Logged-in & at /posts/ to see posts");

    getPostsOnLoggedIn(authenticatedUser, function(err, result){
      if(err){
        logger.error('Error on getPostsOnLoggedIn: '+err);
        res.send(404);
      } else {
        logger.info('result = '+ result);
        logger.info('posts: '+result.posts);
        logger.info('users: '+result.users);
        res.send(200, {posts: result.posts, users: result.users});
      }
    });
  } else {
    logger.error('Error on getting posts: 404');
    return res.send(404);
  }
};
 
postOperation.publishPost = function(req, res){
  logger.info('Publishing a post PROCESS');
  logger.info('req.body.post.originalAuthor '+req.body.post.originalAuthor);
  var newPost;

  if(req.body.post.originalAuthor){
    newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
      originalAuthor: req.body.post.originalAuthor
    });
    logger.info('newPost: '+newPost);
  } else if(req.user.username == req.body.post.user){
    newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
    logger.info('newPost: '+newPost);
  } else {
    logger.error('Error on publishing a post: 403');
    res.send(403);
  }

  newPost.save(function(err, post){
    if(err) return logger.error('Error on saving a post: '+err);
    return res.send(200, {post: emberObjWrapper.emberPost(post)}); // Not array - singular
  });
};
 
postOperation.deletePost =  function(req, res){
  var postToDelete = req.params.post_id;
  logger.info(' Deleting this post id: '+postToDelete)
  var query  = {'_id': postToDelete};
  Post.findOneAndRemove(query, function(err, post){
    if(err) logger.error('Cannot find the post to remove: '+err);
    post.remove(function(err){
      if(err) {
        logger.error('Removing a post error: '+err);
      } else {
        logger.info('Successfully deleted a post');
        return res.send(200);
      }
    });
  });
};