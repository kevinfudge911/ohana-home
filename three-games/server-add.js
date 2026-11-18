
// ===== Ohana Nov 18: Chicken Foot real rules, bigger domino deals, Spades 2 people + 2 robots =====
function dominoDealSize(n){return n<=4?12:n<=6?11:9;}
function dominoInit(players,seed,mode){
 const key=dominoMode(mode);
 if(key==="chicken")return dominoChickenInit(players,seed);
 if(mode==="mexican"||key==="mexican"||key==="double15")return dominoInit0(players,seed,mode);
 const cfg=DOMINO_MODES[key],old=cfg.hand;cfg.hand=dominoDealSize(players.length);
 try{return dominoInit0(players,seed,mode);}finally{cfg.hand=old;}
}
function dominoPlayable(st,player){return st&&st.chicken?dominoChickenPlayable(st,player):dominoPlayable0(st,player);}
function dominoMove(st,players,turnIdx,move){return st&&st.chicken?dominoChickenMove(st,players,turnIdx,move):dominoMove0(st,players,turnIdx,move);}
function dominoChickenInit(players,seed){
 const deck=shuffle(dominoTiles(12),rng(seed));
 const at=deck.findIndex(t=>t.a===12&&t.b===12),engine=deck.splice(at,1)[0];
 const size=Math.max(5,Math.min(dominoDealSize(players.length),Math.floor((deck.length-6)/players.length)));
 const hands=Object.fromEntries(players.map(p=>[p,deck.splice(0,size).sort((a,b)=>dominoPips(b)-dominoPips(a))]));
 const trains={};for(let k=1;k<=6;k++)trains["leg"+k]={tiles:[],end:12,start:12,open:true,label:"Leg "+k,leg:true};
 return {mode:"chicken",chicken:1,modeLabel:"Chicken Foot",maxPip:12,trains,board:[{p:null,tile:engine,side:"start"}],ends:{left:12,right:12},hands,boneyard:deck,scores:Object.fromEntries(players.map(p=>[p,0])),round:1,nextTurn:0,drawn:false,pendingDouble:null,pendingFoot:null,feet:0,history:[{p:null,tile:engine,note:"12|12 engine starts six legs"}],lastPlay:{tile:engine,note:"engine"}};
}
function dominoChickenTargets(st){
 const ids=Object.keys(st.trains||{});
 const foot=(st.pendingFoot||[]).filter(id=>st.trains[id]&&!st.trains[id].tiles.length);
 if(foot.length)return foot;
 const legs=ids.filter(id=>st.trains[id].leg&&!st.trains[id].tiles.length);
 if(legs.length)return legs;
 return ids.filter(id=>st.trains[id].open!==false);
}
function dominoChickenPlayable(st,player){
 const targets=dominoChickenTargets(st);
 return (st.hands[player]||[]).flatMap(tile=>targets.filter(id=>{const e=st.trains[id].end;return tile.a===e||tile.b===e;}).map(id=>({tile,side:"train-"+id})));
}
function dominoChickenFinish(st,players,wentOut){
 const left={};for(const p of players){left[p]=(st.hands[p]||[]).reduce((n,t)=>n+(t.a===0&&t.b===0?50:dominoPips(t)),0);st.scores[p]=Number(st.scores[p]||0)+left[p];}
 let winner=wentOut;
 if(winner==null){const low=Math.min(...players.map(p=>left[p])),best=players.filter(p=>left[p]===low);winner=best.length===1?best[0]:"tie";}
 st.roundWinner=winner;st.chickenLeft=left;
 return {over:true,winner,next:winner==="tie"?0:players.indexOf(winner)};
}
function dominoChickenMove(st,players,turn,move){
 const p=players[turn],hand=st.hands[p]||(st.hands[p]=[]),legal=dominoChickenPlayable(st,p);
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
  st.drawn=false;st.lastPlay={p,note:"passed"};st.history.push({p,note:"passed"});
  if(!st.boneyard.length&&!players.some(who=>dominoChickenPlayable(st,who).length))return dominoChickenFinish(st,players,null);
  return {over:false,next:(turn+1)%players.length};
 }
 if(move.action!=="play")throw new Error("Choose a domino move.");
 const found=legal.find(x=>x.tile.id===Number(move.tileId)&&x.side===move.side);
 if(!found)throw new Error("That line is not a legal place right now.");
 const id=move.side.slice(6),line=st.trains[id],tile=found.tile;
 hand.splice(hand.findIndex(t=>t.id===tile.id),1);
 const oriented=tile.a===line.end?tile:{...tile,a:tile.b,b:tile.a};
 line.tiles.push({p,tile:oriented,side:move.side});line.end=oriented.b;st.drawn=false;
 let note="played "+tile.a+"|"+tile.b+" on "+(line.label||id);
 if(tile.a===tile.b){
  line.open=false;const f=(st.feet||0)+1,toes=[];st.feet=f;
  for(let k=1;k<=3;k++){const tid="f"+f+"t"+k;st.trains[tid]={tiles:[],end:tile.a,start:tile.a,open:true,label:"Foot "+f+" · Toe "+k,toe:true,from:id};toes.push(tid);}
  st.pendingFoot=toes;note+=" and grew a chicken foot";
 }else if(st.pendingFoot&&!st.pendingFoot.some(t=>st.trains[t]&&!st.trains[t].tiles.length))st.pendingFoot=null;
 st.lastPlay={p,tile,side:move.side};st.history.push({p,tile,side:move.side,note});
 if(!hand.length)return dominoChickenFinish(st,players,p);
 return {over:false,next:(turn+1)%players.length};
}
async function ohanaSpadesJoin2(db,env,me,g,players,id){
 if(g.status!=="waiting")throw new Error("This game already started.");
 const humans=players.filter(x=>Number(x)>0);
 if(humans.includes(me.id))return {ok:true,status:"waiting"};
 if(humans.length!==1)throw new Error("This game is full.");
 const seats=[humans[0],BOT_ID,me.id,-2];
 const st=initState("spades",seats,id*7919+now()%1e5,"classic");
 st.bot={id:BOT_ID,name:"Ohana Robot",avatar:"@hon",difficulty:"easy",memory:{},moves:0};
 const turn=Number.isInteger(st.nextTurn)?st.nextTurn:0;
 const joined=await db.prepare("UPDATE games SET players=?,max_players=4,status='playing',state=?,turn=?,updated_at=? WHERE id=? AND status='waiting' AND players=?").bind(JSON.stringify(seats),JSON.stringify(st),turn,now(),id,g.players).run();
 if(!joined.meta.changes)throw new Error("This table just changed. Please open it again.");
 await db.prepare("UPDATE game_invitations SET status='accepted' WHERE game_id=? AND member_id=?").bind(id,me.id).run();
 const first=seats[turn];
 if(gameBotPlayer("spades",first))env.ctx?.waitUntil?.(advanceBot(env,id).catch(e=>console.error("Computer move failed",e.message)));
 else if(first!==me.id)env.ctx?.waitUntil?.(notifyTurnIfAway(db,[first],{type:"turn",title:"Your turn!",body:"It's your turn in Spades",tag:`ohana-game-${id}`,from:me.id}).catch(()=>{}));
 return {ok:true,status:"playing"};
}
async function advanceBot(env,id){
 let before=null;try{before=await env.DB.prepare("SELECT type,mode,turn FROM games WHERE id=?").bind(id).first();}catch(e){}
 const out=await advanceBot0(env,id);
 if(before&&before.type==="spades"&&before.mode==="robots2"){
  try{const g=await env.DB.prepare("SELECT players,turn,status FROM games WHERE id=?").bind(id).first();const ps=JSON.parse(g.players),who=ps[g.turn];
   if(g.status==="playing"&&Number(who)>0&&g.turn!==before.turn)await notifyTurnIfAway(env.DB,[who],{type:"turn",title:"Your turn!",body:"It's your turn in Spades",tag:`ohana-game-${id}`});}catch(e){}
 }
 return out;
}
async function ohanaCreateReplay(db,env,me,g,players,names){
 if(!(g.type==="spades"&&g.mode==="robots2"))return ohanaCreateReplay0(db,env,me,g,players,names);
 if(g.status!=="finished"||!players.includes(me.id))throw Error("Finish this game before replaying.");
 await db.prepare("CREATE TABLE IF NOT EXISTS game_replays (original_game_id INTEGER PRIMARY KEY, new_game_id INTEGER NOT NULL DEFAULT 0)").run();
 const existing=await db.prepare("SELECT new_game_id FROM game_replays WHERE original_game_id=?").bind(g.id).first();
 if(existing?.new_game_id>0)return {id:existing.new_game_id,existing:true};
 if(existing?.new_game_id<0)throw Error("This replay is still being prepared. Check My games before trying again.");
 const friend=players.find(x=>Number(x)>0&&x!==me.id);
 if(!friend||!names[friend])throw Error("The original players are no longer all available for this game. Your finished game is unchanged.");
 await allowGame(db,me.id,"spades");await allowGame(db,friend,"spades");
 const ts=now(),inviteCode=rid(6);
 await db.prepare("INSERT OR IGNORE INTO game_replays(original_game_id,new_game_id) VALUES(?,0)").bind(g.id).run();
 const results=await db.batch([
  db.prepare("INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,mode,invite_code,room_id,state) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM game_replays WHERE original_game_id=? AND new_game_id=0)").bind("spades",JSON.stringify([me.id]),2,"waiting",0,me.id,ts,ts,"robots2",inviteCode,g.room_id,null,g.id),
  db.prepare("UPDATE game_replays SET new_game_id=(SELECT id FROM games WHERE invite_code=? AND created_by=? AND created_at=? AND room_id=? ORDER BY id DESC LIMIT 1) WHERE original_game_id=? AND new_game_id=0").bind(inviteCode,me.id,ts,g.room_id,g.id),
  db.prepare("INSERT OR IGNORE INTO game_invitations(game_id,member_id,sender_id,status,created_at) SELECT r.new_game_id,?,?,'pending',? FROM game_replays r JOIN games child ON child.id=r.new_game_id WHERE r.original_game_id=? AND r.new_game_id>0 AND child.invite_code=? AND child.created_by=? AND child.created_at=?").bind(friend,me.id,ts,g.id,inviteCode,me.id,ts)
 ]);
 const mapped=await db.prepare("SELECT new_game_id FROM game_replays WHERE original_game_id=?").bind(g.id).first();
 if(!(mapped?.new_game_id>0))throw Error("Could not confirm the replay. Check My games before trying again.");
 const created=!!results[0]?.meta?.changes;
 if(created)env.ctx?.waitUntil?.(notifyMembers(db,[friend],{type:"invite",title:me.name+" invited you to replay",body:"Join Spades in Ohana Home.",tag:"ohana-replay-"+mapped.new_game_id}).catch(()=>{}));
 return {id:mapped.new_game_id,existing:!created};
}
