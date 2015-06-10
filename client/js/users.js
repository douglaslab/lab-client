'use strict';

var addUser = function() {
  //TODO: validate input
  var data = {
    email: $('#email').val(),
    name: $('#name').val(),
    school: $('#school').val(),
    password: $('#password1').val(),
    permissionLevel: $('#permissionLevel').val()
  };
  console.log(data);
  $.ajax({
    url: '/users',
    type: 'POST',
    data: data,
    dataType: 'json'
  }).done(function(result) {
    if(result.error) {
      console.error(result.data);
    }
    else {
      location.reload();
    }
  }).fail(function(error) {
    console.error(error);
  }).always(function() {
    $('#btnSave').off('click');
  });
};

var editUser = function() {
  console.log('edit');
  $('#btnSave').off('click');
};

var deleteUser = function(email) {
  $.ajax({
    url: '/users/' + email,
    type: 'DELETE',
    dataType: 'json'
  }).done(function() {

  }).fail(function(error) {
    console.error(error);
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
    var id = $(this).data('delete');
    var result = confirm('are you sure you want to delete user ' + id);
    console.log(result);
  });
});
