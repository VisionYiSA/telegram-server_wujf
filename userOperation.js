var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');
var Post = require('./models/post');

exports.register = function(req, res){
  var newUser = new User({
    username: req.body.user.username,
    name: req.body.user.name,
    eamil: req.body.user.email,
    password: req.body.user.password
  });

  newUser.save(function(err, result){
    if(err) return console.log(err);
    var emberUser = {
      'id':       result.username, // _id
      'username': result.username,
      'name':     result.name,
      'email':    result.email
    };
    return res.send(200, {user: emberUser});
  });
};

exports.login = function(req, res, next){
  var username  = req.query.username;
  var password  = req.query.password;
  var operation = req.query.operation;

  if(operation == 'login'){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(400); }
      if (!user) { return res.send(400); }
      req.login(user, function(err) { // Set cookie here 
        if (err) { return res.send(400); }
        var emberUser = {
          'id':       user.username, // _id
          'username': user.username,
          'name':     user.name,
          'email':    user.email
        };   
        return res.send(200, {user: [emberUser]});
      });
    })(req, res, next);
  }
};

exports.getUser = function(req, res){
  var userId = req.params.user_id;
  User.findOne({'username': userId}, function(err, result){
    // console.log('====== result =======');
    // console.log(result);
    if(result != null) {
      var emberUser = {
        'id':       result.username, // _id
        'username': result.username,
        'name':     result.name,
        'email':    result.email
      }; 
      return res.send(200, {user: emberUser});   
    } else {
      return res.send(404);
    }
  });

  Post.find({'user': userId}, function(err, posts){
    if(result != null) {
      var emberUserPosts = [];
      posts.forEach(
        function(post){
          var emberUserPost = {
            'id':    post._id,
            'body':  post.body,
            'user':  post.user,
            'date':  post.date     
          }
          emberUserPosts.push(emberUserPost);
        }
      )
      return res.send(200, {posts: emberPosts});   
    } else {
      return res.send(404);
    }
  });
};

exports.logout = function(req, res){
  req.logout();
  res.send(200);
};