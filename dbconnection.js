var mongoose  = require('mongoose');
var config    = require('./config');
var postModel = require('./models/post');
var userModel = require('./models/user');
var logger    = require('nlogger').logger(module);

function makeDefaultConnection() {
   var conn = mongoose.createConnection(config.dbHost_dbName, config.port);
   conn.model('User', userModel.userSchema);
   conn.model('Post', postModel.postSchema);
   return conn;
}

module.exports.defaultConnection = makeDefaultConnection();