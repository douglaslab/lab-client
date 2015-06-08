'use strict';

module.exports = {
    isLoggedIn: function(req, res, next) {
      if(req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');
    },
    isPermissionValid: function(permissionNeeded, req, res, next) {

    },
    handleError: function(error, req, res, next) {
      console.error(error);
      res.render('error', {message: error.message, stack: error.stack});
    }
};
