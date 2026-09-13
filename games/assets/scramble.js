/* Daily Word Scramble — vanilla JS. Seeded word picks, hints, streaks. */
(function () {
  'use strict';
  var KEY = 'scramble';
  var WORDS = window.SCRAMBLE_WORDS || [];
  var rounds = [], solvedCount = 0, done = false;
  var nav;

  function $(s) { return document.querySelector(s); }

  function pickWords(ds) {
    var R = G.mulberry32(G.strSeed('daily-scramble-v1:' + ds));
    var short = WORDS.filter(function (w) { return w.length <= 4; });
    var med = WORDS.filter(function (w) { return w.length === 5; });
    var lng = WORDS.filter(function (w) { return w.length >= 6; });
    function take(pool, n) {
      var p = pool.slice(), out = [];
      while (out.length < n && p.length) out.push(p.splice(Math.floor(R() * p.length), 1)[0]);
      return out;
    }
    return take(short, 2).concat(take(med, 2), take(lng, 2));
  }

  function scramble(word, R) {
    var a = word.split(''), s;
    do {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(R() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      s = a.join('');
    } while (s === word && word.length > 1);
    return s;
  }

  function build(ds) {
    done = false; solvedCount = 0;
    var R = G.mulberry32(G.strSeed('daily-scramble-v1:' + ds));
    rounds = pickWords(ds).map(function (w) {
      return { word: w, scrambled: scramble(w, R), revealed: [], solved: false };
    });
    render();
    var win = $('#g-win'); if (win) win.classList.remove('show');
    var prog = $('#g-progress'); if (prog) prog.textContent = '0 of ' + rounds.length + ' solved';
  }

  function render() {
    var wrap = $('#g-words'); if (!wrap) return;
    wrap.innerHTML = '';
    rounds.forEach(function (rd, i) {
      var box = G.el('div', 'g-scr-word' + (rd.solved ? ' done' : ''));
      var label = G.el('div', null, 'Word ' + (i + 1) + ' · ' + rd.word.length + ' letters');
      label.style.cssText = 'font-size:13px;opacity:.65;margin-bottom:4px;';
      box.appendChild(label);
      var tiles = G.el('div', 'g-tiles');
      rd.scrambled.split('').forEach(function (ch) { tiles.appendChild(G.el('span', 'g-tile', ch)); });
      box.appendChild(tiles);
      var row = G.el('div', 'g-row');
      var inp = document.createElement('input');
      inp.maxLength = rd.word.length; inp.autocapitalize = 'characters'; inp.autocomplete = 'off';
      inp.setAttribute('aria-label', 'Unscramble word ' + (i + 1));
      if (rd.solved) { inp.value = rd.word; inp.disabled = true; }
      else {
        var shown = rd.word.split('').map(function (ch, k) { return rd.revealed.indexOf(k) >= 0 ? ch : ''; }).join('');
        inp.value = shown;
        inp.addEventListener('input', function () {
          var v = inp.value.toUpperCase().replace(/[^A-Z]/g, '');
          inp.value = v;
          if (v.length === rd.word.length && v === rd.word) {
            rd.solved = true; solvedCount++;
            render(); updateProg(); checkWin();
          }
        });
      }
      row.appendChild(inp);
      if (!rd.solved) {
        var hint = G.el('button', 'g-btn small ghost', 'Hint (' + (rd.word.length - rd.revealed.length) + ' left)');
        hint.addEventListener('click', function () {
          var opts = [];
          for (var k = 0; k < rd.word.length; k++) if (rd.revealed.indexOf(k) < 0) opts.push(k);
          if (opts.length) rd.revealed.push(opts[Math.floor(Math.random() * opts.length)]);
          render();
        });
        row.appendChild(hint);
        var shuf = G.el('button', 'g-btn small ghost', 'Reshuffle');
        shuf.addEventListener('click', function () {
          var R = Math.random;
          var a = rd.scrambled.split(''), s;
          do {
            for (var q = a.length - 1; q > 0; q--) { var j = Math.floor(R() * (q + 1)); var t = a[q]; a[q] = a[j]; a[j] = t; }
            s = a.join('');
          } while (s === rd.word);
          rd.scrambled = s; render();
        });
        row.appendChild(shuf);
      } else {
        row.appendChild(G.el('span', null, '✓ Nice!'));
      }
      box.appendChild(row);
      if (rd.revealed.length && !rd.solved) {
        var h = G.el('div', 'g-hint', 'Hint: ' + rd.revealed.length + ' letter' + (rd.revealed.length > 1 ? 's' : '') + ' revealed');
        box.appendChild(h);
      }
      wrap.appendChild(box);
    });
  }

  function updateProg() {
    var prog = $('#g-progress');
    if (prog) prog.textContent = solvedCount + ' of ' + rounds.length + ' solved';
  }

  function checkWin() {
    if (solvedCount < rounds.length || done) return;
    done = true;
    var ds = nav.get();
    var st = G.bumpStreak(KEY, ds);
    var win = $('#g-win');
    if (win) {
      win.innerHTML = 'All ' + rounds.length + ' words unscrambled! ' + (st > 1 ? ('That\u2019s a <strong>' + st + '-day streak</strong>. \uD83D\uDD25') : 'Come back tomorrow to start a streak.') + ' <a href="daily-solitaire.html">Play solitaire &rarr;</a>';
      win.classList.add('show');
    }
    if (nav) nav.paintStreak();
  }

  if (!WORDS.length) {
    var w = $('#g-words');
    if (w) w.innerHTML = '<p>Could not load the word list. Please check your connection and reload.</p>';
    return;
  }
  nav = G.initDateNav(KEY, build);
})();
