'use strict';

module.exports = function(passport) {
  var router = require('express').Router();
  var api = require('../models/api');

  var isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };

  /* GET home page. */
  router.get('/', function(req, res, next) {  // eslint-disable-line no-unused-vars
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.get('/items', isLoggedIn, function(req, res, next) { // eslint-disable-line no-unused-vars
    api.getItems(req, (error, items) => {
      if(!error) {
        res.render('items', {username: req.user.name, items: items});
      }
      else {
        console.error(error);
      }
    })
  });

  router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/items',
    failureRedirect: '/',
    failureFlash: true
  }));

  router.get('/users/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
