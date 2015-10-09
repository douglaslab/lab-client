/* global $ */
var flash = function(message, error) {
  $('#message').text(message).toggleClass('text-danger', error).toggleClass('text-success', !error);
};

var rgb2hex = function(rgb) {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return '#' +
    ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2);
};

var serverCall = function(params, callback) {
  $.ajax(params)
    .done((result) => {
      if(result.error) {
        console.error(result.data);
        callback(result.data, null);
      }
      else {
        callback(null, result.data || result);
      }
    })
    .fail((xhr, status, error) => {
      console.error(error);
      callback(error, null);
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

var handleScroll = function() {
  $(window).on('scroll touchmove', function() {
    $('body').toggleClass('scroll_down show_header', $(window).scrollTop() > 0);
    $('body').toggleClass('show-backtotop', $(window).scrollTop() > $('body').innerHeight() * 0.33);
  });
};

export {flash, serverCall, rgb2hex, apiServerStatus, handleScroll};

$(function() {
  var isLoginPage = location.pathname.substring(location.pathname.lastIndexOf('/') + 1) === '';
  apiServerStatus();
  setInterval(apiServerStatus, isLoginPage ? 30 * 1000 : 20 * 60 * 1000);
});
