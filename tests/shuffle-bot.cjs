const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{webcrypto}=require('crypto');
const engine=fs.readFileSync('live/shuffle-engine.js','utf8').replace(/export /g,'');
const ctx=vm.createContext({crypto:webcrypto,structuredClone,console});vm.runInContext(engine+'\nthis.R={shuffleInit,shuffleMove,shuffleView,chooseShuffleBotMove,standardDeck};',ctx);const R=ctx.R;
const copy=x=>JSON.parse(JSON.stringify(x));let assertions=0,actions=0;
const check=(ok,message)=>{assert(ok,message);assertions++;};
const visible=(st,p)=>({...R.shuffleView(st,p),drawnDiscard:st.drawnDiscard});
function conserved(st){const cards=[...st.stock,...st.discard,...Object.values(st.hands).flat(),...st.melds.flatMap(m=>m.cards)];check(cards.length===52&&new Set(cards).size===52,'all52 distinct cards remain');}
function seedRandom(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};}
function stateWithHand(mode,hand,opponent){const st=R.shuffleInit([1,-1],()=>0,mode,{allowBot:true}),rest=R.standardDeck().filter(c=>!hand.includes(c));st.hands[-1]=hand;st.hands[1]=opponent||rest.splice(0,10);const used=new Set(Object.values(st.hands).flat());st.discard=R.standardDeck().filter(c=>!used.has(c)).slice(0,1);st.stock=R.standardDeck().filter(c=>!used.has(c)&&!st.discard.includes(c));st.phase='play';st.drawnDiscard=null;return st;}
(async()=>{
 for(const p of [[1,-1],[1,-2],[-1,-1],[1,2,-1]])assert.throws(()=>R.shuffleInit(p,()=>.5,'rummy'));
 for(const p of [[1,-2],[-1,-1],[1,2,-1],[0,-1]])assert.throws(()=>R.shuffleInit(p,()=>.5,'rummy',{allowBot:true}));
 for(const mode of ['rummy','gin'])for(let seed=1;seed<=20;seed++){
   const random=seedRandom(seed),st=R.shuffleInit([1,-1],random,mode,{allowBot:true});let turn=st.nextTurn;conserved(st);
   // Both fictional seats use the public-information policy; this is not a family game.
   for(let step=0;step<450&&st.phase!=='round-end';step++){
     const p=[1,-1][turn],view=visible(st,p),before=JSON.stringify(view),move=R.chooseShuffleBotMove(view,p);check(JSON.stringify(view)===before,'policy leaves its input unchanged');
     const altered=copy(st);altered.stock.reverse();altered.hands[[1,-1][1-turn]].reverse();check(JSON.stringify(R.chooseShuffleBotMove(visible(altered,p),p))===JSON.stringify(move),'policy cannot observe stock/opponent order');
     const result=R.shuffleMove(st,[1,-1],turn,move,random);actions++;turn=result.next;conserved(st);
   }
   check(st.phase==='round-end','fictional hand completes without stalled robot');
 }
 const gin=stateWithHand('gin',['C1','C2','C3','D4','D5','D6','H7','H8','H9','H10','S13']);
 let move=R.chooseShuffleBotMove(visible(gin,-1));check(move.action==='knock'&&move.card==='S13','bot recognizes Gin without hidden cards');R.shuffleMove(gin,[1,-1],1,move);check(gin.result.kind==='gin'&&gin.result.score>=20,'Gin uses existing scoring');conserved(gin);
 const knocked=stateWithHand('gin',['C1','C2','C3','D4','H4','S4','D7','D8','D9','C10','H13']);move=R.chooseShuffleBotMove(visible(knocked,-1));check(move.action==='knock','bot knocks with legal deadwood');R.shuffleMove(knocked,[1,-1],1,move);check(knocked.phase==='round-end','knock settles existing rules');conserved(knocked);
 const rummy=stateWithHand('rummy',['C1','C2','C3','D4','H4','S4','D7','D8','D9','C10','H13']);move=R.chooseShuffleBotMove(visible(rummy,-1));check(move.action==='meld','Rummy bot uses legal meld');
 const forbidden=stateWithHand('gin',['C1','D2','H3','S5','C6','D7','H8','S10','C11','D12','H13']);forbidden.drawnDiscard='H13';move=R.chooseShuffleBotMove(visible(forbidden,-1));check(move.card!=='H13','picked discard is retained');
 const unsafe=visible(forbidden,-1);unsafe.hands[1]=['C4'];assert.throws(()=>R.chooseShuffleBotMove(unsafe));
 // Exercise actual Worker routes against an isolated in-memory SQLite DB.
 const fixture=fs.readFileSync('tests/shuffle-api.cjs','utf8').split('(async()=>{')[0];
 const {api,sql,c,env,notices,setBeforeWrite}=new Function('require',fixture+'\nreturn {api,sql,c,env,notices,setBeforeWrite:fn=>beforeWrite=fn};')(require);
 const jobs=[];env.ctx.waitUntil=p=>jobs.push(p);async function drain(){for(let i=0;jobs.length&&i<100;i++)await Promise.all(jobs.splice(0));check(jobs.length===0,'background tasks complete');}
 await api('/api/sync');const old=await api('/api/game/create','host',1,{type:'tictac'});const preserved=sql.prepare('SELECT * FROM games WHERE id=?').get(old.data.id);
 const count=()=>sql.prepare('SELECT COUNT(*) n FROM games').get().n;
 for(const body of [{type:'shuffle',mode:'rummy',opponent:'bot',max_players:3},{type:'shuffle',mode:'gin',opponent:'bot',max_players:3},{type:'shuffle',mode:'gin',opponent:'solo'}]){const n=count();check((await api('/api/game/create','host',1,body)).status===400,'bad bot setup rejected');check(count()===n,'invalid creation leaves no row');}
 for(const mode of ['rummy','gin']){
   const created=await api('/api/game/create','host',1,{type:'shuffle',mode,opponent:'bot',max_players:2});check(created.status===200,JSON.stringify(created));const id=created.data.id;
   let row=sql.prepare('SELECT * FROM games WHERE id=?').get(id);check(row.status==='playing'&&row.players==='[1,-1]'&&row.max_players===2,'two-seat robot table starts');
   // Force robot-first and restart it with simultaneous reloads. Only one full turn may commit.
   let raw=R.shuffleInit([1,-1],()=>0,mode,{allowBot:true});raw.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};
   const expected=copy(raw);let expectedTurn=1,expectedActions=0;do{const m=R.chooseShuffleBotMove(visible(expected,-1));expectedTurn=(await c.applyMove('shuffle',expected,[1,-1],expectedTurn,m,env.DB)).next;expectedActions++;}while(expectedTurn===1&&expectedActions<138);
   sql.prepare("UPDATE games SET state=?,turn=1 WHERE id=?").run(JSON.stringify(raw),id);
   await Promise.all([api('/api/game/'+id),api('/api/game/'+id)]);await drain();row=sql.prepare('SELECT * FROM games WHERE id=?').get(id);raw=JSON.parse(row.state);
   check(row.turn===0,'robot yields to human');check(raw.revision===expected.revision&&raw.bot.moves===expectedActions,'concurrent reloads commit exactly one bot turn');conserved(raw);
   const view=(await api('/api/game/'+id)).data;await drain();check(Array.isArray(view.state.hands[1])&&typeof view.state.hands[-1]==='number'&&typeof view.state.stock==='number','human sees no hidden robot hand/stock order');
   const saved=row.state;await Promise.all([api('/api/game/'+id),api('/api/game/'+id)]);await drain();check(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state===saved,'human-turn reloads never replay a bot turn');
   const bad=await api('/api/game/'+id+'/move','host',1,{action:'draw',source:'stock',revision:-1});check(bad.status===400,'stale human write rejected');check(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state===saved,'stale rejection preserves state');
   const good=await api('/api/game/'+id+'/move','host',1,raw.phase==='opening'?{action:'pass',revision:raw.revision}:{action:'draw',source:'stock',revision:raw.revision});check(good.status===200,JSON.stringify(good));await drain();
   // An interrupted robot draw resumes from exactly its saved11-card hand.
   raw=R.shuffleInit([1,-1],()=>0,mode,{allowBot:true});raw.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};
   if(raw.phase==='opening'){R.shuffleMove(raw,[1,-1],1,{action:'pass',revision:0});R.shuffleMove(raw,[1,-1],0,{action:'pass',revision:1});}
   R.shuffleMove(raw,[1,-1],1,{action:'draw',source:'stock',revision:raw.revision});const rev=raw.revision;
   sql.prepare('UPDATE games SET state=?,turn=1 WHERE id=?').run(JSON.stringify(raw),id);await api('/api/game/'+id);await drain();row=sql.prepare('SELECT * FROM games WHERE id=?').get(id);check(row.turn===0&&JSON.parse(row.state).revision>rev,'interrupted draw resumes to completed turn');conserved(JSON.parse(row.state));
   // Force a compare-state collision; retry must preserve the intervening row change.
   raw=R.shuffleInit([1,-1],()=>0,mode,{allowBot:true});raw.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};
   sql.prepare('UPDATE games SET state=?,turn=1 WHERE id=?').run(JSON.stringify(raw),id);
   setBeforeWrite(()=>{const fresh={...raw,revision:raw.revision+1,fictionalConcurrentMarker:'retained'};sql.prepare('UPDATE games SET state=? WHERE id=?').run(JSON.stringify(fresh),id);});
   await api('/api/game/'+id);await drain();const raced=sql.prepare('SELECT state,turn FROM games WHERE id=?').get(id);check(raced.turn===0&&JSON.parse(raced.state).fictionalConcurrentMarker==='retained','CAS collision retry preserves intervening state');
   // Round-end review belongs to the human even when the robot wins.
   raw=stateWithHand('gin',['C1','C2','C3','D4','D5','D6','H7','H8','H9','H10','S13']);raw.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};
   const result=await c.applyMove('shuffle',raw,[1,-1],1,R.chooseShuffleBotMove(visible(raw,-1)),env.DB);check(raw.phase==='round-end'&&result.next===0,'robot win pauses for human review');
   sql.prepare("UPDATE games SET state=?,turn=0,status='playing',mode='gin' WHERE id=?").run(JSON.stringify(raw),id);const next=await api('/api/game/'+id+'/move','host',1,{action:'next',revision:raw.revision});check(next.status===200,JSON.stringify(next));await drain();check(JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state).round===2,'next hand retains robot and continues');
   raw=stateWithHand('gin',['C1','C2','C3','D4','D5','D6','H7','H8','H9','H10','S13']);raw.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};raw.scores[-1]=99;await c.applyMove('shuffle',raw,[1,-1],1,R.chooseShuffleBotMove(visible(raw,-1)),env.DB);
   sql.prepare("UPDATE games SET state=?,turn=1,status='finished',winner='-1',mode='gin' WHERE id=?").run(JSON.stringify(raw),id);const original=sql.prepare('SELECT * FROM games WHERE id=?').get(id);
   const replay=await api('/api/game/'+id+'/replay','host',1,{});check(replay.status===200,JSON.stringify(replay));check(sql.prepare('SELECT players FROM games WHERE id=?').get(replay.data.id).players==='[1,-1]','robot replay keeps exact seats');assert.deepEqual(sql.prepare('SELECT * FROM games WHERE id=?').get(id),original);
 }
 const rummyOut=stateWithHand('rummy',['C1','C2','C3','D4','H4','S4','C4','D7','D8','D9','D10'],['D1','H1','S1','D2','H2','S2','D3','H3','S3','C5']);rummyOut.bot={id:-1,name:'Ohana Robot',difficulty:'easy',moves:0,memory:{}};
 const rummyTable=await api('/api/game/create','host',1,{type:'shuffle',mode:'rummy',opponent:'bot',max_players:2});let rr={next:1};for(let n=0;n<10&&rummyOut.phase!=='round-end';n++)rr=await c.applyMove('shuffle',rummyOut,[1,-1],1,R.chooseShuffleBotMove(visible(rummyOut,-1)),env.DB);check(rummyOut.phase==='round-end'&&rr.next===0&&!rr.over,'Rummy robot out pauses for human review');conserved(rummyOut);
 sql.prepare("UPDATE games SET state=?,turn=0 WHERE id=?").run(JSON.stringify(rummyOut),rummyTable.data.id);check((await api('/api/game/'+rummyTable.data.id+'/move','host',1,{action:'next',revision:rummyOut.revision})).status===200,'Rummy next hand accepted');await drain();check(JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(rummyTable.data.id).state).round===2,'Rummy next hand continues with robot');
 const waiting=await api('/api/game/create','host',1,{type:'shuffle',mode:'rummy',max_players:2});let added=await api('/api/game/'+waiting.data.id+'/bot','family',1,{});check(added.status===400,'nonseated family cannot replace players with bot');added=await api('/api/game/'+waiting.data.id+'/bot','host',1,{});check(added.status===200,'creator can explicitly add robot to one-person2seat table');await api('/api/game/'+waiting.data.id);await drain();
 const large=await api('/api/game/create','host',1,{type:'shuffle',mode:'rummy',max_players:6});check((await api('/api/game/'+large.data.id+'/bot','host',1,{})).status===400,'six-seat family table not silently converted');
 assert.deepEqual(sql.prepare('SELECT * FROM games WHERE id=?').get(old.data.id),preserved);check(notices.filter(n=>n.payload.type==='invite').length===0,'robot creates/replays send no family invitations');
 const receipt={passed:true,assertions,simulatedLegalActions:actions,simulations:40,privacy:'filtered inputs and concealed opponents',worker:'SQLite bot-first/concurrent/reload/stale/interrupted/round-review/next/replay/permission/preservation passed'};fs.writeFileSync('artifacts/shuffle-bot-test-receipt.json',JSON.stringify(receipt,null,2));console.log(receipt);
})().catch(e=>{console.error(e);process.exitCode=1;});
