'use strict';

var debug = require('debug')('admin');
var request = require('request');
var apiUrl = process.env.LAB_API_URL;
var helper = require('./apiHelper');

module.exports = {
  getApiHealth: function(callback) {
    var options = {
      uri: apiUrl + '/health',
      json: true
    };
    request.get(options, (err, response, body) => callback(err, body));
  },
  getLog: function(req, callback) {
    var url = apiUrl + '/admin/audit';
    var options = {headers: helper.generateAuthorizationHeader(req.user)};
    debug(options);
    request.get(url, options, (err, response, body) => {
      if(err) {
        console.error(err);
        return callback(err);
      }
      var log = JSON.parse(body);
      if(log.error) {
        err = new Error(log.data);
      }
      else {
        log = log.data;
        debug(log);
      }
      return callback(err, log);
    });
  },
  getPermissions: function(req, callback) {
    var url = apiUrl + '/admin/permissions';
    var options = {headers: helper.generateAuthorizationHeader(req.user)};
    debug(options);
    request.get(url, options, (err, response, body) => {
      if(err) {
        console.error(err);
        return callback(err);
      }
      var permissions = JSON.parse(body);
      if(permissions.error) {
        err = new Error(permissions.data);
      }
      else {
        permissions = permissions.data;
        debug(permissions);
      }
      return callback(err, permissions);
    });
  },
  createPermission: function(req, callback) {
    //TODO: validate input
    var options = {
      uri: apiUrl + '/admin/permissions',
      json: true,
      body: req.body,
      headers: helper.generateAuthorizationHeader(req.user)
    };
    debug(options);
    request.post(options, (err, response, body) => {
      callback(err, body);
    });
  }
};

