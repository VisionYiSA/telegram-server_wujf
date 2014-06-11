var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());

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
  }];

// All Routes
app.get('/', function(req, res){
	res.send('Register');
});

app.post('/', function(req, res){
	var userInfo = {			
		id: req.body.username,
		name: req.body.name,
		eamil: req.body.email,
		password: req.body.password,
		avatar: ''
	};
	User.push(userInfo);
	res.redirect('/login');
})

app.get('/login', function(req, res){
	res.send('Login');
});

app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(username === User[User.length-1].id && password === User[User.length-1].password){
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
	res.send(200, {posts: Post});
});

app.post('/posts', function(req, res){
	Post.push({ 
		body: req.body.body,
		user: User[User.length-1].id,
		date: new Date()
	});
	res.send(200, {posts: Post});
	res.redirect('/posts')
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