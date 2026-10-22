// In-memory SQLite and DOM fixtures only. No production requests or family media.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{DatabaseSync}=require('node:sqlite'),{webcrypto}=require('node:crypto');
const {JSDOM}=require('jsdom');
const worker=fs.readFileSync('live/worker.js','utf8').replace(/\r\n/g,'\n');
const sql=new DatabaseSync(':memory:');
sql.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT);INSERT INTO members VALUES(1,'Fixture Owner'),(2,'Fixture Uploader'),(3,'Fixture Guest'),(4,'Fixture Outsider'),(5,'Fixture Admin');CREATE TABLE rooms(id INTEGER PRIMARY KEY,name TEXT,owner_id INTEGER);INSERT INTO rooms VALUES(1,'Fixture Island',1),(2,'Other Fixture',4);CREATE TABLE room_members(room_id INTEGER,member_id INTEGER);INSERT INTO room_members VALUES(1,1),(1,2),(1,3),(1,5),(2,4);CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT);CREATE TABLE puzzle_album(id INTEGER,room_id INTEGER,name TEXT,image TEXT,finished_at INTEGER,saved_at INTEGER);`);
function prepare(q){let args=[];return {bind(...a){args=a.map(v=>v instanceof ArrayBuffer?new Uint8Array(v):v);return this;},async all(){return {results:sql.prepare(q).all(...args)};},async first(){return sql.prepare(q).get(...args)||null;},async run(){const r=sql.prepare(q).run(...args);return {meta:{changes:Number(r.changes)}};}};}
let failBatch=false;
const DB={prepare,async batch(statements){sql.exec('BEGIN');try{const r=[];for(const s of statements){r.push(await s.run());if(failBatch&&r.length===2)throw Error('Synthetic interrupted transaction');}sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const context=vm.createContext({Response,Request,URL,Uint8Array,ArrayBuffer,crypto:webcrypto,atob,auth:async req=>{const id=Number(req.headers.get('authorization')?.replace('Bearer ',''));return id>=1&&id<=5?{id,is_admin:id===5}:null;},ohanaPhotoFeedbackApi:async()=>null,APP_HTML:'',fetch:()=>{throw Error('Unexpected external request');}});
const apiStart=worker.indexOf('async function ensureJourneyMemories(');
vm.runInContext(worker.slice(apiStart,worker.indexOf('// Also used by the service worker',apiStart)),context);
async function api(path,member=2,room=1,body,headers={}){const req=new Request('https://fixture.invalid'+path,{method:body?'POST':'GET',headers:{authorization:'Bearer '+member,'x-ohana-room':String(room),...headers},body:body instanceof FormData?body:body?JSON.stringify(body):undefined});return context.memoriesApi(req,{DB},new URL(req.url));}
const jpeg=new Uint8Array([255,216,0,0,255,217]),ids=Array.from({length:10},(_,i)=>'00000000-0000-4000-8000-'+String(i+1).padStart(12,'0'));
function form(id,type='image/jpeg',bytes=jpeg,album='0'){const f=new FormData();f.set('id',id);f.set('album',album);f.set('photo',new Blob([bytes],{type}),'synthetic');f.set('thumbnail',new Blob([jpeg],{type:'image/jpeg'}),'synthetic.jpg');f.set('caption','Synthetic memory');return f;}
(async()=>{
 assert.equal((await api('/api/memories/rooms',0)).status,401);
 assert.equal((await api('/api/memories/gallery',4,1)).status,403);
 const create=await api('/api/memories/albums',2,1,{name:'  Fixture   Trip  '});assert.equal(create.status,201);const album=(await create.json()).album.id;
 assert.equal((await api('/api/memories/albums',3,1,{name:'fixture trip'})).status,409);
 assert.equal((await api('/api/memories',2,1,form(ids[0]))).status,201);
 const original=sql.prepare('SELECT * FROM ohana_memories WHERE id=?').get(ids[0]);
 assert.equal((await api('/api/memories/photo/'+ids[0]+'/album',3,1,{album})).status,403);
 assert.equal((await api('/api/memories/photo/'+ids[0]+'/album',2,1,{album})).status,200);
 const moved=sql.prepare('SELECT * FROM ohana_memories WHERE id=?').get(ids[0]);for(const key of Object.keys(original).filter(k=>k!=='album_id'))assert.deepEqual(moved[key],original[key],'move preserves '+key);
 const other=await(await api('/api/memories/albums',4,2,{name:'Other album'})).json();assert.equal((await api('/api/memories/photo/'+ids[0]+'/album',1,1,{album:other.album.id})).status,400);
 assert.equal((await api('/api/memories/photo/'+ids[0]+'/album',1,1,{album:'0'})).status,200);
 assert.equal((await api('/api/memories/photo/'+ids[0]+'/album',5,1,{album})).status,200);
 // A synthetic MP4-shaped payload crosses the chunk boundary; playback codecs are a device check.
 const clip=new Uint8Array(1200000);clip.set([0,0,0,24,102,116,121,112,105,115,111,109]);clip[clip.length-1]=77;
 assert.equal((await api('/api/memories',2,1,form(ids[1],'video/mp4',clip,album))).status,201);
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM ohana_memory_video_parts WHERE memory_id=?').get(ids[1]).n,2);
 const full=await api('/api/memories/photo/'+ids[1]);assert.equal(full.headers.get('content-type'),'video/mp4');assert.equal(full.headers.get('cache-control'),'private, no-store');assert.deepEqual(new Uint8Array(await full.arrayBuffer()),clip);
 const thumb=await api('/api/memories/photo/'+ids[1]+'?thumbnail=1');assert.equal(thumb.headers.get('content-type'),'image/jpeg');assert.deepEqual(new Uint8Array(await thumb.arrayBuffer()),jpeg);
 assert.equal((await api('/api/memories/photo/'+ids[1],4,2)).status,404);
 assert.equal((await api('/api/memories/photo/'+ids[1],0)).status,401);
 assert.equal((await api('/api/memories',2,1,form(ids[1],'video/mp4',clip,album))).status,200,'retry is idempotent');
 assert.equal((await api('/api/memories',3,1,form(ids[1],'video/mp4',clip,album))).status,409,'retry cannot take ownership');
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM ohana_memory_video_parts WHERE memory_id=?').get(ids[1]).n,2);
 assert.equal((await api('/api/memories',2,1,form(ids[2],'video/mp4',jpeg))).status,400,'bad video signature');
 const webm=new Uint8Array([26,69,223,163,0,0,0,0]);assert.equal((await api('/api/memories',2,1,form(ids[3],'video/webm',webm))).status,201);
 assert.equal((await api('/api/memories',2,1,form(ids[4],'video/mp4',new Uint8Array(20*1024*1024+1)))).status,413);
 failBatch=true;await assert.rejects(api('/api/memories',2,1,form(ids[5],'video/mp4',clip)));failBatch=false;
 assert.equal(sql.prepare('SELECT COUNT(*) n FROM ohana_memories WHERE id=?').get(ids[5]).n,0,'interrupted batch leaves no metadata');assert.equal(sql.prepare('SELECT COUNT(*) n FROM ohana_memory_video_parts WHERE memory_id=?').get(ids[5]).n,0,'interrupted batch leaves no partial clip');
 const frames=await(await api('/api/memories/frames')).json();assert.equal(frames.photos.length,1);assert.equal(frames.photos[0].id,ids[0]);
 const gallery=await(await api('/api/memories/gallery?album='+album)).json();assert.equal(gallery.photos.length,2);assert.equal(gallery.photos.find(p=>p.id===ids[1]).mime,'video/mp4');
 assert.equal((await api('/api/memories/photo/'+ids[1]+'/hide',3,1,{})).status,403);assert.equal((await api('/api/memories/photo/'+ids[1]+'/hide',2,1,{})).status,200);assert.equal((await api('/api/memories/photo/'+ids[1])).status,404);
 sql.prepare("INSERT INTO settings VALUES('room_deleted_1','deleted')").run();assert.equal((await api('/api/memories/frames')).status,403);sql.prepare('DELETE FROM settings').run();
 // Run the actual Memories page script with intercepted, synthetic requests only.
 const html=fs.readFileSync('live/ohana-memories.html','utf8'),scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);scripts.forEach(s=>new vm.Script(s));
 const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{url:'https://fixture.invalid/memories',runScripts:'outside-only'}),u=dom.window;
 u.Headers=Headers;u.localStorage.setItem('ohana_token','fixture-token');u.matchMedia=()=>({matches:false,addEventListener(){}});u.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};u.HTMLMediaElement.prototype.pause=function(){};u.HTMLMediaElement.prototype.load=function(){};u.URL.createObjectURL=()=> 'blob:fixture-'+webcrypto.randomUUID();u.URL.revokeObjectURL=()=>{};u.crypto.randomUUID=webcrypto.randomUUID.bind(webcrypto);u.HTMLDialogElement.prototype.showModal=function(){this.open=true;};u.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new u.Event('close'));};
 const calls=[];u.fetch=async(path,opts={})=>{calls.push({path,opts});if(path==='/api/memories/rooms')return Response.json({me:{id:2},rooms:[{id:1,name:'Fixture Room',owner_id:1}]});if(path==='/api/memories/albums')return Response.json({albums:[{id:album,name:'Fixture Trip',photos:1}]});if(path.startsWith('/api/memories/gallery'))return Response.json({photos:[],more:false});if(path==='/api/memories')return Response.json({saved:true});if(path.endsWith('/album'))return Response.json({moved:true});return Response.json({});};
 u.eval(scripts[0].replace("'use strict';",'').replace('const M=','var M=').replace(/\nstart\(\);/,'\n'));
 u.eval(`inbox=async(action,value)=>action==='getAll'?M.queue:undefined;mountPhotoFeedback=()=>null;M.me={id:2};M.room=1;M.rooms=[{id:1,name:'Fixture Room',owner_id:1}];`);
 await u.eval('loadAlbums()');assert.equal(u.document.querySelector('#upload-album').value,'0');assert(u.document.querySelector('#memory-management').open);assert.match(u.document.querySelector('#add').textContent,/videos/);
 u.eval(`M.uploadAlbum=${JSON.stringify(album)};M.album='';renderQueue();`);assert.match(u.document.querySelector('#destination').textContent,/Fixture Trip/);
 const originalFetch=u.fetch;u.fetch=async(p,o)=>p==='/api/memories/photo/'+ids[1]?new Response(clip,{headers:{'content-type':'video/mp4'}}):originalFetch(p,o);
 u.eval(`M.photos=[{id:${JSON.stringify(ids[1])},member_id:2,caption:'Synthetic clip',author:'Fixture',mime:'video/mp4'}];`);await u.openPhoto(0);assert.equal(u.document.querySelector('#viewer-video').hidden,false);assert.equal(u.document.querySelector('#viewer-image').hidden,true);assert.equal(u.document.querySelector('#viewer-video').autoplay,false);assert.equal(u.document.querySelector('#download').textContent,'Save video');u.document.querySelector('#viewer').close();assert.equal(u.document.querySelector('#viewer-video').hasAttribute('src'),false,'closing viewer releases video source');
 const before=calls.length;u.eval(`M.queue=[{id:'fixture-queue',file:new File(['fixture'],'fixture.mp4',{type:'video/mp4'})}];renderQueue();`);assert(u.document.querySelector('#previews video').controls);assert.equal(calls.length,before,'selection/preview never uploads');
 u.eval(`videoThumbnail=async()=>new Blob(['thumbnail'],{type:'image/jpeg'});`);await u.upload();const upload=calls.find(c=>c.path==='/api/memories');assert(upload);assert.equal(upload.opts.body.get('album'),album,'browsing All does not change explicit upload destination');assert.equal(upload.opts.headers.get('authorization'),'Bearer fixture-token');
 u.eval(`M.photos=[{id:${JSON.stringify(ids[0])},member_id:2,caption:'Fixture',author:'Uploader'}];M.index=0;`);u.document.querySelector('#move-album').replaceChildren(...u.eval('albumOptions(false)'));u.document.querySelector('#move-album').value=album;const move=u.document.querySelector('#move-photo');move.click();move.click();await new Promise(r=>setTimeout(r,0));assert.equal(calls.filter(c=>c.path.endsWith('/album')).length,1,'double move is gated');
 u.eval(`M.queue=[{id:'remaining',file:new File(['fixture'],'fixture.mp4',{type:'video/mp4'})}];videoThumbnail=async()=>{localStorage.setItem('ohana_token','changed-account');return new Blob(['thumbnail'],{type:'image/jpeg'});};`);const n=calls.filter(c=>c.path==='/api/memories').length;await u.upload();assert.equal(calls.filter(c=>c.path==='/api/memories').length,n,'account change during prepare blocks upload');
 dom.window.close();
 const appFile=fs.readdirSync('live').find(f=>f.endsWith('app.html')),app=fs.readFileSync('live/'+appFile,'utf8');let parsed=0;for(const m of app.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim()){new vm.Script(m[1]);parsed++;}
 const frameDom=new JSDOM('<section id="card"><div class="memories-feature-scene"></div></section>',{url:'https://fixture.invalid',runScripts:'outside-only'}),f=frameDom.window;f.localStorage.setItem('ohana_token','frame-token');f.crypto.randomUUID=webcrypto.randomUUID.bind(webcrypto);f.URL.createObjectURL=()=> 'blob:synthetic-photo';const revoked=[];f.URL.revokeObjectURL=url=>revoked.push(url);f.fetch=async()=>new Response(jpeg,{headers:{'content-type':'image/jpeg'}});f.eval(`const S={room:1,token:'frame-token',me:{id:2}};const api=async()=>({photos:[{image_url:'/api/memories/photo/fixture?thumbnail=1'}]});`+app.slice(app.indexOf('function ohanaMemoryFrameOverlay('),app.indexOf('async function ohanaStartMemorySlideshow(')));
 f.ohanaMemoryFrameOverlay(f.document.querySelector('#card'),1);assert.equal(f.document.querySelectorAll('svg>polygon').length,6,'every illustrated people photo masked before request');await new Promise(r=>setTimeout(r,15));assert.equal(f.document.querySelectorAll('image[href]').length,6,'authorized fixture fills room frames');f.document.querySelector('#card').remove();await new Promise(r=>setTimeout(r,0));assert.equal(revoked.length,6,'private blob URLs released on room exit');frameDom.window.close();
 console.log('PASS Memories: synthetic SQLite album creation/duplicate/moves/permissions/room boundaries, legacy photo preservation, MP4+WebM upload signatures/limits/chunks/atomic rollback/idempotent retry/private playback/thumbnail/hidden and deleted-room access; actual DOM explicit album destination/preview/no-auto-upload/double-move/account-change guard; six authorized room-frame masks and URL cleanup; '+parsed+' main scripts parse. No real data, browser or network used.');
})().catch(e=>{console.error(e);process.exitCode=1;});
