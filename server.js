var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// require('./authentication')(passport);
var ensureAuthenticated = require('./ensureAuthenticated');

var mongoose = require('mongoose');
var MongoStore = require('connect-mongostore')(session);

var User = require('./models/user');
var Post = require('./models/post');

var userOperation = require('./userOperation');
var postOperation = require('./postOperation');

mongoose.connect('mongodb://127.0.0.1/telegram', 
  function(err){
    if(err) return console.log(err);
    console.log('***** Connected to MongoDB *****')
});

// ==== beforeModel Check if authenticated user exists ====
app.get('/api/checkLoggedIn', function(req, res){
  // console.log('req.user: ' + req.user);
  // console.log('Before req.user : isAuthenticated = ' + req.isAuthenticated());
  if (req.user){
    // console.log('Inside if: ' + req.user);
    return res.send(200, {user: [req.user]});
  } else {
    // console.log(req);
    return res.send(200, {user: null});
  }
});

// =========== Config ===========
app.use(bodyParser());
app.use(cookieParser());
app.use(session({ 
  secret: 'secret_key',
  cookie: {maxAge: 1209600000},
  store: new MongoStore({'db': 'telegram'})
}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/', function(req, res){res.send('Register');});
app.post('/api/users', userOperation.register);
app.get('/api/login', function(req, res){res.send('Login');});
app.get('/api/users', userOperation.login);
app.get('/api/users/:user_id', userOperation.getUser);
app.get('/api/logout', userOperation.logout);

app.get('/api/resetpassword',  function(req, res){});
app.post('/api/resetpassword', function(req, res){});
app.get('/api/sentpassnotify', function(req, res){});


// var Post = [];
// =========== GET Posts ===========
// app.get('/api/posts', function(req, res){ res.send(200, {posts: Post});});

// app.post('/api/posts', ensureAuthenticated, function(req, res){
//   // console.log('CreatePost: ' + req.user);
//   // console.log('req.body.post.user: ' + req.body.post.user);

//   // console.log("Before id is matched");
//   // console.log(req.user._id == req.body.post.user);

//   if(req.user._id == req.body.post.user){

//     // console.log("id is matched");

//     var newPostId = Post.length+1;
//     var newPost = { 
//       id: newPostId,
//       body: req.body.post.body,
//       user: req.body.post.user,
//       date: req.body.post.date
//     };
//     Post.push(newPost);
//     res.send(200, {post: newPost});
//   } else {
//     res.send(403);
//   }
// });

// app.delete('/api/posts/:post_id', function(req, res){
//   var found = false;
//   for(var i=0; i < Post.length ; i++){
//     if(postToDelete == Post[i].id){
//       found = true;
//       Post.splice(Post.indexOf(Post[i]), 1);
//       res.send(200);
//     }
//   } 
//   if(found == false) res.send(400);
// });


app.get('/api/posts', postOperation.getPosts);
app.post('/api/posts', ensureAuthenticated, postOperation.publishPost);
app.delete('/api/posts/:post_id', postOperation.deletePost);

// =========== User page ===========
app.get('/api/users/:user_id/following', function(req, res){
  res.send(200, {user: req.params.user_id});
});

app.get('/api/users/:user_id/followers', function(req, res){
  res.send(200, {user: req.params.user_id});
});

var server = app.listen(3000, function(){
  console.log('Listening on port %d', server.address().port);
});