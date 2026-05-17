import { db, auth } from './firebase-config.js';
import {
  doc, getDoc, setDoc, getDocs, collection, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const today = new Date().toISOString().slice(0, 10);

/* ── Helpers ──────────────────────────────────────────────── */
function parseWeight(val) {
  const m = String(val || '').match(/^(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

function parseReps(repsStr) {
  const m = String(repsStr || '').match(/^(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

function epley(weight, reps) {
  return weight * (1 + reps / 30);
}

function formatDate(dateStr) {
  const [, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10);
}

/* ── PR flash ─────────────────────────────────────────────── */
function flashPR(exName, weight, reps, estimated1rm) {
  document.querySelectorAll('.set-weights').forEach(section => {
    if (section.dataset.exName !== exName) return;
    const existing = section.parentElement.querySelector('.pr-flash');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'pr-flash';
    el.textContent = `New PR!  ${weight} lbs × ${reps} reps · Est. 1RM: ${Math.round(estimated1rm)} lbs`;
    section.after(el);
    setTimeout(() => el.classList.add('pr-flash--out'), 3500);
    setTimeout(() => el.remove(), 4000);
  });
}

/* ── History UI ───────────────────────────────────────────── */
function renderHistorySection(exName, dateMap) {
  const entries = Object.entries(dateMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 5);
  if (!entries.length) return;

  const html = entries.map(([date, sets]) => {
    const setsHtml = Array.from(sets).map((s, i) =>
      s ? `<span class="hist-set">Set ${i + 1}: ${s}</span>` : ''
    ).join('');
    return `<div class="hist-row"><span class="hist-date">${formatDate(date)}</span>${setsHtml}</div>`;
  }).join('');

  document.querySelectorAll('.set-weights').forEach(section => {
    if (section.dataset.exName !== exName) return;
    const content = section.closest('.card-content');
    if (!content) return;
    let histSection = content.querySelector('.history-section');
    if (!histSection) {
      histSection = document.createElement('div');
      histSection.className = 'card-section history-section';
      histSection.innerHTML = '<h5>History</h5><div class="hist-entries"></div>';
      section.after(histSection);
    }
    histSection.querySelector('.hist-entries').innerHTML = html;
  });
}

/* ── Save weights + PR detection ──────────────────────────── */
async function saveWeights(exName, sets, repsStr) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const uid = user.uid;

    await setDoc(doc(db, 'users', uid, 'weights', exName), {
      sets,
      updatedAt: serverTimestamp()
    });

    await setDoc(doc(db, 'users', uid, 'weight-history', exName + '_' + today), {
      exName,
      date: today,
      sets
    });

    // PR detection — only for exercises with clean numeric reps
    const reps = parseReps(repsStr);
    if (reps !== null) {
      const maxWeight = Math.max(...sets.map(s => parseWeight(s) || 0));
      if (maxWeight > 0) {
        const new1rm = epley(maxWeight, reps);
        const prRef = doc(db, 'users', uid, 'prs', exName);
        const prSnap = await getDoc(prRef);
        if (!prSnap.exists() || new1rm > (prSnap.data().estimated1rm || 0)) {
          await setDoc(prRef, { weight: maxWeight, reps, date: today, estimated1rm: new1rm });
          flashPR(exName, maxWeight, reps, new1rm);
        }
      }
    }
  } catch (_) {}
}

/* ── Log completed exercise to history ────────────────────── */
async function logExercise(exName, sets) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid, 'exercise-history', exName),
      { [today]: sets },
      { merge: true }
    );
    renderHistorySection(exName, { [today]: sets });
  } catch (_) {}
}

/* ── Save exercise note ───────────────────────────────────── */
async function saveNote(exId, value) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid, 'exercise-notes', exId),
      { note: value, updatedAt: serverTimestamp() }
    );
  } catch (_) {}
}

/* ── Sync all data from Firestore on auth ─────────────────── */
async function syncAllFromFirestore(user) {
  try {
    // Weights
    const weightSnap = await getDocs(collection(db, 'users', user.uid, 'weights'));
    weightSnap.forEach(docSnap => {
      const exName = docSnap.id;
      const { sets } = docSnap.data();
      if (!Array.isArray(sets)) return;
      sets.forEach((val, i) => {
        if (!val) return;
        const lsKey = 'm-weight|' + exName + '|' + i;
        localStorage.setItem(lsKey, val);
        document.querySelectorAll('.set-weights').forEach(section => {
          if (section.dataset.exName !== exName) return;
          const tag = section.querySelectorAll('.weight-tag')[i];
          if (!tag || tag.querySelector('input')) return;
          const span = tag.querySelector('.wt-val');
          if (span) span.textContent = val;
        });
      });
    });

    // Exercise history
    const histSnap = await getDocs(collection(db, 'users', user.uid, 'exercise-history'));
    histSnap.forEach(docSnap => {
      renderHistorySection(docSnap.id, docSnap.data());
    });

    // Exercise notes
    const notesSnap = await getDocs(collection(db, 'users', user.uid, 'exercise-notes'));
    const notes = {};
    notesSnap.forEach(docSnap => {
      const { note } = docSnap.data();
      if (note !== undefined) notes[docSnap.id] = note;
    });
    if (Object.keys(notes).length) window.WorkoutNotes?.applyNotes(notes);
  } catch (_) {}
}

window.FirestoreSync = { saveWeights, logExercise, saveNote };

onAuthStateChanged(auth, user => {
  window._meridianUser = user || null;
  if (user) syncAllFromFirestore(user);
});
