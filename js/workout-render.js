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
  function setWeightsSection(exName, setCount, repsStr) {
    var n = parseInt(setCount, 10) || 0;
    var tags = '';
    for (var i = 0; i < n; i++) {
      tags += '<span class="weight-tag" data-set="' + i + '">Set ' + (i + 1) + ': <span class="wt-val">—</span></span>';
    }
    return '<div class="card-section set-weights" data-ex-name="' + esc(exName) + '" data-reps="' + esc(repsStr || '') + '">' +
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

    var bodyInner = setWeightsSection(form.name, cfg.sets, cfg.reps) + (mistakesCol
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
    function wuStep(name, dur, steps, note) {
      var stepsHtml = steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
      var noteHtml  = note ? '<p class="wu-note"><strong>Important: </strong>' + esc(note) + '</p>' : '';
      return [
        '<div class="wu-step">',
          '<div class="wu-step-header">',
            '<span class="wu-step-name">' + esc(name) + '</span>',
            '<span class="wu-step-dur">' + esc(dur) + '</span>',
          '</div>',
          '<ol>' + stepsHtml + '</ol>',
          noteHtml,
        '</div>'
      ].join('');
    }

    var eveningSteps = [
      wuStep('Treadmill Walk', '3 min', [
        'Set the treadmill speed to 4.5–5.5 km/h — a purposeful walking pace, slightly faster than casual.',
        'Set incline to 0%.',
        'Walk for 3 full minutes. This gets blood flowing to your legs, hips and core without taxing the system. You should feel slightly warmer by the end.'
      ]),
      wuStep('Arm Circles — Forward', '10 each arm', [
        'Stand tall with your feet shoulder-width apart.',
        'Extend one arm fully out to the side.',
        'Draw large circles forward from the shoulder — think of making the biggest possible circle, not a small tight one.',
        'Keep the movement smooth and controlled. Complete 10 circles, then switch arms.'
      ]),
      wuStep('Arm Circles — Backward', '10 each arm', [
        'Same as forward arm circles but reverse the direction.',
        'Extend one arm fully, draw 10 large circles going backward, then switch arms.',
        'This loosens the shoulder joint in the opposite direction and is especially important before any pressing or rowing movements.'
      ]),
      wuStep('Shoulder Cross-Body Stretch', '5 each side, 5 sec hold', [
        'Bring your right arm straight across your chest at shoulder height.',
        'Use your left hand to gently press your right arm closer to your chest.',
        'You should feel a stretch in the rear of your right shoulder. Hold for 5 seconds.',
        'Do not yank — gentle, steady pressure. Switch arms and repeat. Do 5 holds per side.'
      ]),
      wuStep('Neck Rolls — Half Circle Only', '5 each side', [
        'Stand or sit comfortably. Drop your chin slowly toward your chest.',
        'From there, slowly roll your head to the right shoulder. Hold 2 seconds at the side.',
        'Return your chin back to the centre (chest position), then roll to the left shoulder.',
        'Hold 2 seconds, then return to centre. That is one rep.',
        'Only do half circles — from shoulder to shoulder through the front. Never roll your neck backward (ear toward shoulder going backward) as this can compress the cervical spine.'
      ], 'Only roll front to side. Never roll the neck backward.'),
      wuStep('Hip Circles', '10 each direction', [
        'Stand with feet shoulder-width apart, hands resting on your hips.',
        'Imagine you have a hula hoop around your waist. Begin drawing large slow circles with your hips.',
        'Keep your upper body relatively still — the movement comes from the hips only.',
        'Do 10 circles in one direction, then reverse for 10 in the other direction.',
        'This loosens the hip joints and lower back before any leg work.'
      ]),
      wuStep('Leg Swings — Front to Back', '10 each leg', [
        'Stand next to a wall or machine and place one hand on it for balance.',
        'Lift your right foot slightly off the floor and swing it forward and backward like a pendulum.',
        'Keep the movement controlled — this is not a kick. Swing as high as is comfortable without forcing range.',
        'Count 10 swings, then switch to the left leg.',
        'This loosens the hip flexors and glutes before squatting or pressing movements.'
      ]),
      wuStep('Leg Swings — Side to Side', '10 each leg', [
        'Stay holding the wall with one hand for balance.',
        'Swing your right leg across the front of your body to the left, then out to the right side.',
        'Again, controlled pendulum motion — not a forced kick. The leg crosses your midline going one way.',
        'Do 10 swings, then switch to the left leg.',
        'This opens up the inner thigh and outer hip — areas that tighten from sitting.'
      ]),
      wuStep('Bodyweight Squat — Slow', '8 reps', [
        'Stand with feet shoulder-width apart, toes pointed slightly outward (about 15–20 degrees).',
        'Hold your arms out in front for counterbalance if needed.',
        'Lower slowly, counting 3 seconds on the way down. Push your knees outward in the direction your toes point.',
        'At the bottom, pause briefly — as low as you can go while keeping heels flat.',
        'Stand back up at a normal pace.',
        'This is movement rehearsal only — no weight. You are teaching your body the squatting pattern before adding load.'
      ]),
      wuStep('Glute Bridge — Bodyweight', '10 reps', [
        'Lie on your back on the floor. Bend your knees so your feet are flat on the floor, hip-width apart.',
        'Place your feet close enough to your backside that you could just touch your heels with your fingertips.',
        'Push your hips upward toward the ceiling by squeezing your glutes — think of "tucking" your tailbone up.',
        'At the top, your body forms a straight line from knees to shoulders. Hold for 1 second and squeeze hard.',
        'Lower your hips slowly back to the floor.',
        'This activates the glutes and gently wakes up the lower back stabilisers before any exercise.'
      ]),
      wuStep('Dead Bug — Slow', '4 each side', [
        'Lie on your back. Press your lower back firmly into the floor — there should be no gap between your back and the floor.',
        'Raise both arms straight toward the ceiling, wrists above your shoulders.',
        'Raise both legs so your knees are bent at 90 degrees in the air — shins parallel to the floor. This is your starting position.',
        'Breathe out fully.',
        'Slowly lower your RIGHT arm overhead toward the floor and simultaneously lower your LEFT leg toward the floor (straightening it as it goes). Take 3–4 seconds to reach the end position.',
        'Both limbs should hover just 1–2 cm above the floor. Do NOT let them touch.',
        'Return both limbs to the starting position slowly.',
        'Then switch: lower LEFT arm and RIGHT leg simultaneously.',
        'That is one rep on each side. Do 4 each side.'
      ], 'Your lower back must stay flat against the floor at ALL times. If it lifts off, you have gone too far — shorten the range of motion and try again.')
    ];

    var morningSteps = [
      wuStep('Slow Walk', '5 min', [
        'Set the treadmill to 4.0–4.5 km/h — a gentle, comfortable pace.',
        'Do not go faster in this first 5 minutes. Your spine is slightly compressed from lying down all night and needs time to decompress.',
        'Walk for the full 5 minutes before moving on.'
      ]),
      wuStep('Cat-Cow Stretch', '10 reps', [
        'Get onto your hands and knees on a mat. Hands should be directly below your shoulders, knees directly below your hips.',
        'CAT: Arch your back upward toward the ceiling — imagine a scared cat rounding its back. Hold this position for 2 seconds. You will feel a stretch along the entire spine.',
        'COW: Dip your belly toward the floor and lift your head and tailbone gently upward. Hold 2 seconds. You will feel your spine extend.',
        'Move slowly between cat and cow. This is not a fast movement. Each full cat-to-cow is one rep.',
        'Do 10 full reps. This gently mobilises every segment of your spine before you ask it to support movement.'
      ]),
      wuStep('Child\'s Pose', '30 sec hold', [
        'From hands and knees, slowly sit your hips backward toward your heels.',
        'Extend both arms forward along the floor as far as they will go.',
        'Let your forehead rest on the mat. If it does not reach the mat, place a folded towel under your forehead.',
        'Breathe deeply and slowly. With each exhale, let your lower back soften and relax further.',
        'Hold for 30 full seconds. This gently decompresses the lower spine after sleep.'
      ]),
      wuStep('Lying Knee-to-Chest', '5 each side', [
        'Lie on your back on the mat, legs extended.',
        'Pull your RIGHT knee toward your chest with both hands. Gently hug it in.',
        'Hold for 10 seconds. Breathe normally. You should feel a release in the lower back and hip.',
        'Lower the right leg, then repeat with the LEFT knee.',
        'Do 5 holds per side. This releases the lower back and hip flexors which tighten overnight.'
      ]),
      wuStep('Glute Bridge — Bodyweight', '12 reps', [
        'Lie on your back. Knees bent, feet flat on the floor, hip-width apart.',
        'Push your hips upward by squeezing your glutes. Count 2 seconds on the way up.',
        'At the top, hold 1 second and squeeze hard.',
        'Lower slowly over 2 seconds.',
        'Do 12 reps — more than the evening version because your glutes are slower to wake up after sleep and need extra activation.'
      ]),
      wuStep('Bodyweight Squat — Slow', '10 reps', [
        'Stand with feet shoulder-width apart, toes pointing slightly outward.',
        'Lower yourself slowly — 3 seconds going down — pushing your knees outward in the direction your toes point.',
        'At the bottom, pause briefly with heels flat on the floor.',
        'Stand back up at a normal pace.',
        'If your heels lift, do not force depth — go only as low as your heels stay flat. Morning stiffness in the ankles is normal and will ease.'
      ]),
      wuStep('Leg Swings — Front to Back', '10 each leg', [
        'Stand next to a wall and hold it with one hand for balance.',
        'Swing one leg forward and backward like a pendulum — controlled, not a kick.',
        'Do 10 swings per leg.'
      ]),
      wuStep('Arm Circles', '10 fwd + 10 back, each arm', [
        'Extend one arm fully to the side.',
        'Do 10 large circles forward from the shoulder.',
        'Then 10 large circles backward.',
        'Switch to the other arm and repeat.'
      ]),
      wuStep('Hip Circles', '10 each direction', [
        'Feet shoulder-width apart, hands on hips.',
        'Draw large slow circles with your hips as if hula-hooping.',
        'Do 10 in one direction, then 10 in the other.'
      ])
    ];

    function stepsOf(items) {
      return '<div class="wu-steps-list">' + items.join('') + '</div>';
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
            '<p>Your body is already warm from daily movement. Goal: joint mobilisation and muscle activation — not raising temperature from scratch. Duration: 8–10 minutes.</p>',
            stepsOf(eveningSteps),
          '</div>',
          '<div class="mini-panel" data-group="warmup" data-tab="morning">',
            '<p>Your body is coming off sleep. The spine is slightly compressed, muscles are cold, and joints need more time. This warm-up is longer. Duration: 12–15 minutes.</p>',
            stepsOf(morningSteps),
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
