/* eslint-disable no-unused-vars */
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
    handleError: function(error, req, res) {
      console.error(error);
      res.render('error', {message: error.message, error: error});
    },
    handleErrorJSON: function(res, err, result) {
      if(err) {
        console.error(err);
        result = {error: true, data: err};
      }
      res.json(result);
    }
};
