var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    MongoStore = require('connect-mongostore')(session);

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