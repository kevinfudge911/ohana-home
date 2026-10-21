const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const worker=fs.readFileSync('live/worker.js','utf8'),file=path.join('live',worker.match(/^import APP_HTML from "\.\/(.*?)";/m)[1]),html=fs.readFileSync(file,'utf8');
let scriptCount=0;for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(/type=["']application\/(?:ld\+)?json/.test(m[1]))continue;new vm.Script(m[2]);scriptCount++;}
const a=html.indexOf('function dominoBoardLayout('),b=html.indexOf('function renderDomino(',a);assert(a>0&&b>a);
const ctx=vm.createContext({dominoTileFace:(t,attrs,cls)=>`<button data-id="${t.id}" ${attrs} class="${cls}"></button>`});vm.runInContext(html.slice(a,b)+';this.api={dominoBoardLayout,dominoTrainLayout,fitDominoLayout}',ctx);
const tiles=[];for(let i=0;i<91;i++)tiles.push({tile:{id:i,a:i%13,b:i%5===0?i%13:(i+1)%13}});
let cases=0;
for(const n of [0,1,2,9,20,46,70,90,91])for(const [width,height]of [[390,420],[844,160],[1280,300]]){
 const st={board:tiles.slice(0,n),ends:{left:0,right:1},lastPlay:{tile:{id:n-1}}},before=JSON.stringify(st),layout=ctx.api.fitDominoLayout(st,{players:[1,2]},width,height);
 assert.equal(JSON.stringify(st),before);assert.equal(layout.pieces.length,n);assert.equal(new Set(layout.pieces.map(p=>p.tile.id)).size,n);assert(layout.w>0&&layout.h>0);
 for(const p of layout.pieces)assert(p.x>=-145&&p.y>=-73&&p.w>0&&p.h>0);
 for(const end of [layout.left,layout.right])assert(end.x>=0&&end.y>=0&&end.x<=layout.w&&end.y<=layout.h);
 // Separate tiles may touch at turns but must never cover each other.
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const p=layout.pieces[i],q=layout.pieces[j];const overlapX=Math.min(p.x+p.w,q.x+q.w)-Math.max(p.x,q.x),overlapY=Math.min(p.y+p.h,q.y+q.h)-Math.max(p.y,q.y);assert(!(overlapX>1&&overlapY>1),`overlap ${n} pieces${i}/${j}`);}
 cases++;
}
const st={board:[tiles[0]],trains:{1:{tiles:tiles.slice(1,31)},2:{tiles:tiles.slice(31,61)},mexican:{tiles:tiles.slice(61),open:true}}},before=JSON.stringify(st),layout=ctx.api.dominoTrainLayout(st,{players:[1,2]},740);
assert.equal(JSON.stringify(st),before);assert.equal(layout.pieces.length,90);assert(layout.h>200);assert(layout.w<1300);for(const id of ['1','2','mexican'])assert(layout['train-'+id].y<=layout.h);cases++;
assert(!html.slice(html.indexOf('function renderWords('),html.indexOf('// Compact Ohana confirmations;')).includes('Pinch to zoom the board'));
const pinch=html.slice(html.indexOf('function initWordRackPinch('),html.indexOf('// Ohana Words: zoom just the board'));
assert(!pinch.includes('localStorage'));assert(!pinch.includes('addEventListener'));assert(pinch.includes("removeProperty('zoom')"));
assert(html.includes("Play${preview.total ? ' +' + preview.total : ''}"));assert(!html.slice(html.indexOf('function renderWords('),html.indexOf('// Compact Ohana confirmations;')).includes('${previewHtml}'));
const {JSDOM}=require('jsdom');
const renderSource=html.slice(html.indexOf('const DOMINO_INLAYS='),html.indexOf('function hfMinMeldFE('));
const dom=new JSDOM('<div id="board"></div>',{runScripts:'outside-only',url:'http://fictional.test'}),w=dom.window;
w.eval(`let S={me:{id:1},movePending:false};let size={width:1280,height:300},moves=[],observers=[];
 const $=s=>document.querySelector(s),esc=s=>String(s),nameOf=id=>'Fixture '+id,requestRematch=()=>{throw Error('No real replay')};
 function move(payload,after){moves.push(payload);after?.();}
 class ResizeObserver{constructor(fn){this.fn=fn;observers.push(this)}observe(){}disconnect(){}}
 HTMLElement.prototype.getBoundingClientRect=function(){return {width:size.width,height:size.height,left:0,top:0,right:size.width,bottom:size.height}};
 ${renderSource}
 window.fx={get S(){return S},moves,render:renderDomino,resize(width,height){size={width,height};for(const o of observers)o.fn()}};`);
const state={mode:'draw',board:tiles.slice(0,46),ends:{left:0,right:1},hands:{1:[{id:99,a:0,b:1},{id:100,a:3,b:3}]},playable:['99:left','99:right'],boneyard:5,scores:{1:10,2:20}},g={id:1,status:'playing',players:[1,2],turn:0};
const original=JSON.stringify(state);w.fx.S.dominoSel=99;w.fx.render(state,g,true);
assert.equal(w.document.querySelectorAll('[data-board-tile]').length,46);assert.equal(w.document.querySelectorAll('.legal-end').length,2);
const firstTransform=w.document.querySelector('.domino-chain').style.transform;
w.fx.resize(390,420);assert.notEqual(w.document.querySelector('.domino-chain').style.transform,firstTransform);assert.equal(w.document.querySelectorAll('.legal-end').length,2);
w.document.querySelector('.domino-hand-dock').scrollTop=44;w.document.querySelector('.domino-hand-dock').dispatchEvent(new w.Event('scroll'));w.fx.render(state,g,true);assert.equal(w.document.querySelector('.domino-hand-dock').scrollTop,44,'poll must preserve rack row');
w.document.querySelector('[data-domino-end="left"]').click();assert.equal(w.fx.moves.length,1);assert.deepEqual(JSON.parse(JSON.stringify(w.fx.moves[0])),{action:'play',tileId:99,side:'left'});assert.equal(JSON.stringify(state),original);
w.fx.S.movePending=false;w.fx.S.dominoSel=99;w.fx.render(state,{...g,id:2,turn:1},false);assert.equal(w.document.querySelector('.domino-hand-dock').scrollTop,0);assert([...w.document.querySelectorAll('[data-domino-tile]')].every(e=>e.disabled));w.document.querySelector('[data-domino-tile]').click();w.document.querySelector('[data-domino-end="left"]').click();assert.equal(w.fx.moves.length,1);assert.equal(JSON.stringify(state),original);
w.fx.S.movePending=true;w.fx.render(state,g,true);w.fx.resize(844,160);w.document.querySelector('[data-domino-end="left"]').click();assert.equal(w.fx.moves.length,1,'busy reflow cannot send another move');assert.equal(w.document.querySelectorAll('.legal-end').length,0);const plane=w.document.querySelector('.domino-chain'),cameraBefore=plane.style.transform;w.document.querySelector('.domino-board').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));assert.notEqual(plane.style.transform,cameraBefore);assert(Math.abs(parseFloat(plane.style.getPropertyValue('--domino-end-size'))*w.fx.S.dominoCamera.scale-44)<.001);assert(Math.abs(parseFloat(plane.style.getPropertyValue('--domino-label-size'))*w.fx.S.dominoCamera.scale-14)<.001);assert.equal(w.fx.moves.length,1,'camera navigation cannot move a game tile');const cx=(844/2-w.fx.S.dominoCamera.x)/w.fx.S.dominoCamera.scale,cy=(160/2-w.fx.S.dominoCamera.y)/w.fx.S.dominoCamera.scale;w.fx.resize(390,420);assert(Math.abs((390/2-w.fx.S.dominoCamera.x)/w.fx.S.dominoCamera.scale-cx)<.001);assert(Math.abs((420/2-w.fx.S.dominoCamera.y)/w.fx.S.dominoCamera.scale-cy)<.001);dom.window.close();
const zoomDom=new JSDOM('<div id="board"><div class="wbwrap"><div class="wb"><button id="cell">cell</button></div></div></div><div class="game-tray"><div class="rack"></div></div>',{runScripts:'outside-only',url:'http://fictional.test'}),z=zoomDom.window;
z.eval(`let S={},size={w:720,h:76},watchers=[];let dragState=null,suppressTileClickUntil=0;const cancelWordDrag=()=>{};
 class ResizeObserver{constructor(fn){this.fn=fn;watchers.push(this)}observe(){}disconnect(){}}
 const wrap=document.querySelector('.wbwrap'),wb=document.querySelector('.wb');
 Object.defineProperties(wrap,{clientWidth:{get:()=>size.w},clientHeight:{get:()=>size.h}});Object.defineProperties(wb,{offsetWidth:{get:()=>size.w},offsetHeight:{get:()=>size.w}});
 ${html.slice(html.indexOf('const WB_ZOOM='),html.indexOf('let momentFrame='))}
 initBoardZoom({id:901});window.fx={get view(){return S.wbView},resize(w,h){size={w,h};watchers.forEach(o=>o.fn())}};`);
