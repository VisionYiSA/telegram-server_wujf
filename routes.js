var express    = require('express'),
    app        = express(),
    ensureAuth = require('./authentications/ensureAuthenticated'),

    userOperation     = require('./operations/userOperation'),
    postOperation     = require('./operations/postOperation'),
    userPageOperation = require('./operations/userPageOperation'),
    emberObjWrapper   = require('./wrappers/emberObjWrapper');
    
require('./express_config')(app);

module.exports = function(app) {
  app.get('/', function(req, res){res.send('Register');});
  app.post('/api/users', userOperation.register);
  app.get('/api/users', userOperation.userQueryHandlers);
  app.get('/api/users/:user_id', userOperation.getUser);
  app.get('/api/logout', userOperation.logout);

  app.get('/api/sentpassnotify', function(req, res){});

  app.get('/api/posts', postOperation.getPosts);
  app.post('/api/posts', ensureAuth, postOperation.publishPost);
  app.delete('/api/posts/:post_id', postOperation.deletePost);

  app.get('/api/follow', userPageOperation.follow);
  app.get('/api/unfollow', userPageOperation.unfollow);
}