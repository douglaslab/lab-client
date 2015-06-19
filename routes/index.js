/* eslint-disable no-unused-vars */
'use strict';

module.exports = function() {
  var router = require('express').Router();
  var items = require('../models/items');
  var helper = require('../models/routerHelper');

  router.get('/', (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/items', helper.isLoggedIn, (req, res, next) => {
    items.get(req, (error, result) => {
      if(!error) {
        res.render('items', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          items: result
        });
      }
      else {
        helper.handleError(error, req, res);
      }
    });
  });

  router.post('/items', helper.isLoggedIn, (req, res, next) => {
    items.create(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/items/:id', helper.isLoggedIn, (req, res, next) => {
    items.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/items/:id/:replace', helper.isLoggedIn, (req, res, next) => {
    items.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.delete('/items/:id', helper.isLoggedIn, (req, res, next) => {
    items.delete(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  return router;
};
