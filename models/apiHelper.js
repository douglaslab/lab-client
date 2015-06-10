'use strict';

module.exports = {
  generateAuthorizationHeader: function(user) {
    var util = require('util');
    var crypto = require('crypto');
    var timestamp = parseInt(Date.now() / 1000, 10);
    var hmac = crypto.createHmac('sha1', user.apiSecret).update(user.apiKey).digest('hex');
    var token = crypto.createHash('md5').update(hmac + timestamp).digest('hex');
    return {
      'X-API-Authorization': util.format('key=%s, token=%s, ts=%s', user.apiKey, token, timestamp)
    };
  }
};
