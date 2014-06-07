var express = require('express');
var app = express('express');

var User = require('../telegram-cli/app/models/user')

app.get('/', function(req, res){
	User.find(function(err, users){
		if(err) res.send(err);
		res.json(users);
	});
});
app.get('/login');
app.get('/resetpassword');
app.get('/sentpassnotify');

app.get('/posts');
app.get('/users/:user_id');
app.get('/users/:user_id/following');
app.get('/users/:user_id/followers');

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});