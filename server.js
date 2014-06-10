var express = require('express');
var app = express();

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

var User = [{
    id: 'will',
    name: 'Will Smith',
    email: 'will@example.com',
    password: 'password',
    avatar: ''
  },{
    id: 'beyonce',
    name: 'Beyonce Knowles',
    email: 'beyonce@example.com',
    password: 'password',
    avatar: ''
  },{
    id: 'joseph',
    name: 'Joseph Gordon-Levitt',
    email: 'joseph@example.com',
    password: 'password',
    avatar: ''
  },{
    id: 'gal',
    name: 'Gal Gagot',
    email: 'gal@example.com',
    password: 'password',
    avatar: ''
  }];

// All Routes
app.get('/', function(req, res){

});
app.post('/', function(req, res){
	User.create({ // This part needs User model in server-side (mongoDB)
		id: req.body.username,
		name: req.body.name,
		eamil: req.body.email,
		password: req.body.password,
		avatar: null
	}, function(err, user){
		if(err) res.send(err);
	});
})
app.get('/login', function(req, res){

});
app.post('/login', function(req, res){
	var eamil = req.body.email;
	var password = req.body.password;
	var theUser = User.find({email: email});
	if(theUser && password == theUser.password){
		res.send(200, {session.user: theUser})
	} else {
		res.send('User credential does not match.');
	}
});
app.get('/resetpassword', function(req, res){
	
});
app.post('/resetpassword', function(req, res){
	var eamil = req.body.email;
	var username = req.body.username;
	var theUser = User.find({email: email});
	if(theUser && username == theUser.id){
		// Send Email
	} else {
		res.send('User credential does not match.');
	}
});
app.get('/sentpassnotify', function(req, res){
	
});

app.get('/posts', function(req, res){
	res.send(200, {posts: Post});
});
app.put('/posts', function(req, res){
	Post.create({ // This part needs Post model in server-side (mongoDB)
		body: req.body,
		user: 'CurrentUser',// Automatically assigns the logged-in user
		date: 'A few seconds ago'// Automatically create date in model
	}, function(err, post){
		if(err) res.send(err);
		Post.find(function(err, posts){
			if(err) res.send(err);
			res.send(200, {posts: Post});
		});
	});
});

app.get('/users/:user_id', function(req, res){
	res.send(200, {user: req.params.user_id});
});
app.get('/users/:user_id/following', function(req, res){
	res.send(200, {user: req.params.user_id});
});
app.get('/users/:user_id/followers', function(req, res){
	res.send(200, {user: req.params.user_id});
});

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});