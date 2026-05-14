import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { initializeFirestore, persistentLocalCache, memoryLocalCache } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { initializeAuth, browserLocalPersistence, browserPopupRedirectResolver } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

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

// persistentLocalCache uses IndexedDB for offline Firestore access.
// Falls back to memory if IDB is unavailable (iOS private browsing).
export let db;
try {
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
} catch {
  db = initializeFirestore(app, { localCache: memoryLocalCache() });
}

// initializeAuth with browserLocalPersistence avoids the cross-origin iframe
// (firebaseapp.com/__/auth/iframe) that getAuth() spins up by default.
// Safari's ITP blocks that iframe's storage access, causing a reload loop and
// tab crash in the normal browser (not incognito/home-screen where ITP differs).
// browserLocalPersistence uses same-origin localStorage — no iframe needed.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver
});
