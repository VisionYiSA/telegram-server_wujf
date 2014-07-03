var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  body: String,
  user: String,
  date: {type: Date, default: Date.now}
});
 
module.exports = mongoose.model('Post', postSchema);
 
