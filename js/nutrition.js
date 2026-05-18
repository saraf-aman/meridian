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

  function init() {
    bindRefBlocks();
  }

  return { init: init };
}());
