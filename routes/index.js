/* eslint-disable no-unused-vars */
'use strict';

module.exports = function(passport) {
  var router = require('express').Router();
  var api = require('../models/api');
  var helper = require('../models/routerHelper');

  router.get('/', (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/items', helper.isLoggedIn, (req, res, next) => {
    api.getItems(req, (error, items) => {
      if(!error) {
        res.render('items', {username: req.user.name, items: items});
      }
      else {
        helper.handleError(error, req, res, next);
      }
    });
  });

  router.post('/items', helper.isLoggedIn, (req, res, next) => {

  });

  return router;
};
