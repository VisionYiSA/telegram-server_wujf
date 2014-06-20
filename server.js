var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// =========== Mongoose ===========
mongoose.connect('mongodb://127.0.0.1/telegram', 
  function(err){
    if(err) return console.log(err);
    console.log('***** Connected to MongoDB *****')
});

// Pre-made Data
var Post = [];

// User schema
var userSchema = new mongoose.Schema({
  id:         String,
  email:      String,
  name:       String,
  password:   String
});

var User = mongoose.model('User', userSchema);


// =========== Passport ===========
passport.serializeUser(function(user, done) { // Sets Cookie on login
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { // Check user's cookie
  User.find({'id': id}, function(err, user){
    done(err, user);
  });
});

passport.use('local', new LocalStrategy({
    usernameField: 'id'
  },
  function(username, password, done) {
    User.findOne({
      'id': username
    }, function(err, user){
      if(err){ return done(err); }
      if(!user){ return done(null, false); }
      if(user.password != password){ return done(null, false); }
      return done(null, user);
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { // Check the cookie exists
    return next();
  } else {
    return res.send(403);
  }
}

// =========== Config ===========
app.use(bodyParser());
app.use(cookieParser());
app.use(session({ secret: 'secret_key' }));
app.use(passport.initialize());
app.use(passport.session());

// =========== Register ===========
app.get('/', function(req, res){
  res.send('Register');
});

app.post('/api/users', function(req, res){

  var newUser = new User({
    id: req.body.user.id,
    name: req.body.user.name,
    eamil: req.body.user.email,
    password: req.body.user.password
  });

  newUser.save(function(err, result){
    if(err) return console.log(err);
    return res.send(200, {user: result});
  });
});

// =========== Login ===========
app.get('/login', function(req, res){
  res.send('Login');
});

app.get('/api/users', function(req, res, next){
  var username = req.query.id;
  var password = req.query.password;
  var operation = req.query.operation;
  if(operation == 'login'){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(400); }
      if (!user) { return res.send(400); }
      req.login(user, function(err) { // Set cookie here 
        if (err) { return res.send(400); }
        return res.send(200, {user: [user]});
      });
    })(req, res, next);
  }
});

app.get('/api/users/:user_id', function(req, res){
  var username = req.params.user_id;
  User.find({'id': username}, function(err, result){
    if(err) console.log(err);
    return res.send(200, {user: result});
  });
});
// =========== Logout ===========
app.get('/api/logout', function(req, res){
  console.log('LOGOUT-server');
  req.logout();
  res.send(200);
});
// =========== Others ===========
app.get('/api/resetpassword',  function(req, res){});
app.post('/api/resetpassword', function(req, res){});
app.get('/api/sentpassnotify', function(req, res){});

// =========== GET Posts ===========
app.get('/api/posts', function(req, res){
  res.send(200, {posts: Post});
});

// =========== CREATE post ===========
app.post('/api/posts', ensureAuthenticated, function(req, res){
  if(req.user.id === req.body.post.user){
    var newPostId = Post.length+1;
    var newPost = { 
      id: newPostId,
      body: req.body.post.body,
      user: req.body.post.user,
      date: req.body.post.date
    };
    Post.push(newPost);
    res.send(200, {post: newPost});
  } else {
    res.send(403);
  }
});
// =========== DELETE post ===========
app.delete('/api/posts/:post_id', function(req, res){
  var found = false;
  for(var i=0; i < Post.length ; i++){
    if(postToDelete == Post[i].id){
      found = true;
      Post.splice(Post.indexOf(Post[i]), 1);
      res.send(200);
    }
  } 
  if(found == false) res.send(400);
});

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