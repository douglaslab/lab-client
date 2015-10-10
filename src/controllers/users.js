import moment from 'moment';
import {Users} from 'lab-api-wrapper';
import helper from '../models/routerHelper';

var debug = require('debug')('users');
const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss';

export default class {
  constructor() {
    this.users = new Users(global.apiUrl, global.apiOptions);
  }

  _validateUser(user) {
    //TODO: validate input
    debug(user);
    return user;
  }

  getUsers() {
    return (req, res) => {
      this.users.getUsers(req.user)
        .then(users => {
          users.data = users.data.map((user) => {
            user.created = moment(user.created).format(DATE_FORMAT);
            user.modified = moment(user.modified).format(DATE_FORMAT);
            return user;
          });
          res.render('users', {
            username: req.user.name,
            permissionLevel: req.user.permissionLevel,
            users: users.data
          });
        })
        .catch(err => helper.handleError(err, req, res));
    };
  }

  createUser() {
    return (req, res) => {
      this.users.createUser(req.user, _validateUser(req.body))
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  updateUser() {
    return (req, res) => {
      this.users.updateUser(req.user, req.params.email, _validateUser(req.body))
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  deleteUser() {
    return (req, res) => {
      this.users.deleteUser(req.user, req.params.email)
        .then(result => res.json(result))
        .catch(err => helper.handleError(err, req, res));
    };
  }

  getPhoto() {
    return (req, res) => {
      this.users.getPhoto(req.user, req.params.email)
        .then(photo => {
          res.set('Content-type', 'application/octet-stream');
          res.status(200).send(photo);
        })
        .catch(err => helper.handleError(err, req, res));
    };
  }
}
