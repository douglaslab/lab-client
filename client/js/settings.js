/* global serverCall, flash */
'use strict';

var validateForm = function() {
  if($('#settingsForm').parsley().validate()) {
    return {
      name: $('#name').val(),
      school: $('#school').val(),
      password: $('#password1').val(),
      permissionLevel: $('#permissionLevel').val()
    };
  }
  else {
    return null;
  }
};

var saveSettings = function() {
  var data = validateForm();
  if(!data) {
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
      $('#relogin').removeClass('hidden');
      setInterval(() => {
        var timer = parseInt($('#timer').text(), 0);
        if (!timer) {
          location.href = '/users/logout';
        }
        else {
          $('#timer').text(timer - 1);
        }
      }, 1000);
    }
  });
};


$(function() {
  $('#btnSave').on('click', saveSettings);
  $('#settingsForm').parsley({
    focus: 'first',
    successClass: 'has-success',
    errorClass: 'has-error',
    classHandler: function(el) {
      return el.$element.closest('.form-group');
    },
    errorsWrapper: '<span class="help-block"></span>',
    errorElem: '<span></span>'
  });
});
