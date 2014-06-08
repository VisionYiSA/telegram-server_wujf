var express = require('express');
var app = express('express');

var User = require('../telegram-cli/app/models/user');
var Post = require('../telegram-cli/app/models/post');

// All Routes
app.get('/', function(req, res){

});
app.get('/login', function(req, res){

});
app.get('/resetpassword', function(req, res){
	
});
app.get('/sentpassnotify', function(req, res){
	
});

app.get('/posts', function(req, res){
	
});

app.get('/users/:user_id', function(req, res){

});
app.get('/users/:user_id/following', function(req, res){
	
});
app.get('/users/:user_id/followers', function(req, res){
	
});

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});