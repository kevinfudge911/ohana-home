const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/export\s*\{[\s\S]*?\};\s*$/,'');
const c=vm.createContext({console,structuredClone});vm.runInContext(fs.readFileSync('mahjong.js','utf8').replaceAll('export function','function')+'\n'+source,c);
(async()=>{
 for(const level of ['easy','medium','hard'])for(const seed of [11,77,123]){
  const players=[-1,2],st=c.hfInit(players,seed);st.bot={difficulty:level,moves:0};let turn=0;
  for(let n=0;n<180;n++){
   const move=await c.chooseBotMove('handfoot',st,players,turn,{});assert(move,JSON.stringify({level,seed,n,turn,inFoot:st.inFoot,hand:st.inFoot[players[turn]]?st.feet[players[turn]]:st.hands[players[turn]],draw:st.drawPile.length,drawn:st.hasDrawn}));const r=c.hfMove(st,players,turn,move);st.bot.moves++;if(r.over)break;turn=r.next;
  }
 }
 const st=c.hfInit([1,2],19);st.hasDrawn=true;st.hands[1]=[1,2,3].map(id=>({id,rank:'3',suit:'♠'}));assert.throws(()=>c.hfMove(st,[1,2],0,{action:'meld',rank:'3',cardIds:[1,2,3]}),/3s/);
 const secret=c.hfView(c.hfInit([1,2],19),1);assert.equal(typeof secret.hands[2],'number');assert.equal(typeof secret.feet[1],'number');
 console.log('PASS: three bot levels produce legal moves across nine games; black threes cannot meld; hidden hands and unopened feet remain hidden.');
})().catch(e=>{console.error(e);process.exitCode=1});
