/* eslint-disable no-unused-vars */
'use strict';

module.exports = function() {
  var router = require('express').Router();
  var admin = require('../models/admin');
  var helper = require('../models/routerHelper');

  router.get('/apihealth', (req, res, next) => {
    admin.getApiHealth((err, result) => {
      res.json({data: {online: (err || result.error) ? false : result.data.online}});
    });
  });

  router.get('/', helper.isLoggedIn, helper.isAdmin, (req, res, next) => {
    admin.audit(req, (error, result) => {
      if(!error) {
       res.render('admin', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          log: result
        });
      }
      else {
        helper.handleError(error, req, res);
      }
    });
  });

  return router;
};
