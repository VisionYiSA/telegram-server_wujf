var ensureAuth        = require('./authentications/ensureAuthenticated');
var userOperation     = require('./operations/userOperation');
var postOperation     = require('./operations/postOperation');
var userPageOperation = require('./operations/userPageOperation');
    
module.exports = function(app) {
  app.get('/', function(req, res){res.send('Register');});
  app.post('/api/users', userOperation.register);
  app.get('/api/users', userOperation.userQueryHandlers);
  app.get('/api/users/:user_id', userOperation.getUser);
  app.get('/api/logout', userOperation.logout);
  app.get('/api/sentpassnotify', function(req, res){});

  app.put('/api/users/:user_id', userOperation.updateUser);
  app.delete('/api/users/:user_id', userOperation.deleteUser);

  app.get('/api/posts', postOperation.getPosts);
  app.post('/api/posts', ensureAuth, postOperation.publishPost);
  app.delete('/api/posts/:post_id', postOperation.deletePost);

  app.get('/api/follow', userPageOperation.follow);
  app.get('/api/unfollow', userPageOperation.unfollow);
}