'use strict';

module.exports = function() {
  var router = require('express').Router();

  router.get('/', (req, res, next) => {
    res.render('login', { message: req.flash('loginMessage') });
  });

  return router;
};
