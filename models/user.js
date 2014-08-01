var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username:   					 String,
  email:     						 String,
  name:      	  				 String,
  password:   					 String,
  avatar: 							 String, // Uploading photo   
  followees:  					 [{type: String}],
  followers:  					 [{type: String}],
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
