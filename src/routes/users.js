import express from 'express';
import Users from '../models/users';
import helper from '../models/routerHelper';

export default function(passport) {
  var router = express.Router();
  var users = new Users(global.apiUrl, global.apiOptions);

  router.get('/', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.get(req, (result) => {
      if(!result.error) {
        res.render('users', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          users: result.data
        });
      }
      else {
        helper.handleError(result.error, req, res);
      }
    });
  });

  router.post('/', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.create(req, (result) => res.json(result));
  });

  router.put('/:email', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.update(req, (result) => res.json(result));
  });

  router.delete('/:email', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    users.delete(req, (result) => res.json(result));
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
    users.update(req, (result) => res.json(result));
  });

  return router;
}
