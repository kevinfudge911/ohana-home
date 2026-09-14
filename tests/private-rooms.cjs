const fs=require('fs'),vm=require('vm'),assert=require('assert'),{DatabaseSync}=require('node:sqlite'),{webcrypto}=require('crypto');
const sql=new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT UNIQUE,pin TEXT,avatar TEXT,token TEXT,is_admin INTEGER,created_at INTEGER,last_seen INTEGER);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);INSERT INTO settings VALUES('family_code','FAMILY'),('family_name','Our Ohana');CREATE TABLE games(id INTEGER PRIMARY KEY,type TEXT,players TEXT,max_players INTEGER,status TEXT,turn INTEGER,created_by INTEGER,created_at INTEGER,updated_at INTEGER,mode TEXT,invite_code TEXT,state TEXT,winner TEXT);CREATE TABLE messages(id INTEGER PRIMARY KEY,member_id INTEGER,text TEXT,image TEXT,created_at INTEGER);CREATE TABLE push_subscriptions(member_id INTEGER,endpoint TEXT,p256dh TEXT,auth TEXT,created_at INTEGER);INSERT INTO members VALUES(1,'Host','','@hon','host',1,0,0),(2,'Family','','@hon','family',0,0,0);`);
sql.exec(fs.readFileSync('migrations/0002_score_reviews.sql','utf8'));sql.exec(fs.readFileSync('migrations/0003_private_rooms.sql','utf8'));
function prepare(q){let args=[];return {bind(...a){args=a;return this},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){const r=sql.prepare(q).run(...args);return {meta:{last_row_id:Number(r.lastInsertRowid),changes:Number(r.changes)}}}}};
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
console.log('PASS: migration preserves family; private signup, room/game/chat/member isolation, guessed-ID rejection on every game action, scoped notifications, all-room overview, guest-created rooms, invitation rotation, signed-in joins and private game chat.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>sql.close());
