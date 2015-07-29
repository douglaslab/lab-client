'use strict';

var debug = require('debug')('users');
var request = require('request');
var moment = require('moment');
var apiUrl = process.env.LAB_API_URL;
var helper = require('./apiHelper');

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
  get: function(req, callback) {
    var options = {
      uri: apiUrl + '/users',
      headers: helper.generateAuthorizationHeader(req.user)
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
        users = users.data.map((user) => {
          user.created = moment(user.created).format('MM/DD/YYYY hh:mm:ss');
          user.modified = moment(user.modified).format('MM/DD/YYYY hh:mm:ss');
          return user;
        });
        debug(users);
      }
      return callback(err, users);
    });
  },
  create: function(req, callback) {
    //TODO: validate input
    var options = {
      uri: apiUrl + '/users',
      json: true,
      body: req.body,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.post(options, (err, response, body) => {
      callback(err, body);
    });
  },
  update: function(req, callback) {
    var options = {
      uri: apiUrl + '/users/' + req.params.email,
      json: true,
      body: req.body,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.put(options, (err, response, body) => callback(err, body));
  },
  delete: function(req, callback) {
    var options = {
      uri: apiUrl + '/users/' + req.params.email,
      json: true,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.del(options, (err, response, body) => callback(err, body));
  }
};
