(function () {
  'use strict';

  window.injectNav = function (activePage, basePath) {
    if (typeof basePath === 'undefined') basePath = '';

    var links = [
      { id: 'workout',   label: 'Workout',    href: basePath + 'pages/workout/index.html' },
      { id: 'nutrition', label: 'Nutrition',  disabled: true },
      { id: 'sleep',     label: 'Sleep',      disabled: true },
      { id: 'habits',    label: 'Habits',     disabled: true },
      { id: 'more',      label: 'More',       disabled: true },
    ];

    var linksHtml = links.map(function (l) {
      if (l.disabled) {
        return '<span class="nav-link disabled">' + l.label + '</span>';
      }
      var cls = 'nav-link' + (activePage === l.id ? ' active' : '');
      return '<a class="' + cls + '" href="' + l.href + '">' + l.label + '</a>';
    }).join('');

    var html = [
      '<nav class="site-nav">',
        '<div class="nav-inner">',
          '<a class="nav-logo" href="' + basePath + 'index.html">Meri<span>dian</span></a>',
          '<div class="nav-links">' + linksHtml + '</div>',
        '</div>',
      '</nav>',
    ].join('');

    var main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('beforebegin', html);
  };
}());
