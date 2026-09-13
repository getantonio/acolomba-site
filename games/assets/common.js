/* Shared helpers for the daily games: date seeding, streaks, date navigation.
   Plain script (no modules). Exposes window.G. */
(function () {
  'use strict';

  function pad(n) { return String(n).padStart(2, '0'); }

  // Local calendar date as YYYY-MM-DD (midnight rollover in the player's timezone)
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function addDays(ds, n) {
    var t = Date.parse(ds + 'T12:00:00');
    var d = new Date(t + n * 86400000);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // FNV-1a string hash -> uint32 seed
  function strSeed(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Index into a pre-generated array of length n; stable for a given date.
  var DAY0 = Date.parse('2026-09-13T12:00:00Z');
  function dayIndex(ds, n) {
    var t = Date.parse(ds + 'T12:00:00Z');
    var d = Math.floor((t - DAY0) / 86400000) % n;
    return ((d % n) + n) % n;
  }

  // ---- Streaks (localStorage) ----
  function loadStreak(key) {
    try {
      var v = JSON.parse(localStorage.getItem('g_streak_' + key) || 'null');
      if (v && typeof v.streak === 'number') return v;
    } catch (e) {}
    return { last: '', streak: 0 };
  }
  // Call when the player completes the puzzle dated ds. Returns new streak.
  function bumpStreak(key, ds) {
    var s = loadStreak(key);
    if (s.last === ds) return s.streak;
    var y = addDays(ds, -1);
    s.streak = (s.last === y) ? s.streak + 1 : 1;
    s.last = ds;
    try { localStorage.setItem('g_streak_' + key, JSON.stringify(s)); } catch (e) {}
    return s.streak;
  }
  function streakText(key) {
    var s = loadStreak(key);
    return s.streak > 0 ? ('\uD83D\uDD25 ' + s.streak + '-day streak') : '';
  }

  // ---- Date navigation ----
  // Expects markup: [data-g-prev], input[data-g-date], [data-g-next], [data-g-streak]
  // onChange(ds) is called whenever the active date changes.
  function initDateNav(gameKey, onChange) {
    var prev = document.querySelector('[data-g-prev]');
    var next = document.querySelector('[data-g-next]');
    var input = document.querySelector('[data-g-date]');
    var streakEl = document.querySelector('[data-g-streak]');
    var today = todayStr();
    var current = today;

    function paintStreak() {
      if (streakEl) {
        var t = streakText(gameKey);
        streakEl.textContent = t;
        streakEl.style.display = t ? '' : 'none';
      }
    }
    function setDate(ds, silent) {
      if (ds > today) ds = today;
      current = ds;
      if (input) input.value = ds;
      if (prev) prev.disabled = false;
      if (next) next.disabled = (ds >= today);
      paintStreak();
      if (!silent) onChange(ds);
    }
    if (input) {
      input.max = today;
      input.addEventListener('change', function () {
        if (input.value) setDate(input.value);
      });
    }
    if (prev) prev.addEventListener('click', function () { setDate(addDays(current, -1)); });
    if (next) next.addEventListener('click', function () { setDate(addDays(current, 1)); });
    setDate(today, true);
    onChange(today);
    return { get: function () { return current; }, set: setDate, paintStreak: paintStreak };
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  window.G = {
    todayStr: todayStr, addDays: addDays, strSeed: strSeed,
    mulberry32: mulberry32, dayIndex: dayIndex,
    loadStreak: loadStreak, bumpStreak: bumpStreak, streakText: streakText,
    initDateNav: initDateNav, el: el
  };
})();
