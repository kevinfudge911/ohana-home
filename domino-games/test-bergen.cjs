const fs=require('fs');
const pre=fs.readFileSync('test.cjs','utf8').split('`;')[0].split('const pre=`')[1];
const M=new Function(pre+fs.readFileSync('all.js','utf8')+';return {dominoInit,dominoPlayable,dominoMove};')();
let games=0,hands=0,trip=0,dbl=0;
for(const n of [2,3,4]) for(let s=1;s<=60;s++){
 const P=Array.from({length:n},(_,i)=>i+5);const st=M.dominoInit(P,s*17,'bergen');let turn=st.nextTurn,moves=0,r;
 while(true){
  const count=Object.values(st.hands).reduce((a,h)=>a+h.length,0)+st.boneyard.length+st.board.length;if(count!==28)throw Error('count '+count);
  const pl=M.dominoPlayable(st,P[turn]);let mv;
  if(pl.length){const c=pl[Math.floor(Math.random()*pl.length)];mv={action:'play',tileId:c.tile.id,side:c.side};}else if(st.boneyard.length)mv={action:'draw'};else mv={action:'pass'};
  const before=st.round;r=M.dominoMove(st,P,turn,mv);moves++;if(st.round!==before)hands++;
  if(st.lastPlay.note&&/triple/.test(st.lastPlay.note))trip++;if(st.lastPlay.note&&/double header/.test(st.lastPlay.note))dbl++;
  if(r.over)break;turn=r.next;if(moves>50000)throw Error('loop');
 }
 if(Math.max(...P.map(p=>st.scores[p]))<15)throw Error('target');games++;
}
console.log('bergen ok',games,'hands',hands,'triple',trip,'double',dbl);
// mexican still works & others delegate
console.log(M.dominoInit([1,2],3,'mexican').mx, M.dominoInit([1,2],3,'draw').old);
