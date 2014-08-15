var mongoose = require('mongoose'),
		config   = require('./config'),
		postModel = require('./models/post'),
		userModel = require('./models/user');
	  logger = require('nlogger').logger(module);

function makeDefaultConnection() {
   var conn = mongoose.createConnection(config.dbHost_dbName, config.port);
   conn.model('User', userModel.userSchema);
   conn.model('Post', postModel.postSchema);
   return conn;
}

module.exports.defaultConnection = makeDefaultConnection();