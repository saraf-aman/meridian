/* ============================================================
   MERIDIAN — workout-render.js
   Converts PHASE_CONFIG + WD.EX into DOM for a phase page.
   Must load after workout-data.js, before workout.js.
   ============================================================ */

var WorkoutRender = (function () {
  'use strict';

  /* ── SVG icons ─────────────────────────────────────────────── */
  var I = {
    chevron: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock:   '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 5.5v3l1.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    check:   '<svg viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn:    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2.5l5.5 10h-11z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 7v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.5" r="0.7" fill="currentColor"/></svg>',
    arrow:   '<svg viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M2 7.5h11M9 3.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ── Small helpers ─────────────────────────────────────────── */
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Set tracker dots ──────────────────────────────────────── */
  function setDots(count) {
    var n = parseInt(count, 10) || 0;
    var out = '<div class="set-tracker">';
    for (var i = 0; i < n; i++) {
      out += '<button class="set-dot" aria-label="Set ' + (i + 1) + '"></button>';
    }
    return out + '</div>';
  }

  /* ── Stat chips (sets×reps, tempo, weight) ─────────────────── */
  function statChips(ex) {
    var c  = '<span class="sc sr">' + esc(ex.sets + ' × ' + ex.reps) + '</span>';
    var tp = ex.tempo;
    if (tp && tp !== 'N/A') {
      var cls = (tp === 'Slow' || tp === 'Controlled') ? 'sc cont' : 'sc';
      c += '<span class="' + cls + '">' + esc(tp) + '</span>';
    }
    if (ex.weight) c += '<span class="sc wt">' + esc(ex.weight) + '</span>';
    return '<div class="stat-chips">' + c + '</div>';
  }

  /* ── Rest button ───────────────────────────────────────────── */
  function restBtn(secs) {
    if (!secs) return '';
    return '<button class="rest-btn" data-duration="' + esc(secs) + '">' + I.clock + esc(secs) + 's</button>';
  }

  /* ── Per-set weight section ────────────────────────────────── */
  function setWeightsSection(exName, setCount) {
    var n = parseInt(setCount, 10) || 0;
    var tags = '';
    for (var i = 0; i < n; i++) {
      tags += '<span class="weight-tag" data-set="' + i + '">Set ' + (i + 1) + ': <span class="wt-val">—</span></span>';
    }
    return '<div class="card-section set-weights" data-ex-name="' + esc(exName) + '">' +
      '<h5>Your weights</h5><div class="weight-row">' + tags + '</div></div>';
  }

  /* ── Exercise card ─────────────────────────────────────────── */
  function exCard(cfg, num) {
    var form = WD.EX[cfg.id];
    if (!form) return '<!-- unknown exercise: ' + cfg.id + ' -->';

    var steps = form.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    var stepsCol = '<div class="card-section"><h5>How to do it</h5><ol>' + steps + '</ol></div>';

    var mistakesCol = '';
    if (form.mistakes && form.mistakes.length) {
      var ms = form.mistakes.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('');
      mistakesCol = '<div class="card-section"><h5>Common Mistakes</h5><ul>' + ms + '</ul></div>';
    }

    var bodyInner = setWeightsSection(form.name, cfg.sets) + (mistakesCol
      ? '<div class="card-cols">' + stepsCol + mistakesCol + '</div>'
      : stepsCol);

    if (form.backNote) {
      bodyInner += '<div class="back-note"><strong>Back note: </strong>' + esc(form.backNote) + '</div>';
    }

    return [
      '<div class="exercise-card">',
        '<div class="exercise-card-header">',
          '<div class="ex-num">' + num + '</div>',
          '<div class="ex-title"><h4>' + esc(form.name) + '</h4>',
            '<div class="ex-muscles">' + esc(form.muscles) + '</div></div>',
          '<div class="ex-right">',
            statChips(cfg),
            setDots(cfg.sets),
            restBtn(cfg.rest),
            '<div class="chevron">' + I.chevron + '</div>',
          '</div>',
        '</div>',
        '<div class="exercise-card-body"><div class="card-content">',
          bodyInner,
        '</div></div>',
      '</div>'
    ].join('');
  }

  /* ── Cardio blocks ─────────────────────────────────────────── */
  function cardioBlocks(blocks) {
    return blocks.map(function (b) {
      var pills = '';
      if (b.intervals && b.intervals.length) {
        pills = '<div class="interval-row">' +
          b.intervals.map(function (iv) {
            return '<span class="' + (iv.type === 'rest' ? 'rest-pill' : 'int-pill') + '">' + esc(iv.label) + '</span>';
          }).join('') + '</div>';
      }
      return '<div class="cardio-block"><h5>' + esc(b.title) + '</h5>' +
        (b.desc ? '<p>' + esc(b.desc) + '</p>' : '') + pills + '</div>';
    }).join('');
  }

  /* ── Day panel content ─────────────────────────────────────── */
  function dayPanelContent(day) {
    var typeChip = { gym: '<span class="chip chip-accent">Gym</span>', cardio: '<span class="chip chip-green">Cardio</span>' }[day.type] || '';
    var durChip  = day.duration ? '<span class="chip chip-default">' + esc(day.duration) + '</span>' : '';

    var head = [
      '<div class="session-head">',
        '<div><h3>' + esc(day.title) + '</h3>',
          (day.desc ? '<p>' + esc(day.desc) + '</p>' : ''),
        '</div>',
        '<div class="session-head-right">' + durChip + typeChip + '</div>',
      '</div>'
    ].join('');

    if (day.type === 'rest') {
      return head + '<div class="rest-day-msg">Full rest day — recover, eat well, sleep.</div>';
    }
    if (day.type === 'cardio') {
      return head + cardioBlocks(day.cardio || []);
    }
    // gym
    var exercises = (day.exercises || []).map(function (ex, i) { return exCard(ex, i + 1); }).join('');
    return head +
      '<div class="session-controls"><button class="btn-reset">Reset day</button></div>' +
      '<div class="exercise-list">' + exercises + '</div>';
  }

  /* ── Day selector (sticky bar) ─────────────────────────────── */
  function daySelector(sessions, panelId) {
    var btns = Object.keys(sessions).map(function (key, idx) {
      var d = sessions[key];
      return '<button class="day-btn' + (idx === 0 ? ' active' : '') + '" data-day="' + key + '">' +
        esc(d.label) + '<small>' + esc(d.sub) + '</small></button>';
    }).join('');
    return '<div class="day-selector" data-panel="' + panelId + '">' + btns + '</div>';
  }

  /* ── Day panels wrap ───────────────────────────────────────── */
  function dayPanelsWrap(sessions, panelId) {
    var panels = Object.keys(sessions).map(function (key, idx) {
      return '<div class="day-panel' + (idx === 0 ? ' active' : '') + '" data-day="' + key + '">' +
        dayPanelContent(sessions[key]) + '</div>';
    }).join('');
    return '<div class="day-panels-wrap" data-panel="' + panelId + '">' + panels + '</div>';
  }

  /* ── Back safety accordion ─────────────────────────────────── */
  function backSafety() {
    var flags = [
      ['Sharp shooting pain anywhere along the spine',        'Stop the exercise. Rest 48 hours minimum.'],
      ['Tingling or numbness down either leg',                'Stop immediately. See a doctor before your next session.'],
      ['The same nerve-like sensation as your original injury','Stop immediately. This is a direct warning. Rest and assess.'],
      ['Lower back pain persisting more than 30 min post-session', 'Do not train the next day. If it continues 48+ hours, see a doctor.'],
      ['Pain that gets worse as the session progresses',      'Stop the session. Mild DOMS easing during warm-up is normal — pain that builds is not.']
    ];
    var greens = [
      'Mild muscle soreness 24–48 hours after training — this is DOMS, completely normal.',
      'A feeling of tightness after a long sitting day — warm up slowly and it will ease.',
      'Mild fatigue in back muscles after core work — muscles working, not injury.'
    ];
    var flagRows = flags.map(function (f) {
      return '<tr><td>' + esc(f[0]) + '</td><td>' + esc(f[1]) + '</td></tr>';
    }).join('');
    var greenItems = greens.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('');

    return [
      '<div class="back-safety" id="back-safety">',
        '<div class="back-safety-header">',
          '<div class="bs-icon">' + I.warn + '</div>',
          '<div class="bs-title">',
            '<h4>Back Safety Protocol</h4>',
            '<span>Applies to every session across all phases</span>',
          '</div>',
          '<div class="bs-chevron">' + I.chevron + '</div>',
        '</div>',
        '<div class="back-safety-body"><div class="bs-content">',
          '<div class="bs-block">',
            '<h5>Red Flag Symptoms — Stop Immediately</h5>',
            '<table class="red-flag-table">',
              '<thead><tr><th>Symptom</th><th>What to do</th></tr></thead>',
              '<tbody>' + flagRows + '</tbody>',
            '</table>',
          '</div>',
          '<div class="bs-block">',
            '<h5>Normal Sensations — Do Not Panic</h5>',
            '<ul class="green-list">' + greenItems + '</ul>',
          '</div>',
        '</div></div>',
      '</div>'
    ].join('');
  }

  /* ── Warmup reference accordion ────────────────────────────── */
  function warmupRef() {
    var eveningRows = [
      ['Treadmill walk',             '3 min',         '4.5–5.5 km/h, 0% incline — gets blood moving.'],
      ['Arm circles (fwd + back)',   '10 each arm',   'Large, smooth circles from the shoulder.'],
      ['Hip circles',                '10 each way',   'Hands on hips, large hula-hoop motion.'],
      ['Leg swings (front/back)',    '10 each leg',   'Hold wall for balance. Controlled pendulum.'],
      ['Leg swings (side to side)',  '10 each leg',   'Same support. Swing across and out.'],
      ['Bodyweight squat (slow)',    '8 reps',        '3 sec down, pause — movement rehearsal only.'],
      ['Glute bridge (bodyweight)',  '10 reps',       'Activates glutes and lower back safely.'],
      ['Dead bug (slow)',            '4 each side',   'Lower back pressed to floor throughout.']
    ];
    var morningRows = [
      ['Slow walk',                  '5 min',         '4.0–4.5 km/h — raise core temp, decompress spine.'],
      ['Cat-cow stretch',            '10 reps',       'On hands and knees. Arch up (cat), dip belly (cow), 2 sec each.'],
      ['Child\'s pose',              '30 sec',        'Hips to heels, arms extended. Breathe deeply.'],
      ['Lying knee-to-chest',        '5 each side',   'Pull one knee to chest, 10 sec hold. Releases lower back.'],
      ['Glute bridge (bodyweight)',  '12 reps',       'More reps in the morning — glutes are slower to activate.'],
      ['Bodyweight squat (slow)',    '10 reps',       '3 sec down, pause, stand.'],
      ['Leg swings + arm circles',  '10 each',       'As described above.']
    ];

    function tableOf(rows) {
      return '<table class="routine-table"><thead><tr><th>Movement</th><th>Reps / Time</th><th>Notes</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') +
        '</tbody></table>';
    }

    return [
      '<div class="ref-block" id="warmup-guide">',
        '<div class="ref-header"><h4>Warm-Up Guide</h4>',
          '<div class="ref-header-right"><span class="chip chip-default">8–15 min</span>',
            '<div class="chevron">' + I.chevron + '</div></div></div>',
        '<div class="ref-body"><div class="ref-content">',
          '<div class="mini-tabs" data-group="warmup">',
            '<button class="mini-tab active" data-tab="evening">Evening (Mon / Wed / Fri)</button>',
            '<button class="mini-tab" data-tab="morning">Morning (Sat)</button>',
          '</div>',
          '<div class="mini-panel active" data-group="warmup" data-tab="evening">',
            '<p>Body already warm from daily movement. Goal: joint mobilisation and muscle activation. Start with a 3 min treadmill walk, then:</p>',
            tableOf(eveningRows),
          '</div>',
          '<div class="mini-panel" data-group="warmup" data-tab="morning">',
            '<p>Coming off sleep — spine compressed, muscles cold. More time needed. Start with a 5 min slow walk, then:</p>',
            tableOf(morningRows),
          '</div>',
        '</div></div>',
      '</div>'
    ].join('');
  }

  /* ── Transition checklist ───────────────────────────────────── */
  function checklist(cfg) {
    var groups = cfg.groups.map(function (g) {
      var items = g.items.map(function (item, i) {
        var key = 'p' + cfg.phase + '-' + g.label.toLowerCase().replace(/\s+/g, '-') + '-' + i;
        return [
          '<div class="cl-item" data-key="' + key + '">',
            '<div class="cl-box"><div class="cl-check">' + I.check + '</div></div>',
            '<div class="cl-text">' + esc(item) + '</div>',
          '</div>'
        ].join('');
      }).join('');
      return '<div class="checklist-group"><div class="checklist-label">' + esc(g.label) +
        '</div><div class="checklist">' + items + '</div></div>';
    }).join('');

    return [
      '<div class="ref-block" id="transition-checklist">',
        '<div class="ref-header"><h4>' + esc(cfg.title) + '</h4>',
          '<div class="ref-header-right"><div class="chevron">' + I.chevron + '</div></div></div>',
        '<div class="ref-body"><div class="ref-content">',
          '<p>' + esc(cfg.desc) + '</p>',
          groups,
        '</div></div>',
      '</div>'
    ].join('');
  }

  /* ── Timer FAB ─────────────────────────────────────────────── */
  function timerFAB() {
    return [
      '<button class="timer-fab" id="timer-fab" aria-label="Rest timer">',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
          '<circle cx="12" cy="13" r="8" stroke="currentColor" stroke-width="1.5"/>',
          '<path d="M12 9.5v3.5l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
          '<path d="M9 3h6M12 3v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        '</svg>',
      '</button>',
      '<div class="timer-widget" id="timer-widget">',
        '<div class="ring-wrap">',
          '<svg viewBox="0 0 108 108">',
            '<circle class="ring-track" cx="54" cy="54" r="45"/>',
            '<circle class="ring-arc"   cx="54" cy="54" r="45"/>',
          '</svg>',
          '<div class="timer-digits">1:30</div>',
        '</div>',
        '<div class="timer-presets">',
          '<button class="t-preset" data-duration="60">60s</button>',
          '<button class="t-preset active" data-duration="90">90s</button>',
          '<button class="t-preset" data-duration="120">2 min</button>',
        '</div>',
        '<div class="timer-btns">',
          '<button class="t-btn" id="t-start-stop">Start</button>',
          '<button class="t-btn" id="t-reset">Reset</button>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ── Main entry point ──────────────────────────────────────── */
  function buildPhase(cfg) {
    var root = document.getElementById('page-root');
    if (!root) return;
    var pid = 'p' + cfg.num;
    var html = '';

    /* Workout header */
    html += '<div class="workout-header"><div class="container">' +
      '<h1>' + esc(cfg.title) + '</h1>' +
      '<p>' + esc(cfg.subtitle) + ' &nbsp;·&nbsp; ' + esc(cfg.tagline) + '</p>' +
      '</div></div>';

    /* Sticky day-tab bar */
    html += '<div class="phase-bar"><div class="phase-bar-inner">' +
      daySelector(cfg.sessions, pid) +
      '</div></div>';

    /* Main content */
    html += '<div class="container">';
    html += dayPanelsWrap(cfg.sessions, pid);

    /* Reference blocks */
    html += '<div class="phase-refs">';
    html += backSafety();
    html += warmupRef();
    if (cfg.checklist) html += checklist(cfg.checklist);
    html += '</div>';

    html += '</div>'; /* /container */

    /* Timer FAB lives outside the container */
    html += timerFAB();

    root.innerHTML = html;

    /* Scroll to hash anchor after dynamic render */
    if (window.location.hash) {
      requestAnimationFrame(function () {
        var target = document.getElementById(window.location.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  return { buildPhase: buildPhase };
}());
