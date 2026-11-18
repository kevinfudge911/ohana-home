const fs=require('fs');
const pre=`
function rng(s){let x=s>>>0||1;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
function shuffle(a,r){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function dominoTiles(m){const o=[];let id=1;for(let a=0;a<=m;a++)for(let b=a;b<=m;b++)o.push({id:id++,a,b});return o;}
function dominoPips(t){return t.a+t.b;}
const DOMINO_MODES={mexican:{}};
function dominoInit1(){return {old:1};}function dominoPlayable1(){return [];}function dominoMove1(){return {old:1};}
`;
const code=pre+fs.readFileSync('server-add.js','utf8')+';return {dominoInit,dominoPlayable,dominoMove};';
const M=new Function(code)();
function bot(st,p){const pl=M.dominoPlayable(st,p);if(pl.length){const c=pl[Math.floor(Math.random()*pl.length)];return {action:'play',tileId:c.tile.id,side:c.side};}
 if(st.boneyard.length&&!st.drawn)return {action:'draw'};return {action:'pass'};}
let games=0;
for(const n of [2,3,4,5,6,7,8]) for(const mode of ['mexican','mexican1']) for(let s=1;s<=15;s++){
 const players=Array.from({length:n},(_,i)=>i+5);
 const st=M.dominoInit(players,s*31,mode);let turn=st.nextTurn,moves=0,rounds=new Set([st.round]),r;
 while(true){
  // conservation
  const count=Object.values(st.hands).reduce((a,h)=>a+h.length,0)+st.boneyard.length+1+Object.values(st.trains).reduce((a,t)=>a+t.tiles.length,0);
  if(count!==91)throw Error('count '+count);
  if(st.pendingDouble){const t=st.trains[st.pendingDouble];const last=t.tiles[t.tiles.length-1].tile;if(last.a!==last.b)throw Error('pd');}
  r=M.dominoMove(st,players,turn,bot(st,players[turn]));moves++;
  rounds.add(st.round);
  if(r.over)break;turn=r.next;if(moves>20000)throw Error('loop');
 }
 const exp=mode==='mexican'?13:1;if(rounds.size!==exp)throw Error('rounds '+rounds.size);
 if(st.roundLog.length!==exp)throw Error('log');
 games++;
}
console.log('ok games',games);
// rule checks
const P=[5,6];const st=M.dominoInit(P,7,'mexican');
console.log('engine',st.engine,'hand',st.hands[5].length,'turn',st.nextTurn,'trains',Object.keys(st.trains).join(','),Object.values(st.trains).map(t=>t.open).join(','));
// cannot play on closed other train
st.hands[5]=[{id:900,a:12,b:3}];st.hands[6]=[{id:901,a:12,b:12},{id:902,a:12,b:4},{id:903,a:1,b:2}];
console.log(M.dominoPlayable(st,5).map(x=>x.side).join(' '));
let r=M.dominoMove(st,P,1,{action:'play',tileId:901,side:'train-6'});console.log('double keeps turn',r.next===1,'pending',st.pendingDouble);
console.log('only double target',M.dominoPlayable(st,6).map(x=>x.side).join(' '));
// 4-player deal 15
console.log('deal4',M.dominoInit([1,2,3,4],3,'mexican').hands[1].length,'deal6',M.dominoInit([1,2,3,4,5,6],3,'mexican').hands[1].length,'deal8',M.dominoInit([1,2,3,4,5,6,7,8],3,'mexican').hands[1].length);
console.log(M.dominoInit([1,2],1,'draw'));
