var conn = require('../dbconnection'),
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

  if(userId){
    // At UserRoute
    Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
      if(posts != null) {
        posts.forEach(
          function(post){
            emberUserPosts.push(emberObjWrapper.emberPost(post));
          }
        )
      }
      logger.info(emberUserPosts);
      return res.send(200, {posts: emberUserPosts}); 
    });
  } else if(!userId && authenticatedUser.username === followeesOf){ // For authenticated user to see posts from followees
    console.log(" ========== !userId && authenticatedUser =========== ");
    Post.find(
      {$or: 
        [
          {'user': {$in: authenticatedUser.followees}},
          {'user': authenticatedUser.username}
        ]
      }
    ).sort({date:-1}).limit(20).exec(function(err, posts){
      if(posts != null) {
        posts.forEach(
          function(post){
            emberUserPosts.push(emberObjWrapper.emberPost(post));
          }
        )
      }
      return res.send(200, {posts: emberUserPosts}); 
    });
  } else {
    logger.error('404');
    return res.send(404);
  }
};
 
postOperation.publishPost = function(req, res){
  if(req.user.username == req.body.post.user){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
 
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
  Post.findById(postToDelete, function(err, post){
    if(err) console.log(err);
    post.remove(function(err){
      if(err) logger.error(err);
      return res.send(200);
    });
  });
};