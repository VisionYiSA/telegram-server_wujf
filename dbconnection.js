var mongoose = require('mongoose'),
		config   = require('./config'),
		postModel = require('./models/post'),
		userModel = require('./models/user');

exports.createConnection = function(){
	mongoose.connect(config.createConnection, 
	  function(err){
	    if(err) return console.log(err);
	    console.log('***** Connected to MongoDB *****')
	});
}

exports.model = function(model){
	if(model == 'Post'){
		mongoose.model('Post', postModel.postSchema);
	} else if(model == 'User'){
		mongoose.model('User', userModel.userSchema);
	}
}
