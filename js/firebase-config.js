import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { initializeFirestore, persistentLocalCache } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
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
// persistentLocalCache enables offline reads/writes via IndexedDB
export const db = initializeFirestore(app, { localCache: persistentLocalCache() });
export const auth = getAuth(app);
