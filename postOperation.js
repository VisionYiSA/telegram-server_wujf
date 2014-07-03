var Post = require('./models/post');

exports.getPosts = function(req, res){
  Post.find({}).sort({date:-1}).limit(20).exec(function(err, posts){
    if(err) console.log(err);
    console.log(posts);
    return res.send(200, {posts: posts});
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
      return res.send(200, {post: result});
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