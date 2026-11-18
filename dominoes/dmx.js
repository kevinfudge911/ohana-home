(function(){
'use strict';
if(window.ohanaDominoPremium)return;
if(typeof dominoPipsFace!=='function'||typeof dominoTileFace!=='function'||typeof renderDomino!=='function'){window.ohanaDominoPremium={ok:false};return;}
const L=[[],[[50,50]],[[25,25],[75,75]],[[25,25],[50,50],[75,75]],[[25,25],[75,25],[25,75],[75,75]],[[25,25],[75,25],[50,50],[25,75],[75,75]],[[25,22],[75,22],[25,50],[75,50],[25,78],[75,78]],[[25,22],[75,22],[25,50],[50,50],[75,50],[25,78],[75,78]],[[25,20],[75,20],[25,40],[75,40],[25,60],[75,60],[25,80],[75,80]],[[22,20],[78,20],[22,40],[78,40],[50,50],[22,60],[78,60],[22,80],[78,80]],[[25,15],[75,15],[25,32.5],[75,32.5],[25,50],[75,50],[25,67.5],[75,67.5],[25,85],[75,85]],[[22,15],[78,15],[22,32.5],[78,32.5],[22,50],[50,50],[78,50],[22,67.5],[78,67.5],[22,85],[78,85]],[[20,20],[50,20],[80,20],[20,40],[50,40],[80,40],[20,60],[50,60],[80,60],[20,80],[50,80],[80,80]],[[20,15],[50,15],[80,15],[20,32.5],[80,32.5],[20,50],[50,50],[80,50],[20,67.5],[80,67.5],[20,85],[50,85],[80,85]],[[20,15],[50,15],[80,15],[20,32.5],[50,32.5],[80,32.5],[20,50],[80,50],[20,67.5],[50,67.5],[80,67.5],[20,85],[50,85],[80,85]],[[20,15],[50,15],[80,15],[20,32.5],[50,32.5],[80,32.5],[20,50],[50,50],[80,50],[20,67.5],[50,67.5],[80,67.5],[20,85],[50,85],[80,85]]];
const origPips=dominoPipsFace,origFace=dominoTileFace,origRender=renderDomino;
let inlays=null;try{inlays=DOMINO_INLAYS;}catch{}
const cache=new Map();
function pips(value){const n=Math.max(0,Math.min(15,Number(value)||0));const hit=cache.get(n);if(hit)return hit;const theme=inlays&&inlays[n];if(!theme)return origPips(value);
 const r=n>=10?7.4:n>=8?8.6:10.2,rw=(r*1.24).toFixed(2);
 const art='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3d1a" stop-opacity=".62"/><stop offset=".55" stop-color="#8a6a3e" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></linearGradient><radialGradient id="g" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".78"/><stop offset=".38" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient></defs>'+L[n].map(([x,y])=>'<g transform="translate('+x+' '+y+')"><circle r="'+rw+'" fill="url(#w)"/><circle r="'+r+'" fill="'+theme.color+'"/><g transform="scale('+(r/10.5).toFixed(3)+')" opacity=".9">'+theme.icon+'</g><circle r="'+r+'" fill="url(#g)"/></g>').join('')+'</svg>';
 const uri='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art);
 const out='<span class="domino-pips dmx-pips v'+n+' theme-'+theme.name+'"><svg viewBox="0 0 100 100" aria-hidden="true"><image href="'+uri+'" x="0" y="0" width="100" height="100"/></svg></span>';
 cache.set(n,out);return out;}
function face(t,attrs='',extra=''){const dbl=t&&t.a===t.b;return origFace(t,attrs,extra+(dbl?' dmx-double':''));}
// clack when a new tile lands (not on first open of a table)
let lastGame=null,lastPlayed=null,lastDrop=0;
try{if(typeof AudioSys!=='undefined'&&typeof AudioSys.tileDrop==='function'){const td=AudioSys.tileDrop;AudioSys.tileDrop=function(){lastDrop=performance.now();return td.apply(this,arguments);};}}catch{}
function muted(){try{if(typeof AudioSys==='undefined'||AudioSys.muted||localStorage.getItem('ohana_muted')==='true')return true;}catch{return true;}return false;}
let noise=null;
function clack(){if(muted()||performance.now()-lastDrop<450)return;try{const ctx=AudioSys.getCtx?.();if(!ctx||ctx.state!=='running')return;if(!noise){noise=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.06),ctx.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);}
 const t=ctx.currentTime+.01,out=ctx.createGain();out.gain.value=.22;out.connect(ctx.destination);
 [[2600,0,.9],[1450,.045,.6]].forEach(([f,dt,v])=>{const s=ctx.createBufferSource(),b=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;b.type='bandpass';b.frequency.value=f*(.92+Math.random()*.16);b.Q.value=7;g.gain.setValueAtTime(v,t+dt);g.gain.exponentialRampToValueAtTime(.001,t+dt+.07);s.connect(b);b.connect(g);g.connect(out);s.start(t+dt);s.stop(t+dt+.08);});
 setTimeout(()=>{try{out.disconnect();}catch{}},400);}catch{}}
let garland=null;
function dress(){const b=document.querySelector('#board .domino-board');if(!b)return;if(garland===null){try{const bg=getComputedStyle(b).backgroundImage||'';const m=bg.match(/url\((["']?)([^"')]*garland[^"')]*)\1\)/i);garland=m?'url("'+m[2]+'")':'';}catch{garland='';}}
 if(garland)b.style.setProperty('--dmx-garland',garland);const r=b.getBoundingClientRect();b.style.setProperty('--dmx-top',Math.round(Math.max(10,Math.min(70,r.width*.15)))+'px');}
function render(st,g){const res=origRender.apply(this,arguments);try{dress();const p=document.querySelector('#board .domino-tile.just-played');const id=p?p.getAttribute('data-board-tile'):null;const gid=g&&g.id;if(gid!==lastGame){lastGame=gid;lastPlayed=id;}else if(id&&id!==lastPlayed){lastPlayed=id;clack();}}catch{}return res;}
try{dominoPipsFace=pips;dominoTileFace=face;renderDomino=render;}catch{window.ohanaDominoPremium={ok:false};return;}
window.ohanaDominoPremium={ok:true,clack,get garland(){return garland;}};
})();
