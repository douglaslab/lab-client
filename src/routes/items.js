import express from 'express';
import Items from '../models/items';
import helper from '../models/routerHelper';

module.exports = function() {
  var router = express.Router();
  var items = new Items(global.apiUrl, global.apiOptions);

  router.get('/', helper.isLoggedIn, (req, res, next) => {
    items.get(req, (error, result) => {
      if(!error) {
        res.render('items', {
          username: req.user.name,
          permissionLevel: req.user.permissionLevel,
          items: result
        });
      }
      else {
        helper.handleError(error, req, res);
      }
    });
  });

  router.post('/', helper.isLoggedIn, (req, res, next) => {
    items.create(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/:id', helper.isLoggedIn, (req, res, next) => {
    items.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.put('/:id/:replace', helper.isLoggedIn, (req, res, next) => {
    items.update(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  router.delete('/:id', helper.isLoggedIn, (req, res, next) => {
    items.delete(req, (err, result) => helper.handleErrorJSON(res, err, result));
  });

  return router;
};
