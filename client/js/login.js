/* global apiServerStatus */
'use strict';

$(function() {
  apiServerStatus();
  setInterval(apiServerStatus, 30000);
});
