/* Daily Sudoku — vanilla JS. Loads pre-generated puzzle by date. */
(function () {
  'use strict';
  var KEY = 'sudoku';
  var givens = [], solution = [], user = [], notes = [];
  var sel = -1, noteMode = false, done = false, sec = 0, timerId = null;
  var nav;

  function $(s) { return document.querySelector(s); }

  function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  function startTimer() {
    stopTimer(); sec = 0;
    var el = $('#g-timer'); if (el) el.textContent = '0:00';
    timerId = setInterval(function () {
      if (done) return;
      sec++; var t = $('#g-timer'); if (t) t.textContent = fmt(sec);
    }, 1000);
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

  function saveProg(ds) {
    try { localStorage.setItem('g_prog_' + KEY + '_' + ds, JSON.stringify({ u: user, n: notes })); } catch (e) {}
  }
  function loadProg(ds) {
    try {
      var v = JSON.parse(localStorage.getItem('g_prog_' + KEY + '_' + ds) || 'null');
      if (v && v.u && v.u.length === 81) { user = v.u; notes = v.n || notes; return true; }
    } catch (e) {}
    return false;
  }

  function build(ds) {
    done = false; sel = -1; noteMode = false;
    var idx = G.dayIndex(ds, DATA.length);
    var d = DATA[idx];
    givens = d.p.split('').map(Number);
    solution = d.s.split('').map(Number);
    user = new Array(81).fill(0);
    notes = Array.from({ length: 81 }, function () { return []; });
    loadProg(ds);
    render(ds);
    startTimer();
    var nm = $('#g-notemode'); if (nm) { nm.classList.remove('on'); nm.setAttribute('aria-pressed', 'false'); }
    var win = $('#g-win'); if (win) win.classList.remove('show');
  }

  function cellVal(i) { return givens[i] || user[i]; }

  function render(ds) {
    var grid = $('#g-grid'); if (!grid) return;
    grid.innerHTML = '';
    for (var i = 0; i < 81; i++) {
      (function (i) {
        var b = G.el('button', 'g-scell');
        var r = Math.floor(i / 9), c = i % 9;
        if (c % 3 === 0 && c > 0) b.classList.add('bl');
        if (r % 3 === 0 && r > 0) b.classList.add('bt');
        if (givens[i]) { b.classList.add('given'); b.textContent = givens[i]; }
        else if (user[i]) {
          if (notes[i].length && !user[i]) {}
          b.textContent = user[i];
          if (user[i] !== solution[i]) b.classList.add('err');
        } else if (notes[i].length) {
          b.classList.add('note');
          b.innerHTML = notes[i].join(' ');
        }
        if (i === sel) b.classList.add('sel');
        else if (sel >= 0) {
          var sr = Math.floor(sel / 9), sc = sel % 9;
          if (r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))) b.classList.add('peer');
          if (cellVal(i) && cellVal(i) === cellVal(sel)) b.classList.add('same');
        }
        b.setAttribute('aria-label', 'row ' + (r + 1) + ' column ' + (c + 1));
        if (!givens[i]) b.addEventListener('click', function () { sel = (sel === i ? -1 : i); render(ds); });
        grid.appendChild(b);
      })(i);
    }
    var mis = $('#g-mistakes');
    if (mis) {
      var n = 0;
      for (var k = 0; k < 81; k++) if (!givens[k] && user[k] && user[k] !== solution[k]) n++;
      mis.textContent = n ? (n + (n === 1 ? ' mistake' : ' mistakes')) : '';
    }
  }

  function enter(n, ds) {
    if (done || sel < 0 || givens[sel]) return;
    if (noteMode) {
      user[sel] = 0;
      var ix = notes[sel].indexOf(n);
      if (ix >= 0) notes[sel].splice(ix, 1); else notes[sel].push(n);
      notes[sel].sort();
    } else {
      notes[sel] = [];
      user[sel] = (user[sel] === n ? 0 : n);
    }
    saveProg(ds);
    render(ds);
    checkWin(ds);
  }

  function checkWin(ds) {
    for (var i = 0; i < 81; i++) {
      var v = givens[i] || user[i];
      if (v !== solution[i]) return;
    }
    done = true; stopTimer();
    var st = G.bumpStreak(KEY, ds);
    var win = $('#g-win');
    if (win) {
      win.innerHTML = 'Solved in ' + fmt(sec) + '! ' + (st > 1 ? ('That\u2019s a <strong>' + st + '-day streak</strong>. \uD83D\uDD25') : 'Come back tomorrow to start a streak.') + ' <a href="daily-crossword.html">Try the crossword &rarr;</a>';
      win.classList.add('show');
    }
    if (nav) nav.paintStreak();
    try { localStorage.removeItem('g_prog_' + KEY + '_' + ds); } catch (e) {}
  }

  function init() {
    // number pad
    var pad = $('#g-pad');
    if (pad) {
      pad.innerHTML = '';
      for (var n = 1; n <= 9; n++) {
        (function (n) {
          var b = G.el('button', null, String(n));
          b.addEventListener('click', function () { enter(n, nav.get()); });
          pad.appendChild(b);
        })(n);
      }
    }
    var er = $('#g-erase');
    if (er) er.addEventListener('click', function () {
      if (done || sel < 0 || givens[sel]) return;
      user[sel] = 0; notes[sel] = []; saveProg(nav.get()); render(nav.get());
    });
    var nm = $('#g-notemode');
    if (nm) nm.addEventListener('click', function () {
      noteMode = !noteMode;
      nm.classList.toggle('on', noteMode);
      nm.setAttribute('aria-pressed', String(noteMode));
    });
    var rs = $('#g-restart');
    if (rs) rs.addEventListener('click', function () {
      if (!confirm('Clear this puzzle and start over?')) return;
      user = new Array(81).fill(0);
      notes = Array.from({ length: 81 }, function () { return []; });
      done = false; saveProg(nav.get()); build(nav.get());
    });
    document.addEventListener('keydown', function (e) {
      if (sel < 0 || done) return;
      if (e.key >= '1' && e.key <= '9') enter(parseInt(e.key, 10), nav.get());
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        user[sel] = 0; notes[sel] = []; saveProg(nav.get()); render(nav.get());
      }
    });
    nav = G.initDateNav(KEY, build);
  }

  var DATA = null;
  fetch('assets/sudoku-data.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { DATA = d; init(); })
    .catch(function () {
      var w = $('#g-grid');
      if (w) w.innerHTML = '<p>Could not load today\u2019s puzzle. Please check your connection and reload.</p>';
    });
})();
