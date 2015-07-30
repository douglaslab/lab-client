import wrapper from 'lab-api-wrapper';
var debug = require('debug')('admin');

export default class {
  constructor(apiUrl, version) {
    this.admin = new wrapper.Admin(apiUrl, version);
  }

  getApiHealth(callback) {
    this.admin.getApiHealth(callback);
  }

  getLog(req, callback) {
    this.admin.getAuditLog.get(req.user, callback);
  }

  getPermissions(req, callback) {
    this.admin.getPermissions(req.user, callback);
  }

  createPermission(req, callback) {
    var permission = req.body;  //TODO: validate input
    debug(permission);
    this.admin.createPermission(req.user, permission, callback);
  }
}
