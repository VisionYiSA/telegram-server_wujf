var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),

    passport = require('passport'),
    ensureAuthenticated = require('./authentications/ensureAuthenticated'),
    logger = require('nlogger').logger(module),

    // mongoose = require('mongoose'),
    MongoStore = require('connect-mongostore')(session),

    userOperation = require('./operations/userOperation'),
    postOperation = require('./operations/postOperation'),
    userPageOperation = require('./operations/userPageOperation'),
    emberObjWrapper = require('./wrappers/emberObjWrapper'),
    config   = require('./config');
    require('./dbconnection').defaultConnection;

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
app.get('/api/users', userOperation.userQueryHandlers);
app.get('/api/users/:user_id', userOperation.getUser);
app.get('/api/logout', userOperation.logout);

app.get('/api/sentpassnotify', function(req, res){});

app.get('/api/posts', postOperation.getPosts);
app.post('/api/posts', ensureAuthenticated, postOperation.publishPost);
app.delete('/api/posts/:post_id', postOperation.deletePost);

app.get('/api/follow', userPageOperation.follow);
app.get('/api/unfollow', userPageOperation.unfollow);

var server = app.listen(config.port, function(){
  logger.info('Listening on port %d', server.address().port);
});