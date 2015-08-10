import express from 'express';
import Users from '../models/users';
import helper from '../models/routerHelper';

export default function(passport) {
  var router = express.Router();
  var users = new Users(global.apiUrl, global.apiOptions);

  router.get('/', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.get(req, (err, result) => {
      if(!err && !result.error) {
        res.render('users', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          users: result.data
        });
      }
      else {
        helper.handleError(err || result.error, req, res);
      }
    });
  });

  router.post('/', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.create(req, (err, result) => res.json(result));
  });

  router.put('/:email', helper.isLoggedIn, helper.isManager, (req, res) => {
    users.update(req, (err, result) => res.json(result));
  });

  router.delete('/:email', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    users.delete(req, (err, result) => res.json(result));
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

  router.get('/profile', helper.isLoggedIn, (req, res) => {
    res.render('profile', {
      username: req.user.name,
      email: req.user.email,
      permissionLevel: req.user.permissionLevel
    });
  });

  router.put('/profile', helper.isLoggedIn, helper.isManager, (req, res) => {
    req.params.email = req.user.email;
    users.update(req, (err, result) => res.json(result));
  });

  router.get('/:email/photo', helper.isLoggedIn, (req, res) => {
    users.getPhoto(req, (err, photo) => {
      if(err) {
        helper.handleError(err, req, res);
      }
      else {
        res.set('Content-type', 'application/octet-stream');
        res.status(200).send(photo);
      }
    });
  });

  return router;
}
