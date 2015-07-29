require('babel/polyfill');
import $ from '../vendor/js/jquery.min.js';
import Dropbox from './dropbox.min.js';

var authenticateDropbox = function() {
  let client = new Dropbox.Client({
    key: apiKey,
    sandbox: false
  });
  client.authDriver(new Dropbox.AuthDriver.Redirect({
    redirectUrl: redirectUrl,
    rememberUser: false
  }));
  client.authenticate((error, result) => {
    if(error) {
      console.error(error);
    }
    else {
      console.log(result);
    }
  });
};

function parseHash() {
  var query = (location.hash || '#').substr(1)
  var result   = {};
  query.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    result[$1] = $3;
  });
  return result;
}

$(function() {
  if($('#btnAuthenticate').length) {
    $('#btnAuthenticate').on('click', authenticateDropbox);
  }
  else {
    var hash = parseHash();
    $('#token').val(hash.access_token);
  }
} ());
