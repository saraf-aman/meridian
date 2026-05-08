/* ============================================================
   MERIDIAN — workout.js
   Day tabs · Exercise accordion · Back safety
   Ref sections · Mini tabs · Set tracker
   Rest timer · Checklists
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDayTabs();
  initAccordions('.exercise-card-header', '.exercise-card');
  initToggle('.back-safety-header', '.back-safety');
  initAccordions('.ref-header', '.ref-block');
  initMiniTabs();
  initSetTracker();
  initWeightTracker();
  initResetButtons();
  initChecklists();
  initTimer();
});

/* ── Day tabs ─────────────────────────────────────────────── */
function initDayTabs() {
  document.querySelectorAll('.day-selector[data-panel]').forEach(sel => {
    const panelId = sel.dataset.panel;
    const wrap    = document.querySelector(`.day-panels-wrap[data-panel="${panelId}"]`);
    if (!wrap) return;
    const btns   = sel.querySelectorAll('.day-btn');
    const panels = wrap.querySelectorAll('.day-panel');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const day = btn.dataset.day;
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        wrap.querySelector(`.day-panel[data-day="${day}"]`)?.classList.add('active');
      });
    });
  });
}

/* ── Generic accordion (skip set-dots / rest-btn clicks) ─── */
function initAccordions(headerSel, cardSel) {
  document.querySelectorAll(headerSel).forEach(header => {
    header.addEventListener('click', e => {
      if (e.target.closest('.set-tracker') || e.target.closest('.rest-btn')) return;
      header.closest(cardSel)?.classList.toggle('open');
    });
  });
}

/* ── Single toggle (back safety) ─────────────────────────── */
function initToggle(headerSel, containerSel) {
  document.querySelectorAll(headerSel).forEach(header => {
    header.addEventListener('click', () => {
      header.closest(containerSel)?.classList.toggle('open');
    });
  });
}

/* ── Mini tabs (warmup morning/evening) ──────────────────── */
function initMiniTabs() {
  document.querySelectorAll('.mini-tabs[data-group]').forEach(tabBar => {
    const group  = tabBar.dataset.group;
    const panels = document.querySelectorAll(`.mini-panel[data-group="${group}"]`);
    tabBar.querySelectorAll('.mini-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        tabBar.querySelectorAll('.mini-tab').forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.mini-panel[data-group="${group}"][data-tab="${btn.dataset.tab}"]`)?.classList.add('active');
      });
    });
  });
}

/* ── Set tracker ──────────────────────────────────────────── */
const SESSION_DATE = new Date().toISOString().slice(0, 10);

function trackerKey(card) {
  const name = card.querySelector('.ex-title h4')?.textContent?.trim() ?? 'x';
  return `m-sets|${SESSION_DATE}|${name}`;
}

function initSetTracker() {
  document.querySelectorAll('.exercise-card').forEach(card => {
    const dots = card.querySelectorAll('.set-dot');
    const key  = trackerKey(card);
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    dots.forEach((dot, i) => {
      if (saved[i]) dot.classList.add('done');
      dot.addEventListener('click', e => {
        e.stopPropagation();
        dot.classList.toggle('done');
        persist(card, dots);
        updateCardDone(card, dots);
      });
    });
    updateCardDone(card, dots);
  });
}

function persist(card, dots) {
  const state = Array.from(dots).map(d => d.classList.contains('done'));
  localStorage.setItem(trackerKey(card), JSON.stringify(state));
}

function updateCardDone(card, dots) {
  if (!dots.length) return;
  const allDone = Array.from(dots).every(d => d.classList.contains('done'));
  card.classList.toggle('done', allDone);
}

function initResetButtons() {
  document.querySelectorAll('.btn-reset').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.day-panel');
      panel?.querySelectorAll('.exercise-card').forEach(card => {
        const dots = card.querySelectorAll('.set-dot');
        dots.forEach(d => d.classList.remove('done'));
        card.classList.remove('done');
        localStorage.removeItem(trackerKey(card));
      });
    });
  });
}

