import {handleScroll, apiServerStatus} from './global';

$(function() {
  handleScroll();
  apiServerStatus();
  setInterval(apiServerStatus, 30 * 1000);
});
