var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

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
	res.send("\
		<form method='post' action='/'>\
			<input type='text' name='email' placeholder='email'/>\
			<input type='text' name='name' placeholder='name'/>\
			<input type='text' name='username' placeholder='username'/>\
			<input type='password' name='password' placeholder='password'/>\
			<input type='submit' value='Submit' />\
		</form>\
	");
});
app.post('/', function(req, res){
	console.log(req.body);
	console.log(JSON.stringify(req.body));
	var userInfo = {			
		id: req.body.username,
		name: req.body.name,
		eamil: req.body.email,
		password: req.body.password,
		avatar: ''
	};
	User.push(userInfo);
	res.send(200, {user: userInfo});
	// res.redirect('/posts');
})
app.get('/login', function(req, res){
	res.send("\
		<form method='post' action='/login'>\
			<input type='text' name='username' placeholder='username'/>\
			<input type='password' name='password' placeholder='password'/>\
			<input type='submit' value='Login' />\
		</form>\
	");
});
app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var theUser = {
		id: 'will',
    name: 'Will Smith',
    email: 'will@example.com',
    password: 'password',
    avatar: ''};
	if(username == theUser.username && password == theUser.password){
		res.redirect('/posts');
	} else {
		res.send('User credential does not match.');
	}
});
app.get('/resetpassword', function(req, res){
	
});
app.post('/resetpassword', function(req, res){

});
app.get('/sentpassnotify', function(req, res){
	
});

app.get('/posts', function(req, res){
	res.send("\
		<form method='post' action='/posts'>\
			<input type='text' name='body' placeholder='body'/>\
			<input type='submit' value='Publish' />\
		</form>\
		<div>Body: "+Post[Post.length-1].body+"</div>\
	");
	// res.send(200, {posts: Post});
});
app.post('/posts', function(req, res){
	Post.push({ 
		body: req.body.body,
		user: 'CurrentUser',
		date: 'A few seconds ago'
	});
	res.send(200, {posts: Post});
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