var passport = require('passport');
require('./passport')(passport);
var User = require('./models/user');
var Post = require('./models/post');