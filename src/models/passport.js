import wrapper from 'lab-api-wrapper';
var LocalStrategy = require('passport-local').Strategy;

var login = function(req, email, password, callback) {
  var users = new wrapper.Users(global.apiUrl, global.apiOptions);
  console.log('trying to log in user %s', email, global.apiUrl);
  users.login(email, password, (result) => {
    console.log(result);
    if(result.error) {
      console.error('could not log in %s', email);
      return callback(null, false, req.flash('loginMessage', result.data));
    }
    else {
      console.log('xxx', result);
      return callback(null, result.data);
    }
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
