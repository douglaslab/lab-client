/* eslint-disable no-unused-vars */
'use strict';

var Helper = {
  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  isAdmin: function(req, res, next) {
    if(req.user.permissionLevel === 'ADMIN') {
      return next();
    }
    else {
      Helper.handleError(new Error('Permission denied - must be admin'), req, res);
    }
  },
  isManager: function(req, res, next) {
    if(req.user.permissionLevel === 'ADMIN' || req.permissionLevel === 'MANAGER') {
      return next();
    }
    else {
      Helper.handleError(new Error('Permission denied - must be manager'), req, res);
    }
  },
  handleError: function(error, req, res) {
    console.error(error);
    res.render('error', {
      message: error.message,
      error: error,
      username: req.user.name,
      permissionLevel: req.user.permissionLevel
    });
  },
  handleErrorJSON: function(res, err, result) {
    if(err) {
      console.error(err);
      if(err.code && err.code === 'ECONNREFUSED') {
        result = {error: true, data: 'Cannot connect to API server'};
      }
      else {
        result = {error: true, data: err.message};
      }
    }
    res.json(result);
  }
};

module.exports = Helper;
