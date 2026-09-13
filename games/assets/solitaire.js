/* Daily Solitaire (Klondike) — vanilla JS. Seeded daily deal, click-to-move +
   drag-and-drop (pointer events), double-click to foundation, undo, win detect. */
(function () {
  'use strict';
  var KEY = 'solitaire';
  var SUITS = ['\u2660', '\u2665', '\u2666', '\u2663']; // spades hearts diamonds clubs
  var RED = { 1: true, 2: true };
  var RANK = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
  function rankStr(r) { return RANK[r] || String(r); }

  var S = null;            // {t:[7][], s:[], w:[], f:[4][], moves}
  var undoStack = [];
  var done = false, sec = 0, timerId = null, nav = null;
  var selected = null;     // {from:'t3'|'w'|'f1', count}
  var drag = null;         // active drag state

  function $(s) { return document.querySelector(s); }

  // ---------- state ----------
  function newCard(suit, rank) { return { s: suit, r: rank, up: false }; }
  function cardId(c) { return c.s * 13 + c.r; }

  function deal(ds) {
    var R = G.mulberry32(G.strSeed('daily-solitaire-v1:' + ds));
    var deck = [];
    for (var s = 0; s < 4; s++) for (var r = 1; r <= 13; r++) deck.push(newCard(s, r));
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(R() * (i + 1)), t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    S = { t: [[], [], [], [], [], [], []], s: [], w: [], f: [[], [], [], []], moves: 0 };
    for (var p = 0; p < 7; p++)
      for (var k = 0; k <= p; k++) { var c = deck.pop(); c.up = (k === p); S.t[p].push(c); }
    S.s = deck; // remainder, top = end of array
    undoStack = []; selected = null; done = false; sec = 0;
  }

  function snap() { return JSON.stringify(S); }
  function pushUndo() { undoStack.push(snap()); if (undoStack.length > 120) undoStack.shift(); }
  function doUndo() {
    if (!undoStack.length || done) return;
    S = JSON.parse(undoStack.pop());
    selected = null; render();
  }

  function saveProg(ds) {
    try { localStorage.setItem('g_prog_' + KEY + '_' + ds, snap()); } catch (e) {}
  }
  function loadProg(ds) {
    try {
      var v = JSON.parse(localStorage.getItem('g_prog_' + KEY + '_' + ds) || 'null');
      if (v && v.t && v.t.length === 7) { S = v; return true; }
    } catch (e) {}
    return false;
  }

  function pileOf(name) {
    if (name === 's') return S.s;
    if (name === 'w') return S.w;
    if (name[0] === 't') return S.t[+name.slice(1)];
    if (name[0] === 'f') return S.f[+name.slice(1)];
    return null;
  }

  // ---------- rules ----------
  function canDropOnTableau(moving, pile) {
    // moving: array of cards (bottom first)
    var c = moving[0];
    if (!pile.length) return c.r === 13;
    var top = pile[pile.length - 1];
    return top.up && !!RED[top.s] !== !!RED[c.s] && top.r === c.r + 1;
  }
  function canDropOnFoundation(card, fPile) {
    if (!fPile.length) return card.r === 1;
    var top = fPile[fPile.length - 1];
    return top.s === card.s && card.r === top.r + 1;
  }
  function movingCards(from, count) {
    var p = pileOf(from);
    if (from[0] === 't') return p.slice(p.length - count);
    return [p[p.length - 1]];
  }
  function validSelection(from) {
    var p = pileOf(from);
    if (!p.length) return 0;
    if (from === 'w') return p[p.length - 1].up ? 1 : 0;
    if (from[0] === 'f') return 1;
    if (from[0] === 't') {
      var n = 0;
      for (var i = p.length - 1; i >= 0 && p[i].up; i--) n++;
      return n;
    }
    return 0;
  }

  function applyMove(from, count, to) {
    // returns true if moved
    if (from === to) return false;
    var src = pileOf(from), dst = pileOf(to);
    var moving = movingCards(from, count);
    if (!moving.length) return false;
    var ok = false;
    if (to[0] === 'f') ok = (moving.length === 1 && canDropOnFoundation(moving[0], dst));
    else if (to[0] === 't') {
      // validate internal sequence of the moving stack
      for (var i = 0; i < moving.length - 1; i++) {
        var a = moving[i], b = moving[i + 1];
        if (!(!!RED[a.s] !== !!RED[b.s] && a.r === b.r + 1)) return false;
      }
      ok = canDropOnTableau(moving, dst);
    } else return false;
    if (!ok) return false;
    pushUndo();
    dst.push.apply(dst, src.splice(src.length - moving.length));
    if (from[0] === 't' && src.length && !src[src.length - 1].up) src[src.length - 1].up = true;
    S.moves++;
    selected = null;
    afterChange();
    return true;
  }

  function stockClick() {
    if (done) return;
    if (S.s.length) {
      pushUndo();
      var c = S.s.pop(); c.up = true; S.w.push(c); S.moves++;
    } else if (S.w.length) {
      pushUndo();
      while (S.w.length) { var d = S.w.pop(); d.up = false; S.s.push(d); }
      S.moves++;
    } else return;
    selected = null;
    afterChange();
  }

  function autoToFoundation(from) {
    var p = pileOf(from);
    if (!p.length) return false;
    var card = p[p.length - 1];
    if (!card.up) return false;
    for (var f = 0; f < 4; f++) {
      if (canDropOnFoundation(card, S.f[f])) return applyMove(from, 1, 'f' + f);
    }
    return false;
  }

  function afterChange() {
    render();
    saveProg(nav.get());
    updateStats();
    checkWin();
    updateAuto();
  }

  function checkWin() {
    var n = 0;
    for (var f = 0; f < 4; f++) n += S.f[f].length;
    if (n === 52 && !done) {
      done = true; stopTimer();
      var st = G.bumpStreak(KEY, nav.get());
      var win = $('#g-win');
      if (win) {
        win.innerHTML = 'You win! Cleared in ' + S.moves + ' moves. ' +
          (st > 1 ? ('That\u2019s a <strong>' + st + '-day streak</strong>. \uD83D\uDD25') : 'Come back tomorrow to start a streak.') +
          ' <a href="daily-sudoku.html">Try the sudoku &rarr;</a>';
        win.classList.add('show');
      }
      if (nav) nav.paintStreak();
      try { localStorage.removeItem('g_prog_' + KEY + '_' + nav.get()); } catch (e) {}
    }
  }

  // ---------- rendering ----------
  function cardEl(c, opts) {
    var d = G.el('div', 'g-card ' + (RED[c.s] ? 'red' : 'black'));
    if (!c.up) { d.classList.add('back'); return d; }
    var t = G.el('div', 'c-top', rankStr(c.r) + SUITS[c.s]);
    var m = G.el('div', 'c-mid', SUITS[c.s]);
    var b = G.el('div', 'c-bot', rankStr(c.r) + SUITS[c.s]);
    d.appendChild(t); d.appendChild(m); d.appendChild(b);
    return d;
  }

  function render() {
    var root = $('#g-sol'); if (!root || !S) return;
    root.innerHTML = '';

    // top row: stock, waste, spacer, 4 foundations
    var top = G.el('div', 'g-sol-top');
    // stock
    var stock = G.el('div', 'g-pile slot'); stock.setAttribute('data-pile', 's');
    if (S.s.length) {
      var back = G.el('div', 'g-card back');
      back.style.cssText = 'position:absolute;inset:0;';
      stock.appendChild(back);
      var cnt = G.el('div', null, String(S.s.length));
      cnt.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;text-shadow:0 1px 2px #000;';
      stock.appendChild(cnt);
    } else {
      stock.innerHTML = S.w.length ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:26px;opacity:.5;">\u21BB</div>' : '';
    }
    stock.addEventListener('click', function () { if (!drag) stockClick(); });
    top.appendChild(stock);
    // waste
    var waste = G.el('div', 'g-pile slot'); waste.setAttribute('data-pile', 'w');
    if (S.w.length) {
      var wc = cardEl(S.w[S.w.length - 1]);
      wc.style.cssText = 'position:absolute;inset:0;';
      wc.setAttribute('data-from', 'w');
      waste.appendChild(wc);
    }
    top.appendChild(waste);
    var spacer = G.el('div', 'g-pile'); spacer.style.visibility = 'hidden';
    top.appendChild(spacer);
    // foundations
    for (var f = 0; f < 4; f++) {
      (function (f) {
        var fp = G.el('div', 'g-pile slot found');
        fp.setAttribute('data-pile', 'f' + f);
        fp.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;opacity:.35;">' + SUITS[f] + '</div>';
        var pile = S.f[f];
        if (pile.length) {
          var c = cardEl(pile[pile.length - 1]);
          c.style.cssText = 'position:absolute;inset:0;';
          c.setAttribute('data-from', 'f' + f);
          fp.appendChild(c);
        }
        top.appendChild(fp);
      })(f);
    }
    root.appendChild(top);

    // tableau
    var tab = G.el('div', 'g-sol-tableau');
    for (var p = 0; p < 7; p++) {
      (function (p) {
        var pile = G.el('div', 'g-pile');
        pile.setAttribute('data-pile', 't' + p);
        var cards = S.t[p], y = 0;
        if (!cards.length) pile.classList.add('slot');
        cards.forEach(function (c, i) {
          var ce = cardEl(c);
          ce.style.top = y + 'px';
          ce.style.left = '0';
          ce.setAttribute('data-from', 't' + p);
          ce.setAttribute('data-idx', String(i));
          if (selected && selected.from === 't' + p) {
            var start = cards.length - selected.count;
            if (i >= start) ce.classList.add('sel');
          }
          pile.appendChild(ce);
          y += c.up ? 24 : 10;
        });
        pile.style.height = 'calc(var(--cw)*1.42 + ' + y + 'px)';
        tab.appendChild(pile);
      })(p);
    }
    root.appendChild(tab);

    if (selected && (selected.from === 'w' || selected.from[0] === 'f')) {
      var sc = root.querySelector('[data-from="' + selected.from + '"]');
      if (sc) sc.classList.add('sel');
    }
  }

  function updateStats() {
    var m = $('#g-moves'); if (m) m.textContent = S.moves + ' moves';
    var t = $('#g-timer'); if (t) t.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function updateAuto() {
    var b = $('#g-autofinish'); if (!b) return;
    var ready = !done && S.s.length === 0 && S.w.length === 0 &&
      S.t.every(function (p) { return p.every(function (c) { return c.up; }); });
    b.style.display = ready ? '' : 'none';
  }

  function autoFinish() {
    var iv = setInterval(function () {
      var moved = false;
      outer:
      for (var ti = 0; ti < 7 && !moved; ti++) {
        var p = S.t[ti];
        if (p.length && autoToFoundation('t' + ti)) moved = true;
      }
      if (!moved) { clearInterval(iv); return; }
    }, 90);
  }

  // ---------- input: click + drag ----------
  function pileNameFromEl(elm) {
    var n = elm.closest ? elm.closest('[data-pile]') : null;
    return n ? n.getAttribute('data-pile') : null;
  }

  function onCardPointerDown(e, cardElm) {
    if (done || e.button !== undefined && e.button !== 0) return;
    var from = cardElm.getAttribute('data-from');
    if (!from) return;
    var idx = cardElm.getAttribute('data-idx');
    var count = 1;
    if (from[0] === 't') {
      var pile = S.t[+from.slice(1)];
      var i = +idx;
      if (!pile[i].up) return;
      count = pile.length - i;
    } else {
      var p = pileOf(from);
      if (!p.length || !p[p.length - 1].up) return;
    }
    var startX = e.clientX, startY = e.clientY;
    var cur = { from: from, count: count, x0: startX, y0: startY, active: false, ghost: null };

    function onMove(ev) {
      if (!cur.active && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 9) {
        cur.active = true;
        var ghost = G.el('div');
        ghost.style.cssText = 'position:fixed;left:0;top:0;z-index:99;pointer-events:none;';
        var moving = movingCards(cur.from, cur.count);
        moving.forEach(function (c, k) {
          var ce = cardEl(c);
          ce.classList.add('drag');
          ce.style.position = 'absolute';
          ce.style.top = (k * 24) + 'px';
          ce.style.left = '0';
          ghost.appendChild(ce);
        });
        document.body.appendChild(ghost);
        cur.ghost = ghost;
      }
      if (cur.active) {
        cur.ghost.style.transform = 'translate(' + (ev.clientX - startX) + 'px,' + (ev.clientY - startY) + 'px)';
        // position ghost at card origin: use the card's bounding rect
        var r = cardElm.getBoundingClientRect();
        cur.ghost.style.left = r.left + 'px';
        cur.ghost.style.top = r.top + 'px';
      }
    }
    function onUp(ev) {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
      if (cur.active) {
        if (cur.ghost) cur.ghost.remove();
        var under = document.elementFromPoint(ev.clientX, ev.clientY);
        var to = under ? pileNameFromEl(under) : null;
        if (to && to !== cur.from && (to[0] === 't' || to[0] === 'f')) applyMove(cur.from, cur.count, to);
        drag = null;
      } else {
        handleClick(from, idx);
      }
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    drag = cur;
  }

  function handleClick(from, idx) {
    if (from === 's') { stockClick(); return; }
    if (selected) {
      if (selected.from === from && (from[0] !== 't' || +idx === S.t[+from.slice(1)].length - selected.count)) {
        selected = null; render(); return; // deselect
      }
      var to = from; // clicked a card: target its pile
      if (applyMove(selected.from, selected.count, to)) return;
      // else fall through: select the newly clicked card
    }
    var n = validSelection(from);
    if (from[0] === 't') {
      var pile = S.t[+from.slice(1)], i = +idx;
      if (pile[i] && pile[i].up) { selected = { from: from, count: pile.length - i }; render(); }
    } else if (n) { selected = { from: from, count: 1 }; render(); }
  }

  function bindInput() {
    var root = $('#g-sol');
    root.addEventListener('pointerdown', function (e) {
      var card = e.target.closest ? e.target.closest('.g-card[data-from]') : null;
      if (card && !card.classList.contains('back')) { e.preventDefault(); onCardPointerDown(e, card); }
    });
    root.addEventListener('dblclick', function (e) {
      var card = e.target.closest ? e.target.closest('.g-card[data-from]') : null;
      if (card && !card.classList.contains('back')) autoToFoundation(card.getAttribute('data-from'));
    });
    root.addEventListener('click', function (e) {
      // clicks on empty pile slots (no card)
      if (e.target.closest && e.target.closest('.g-card')) return;
      var pile = e.target.closest ? e.target.closest('[data-pile]') : null;
      if (!pile) return;
      var name = pile.getAttribute('data-pile');
      if (name === 's') return; // handled by stock's own listener
      if (selected && (name[0] === 't' || name[0] === 'f')) applyMove(selected.from, selected.count, name);
      else if (selected) { selected = null; render(); }
    });
  }

  function startTimer() {
    stopTimer(); sec = 0;
    timerId = setInterval(function () {
      if (done) return;
      sec++; updateStats();
    }, 1000);
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

  function build(ds) {
    undoStack = []; selected = null; drag = null;
    if (!loadProg(ds)) deal(ds);
    done = false;
    render(); updateStats(); updateAuto(); startTimer();
    var win = $('#g-win'); if (win) win.classList.remove('show');
  }

  function init() {
    bindInput();
    var u = $('#g-undo');
    if (u) u.addEventListener('click', doUndo);
    var nw = $('#g-new');
    if (nw) nw.addEventListener('click', function () {
      if (!confirm('Restart today\u2019s deal from scratch?')) return;
      try { localStorage.removeItem('g_prog_' + KEY + '_' + nav.get()); } catch (e) {}
      deal(nav.get()); done = false; render(); updateStats(); updateAuto(); startTimer();
      var win = $('#g-win'); if (win) win.classList.remove('show');
    });
    var af = $('#g-autofinish');
    if (af) af.addEventListener('click', autoFinish);
    nav = G.initDateNav(KEY, build);
  }

  // Test hook (harmless in production): exposes pure game logic for automated checks.
  window.__solitaire = {
    deal: deal, applyMove: applyMove, stockClick: stockClick,
    autoToFoundation: autoToFoundation, doUndo: doUndo,
    canDropOnTableau: canDropOnTableau, canDropOnFoundation: canDropOnFoundation,
    validSelection: validSelection, movingCards: movingCards,
    getS: function () { return S; }, setS: function (s) { S = s; },
    setNav: function (n) { nav = n; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
