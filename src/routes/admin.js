import express from 'express';
import Controller from '../controllers/admin';
import helper from '../models/routerHelper';

export default function() {
  let router = express.Router();
  let controller = new Controller();

  router.get('/log', helper.isLoggedIn, helper.isAdmin, controller.getAuditLog());
  router.get('/permissions', helper.isLoggedIn, helper.isAdmin, controller.getPermissions());
  router.post('/permissions', helper.isLoggedIn, helper.isAdmin, controller.createPermission());
  return router;
}
