import express from 'express';
import Controller from '../controllers/users';
import helper from '../models/routerHelper';

export default function() {
  var router = express.Router();
  var controller = new Controller();

  router.get('/', helper.isLoggedIn, helper.isManager, controller.getUsers());
  router.post('/', helper.isLoggedIn, helper.isManager, controller.createUser());
  router.put('/:email', helper.isLoggedIn, helper.isManager, controller.updateUser());
  router.delete('/:email', helper.isLoggedIn, helper.isAdmin, controller.deleteUser());
  router.get('/:email/photo', helper.isLoggedIn, controller.getPhoto());

  //show currently logged user
  router.get('/profile', helper.isLoggedIn, (req, res) => {
    res.render('profile', {
      username: req.user.name,
      email: req.user.email,
      permissionLevel: req.user.permissionLevel
    });
  });
  //update currently logged user
  router.put('/profile', helper.isLoggedIn, helper.isManager, helper.copyEmail, controller.updateUser());
  return router;
};
