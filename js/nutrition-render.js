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
  function buildSchedule(schedule) {
    var officeToday = [1, 2, 3].indexOf(new Date().getDay()) !== -1;

    function scheduleTable(rows) {
      var t = '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
      t += '<table class="schedule-table">';
      t += '<thead><tr><th>Time</th><th>Action</th><th>Notes</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        t += '<tr' + (r.critical ? ' class="row-critical"' : '') + '>';
        t += '<td>' + esc(r.time) + (r.critical ? '<span class="critical-badge">Critical</span>' : '') + '</td>';
        t += '<td>' + esc(r.action) + '</td>';
        t += '<td>' + esc(r.notes) + '</td>';
        t += '</tr>';
      });
      t += '</tbody></table></div>';
      return t;
    }

    var h = '';
    h += '<div class="container">';

    h += '<div class="nutrition-header">';
    h += '<h1>Daily Schedule</h1>';
    h += '<p>Fixed anchors for every day — office and WFH. The structure that makes everything else work.</p>';
    h += '</div>';

    h += '<div class="mini-tabs" data-group="schedule">';
    h += '<button class="mini-tab' + (officeToday ? ' active' : '') + '" data-tab="office">Office Days <span style="font-weight:400;opacity:0.7;">Mon–Wed</span></button>';
    h += '<button class="mini-tab' + (!officeToday ? ' active' : '') + '" data-tab="wfh">WFH / Home <span style="font-weight:400;opacity:0.7;">Thu–Sun</span></button>';
    h += '</div>';

    h += '<div class="mini-panel' + (officeToday ? ' active' : '') + '" data-group="schedule" data-tab="office">';
    h += scheduleTable(schedule.office);
    h += '</div>';

    h += '<div class="mini-panel' + (!officeToday ? ' active' : '') + '" data-group="schedule" data-tab="wfh">';
    h += scheduleTable(schedule.wfh);
    h += '</div>';

    h += '</div>';
    root().innerHTML = h;
  }
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
  function buildDinner(rotation, reheating, fallbacks, recipe) {
    var h = '';
    h += '<div class="container">';

    h += '<div class="nutrition-header">';
    h += '<h1>Dinner Rotation</h1>';
    h += '<p>7-day rotation with built-in leftover lunch coverage for WFH days.</p>';
    h += '</div>';

    // ── Dinner cards ──────────────────────────────────────────────
    h += '<div class="dinner-cards">';
    rotation.forEach(function (d) {
      var typeClass = d.type === 'Gym'    ? 'type-chip type-chip--gym'
                    : d.type === 'Cardio' ? 'type-chip type-chip--cardio'
                    :                       'type-chip type-chip--rest';
      h += '<div class="dinner-card">';
      h += '<div class="dinner-card-header">';
      h += '<div class="dinner-day">' + esc(d.day) + '</div>';
      h += '<div class="dinner-card-main">';
      h += '<div class="dinner-card-name">' + esc(d.name) + '</div>';
      h += '<div class="dinner-chips">';
      h += '<span class="' + typeClass + '">' + esc(d.type) + '</span>';
      h += '<span class="chip-time">⏱ ' + esc(d.cookTime) + '</span>';
      if (d.leftover) {
        h += '<span class="chip-leftover">→ covers ' + esc(d.leftover) + '</span>';
      }
      h += '</div>';
      h += '</div>';
      h += '</div>';
      if (d.notes) {
        h += '<div class="dinner-card-notes">' + esc(d.notes) + '</div>';
      }
      h += '</div>';
    });
    h += '</div>';

    // ── WFH Leftover System ───────────────────────────────────────
    h += '<h2 class="nut-section-head">WFH Leftover System</h2>';

    h += '<div class="ref-block open" id="reheating">';
    h += '<div class="ref-header"><h4>How to Reheat</h4>';
    h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div></div>';
    h += '<div class="ref-body"><div class="ref-content">';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>Dish</th><th>Method</th></tr></thead><tbody>';
    reheating.forEach(function (r) {
      h += '<tr><td>' + esc(r.dish) + '</td><td>' + esc(r.method) + '</td></tr>';
    });
    h += '</tbody></table></div>';
    h += '</div></div></div>';

    h += '<div class="ref-block" id="no-leftovers">';
    h += '<div class="ref-header"><h4>When There Are No Leftovers</h4>';
    h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div></div>';
    h += '<div class="ref-body"><div class="ref-content"><ul>';
    fallbacks.forEach(function (f) {
      var text = f.name + (f.time ? ' — ' + f.time : '') + (f.note ? ' · ' + f.note : '');
      h += '<li>' + esc(text) + '</li>';
    });
    h += '</ul></div></div></div>';

    // ── Paneer Bhurji Recipe ──────────────────────────────────────
    h += '<h2 class="nut-section-head">Fallback Dinner — Paneer Bhurji</h2>';

    h += '<div class="ref-block" id="bhurji-recipe">';
    h += '<div class="ref-header">';
    h += '<h4>' + esc(recipe.name) + '</h4>';
    h += '<div class="ref-header-right">';
    h += '<span class="chip chip-default">' + esc(recipe.time) + '</span>';
    h += '<span class="chip chip-green">' + esc(recipe.protein) + ' protein</span>';
    h += '<div class="chevron">' + chevron() + '</div>';
    h += '</div></div>';
    h += '<div class="ref-body"><div class="ref-content">';

    h += '<h5 style="margin-bottom:10px;">Always Keep Stocked</h5>';
    h += '<ul>';
    recipe.alwaysStock.forEach(function (item) { h += '<li>' + esc(item) + '</li>'; });
    h += '</ul>';

    h += '<h5 style="margin-top:20px;margin-bottom:10px;">Method</h5>';
    h += '<ol>';
    recipe.steps.forEach(function (step) { h += '<li>' + esc(step) + '</li>'; });
    h += '</ol>';

    h += '</div></div></div>';

    h += '</div>';
    root().innerHTML = h;
  }
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
  function buildHealth(health) {
    var h = '';
    h += '<div class="container">';

    h += '<div class="nutrition-header">';
    h += '<h1>Health Tracking</h1>';
    h += '<p>A1C management, protein sources, and workout nutrition timing.</p>';
    h += '</div>';

    // ── A1C Panel ─────────────────────────────────────────────────
    h += '<div class="health-panel">';
    h += '<h3>A1C &amp; Blood Sugar — Private</h3>';

    h += '<div class="a1c-stats">';
    h += '<div class="a1c-stat"><div class="a1c-stat-label">Current</div><div class="a1c-stat-value">' + esc(health.a1c.current) + '</div></div>';
    h += '<div class="a1c-stat"><div class="a1c-stat-label">Target</div><div class="a1c-stat-value">' + esc(health.a1c.target) + '</div></div>';
    h += '<div class="a1c-stat"><div class="a1c-stat-label">Status</div><div class="a1c-stat-value" style="font-size:0.88rem;">' + esc(health.a1c.status) + '</div></div>';
    h += '</div>';

    h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">';
    h += '<label for="a1c-last-tested" style="font-size:0.75rem;font-weight:600;color:var(--red);white-space:nowrap;">Last blood test</label>';
    h += '<input type="date" id="a1c-last-tested" style="font-size:0.82rem;padding:4px 8px;border:1px solid rgba(184,50,50,0.25);border-radius:var(--r-sm);background:rgba(255,255,255,0.5);color:var(--text-1);">';
    h += '</div>';

    health.a1c.rules.forEach(function (rule) {
      h += '<div style="padding:10px 0;border-top:1px solid rgba(184,50,50,0.12);">';
      h += '<div style="font-size:0.82rem;font-weight:600;color:var(--text-1);margin-bottom:3px;">' + esc(rule.title) + '</div>';
      h += '<div style="font-size:0.78rem;color:var(--text-2);line-height:1.5;">' + esc(rule.detail) + '</div>';
      h += '</div>';
    });

    h += '</div>';

    h += '<div class="ref-block" id="already-good">';
    h += '<div class="ref-header"><h4>What\'s Already Working</h4>';
    h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div></div>';
    h += '<div class="ref-body"><div class="ref-content"><ul>';
    health.a1c.alreadyGood.forEach(function (item) { h += '<li>' + esc(item) + '</li>'; });
    h += '</ul></div></div></div>';

    // ── Protein Sources ───────────────────────────────────────────
    h += '<h2 class="nut-section-head">Protein Sources</h2>';

    h += '<div class="ref-block open" id="protein-sources">';
    h += '<div class="ref-header"><h4>What Your Foods Actually Deliver</h4>';
    h += '<div class="ref-header-right"><div class="chevron">' + chevron() + '</div></div></div>';
    h += '<div class="ref-body"><div class="ref-content">';
    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>Food</th><th>Serving</th><th>Protein</th><th>Calories</th><th>Notes</th></tr></thead><tbody>';
    health.proteinSources.forEach(function (s) {
      h += '<tr>';
      h += '<td>' + esc(s.food) + '</td>';
      h += '<td>' + esc(s.serving) + '</td>';
      h += '<td><span class="protein-green">' + esc(s.protein) + '</span></td>';
      h += '<td>' + esc(s.calories) + ' kcal</td>';
      h += '<td style="color:var(--text-3);">' + esc(s.notes) + '</td>';
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    h += '</div></div></div>';

    // ── Pre & Post Workout ────────────────────────────────────────
    h += '<h2 class="nut-section-head">Pre &amp; Post Workout</h2>';

    var tabs = [health.prePostWorkout.gym, health.prePostWorkout.cardio, health.prePostWorkout.rest];
    var keys = ['gym', 'cardio', 'rest'];

    h += '<div class="mini-tabs" data-group="pwo">';
    tabs.forEach(function (tab, i) {
      h += '<button class="mini-tab' + (i === 0 ? ' active' : '') + '" data-tab="' + keys[i] + '">' + esc(tab.label) + '</button>';
    });
    h += '</div>';

    tabs.forEach(function (tab, i) {
      h += '<div class="mini-panel' + (i === 0 ? ' active' : '') + '" data-group="pwo" data-tab="' + keys[i] + '">';
      h += '<div style="font-size:0.75rem;color:var(--text-3);margin-bottom:12px;">' + esc(tab.days) + '</div>';
      h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
      h += '<table class="schedule-table"><thead><tr><th>Timing</th><th>What</th></tr></thead><tbody>';
      tab.items.forEach(function (item) {
        h += '<tr' + (item.critical ? ' class="row-critical"' : '') + '>';
        h += '<td>' + esc(item.timing) + '</td><td>' + esc(item.what) + '</td>';
        h += '</tr>';
      });
      h += '</tbody></table></div>';
      h += '</div>';
    });

    // ── Weekly Protein Snapshot ───────────────────────────────────
    h += '<h2 class="nut-section-head">Weekly Protein Snapshot</h2>';

    h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">';
    h += '<table class="schedule-table">';
    h += '<thead><tr><th>Day</th><th>Type</th><th>Dinner</th><th>No Whey</th><th>With Whey</th></tr></thead><tbody>';
    health.proteinSnapshot.forEach(function (row) {
      h += '<tr>';
      h += '<td>' + esc(row.day) + '</td>';
      h += '<td>' + esc(row.type) + '</td>';
      h += '<td>' + esc(row.dinner) + '</td>';
      h += '<td>' + esc(row.noWhey) + '</td>';
      h += '<td><span class="' + (row.onTarget ? 'protein-green' : 'protein-amber') + '">' + esc(row.withWhey) + '</span></td>';
      h += '</tr>';
    });
    h += '<tr style="background:var(--surface-2);font-weight:600;">';
    h += '<td colspan="3">Weekly average</td>';
    h += '<td>~77g</td>';
    h += '<td><span class="protein-green">~93g</span></td>';
    h += '</tr>';
    h += '</tbody></table></div>';

    h += '</div>';
    root().innerHTML = h;
  }

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
