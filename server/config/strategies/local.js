/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

/**
 * Expose
 */
module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({email: email}, function(err, user) {

      if (err){
        return done(err);
      }

      if (!user){
        return done(null, false, {message: 'Unknown user'});
      }

      if (!user.validatePassword(password)){
        return done(null, false, {message: 'Invalid password'});
      }
      
      return done(null, user);
    });
  }
);
