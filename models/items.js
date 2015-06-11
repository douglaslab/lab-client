'use strict';

var debug = require('debug')('users');
var request = require('request');
var apiUrl = require('../configs/api').apiUrl;
var helper = require('./apiHelper');

module.exports = {
  get: function(req, callback) {
    var url = apiUrl + '/items';
    var options = {headers: helper.generateAuthorizationHeader(req.user)};
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
  create: function(req, callback) {
    //TODO: validate input
    var options = {
      uri: apiUrl + '/items',
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
      uri: apiUrl + '/items/' + req.params.id + (req.params.replace ? '/true' : ''),
      json: true,
      body: req.body,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.put(options, (err, response, body) => callback(err, body));
  },
  delete: function(req, callback) {
    var options = {
      uri: apiUrl + '/items/' + req.params.id,
      json: true,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.del(options, (err, response, body) => callback(err, body));
  }
};
