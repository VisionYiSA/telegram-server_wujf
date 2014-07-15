var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username:   					 String,
  email:     						 String,
  name:      	  				 String,
  password:   					 String,
  avatar: 							 String, // Uploading photo 
  followedByCurrentUser: {type: Boolean, default: false},
  followings:  					 [{type: String}],
  followers:  					 [{type: String}]
});

module.exports = mongoose.model('User', userSchema);
