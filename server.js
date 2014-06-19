var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

// =========== Mongoose ===========
mongoose.connect('mongodb://192.168.56.10/telegram', 
  function(err){
    if(err) return handleError(err);
    console.log('***** Connected to MongoDB *****')
});

var schema = new mongoose.Schema({
  _id:        String,
  email:      String,
  name:       String,
  password:   String,
  created_at: {type: Date, default: Date.now}
});

var User = mongoose.model('User', schema);

// =========== Passport ===========
passport.serializeUser(function(user, done) {
  // console.log("Serialize User");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // console.log("Deserialize User");
  User.findById(id, function(err, user){
    done(err, user);
  });

  // for(var i=0; i < User.length ; i++){
  //   if(id === User[i].id){
  //     done(null, User[i]);
  //   }
  // }
});

passport.use('local', new LocalStrategy({
    usernameField: 'id'
  },
  function(username, password, done) {
    User.findOne({
      '_id': username
    }, function(err, user){
      if(err){return done(err);}

      if(!user){
        return done(null, false);
      }

      if(user.password != password){
        return done(null, false);
      }

      return done(null, user);
    });

    // var found = false;
    // for(var i=0; i < User.length ; i++){
    //   if(username === User[i].id && 
    //      password === User[i].password){
    //     found = true;
    //     // console.log('success');
    //     // console.log(User[i]);
    //     return done(null, User[i]);
    //   }
    // }
    // if(found === false){
    //   // console.log('failed');
    //   return done(null, false);
    // }

  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
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


// =========== Fixed Data ===========
var Post = [
  {
    id: 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mini',
    user: 'will',
    date: 'Tue, 06 May 2014 21:03:32 GMT'
  },{
    id: 2,
    body: 'Salut! This is 2nd oldest post, from Joseph!',
    user: 'joseph',
    date: 'Sat, 10 May 2014 21:33:30 GMT'
  },{
    id: 3,
    body: 'Hey everyone, I am Gal Gagot!',
    user: 'gal',
    date: 'Tue, 20 May 2014 22:33:32 GMT'
  },{
    id: 4,
    body: 'What up! This is latest post!',
    user: 'beyonce',
    date: 'Thu, 29 May 2014 23:33:30 GMT'
  }];

var User = [
  {
    id: 'will',
    name: 'Will Smith',
    email: 'will@example.com',
    password: 'password',
    avatar: 'images/will.jpg'
  },{
    id: 'beyonce',
    name: 'Beyonce Knowles',
    email: 'beyonce@example.com',
    password: 'password',
    avatar: 'images/beyonce.jpeg'
  },{
    id: 'joseph',
    name: 'Joseph Gordon-Levitt',
    email: 'joseph@example.com',
    password: 'password',
    avatar: 'images/joseph.jpeg'
  },{
    id: 'gal',
    name: 'Gal Gagot',
    email: 'gal@example.com',
    password: 'password',
    avatar: 'images/gal.jpg'
  }];

// =========== Register ===========
app.get('/', function(req, res){
  res.send('Register');
});

app.post('/api/users', function(req, res){
  var newUser = new User({
    _id: req.body.user.id,
    name: req.body.user.name,
    eamil: req.body.user.email,
    password: req.body.user.password,
    avatar: null
  });
  newUser.save(function(err){
    if(err) return handleError(err);
    console.log("Good");
    res.send(200, {user: newUser});
  });

  // // console.log(req.body.user);
  // var userInfo = {      
  //   id: req.body.user.id,
  //   name: req.body.user.name,
  //   eamil: req.body.user.email,
  //   password: req.body.user.password,
  //   avatar: null
  // };
  // // console.log(userInfo);
  // User.push(userInfo);
  // res.send(200, {user: userInfo});
  // // res.redirect('/api/posts');
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
      req.login(user, function(err) {
        if (err) { return res.send(400); }
        // console.log(user);
        return res.send(200, {user: [user]});
      });
    })(req, res, next);
  }
});

app.get('/api/users/:user_id', function(req, res){
  var username = req.params.user_id;
  var found = false;
  for(var i=0; i < User.length ; i++){
    if(username === User[i].id){
      found = true;
      res.send(200, {user: User[i]});
    }
  } 
  if(found === false){
    res.send(400);
  }
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
  var postToDelete = req.params.post_id;
  // console.log("Delete Post id: "+req.params.post_id);
  var found = false;
  for(var i=0; i < Post.length ; i++){
    if(postToDelete == Post[i].id){
      // console.log("Post body in array: "+Post[i].body);
      found = true;
      Post.splice(Post.indexOf(Post[i]), 1);
      res.send(200);
      // res.redirect('/api/posts');
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