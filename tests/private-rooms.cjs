const fs=require('fs'),vm=require('vm'),assert=require('assert'),{DatabaseSync}=require('node:sqlite'),{webcrypto}=require('crypto');
const sql=new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT UNIQUE,pin TEXT,avatar TEXT,token TEXT,is_admin INTEGER,created_at INTEGER,last_seen INTEGER);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);INSERT INTO settings VALUES('family_code','FAMILY'),('family_name','Our Ohana');CREATE TABLE games(id INTEGER PRIMARY KEY,type TEXT,players TEXT,max_players INTEGER,status TEXT,turn INTEGER,created_by INTEGER,created_at INTEGER,updated_at INTEGER,mode TEXT,invite_code TEXT,state TEXT,winner TEXT);CREATE TABLE messages(id INTEGER PRIMARY KEY,member_id INTEGER,text TEXT,image TEXT,created_at INTEGER);CREATE TABLE push_subscriptions(member_id INTEGER,endpoint TEXT,p256dh TEXT,auth TEXT,created_at INTEGER);INSERT INTO members VALUES(1,'Host','','@hon','host',1,0,0),(2,'Family','','@hon','family',0,0,0);`);
sql.exec(fs.readFileSync('migrations/0002_score_reviews.sql','utf8'));sql.exec(fs.readFileSync('migrations/0003_private_rooms.sql','utf8'));
sql.exec(fs.readFileSync('migrations/0004_game_invitations.sql','utf8'));
let beforeWrite=null;
function prepare(q){let args=[];return {bind(...a){args=a;return this},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){if(beforeWrite&&(q.startsWith("UPDATE games SET ")||q.startsWith("DELETE FROM games "))){const hook=beforeWrite;beforeWrite=null;hook(q,args);}const r=sql.prepare(q).run(...args);return {meta:{last_row_id:Number(r.lastInsertRowid),changes:Number(r.changes)}}}}};
const DB={prepare,async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts)out.push(await s.run());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
let source=fs.readFileSync('worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/export\s*\{[\s\S]*?\};\s*$/,'');
const c=vm.createContext({console,URL,Response,Request,crypto:webcrypto,TextEncoder,Uint8Array,btoa,atob,structuredClone});vm.runInContext(fs.readFileSync('mahjong.js','utf8').replaceAll('export function','function')+'\n'+source,c);
const notices=[];c.notifyMembers=async(db,ids,payload)=>notices.push({ids,payload});
const env={DB,ctx:{waitUntil:p=>p.catch(()=>{})}};
async function api(path,token='host',room=1,body){const req=new Request('https://test'+path,{method:body?'POST':'GET',headers:{authorization:'Bearer '+token,'x-ohana-room':String(room)},body:body?JSON.stringify(body):undefined});try{const r=await c.api2(req,env,new URL(req.url));return {status:r.status,data:await r.json()}}catch(e){return {status:400,data:{error:e.message}}}}
(async()=>{
assert.equal(sql.prepare('SELECT COUNT(*) n FROM room_members WHERE room_id=1').get().n,2);
const created=await api('/api/rooms/create','host',1,{name:'Friday Friends'});assert.equal(created.status,200,JSON.stringify(created));const room=created.data;
const guest=await api('/api/room-invite/'+room.invite_code+'/join','',0,{name:'Guest',pin:'1234',avatar:'@ree'});assert.equal(guest.status,200,JSON.stringify(guest));const token=guest.data.token,id=guest.data.me.id;
assert.equal(sql.prepare('SELECT COUNT(*) n FROM room_members WHERE room_id=1 AND member_id=?').get(id).n,0,'guest never joins family');
await api('/api/message','host',1,{text:'Family secret'});await api('/api/message',token,room.id,{text:'Friend secret'});
const fg=await api('/api/game/create','host',1,{type:'tictac'}),pg=await api('/api/game/create',token,room.id,{type:'tictac'});assert.equal(pg.status,200,JSON.stringify(pg));
assert.equal((await api('/api/game/'+fg.data.id+'/invite','host',1,{member_id:id})).status,400,'cannot invite private guest to family');
assert.equal((await api('/api/game/'+fg.data.id+'/invite','family',1,{member_id:1})).status,403,'only seated player invites');
assert.equal((await api('/api/game/'+fg.data.id+'/invite','host',1,{member_id:2})).status,200);
assert.deepEqual((await api('/api/game/'+fg.data.id,'host',1)).data.invited_members,[2],'pending invitations survive reload');
assert.equal((await api('/api/sync','family',1)).data.invitations.length,1);
assert.equal((await api('/api/sync',token,room.id)).data.invitations.length,0);
await api('/api/game/'+fg.data.id+'/decline','family',1,{});
assert.equal((await api('/api/sync','family',1)).data.invitations.length,0);
await api('/api/game/'+fg.data.id+'/invite','host',1,{member_id:2});
assert.equal((await api('/api/game/'+fg.data.id+'/join','family',1,{})).status,200);
assert.equal((await api('/api/sync','family',1)).data.invitations.length,0);
assert.equal(sql.prepare('SELECT status FROM game_invitations WHERE game_id=? AND member_id=2').get(fg.data.id).status,'accepted');
const fam=await api('/api/sync','family',1),friends=await api('/api/sync',token,room.id),host=await api('/api/sync','host',1);
assert(!fam.data.members.some(m=>m.id===id));assert.deepEqual(fam.data.messages.map(m=>m.text),['Family secret']);assert.deepEqual(friends.data.messages.map(m=>m.text),['Friend secret']);assert(!friends.data.members.some(m=>m.id===2));assert.equal(fam.data.allGames.length,1);assert.equal(host.data.allGames.length,2);assert.equal(friends.data.games.length,1);
for(const action of ['', '/join','/start','/leave','/move','/chat','/reviewack']){const r=await api('/api/game/'+pg.data.id+action,'family',1,action?{text:'no',i:0}:undefined);assert.equal(r.status,403,action)}
assert.equal((await api('/api/sync',token,1)).status,403);assert.equal((await api('/api/admin/info',token,room.id)).status,403);
const game=await api('/api/game/'+pg.data.id,token,room.id);assert(!game.data.names[2]);
assert(notices.some(n=>n.payload.tag==='ohana-room-'+room.id&&n.ids.includes(1)&&!n.ids.includes(2)));
const other=await api('/api/rooms/create',token,room.id,{name:'Guest’s own room'});assert.equal(other.status,200);assert.equal((await api('/api/rooms/rotate-invite',token,room.id,{})).status,403);
await api('/api/rooms/rotate-invite','host',room.id,{});assert.equal((await api('/api/room-invite/'+room.invite_code,'',0)).status,404);
assert.equal((await api('/api/sync',token,room.id)).status,200,'rotation keeps current membership');
const freshRoom=await api('/api/rooms/create','host',1,{name:'Another corner'});const signedJoin=await api('/api/room-invite/'+freshRoom.data.invite_code+'/join',token,room.id,{});assert.equal(signedJoin.data.me.id,id);
const inviteInfo=sql.prepare('SELECT invite_code FROM games WHERE id=?').get(pg.data.id);
const secondGuest=await api('/api/invite/'+inviteInfo.invite_code+'/join','',0,{name:'Second Guest',pin:'2345',avatar:'@hon'});assert.equal(secondGuest.status,200,JSON.stringify(secondGuest));assert.equal(sql.prepare('SELECT COUNT(*) n FROM room_members WHERE member_id=? AND room_id=1').get(secondGuest.data.me.id).n,0);
const chat=await api('/api/game/'+pg.data.id+'/chat',token,room.id,{text:'At our private table'});assert.equal(chat.status,200,JSON.stringify(chat));
for(const type of ['tictac','memory','checkers','mahjong','words']){const r=await api('/api/game/create','host',room.id,{type,opponent:'bot',difficulty:'hard'});assert.equal(r.status,200);const row=sql.prepare('SELECT * FROM games WHERE id=?').get(r.data.id);assert.equal(row.room_id,room.id);assert.equal(JSON.parse(row.state).bot.difficulty,'hard');assert.deepEqual(JSON.parse(row.players),[1,-1]);}
// Family invitations are available to ordinary family members, scoped to room 1.
assert.equal((await api('/api/rooms/invite',token,1,{})).status,403,'private-only guest cannot create family link');
const homeInvite=await api('/api/rooms/invite','family',1,{});assert.equal(homeInvite.status,200);assert.match(homeInvite.data.invite_code,/^[a-f0-9]{32}$/);
assert.equal((await api('/api/rooms/invite','host',1,{})).data.invite_code,homeInvite.data.invite_code,'repeated invite keeps same link');
assert.equal((await api('/api/room-invite/'+homeInvite.data.invite_code,'',0)).status,200);
const newcomer=await api('/api/room-invite/'+homeInvite.data.invite_code+'/join','',0,{name:'New cousin',pin:'4321',avatar:'@hon'});assert.equal(newcomer.status,200);assert.equal(newcomer.data.room_id,1);assert.equal(newcomer.data.me.is_admin,0);
assert.deepEqual(sql.prepare('SELECT room_id FROM room_members WHERE member_id=?').all(newcomer.data.me.id).map(x=>x.room_id),[1]);
const existingJoin=await api('/api/room-invite/'+homeInvite.data.invite_code+'/join','family',1,{});assert.equal(existingJoin.data.token,'family','existing session preserved');
assert.equal((await api('/api/rooms/rotate-invite','family',1,{})).status,403);
assert.equal((await api('/api/rooms/rotate-invite','host',1,{})).status,200);
assert.equal((await api('/api/room-invite/'+homeInvite.data.invite_code,'',0)).status,404);
assert.equal((await api('/api/sync',newcomer.data.token,1)).status,200,'rotation does not sign out existing members');
const eagleAvatar=await api('/api/avatar','family',1,{avatar:'@eag'});assert.equal(eagleAvatar.status,200);assert.equal(sql.prepare('SELECT avatar FROM members WHERE id=2').get().avatar,'@eag');assert.equal(sql.prepare('SELECT token FROM members WHERE id=2').get().token,'family');
const profile=await api('/api/profile','family',1,{name:'Meemaw',avatar:'@eag',about:'I love games.',member_id:1});assert.equal(profile.status,200);
assert.equal(sql.prepare('SELECT name,token FROM members WHERE id=2').get().name,'Meemaw');assert.equal(sql.prepare('SELECT token FROM members WHERE id=2').get().token,'family');assert.equal(sql.prepare('SELECT name FROM members WHERE id=1').get().name,'Host');
const afterProfile=(await api('/api/sync','family',1)).data;assert.equal(afterProfile.me.about,'I love games.');assert.equal(afterProfile.members.find(m=>m.id===2).about,'I love games.');
assert.equal((await api('/api/profile','family',1,{name:'Host',avatar:'@hon',about:'bad'})).status,400);assert.equal((await api('/api/sync','family',1)).data.me.about,'I love games.');
assert.equal((await api('/api/profile','family',1,{name:'Meemaw',avatar:'@eag',about:'x'.repeat(301)})).status,400);
assert.equal((await api('/api/profile','family',1,{name:'Meemaw',avatar:'invalid',about:''})).status,400);
assert.equal((await api('/api/profile','family',1,{name:'Meemaw',avatar:'@eag',about:''})).status,200);assert.equal((await api('/api/sync','family',1)).data.me.about,'');
// A chat arriving after a move read must never restore the old board.
const raceId=fg.data.id;
const raceState={board:Array(9).fill(null),chat:[]};
sql.prepare("UPDATE games SET state=?,turn=0,status='playing',players='[1,2]' WHERE id=?").run(JSON.stringify(raceState),raceId);
beforeWrite=()=>{const state=JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(raceId).state);state.board[4]='X';sql.prepare('UPDATE games SET state=?,turn=1 WHERE id=?').run(JSON.stringify(state),raceId);};
const chatRace=await api('/api/game/'+raceId+'/chat','host',1,{text:'Keep the new move'});assert.equal(chatRace.status,200);
let persisted=JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(raceId).state);assert.equal(persisted.board[4],'X');assert.equal(persisted.chat.at(-1).text,'Keep the new move');
// Two requests read the same turn: only the first write may commit.
sql.prepare("UPDATE games SET state=?,turn=0,status='playing' WHERE id=?").run(JSON.stringify(raceState),raceId);
beforeWrite=()=>{const state={...raceState,board:[...raceState.board]};state.board[4]='X';sql.prepare('UPDATE games SET state=?,turn=1 WHERE id=?').run(JSON.stringify(state),raceId);};
const moveRace=await api('/api/game/'+raceId+'/move','host',1,{i:0});assert.equal(moveRace.status,400);assert.match(moveRace.data.error,/table changed/i);persisted=JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(raceId).state);assert.equal(persisted.board[4],'X');assert.equal(persisted.board[0],null);
// Starting or canceling a waiting table cannot race a newly started game.
for(const action of ['start','leave']){
 sql.prepare("UPDATE games SET status='waiting',state=NULL,players='[1,2]',created_by=1 WHERE id=?").run(raceId);
 beforeWrite=()=>sql.prepare("UPDATE games SET status='playing',state=? WHERE id=?").run(JSON.stringify({board:['X'],chat:[]}),raceId);
 const result=await api('/api/game/'+raceId+'/'+action,'host',1,{});assert.equal(result.status,400);
 const row=sql.prepare('SELECT status,state FROM games WHERE id=?').get(raceId);assert.equal(row.status,'playing');assert.equal(JSON.parse(row.state).board[0],'X');
}
console.log('PASS: concurrent chat preserves the newer board; stale moves cannot overwrite a committed turn.');
console.log('PASS: migration preserves family; private signup, room/game/chat/member isolation, guessed-ID rejection on every game action, scoped notifications, all-room overview, guest-created rooms, invitation rotation, signed-in joins and private game chat.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>sql.close());
