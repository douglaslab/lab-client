/* eslint-disable no-unused-vars */
'use strict';

module.exports = function(passport) {
  var router = require('express').Router();
  var users = require('../models/users');
  var helper = require('../models/routerHelper');

  router.get('/', helper.isLoggedIn, helper.isManager, (req, res, next) => {
    users.get(req, (error, result) => {
      if(!error) {
        res.render('users', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          users: result
        });
      }
      else {
        helper.handleError(error, req, res);
      }
    });
  });

  router.post('/', helper.isLoggedIn, helper.isManager, (req, res, next) => {
    users.create(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/:email', helper.isLoggedIn, helper.isManager, (req, res, next) => {
    users.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.delete('/:email', helper.isLoggedIn, helper.isAdmin, (req, res, next) => {
    users.delete(req, (err, result) => helper.handleErrorJSON(res, err, result));
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

  router.get('/settings', helper.isLoggedIn, (req, res) => {
    res.render('settings', {
      username: req.user.name,
      email: req.user.email,
      school: req.user.school,
      permissionLevel: req.user.permissionLevel
    });
  });

  router.put('/settings', helper.isLoggedIn, helper.isManager, (req, res) => {
    req.params.email = req.user.email;
    users.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  return router;
};
