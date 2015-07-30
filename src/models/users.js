import moment from 'moment';
import wrapper from 'lab-api-wrapper';
var debug = require('debug')('users');
const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss';

export default class {
  constructor(apiUrl, options) {
    this.users = new wrapper.Users(apiUrl, options);
  }

  get(req, callback) {
    this.users.getUsers(req.user, (users) => {
      if(!users.error) {
        users.data = users.data.map((user) => {
          user.created = moment(user.created).format(DATE_FORMAT);
          user.modified = moment(user.modified).format(DATE_FORMAT);
          return user;
        });
        debug(users.data);
      }
      return callback(users);
    });
  }

  create(req, callback) {
    //TODO: validate input
    let newUser = req.body;
    debug(newUser);
    this.users.createUser(req.user, newUser, callback);
  }

  update(req, callback) {
    //TODO: validate input
    let newUser = req.body;
    debug(newUser);
    this.users.updateUser(req.user, req.params.email, newUser, callback);
  }

  delete(req, callback) {
    this.users.deleteUser(req.user, req.params.email, callback);
  }
}
