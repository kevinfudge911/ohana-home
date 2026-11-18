
// ===== Ohana Nov 18: Mexican Train real rules (mx:2) =====
DOMINO_MODES.mexican1={label:"Quick Mexican Train",maxPip:12,hand:15};
function dominoMxDeal(n){return n<=4?15:n<=6?12:10;}
function dominoMxPips(t){return t.a===0&&t.b===0?50:dominoPips(t);}
function dominoMxRound(players,seed,round,rounds,keep){
 const pip=12-(round-1),deck=shuffle(dominoTiles(12),rng(seed+round*7919));
 const at=deck.findIndex(t=>t.a===pip&&t.b===pip),engine=deck.splice(at,1)[0];
 const size=Math.min(dominoMxDeal(players.length),Math.floor((deck.length-8)/players.length));
 const hands=Object.fromEntries(players.map(p=>[p,deck.splice(0,size).sort((a,b)=>dominoPips(b)-dominoPips(a))]));
 const trains={};for(const p of players)trains[String(p)]={tiles:[],end:pip,start:pip,open:false};trains.mexican={tiles:[],end:pip,start:pip,open:true};
 const first=(round-1)%players.length;
 const st={mode:"mexican",mx:2,modeLabel:rounds>1?"Mexican Train":"Quick Mexican Train",maxPip:12,seed,round,rounds,engine:pip,trains,board:[{p:null,tile:engine,side:"start"}],ends:{left:pip,right:pip},hands,boneyard:deck,
  scores:keep?.scores||Object.fromEntries(players.map(p=>[p,0])),nextTurn:first,drawn:false,pendingDouble:null,
  history:(keep?.history||[]).slice(-150),lastRound:keep?.lastRound||null,roundLog:keep?.roundLog||[],
  lastPlay:{tile:engine,note:rounds>1?"Round "+round+" of "+rounds+" · "+pip+"|"+pip+" engine":pip+"|"+pip+" engine"}};
 st.history.push({p:null,tile:engine,note:"Round "+round+" starts with the "+pip+"|"+pip+" engine"});
 return st;
}
function dominoMxInit(players,seed,rounds){return dominoMxRound(players,Number(seed)||1,1,rounds,null);}
function dominoMxTargets(st,player){
 if(st.pendingDouble&&st.trains[st.pendingDouble])return [st.pendingDouble];
 return Object.keys(st.trains).filter(id=>id===String(player)||id==="mexican"||st.trains[id].open);
}
function dominoMxPlayable(st,player){
 const targets=dominoMxTargets(st,player);
 return (st.hands[player]||[]).flatMap(tile=>targets.filter(id=>{const e=st.trains[id].end;return tile.a===e||tile.b===e;}).map(id=>({tile,side:"train-"+id})));
}
function dominoMxEndRound(st,players,wentOut){
 const left={};for(const p of players){left[p]=(st.hands[p]||[]).reduce((n,t)=>n+dominoMxPips(t),0);st.scores[p]=Number(st.scores[p]||0)+left[p];}
 const summary={round:st.round,engine:st.engine,wentOut:wentOut??null,left};
 st.lastRound=summary;st.roundLog=[...(st.roundLog||[]),summary];
 st.history.push({p:wentOut??null,note:wentOut!=null?"went out and won round "+st.round:"round "+st.round+" blocked"});
 if(st.round<st.rounds){
  const next=dominoMxRound(players,st.seed,st.round+1,st.rounds,st);
  next.lastPlay={p:wentOut??null,tile:next.board[0].tile,note:(wentOut!=null?"went out · ":"Blocked · ")+"Round "+next.round+" of "+next.rounds+" starts with "+next.engine+"|"+next.engine};
  for(const k of Object.keys(st))delete st[k];Object.assign(st,next);
  return {over:false,next:st.nextTurn};
 }
 const low=Math.min(...players.map(p=>st.scores[p])),best=players.filter(p=>st.scores[p]===low),winner=best.length===1?best[0]:"tie";
 st.roundWinner=winner;st.gameOver=true;
 return {over:true,winner,next:winner==="tie"?0:players.indexOf(winner)};
}
function dominoMxMove(st,players,turn,move){
 if(st.gameOver)throw new Error("This game is finished.");
 const p=players[turn],hand=st.hands[p]||(st.hands[p]=[]),legal=dominoMxPlayable(st,p);
 if(move.action==="draw"){
  if(legal.length)throw new Error("Play a matching tile.");
  if(st.drawn)throw new Error("One draw per turn; play or pass.");
  if(!st.boneyard.length)throw new Error("No tiles left.");
  const tile=st.boneyard.shift();hand.push(tile);st.drawn=true;st.lastPlay={p,tile,note:"drew a tile"};st.history.push({p,note:"drew from the boneyard"});
  return {over:false,next:turn};
 }
 if(move.action==="pass"){
  if(legal.length)throw new Error("Play a matching tile.");
  if(st.boneyard.length&&!st.drawn)throw new Error("Draw once before passing.");
  st.trains[String(p)].open=true;st.drawn=false;
  const note=st.pendingDouble?"could not cover the double · train open":"passed · train open";
  st.lastPlay={p,note};st.history.push({p,note});
  if(!st.boneyard.length&&!players.some(who=>dominoMxPlayable(st,who).length))return dominoMxEndRound(st,players,null);
  return {over:false,next:(turn+1)%players.length};
 }
 if(move.action!=="play")throw new Error("Choose a domino move.");
 const found=legal.find(x=>x.tile.id===Number(move.tileId)&&x.side===move.side);
 if(!found)throw new Error(st.pendingDouble?"Cover the double first.":"That train is not open to you.");
 const id=move.side.slice(6),train=st.trains[id],tile=found.tile;
 hand.splice(hand.findIndex(t=>t.id===tile.id),1);
 const oriented=tile.a===train.end?tile:{...tile,a:tile.b,b:tile.a};
 train.tiles.push({p,tile:oriented,side:move.side});train.end=oriented.b;st.drawn=false;
 if(id===String(p))train.open=false;
 const isDouble=tile.a===tile.b;st.pendingDouble=isDouble?id:null;
 const where=id==="mexican"?"the Mexican train":id===String(p)?"their own train":"an open train";
 const note="played "+tile.a+"|"+tile.b+" on "+where+(isDouble?" · double, cover it":"");
 st.lastPlay={p,tile,side:move.side,note};st.history.push({p,tile,side:move.side,note});
 if(st.history.length>220)st.history=st.history.slice(-200);
 if(!hand.length)return dominoMxEndRound(st,players,p);
 return {over:false,next:isDouble?turn:(turn+1)%players.length};
}
function dominoInit(players,seed,mode){
 if(mode==="mexican"||mode==="mexican1")return dominoMxInit(players,seed,mode==="mexican1"?1:13);
 return dominoInit1(players,seed,mode);
}
function dominoPlayable(st,player){return st&&st.mx?dominoMxPlayable(st,player):dominoPlayable1(st,player);}
function dominoMove(st,players,turnIdx,move){return st&&st.mx?dominoMxMove(st,players,turnIdx,move):dominoMove1(st,players,turnIdx,move);}
