'use strict';

var debug = require('debug')('admin');
var request = require('request');
var apiUrl = require('../configs/api').apiUrl;
var helper = require('./apiHelper');

module.exports = {
  getApiHealth: function(callback) {
    var options = {
      uri: apiUrl + '/health',
      json: true
    };
    request.get(options, (err, response, body) => callback(err, body));
  },
  audit: function(req, callback) {
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
  }
};

