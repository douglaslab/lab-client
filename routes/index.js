'use strict';

var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {  // eslint-disable-line no-unused-vars
  res.render('signin');
});

router.post('/signin', function(req, res, next) { // eslint-disable-line no-unused-vars
  res.redirect('items');
});

router.get('/items', function(req, res, next) { // eslint-disable-line no-unused-vars
  res.render('items');
});

module.exports = router;
