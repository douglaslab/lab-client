/* eslint-disable no-unused-vars */
'use strict';

var flash = function(message, error) {
  $('#message').text(message).attr('class', error ? 'text-danger' : '');
};

var serverCall = function(params, callback) {
  $.ajax(params)
    .done((result) => {
      if(result.error) {
        console.error(result.data);
        callback(result.data, null);
      }
      else {
        callback(null, result.data);
      }
    })
    .fail((xhr, status, error) => {
      console.error(error, null);
    });
};

var apiServerStatus = function() {
  serverCall({url: '/apihealth', type: 'GET'}, (err, result) => {
    var status = !err && result.online;
    $('#serverStatus')
      .text(status ? 'on' : 'off')
      .removeClass(!status ? 'text-success' : 'text-danger')
      .addClass(status ? 'text-success' : 'text-danger');
  });
};
