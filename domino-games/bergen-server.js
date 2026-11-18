
// ===== Ohana Nov 18: Bergen (double-six, ends that match score, first to 15) =====
DOMINO_MODES.bergen={label:"Bergen",maxPip:6,hand:6};
function dominoBgHand(players,seed,hand,keep){
 const deck=shuffle(dominoTiles(6),rng(seed+hand*104729));
 const size=Math.min(6,Math.floor((deck.length-4)/players.length));
 const hands=Object.fromEntries(players.map(p=>[p,deck.splice(0,size).sort((a,b)=>dominoPips(b)-dominoPips(a))]));
 let sp=null,si=-1,best=null;
 for(const p of players)hands[p].forEach((t,i)=>{const d=t.a===t.b,bd=best&&best.a===best.b;
  if(!best||(d&&!bd)||(d&&bd&&t.a<best.a)||(!d&&!bd&&dominoPips(t)<dominoPips(best))){best=t;sp=p;si=i;}});
 hands[sp].splice(si,1);
 const scores=keep?.scores||Object.fromEntries(players.map(p=>[p,0]));
 const gained=best.a===best.b?2:0;scores[sp]=Number(scores[sp]||0)+gained;
 const note=(hand>1?"Hand "+hand+" · ":"")+"led "+best.a+"|"+best.b+(gained?" · double header +2":"");
 const st={mode:"bergen",bergen:1,modeLabel:"Bergen",maxPip:6,seed,round:hand,target:15,board:[{p:sp,tile:best,side:"start"}],ends:{left:best.a,right:best.b},hands,boneyard:deck,scores,
  startedBy:sp,nextTurn:(players.indexOf(sp)+1)%players.length,lastHand:keep?.lastHand||null,
  lastPlay:{p:sp,tile:best,note,score:gained},history:[...(keep?.history||[]).slice(-150),{p:sp,tile:best,score:gained,note}]};
 return st;
}
function dominoBgInit(players,seed){return dominoBgHand(players,Number(seed)||1,1,null);}
function dominoBgPlayable(st,player){
 const hand=st.hands[player]||[];
 return hand.flatMap(tile=>{const s=[];if(tile.a===st.ends.left||tile.b===st.ends.left)s.push({tile,side:"left"});if(st.ends.right!==st.ends.left&&(tile.a===st.ends.right||tile.b===st.ends.right))s.push({tile,side:"right"});else if(st.ends.right===st.ends.left&&(tile.a===st.ends.right||tile.b===st.ends.right))s.push({tile,side:"right"});return s;});
}
function dominoBgEndHand(st,players,wentOut){
 let winner=wentOut;
 if(winner==null){const pips=Object.fromEntries(players.map(p=>[p,(st.hands[p]||[]).reduce((n,t)=>n+dominoPips(t),0)]));const low=Math.min(...players.map(p=>pips[p])),best=players.filter(p=>pips[p]===low);winner=best.length===1?best[0]:null;}
 if(winner!=null)st.scores[winner]=Number(st.scores[winner]||0)+1;
 st.lastHand={hand:st.round,winner,wentOut:wentOut!=null};
 st.history.push({p:winner,note:winner==null?"hand "+st.round+" blocked, tied":(wentOut!=null?"went out":"won the blocked hand")+" · +1"});
 const top=Math.max(...players.map(p=>Number(st.scores[p]||0)));
 if(top>=Number(st.target||15)){
  const lead=players.filter(p=>Number(st.scores[p]||0)===top),w=lead.length===1?lead[0]:"tie";
  st.roundWinner=w;st.gameOver=true;return {over:true,winner:w,next:w==="tie"?0:players.indexOf(w)};
 }
 const next=dominoBgHand(players,st.seed,st.round+1,st);
 next.lastPlay={...next.lastPlay,note:(winner==null?"Blocked hand · ":"")+next.lastPlay.note};
 for(const k of Object.keys(st))delete st[k];Object.assign(st,next);
 return {over:false,next:st.nextTurn};
}
function dominoBgMove(st,players,turn,move){
 if(st.gameOver)throw new Error("This game is finished.");
 const p=players[turn],hand=st.hands[p]||(st.hands[p]=[]),legal=dominoBgPlayable(st,p);
 if(move.action==="draw"){
  if(legal.length)throw new Error("You have a playable tile.");
  if(!st.boneyard.length)throw new Error("No tiles left to draw.");
  const tile=st.boneyard.shift();hand.push(tile);hand.sort((a,b)=>dominoPips(b)-dominoPips(a));
  st.lastPlay={p,tile,note:"drew a tile"};st.history.push({p,note:"drew from the boneyard"});return {over:false,next:turn};
 }
 if(move.action==="pass"){
  if(legal.length)throw new Error("You have a playable tile.");
  if(st.boneyard.length)throw new Error("Draw before passing.");
  st.lastPlay={p,note:"passed"};st.history.push({p,note:"passed"});
  if(!players.some(who=>dominoBgPlayable(st,who).length))return dominoBgEndHand(st,players,null);
  return {over:false,next:(turn+1)%players.length};
 }
 if(move.action!=="play")throw new Error("Choose a domino move.");
 const side=move.side==="left"?"left":"right",found=legal.find(x=>x.tile.id===Number(move.tileId)&&x.side===side);
 if(!found)throw new Error("That tile does not match the open end.");
 const tile=found.tile,end=st.ends[side];hand.splice(hand.findIndex(t=>t.id===tile.id),1);
 const open=tile.a===end?tile.b:tile.a;
 if(side==="left"){st.ends.left=open;st.board.unshift({p,tile,side});}else{st.ends.right=open;st.board.push({p,tile,side});}
 let gained=0,kind="";
 if(st.ends.left===st.ends.right){
  const L=st.board[0].tile,R=st.board[st.board.length-1].tile;
  if((L.a===L.b&&L.a===st.ends.left)||(R.a===R.b&&R.a===st.ends.right)){gained=3;kind="triple header";}else{gained=2;kind="double header";}
  st.scores[p]=Number(st.scores[p]||0)+gained;
 }
 const note="played "+tile.a+"|"+tile.b+" "+side+(gained?" · "+kind+" +"+gained:"");
 st.lastPlay={p,tile,side,score:gained,note};st.history.push({p,tile,side,score:gained,note});
 if(st.history.length>220)st.history=st.history.slice(-200);
 const top=Math.max(...players.map(x=>Number(st.scores[x]||0)));
 if(top>=Number(st.target||15)){const lead=players.filter(x=>Number(st.scores[x]||0)===top),w=lead.length===1?lead[0]:"tie";st.roundWinner=w;st.gameOver=true;return {over:true,winner:w,next:w==="tie"?0:players.indexOf(w)};}
 if(!hand.length)return dominoBgEndHand(st,players,p);
 return {over:false,next:(turn+1)%players.length};
}
function dominoInit(players,seed,mode){return mode==="bergen"?dominoBgInit(players,seed):dominoInit2(players,seed,mode);}
function dominoPlayable(st,player){return st&&st.bergen?dominoBgPlayable(st,player):dominoPlayable2(st,player);}
function dominoMove(st,players,turnIdx,move){return st&&st.bergen?dominoBgMove(st,players,turnIdx,move):dominoMove2(st,players,turnIdx,move);}
