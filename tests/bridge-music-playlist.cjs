// Extract and exercise the actual deployed queue and transport with isolated data.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('live/'+fs.readdirSync('live').find(f=>f.endsWith('app.html')),'utf8');
const queueCode=app.slice(app.indexOf('function installListenerQueue('),app.indexOf('function musicQueueTracks('));
const playCode=app.slice(app.indexOf('  async playAt(pos) {'),app.indexOf('\n  toggle() {',app.indexOf('  async playAt(pos) {'))).trim().replace(/,$/,'');
const storage=new Map();let deferred=[];
const sandbox={console,Date,Math,localStorage:{setItem:(k,v)=>storage.set(k,v)},S:{room:1,token:'test'},api:()=>new Promise((resolve,reject)=>deferred.push({resolve,reject}))};
vm.createContext(sandbox);vm.runInContext(queueCode+'\nthis.install=installListenerQueue;this.transport=({'+playCode+'}).playAt;',sandbox);
class Audio{
 constructor(){this.src='';this.currentTime=0;this.duration=180;this.paused=true;this.events={};this.plays=0;}
 getAttribute(n){return n==='src'?this.src:null;}
 addEventListener(n,fn){(this.events[n]||=[]).push(fn);}
 emit(n){for(const fn of this.events[n]||[])fn();}
 pause(){this.paused=true;this.emit('pause');}
 play(){this.paused=false;this.plays++;return Promise.resolve();}
}
function setup(saved){let selected=['a','b','c'],choice={key:'list:one',label:'First playlist'},now=1000,context='test:1';const records=[];
 const audio=new Audio(),sys={tracks:['a','b','c','d'].map(id=>({id,stream:'https://test.invalid/'+id})),order:[0,1,2,3],pos:0,audio,shuffle:false,renderNowPlaying(){},renderList(){},updateShuffleBtn(){},current(){return this.tracks[this.order[this.pos]]},playAt:sandbox.transport};
 const controller=sandbox.install(sys,()=>sys.tracks.filter(t=>selected.includes(t.id)),()=>.2,{selection:()=>choice,context:()=>context,now:()=>now,load:()=>saved,save:(key,state)=>records.push(JSON.parse(JSON.stringify({key,...state})))});
 return {sys,audio,controller,records,select(ids,key='list:two'){selected=ids;choice={key,label:'Second playlist'}},tick(){now+=1000},context(k){context=k}};
}
(async()=>{
 let t=setup();await t.sys.playAll();assert.equal(t.controller.state().queue.join(','),'a,b,c');const start=t.sys.current().id;
 t.select(['d']);await t.sys.next();assert.notEqual(t.sys.current().id,'d','browsing must not redirect queue');
 const played=t.audio.plays;await t.sys.playAll();assert.equal(t.sys.current().id,'d','explicit Play All switches selected playlist');await t.sys.playAll();assert.equal(t.audio.plays,played+1,'rapid repeat is idempotent');
 t=setup();await t.sys.playAll();const first=t.sys.current().id;t.tick();await t.sys.playAll();assert.notEqual(t.sys.current().id,first,'new Play All varies first song');
 t=setup();await t.sys.playAt(2);assert.equal(t.sys.current().id,'c','manual choice preserved');t.audio.currentTime=37;t.sys.pause();await t.sys.toggle();assert.equal(t.audio.currentTime,37,'resume keeps position');assert.equal(t.sys.current().id,'c');await t.sys.next();assert.equal(t.sys.current().id,'a','last track wraps within selected playlist');
 t.sys.shuffle=true;await t.sys.playAt(0);const cycle=['a'];for(let n=0;n<2;n++){await t.sys.next();cycle.push(t.sys.current().id)}assert.equal(new Set(cycle).size,3,'shuffle visits queue once before refill');
 t=setup({id:'b',time:58,queue:['a','b','c'],label:'Saved playlist',selectionKey:'saved'});t.controller.restore();assert.equal(t.sys.current().id,'b');assert.equal(t.audio.plays,0,'restore never autoplays');await t.sys.toggle();t.audio.emit('loadedmetadata');assert.equal(t.audio.currentTime,58,'reload Resume restores seek');assert.equal(t.sys.current().id,'b');
 t.select(['d']);t.controller.restore();assert.equal(t.sys.current().id,'b','render/return must not change current');
 t=setup();await t.sys.playAll();for(let i=0;i<3;i++)t.sys.playbackFailed();assert.equal(t.audio.paused,true,'all failed queue must stop instead of infinite retry');assert.match(t.sys.playbackMessage,/could not play/);
 t=setup();t.sys.tracks[0].stream='/api/music/audio/a';const pending=t.sys.playAt(0);assert.equal(t.sys.playPending,true);t.sys.pause();deferred.shift().resolve({url:'https://test.invalid/private-a',expires_at:Date.now()+999999});await pending;assert.equal(t.audio.plays,0,'pause cancels late private playback ticket');
 t=setup();t.sys.tracks[0].stream='/api/music/audio/a';t.sys.tracks[1].stream='/api/music/audio/b';const a=t.sys.playAt(0),b=t.sys.playAt(1);deferred[1].resolve({url:'https://test.invalid/private-b',expires_at:Date.now()+999999});await b;deferred[0].resolve({url:'https://test.invalid/private-a',expires_at:Date.now()+999999});await a;deferred=[];assert.equal(t.sys.current().id,'b');assert.equal(t.audio.src,'https://test.invalid/private-b','late response cannot replace newest song');assert.equal(t.audio.plays,1);
 t=setup();t.select([]);await t.sys.playAll();assert.equal(t.audio.plays,0,'empty selected playlist does not start another playlist');
 t=setup();await t.sys.playAll();t.sys.tracks[1]._musicHidden=true;for(let i=0;i<6;i++){await t.sys.next();assert.notEqual(t.sys.current().id,'b','revoked tracks excluded');}
 let scripts=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/application\/json|application\/ld\+json/i.test(m[1]))continue;new vm.Script(m[2]);scripts++;}
 console.log('PASS: selected snapshot, explicit change, rapid taps, varied start, manual choice, pause/resume, last-track loop, shuffle, reload seek, return, failed-queue bound, stale ticket cancellation, latest request wins, empty playlist, revoked track; '+scripts+' scripts parse.');
})().catch(e=>{console.error(e);process.exitCode=1});
