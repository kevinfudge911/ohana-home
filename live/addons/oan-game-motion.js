(function(){
 if (window.__ohanaOAN) return; window.__ohanaOAN = 1;
 try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch(e){}
 var prev = null, prevGame = null, queued = false, busy = false;
 var EASE = 'cubic-bezier(.2,.8,.25,1)';
 function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
 function txt(e){ return (e.textContent || '').replace(/\s+/g, ''); }
 function an(el, frames, opt){ try { if (el && el.animate) el.animate(frames, Object.assign({duration: 260, easing: EASE}, opt || {})); } catch(e){} }
 function gameId(){ try { return (typeof S !== 'undefined' && S && S.game != null) ? String(S.game) : ''; } catch(e){ return ''; } }
 function snap(){
  var m = {};
  function add(g, list, key, val, rect){
   list.forEach(function(el, i){ var r = rect ? el.getBoundingClientRect() : null; m[g + '|' + key(el, i)] = {el: el, v: val ? val(el) : '', g: g, i: i, r: r}; });
  }
  add('mem', qa('.mem>button[data-i]'), function(e){ return e.getAttribute('data-i'); }, function(e){ return (e.className.match(/\b(back|up|done)\b/) || [''])[0]; });
  add('chk', qa('.chk>[data-i]'), function(e){ return e.getAttribute('data-i'); }, function(e){ var p = e.querySelector('.pc'); return p ? p.className.replace(/\s+/g, ' ').trim() : ''; }, true);
  add('ttt', qa('.ttt>button'), function(e, i){ return i; }, function(e){ return txt(e); });
  var tr = qa('.sp-trick .sp-card'); if (!tr.length) tr = qa('.sp-trick>*');
  add('sptrick', tr, function(e){ return txt(e) + (e.className.indexOf('red') > -1 ? 'r' : ''); });
  add('hand', qa('.sp-hand-rail>.sp-card'), function(e){ return 'sp' + txt(e) + (e.className.indexOf('red') > -1 ? 'r' : ''); });
  add('hand', qa('.shuffle-hand .shuffle-card'), function(e){ return 'sh' + txt(e) + (e.className.indexOf('red') > -1 ? 'r' : ''); });
  add('hand', qa('.o10-hand-row>.o10-card'), function(e, i){ return 'o10' + i; });
  add('hand', qa('.hf-hand-card'), function(e, i){ return 'hf' + i; });
  add('shdisc', qa('.shuffle-discard .shuffle-card'), function(e){ return txt(e); });
  qa('.shuffle-meld-cards').forEach(function(p, pi){ add('shmeld', Array.prototype.slice.call(p.querySelectorAll('.shuffle-card')), function(e){ return pi + ':' + txt(e); }); });
  add('win', qa('#game .winbox'), function(){ return 0; });
  return m;
 }
 function deal(cur){
  var n = 0;
  Object.keys(cur).forEach(function(k){
   var it = cur[k];
   if (it.g === 'hand') { an(it.el, [{opacity: 0, translate: '0 26px'}, {opacity: 1, translate: '0 0'}], {duration: 300, delay: Math.min(n++, 14) * 38, fill: 'backwards'}); }
   else if (it.g === 'mem') { an(it.el, [{opacity: 0, scale: '.82'}, {opacity: 1, scale: '1'}], {duration: 280, delay: it.i * 18, fill: 'backwards'}); }
  });
 }
 function winPop(el){
  try { if (getComputedStyle(el).animationName !== 'none') return; } catch(e){}
  an(el, [{opacity: 0, scale: '.72'}, {opacity: 1, scale: '1.05', offset: .65}, {opacity: 1, scale: '1'}], {duration: 560});
 }
 function ghost(it){
  try {
   if (!it.r || !it.el) return; var p = it.el.querySelector('.pc'); if (!p) return;
   var c = p.cloneNode(true), r = it.r;
   c.style.cssText = 'position:fixed;left:' + (r.left + r.width * .1) + 'px;top:' + (r.top + r.height * .1) + 'px;width:' + (r.width * .8) + 'px;height:' + (r.height * .8) + 'px;margin:0;pointer-events:none;z-index:50';
   document.body.appendChild(c);
   var a = c.animate([{opacity: 1, scale: '1'}, {opacity: 0, scale: '.35'}], {duration: 380, easing: 'ease-in'});
   a.onfinish = function(){ c.remove(); }; setTimeout(function(){ if (c.parentNode) c.remove(); }, 900);
  } catch(e){}
 }
 function diff(prev, cur){
  var arrivals = [], vacated = [], handNew = [];
  Object.keys(cur).forEach(function(k){
   var c = cur[k], p = prev[k];
   if (c.g === 'mem') {
    if (p && p.v !== c.v) {
     if (c.v === 'done') an(c.el, [{scale: '1'}, {scale: '1.1', offset: .45}, {scale: '1'}], {duration: 420});
     else an(c.el, [{scale: '0 1'}, {scale: '1 1'}], {duration: 240});
    }
   } else if (c.g === 'chk') {
    if (p && p.v !== c.v) {
     if (c.v && !p.v) arrivals.push(c);
     else if (!c.v && p.v) vacated.push(p);
     else if (c.v && p.v && c.v.split(' ')[1] === p.v.split(' ')[1]) { var pc = c.el.querySelector('.pc'); an(pc, [{scale: '1'}, {scale: '1.22', offset: .5}, {scale: '1'}], {duration: 420}); }
    }
   } else if (c.g === 'ttt') {
    if (p && p.v !== c.v && c.v) { var mk = c.el.querySelector('.ttt-mark') || c.el; an(mk, [{opacity: 0, scale: '.3'}, {opacity: 1, scale: '1.15', offset: .6}, {opacity: 1, scale: '1'}], {duration: 340}); }
   } else if (!p) {
    if (c.g === 'sptrick') an(c.el, [{opacity: 0, translate: '0 46px', scale: '.86'}, {opacity: 1, translate: '0 0', scale: '1'}], {duration: 320});
    else if (c.g === 'shdisc') an(c.el, [{opacity: 0, translate: '0 -24px', scale: '1.12'}, {opacity: 1, translate: '0 0', scale: '1'}], {duration: 280});
    else if (c.g === 'shmeld') an(c.el, [{opacity: 0, translate: '0 30px'}, {opacity: 1, translate: '0 0'}], {duration: 300, delay: Math.min(c.i, 6) * 40, fill: 'backwards'});
    else if (c.g === 'win') winPop(c.el);
    else if (c.g === 'hand') handNew.push(c);
   }
  });
  // Checkers: slide the moved piece from its old square; fade any captured piece.
  arrivals.forEach(function(a){
   var col = a.v.split(' ')[1], from = null;
   for (var i = 0; i < vacated.length; i++) { if (vacated[i].v.split(' ')[1] === col && !vacated[i].used) { from = vacated[i]; break; } }
   var pc = a.el.querySelector('.pc'); if (!pc) return;
   if (from && from.r && a.r) {
    from.used = 1;
    var dx = (from.r.left + from.r.width / 2) - (a.r.left + a.r.width / 2), dy = (from.r.top + from.r.height / 2) - (a.r.top + a.r.height / 2);
    an(pc, [{translate: dx + 'px ' + dy + 'px', scale: '1.08'}, {translate: '0 0', scale: '1'}], {duration: 330});
   } else an(pc, [{opacity: 0, scale: '.5'}, {opacity: 1, scale: '1'}], {duration: 260});
  });
  vacated.forEach(function(v){ if (!v.used) ghost(v); });
  // A fresh deal (new round) gets the dealing stagger; a single new card rises in.
  if (handNew.length >= 5) handNew.forEach(function(c, i){ an(c.el, [{opacity: 0, translate: '0 26px'}, {opacity: 1, translate: '0 0'}], {duration: 300, delay: Math.min(i, 14) * 38, fill: 'backwards'}); });
  else handNew.forEach(function(c){ if (c.el.closest && (c.el.closest('.sp-hand-rail') || c.el.closest('.shuffle-hand'))) an(c.el, [{opacity: 0, translate: '0 -22px'}, {opacity: 1, translate: '0 0'}], {duration: 300}); });
 }
 function run(){
  if (busy) return; busy = true;
  try {
   var g = gameId();
   if (!g || !document.getElementById('board')) { prevGame = g; prev = null; return; }
   var cur = snap();
   if (g !== prevGame || !prev) { prevGame = g; prev = cur; deal(cur); return; }
   diff(prev, cur); prev = cur;
  } catch(e){ console.warn('Ohana motion', e && e.message); }
  finally { busy = false; }
 }
 function soon(){ if (queued) return; queued = true; requestAnimationFrame(function(){ queued = false; run(); }); }
 function start(){ new MutationObserver(function(){ if (!busy) soon(); }).observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']}); soon(); }
 if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
