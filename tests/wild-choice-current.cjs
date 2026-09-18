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

test('two selected jokers can be assigned to different existing ranks',()=>{const a=card('Joker'),b=card('Joker');const ms=['J','Q'].map(rank=>({rank,cards:[card(rank),card(rank),card(rank)]}));const gs=ui.autoHandFootMelds([a,b],ms,null,{[a.id]:'J',[b.id]:'Q'});assert.equal(gs[0].rank,'J');assert.equal(gs[0].cardIds[0],a.id);assert.equal(gs[1].rank,'Q');});
test('wild cannot be assigned to a pile without enough naturals',()=>{const w=card('Joker');assert.throws(()=>ui.autoHandFootMelds([w],[],null,{[w.id]:'J'}),/legal melds/);});
test('one last-foot joker can finish a six-card pile',()=>{const s=setup([]);s.inFoot[1]=true;s.hasDrawn=true;s.feet[1]=[card('Joker'),card('Joker')];s.melds[1]=[{rank:'K',cards:Array.from({length:7},()=>card('K'))},{rank:'J',cards:Array.from({length:6},()=>card('J'))}];const groups=ui.autoHandFootMelds([s.feet[1][0]],s.melds[1],null,{[s.feet[1][0].id]:'J'});ctx.hfMove(s,[1,2],0,{action:'melds',melds:groups});assert.equal(s.feet[1].length,1);assert.equal(s.melds[1][1].cards.length,7);});
const wild={id:900,wild:true,n:0,color:'star'};
test('Ohana 10 respects wild number on sets',()=>{const w=ctx.o10AssignCards([wild],{900:{n:7,color:'coral'}})[0];assert(ctx.o10CanHit(w,{kind:'set',cards:[{n:7,color:'ocean'}]}));assert(!ctx.o10CanHit(w,{kind:'set',cards:[{n:8,color:'ocean'}]}));assert.equal(ctx.o10CardScore(w),25);assert.equal(w.wild,true);});
test('Ohana 10 honors number and color in runs',()=>{const cards=[{id:1,n:1,color:'ocean'},{id:2,n:2,color:'ocean'},{id:3,n:3,color:'ocean'},wild];const good=ctx.o10AssignCards(cards,{900:{n:4,color:'ocean'}}),wrong=ctx.o10AssignCards(cards,{900:{n:4,color:'coral'}});assert(ctx.o10PartValid(good,['colorRun',4]));assert(!ctx.o10PartValid(wrong,['colorRun',4]));});
test('wild assignments reject invalid values and natural-card spoofing',()=>{assert.throws(()=>ctx.o10AssignCards([wild],{900:{n:13,color:'coral'}}));assert.throws(()=>ctx.o10AssignCards([{id:900,n:7,color:'leaf'}],{900:{n:4,color:'coral'}}));});
test('assignments do not mutate original cards on failed play',()=>{const before=JSON.stringify(wild);ctx.o10AssignCards([wild],{900:{n:4,color:'coral'}});assert.equal(JSON.stringify(wild),before);});
fs.writeSync(1,passed+' wild-choice tests passed\n');
