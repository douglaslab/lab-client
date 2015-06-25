/* global serverCall, flash */
'use strict';

var validateForm = function() {
  //TODO: validate input fields and show errors
  var fields = {
    name: $('#name').val(),
    school: $('#school').val(),
    password: $('#password1').val(),
    permissionLevel: $('#permissionLevel').val()
  };
  return fields;
};

var saveSettings = function() {
  var data = validateForm();
  if(!data) {
    flash('wrong data provided', true);
    return;
  }

  var params = {
    url: '/settings',
    type: 'PUT',
    data: data,
    dataType: 'json'
  };
  serverCall(params, (error) => {
    if(error) {
      flash(error, false);
    }
    else {
      $('#settingsForm :input, #btnSave').prop('disabled', true);
      flash('Your settings have been updated - please relogin (you\'ll be automatically logged out in 5 seconds)', false);
      setTimeout(() => {location.href = '/users/logout'; }, 5000);
    }
  });
};


$(function() {
  $('#btnSave').on('click', saveSettings);
});
