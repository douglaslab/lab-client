'use strict';

$(function() {

  $('#btnAdd').on('click', () => {
    $('#myModalLabel').text('Add Item');
    $('#myModal').modal('show');
  });

  $('button[data-edit]').on('click', function() {
    $('#myModalLabel').text('Edit Item');
    $('#email').val($(this).data('edit'));
  });

  $('button[data-delete]').on('click', function() {
    var id = $(this).data('delete');
    var result = prompt('are you sure you want to delete user ' + id);
    console.log(result);
  });
});
