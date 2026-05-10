import { db, auth } from './firebase-config.js';
import {
  doc, setDoc, getDocs, collection, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const today = new Date().toISOString().slice(0, 10);

async function saveWeights(exName, sets) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const uid = user.uid;
    await setDoc(doc(db, 'users', uid, 'weights', exName), {
      sets,
      updatedAt: serverTimestamp()
    });
    // Daily snapshot: document ID encodes exercise + date for flat structure
    await setDoc(doc(db, 'users', uid, 'weight-history', exName + '_' + today), {
      exName,
      date: today,
      sets
    });
  } catch (_) {}
}

async function syncAllFromFirestore(user) {
  try {
    const snap = await getDocs(collection(db, 'users', user.uid, 'weights'));
    snap.forEach(docSnap => {
      const exName = docSnap.id;
      const { sets } = docSnap.data();
      if (!Array.isArray(sets)) return;
      sets.forEach((val, i) => {
        if (!val) return;
        const lsKey = 'm-weight|' + exName + '|' + i;
        localStorage.setItem(lsKey, val);
        // Update any visible weight tags on this page
        document.querySelectorAll('.set-weights').forEach(section => {
          if (section.dataset.exName !== exName) return;
          const tag = section.querySelectorAll('.weight-tag')[i];
          if (!tag || tag.querySelector('input')) return;
          const span = tag.querySelector('.wt-val');
          if (span) span.textContent = val;
        });
      });
    });
  } catch (_) {}
}

// Expose saveWeights so workout.js (regular script) can call it
window.FirestoreSync = { saveWeights };

onAuthStateChanged(auth, user => {
  if (user) syncAllFromFirestore(user);
});
