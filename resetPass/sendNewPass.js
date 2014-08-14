var conn = require('../dbconnection').defaultConnection;
var bcrypt = require('bcrypt'),
    md5    = require('MD5'),
    config = require('../config'),
    User   = conn.model('User'),
    emberObjWrapper = require('../wrappers/emberObjWrapper'),
    logger = require('nlogger').logger(module);

var sendEmail = exports;

function emailTemplate(username, password){
  var htmlMsg = 
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'+
  '<html xmlns="http://www.w3.org/1999/xhtml">'+
    '<body>'+
       '<p>Hey '+ username+',</p>'+
       '<p>You requested to reset the password</p>'+
       '<p>Your new password is: <strong>' + password +'</strong></p>'+
       '<br/>'+
      '<p>All the best,</p>'+
      '<p>The Telegram App Team</p>'+
    '</body>'+
  '</html>';
  return htmlMsg;
}

function newPassword(){
  var newPass = "";
  var letterNumMix = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 10; i++ ){
    newPass += letterNumMix.charAt(Math.floor(Math.random() * letterNumMix.length));
  }
  return newPass;
}

sendEmail.sendNewPass = function(req, res, username, email){
  User.findOne({'username': username}, function(err, user){
    if(user && email == user.email) { 
      var Mailgun = require('mailgun-js');
      var mailgun = new Mailgun({
        apiKey: config.API_KEY, 
        domain: config.DOMAIN
      });
      var newPass = newPassword();
      var data = {
        from: 'Telegram Admin <postmaster@'+config.DOMAIN+'>',
        to: email,
        subject: '[Telegram Admin] - Password Reset',
        html: emailTemplate(username, newPass)
      };

      mailgun.messages().send(data, function (error, body) {
        if(error){
          logger.error('Error on Sending Email via Mailgun: ', error);
          return res.send(500);
        } else {
          logger.info('Mail body: ', body);
          var newMD5Pass = md5(newPass);
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newMD5Pass, salt, function(err, hash) {
              user.password = hash;
              user.save();
              logger.info('Resetting the password for the user = ',emberObjWrapper.emberUser(user));
              return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
            });
          });
        }
      });
    } else {
      logger.error('User not found whom resetting password of');
      return res.send(404);
    }
  });
};