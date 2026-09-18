const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(process.argv[2]||'recovered-meld'),modules={};
let code=fs.readFileSync(root+'/worker.js','utf8').replace(/^import (\w+) from "(\.\/[^"]+)";$/gm,(_,name,p)=>{const f=path.join(root,p);modules[name]=/\.(html|txt)$/.test(f)?fs.readFileSync(f,'utf8'):new Uint8Array(fs.readFileSync(f));return 'const '+name+'=modules.'+name+';';}).replace(/^import \{ (\w+) \} from "(node:[^"]+)";$/gm,(_,name,p)=>'const {'+name+'}=require('+JSON.stringify(p)+');').replace(/export \{\s*worker_default as default\s*\};/,'globalThis.worker=worker_default;');
const ctx=vm.createContext({modules,require,console,Request,Response,URL,Headers,crypto:globalThis.crypto,TextEncoder,TextDecoder,Uint8Array,ArrayBuffer,structuredClone,atob,btoa,setTimeout,clearTimeout,Buffer,process});vm.runInContext(code,ctx);
const html=fs.readFileSync(path.join(root,fs.readdirSync(root).find(x=>x.endsWith('app.html'))),'utf8');
const ui=vm.createContext({});vm.runInContext(html.slice(html.indexOf('function autoHandFootMelds('),html.indexOf('function hfCardShape(')),ui);
let id=1;const card=rank=>({id:id++,rank,suit:rank==='Joker'?'':'♣'});
function setup(ranks,top='4'){const st=ctx.hfInit([1,2],123);st.hands[1]=ranks.map(card);st.feet[1]=[card('9'),card('K')];st.drawPile=[card('5'),card('6'),card('7')];st.discardPile=[card('Q'),card(top)];st.hasDrawn=false;return st;}
function pick(st,ids){const top=st.discardPile.at(-1);const melds=ui.handFootPickupMelds(st.hands[1],ids,st.melds[1],top);return {action:'pickup',melds:JSON.parse(JSON.stringify(melds))};}
let passed=0;function test(name,fn){fn();passed++;fs.writeSync(1,'PASS '+name+'\n');}
function rejectsUnchanged(st,move,re){const before=JSON.stringify(st);assert.throws(()=>ctx.hfMove(st,[1,2],0,move),re);assert.equal(JSON.stringify(st),before);}
test('recorded selection: two fours, two aces, joker opens from pile without drawing',()=>{const s=setup(['4','4','A','A','Joker','K']);const result=ctx.hfMove(s,[1,2],0,pick(s,s.hands[1].slice(0,5).map(c=>c.id)));assert.equal(s.melds[1].length,2);assert.equal(s.melds[1].find(m=>m.rank==='A').cards.reduce((n,c)=>n+ctx.hfCardVal(c),0),90);assert.equal(s.discardPile.length,0);assert(s.hasDrawn);assert.equal(result.pickedUp,2);assert.equal(s.drawPile.length,3);});
test('exactly 50 own-hand points opens; top discard excluded',()=>{const s=setup(['10','10','J','J','J','K'],'10');ctx.hfMove(s,[1,2],0,pick(s,s.hands[1].slice(0,5).map(c=>c.id)));assert.equal(s.melds[1].length,2);});
test('top discard cannot lift 45 own-hand points above 50',()=>{const s=setup(['10','10','5','5','5','5','5','K'],'10');rejectsUnchanged(s,pick(s,s.hands[1].slice(0,7).map(c=>c.id)),/hand.*45/);});
test('unselected joker in hand cannot fund the opening',()=>{const s=setup(['A','A','Joker','K'],'A');rejectsUnchanged(s,pick(s,s.hands[1].slice(0,2).map(c=>c.id)),/hand.*40/);});
test('cards from deeper in discard pile cannot fund opening',()=>{const s=setup(['4','4','K']);rejectsUnchanged(s,{action:'pickup',melds:[{rank:'Q',cardIds:[s.discardPile[0].id]}]},/already in your hand/);});
test('invalid selected groups are atomic; nothing is removed',()=>{const s=setup(['4','4','A','Joker','K']);rejectsUnchanged(s,{action:'pickup',melds:[{rank:'A',cardIds:s.hands[1].slice(2,4).map(c=>c.id)}]},/at least three/);});
test('already-open player does not pay opening minimum again',()=>{const s=setup(['4','4','K']);s.melds[1]=[{rank:'A',cards:[card('A'),card('A'),card('A')]}];ctx.hfMove(s,[1,2],0,pick(s,[]));assert.equal(s.melds[1].length,2);});
test('pickup replaces draw and prevents a second draw',()=>{const s=setup(['4','4','A','A','Joker','K']);ctx.hfMove(s,[1,2],0,pick(s,s.hands[1].slice(0,5).map(c=>c.id)));rejectsUnchanged(s,{action:'draw'},/already drew/);});
test('pickup after drawing remains prohibited',()=>{const s=setup(['4','4','A','A','Joker','K']);s.hasDrawn=true;rejectsUnchanged(s,pick(s,s.hands[1].slice(0,5).map(c=>c.id)),/already drew/);});
test('later rounds use their own opening threshold',()=>{const s=setup(['4','4','A','A','Joker','K']);s.round=3;rejectsUnchanged(s,pick(s,s.hands[1].slice(0,5).map(c=>c.id)),/120.*100/);});
fs.writeSync(1,passed+' regression tests passed\n');
