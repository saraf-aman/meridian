var NutritionRender = (function () {
  'use strict';

  function root() { return document.getElementById('page-root'); }

  // ── Auth walls ───────────────────────────────────────────────

  function buildAuthWall() {
    root().innerHTML =
      '<div class="container">' +
        '<div class="auth-wall">' +
          '<div class="auth-wall-icon">🔒</div>' +
          '<h2 class="auth-wall-title">Your nutrition plan is private</h2>' +
          '<p class="auth-wall-desc">Sign in with your Google account to access your personalised meal plans, macros, and dietary guidance.</p>' +
          '<button class="auth-wall-btn" id="aw-sign-in">Sign in with Google</button>' +
        '</div>' +
      '</div>';
    var btn = document.getElementById('aw-sign-in');
    if (btn && window.meridianAuth) {
      btn.addEventListener('click', function () {
        window.meridianAuth.signInWithGoogle().catch(function () {});
      });
    }
  }

  function buildUnauthorizedWall() {
    root().innerHTML =
      '<div class="container">' +
        '<div class="auth-wall">' +
          '<div class="auth-wall-icon">⛔</div>' +
          '<h2 class="auth-wall-title">Access restricted</h2>' +
          '<p class="auth-wall-desc">This Google account doesn\'t have access to Meridian. Try signing in with the correct account.</p>' +
          '<p class="auth-wall-note">Signing you out…</p>' +
        '</div>' +
      '</div>';
  }

  // ── Page stubs (replaced in later build steps) ───────────────

  function _stub(name) {
    root().innerHTML =
      '<div class="container" style="padding:60px 0;text-align:center;color:var(--text-3);">' +
        '<p style="font-size:1.1rem;font-weight:600;">' + name + '</p>' +
        '<p style="font-size:0.84rem;margin-top:8px;">This page is being built.</p>' +
      '</div>';
  }

  function buildIndex()       { _stub('Quick Reference'); }
  function buildSchedule()    { _stub('Daily Schedule'); }
  function buildMealPlan()    { _stub('7-Day Meal Plan'); }
  function buildLunch()       { _stub('Office Lunch'); }
  function buildDinner()      { _stub('Dinner Rotation'); }
  function buildSupplements() { _stub('Supplements'); }
  function buildHealth()      { _stub('Health Tracking'); }

  return {
    buildAuthWall,
    buildUnauthorizedWall,
    buildIndex,
    buildSchedule,
    buildMealPlan,
    buildLunch,
    buildDinner,
    buildSupplements,
    buildHealth,
  };
}());
