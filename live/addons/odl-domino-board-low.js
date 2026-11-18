(function(){
 if (window.__ohanaODL) return; window.__ohanaODL = 1;
 var queued = false, obs = null, cobs = null, watched = null;
 function place(){
  var board = document.querySelector('.domino-board'), chain = board && board.querySelector(':scope > .domino-chain');
  if (!chain) { if (cobs) { cobs.disconnect(); watched = null; } return; }
  if (watched !== chain) {
   if (!cobs) cobs = new MutationObserver(function(){ soon(); });
   cobs.disconnect(); cobs.observe(chain, {attributes:true, attributeFilter:['style','class']}); watched = chain;
  }
  if (!chain.children.length) return;
  var br = board.getBoundingClientRect(), bot = -1e9;
  for (var k = 0; k < chain.children.length; k++) { var r = chain.children[k].getBoundingClientRect(); if (r.height && r.bottom > bot) bot = r.bottom; }
  if (!br.height || bot < -1e8) return;
  var cur = parseFloat((chain.style.getPropertyValue('translate') || '0 0').split(' ')[1]) || 0;
  var bottomNoShift = bot - cur;
  var want = Math.max(0, Math.round(br.bottom - 10 - bottomNoShift));
  if (Math.abs(want - cur) > 1) chain.style.setProperty('translate', '0px ' + want + 'px', 'important');
 }
 function soon(){ if (queued) return; queued = true; requestAnimationFrame(function(){ queued = false; try { place(); } catch(e){ console.warn('Ohana dominoes place', e && e.message); } }); }
 function start(){ obs = new MutationObserver(soon); obs.observe(document.body, {childList:true, subtree:true}); window.addEventListener('resize', soon); soon(); }
 if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
