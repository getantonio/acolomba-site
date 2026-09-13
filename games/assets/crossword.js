/* Daily Crossword — vanilla JS. Casual 13x15 from pre-generated data. */
(function () {
  'use strict';
  var KEY = 'crossword', COLS = 13, ROWS = 15;
  var entries = [], sol = [], user = [], numbers = {};
  var selR = -1, selC = -1, dir = 0, done = false;
  var nav;

  function $(s) { return document.querySelector(s); }

  function buildNumbers() {
    numbers = {}; var n = 1;
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      if (!sol[r][c]) continue;
      var sA = (c === 0 || !sol[r][c - 1]) && (c + 1 < COLS && sol[r][c + 1]);
      var sD = (r === 0 || !sol[r - 1][c]) && (r + 1 < ROWS && sol[r + 1][c]);
      if (sA || sD) numbers[r + ',' + c] = n++;
    }
  }

  function saveProg(ds) {
    try {
      var letters = [];
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) if (sol[r][c]) letters.push(user[r][c] || '');
      localStorage.setItem('g_prog_' + KEY + '_' + ds, JSON.stringify(letters));
    } catch (e) {}
  }
  function loadProg(ds) {
    try {
      var v = JSON.parse(localStorage.getItem('g_prog_' + KEY + '_' + ds) || 'null');
      if (v && v.length) {
        var k = 0;
        for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++)
          if (sol[r][c]) user[r][c] = v[k++] || '';
        return true;
      }
    } catch (e) {}
    return false;
  }

  function build(ds) {
    done = false; selR = -1; selC = -1; dir = 0;
    var idx = G.dayIndex(ds, DATA.length);
    entries = DATA[idx].w.map(function (w) { return { word: w[0], clue: w[1], r: w[2], c: w[3], dir: w[4] }; });
    sol = []; user = [];
    for (var r = 0; r < ROWS; r++) { sol.push(new Array(COLS).fill('')); user.push(new Array(COLS).fill('')); }
    entries.forEach(function (e) {
      for (var i = 0; i < e.word.length; i++) {
        var rr = e.dir === 0 ? e.r : e.r + i, cc = e.dir === 0 ? e.c + i : e.c;
        sol[rr][cc] = e.word[i];
      }
    });
    buildNumbers();
    entries.forEach(function (e) { e.num = numbers[e.r + ',' + e.c]; });
    loadProg(ds);
    render(ds);
    var win = $('#g-win'); if (win) win.classList.remove('show');
  }

  function activeEntry() {
    if (selR < 0) return null;
    for (var k = 0; k < entries.length; k++) {
      var e = entries[k];
      if (e.dir !== dir) continue;
      for (var i = 0; i < e.word.length; i++) {
        var rr = e.dir === 0 ? e.r : e.r + i, cc = e.dir === 0 ? e.c + i : e.c;
        if (rr === selR && cc === selC) return e;
      }
    }
    return null;
  }
  function entryCells(e) {
    var out = [];
    for (var i = 0; i < e.word.length; i++)
      out.push([e.dir === 0 ? e.r : e.r + i, e.dir === 0 ? e.c + i : e.c]);
    return out;
  }

  function render(ds) {
    var grid = $('#g-grid'); if (!grid) return;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + COLS + ', 1fr)';
    var act = activeEntry();
    var actCells = {};
    if (act) entryCells(act).forEach(function (rc) { actCells[rc[0] + ',' + rc[1]] = 1; });
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      (function (r, c) {
        var cell = G.el('div', 'g-xwcell');
        if (!sol[r][c]) { cell.classList.add('block'); grid.appendChild(cell); return; }
        if (actCells[r + ',' + c]) cell.classList.add('active');
        if (numbers[r + ',' + c]) cell.appendChild(G.el('span', 'num', String(numbers[r + ',' + c])));
        var inp = document.createElement('input');
        inp.maxLength = 1; inp.value = user[r][c]; inp.autocapitalize = 'characters'; inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'row ' + (r + 1) + ' column ' + (c + 1));
        inp.addEventListener('focus', function () {
          if (selR === r && selC === c) dir = 1 - dir; else { selR = r; selC = c; }
          paintActive(); paintClues();
        });
        inp.addEventListener('input', function () {
          var v = inp.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
          inp.value = v; user[r][c] = v;
          saveProg(nav.get());
          if (v) moveNext(r, c);
          checkWin(nav.get());
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value) { e.preventDefault(); movePrev(r, c); }
        });
        cell.appendChild(inp);
        grid.appendChild(cell);
      })(r, c);
    }
    paintClues();
  }

  function paintActive() {
    var act = activeEntry(), cells = {};
    if (act) entryCells(act).forEach(function (rc) { cells[rc[0] + ',' + rc[1]] = 1; });
    var grid = $('#g-grid');
    Array.prototype.forEach.call(grid.children, function (cell, i) {
      var r = Math.floor(i / COLS), c = i % COLS;
      cell.classList.toggle('active', !!cells[r + ',' + c]);
    });
    paintClues();
  }
  function paintClues() {
    var act = activeEntry();
    [['A', '#g-across'], ['D', '#g-down']].forEach(function (pair) {
      var list = $(pair[1]); if (!list) return;
      var dd = pair[0] === 'A' ? 0 : 1;
      var es = entries.filter(function (e) { return e.dir === dd; }).sort(function (a, b) { return a.num - b.num; });
      list.innerHTML = '';
      es.forEach(function (e) {
        var li = G.el('li', (act && act === e) ? 'cur' : null, e.num + '. ' + e.clue);
        li.addEventListener('click', function () {
          selR = e.r; selC = e.c; dir = e.dir;
          focusCell(e.r, e.c); paintActive();
        });
        list.appendChild(li);
      });
    });
    var bar = $('#g-curclue');
    if (bar) bar.textContent = act ? (act.num + (act.dir === 0 ? ' Across' : ' Down') + ' — ' + act.clue) : 'Tap a square to start.';
  }

  function focusCell(r, c) {
    var grid = $('#g-grid');
    var cell = grid.children[r * COLS + c];
    var inp = cell && cell.querySelector('input');
    if (inp) inp.focus();
  }
  function moveNext(r, c) {
    var act = activeEntry(); if (!act) return;
    var cells = entryCells(act);
    for (var i = 0; i < cells.length - 1; i++)
      if (cells[i][0] === r && cells[i][1] === c) { selR = cells[i + 1][0]; selC = cells[i + 1][1]; focusCell(selR, selC); return; }
  }
  function movePrev(r, c) {
    var act = activeEntry(); if (!act) return;
    var cells = entryCells(act);
    for (var i = 1; i < cells.length; i++)
      if (cells[i][0] === r && cells[i][1] === c) { selR = cells[i - 1][0]; selC = cells[i - 1][1]; focusCell(selR, selC); return; }
  }

  function checkWin(ds) {
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++)
      if (sol[r][c] && user[r][c] !== sol[r][c]) return;
    done = true;
    var st = G.bumpStreak(KEY, ds);
    var win = $('#g-win');
    if (win) {
      win.innerHTML = 'Puzzle complete! ' + (st > 1 ? ('That\u2019s a <strong>' + st + '-day streak</strong>. \uD83D\uDD25') : 'Come back tomorrow to start a streak.') + ' <a href="daily-sudoku.html">Try the sudoku &rarr;</a>';
      win.classList.add('show');
    }
    if (nav) nav.paintStreak();
    try { localStorage.removeItem('g_prog_' + KEY + '_' + ds); } catch (e) {}
  }

  function init() {
    var chk = $('#g-check');
    if (chk) chk.addEventListener('click', function () {
      var grid = $('#g-grid');
      Array.prototype.forEach.call(grid.children, function (cell, i) {
        var r = Math.floor(i / COLS), c = i % COLS;
        var inp = cell.querySelector('input');
        if (inp && sol[r][c] && user[r][c] && user[r][c] !== sol[r][c]) inp.classList.add('bad');
        else if (inp) inp.classList.remove('bad');
      });
    });
    var rev = $('#g-reveal');
    if (rev) rev.addEventListener('click', function () {
      if (!confirm('Reveal the whole puzzle?')) return;
      for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) if (sol[r][c]) user[r][c] = sol[r][c];
      saveProg(nav.get()); render(nav.get()); checkWin(nav.get());
    });
    nav = G.initDateNav(KEY, build);
  }

  var DATA = null;
  fetch('assets/crossword-data.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { DATA = d; init(); })
    .catch(function () {
      var w = $('#g-grid');
      if (w) w.innerHTML = '<p>Could not load today\u2019s puzzle. Please check your connection and reload.</p>';
    });
})();
