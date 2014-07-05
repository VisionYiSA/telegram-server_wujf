var Post = require('./models/post');

exports.getPosts = function(req, res){
  Post.find({}).sort({date:-1}).limit(20).exec(function(err, posts){
    if(err) console.log(err);
    // console.log("======= before emberPosts ========");
    // console.log(posts);
    var emberPosts = [];
    posts.forEach(
      function(post){
        var emberPost = {
          'id':    post._id,
          'body':  post.body,
          'user':  post.user,
          'date':  post.date     
        }
        emberPosts.push(emberPost);
      }
    )
    // console.log("======= After pushed emberPosts ========");
    // console.log(emberPosts);
    return res.send(200, {posts: emberPosts});
  });
};
 
exports.publishPost = function(req, res){
  if(req.user._id == req.body.post.user){
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
      return res.send(200, {post: [emberPost]});
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