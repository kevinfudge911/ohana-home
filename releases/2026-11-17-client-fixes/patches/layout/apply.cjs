const fs=require('fs');const[src,dst]=process.argv.slice(2);let s=fs.readFileSync(src,'utf8');function rep(a,b){if(s.split(a).length!==2)throw Error('guard mismatch '+a.slice(0,60));s=s.replace(a,b)}
rep('inset:var(--ohana-game-header-space,96px) 0 calc(var(--game-rail-space,190px) - 28px + var(--word-rack-space,80px))!important','inset:var(--word-board-header-bottom,var(--ohana-game-header-space,96px)) 0 calc(var(--game-rail-space,190px) - 28px + var(--word-rack-space,80px))!important');
rep('  const V=S.wbView;\n  const clamp=',`  const V=S.wbView;
  const head=document.querySelector('#game-head'),board=document.querySelector('#board');
  const syncHeader=()=>{if(!wrap.isConnected||!board)return;const bottom=head?.getBoundingClientRect().bottom||0;if(bottom>0)board.style.setProperty('--word-board-header-bottom',Math.ceil(bottom+4)+'px');};
  syncHeader();
  const fitScale=()=>Math.min(1,wrap.clientWidth/(wb.offsetWidth||1),wrap.clientHeight/(wb.offsetHeight||1));
  const minScale=()=>Math.min(WB_ZOOM.min,Math.max(.05,fitScale()));
  const clamp=`);
rep('V.s=Math.min(WB_ZOOM.max,Math.max(WB_ZOOM.min,V.s));if(V.center||V.autoCenter)', 'if(V.autoCenter)V.s=V.fitAll?fitScale():Math.max(.55,fitScale());V.s=Math.min(WB_ZOOM.max,Math.max(minScale(),V.s));if(V.center||V.autoCenter)');
rep('V.autoCenter=true;apply();save();}else zoomAt', 'V.autoCenter=true;V.fitAll=true;apply();save();}else zoomAt');
rep('V.autoCenter=false;apply();save();};', 'V.autoCenter=false;V.fitAll=false;apply();save();};');
rep('Math.max(WB_ZOOM.min,V.s*factor)', 'Math.max(minScale(),V.s*factor)');
rep('Math.max(WB_ZOOM.min,pinch.s*d/pinch.d)', 'Math.max(minScale(),pinch.s*d/pinch.d)');
rep('const observer=new ResizeObserver(()=>{if(wrap.isConnected)apply();});observer.observe(wrap);', 'const observer=new ResizeObserver(()=>{if(wrap.isConnected){syncHeader();apply();}});observer.observe(wrap);if(head)observer.observe(head);');
fs.writeFileSync(dst,s);
