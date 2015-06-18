/* eslint-disable no-alert */
/* global serverCall, flash */
'use strict';

var removeProp = function(e) {
  e.preventDefault();
  $(this).closest('.row').remove();
};

var addProp = function(e) {
  e.preventDefault();
  var lastRow = $('#myForm > .row:last');
  var newRow = lastRow.clone();
  newRow.find('.property').val('');
  newRow.find('.value').val('');
  newRow.appendTo('#myForm');
  $(this).text('-').attr('title', 'remove property').off('click').on('click', removeProp);
  newRow.find('.add-prop').on('click', addProp);
};

var validateProperties = function() {
  //TODO: validate properties, check for multiples etc.
  var properties = {};
  var rows = $('#myForm > .row');
  for(let i = 0; i < rows.length; i++) {
    let name = $(rows[i]).find('.property').val();
    let value = $(rows[i]).find('.value').val();
    properties[name] = value;
  }
  return properties;
};

var populateModal = function(properties) {
  var values = {};
  $(properties).each(i => {
    let prop = $(properties)[i];
    let name = $(prop).find('.name').text();
    let value = $(prop).find('.value').text();
    values[name] = value;
  });
  let first = true;
  let button = $('#myForm > .row:last').find('.add-prop').clone().on('click', addProp);
  for(let key in values) {
    let lastRow = $('#myForm > .row:last');
    if(first) {
      lastRow.find('.property').val(key);
      lastRow.find('.value').val(values[key]);
      lastRow.find('.add-prop').text('-').attr('title', 'remove property').off('click').on('click', removeProp);
      first = false;
    }
    else {
      let newRow = lastRow.clone();
      newRow.find('.property').val(key);
      newRow.find('.value').val(values[key]);
      newRow.find('.add-prop').text('-').attr('title', 'remove property').off('click').on('click', removeProp);
      newRow.appendTo('#myForm');
    }
  }
  button.appendTo($('#myForm > .row:last').find('.add-prop').parent());
};

var addItem = function() {
  var data = validateProperties();
  if(!data) {
    return;
  }

  var params = {
    url: '/items',
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

var editItem = function(id) {
  var data = validateProperties();
  if(!data) {
    return;
  }
  //we'll be replacing all properties - to allow removing
  var params = {
    url: '/items/' + id + '/true',
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

var deleteItem = function() {
  var id = $(this).data('delete');
  var result = confirm('are you sure you want to delete item ' + id);
  if(!result) {
      return;
  }
  serverCall({
    url: '/items/' + id,
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
  let originalField = $('#myForm > .row').clone();
  $('#btnAdd').on('click', function() {
    $('#myModalLabel').text('Add Item');
    $('#myForm').trigger('reset');
    $('#btnSave').on('click', addItem);
    $('#myModal').modal('show');
  });

  $('button[data-edit]').on('click', function() {
    let id = $(this).data('edit');
    populateModal($(this).parent().parent().find('.properties > .property'));
    $('#myModalLabel').text('Edit Item ' + id);
    $('#btnSave').on('click', () => editItem(id));
    $('#myModal').modal('show');
  });

  $('button[data-delete]').on('click', deleteItem);

  $('.add-prop').on('click', addProp);

  //reset modal after it's closed
  $('#myModal').on('hidden.bs.modal', function() {
    $('#myForm').empty();
    originalField.appendTo('#myForm');
  });
});
