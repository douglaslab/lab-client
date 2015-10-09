import {serverCall, flash} from './global';
import './events';

$(function() {
  var changes = [];
  $('.permission').on('change', function() {
    var newPermission = {
      element: $(this).data('element'),
      action: $(this).data('action'),
      permissionRequired: $(this).val()
    };
    if(changes.filter((item, index, array) => {
      if(item.element === newPermission.element && item.action === newPermission.action) {
        array[index] = newPermission;
        return true;
      }
      return false;
      }).length === 0) {
        changes.push(newPermission);
    }
  });

  $('#btnSave').on('click', function() {
    var updated = 0;
    changes.forEach(item => {
      var params = {
        url: '/admin/permissions',
        type: 'POST',
        data: item,
        dataType: 'json'
      };
      serverCall(params, (error) => {
        if(!error) {
          updated++;
          if(updated === changes.length) {
            location.reload();
          }
        }
        else {
          flash(error, true);
        }
      });
    });
  });
});
