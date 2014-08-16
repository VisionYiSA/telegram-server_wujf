var conn            = require('../dbconnection').defaultConnection;
var User            = conn.model('User');
var Post            = conn.model('Post');
var emberObjWrapper = require('../wrappers/emberObjWrapper');
var postOperation   = exports;
var logger          = require('nlogger').logger(module);

function getUsers(postAuthorUsernames, authUser, callback){
  logger.info('In getUsers(), postAuthorUsernames: ', postAuthorUsernames);

  var emberPostAuthors = [];

  User.find(
    {$or:[
      {'username': {$in: postAuthorUsernames}}, 
      {'username': authUser}
    ]},
    function(err, users){

      users.forEach(
        function(user){
          logger.info('Each user in postAuthorUsernames: ', user);
          emberPostAuthors.push(emberObjWrapper.emberPostAuthor(user, authUser));
        }
      )
      logger.info('Return emberPostAuthors: ', emberPostAuthors);

      callback(err, emberPostAuthors); 
    }
  );
}

function getPostsOfOneUser(userId, authUser, callback){
  logger.info('getPostsOfOneUser in PROCESS');

  var emberUserPosts = [];
  var postAuthorUsernames = [];
      
  Post.find({'user': userId}).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('Posts found: ', posts);

      posts.forEach(
        function(post){
          emberUserPosts.push(emberObjWrapper.emberPost(post));
          
          logger.info('Each post to push: ', post);
          postAuthorUsernames.push(post.user);
        }
      )
    } else {
      logger.error('No posts found');
    }
    logger.info('Array of postAuthorUsernames: ', postAuthorUsernames);

    getUsers(postAuthorUsernames, authUser, function(err, users){
      logger.info('emberUserPosts: ', emberUserPosts, 'Sideloaded users: ', users);

      callback(err, {posts: emberUserPosts, users: users});
    });
    
  });
}

function getPostsOnLoggedIn(authUser, callback){
  logger.info('getPostsOnLoggedIn in PROCESS');

  var emberUserPosts      = [];
  var postAuthorUsernames = [];

  Post.find(
    {$or:[
      {'user': {$in: authUser.followees}},
      {'user': authUser.username}
    ]}
  ).sort({date:-1}).limit(20).exec(function(err, posts){
    if(posts != null) {
      logger.info('Posts found: ', posts);

      posts.forEach(
        function(post){
          logger.info('Each post to push to postAuthorUsernames: ', post);

          emberUserPosts.push(emberObjWrapper.emberPost(post));
          postAuthorUsernames.push(post.user);
        }
      )
    } else {
      logger.error('No posts found');
    }
    logger.info('postAuthorUsernames: ',postAuthorUsernames);

    getUsers(postAuthorUsernames, authUser.username, function(err, users){
      logger.info('emberUserPosts: ', emberUserPosts, 'Sideloaded users: ', users);

      callback(err, {posts: emberUserPosts, users: users});
    });

  });
}

postOperation.getPosts = function(req, res){

  var followeesOf         = req.query.followeesOf;
  var authUser            = req.user;
  var userId              = req.query.user;
  var emberUserPosts      = [];
  var postAuthorUsernames = [];
  var emberPostAuthors    = [];

  logger.info('getPosts() in PROCESS');

  if(userId){
    logger.info("At UserRoute of: ", userId);

    var authUserUsername = null;
    if(authUser){  
      authUserUsername = authUser.username;
    }

    getPostsOfOneUser(userId, authUserUsername, function(err, result){
      if(err){
        logger.error('Error on getPostsOfOneUser(): ', err);
        res.send(404);
        
      } else {
        logger.info('result of getPostsOfOneUser(): ', result, ' result.posts: ', result.posts, ' result.users: ', result.users);
        res.send(200, {posts: result.posts, users: result.users});
      }
    });

  } else if(!userId && authUser.username === followeesOf){
    logger.info("Logged-in at PostsRoute");

    getPostsOnLoggedIn(authUser, function(err, result){
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

  var newPost = null;

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
    logger.error('Not authorized to publish');
    res.send(403);
  }

  newPost.save(function(err, post){
    if(err) {
      logger.error('Error on saving a post: ', err);
      res.send(500);
    }

    logger.info('Successfully published a post');
    return res.send(200, {post: emberObjWrapper.emberPost(post)});
  });
};
 
postOperation.deletePost =  function(req, res){

  var postToDelete = req.params.post_id;
  var query        = {'_id': postToDelete};

  Post.findOneAndRemove(query, function(err, post){
    if(err) {
      logger.error('Error on findOneAndRemove(): ', err);
      return res.send(404);
    }

    logger.info('Successfully deleted a post');
    return res.send(200);
  });
};