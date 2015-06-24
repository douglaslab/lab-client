'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var routes = require('./routes/index');
var adminRoutes = require('./routes/admin');
var itemRoutes = require('./routes/items');
var userRoutes = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//middleware
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'shhh! it is a secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration
require('./models/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes configuration
app.use('/', routes());
app.use('/admin', adminRoutes());
app.use('/items', itemRoutes());
app.use('/users', userRoutes(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') === 'development') {
  // development error handler - will print stacktrace
  app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    console.log(req.user);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      username: (req.user && req.user.name) || '',
      permissionLevel: (req.user && req.user.permissionLevel) || ''
    });
  });
}
else {
  // production error handler - no stacktraces leaked to user
  app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      username: (req.user && req.user.name) || '',
      permissionLevel: (req.user && req.user.permissionLevel) || ''
    });
  });
}

module.exports = app;
