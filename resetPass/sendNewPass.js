var bcrypt = require('bcrypt'),
    config = require('../config'),
    User   = require('../models/user'),
    emberObjWrapper = require('../wrappers/emberObjWrapper');

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

exports.sendNewPass = function(req, res, username, email){
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
          return res.send(500);
        } else {
          console.log(body);
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPass, salt, function(err, hash) {
              user.password = hash;
              user.save();
              // console.log(user);
              return res.send(200, {user: [emberObjWrapper.emberUser(user)]});
            });
          });
        }
      });
    } else {
      console.log('====== User Not Found =======');
      return res.send(404);
    }
  });
};