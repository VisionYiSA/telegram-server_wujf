var mongoose = require('mongoose'),
		config   = require('./config'),
		postModel = require('./models/post'),
		userModel = require('./models/user');
	  logger = require('nlogger').logger(module);

exports.createConnection = function(){
	mongoose.connect(config.createConnection, 
	  function(err){
	    if(err) return logger.error(err);
	    console.log('***** Connected to MongoDB *****')
	});
}

exports.model = function(model){
	if(model == 'Post'){
		return mongoose.model('Post', postModel.postSchema);
	} else if(model == 'User'){
		return mongoose.model('User', userModel.userSchema);
	}
}
