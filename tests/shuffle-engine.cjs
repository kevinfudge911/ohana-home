const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{webcrypto}=require('node:crypto');
const c=vm.createContext({structuredClone,crypto:webcrypto});
vm.runInContext(fs.readFileSync('live/shuffle-engine.js','utf8').replace(/export /g,'')+'\nglobalThis.rules={shuffleInit,shuffleMove,shuffleView,standardDeck,isCardMeld,bestCardHand,ginDefense};',c);
const {shuffleInit:init,shuffleMove:act,shuffleView:view,standardDeck:deck,isCardMeld:meld,bestCardHand:best,ginDefense:defend}=c.rules;
let seed=123;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),players=[101,202];
const move=(st,turn,m)=>act(st,players,turn,{...m,revision:st.revision},random);
function invalid(st,turn,m,re){const before=JSON.stringify(st);assert.throws(()=>move(st,turn,m),re);assert.equal(JSON.stringify(st),before,'rejection is atomic');}
function fixture(mode,h1,h2,extra={}){const st=init(players,random,mode);return Object.assign(st,{hands:{101:h1,202:h2},phase:'play',stock:['S13','S12','S11'],discard:['D13'],melds:[],everPlayed:{101:true},rummyEligible:false,drawnDiscard:null},extra);}
function conservation(st){const cards=[...st.stock,...st.discard,...Object.values(st.hands).flat(),...st.melds.flatMap(m=>m.cards)];assert.equal(cards.length,52);assert.equal(new Set(cards).size,52);}
assert.equal(deck().length,52);assert.equal(new Set(deck()).size,52);
for(let n=2;n<=6;n++){const ps=Array.from({length:n},(_,i)=>i+10),st=init(ps,random,'rummy');assert.equal(st.hands[10].length,n===2?10:n<=4?7:6);conservation(st);}
for(const ps of [[1],[1,2,3],[1,1],[1,-1]])assert.throws(()=>init(ps,random,'gin'));
assert.throws(()=>init(players,random,'canasta'));assert.throws(()=>init([1,2,3,4,5,6,7],random,'rummy'));
for(const cards of [['H1','H2','H3'],['C7','D7','H7','S7'],['S9','S10','S11','S12','S13']])assert(meld(cards));
for(const cards of [['H12','H13','H1'],['H1','D2','H3'],['H7','H7','S7'],['H1','H2'],['X1','X2','X3']])assert(!meld(cards));
let st=init(players,random,'rummy'),t=st.nextTurn;
invalid(st,t,{action:'meld',cards:st.hands[players[t]].slice(0,3)},/Draw/);
invalid(st,t,{action:'draw',source:'bottom'},/Choose/);
move(st,t,{action:'draw',source:'discard'});conservation(st);
invalid(st,t,{action:'draw',source:'stock'},/already/);
invalid(st,t,{action:'discard',card:st.drawnDiscard},/different/);
invalid(st,t,{action:'meld',cards:[st.hands[players[t]][0],st.hands[players[t]][0],st.hands[players[t]][0]]},/once/);
invalid(st,t,{action:'discard',card:'H99'},/own/);
const revision=st.revision;assert.throws(()=>act(st,players,t,{action:'discard',card:st.hands[players[t]][0],revision:revision-1}),/changed/);
// Only the owner sees the private hand. Neither owner nor spectators see stock identities.
st.lastPlay={p:players[t],at:7};const owner=view(st,players[t]),watch=view(st,999),other=view(st,players[1-t]);
assert(Array.isArray(owner.hands[players[t]]));assert.equal(typeof watch.hands[101],'number');assert.equal(typeof other.hands[players[t]],'number');assert.equal(typeof owner.stock,'number');assert(!('everPlayed' in owner));assert.equal(watch.drawnDiscard,null);assert(!('seed' in owner));
// Going out by meld, or by discard, scores remaining cards; first melding turn doubles.
st=fixture('rummy',['H1','H2','H3'],['C13','D8'],{rummyEligible:true});let res=move(st,0,{action:'meld',cards:['H3','H1','H2']});assert.equal(st.result.score,36);assert.equal(st.result.kind,'rummy');assert.equal(st.phase,'round-end');assert(!res.over);
move(st,0,{action:'next'});assert.equal(st.round,2);assert.equal(st.scores[101],36);assert.equal(st.hands[101].length,10);conservation(st);assert(!('result' in st));
st=fixture('rummy',['H5'],['C13'],{scores:{101:95,202:0}});res=move(st,0,{action:'discard',card:'H5'});assert(res.over);assert.equal(res.winner,101);assert.equal(st.scores[101],105);
st=fixture('rummy',['H4','H5','D9'],['C13'],{melds:[{owner:202,cards:['H1','H2','H3']}]});move(st,0,{action:'layoff',cards:['H5','H4'],target:0});assert.equal(st.melds[0].cards.length,5);invalid(st,0,{action:'layoff',cards:['D9'],target:0},/extend/);invalid(st,0,{action:'layoff',cards:['D9'],target:0.5},/extend/);
// Recycle the whole discard in order, without shuffling.
st=fixture('rummy',['H5'],['C13'],{phase:'draw',stock:[],discard:['C1','D2','S3']});move(st,0,{action:'draw',source:'stock'});assert.equal(st.hands[101].at(-1),'C1');assert.equal(st.stock[0],'S3');assert.equal(st.discard.length,0);
// Gin's opening offer alternates; after both passes the nondealer must use stock.
st=init(players,random,'gin');t=st.nextTurn;invalid(st,t,{action:'draw',source:'stock'},/opening/);res=move(st,t,{action:'pass'});res=move(st,res.next,{action:'pass'});assert.equal(res.next,t);assert(st.forceStock);invalid(st,t,{action:'draw',source:'discard'},/passed/);move(st,t,{action:'draw',source:'stock'});conservation(st);invalid(st,t,{action:'meld',cards:st.hands[players[t]].slice(0,3)},/private/);
// An overlapping set/run must not use one card twice.
assert.equal(best(['C7','D7','H7','H8','H9']).points,14);
assert.equal(best(['H1','H2','H3','H4','H5','S1','S2','S3','S4','S5']).points,0,'two five-card runs are Gin');
const gin=['H1','H2','H3','D5','C5','S5','S9','S10','S11','S12'];
st=fixture('gin',[...gin,'D13'],['C1','C2','C3','H5','H9','H10','H11','D2','D3','D4']);res=move(st,0,{action:'knock',card:'D13'});assert.equal(st.result.kind,'gin');assert.equal(st.result.defense.points,5,'no layoff of H5 onto the fives against Gin');assert.equal(st.result.score,25);
// Chained layoffs find both lower and upper run extensions.
const defense=defend(['H2','H3','H7','H8','C13'],[['H4','H5','H6']]);assert.equal(defense.points,10);assert.equal(defense.laid.length,4);
st=fixture('gin',['H1','H2','H3','C5','D5','S5','C9','D9','S9','D2','S13'],['S1','S2','S3','H5','C1','C2','C3','D3','D4','D6']);move(st,0,{action:'knock',card:'S13'});assert.equal(st.result.knockerHand.points,2);assert.equal(st.result.defense.points,13);assert.equal(st.result.score,11);assert.equal(st.result.kind,'knock');
st=fixture('gin',['H1','H2','H3','C5','D5','S5','C9','D9','S9','D2','S13'],[...gin]);move(st,0,{action:'knock',card:'S13'});assert.equal(st.result.kind,'undercut');assert.equal(st.result.winner,202);assert.equal(st.result.score,12);
st=fixture('gin',['H1','D2','S3','C4','H5','D6','S7','C8','H9','D10','S13'],gin);invalid(st,0,{action:'knock',card:'S13'},/10 or fewer/);invalid(st,0,{action:'knock',card:'S13',groups:[['H1','D2','S3']]},/valid Gin/);
st=fixture('gin',[...gin,'S13'],gin);invalid(st,0,{action:'knock',card:'S13',groups:[['H1','H2','H3'],['H1','H2','H3']]},/disjoint/);
st=fixture('gin',[...gin,'S13'],gin,{stock:['D12','D11']});move(st,0,{action:'discard',card:'S13'});assert.equal(st.result.winner,null);assert.equal(st.result.score,0);const dealer=st.dealer;move(st,st.nextTurn,{action:'next'});assert.equal(st.dealer,dealer);conservation(st);
// Exercise actual dealt hands and turn transitions, including stock exhaustion, with fictional seats.
for(const mode of ['rummy','gin'])for(let game=0;game<30;game++){
 st=init(players,random,mode);t=st.nextTurn;
 for(let i=0;i<180;i++){
  let m;if(st.phase==='round-end')m={action:'next'};else if(st.phase==='opening')m={action:'pass'};else if(st.phase==='draw')m={action:'draw',source:'stock'};else {const h=st.hands[players[t]],groups=best(h).melds;if(mode==='rummy'&&groups.length)m={action:'meld',cards:groups[0]};else{const card=h.find(c=>c!==st.drawnDiscard),remaining=h.filter(c=>c!==card);m={action:mode==='gin'&&best(remaining).points<=10?'knock':'discard',card};}}
  res=move(st,t,m);t=res.next;conservation(st);if(res.over)break;
 }
}
console.log('PASS shared-card engine: deal/player limits, unique cards, atomic rejection, revision leases, concealment, melds/layoffs, Rummy scoring, Gin opening/knock/Gin/undercut/stock, round continuation and 60 fictional simulations.');
