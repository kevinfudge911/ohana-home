// In-memory D1 model. No network, credentials, real invitations or game moves.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{DatabaseSync}=require('node:sqlite'),{webcrypto}=require('crypto');
const sql=new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT UNIQUE,pin TEXT,avatar TEXT,token TEXT,is_admin INTEGER,created_at INTEGER,last_seen INTEGER);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);INSERT INTO settings VALUES('family_code','FIXTURE'),('family_name','Fictional room');CREATE TABLE games(id INTEGER PRIMARY KEY,type TEXT,players TEXT,max_players INTEGER,status TEXT,turn INTEGER,created_by INTEGER,created_at INTEGER,updated_at INTEGER,mode TEXT,invite_code TEXT,state TEXT,winner TEXT);CREATE TABLE messages(id INTEGER PRIMARY KEY,member_id INTEGER,text TEXT,image TEXT,created_at INTEGER);CREATE TABLE push_subscriptions(member_id INTEGER,endpoint TEXT,p256dh TEXT,auth TEXT,created_at INTEGER);`);
for(let id=1;id<=9;id++)sql.prepare('INSERT INTO members VALUES(?,?,?,?,?,?,?,?)').run(id,'Fixture '+id,'','@hon','fixture-'+id,0,0,0);
for(const name of ['0002_score_reviews.sql','0003_private_rooms.sql','0004_game_invitations.sql','0005_invitation_batches.sql'])sql.exec(fs.readFileSync('migrations/'+name,'utf8'));
sql.exec("INSERT INTO rooms(id,name,owner_id,invite_code,created_at) VALUES(2,'Other fixture room',1,'other',0);INSERT INTO room_members(room_id,member_id) VALUES(2,1),(2,2);DELETE FROM room_members WHERE room_id=1 AND member_id=9;");
let beforeBatch=null,afterBatchCommit=null,failRead=null,failAt=-1,readCalls=0,batchCalls=0;
function reading(q){readCalls++;if(failRead&&failRead(q)){failRead=null;throw Error('Fixture receipt or response read failure');}}
function prepare(q){let args=[];return {bind(...a){assert(a.length<=100,`D1 binding limit exceeded: ${a.length}`);args=a;return this},async first(){reading(q);return sql.prepare(q).get(...args)||null},async all(){reading(q);return {results:sql.prepare(q).all(...args)}},async run(){const r=sql.prepare(q).run(...args);return {meta:{last_row_id:Number(r.lastInsertRowid),changes:Number(r.changes)}}}};}
const DB={prepare,async batch(stmts){batchCalls++;if(beforeBatch){const hook=beforeBatch;beforeBatch=null;hook();}sql.exec('BEGIN');let out;try{out=[];for(let i=0;i<stmts.length;i++){if(i===failAt)throw Error('Fixture transaction failure');out.push(await stmts[i].run());}sql.exec('COMMIT');}catch(e){sql.exec('ROLLBACK');throw e;}if(afterBatchCommit){const hook=afterBatchCommit;afterBatchCommit=null;hook();}return out;}};
const rawBatch=DB.batch.bind(DB);let batchTail=Promise.resolve();DB.batch=stmts=>{const work=batchTail.then(()=>rawBatch(stmts));batchTail=work.catch(()=>{});return work;};
let source=fs.readFileSync('live/worker.js','utf8').replace(/^import (\w+) from .*;$/gm,'const $1=null;').replace(/^import .*;$/gm,'').replace(/^export \{[\s\S]*?^\};/gm,'').replace(/const APP_HTML = gunzipAppHtml\(APP_HTML_GZIP\)\.toString\("utf8"\);/,'const APP_HTML=null;');
const streams={};for(const suffix of ['', '2','22','222','2222','22222']){streams['Writable'+suffix]=require('node:stream').Writable;streams['EventEmitter'+suffix]=require('node:events').EventEmitter;}
const testConsole=Object.fromEntries(['log','warn','error','info','debug','trace'].map(k=>[k,console[k].bind(console)]));
const c=vm.createContext({...streams,process:{...process,env:{}},console:testConsole,URL,Response,Request,crypto:webcrypto,TextEncoder,Uint8Array,btoa,atob,structuredClone});
vm.runInContext(fs.readFileSync('live/shuffle-engine.js','utf8').replace(/export /g,'')+'\n'+source,c);
const notices=[];c.notifyMembers=async(db,ids,payload)=>{await db.prepare(`SELECT * FROM push_subscriptions WHERE member_id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all();notices.push({ids,payload});};
const env={DB,ctx:{waitUntil:p=>p.catch(()=>{})}};
async function api(body,room=1,token='fixture-1'){const req=new Request('https://fixture.invalid/api/game/invitations',{method:body?'POST':'GET',headers:{authorization:'Bearer '+token,'x-ohana-room':String(room)},body:body?JSON.stringify(body):undefined});try{const r=await c.api2(req,env,new URL(req.url));return {status:r.status,data:await r.json()};}catch(e){return {status:400,data:{error:e.message}};}}
const plan=(ids,mode='individual',type='words')=>({type,mode,member_ids:ids,request_id:webcrypto.randomUUID()});
const total=()=>sql.prepare('SELECT COUNT(*) n FROM games').get().n;
function seed(players,type='words',room=1,status='playing',max=4){return Number(sql.prepare('INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,room_id) VALUES(?,?,?,?,0,1,0,0,?)').run(type,JSON.stringify(players),max,status,room).lastInsertRowid);}
function pending(game,member,sender=1){sql.prepare("INSERT INTO game_invitations VALUES(?,?,?,'pending',?)").run(game,member,sender,Date.now());}
(async()=>{
 const old=seed([1,2]),finished=seed([1,3],'words',1,'finished'),otherType=seed([1,3],'checkers'),privateGame=seed([1,2],'memory',2),robot=seed([1,-1],'memory');
 const outgoing=seed([1],'words',1,'waiting');pending(outgoing,4);
 const incoming=seed([5],'words',1,'waiting');pending(incoming,1,5);
 const unrelated=seed([6],'words',1,'waiting');pending(unrelated,7,6);
 // More than the shelf's 80/120 table limits: old active/pending records count.
 for(let i=0;i<125;i++)seed([2,3],'tictac');
 let options=(await api()).data;
 assert(options.games.some(g=>g.id===old));assert(!options.games.some(g=>g.id===finished||g.id===privateGame||g.id===unrelated));
 assert(!options.members.some(m=>m.id===9||m.id<0));
 for(const [id,reason] of [[2,'Already playing'],[4,'Invitation pending'],[5,'Invitation pending'],[3,''],[6,'']])assert.equal(c.invitationReason(options.games,1,id,'words'),reason);
 for(const ids of [[2],[4],[5],[9],[-1],[1],[3,3]]){const n=total(),r=await api(plan(ids));assert.equal(r.status,400,JSON.stringify(r));assert.equal(total(),n);}
 assert.equal((await api(undefined,2,'fixture-3')).status,403);
 assert.equal((await api(plan([3]),1,'')).status,401);
 assert.equal((await api(plan([3],'individual','spades'))).status,400);
 assert.equal((await api(plan([3],'group','spades'))).status,400);
 assert.equal((await api(plan([3,6,7,8],'group'))).status,400);
 assert.equal((await api(plan([3],'individual','solitaire'))).status,400);
 assert.equal((await api(plan([3],'individual','__proto__'))).status,400);
 assert.equal((await api({...plan([3]),request_id:'invalid'})).status,400);
 c.GAME_TYPES.fixtureSolo={name:'Fixture solo',min:1,max:1};assert.equal((await api(plan([3],'group','fixtureSolo'))).status,400);
 // Actual production parent-managed game checks apply to sender and recipients.
 sql.prepare('INSERT INTO settings VALUES(?,?)').run('child_3',JSON.stringify({games:['words']}));
 assert((await api()).data.members.find(m=>m.id===3).blocked_types.includes('memory'));
 assert.equal((await api(plan([3],'individual','memory'))).status,400);
 sql.prepare('DELETE FROM settings WHERE key=?').run('child_3');
 sql.prepare('INSERT INTO settings VALUES(?,?)').run('child_1',JSON.stringify({games:['words']}));
 const managed=(await api()).data;assert(!Object.hasOwn(managed.types,'memory'));assert(managed.games.every(g=>g.type==='words'),'managed snapshot does not expose blocked game metadata');assert.equal((await api(plan([3],'individual','memory'))).status,400);
 sql.prepare('DELETE FROM settings WHERE key=?').run('child_1');
 // Production's two-day expiry does not permanently exclude old invitations.
 sql.prepare('UPDATE game_invitations SET created_at=? WHERE game_id=?').run(Date.now()-3*864e5,outgoing);
 assert.equal(c.invitationReason((await api()).data.games,1,4,'words'),'');
 sql.prepare('UPDATE game_invitations SET created_at=? WHERE game_id=?').run(Date.now(),outgoing);
 assert.equal((await api({...plan([3,6],'group','shuffle'),game_mode:'gin'})).status,400,'Gin has two seats');
 const card=await api({...plan([3],'individual','shuffle'),game_mode:'rummy'});assert.equal(card.status,200,JSON.stringify(card));assert.equal(sql.prepare('SELECT mode FROM games WHERE id=?').get(card.data.game_ids[0]).mode,'rummy');
 const p=plan([3,6]);let n=total(),r=await api(p);assert.equal(r.status,200,JSON.stringify(r));assert.equal(total(),n+2);assert.equal(r.data.game_ids.length,2);assert.notEqual(...r.data.game_ids);
 for(const id of r.data.game_ids){const row=sql.prepare('SELECT * FROM games WHERE id=?').get(id);assert.equal(row.status,'waiting');assert.equal(row.max_players,2);assert.equal(row.players,'[1]');assert.equal(row.state,null);assert.equal(sql.prepare('SELECT COUNT(*) n FROM game_invitations WHERE game_id=?').get(id).n,1);}
 n=total();const noticeCount=notices.length;assert.deepEqual((await api(p)).data,r.data,'lost-response replay returns same tables');assert.equal(total(),n);assert.equal(notices.length,noticeCount,'replay does not notify twice');
 assert.equal((await api({...p,member_ids:[7]})).status,400,'request identity binds the exact plan');
 assert.equal((await api(plan([3]))).status,400,'different request also blocks pending duplicates');
 const group=await api(plan([6,7,8],'group','spades'));assert.equal(group.status,200,JSON.stringify(group));assert.equal(group.data.game_ids.length,1);const gid=group.data.game_ids[0];assert.equal(sql.prepare('SELECT max_players FROM games WHERE id=?').get(gid).max_players,4);assert.equal(sql.prepare('SELECT COUNT(*) n FROM game_invitations WHERE game_id=?').get(gid).n,3);
 // Same people and type in a different joined room are independently eligible.
 assert.equal((await api(plan([2]),2)).status,200);
 // Pending is not a permanent exclusion after a decline or completed table.
 sql.prepare("UPDATE game_invitations SET status='declined' WHERE member_id=3").run();assert.equal((await api(plan([3]))).status,200);
 // A competing send after the read is caught inside the atomic write guard.
 n=total();beforeBatch=()=>pending(seed([1],'checkers',1,'waiting'),8);const raced=await api(plan([8],'individual','checkers'));assert.equal(raced.status,400,JSON.stringify(raced));assert.equal(total(),n+1,'only the fixture racing table exists');
 // Transaction failures leave no empty tables or half-sent groups; same ID retries.
 const retry=plan([7,8],'group','handfoot');n=total();failAt=2;assert.equal((await api(retry)).status,503);failAt=-1;assert.equal(total(),n);const retried=await api(retry);assert.equal(retried.status,200,JSON.stringify(retried));
 // Simultaneous retries and different request IDs both preserve uniqueness.
 const concurrent=plan([8],'individual','tictac');n=total();const same=await Promise.all([api(concurrent),api(concurrent)]);assert(same.every(r=>r.status===200),JSON.stringify(same));assert.deepEqual(same[0].data,same[1].data);assert.equal(total(),n+1);
 n=total();const distinct=await Promise.all([api(plan([7],'individual','tictac')),api(plan([7],'individual','tictac'))]);assert.equal(distinct.filter(r=>r.status===200).length,1);assert.equal(total(),n+1);
 // Membership loss between the eligibility read and commit cannot send.
 n=total();beforeBatch=()=>sql.prepare('DELETE FROM room_members WHERE room_id=1 AND member_id=8').run();assert.equal((await api(plan([8],'individual','mahjong'))).status,400);assert.equal(total(),n);sql.prepare('INSERT INTO room_members VALUES(1,8)').run();
 // Both managed sender and recipient policy changes immediately before commit
 // must invalidate the exact preflight snapshot; no game or invite is created.
 for(const id of [1,8]){
   n=total();beforeBatch=()=>sql.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('child_'+id,JSON.stringify({games:['words']}));
   const blocked=await api(plan([8],'individual','mahjong'));assert.equal(blocked.status,400,JSON.stringify(blocked));assert.equal(total(),n);
   sql.prepare('DELETE FROM settings WHERE key=?').run('child_'+id);
 }
 sql.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('child_8',JSON.stringify({games:['mahjong','words']}));
 n=total();beforeBatch=()=>sql.prepare('UPDATE settings SET value=? WHERE key=?').run(JSON.stringify({games:['words']}),'child_8');
 assert.equal((await api(plan([8],'individual','mahjong'))).status,400,'a changed existing policy is also blocked');assert.equal(total(),n);
 sql.prepare('DELETE FROM settings WHERE key=?').run('child_8');
 // An unknown outcome after a committed transaction is retryable with the
 // identical receipt ID. The retry returns the one committed game and no push.
 const committed=plan([8],'individual','chess');n=total();const noticesBefore=notices.length;
 afterBatchCommit=()=>{throw Error('Fixture response lost after commit');};
 const uncertain=await api(committed);assert.equal(uncertain.status,503,JSON.stringify(uncertain));assert.equal(total(),n+1);
 const recovered=await api(committed);assert.equal(recovered.status,200,JSON.stringify(recovered));assert.equal(total(),n+1);assert.equal(recovered.data.game_ids.length,1);assert.equal(notices.length,noticesBefore,'unknown commit does not notify twice');
 sql.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('child_8',JSON.stringify({games:['words']}));
 assert.deepEqual((await api(committed)).data,recovered.data,'a committed receipt stays confirmable after policy changes');
 sql.prepare('DELETE FROM settings WHERE key=?').run('child_8');
 // A failed receipt read or response lookup on a replay must also leave its
 // request ID retryable, even when the game already exists.
 failRead=q=>q.includes('FROM invitation_batches WHERE sender_id=');assert.equal((await api(committed)).status,503);assert.deepEqual((await api(committed)).data,recovered.data);
 failRead=q=>q.includes('SELECT id,invite_code FROM games');assert.equal((await api(committed)).status,503);assert.deepEqual((await api(committed)).data,recovered.data);
 // One set-based policy read and one batched write keep a 100-person send
 // within D1 Free's 50-query invocation budget, including route/auth reads.
 for(let id=1000;id<1100;id++){
   sql.prepare('INSERT INTO members VALUES(?,?,?,?,?,?,?,?)').run(id,'Fixture '+id,'','@hon','fixture-'+id,0,0,0);
   sql.prepare('INSERT INTO room_members VALUES(1,?)').run(id);
 }
 readCalls=0;batchCalls=0;
 const hundred=await api(plan(Array.from({length:100},(_,i)=>1000+i),'individual','words'));
 assert.equal(hundred.status,200,JSON.stringify(hundred));assert.equal(hundred.data.game_ids.length,100);
 assert.equal(notices.at(-1).ids.length,100,'one fictional notification lookup covers all recipients');
 assert(readCalls+batchCalls<=50,`D1 invocation query budget: ${readCalls} reads + ${batchCalls} batches`);
 console.log(`100-recipient query budget: ${readCalls} reads + ${batchCalls} batch`);
 const snap=sql.prepare('SELECT players,state,status FROM games WHERE id=?').get(old);assert.equal(snap.players,'[1,2]');assert.equal(snap.state,null);assert.equal(snap.status,'playing');
 assert.equal(sql.prepare('SELECT is_admin FROM members WHERE id=1').get().is_admin,0);
 console.log('PASS: invitation eligibility, room isolation, types/player limits, atomic individual/group sends, receipt replay, duplicate suppression, race guard, rollback/retry and preservation.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>sql.close());
