import { db, auth } from './firebase-config.js';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

if (!document.getElementById('cal-root')) {
  // Not on calendar page — nothing to do
  throw new Error('calendar.js: no #cal-root found');
}

// ── State ─────────────────────────────────────────────────────
let uid = null;
let visits = new Set(); // YYYY-MM-DD strings of visited days
let viewYear, viewMonth; // currently displayed month (0-indexed)

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ── Date helpers ──────────────────────────────────────────────
function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function todayStr()   { return toDateStr(new Date()); }

// ── Auth listener ─────────────────────────────────────────────
onAuthStateChanged(auth, async function (user) {
  if (user) {
    uid = user.uid;
    await loadVisits();
  } else {
    uid = null;
    visits = new Set();
    renderSignIn();
  }
});

// ── Firestore ─────────────────────────────────────────────────
async function loadVisits() {
  const root = document.getElementById('cal-root');
  if (root) root.innerHTML = '<div class="cal-loading">Loading…</div>';

  const now = new Date();
  viewYear  = now.getFullYear();
  viewMonth = now.getMonth();

  try {
    const snap = await getDocs(collection(db, `users/${uid}/calendar`));
    visits = new Set();
    snap.forEach(d => visits.add(d.id));
    render();
  } catch {
    const root = document.getElementById('cal-root');
    if (root) root.innerHTML = '<div class="cal-loading">Could not load calendar. Check your connection.</div>';
  }
}

async function toggleVisit(dateStr) {
  if (!uid || dateStr > todayStr()) return;
  if (visits.has(dateStr)) {
    visits.delete(dateStr);
    render();
    await deleteDoc(doc(db, `users/${uid}/calendar`, dateStr));
  } else {
    visits.add(dateStr);
    render();
    await setDoc(doc(db, `users/${uid}/calendar`, dateStr), { visited: true, phase: 1 });
  }
}

// ── Stats ─────────────────────────────────────────────────────
function visitsThisMonth() {
  const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`;
  let n = 0;
  visits.forEach(d => { if (d.startsWith(prefix)) n++; });
  return n;
}

function currentStreak() {
  let streak = 0;
  const d = new Date();
  // If today isn't logged yet, start counting from yesterday
  if (!visits.has(toDateStr(d))) d.setDate(d.getDate() - 1);
  while (visits.has(toDateStr(d)) && streak < 365) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const root = document.getElementById('cal-root');
  if (!root) return;

  const now  = new Date();
  const tStr = todayStr();
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const minView = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 months back
  const canPrev = new Date(viewYear, viewMonth, 1) > minView;
  const canNext = !isCurrentMonth;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const startOffset = (firstDow + 6) % 7; // convert to Mon-first (0=Mon)

  const pad2 = n => String(n).padStart(2, '0');
  const ym   = `${viewYear}-${pad2(viewMonth + 1)}`;

  // Build grid cells
  let cells = DOW.map(d => `<div class="cal-dow">${d}</div>`).join('');
  for (let i = 0; i < startOffset; i++) cells += '<div class="cal-empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${ym}-${pad2(d)}`;
    const isToday   = dateStr === tStr;
    const visited   = visits.has(dateStr);
    const future    = dateStr > tStr;
    let cls = 'cal-day';
    if (isToday)  cls += ' cal-day--today';
    if (visited)  cls += ' cal-day--visited';
    if (future)   cls += ' cal-day--future';
    const label = `${dateStr}${visited ? ' (visited)' : ''}`;
    cells += `<button class="${cls}" data-date="${dateStr}" aria-label="${label}">${d}</button>`;
  }

  root.innerHTML = `
    <div class="cal-nav-bar">
      <button class="cal-nav-btn" id="cal-prev" aria-label="Previous month"${canPrev ? '' : ' disabled'}>&#8249;</button>
      <div class="cal-month-title">${MONTH_NAMES[viewMonth]} ${viewYear}</div>
      <button class="cal-nav-btn" id="cal-next" aria-label="Next month"${canNext ? '' : ' disabled'}>&#8250;</button>
    </div>
    <div class="cal-stats">
      <div class="cal-stat">
        <div class="cal-stat-val">${visitsThisMonth()}</div>
        <div class="cal-stat-label">visits this month</div>
      </div>
      <div class="cal-stat">
        <div class="cal-stat-val">${currentStreak()}</div>
        <div class="cal-stat-label">day streak</div>
      </div>
    </div>
    <div class="cal-grid" id="cal-grid">${cells}</div>
  `;

  document.getElementById('cal-prev').addEventListener('click', function () {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  document.getElementById('cal-next').addEventListener('click', function () {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });

  document.getElementById('cal-grid').addEventListener('click', function (e) {
    const btn = e.target.closest('.cal-day:not(.cal-day--future)');
    if (btn) toggleVisit(btn.dataset.date);
  });
}

function renderSignIn() {
  const root = document.getElementById('cal-root');
  if (!root) return;
  root.innerHTML = `
    <div class="cal-signin">
      <p>Sign in to start tracking your gym visits<br>and build your streak.</p>
      <button class="cal-signin-btn" id="cal-signin-btn">Sign in with Google</button>
    </div>
  `;
  document.getElementById('cal-signin-btn').addEventListener('click', function () {
    if (window.meridianAuth) window.meridianAuth.signInWithGoogle().catch(function () {});
  });
}
