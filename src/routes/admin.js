import express from 'express';
import Admin from '../models/admin';
import helper from '../models/routerHelper';

export default function() {
  var router = express.Router();
  var admin = new Admin(global.apiUrl, global.apiOptions);

  router.get('/log', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    admin.getLog(req, (result) => {
      if(!result.error) {
        res.render('log', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          log: result,data
        });
      }
      else {
        helper.handleError(result.data, req, res);
      }
    });
  });

  router.get('/permissions', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    admin.getPermissions(req, (result) => {
      if(!result.error) {
        res.render('permissions', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          permissions: result.data
        });
      }
      else {
        helper.handleError(result.data, req, res);
      }
    });
  });

  router.post('/permissions', helper.isLoggedIn, helper.isAdmin, (req, res) => {
    admin.createPermission(req, (result) => res.json(result));
  });


  return router;
}
