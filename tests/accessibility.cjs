const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('app.html','utf8'),dom=new JSDOM(html,{url:'https://test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.matchMedia=()=>({matches:true});w.fetch=async()=>({ok:true,json:async()=>({})});
w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
w.eval([...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n')+'\n'+fs.readFileSync('tests/fixtures/words-ui.js','utf8')+'\nwindow.run=code=>eval(code);');
const d=w.document,key=(el,k)=>el.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
const axe=require('axe-core');w.eval(axe.source);
const audits=[];
async function audit(name){const r=await w.axe.run(d,{rules:{'color-contrast':{enabled:false},'region':{enabled:false}}});audits.push([name,r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))]);}
(async()=>{
 w.run('S.game=1;S.gstate=previewGame;renderGame()');
 let tile=d.querySelector('[data-r="0"]');tile.focus();tile.click();assert.equal(d.activeElement.dataset.r,'0');assert.equal(d.activeElement.getAttribute('aria-pressed'),'true');
 let square=d.querySelector('.c[data-i="100"]');square.focus();key(square,'Enter');assert.equal(w.run('S.placed[0].i'),100);assert.equal(d.activeElement.dataset.i,'100');assert.match(d.activeElement.getAttribute('aria-label'),/F, 4 points, unplayed/);
 key(d.activeElement,' ');key(d.activeElement,'ArrowRight');key(d.activeElement,'Enter');assert.equal(w.run('S.placed[0].i'),101);assert.equal(d.activeElement.dataset.i,'101');
 key(d.activeElement,'Home');assert.equal(d.activeElement.dataset.i,'90');key(d.activeElement,'ArrowUp');assert.equal(d.activeElement.dataset.i,'75');
 assert.equal(d.querySelectorAll('.wb-plane [tabindex="0"]').length,1);assert.equal(d.querySelectorAll('.wb .c').length,225);assert.equal(d.querySelectorAll('.wb svg rect').length,225);
 w.run('renderGame()');assert.equal(d.activeElement.dataset.i,'75');await audit('Words');
 const help=d.querySelector('#access-open');help.focus();help.click();assert(d.querySelector('#access-help').open);d.querySelector('#access-quiet').click();assert.equal(w.run('AudioSys.muted'),true);d.querySelector('#access-motion').click();assert(d.documentElement.classList.contains('less-motion'));d.querySelector('#access-motion').focus();key(d.activeElement,'Tab');assert.equal(d.activeElement.id,'access-close');d.querySelector('#access-close').click();assert.equal(d.activeElement.id,'access-open');
 for(const type of ['tictac','memory','checkers']){
  await w.run(`api('/api/game/create',{type:'${type}'})`);w.run('S.gstate=previewGame;renderGame()');
  const cells=[...d.querySelectorAll('#board [data-i]')];assert(cells.every(c=>c.getAttribute('aria-label')));cells[0].focus();key(cells[0],'ArrowRight');assert.equal(d.activeElement.dataset.i,cells[1].dataset.i);await audit(type);
  if(type==='memory'){assert(cells.every(c=>c.getAttribute('aria-label').endsWith('face down')));w.run("previewGame.state.open=[0];renderGame()");assert.match(d.querySelector('[data-i="0"]').getAttribute('aria-label'),/🐢, face up/);assert(!d.querySelector('[data-i="1"]').getAttribute('aria-label').includes('🐢'));}
  if(type==='checkers'){const p=d.querySelector('[data-i="40"]')?.getAttribute('aria-label');const piece=[...d.querySelectorAll('.chk>[data-i]')].find(e=>e.getAttribute('aria-label').includes('red piece'));piece.focus();key(piece,'Enter');assert.equal(d.activeElement.dataset.i,piece.dataset.i);assert.equal(d.activeElement.getAttribute('aria-pressed'),'true');assert(d.querySelector('[aria-label*="available destination"]'));}
 }
 w.run(`S.gstate={...previewGame,type:'mahjong',state:{tiles:[{id:1,face:0,x:0,y:0,z:0},{id:2,face:0,x:3,y:0,z:0},{id:3,face:1,x:0,y:2,z:0},{id:4,face:1,x:3,y:2,z:0}],pairs:0,revision:1,scores:{1:0,2:0},chat:[]}};renderGame()`);
 let mj=d.querySelector('[data-mj="1"]');mj.focus();mj.click();assert.equal(d.activeElement.dataset.mj,'1');assert.equal(d.activeElement.getAttribute('aria-pressed'),'true');await audit('Mahjong');
 w.run(`S.gstate={...previewGame,type:'handfoot',state:{hands:{1:[{id:1,rank:'K',suit:'♥'},{id:2,rank:'K',suit:'♣'}],2:11},feet:{1:11,2:11},inFoot:{},melds:{1:[],2:[]},red3s:{1:[],2:[]},scores:{1:0,2:0},drawPile:80,discardPile:[{rank:'6',suit:'♥'}],discardCount:3,hasDrawn:true,chat:[]}};renderGame()`);
 let card=d.querySelector('[data-cid="1"]');assert.equal(card.getAttribute('aria-label'),'King of hearts');card.focus();card.click();assert.equal(d.activeElement.dataset.cid,'1');assert.equal(d.activeElement.getAttribute('aria-pressed'),'true');await audit('Hand and Foot');
 w.run('S.game=null;S.tab="settings";render()');await audit('Settings');
 w.run('S.game=null;S.tab="chat";render()');assert.equal(d.querySelector('#txt').getAttribute('aria-label'),'Message this room');assert.equal(d.querySelector('#send').getAttribute('aria-label'),'Send message');await audit('Chat');
 w.run('S.token=null;renderJoin()');assert(d.querySelector('#access-open'));await audit('Sign in');
 console.log('Functional accessibility PASS: keyboard tile placement and repositioning; arrow navigation; focus across polling; 225 intact cells; hidden Memory faces; checkers selection; named chat; mute and motion preferences; install-help focus return.');
 console.log(JSON.stringify(audits,null,2));assert(audits.every(x=>!x[1].length),'Resolve accessibility rule failures');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