/* ── Per-set weight tracker (persistent, never resets) ───── */
function initWeightTracker() {
  document.querySelectorAll('.set-weights').forEach(section => {
    const exName = section.dataset.exName;
    section.querySelectorAll('.weight-tag').forEach((tag, i) => {
      const key = `m-weight|${exName}|${i}`;
      const saved = localStorage.getItem(key);
      if (saved) tag.querySelector('.wt-val').textContent = saved;

      tag.addEventListener('click', e => {
        e.stopPropagation();
        if (tag.querySelector('input')) return;

        const current = tag.querySelector('.wt-val').textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = current === '—' ? '' : current;
        input.className = 'weight-input';
        input.placeholder = 'e.g. 25 lbs';
        tag.textContent = 'Set ' + (i + 1) + ': ';
        tag.appendChild(input);
        input.focus();
        input.select();

        const restore = val => {
          tag.textContent = 'Set ' + (i + 1) + ': ';
          const span = document.createElement('span');
          span.className = 'wt-val';
          span.textContent = val || '—';
          tag.appendChild(span);
        };

        const save = () => {
          const val = input.value.trim();
          if (val) localStorage.setItem(key, val);
          else localStorage.removeItem(key);
          restore(val);
        };

        input.addEventListener('keydown', e => {
          if (e.key === 'Enter')  { e.preventDefault(); save(); }
          if (e.key === 'Escape') { e.preventDefault(); restore(current); }
        });
        input.addEventListener('blur', save);
      });
    });
  });
}

/* ── Transition checklists (localStorage-persisted) ──────── */
function initChecklists() {
  document.querySelectorAll('.cl-item').forEach(item => {
    const key = 'm-check|' + (item.dataset.key ?? item.querySelector('.cl-text')?.textContent?.trim().slice(0, 50));
    if (localStorage.getItem(key) === '1') item.classList.add('checked');
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      localStorage.setItem(key, item.classList.contains('checked') ? '1' : '0');
    });
  });
}

/* ── Rest timer ───────────────────────────────────────────── */
function initTimer() {
  const fab    = document.getElementById('timer-fab');
  const widget = document.getElementById('timer-widget');
  if (!fab || !widget) return;

  const digits   = widget.querySelector('.timer-digits');
  const arc      = widget.querySelector('.ring-arc');
  const presets  = widget.querySelectorAll('.t-preset');
  const btnSS    = widget.querySelector('#t-start-stop');
  const btnReset = widget.querySelector('#t-reset');

  const R  = 45;
  const C  = +(2 * Math.PI * R).toFixed(2); // 282.74
  arc.style.strokeDasharray  = C;
  arc.style.strokeDashoffset = 0;

  let total   = 90;
  let left    = 90;
  let running = false;
  let iv      = null;
  let audioCtx = null;

  function ctx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function beep(f, dur, delay) {
    try {
      const c = ctx(), osc = c.createOscillator(), g = c.createGain();
      osc.connect(g); g.connect(c.destination);
      osc.frequency.value = f; osc.type = 'sine';
      g.gain.setValueAtTime(0.25, c.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + dur);
    } catch (_) {}
  }

  function playDone() { beep(660, 0.1, 0); beep(880, 0.12, 0.16); beep(1100, 0.18, 0.33); }

  function render() {
    const m = Math.floor(left / 60);
    const s = left % 60;
    digits.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    arc.style.strokeDashoffset = C * (left / total);
  }

  function setDuration(sec) {
    stop();
    total = sec; left = sec;
    arc.classList.remove('done');
    presets.forEach(p => p.classList.toggle('active', +p.dataset.duration === sec));
    render();
  }

  function start() {
    if (left <= 0) setDuration(total);
    running = true;
    btnSS.textContent = 'Pause';
    btnSS.classList.add('t-primary');
    iv = setInterval(() => {
      left--;
      render();
      if (left <= 0) {
        stop();
        arc.classList.add('done');
        widget.classList.add('flashing');
        setTimeout(() => widget.classList.remove('flashing'), 1200);
        playDone();
      }
    }, 1000);
  }

  function stop() {
    running = false;
    clearInterval(iv);
    btnSS.textContent = 'Start';
    btnSS.classList.remove('t-primary');
  }

  /* Controls */
  btnSS.addEventListener('click',    () => running ? stop() : start());
  btnReset.addEventListener('click', () => { stop(); left = total; arc.classList.remove('done'); render(); });
  presets.forEach(p => p.addEventListener('click', () => setDuration(+p.dataset.duration)));

  /* FAB toggle */
  fab.addEventListener('click', e => { e.stopPropagation(); widget.classList.toggle('open'); });
  document.addEventListener('click', e => {
    if (!widget.contains(e.target) && e.target !== fab) widget.classList.remove('open');
  });

  /* Exercise card rest buttons */
  document.querySelectorAll('.rest-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      setDuration(+btn.dataset.duration);
      widget.classList.add('open');
      start();
    });
  });

  /* Init */
  setDuration(90);
}
