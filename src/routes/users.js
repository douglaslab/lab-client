import express from 'express';
import Users from '../models/users';
import helper from '../models/routerHelper';

export default function(passport) {
  var router = express.Router();
  var users = new Users(global.apiUrl, global.apiOptions);

  router.get('/', helper.isLoggedIn, helper.isManager, (req, res) => {
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

  router.post('/', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.create(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/:email', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.delete('/:email', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    users.delete(req, (err, result) => helper.handleErrorJSON(res, err, result));
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
}
