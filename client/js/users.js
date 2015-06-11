/* eslint-disable no-alert */
'use strict';

var validateForm = function() {
  //TODO: validate input fields and show errors
  var fields = {
    email: $('#email').val(),
    name: $('#name').val(),
    school: $('#school').val(),
    password: $('#password1').val(),
    permissionLevel: $('#permissionLevel').val()
  };
  return fields;
};

var addUser = function() {
  var data = validateForm();
  if(!data) {
    return;
  }

  var params = {
    url: '/users',
    type: 'POST',
    data: data,
    dataType: 'json'
  };
  serverCall(params, (error) => {
    if(!error) {
      $('#myModal').modal('hide');
      $('#btnSave').off('click');
      location.reload();
    }
  });
};

var editUser = function(email) {
  var data = validateForm();
  if(!data) {
    return;
  }

  var params = {
    url: '/users/' + email,
    type: 'PUT',
    data: data,
    dataType: 'json'
  };
  serverCall(params, (error) => {
    if(!error) {
      $('#myModal').modal('hide');
      $('#btnSave').off('click');
      location.reload();
    }
  });
};

var deleteUser = function(email) {
  serverCall({
    url: '/users/' + email,
    type: 'DELETE',
    dataType: 'json'
  }, (error) => {
    if(!error) {
      location.reload();
    }
    else {
      flash(error);
    }
  });
};

$(function() {
  $('#btnAdd').on('click', () => {
    $('#myModalLabel').text('Add User');
    $('#myForm').trigger('reset');
    $('#email').prop('disabled', false);
    $('#btnSave').on('click', addUser);
    $('#myModal').modal('show');
  });

  $('button[data-edit]').on('click', function() {
    var row = $('table tr:eq(' + $(this).data('edit') + ')');
    var name = $(row).children('td:eq(1)').text();
    var email = $(row).children('td:eq(2)').text();
    var school = $(row).children('td:eq(3)').text();
    var permission = $(row).children('td:eq(4)').text();
    $('#myModalLabel').text('Edit User ' + email);
    $('#email').remove();
    $('#name').val(name);
    $('#school').val(school);
    $('#permissionLevel').val(permission);
    $('#btnSave').on('click', () => editUser(email));
    $('#myModal').modal('show');
  });

  $('button[data-delete]').on('click', function() {
    var email = $('table tr:eq(' + $(this).data('delete') + ') td:eq(2)').text();
    var result = confirm('are you sure you want to delete user ' + email);
    if(result) {
      deleteUser(email);
    }
  });
});
