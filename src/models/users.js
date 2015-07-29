import moment from 'moment';
import wrapper from 'lab-api-wrapper';
var debug = require('debug')('users');
const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss';

export default class Admin {
  constructor(apiUrl, options) {
    this.users = new wrapper.Items(apiUrl, options);
  }

  login(req, email, password, callback) {
    debug('trying to log in user %s', email);
    this.users.login(email, password, (result) => {
      if(result.error) {
        return callback(null, false, req.flash('loginMessage', result.data));
      }
      else {
        return callback(null, result.data);
      }
    });
  }

  get(req, callback) {
    this.users.getUsers(req.user, (users) => {
      if(users.error) {
        err = new Error(users.data);
      }
      else {
        users = users.data.map((user) => {
          user.created = moment(user.created).format(DATE_FORMAT);
          user.modified = moment(user.modified).format(DATE_FORMAT);
          return user;
        });
        debug(users);
      }
      return callback(err, users);
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
