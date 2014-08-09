var conn = require('../dbconnection').defaultConnection,
    User = conn.model('User'),
    Post = conn.model('Post'),
    emberObjWrapper = require('../wrappers/emberObjWrapper'),
    postOperation = exports,
    logger = require('nlogger').logger(module);

postOperation.getPosts = function(req, res){
  var followeesOf = req.query.followeesOf;
  var authenticatedUser = req.user;
  var userId = req.query.user;
  var emberUserPosts = [];
  var postAuthorUsernames = [];
  var emberPostAuthors = [];

  logger.info('==+++ getPosts +++==');
  if(userId){
    // At UserRoute
    logger.info(" ========== userId =========== ");
    Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
      if(posts != null) {
        posts.forEach(
          function(post){
            emberUserPosts.push(emberObjWrapper.emberPost(post));
            // logger.info(post);
            postAuthorUsernames.push(post.user);
          }
        )
      }
      logger.info(postAuthorUsernames);
      User.find({'username': {$in: postAuthorUsernames}}, function(err, users){
        users.forEach(
          function(user){
            logger.info(user);
            emberPostAuthors.push(emberObjWrapper.emberPostAuthor(user));
          }
        )
        return res.send(200, {posts: emberUserPosts, users: emberPostAuthors}); 
      });
      
    });
  } else if(!userId && authenticatedUser.username === followeesOf){ // For authenticated user to see posts from followees
    logger.info(" ========== !userId && authenticatedUser =========== ");
    Post.find(
      {$or: 
        [
          {'user': {$in: authenticatedUser.followees}},
          {'user': authenticatedUser.username}
        ]
      }
    ).sort({date:-1}).limit(20).exec(function(err, posts){
      if(posts != null) {
        // logger.info('posts: '+posts);
        posts.forEach(
          function(post){
            emberUserPosts.push(emberObjWrapper.emberPost(post));
            // logger.info(post);
            postAuthorUsernames.push(post.user);
          }
        )
      }
      logger.info(postAuthorUsernames);
      User.find({'username': {$in: postAuthorUsernames}}, function(err, users){
        users.forEach(
          function(user){
            logger.info(user);
            emberPostAuthors.push(emberObjWrapper.emberPostAuthor(user));
          }
        )
        return res.send(200, {posts: emberUserPosts, users: emberPostAuthors});
      });

    });
  } else {
    logger.error('404');
    return res.send(404);
  }
};
 
postOperation.publishPost = function(req, res){
  logger.info('==== publishPost ====');
  logger.info('req.body.post.originalAuthor '+req.body.post.originalAuthor);

  if(req.body.post.originalAuthor){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
      originalAuthor: req.body.post.originalAuthor
    });
    logger.info('newPost: '+newPost);
    newPost.save(function(err, post){
      if(err) return logger.error(err);
      return res.send(200, {post: emberObjWrapper.emberPost(post)}); // Not array - singular
    });
  } else if(req.user.username == req.body.post.user){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
    logger.info('newPost: '+newPost);
    newPost.save(function(err, post){
      if(err) return logger.error(err);
      return res.send(200, {post: emberObjWrapper.emberPost(post)}); // Not array - singular
    });

  } else {
    logger.error('403');
    res.send(403);
  }


};
 
postOperation.deletePost =  function(req, res){
  var postToDelete = req.params.post_id;
  logger.info(' Deleting this post id: '+postToDelete)
  Post.findById(postToDelete, function(err, post){
    if(err) logger.error(err);
    post.remove(function(err){
      if(err) logger.error(err);
      return res.send(200);
    });
  });
};