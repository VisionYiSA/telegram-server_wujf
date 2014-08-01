var User = require('../models/user');
var Post = require('../models/post');
var emberObjWrapper = require('../wrappers/emberObjWrapper');

exports.getPosts = function(req, res){
  var authenticatedUser = req.user;
  var userId = req.query.user;
  var emberUserPosts = [];
  if(userId && authenticatedUser){
    // At UserRoute
    Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
      if(posts != null) {
        posts.forEach(
          function(post){
            emberUserPosts.push(emberObjWrapper.emberPost(post));
          }
        )
      }
      return res.send(200, {posts: emberUserPosts}); 
    });
  } else if(!userId && authenticatedUser){ // For authenticated user to see posts from followees
    console.log(" ========== !userId && authenticatedUser =========== ");
    Post.find({'user': {$in: authenticatedUser.followees}}).sort({date:-1}).limit(20).exec(function(err, posts){
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
    return res.send(404);
  }
};
 
exports.publishPost = function(req, res){
  if(req.user.username == req.body.post.user){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
 
    newPost.save(function(err, post){
      if(err) return console.log(err);
      return res.send(200, {post: emberObjWrapper.emberPost(post)}); // Not array - singular
    });

  } else {
    res.send(403);
  }
};
 
exports.deletePost =  function(req, res){
  var postToDelete = req.params.post_id;
  Post.findById(postToDelete, function(err, post){
    if(err) console.log(err);
    post.remove(function(err){
      if(err) console.log(err);
      return res.send(200);
    });
  });
};