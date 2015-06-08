'use strict';

var apiUrl = require('../configs/api').apiUrl;
var debug = require('debug')('api');
var request = require('request');

var generateAuthorizationHeader = function(user) {
  var util = require('util');
  var crypto = require('crypto');
  var timestamp = parseInt(Date.now() / 1000, 10);
  var hmac = crypto.createHmac('sha1', user.apiSecret).update(user.apiKey).digest('hex');
  var token = crypto.createHash('md5').update(hmac + timestamp).digest('hex');
  return {
    'X-API-Authorization': util.format('key=%s, token=%s, ts=%s', user.apiKey, token, timestamp)
  };
};

module.exports = {
  login: function(req, email, password, done) {
    debug('trying to log in user %s', email);
    var url = apiUrl + '/users/login';
    var options = {
      'auth': {
        'user': email,
        'pass': password,
        'sendImmediately': true
      }
    };
    request.post(url, options, (err, response, result) => {
      if(err) {
        console.error(err);
        return done(err);
      }
      if (!result) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      result = JSON.parse(result);
      if(result.error) {
        return done(null, false, req.flash('loginMessage', result.data));
      }
      else {
        return done(null, result.data);
      }
    });
  },
  getItems: function(req, done) {
    var url = apiUrl + '/items';
    var options = {headers: generateAuthorizationHeader(req.user)};
    debug(options);
    request.get(url, options, (err, response, body) => {
      if(err) {
        console.error(err);
        return done(err);
      }
      var items = JSON.parse(body);
      if(items.error) {
        err = items.data;
      }
      else {
        items = items.data;
        debug(items);
      }
      return done(err, items);
    });
  }
};
