'use strict';

var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin');
});

router.post('/signin', function(req, res, next) {
  res.redirect('items');
});

router.get('/items', function(req, res, next) {
  res.render('items');
});

module.exports = router;
