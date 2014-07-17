var Post = require('./models/post');
var emberObjWrapper = require('./emberObjWrapper');

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
            // var emberUserPost = {
            //   'id':    post._id,
            //   'body':  post.body,
            //   'user':  post.user,
            //   'date':  post.date     
            // }
            // console.log('===++= emberUserPost ==++===');
            // console.log(emberUserPost);
            emberUserPosts.push(emberObjWrapper.emberPost(post));
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
            // var emberUserPost = {
            //   'id':    post._id,
            //   'body':  post.body,
            //   'user':  post.user,
            //   'date':  post.date     
            // }
            // console.log('===++= emberUserPost ==++===');
            // console.log(emberUserPost);
            emberUserPosts.push(emberObjWrapper.emberPost(post));
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
  // console.log(req.user.username);
  // console.log(req.body.post.user);
  if(req.user.username == req.body.post.user){
    var newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });
 
    newPost.save(function(err, post){
      if(err) return console.log(err);
      // var emberPost = {
      //     'id':       post._id,
      //     'body':     post.body,
      //     'user':     post.user,
      //     'date':     post.date
      //   };
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