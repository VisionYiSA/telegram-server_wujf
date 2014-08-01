var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),

    passport = require('passport'),
    ensureAuthenticated = require('./authentications/ensureAuthenticated'),

    mongoose = require('mongoose'),
    MongoStore = require('connect-mongostore')(session),

    User = require('./models/user'),
    Post = require('./models/post'),

    userOperation = require('./operations/userOperation'),
    postOperation = require('./operations/postOperation'),
    userPageOperation = require('./operations/userPageOperation'),
    emberObjWrapper = require('./wrappers/emberObjWrapper');
    // email = require('./email/resetPassword');

mongoose.connect('mongodb://127.0.0.1/telegram', 
  function(err){
    if(err) return console.log(err);
    // console.log('***** Connected to MongoDB *****')
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
app.get('/api/checkLoggedIn', userOperation.checkLoggedInUserExistance);

// =========== Routes ============
app.get('/', function(req, res){res.send('Register');});
app.post('/api/users', userOperation.register);
app.get('/api/login', function(req, res){res.send('Login');});
app.get('/api/users', userOperation.loginOrGetFolloweesOrFollowers);
app.get('/api/users/:user_id', userOperation.getUser);
app.get('/api/logout', userOperation.logout);

app.get('/api/sentpassnotify', function(req, res){});

app.get('/api/posts', postOperation.getPosts);
app.post('/api/posts', ensureAuthenticated, postOperation.publishPost);
app.delete('/api/posts/:post_id', postOperation.deletePost);

app.get('/api/follow', userPageOperation.follow);
app.get('/api/unfollow', userPageOperation.unfollow);

var server = app.listen(3000, function(){
  console.log('Listening on port %d', server.address().port);
});