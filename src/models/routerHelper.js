var Helper = {
  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  },
  isAdmin: function(req, res, next) {
    if(req.user.permissionLevel === 'ADMIN') {
      return next();
    }
    else {
      Helper.handleError(new Error('Permission denied - must be admin'), req, res);
    }
  },
  isManager: function(req, res, next) {
    if(req.user.permissionLevel === 'ADMIN' || req.permissionLevel === 'MANAGER') {
      return next();
    }
    else {
      Helper.handleError(new Error('Permission denied - must be manager'), req, res);
    }
  },
  copyEmail: function(req, res, next) {
    //copy admin email from exisiting profile to param for self-update
    req.params.email = req.user.email;
    return next();
  },
  handleError: function(error, req, res) {
    console.error(error);
    res.render('error', {
      error: error,
      username: req.user.name,
      permissionLevel: req.user.permissionLevel
    });
  }
};

export default Helper;
