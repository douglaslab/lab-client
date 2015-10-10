import {Admin} from 'lab-api-wrapper';
import helper from '../models/routerHelper';

export default class {
  constructor() {
    this.admin = new Admin(global.apiUrl, global.apiOptions);
  }

  getApiHealth() {
    return (req, res) => {
      this.admin.getApiHealth()
        .then(() => res.json({data: {online: true}}))
        .catch(() => res.json({data: {online: false}}));
    };
  }

  getAuditLog() {
    return (req, res) => {
      admin.getAuditLog(req.user)
        .then(result => {
          res.render('log', {
            username: req.user.name,
            permissionLevel: req.user.permissionLevel,
            log: result.data
          });
        })
        .catch(err => helper.handleError(err, req, res));
    };
  }

  getPermissions() {
    return (req, res) => {
      admin.getPermissions(req.user)
        .then(result => {
          res.render('permissions', {
            username: req.user.name,
            permissionLevel: req.user.permissionLevel,
            permissions: result.data
          });
        })
        .catch(err => helper.handleError(err, req, res));
    };
  }

  createPermission() {
    return (req, res) => {
      admin.createPermission(req.user, req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err));
    };
  }
}
