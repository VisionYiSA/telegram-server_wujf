var mongoose = require('mongoose');

module.exports.postSchema = new mongoose.Schema({
  body: String,
  user: String,
  date: {type: Date, default: Date.now}
}); 
