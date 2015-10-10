import {Users} from 'lab-api-wrapper';
var debug = require('debug')('passport');
var LocalStrategy = require('passport-local').Strategy;

var login = function(req, email, password, callback) {
  var users = new Users(global.apiUrl, global.apiOptions);
  debug('trying to log in user %s', email);
  users.login(email, password)
    .then(result => {
      debug('user logged in', result);
      return callback(null, result.data);
    })
    .catch(err => {
      let message;
      try {
        message = JSON.parse(err.text).data;
      }
      catch(e) {
        message = 'error occured during login';
      }
      console.error(message);
      return callback(null, false, req.flash('loginMessage', message));
    });
};

export default function(passport) {
  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser((user, done) => done(null, user));

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, login));
}
