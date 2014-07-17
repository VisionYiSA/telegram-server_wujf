var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport');
var ensureAuthenticated = require('./ensureAuthenticated');

var mongoose = require('mongoose');
var MongoStore = require('connect-mongostore')(session);

var User = require('./models/user');
var Post = require('./models/post');

var userOperation = require('./userOperation');
var postOperation = require('./postOperation');
var userPageOperation = require('./userPageOperation');

mongoose.connect('mongodb://127.0.0.1/telegram', 
  function(err){
    if(err) return console.log(err);
    console.log('***** Connected to MongoDB *****')
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


// ==== beforeModel Check if authenticated user exists ====
app.get('/api/checkLoggedIn', function(req, res){
  // console.log('req.user: ' + req.user);
  // console.log('Before req.user : isAuthenticated = ' + req.isAuthenticated());
  if (req.user){
    // console.log('Inside if: ' + req.user);
    var emberUser = {
      'id': req.user.username,
      'username': req.user.username,
      'name' : req.user.name,
      'email' : req.user.email
    }
    return res.send(200, {user: emberUser});
  } else {
    // console.log(req);
    return res.send(200, {user: null});
  }
});

// =========== Routes ============
app.get('/', function(req, res){res.send('Register');});
app.post('/api/users', userOperation.register);
app.get('/api/login', function(req, res){res.send('Login');});
app.get('/api/users', userOperation.loginOrGetFolloweesOrFollowers);
app.get('/api/users/:user_id', userOperation.getUser);
app.get('/api/logout', userOperation.logout);

app.get('/api/resetpassword',  function(req, res){});
app.post('/api/resetpassword', function(req, res){});
app.get('/api/sentpassnotify', function(req, res){});

app.get('/api/posts', postOperation.getPosts);
app.post('/api/posts', ensureAuthenticated, postOperation.publishPost);
app.delete('/api/posts/:post_id', postOperation.deletePost);

app.get('/api/follow', userPageOperation.follow);
// app.get('/api/users/:user_id/following', userPageOperation.getFollowingUsers);
// app.get('/api/users/:user_id/followers', userPageOperation.getFollowers);

var server = app.listen(3000, function(){
  console.log('Listening on port %d', server.address().port);
});