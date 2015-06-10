'use strict';

var apiUrl = require('../configs/api').apiUrl;
var debug = require('debug')('api');
var request = require('request');
var _ = require('lodash');
var moment = require('moment');

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
  login: function(req, email, password, callback) {
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
        return callback(err);
      }
      if (!result) {
        return callback(null, false, req.flash('loginMessage', 'No user found.'));
      }
      result = JSON.parse(result);
      if(result.error) {
        return callback(null, false, req.flash('loginMessage', result.data));
      }
      else {
        return callback(null, result.data);
      }
    });
  },
  getItems: function(req, callback) {
    var url = apiUrl + '/items';
    var options = {headers: generateAuthorizationHeader(req.user)};
    debug(options);
    request.get(url, options, (err, response, body) => {
      if(err) {
        console.error(err);
        return callback(err);
      }
      var items = JSON.parse(body);
      if(items.error) {
        err = new Error(items.data);
      }
      else {
        items = items.data;
        debug(items);
      }
      return callback(err, items);
    });
  },
  getUsers: function(req, callback) {
    var options = {
      uri: apiUrl + '/users',
      headers: generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.get(options, (err, response, body) => {
      if(err) {
        console.error(err);
        return callback(err);
      }
      var users = JSON.parse(body);
      if(users.error) {
        err = new Error(users.data);
      }
      else {
        users = _.forEach(users.data, (user) => {
          user.created = moment(user.created).format('MM/DD/YYYY hh:mm:ss');
          user.modified = moment(user.modified).format('MM/DD/YYYY hh:mm:ss');
        });
        debug(users);
      }
      return callback(err, users);
    });
  },
  createUser: function(req, callback) {
    //TODO: validate input
    var options = {
      uri: apiUrl + '/users',
      json: true,
      body: req.body,
      headers: generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.post(options, (err, response, body) => {
      callback(err, body);
    });
  }
};
