var conn            = require('../dbconnection').defaultConnection,
    User            = conn.model('User'),
    Post            = conn.model('Post'),
    emberObjWrapper = require('../wrappers/emberObjWrapper'),
    postOperation   = exports,
    logger          = require('nlogger').logger(module);


function getUsers(postAuthorUsernames, authenticatedUser, callback){
  logger.info('In getUsers(), postAuthorUsernames: ', postAuthorUsernames);
  var emberPostAuthors = [];

  User.find({'username': {$in: postAuthorUsernames}}, function(err, users){
    users.forEach(
      function(user){
        logger.info('Each user in postAuthorUsernames: ', user);
        emberPostAuthors.push(emberObjWrapper.emberPostAuthor(user, authenticatedUser));
      }
    )

    logger.info('Return emberPostAuthors: ', emberPostAuthors);

    callback(err, emberPostAuthors); 
  });
}

function getPostsOfOneUser(userId, authenticatedUser, callback){
  logger.info('getPostsOfOneUser in PROCESS');

  var emberUserPosts = [],
      postAuthorUsernames = [];
      
  Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('Posts found: '+posts);

      posts.forEach(
        function(post){
          emberUserPosts.push(emberObjWrapper.emberPost(post));
          logger.info('Each post to push: '+post);
          postAuthorUsernames.push(post.user);
        }
      )
    }
    logger.info('Array of postAuthorUsernames: ', postAuthorUsernames);

    getUsers(postAuthorUsernames, authenticatedUser, function(err, users){
      logger.info('emberUserPosts: ', emberUserPosts, 'Sideloaded users: ', users);

      callback(err, {posts: emberUserPosts, users: users});
    });
    
  });
}

function getPostsOnLoggedIn(authenticatedUser, callback){
  logger.info('getPostsOnLoggedIn in PROCESS');

  var emberUserPosts      = [],
      postAuthorUsernames = [];

  Post.find(
    {$or: 
      [
        {'user': {$in: authenticatedUser.followees}},
        {'user': authenticatedUser.username}
      ]
    }
  ).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('Posts found: ', posts);

      posts.forEach(
        function(post){
          emberUserPosts.push(emberObjWrapper.emberPost(post));
          logger.info('Each post to push to postAuthorUsernames: ', post);
          postAuthorUsernames.push(post.user);
        }
      )
    }
    logger.info('postAuthorUsernames: ',postAuthorUsernames);

    getUsers(postAuthorUsernames, authenticatedUser.username, function(err, users){
      logger.info('emberUserPosts: ', emberUserPosts, 'Sideloaded users: ', users);

      callback(err, {posts: emberUserPosts, users: users});
    });

  });
}

postOperation.getPosts = function(req, res){
  var followeesOf         = req.query.followeesOf,
      authenticatedUser   = req.user,
      userId              = req.query.user,
      emberUserPosts      = [],
      postAuthorUsernames = [],
      emberPostAuthors    = [];

  logger.info('getPosts() in PROCESS');

  if(userId){
    logger.info("At UserRoute of: ", userId);

    getPostsOfOneUser(userId, authenticatedUser.username, function(err, result){
      if(err){
        logger.error('Error on getPostsOfOneUser(): ', err);
        res.send(404);
        
      } else {
        logger.info('result of getPostsOfOneUser(): ', result, ' result.posts: ', result.posts, ' result.users: ', result.users);
        res.send(200, {posts: result.posts, users: result.users});
      }
    });

  } else if(!userId && authenticatedUser.username === followeesOf){
    logger.info("Logged-in at PostsRoute");

    getPostsOnLoggedIn(authenticatedUser, function(err, result){
      if(err){
        logger.error('Error on getPostsOnLoggedIn: ', err);
        res.send(404);
      } else {
        logger.info('result: ', result, 'posts: ', result.posts, 'users: ', result.users);
        res.send(200, {posts: result.posts, users: result.users});
      }
    });

  } else {

    logger.error('Error on getting posts: 404');
    return res.send(404);
  }
};
 
postOperation.publishPost = function(req, res){
  logger.info('Publishing a post in PROCESS');

  var newPost;

  if(req.body.post.originalAuthor){

    newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
      originalAuthor: req.body.post.originalAuthor
    });

    logger.info('Post of repost: ', newPost);

  } else if(req.user.username == req.body.post.user){

    newPost = new Post({
      body: req.body.post.body,
      user: req.body.post.user,
    });

    logger.info('New Post: ', newPost);

  } else {
    logger.error('Error on publishing a post: 403');
    res.send(403);
  }

  newPost.save(function(err, post){
    if(err) logger.error('Error on saving a post: ', err);
    return res.send(200, {post: emberObjWrapper.emberPost(post)});
  });

};
 
postOperation.deletePost =  function(req, res){

  var postToDelete = req.params.post_id,
      query        = {'_id': postToDelete};

  Post.findOneAndRemove(query, function(err, post){
    if(err) logger.error('Error on findOneAndRemove(): ', err);

    post.remove(function(err){
      if(err) {
        logger.error('Error on removing a post: ', err);
      } else {
        logger.info('Successfully deleted a post');
        return res.send(200);
      }
    });

  });
};