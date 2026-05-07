(function () {
  'use strict';

  window.injectFooter = function () {
    var html = '<footer class="site-footer">Meridian &nbsp;&middot;&nbsp; Built for you &nbsp;&middot;&nbsp; May 2026</footer>';
    var main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('afterend', html);
  };
}());
