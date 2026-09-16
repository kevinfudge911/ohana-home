const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/export\s*\{[\s\S]*?\};\s*$/,'');
const c=vm.createContext({console,structuredClone});vm.runInContext(fs.readFileSync('mahjong.js','utf8').replaceAll('export function','function')+'\n'+source,c);

let seq=1000;const card=(rank,suit='♣')=>({id:seq++,rank,suit});
const setup=()=>{const s=c.hfInit([1,2],123);s.hasDrawn=true;s.hands[1]=[];s.red3s[1]=[];return s};
assert.equal(c.hfMakeDeck(3).length,162);for(const r of ['8','9','10','J','Q','K'])assert.equal(c.hfCardVal(card(r)),10);
let s=setup();s.hands[1]=['8','8','8','9','9','9','4'].map(r=>card(r));let groups=['8','9'].map(rank=>({rank,cardIds:s.hands[1].filter(x=>x.rank===rank).map(x=>x.id)}));c.hfMove(s,[1,2],0,{action:'melds',melds:groups});assert.equal(s.melds[1].length,2);assert.equal(s.hands[1].length,1);
s=setup();s.hands[1]=['J','J','Q','Q','Q','4'].map(r=>card(r));const before=JSON.stringify(s);assert.throws(()=>c.hfMove(s,[1,2],0,{action:'melds',melds:['J','Q'].map(rank=>({rank,cardIds:s.hands[1].filter(x=>x.rank===rank).map(x=>x.id)}))}),/three/);assert.equal(JSON.stringify(s),before);
s=setup();s.hands[1]=['A','A','A'].map(r=>card(r));s.feet[1]=[card('3','♥'),card('8')];s.drawPile=[card('9'),card('10')];let result=c.hfMove(s,[1,2],0,{action:'meld',rank:'A',cardIds:s.hands[1].map(x=>x.id)});assert(s.inFoot[1]);assert.equal(result.next,0);assert(s.hasDrawn);assert.equal(s.feet[1].length,2);assert.equal(s.red3s[1].length,1);
s=setup();s.hands[1]=[card('4')];result=c.hfMove(s,[1,2],0,{action:'discard',cardId:s.hands[1][0].id});assert(s.inFoot[1]);assert.equal(result.next,1);assert.equal(s.hasDrawn,false);assert(Array.isArray(c.hfView(s,1).feet[1]));assert.equal(typeof c.hfView(s,2).feet[1],'number');
s=setup();s.hasDrawn=false;s.hands[1]=['A','A','4'].map(r=>card(r));s.discardPile=Array.from({length:10},()=>card('A'));result=c.hfMove(s,[1,2],0,{action:'pickup'});assert.equal(result.pickedUp,7);assert.equal(s.discardPile.length,3);assert.equal(s.melds[1][0].cards.length,3);
s=setup();s.hasDrawn=false;s.drawPile=[];const chat=[{text:'hello'}];s.chat=chat;result=c.hfMove(s,[1,2],0,{action:'draw'});assert.equal(s.round,2);assert.equal(c.hfOpening(s,1),90);assert.equal(s.roundScores.length,1);assert.equal(s.chat[0].text,'hello');assert.equal(result.over,false);s.round=4;s.drawPile=[];s.hasDrawn=false;assert(c.hfMove(s,[1,2],0,{action:'draw'}).over);
console.log('PASS: multi-meld opening, short-group rejection and atomic rollback, 8/9 values, foot pickup timing and replacement, hidden foot, immediate pickup meld and seven-card cap, four rounds and chat preservation.');
