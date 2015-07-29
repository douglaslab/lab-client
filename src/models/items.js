import wrapper from 'lab-api-wrapper';
var debug = require('debug')('items');

export default class Admin {
  constructor(apiUrl, options) {
    this.items = new wrapper.Items(apiUrl, options);
  }

  get(req, callback) {
    let filter = Object.keys(req.query).length ? req.query : null;
    this.items.getItems(req.user, callback, filter);
  }

  create(req, callback) {
    //TODO: validate input
    var item = req.body;
    debug(item);
    this.items.createItem(req.user, item, callback);
  }

  update(req, callback) {
    let newItem = req.body;
    debug(newItem);
    if(req.params.replace) {
      this.items.replaceItem(req.user, req.params.id, newItem, callback);
    }
    else {
      this.items.updateItem(req.user, req.params.id, newItem, callback);
    }
  }

  delete(req, callback) {
    this.items.deleteItem(req.user, req.params.id, callback);
  }
}
