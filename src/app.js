import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';

//routes
import routes from './routes/index';
import adminRoutes from './routes/admin';
import itemRoutes from './routes/items';
import userRoutes from './routes/users';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

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
app.use(express.static(path.join(__dirname, '..', 'public')));

//favicon
app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));

//globals
global.apiUrl = process.env.LAB_API_URL;
global.apiOptions = {
  version: process.env.LAB_API_VERSION || '1.0.0',
  userAgent: 'lab-client'
};

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
app.use((req, res, next) => {
  var err = new Error('Page Not Found (' + req.url + ')');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {},
    username: (req.user && req.user.name) || '',
    permissionLevel: (req.user && req.user.permissionLevel) || ''
  });
});

export default app;
