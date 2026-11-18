(function(){
 if (window.__ohanaHF4) return; window.__ohanaHF4 = 1;
 var openFor = null, busy = false, obs = null;
 function st(){ try { return (typeof S !== 'undefined' && S) ? S : null; } catch(e){ return null; } }
 function nm(g,p){ try { if (typeof nameOf === 'function') return nameOf(p); } catch(e){} return (g.names && g.names[p]) || 'Player'; }
 function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
 function cnt(v){ return Array.isArray(v) ? v.length : (+v || 0); }
 var ORDER = ['Joker','2','A','K','Q','J','10','9','8','7','6','5','4','3'];
 function seatHTML(g,s,p,pos){
  var foot = !!(s.inFoot && s.inFoot[p]);
  var left = foot ? cnt(s.feet && s.feet[p]) : cnt(s.hands && s.hands[p]);
  var turn = g.players[g.turn] === p;
  var melds = ((s.melds && s.melds[p]) || []).slice().sort(function(a,b){ return ORDER.indexOf(a.rank) - ORDER.indexOf(b.rank); });
  var r3 = cnt(s.red3s && s.red3s[p]);
  var h = '<button type="button" class="hf4-seat' + (turn ? ' hf4-turn' : '') + (openFor === p ? ' hf4-open' : '') + '" data-pos="' + pos + '" data-hf4="' + p + '" aria-label="' + esc(nm(g,p)) + ', ' + left + ' cards in ' + (foot ? 'foot' : 'hand') + (turn ? ', their turn' : '') + '. Tap to see their cards.">';
  h += '<span class="hf4-name">' + esc(nm(g,p)) + '</span><span class="hf4-row">';
  h += '<span class="hf4-mini"><span class="hf4-c back' + (foot ? ' foot' : '') + '">' + (foot ? 'F' : 'H') + '</span><span class="hf4-n">' + left + '</span></span>';
  melds.forEach(function(m){
   var n = (m.cards || []).length, dirty = (m.cards || []).some(function(c){ return c.rank === '2' || c.rank === 'Joker'; }), book = m.rank !== '3' && n >= 7;
   h += '<span class="hf4-mini"><span class="hf4-c ' + (dirty ? 'dirty' : 'clean') + (book ? ' book' : '') + '">' + esc(m.rank) + '</span><span class="hf4-n">' + n + '</span></span>';
  });
  if (r3) h += '<span class="hf4-mini"><span class="hf4-c r3">3</span><span class="hf4-n">' + r3 + '</span></span>';
  return h + '</span></button>';
 }
 function apply(){
  var S0 = st(), area = document.querySelector('.hf-area');
  if (!area) { closeSheet(); return; }
  var g = S0 && S0.gstate, s = g && g.state;
  if (!g || g.type !== 'handfoot' || !s || !Array.isArray(g.players) || g.players.length < 3) {
   if (area.classList.contains('hf4')) area.classList.remove('hf4');
   closeSheet(); return;
  }
  var felt = area.querySelector('.hf-felt'), decks = area.querySelector('.hf-decks');
  if (!felt) return;
  var me = S0.me && S0.me.id, players = g.players, i = players.indexOf(me);
  if (i < 0) i = players.findIndex(function(x){ return String(x) === String(me); });
  var others = [];
  for (var k = 1; k < players.length; k++) others.push(players[(Math.max(i,0) + k) % players.length]);
  var pos = others.length === 2 ? ['left','right'] : ['left','top','right'];
  area.classList.add('hf4');
  var table = felt.querySelector(':scope > .hf4-table');
  if (!table) { table = document.createElement('div'); table.className = 'hf4-table'; felt.insertBefore(table, felt.firstChild); }
  table.classList.toggle('hf4-three', others.length === 2);
  var html = others.map(function(p,j){ return seatHTML(g,s,p,pos[j] || 'top'); }).join('');
  var mid = table.querySelector(':scope > .hf4-mid');
  var seatsSig = html;
  if (table.__sig !== seatsSig) {
   table.querySelectorAll(':scope > .hf4-seat').forEach(function(e){ e.remove(); });
   table.insertAdjacentHTML('afterbegin', html);
   table.__sig = seatsSig;
  }
  if (!mid) { mid = document.createElement('div'); mid.className = 'hf4-mid'; table.appendChild(mid); }
  if (decks && decks.parentElement !== mid) mid.appendChild(decks);
  if (openFor != null) fillSheet(area, g);
 }
 function tableFor(area, g, p){
  var label = nm(g,p) + ' public cards';
  var list = area.querySelectorAll('.hf-public-table');
  for (var k = 0; k < list.length; k++) if (list[k].getAttribute('aria-label') === label) return list[k];
  return null;
 }
 function fillSheet(area, g){
  var sh = area.querySelector(':scope > .hf4-sheet');
  if (!sh) {
   sh = document.createElement('div'); sh.className = 'hf4-sheet'; sh.setAttribute('role','dialog');
   area.appendChild(sh);
  }
  var t = tableFor(area, g, openFor);
  var head = '<div class="hf4-sheet-h"><b>' + esc(nm(g, openFor)) + '</b><button type="button" class="hf4-x" aria-label="Close">✕</button></div>';
  if (sh.__for !== openFor || !sh.querySelector('.hf4-sheet-h')) { sh.innerHTML = head; sh.__for = openFor; }
  var cur = sh.querySelector('.hf-public-table, .hf4-empty');
  if (t && t !== cur) { if (cur) cur.remove(); sh.appendChild(t); }
  if (!t && !cur) sh.insertAdjacentHTML('beforeend', '<p class="hf4-empty">No cards laid down yet.</p>');
 }
 function closeSheet(){
  openFor = null;
  var sh = document.querySelector('.hf4-sheet');
  if (sh) { var t = sh.querySelector('.hf-public-table'), felt = document.querySelector('.hf-area .hf-felt'); if (t && felt) felt.appendChild(t); sh.remove(); }
  document.querySelectorAll('.hf4-seat.hf4-open').forEach(function(e){ e.classList.remove('hf4-open'); });
 }
 function run(){ if (busy) return; busy = true; try { if (obs) obs.disconnect(); apply(); } catch(e){ console.warn('Ohana table seats', e && e.message); } finally { busy = false; watch(); } }
 var queued = false;
 function soon(){ if (queued) return; queued = true; requestAnimationFrame(function(){ queued = false; run(); }); }
 function watch(){ if (!obs) obs = new MutationObserver(function(){ if (!busy) soon(); }); obs.observe(document.body, {childList:true, subtree:true}); }
 document.addEventListener('click', function(ev){
  var seat = ev.target.closest && ev.target.closest('.hf4-seat');
  if (seat) {
   ev.preventDefault(); ev.stopPropagation();
   var p = +seat.getAttribute('data-hf4');
   if (openFor === p) closeSheet(); else { closeSheet(); openFor = p; run(); var S0 = st(); }
   document.querySelectorAll('.hf4-seat').forEach(function(e){ e.classList.toggle('hf4-open', +e.getAttribute('data-hf4') === openFor); });
   return;
  }
  if (ev.target.closest && ev.target.closest('.hf4-x')) { ev.preventDefault(); ev.stopPropagation(); closeSheet(); return; }
  if (openFor != null && !(ev.target.closest && ev.target.closest('.hf4-sheet'))) closeSheet();
 }, true);
 function start(){ watch(); run(); }
 if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
