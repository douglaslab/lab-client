import express from 'express';
import Controller from '../controllers/items';
import helper from '../models/routerHelper';

export default function() {
  let router = express.Router();
  let controller = new Controller();

  router.get('/', helper.isLoggedIn, controller.getItems());
  router.post('/', helper.isLoggedIn, controller.createItem());
  router.put('/:id', helper.isLoggedIn, controller.updateItem());
  router.put('/:id/:replace', helper.isLoggedIn, controller.replaceItem());
  router.delete('/:id', helper.isLoggedIn, controller.deleteItem());
  return router;
};
