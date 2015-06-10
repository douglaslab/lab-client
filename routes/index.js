/* eslint-disable no-unused-vars */
'use strict';

module.exports = function(passport) {
  var router = require('express').Router();
  var items = require('../models/items');
  var helper = require('../models/routerHelper');

  router.get('/', (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/items', helper.isLoggedIn, (req, res, next) => {
    items.get(req, (error, result) => {
      if(!error) {
        res.render('items', {username: req.user.name, items: result});
      }
      else {
        helper.handleError(error, req, res);
      }
    });
  });

  router.post('/items', helper.isLoggedIn, (req, res, next) => {

  });

  return router;
};
