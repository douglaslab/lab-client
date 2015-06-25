/* eslint-disable no-unused-vars */
'use strict';

module.exports = function() {
  var router = require('express').Router();
  var admin = require('../models/admin');
  var users = require('../models/users');
  var helper = require('../models/routerHelper');

  router.get('/', (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/settings', helper.isLoggedIn, (req, res, next) => {
    res.render('settings', {
      username: req.user.name,
      email: req.user.email,
      school: req.user.school,
      permissionLevel: req.user.permissionLevel
    });
  });

  router.put('/settings', helper.isLoggedIn, helper.isManager, (req, res, next) => {
    req.params.email = req.user.email;
    users.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });


  router.get('/apihealth', (req, res, next) => {
    admin.getApiHealth((err, result) => {
      res.json({data: {online: (err || result.error) ? false : result.data.online}});
    });
  });

  return router;
};
