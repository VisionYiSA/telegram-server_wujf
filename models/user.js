var mongoose = require('mongoose');

module.exports.userSchema = new mongoose.Schema({
  username:              String,
  email:                 String,
  name:                  String,
  password:              String,
  avatar:                String,
  followees:             [{type: String}],
  followers:             [{type: String}],
  date: {type: Date, default: Date.now}
});