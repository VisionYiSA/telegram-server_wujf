var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport     = require('passport');
var MongoStore   = require('connect-mongostore')(session);

module.exports = function(app) {
  app.use(bodyParser());
  app.use(cookieParser());
  app.use(session({ 
    secret: 'secret_key',
    cookie: {maxAge: 1209600000},
    store: new MongoStore({'db': 'telegram'})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};