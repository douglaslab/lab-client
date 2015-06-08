'use strict';

var settings = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  staging: {
    apiUrl: 'https://bionano-api.herokuapp.com'
  },
  production: {
    apiUrl: 'https://bionano-api.herokuapp.com'
  }
};

module.exports = (function() {
  return settings[process.env.NODE_ENV || 'development'];
}());
