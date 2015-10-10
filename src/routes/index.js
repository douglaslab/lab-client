import express from 'express';
import Controller from '../controllers/admin';

export default function(passport) {
  var router = express.Router();
  var controller = new Controller();

  router.get('/', (req, res) => {
    res.render('index', { message: req.flash('loginMessage') });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/items',
    failureRedirect: '/',
    failureFlash: true
  }));

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  router.get('/apihealth', controller.getApiHealth());
  return router;
};
