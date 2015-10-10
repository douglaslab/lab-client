import {Items} from 'lab-api-wrapper';
import helper from '../models/routerHelper';

export default class {
  constructor() {
    this.items = new Items(global.apiUrl, global.apiOptions);
  }

  _validateItem(item) {
    //TODO: validate input
    return item;
  }

  getItems() {
    return (req, res) => {
      let filter = Object.keys(req.query).length ? req.query : null;
      this.items.getItems(req.user, null, filter)
        .then(result => {
          res.render('items', {
            username: req.user.name,
            permissionLevel: req.user.permissionLevel,
            items: result.data
          });
        })
        .catch(err => helper.handleError(err, req, res));
    };
  }

  createItem() {
    return (req, res) => {
      this.items.createItem(req.user, this._validateItem(req.body))
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  updateItem() {
    return (req, res) => {
      this.items.updateItem(req.user, req.params.id, this._validateItem(req.body))
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  replaceItem() {
    return (req, res) => {
      this.items.replaceItem(req.user, req.params.id, this._validateItem(req.body))
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  deleteItem() {
    return (req, res) => {
      this.items.deleteItem(req.user, req.params.id)
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }
}
