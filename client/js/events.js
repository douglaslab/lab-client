import {apiServerStatus, handleScroll} from './global';

$(function() {
  handleScroll();
  var isLoginPage = location.pathname.substring(location.pathname.lastIndexOf('/') + 1) === '';
  apiServerStatus();
  setInterval(apiServerStatus, isLoginPage ? 30 * 1000 : 20 * 60 * 1000);
});
