var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');
var Post = require('./models/post');

exports.getUserPosts = function(req, res){
	var userId = req.params.user_id;
  var emberUserPosts = [];
  Post.find({'user': userId}, function(err, posts){
    console.log('====== user posts =======');
    console.log(posts);
    if(posts != null) {
      posts.forEach(
        function(post){
          var emberUserPost = {
            'id':    post._id,
            'body':  post.body,
            'user':  post.user,
            'date':  post.date     
          }
          console.log('===++= emberUserPost ==++===');
          console.log(emberUserPost);
          emberUserPosts.push(emberUserPost);
          console.log('====== emberUserPoststs =======');
          console.log(emberUserPosts);
        }
      )
    }
  });
  return res.send(200, {posts: emberUserPosts}); 
};