assert.equal(z.fx.view.y,-322);const cell=z.document.getElementById('cell'),key=k=>cell.dispatchEvent(new z.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));key('0');assert(Math.abs(z.fx.view.s-76/720)<1e-6);key('+');assert(z.fx.view.s>76/720);z.fx.resize(382,466);assert(z.fx.view.x<382);key('0');assert.equal(z.fx.view.s,1);assert.equal(z.fx.view.y,42);assert.equal(z.document.querySelector('.rack').style.zoom,'');zoomDom.window.close();
const wordsSuite=fs.readFileSync('tests/word-single-return.cjs','utf8'),makeWords=new Function('require',wordsSuite.slice(0,wordsSuite.indexOf('for(const turn of'))+';return fixture;')(require),warn=makeWords();warn.w.Storage.prototype.setItem=()=>{throw Error('Fictional quota failure')};warn.w.fx.S.wordDraftStorageProblem=true;const savedState=JSON.stringify(warn.st);warn.call();assert(!warn.w.document.querySelector('.word-private-draft-hint').classList.contains('sr-only'));assert(warn.w.document.querySelector('.word-private-draft-hint').textContent.includes('could not save'));assert.equal(JSON.stringify(warn.st),savedState);warn.dom.window.close();
console.log(`PASS ${cases} fictional Domino geometry/preservation cases; render resize/manual-camera center/endpoint/rack-scroll/turn guards; ${scriptCount} inline scripts parse; Words keyboard Fit/zoom/resize and visible storage-warning preservation checks.`);
