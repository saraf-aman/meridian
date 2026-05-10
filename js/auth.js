import { auth } from './firebase-config.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const provider = new GoogleAuthProvider();

function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

function doSignOut() {
  return fbSignOut(auth);
}

window.meridianAuth = {
  signInWithGoogle,
  signOut: doSignOut,
  getCurrentUser: () => auth.currentUser
};

onAuthStateChanged(auth, function (user) {
  window.meridianAuth.currentUser = user;
  var slot = document.getElementById('nav-auth');
  if (slot) {
    renderAuthSlot(slot, user);
  } else {
    // Nav not yet injected — wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
      var s = document.getElementById('nav-auth');
      if (s) renderAuthSlot(s, user);
    }, { once: true });
  }
});

function renderAuthSlot(slot, user) {
  if (!user) {
    slot.innerHTML = '<button class="nav-auth-btn" id="nav-sign-in">Sign in</button>';
    document.getElementById('nav-sign-in').addEventListener('click', function () {
      signInWithGoogle().catch(function () {});
    });
  } else {
    var firstName = (user.displayName || 'You').split(' ')[0];
    var photoUrl = user.photoURL || '';
    var avatarHtml = photoUrl
      ? '<img class="nav-avatar" src="' + photoUrl + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
      : '<span class="nav-avatar-fallback">' + firstName.charAt(0).toUpperCase() + '</span>';
    slot.innerHTML =
      '<button class="nav-auth-user" id="nav-user-btn" aria-label="Signed in as ' + firstName + '">' +
        avatarHtml +
        '<span class="nav-user-name">' + firstName + '</span>' +
      '</button>';
    document.getElementById('nav-user-btn').addEventListener('click', function () {
      if (window.confirm('Sign out of Meridian?')) doSignOut().catch(function () {});
    });
  }
}
