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
