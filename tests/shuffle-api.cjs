const fs=require('fs'),vm=require('vm'),assert=require('assert'),{DatabaseSync}=require('node:sqlite'),{webcrypto}=require('crypto');
const sql=new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT UNIQUE,pin TEXT,avatar TEXT,token TEXT,is_admin INTEGER,created_at INTEGER,last_seen INTEGER);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);INSERT INTO settings VALUES('family_code','FAMILY'),('family_name','Our Ohana');CREATE TABLE games(id INTEGER PRIMARY KEY,type TEXT,players TEXT,max_players INTEGER,status TEXT,turn INTEGER,created_by INTEGER,created_at INTEGER,updated_at INTEGER,mode TEXT,invite_code TEXT,state TEXT,winner TEXT);CREATE TABLE messages(id INTEGER PRIMARY KEY,member_id INTEGER,text TEXT,image TEXT,created_at INTEGER);CREATE TABLE push_subscriptions(member_id INTEGER,endpoint TEXT,p256dh TEXT,auth TEXT,created_at INTEGER);INSERT INTO members VALUES(1,'Host','','@hon','host',1,0,0),(2,'Family','','@hon','family',0,0,0);`);
sql.exec(fs.readFileSync('migrations/0002_score_reviews.sql','utf8'));sql.exec(fs.readFileSync('migrations/0003_private_rooms.sql','utf8'));
sql.exec(fs.readFileSync('migrations/0004_game_invitations.sql','utf8'));
sql.exec(`CREATE TABLE activity_notices(id INTEGER PRIMARY KEY,member_id INTEGER,room_id INTEGER,game_id INTEGER,type TEXT,title TEXT,body TEXT,created_at INTEGER,seen INTEGER DEFAULT 0);CREATE TABLE chat_messages(id INTEGER PRIMARY KEY,conversation TEXT,sender INTEGER,text TEXT,image TEXT,created_at INTEGER,source TEXT UNIQUE);CREATE TABLE chat_reads(conversation TEXT,member_id INTEGER,through_id INTEGER DEFAULT 0,PRIMARY KEY(conversation,member_id));CREATE TABLE chat_threads(conversation TEXT PRIMARY KEY,room_id INTEGER,members TEXT);`);
sql.exec('CREATE TABLE chat_imports(source TEXT PRIMARY KEY,signature TEXT);');
let beforeWrite=null;
function prepare(q){let args=[];return {bind(...a){args=a;return this},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){if(beforeWrite&&(q.startsWith("UPDATE games SET ")||q.startsWith("DELETE FROM games "))){const hook=beforeWrite;beforeWrite=null;hook(q,args);}const r=sql.prepare(q).run(...args);return {meta:{last_row_id:Number(r.lastInsertRowid),changes:Number(r.changes)}}}}};
const DB={prepare,async batch(stmts){sql.exec('BEGIN');try{const out=[];for(const s of stmts)out.push(await s.run());sql.exec('COMMIT');return out}catch(e){sql.exec('ROLLBACK');throw e}}};
let source=fs.readFileSync('live/worker.js','utf8').replace('const APP_HTML = gunzipAppHtml(APP_HTML_GZIP).toString("utf8");','const APP_HTML = "";').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/^export \{[\s\S]*?^\};/gm,'');
const secureWorker=fs.readFileSync('live/worker.js','utf8');assert(!/\b(?:var|let|const) VAPID_PRIVATE_KEY\s*=/.test(secureWorker),'never restore the inherited private-key constant');assert(secureWorker.includes('import { env as OHANA_PUSH_ENV } from "cloudflare:workers";'));assert(secureWorker.includes('OHANA_PUSH_ENV.VAPID_PRIVATE_KEY'));
const streams={};for(const suffix of ['', '2','22','222','2222','22222']){streams['Writable'+suffix]=require('node:stream').Writable;streams['EventEmitter'+suffix]=require('node:events').EventEmitter;}
const testConsole=Object.fromEntries(['log','warn','error','info','debug','trace'].map(k=>[k,console[k].bind(console)]));
const c=vm.createContext({...streams,process:{...process,env:{}},console:testConsole,URL,Response,Request,crypto:webcrypto,TextEncoder,Uint8Array,btoa,atob,structuredClone});vm.runInContext(fs.readFileSync('live/shuffle-engine.js','utf8').replace(/export /g,'')+'\n'+source,c);
const notices=[];c.notifyMembers=async(db,ids,payload)=>notices.push({ids,payload});
const env={DB,ctx:{waitUntil:p=>p.catch(()=>{})}};
async function api(path,token='host',room=1,body){const req=new Request('https://test'+path,{method:body?'POST':'GET',headers:{authorization:'Bearer '+token,'x-ohana-room':String(room)},body:body?JSON.stringify(body):undefined});try{const r=await c.api2(req,env,new URL(req.url));return {status:r.status,data:await r.json()}}catch(e){return {status:400,data:{error:e.message}}}}
(async()=>{
// Every row is synthetic and local. Never connect this suite to a deployed DB.
await api('/api/sync');
const created=await api('/api/rooms/create','host',1,{name:'Fictional Island'});assert.equal(created.status,200,JSON.stringify(created));const room=created.data;
const guest=await api('/api/room-invite/'+room.invite_code+'/join','',0,{name:'Fictional Guest',pin:'1234',avatar:'@ree'});assert.equal(guest.status,200,JSON.stringify(guest));const token=guest.data.token;
const baseline=await api('/api/game/create','host',1,{type:'tictac'});assert.equal(baseline.status,200,JSON.stringify(baseline));const savedOther=sql.prepare('SELECT * FROM games WHERE id=?').get(baseline.data.id);
const count=()=>sql.prepare('SELECT COUNT(*) n FROM games').get().n;
for(const body of [{type:'shuffle',mode:'canasta'},{type:'shuffle',mode:'gin',max_players:3},{type:'shuffle',mode:'gin',max_players:2.5},{type:'shuffle',mode:'rummy',max_players:7},{type:'shuffle',mode:'rummy',opponent:'unknown'},{type:'shuffle',mode:'gin',opponent:'solo'}]){const before=count(),r=await api('/api/game/create','host',1,body);assert.equal(r.status,400,JSON.stringify(r));assert.equal(count(),before);}
const g=await api('/api/game/create','host',1,{type:'shuffle',mode:'gin',max_players:2});assert.equal(g.status,200,JSON.stringify(g));const id=g.data.id;
const bot=await api('/api/game/'+id+'/bot','family',1,{});assert.equal(bot.status,400);assert.equal(sql.prepare('SELECT status FROM games WHERE id=?').get(id).status,'waiting');
assert.equal((await api('/api/game/'+id+'/invite','host',1,{member_id:guest.data.me.id})).status,400,'cross-room invitation blocked');
assert.equal((await api('/api/game/'+id+'/invite','host',1,{member_id:2})).status,200);
let host=(await api('/api/game/'+id,'host',1)).data;assert.deepEqual(host.invited_members,[2]);assert.equal(host.mode,'gin');
assert.equal((await api('/api/game/'+id+'/join','family',1,{})).status,200);
const fetched=await api('/api/game/'+id,'host',1);assert.equal(fetched.status,200,JSON.stringify(fetched));host=fetched.data;let family=(await api('/api/game/'+id,'family',1)).data;
assert.equal(host.state.hands[1].length,10);assert.equal(host.state.hands[2],10);assert.equal(family.state.hands[1],10);assert.equal(family.state.hands[2].length,10);assert.equal(typeof host.state.stock,'number');assert.equal(host.state.stock,31);assert(!('everPlayed' in host.state));assert(host.name.includes('Gin Rummy'));
const serialized=sql.prepare('SELECT state FROM games WHERE id=?').get(id).state;
const actor=host.players[host.turn],actorToken=actor===1?'host':'family',otherToken=actor===1?'family':'host';
let bad=await api('/api/game/'+id+'/move',otherToken,1,{action:'pass',actor,revision:host.state.revision});assert.equal(bad.status,400);assert.match(bad.data.error,/turn/);assert.equal(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state,serialized);
bad=await api('/api/game/'+id+'/move',actorToken,1,{action:'draw',source:'discard',revision:-1});assert.equal(bad.status,400);assert.equal(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state,serialized);
let good=await api('/api/game/'+id+'/move',actorToken,1,{action:'draw',source:'discard',revision:host.state.revision});assert.equal(good.status,200,JSON.stringify(good));
let own=(await api('/api/game/'+id,actorToken,1)).data;assert.equal(own.state.hands[actor].length,11);assert.equal(own.state.phase,'play');assert.equal(own.state.revision,1);
const beforeDuplicate=sql.prepare('SELECT state FROM games WHERE id=?').get(id).state;bad=await api('/api/game/'+id+'/move',actorToken,1,{action:'draw',source:'discard',revision:0});assert.equal(bad.status,400);assert.equal(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state,beforeDuplicate);
// Reconnect is a GET of the same table and private hand, without dealing again.
const reloaded=(await api('/api/game/'+id,actorToken,1)).data;assert.deepEqual(reloaded.state,own.state);
const discard=own.state.hands[actor].find(c=>c!==own.state.drawnDiscard);
// Simulate another request committing between read and write. The existing save lease rejects ours.
beforeWrite=(q,args)=>{sql.prepare('UPDATE games SET state=? WHERE id=?').run(JSON.stringify({...JSON.parse(beforeDuplicate),revision:2}),id);};
bad=await api('/api/game/'+id+'/move',actorToken,1,{action:'discard',card:discard,revision:1});assert.equal(bad.status,400);assert.match(bad.data.error,/changed/);assert.equal(JSON.parse(sql.prepare('SELECT state FROM games WHERE id=?').get(id).state).hands[actor].length,11);
for(const suffix of ['', '/join','/start','/move','/bot']){const result=await api('/api/game/'+id+suffix,token,room.id,suffix?{action:'pass',revision:2}:undefined);assert.equal(result.status,403,suffix);}
const privateGame=await api('/api/game/create',token,room.id,{type:'shuffle',mode:'rummy',max_players:6});assert.equal(privateGame.status,200,JSON.stringify(privateGame));assert.equal((await api('/api/game/'+privateGame.data.id,'family',1)).status,403);
assert.deepEqual(sql.prepare('SELECT * FROM games WHERE id=?').get(baseline.data.id),savedOther,'preexisting game unchanged');
// A room member who is not seated can view only counts, and cannot act out of turn.
sql.prepare("INSERT INTO members VALUES(303,'Fictional Observer','','@hon','observer',0,0,0)").run();sql.prepare('INSERT INTO room_members(room_id,member_id) VALUES(1,303)').run();
const observer=(await api('/api/game/'+id,'observer',1)).data;assert.equal(typeof observer.state.hands[1],'number');assert.equal(typeof observer.state.hands[2],'number');assert.equal(observer.state.drawnDiscard,null);
bad=await api('/api/game/'+id+'/move','observer',1,{action:'discard',card:discard,revision:2});assert.equal(bad.status,400);assert.match(bad.data.error,/seated/);
console.log('PASS active Worker + in-memory SQLite: creation/mode/seats, invitation persistence, room isolation, hidden hands, seated/off-turn restrictions, stale/duplicate/concurrent saves, reconnect and existing-game preservation.');
})().catch(e=>{console.error(e);process.exitCode=1});
