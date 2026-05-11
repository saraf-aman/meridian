import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { initializeFirestore, memoryLocalCache } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAbF9mFUEb-wvPdTICOrDe9-pElFh25w4g",
  authDomain: "meridian-801cf.firebaseapp.com",
  projectId: "meridian-801cf",
  storageBucket: "meridian-801cf.firebasestorage.app",
  messagingSenderId: "265549373114",
  appId: "1:265549373114:web:c07257fbf2b3d84ea12c83",
  measurementId: "G-977CV59MM0"
};

const app = initializeApp(firebaseConfig);

// memoryLocalCache avoids IndexedDB entirely. persistentLocalCache() can cause
// iOS Safari crashes: IDB data grows under ITP, the async failure isn't caught
// by a sync try/catch, and iOS kills tabs under memory pressure from large IDB.
// Cross-device sync still works — only the offline IDB cache is skipped.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });

export const auth = getAuth(app);
