/* eslint-disable no-unused-vars */
'use strict';

module.exports = function(passport) {
  var router = require('express').Router();
  var api = require('../models/api');
  var helper = require('../models/routerHelper');

  router.get('/', helper.isLoggedIn, (req, res, next) => {
    api.getUsers(req, (error, users) => {
      if(!error) {
        res.render('users', {username: req.user.name, users: users});
      }
      else {
        helper.handleError(error, req, res, next);
      }
    });
  });

  router.post('/', (req, res, next) => {
    api.createUser(req, (error, result) => {
      if(!error) {
        res.json(result);
      }
      else {
        helper.handleError(error, req, res, next);
      }
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/items',
    failureRedirect: '/',
    failureFlash: true
  }));

  router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};
