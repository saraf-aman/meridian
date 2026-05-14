if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    window.location.reload();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var path = window.location.pathname;
  var activePage = 'home';
  var basePath = '';

  if (path.indexOf('/pages/workout') !== -1) {
    basePath = '../../';
    activePage = path.indexOf('/calendar') !== -1 ? 'calendar' : 'workout';
  } else if (path.indexOf('/pages/') !== -1) {
    basePath = '../';
    if (path.indexOf('/nutrition') !== -1)   activePage = 'nutrition';
    else if (path.indexOf('/sleep') !== -1)  activePage = 'sleep';
    else if (path.indexOf('/habits') !== -1) activePage = 'habits';
  }

  if (window.injectNav)    window.injectNav(activePage, basePath);
  if (window.injectFooter) window.injectFooter();
});
