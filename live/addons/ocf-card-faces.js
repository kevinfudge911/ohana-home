(function(){
 if (window.__ohanaOCF) return; window.__ohanaOCF = 1;
 var busy = false, obs = null, queued = false;
 function defs(){
  if (document.getElementById('ocfDefs')) return;
  var s = document.createElement('div');
  s.innerHTML = '<svg id="ocfDefs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs><linearGradient id="ocfHolo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".22" stop-color="#fff1d2"/><stop offset=".42" stop-color="#f7edfb"/><stop offset=".6" stop-color="#e9f7f1"/><stop offset=".8" stop-color="#fff0cf"/><stop offset="1" stop-color="#fffaf0"/></linearGradient></defs></svg>';
  document.body.appendChild(s.firstChild);
 }
 function fit(){
  document.querySelectorAll('.sp-hand-browser').forEach(function(b){
   var rail = b.querySelector('.sp-hand-rail'); if (!rail) return;
   var cards = rail.querySelectorAll(':scope > .sp-card'), n = cards.length;
   var face = cards.length ? (cards[cards.length-1].querySelector('.sp-fan-face') || cards[cards.length-1]) : null;
   var fw = face ? face.getBoundingClientRect().width : 72;
   var W = b.getBoundingClientRect().width;
   var step = n > 1 ? Math.floor((W - fw - 4) / (n - 1)) : 44;
   step = Math.min(44, step);
   var ok = n > 0 && step >= 20;
   b.classList.toggle('ocf-fit', ok);
   if (ok) { var v = step + 'px'; if (rail.style.getPropertyValue('--ocf-step') !== v) rail.style.setProperty('--ocf-step', v); }
  });
 }
 function run(){ if (busy) return; busy = true; try { if (obs) obs.disconnect(); defs(); fit(); } catch(e){ console.warn('Ohana cards', e && e.message); } finally { busy = false; watch(); } }
 function soon(){ if (queued) return; queued = true; requestAnimationFrame(function(){ queued = false; run(); }); }
 function watch(){ if (!obs) obs = new MutationObserver(function(){ if (!busy) soon(); }); obs.observe(document.body, {childList:true, subtree:true}); }
 window.addEventListener('resize', soon);
 function start(){ watch(); run(); }
 if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
