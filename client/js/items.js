/* eslint-disable no-alert */
/* global serverCall, flash */
'use strict';

var removeProp = function(e) {
  e.preventDefault();
  $(this).closest('.row').remove();
  $('#itemForm > .row:last').find('.add-prop').prop('disabled', false);
};

var addProp = function(e) {
  e.preventDefault();
  var lastRow = $('#itemForm > .row:last');
  if($(lastRow).find('.property').val() === '' || $(lastRow).find('.value').val() === '') {
    return; //do not allow adding empty lines
  }
  var newRow = lastRow.clone();
  lastRow.find('.remove-prop').prop('disabled', false); //disable remove on previous line
  newRow.find('.property').val('');
  newRow.find('.value').val('');
  newRow.find('.add-prop').on('click', addProp);
  newRow.find('.remove-prop').on('click', removeProp).prop('disabled', false);
  newRow.appendTo('#itemForm');
  $(this).prop('disabled', true); //disable the original add button
};

var populateModal = function(btn) {
  var values = {};
  var properties = $(btn).parentsUntil('tr').parent().find('.properties > .property');
  $(properties).each(i => {
    let prop = $(properties)[i];
    let name = $(prop).find('.name').text();
    let value = $(prop).find('.value').text();
    values[name] = value;
  });
  let first = true;
  for(let key in values) {
    let lastRow = $('#itemForm > .row:last');
    if(first) {
      lastRow.find('.property').val(key);
      lastRow.find('.value').val(values[key]);
      first = false;
    }
    else {
      let newRow = lastRow.clone();
      lastRow.find('.add-prop').prop('disabled', true);
      newRow.find('.property').val(key);
      newRow.find('.value').val(values[key]);
      newRow.find('.add-prop').on('click', addProp);
      newRow.find('.remove-prop').on('click', removeProp);
      newRow.appendTo('#itemForm');
    }
  }
};

var validateProperties = function() {
  //TODO: validate properties, check for multiples etc.
  var properties = {};
  var rows = $('#itemForm > .row');
  for(let i = 0; i < rows.length; i++) {
    let name = $(rows[i]).find('.property').val();
    let value = $(rows[i]).find('.value').val();
    if(name && value) {
      properties[name] = value;
    }
  }
  return properties;
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
      $('#itemModal').modal('hide');
      $('#btnSave').off('click');
      location.reload();
    }
  });
};

var updateItem = function(id) {
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
      $('#itemModal').modal('hide');
      $('#btnSave').off('click');
      location.reload();
    }
  });
};

var deleteItem = function(id) {
  if(!confirm('are you sure you want to delete item ' + id)) {
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
      flash(error, true);
    }
  });
};

$(function() {
  let originalField = $('#itemForm > .row').clone();
  $('#btnAdd').on('click', function() {
    $('#itemModalLabel').text('Add Item');
    $('#itemForm').trigger('reset');
    $('.remove-prop').on('click', removeProp).prop('disabled', true);
    $('.add-prop').on('click', addProp);
    $('#btnSave').on('click', addItem);
    $('#itemModal').modal('show');
  });

  $('button[data-edit]').on('click', function() {
    let id = $(this).data('edit');
    populateModal($(this));
    $('#itemModalLabel').text('Edit Item ' + id);
    $('#btnSave').on('click', () => updateItem(id));
    $('#itemModal').modal('show');
  });

  $('button[data-delete]').on('click', function() {
    let id = $(this).data('delete');
    deleteItem(id);
  });

  //reset modal after it's closed
  $('#itemModal').on('hidden.bs.modal', function() {
    $('#itemForm').empty();
    originalField.appendTo('#itemForm');
  });
});
