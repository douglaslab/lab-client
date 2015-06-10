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

var editUser = function() {
  var data = validateForm();
  if(!data) {
    return;
  }

  var params = {
    url: '/users/' + data.email,
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
    $('#myModalLabel').text('Edit User');
    $('#email').val(email).prop('disabled', true);
    $('#name').val(name);
    $('#school').val(school);
    $('#permissionLevel').val(permission);
    $('#btnSave').on('click', editUser);
    $('#myModal').modal('show');
  });

  $('button[data-delete]').on('click', function() {
    var id = $('table tr:eq(' + $(this).data('delete') + ') td:eq(2)').text();
    var result = confirm('are you sure you want to delete user ' + id);
    if(result) {
      deleteUser(id);
    }
  });
});
