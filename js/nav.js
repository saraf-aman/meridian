(function () {
  'use strict';

  window.injectNav = function (activePage, basePath) {
    if (typeof basePath === 'undefined') basePath = '';

    var links = [
      { id: 'workout',   label: 'Workout',    href: basePath + 'pages/workout/index.html' },
      { id: 'calendar',  label: 'Calendar',   href: basePath + 'pages/workout/calendar.html' },
      { id: 'nutrition', label: 'Nutrition',  href: basePath + 'pages/nutrition/index.html' },
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
      '<nav class="site-nav" id="site-nav">',
        '<div class="nav-inner">',
          '<a class="nav-logo" href="' + basePath + 'index.html">Meri<span>dian</span></a>',
          '<div class="nav-links" id="nav-links">' + linksHtml + '</div>',
          '<div class="nav-auth" id="nav-auth"></div>',
          '<button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false">',
            '<span></span><span></span><span></span>',
          '</button>',
        '</div>',
      '</nav>',
    ].join('');

    var main = document.querySelector('main');
    if (main) main.insertAdjacentHTML('beforebegin', html);

    var nav       = document.getElementById('site-nav');
    var hamburger = document.getElementById('nav-hamburger');
    var navLinks  = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    function closeMenu() {
      navLinks.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('is-open');
    }

    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.classList.toggle('is-open', open);
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a.nav-link')) closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (nav && !nav.contains(e.target)) closeMenu();
    });
  };
}());
