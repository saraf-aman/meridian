window.NutritionInteract = (function () {
  'use strict';

  function bindRefBlocks() {
    document.querySelectorAll('.ref-block').forEach(function (block) {
      var header = block.querySelector('.ref-header');
      if (!header) return;
      header.addEventListener('click', function () {
        block.classList.toggle('open');
      });
    });
  }

  function bindMiniTabs() {
    document.querySelectorAll('.mini-tabs').forEach(function (strip) {
      var group = strip.getAttribute('data-group');
      strip.querySelectorAll('.mini-tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tab = btn.getAttribute('data-tab');
          strip.querySelectorAll('.mini-tab').forEach(function (b) { b.classList.remove('active'); });
          document.querySelectorAll('.mini-panel[data-group="' + group + '"]').forEach(function (p) { p.classList.remove('active'); });
          btn.classList.add('active');
          var panel = document.querySelector('.mini-panel[data-group="' + group + '"][data-tab="' + tab + '"]');
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  function bindA1cDate() {
    var input = document.getElementById('a1c-last-tested');
    if (!input) return;
    var stored = localStorage.getItem('m-a1c-last-tested');
    if (stored) input.value = stored;
    input.addEventListener('change', function () {
      localStorage.setItem('m-a1c-last-tested', input.value);
    });
  }

  function init() {
    bindRefBlocks();
    bindMiniTabs();
    bindA1cDate();
  }

  return { init: init };
}());
