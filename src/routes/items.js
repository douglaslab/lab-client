import express from 'express';
import Items from '../models/items';
import helper from '../models/routerHelper';

module.exports = function() {
  var router = express.Router();
  var items = new Items(global.apiUrl, global.apiOptions);

  router.get('/', helper.isLoggedIn, (req, res) => {
    items.get(req, (result) => {
      if(!result.error) {
        res.render('items', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          items: result.data
        });
      }
      else {
        helper.handleError(result.data, req, res);
      }
    });
  });

  router.post('/', helper.isLoggedIn, (req, res) => {
    items.create(req, (result) => res.json(result));
  });

  router.put('/:id', helper.isLoggedIn, (req, res) => {
    items.update(req, (result) => res.json(result));
  });

  router.put('/:id/:replace', helper.isLoggedIn, (req, res) => {
    items.update(req, (result) => res.json(result));
  });

  router.delete('/:id', helper.isLoggedIn, (req, res) => {
    items.delete(req, (result) => res.json(result));
  });

  return router;
};
