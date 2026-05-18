var NutritionRender = (function () {
  'use strict';

  function root() { return document.getElementById('page-root'); }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function chevron() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function prow(label, value) {
    return '<div class="product-row"><span class="product-row-label">' + esc(label) + '</span><span class="product-row-value">' + esc(value) + '</span></div>';
  }

  // ── Auth walls ───────────────────────────────────────────────

  function buildAuthWall() {
    root().innerHTML =
      '<div class="container">' +
        '<div class="auth-wall">' +
          '<div class="auth-wall-icon">🔒</div>' +
          '<h2 class="auth-wall-title">Your nutrition plan is private</h2>' +
          '<p class="auth-wall-desc">Sign in with your Google account to access your personalised meal plans, macros, and dietary guidance.</p>' +
          '<button class="auth-wall-btn" id="aw-sign-in">Sign in with Google</button>' +
        '</div>' +
      '</div>';
    var btn = document.getElementById('aw-sign-in');
    if (btn && window.meridianAuth) {
      btn.addEventListener('click', function () {
        window.meridianAuth.signInWithGoogle().catch(function () {});
      });
    }
  }

  function buildUnauthorizedWall() {
    root().innerHTML =
      '<div class="container">' +
        '<div class="auth-wall">' +
          '<div class="auth-wall-icon">⛔</div>' +
          '<h2 class="auth-wall-title">Access restricted</h2>' +
          '<p class="auth-wall-desc">This section is private. Your account doesn\'t have access to the nutrition plan.</p>' +
        '</div>' +
      '</div>';
  }

  // ── Page stubs (replaced in later build steps) ───────────────

  function _stub(name) {
    root().innerHTML =
      '<div class="container" style="padding:60px 0;text-align:center;color:var(--text-3);">' +
        '<p style="font-size:1.1rem;font-weight:600;">' + name + '</p>' +
        '<p style="font-size:0.84rem;margin-top:8px;">This page is being built.</p>' +
      '</div>';
  }

  function buildIndex(navLinks) {
    var base = (window._basePath || '') + 'pages/nutrition/';
    var h = '';
    h += '<div class="container">';
    h += '<div class="nutrition-header">';
    h += '<h1>Nutrition</h1>';
    h += '<p>Your personalised meal plans, macros, and dietary guidance.</p>';
    h += '</div>';
    h += '<div class="nut-nav-links">';
    navLinks.forEach(function (link) {
      h += '<a class="nut-nav-link" href="' + esc(base + link.href) + '">';
      h += '<span class="nut-nav-link-icon">' + link.icon + '</span>';
      h += esc(link.label);
      h += '</a>';
    });
    h += '</div>';
    h += '</div>';
    root().innerHTML = h;
  }
  function buildSchedule()    { _stub('Daily Schedule'); }
  function buildMealPlan()    { _stub('7-Day Meal Plan'); }
  function buildLunch(options, rotation) {
    var h = '';
    h += '<div class="container">';

    h += '<div class="nutrition-header">';
    h += '<h1>Office Lunch</h1>';
    h += '<p>Rotation of 5 options matched to your gym and rest days.</p>';
    h += '</div>';

    // Weekly rotation table
    h += '<h2 class="nut-section-head">Weekly Rotation</h2>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>Day</th><th>Type</th><th>Lunch</th></tr></thead><tbody>';
    rotation.forEach(function (r) {
      var typeClass = r.type === 'Gym' ? 'type-chip type-chip--gym' : r.type === 'Cardio' ? 'type-chip type-chip--cardio' : 'type-chip type-chip--rest';
      h += '<tr>';
      h += '<td>' + esc(r.day) + '</td>';
      h += '<td><span class="' + typeClass + '">' + esc(r.type) + '</span></td>';
      h += '<td>' + esc(r.option) + '</td>';
      h += '</tr>';
    });
    h += '</tbody></table></div>';

    // Lunch option cards
    h += '<h2 class="nut-section-head">Lunch Options</h2>';
    h += '<div class="lunch-cards">';
    options.forEach(function (opt) {
      var typeClass = opt.type === 'gym' ? 'type-chip type-chip--gym' : opt.type === 'cardio' ? 'type-chip type-chip--cardio' : 'type-chip type-chip--rest';
      h += '<div class="lunch-card">';
      h += '<div class="lunch-card-header">';
      h += '<div class="lunch-card-name">' + esc(opt.name) + '</div>';
      h += '<span class="' + typeClass + '">' + esc(opt.type === 'gym' ? 'Gym' : opt.type === 'cardio' ? 'Cardio' : 'Rest') + '</span>';
      h += '</div>';
      h += '<div class="lunch-card-meta">';
      h += '<span class="lunch-card-protein">' + esc(opt.protein) + ' protein</span>';
      h += '<span class="lunch-card-freq">' + esc(opt.freq) + '</span>';
      h += '</div>';
      h += '<div class="lunch-card-days">' + esc(opt.bestDays) + '</div>';
      h += '<div class="lunch-card-order">' + esc(opt.order) + '</div>';
      h += '<div class="lunch-card-note">' + esc(opt.note) + '</div>';
      h += '</div>';
    });
    h += '</div>';

    h += '</div>';
    root().innerHTML = h;
  }
  function buildDinner()      { _stub('Dinner Rotation'); }
  function buildSupplements(supp, breakfast, fruits) {
    var h = '';
    h += '<div class="container">';

    // Page header
    h += '<div class="nutrition-header">';
    h += '<h1>Supplements</h1>';
    h += '<p>Whey protein guide, breakfast options, and daily fruit habits.</p>';
    h += '</div>';

    // ── Whey Protein ────────────────────────────────────────────
    h += '<h2 class="nut-section-head">Whey Protein</h2>';

    // Product card
    h += '<div class="product-card">';
    h += '<div class="product-card-name">' + esc(supp.product.name) + '</div>';
    h += '<div class="product-card-sub">' + esc(supp.product.flavor) + '</div>';
    h += '<div class="product-rows">';
    h += prow('Size', supp.product.size);
    h += prow('Per serving', supp.product.perServing);
    h += prow('Certified', supp.product.certifications);
    h += prow('Cost', supp.product.cost);
    h += prow('Mixing', supp.product.mixMethod);
    h += '</div>';
    h += '</div>';

    // Where to buy
    h += '<div class="product-card">';
    h += '<div class="product-card-name">Where to Buy</div>';
    h += '<div class="product-rows" style="margin-top:8px;">';
    h += prow('Store', supp.whereToBuy.store);
    h += prow('Address', supp.whereToBuy.address);
    h += prow('Ask for', supp.whereToBuy.ask);
    h += '</div>';
    h += '</div>';

    // When to start
    h += '<div class="product-card">';
    h += '<div class="product-card-name">When to Start</div>';
    h += '<div class="product-rows" style="margin-top:8px;">';
    supp.introTimeline.forEach(function (t) {
      h += prow(t.week, t.action);
    });
    h += '</div>';
    h += '<div style="margin-top:16px;padding:12px 16px;background:var(--accent-dim);border-radius:var(--r-md);font-size:0.85rem;color:var(--accent);font-weight:600;">' + esc(supp.rule) + '</div>';
    h += '</div>';

    // Timing table
    h += '<h2 class="nut-section-head">Daily Timing</h2>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>When</th><th>How to mix</th><th>Protein</th></tr></thead><tbody>';
    supp.timing.forEach(function (t) {
      h += '<tr><td>' + esc(t.when) + '</td><td>' + esc(t.how) + '</td><td>' + esc(t.protein) + '</td></tr>';
    });
    h += '</tbody></table></div>';

    // What NOT to Buy (collapsible)
    h += '<div class="ref-block" id="not-buy" style="margin-top:20px;">';
    h += '<div class="ref-header">';
    h += '<h4>What NOT to Buy</h4>';
    h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div>';
    h += '</div>';
    h += '<div class="ref-body"><div class="ref-content"><div>';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>Supplement</th><th>Why to avoid</th></tr></thead><tbody>';
    supp.doNotBuy.forEach(function (d) {
      h += '<tr><td>' + esc(d.item) + '</td><td style="color:var(--text-2);">' + esc(d.reason) + '</td></tr>';
    });
    h += '</tbody></table>';
    h += '</div></div></div></div>';
    h += '</div>';

    // ── Breakfast Options ────────────────────────────────────────
    h += '<h2 class="nut-section-head">Breakfast Options</h2>';
    h += '<div class="breakfast-cards">';
    breakfast.forEach(function (b) {
      var badge = b.type === 'keep'
        ? '<span class="badge-keep">Keep</span>'
        : '<span class="badge-limit">Limit</span>';
      h += '<div class="breakfast-card">';
      h += '<div class="breakfast-card-header">';
      h += '<div class="breakfast-card-name">' + esc(b.name) + '</div>';
      h += badge;
      h += '</div>';
      h += '<div class="breakfast-card-when">' + esc(b.when) + '</div>';
      h += '<div class="breakfast-card-note">' + esc(b.note) + '</div>';
      h += '</div>';
    });
    h += '</div>';

    // ── Fruit Habit System ────────────────────────────────────────
    h += '<h2 class="nut-section-head">Fruit Habit System</h2>';

    [fruits.banana, fruits.grapes].forEach(function (sys, i) {
      var id = i === 0 ? 'fruit-banana' : 'fruit-grapes';
      h += '<div class="ref-block open" id="' + id + '">';
      h += '<div class="ref-header"><h4>' + esc(sys.title) + '</h4>';
      h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div></div>';
      h += '<div class="ref-body"><div class="ref-content"><ul>';
      sys.rules.forEach(function (r) { h += '<li>' + esc(r) + '</li>'; });
      h += '</ul></div></div></div>';
    });

    h += '</div>'; // .container
    root().innerHTML = h;
  }
  function buildHealth()      { _stub('Health Tracking'); }

  return {
    buildAuthWall,
    buildUnauthorizedWall,
    buildIndex,
    buildSchedule,
    buildMealPlan,
    buildLunch,
    buildDinner,
    buildSupplements,
    buildHealth,
  };
}());
