var Post = require('./models/post');

exports.getPosts = function(req, res){
  var userId = req.query.user;
  // console.log(req.query);
  var emberUserPosts = [];
  if(userId){
    Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
      // console.log('====== user posts =======');
      // console.log(posts);
      if(posts != null) {
        posts.forEach(
          function(post){
            var emberUserPost = {
              'id':    post._id,
              'body':  post.body,
              'user':  post.user,
              'date':  post.date     
            }
            // console.log('===++= emberUserPost ==++===');
            // console.log(emberUserPost);
            emberUserPosts.push(emberUserPost);
          }
        )
      }
      // console.log('====== emberUserPoststs =======');
      // console.log(emberUserPosts);
      return res.send(200, {posts: emberUserPosts}); 
    });
  } else {
    Post.find({}).sort({date:-1}).limit(20).exec(function(err, posts){
      // console.log('====== user posts =======');
      // console.log(posts);
      if(posts != null) {
        posts.forEach(
          function(post){
            var emberUserPost = {
              'id':    post._id,
              'body':  post.body,
              'user':  post.user,
              'date':  post.date     
            }
            // console.log('===++= emberUserPost ==++===');
            // console.log(emberUserPost);
            emberUserPosts.push(emberUserPost);
          }
        )
      }
      // console.log('====== emberUserPoststs =======');
      // console.log(emberUserPosts);
      return res.send(200, {posts: emberUserPosts}); 
    });
  }
};
 
exports.publishPost = function(req, res){
  if(req.user.username == req.body.post.user){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
 
    newPost.save(function(err, result){
      if(err) return console.log(err);
      var emberPost = {
          'id':       result._id,
          'body':     result.body,
          'user':     result.user,
          'date':     result.date
        };
      return res.send(200, {post: emberPost}); // Not array - singular
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