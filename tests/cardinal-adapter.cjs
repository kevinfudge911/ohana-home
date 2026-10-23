const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),api=require('../cardinal/cardinal-flight.js'),adapter=require('../cardinal/cardinal-adapter.js');let checks=0;
function ok(value,message){assert(value,message);checks++;}function eq(a,b,message){assert.deepEqual(a,b,message);checks++;}
const oldBounds=p=>({x:p.x-150*p.scale,y:p.y-186*p.scale,w:300*p.scale,h:211*p.scale});
const repro={x:92,y:775.6055407286276,w:44,h:44},pose=api.pose(14,'bridge',1);
ok(!api.intersects(oldBounds(pose),repro),'reviewer reproduction passes the old incomplete box');ok(api.intersects(api.bounds(pose),repro),'new transformed wing envelope catches reviewer exclusion');
for(const room of ['bridge','shuffle'])for(let tour=0;tour<3;tour++)for(let t=0;t<=30.5;t+=.05){const p=api.pose(t,room,tour),b=api.bounds(p);ok(Object.values(b).every(Number.isFinite)&&b.w>0&&b.h>0,'finite transformed envelope');}
for(const [w,h]of [[1536,1024],[1280,900],[1280,585],[1024,768]]){const m=adapter.imageRect({left:0,top:0,width:w,height:h},'cover','50% -56px',1536,1024),c=adapter.imageRect({left:w-184,top:h-112,width:184,height:112},'120px 80px','0% calc(100% - 4px)',384,256),g=adapter.geometry(m,c);for(const k of ['x','y','width','height'])ok(Math.abs(g.asset[k]-c[k])<1e-8,'exact actual painted control anchor '+k);}
function fixture({id=5,token='fictional-session',enabled=false,width=1536,height=1024,portrait=false,actualLayout=false}={}){
 const dom=new JSDOM('<!doctype html><body><dialog id="ohana-chat-dialog" open><button id="game-tool">Instructions</button><div id="ohana-persistent-hub"><button id="chat-head" aria-label="Open Ohana tools"><span data-unread="3">3</span></button><button id="menu">Menu</button></div></dialog><section id="access-help"></section></body>',{url:'https://fictional.invalid/',runScripts:'outside-only'}),w=dom.window,d=w.document;
 Object.defineProperty(w,'innerWidth',{value:width,writable:true});Object.defineProperty(w,'innerHeight',{value:height,writable:true});let hidden=false;Object.defineProperty(d,'hidden',{get:()=>hidden});
 const media={matches:false};w.matchMedia=()=>media;w.Image=class{constructor(){this.complete=true;this.naturalWidth=384;this.naturalHeight=256;}};
 const gradient={addColorStop(){}};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||(()=>{})});
 let callbacks=new Map(),next=1,now=0;w.requestAnimationFrame=cb=>{const n=next++;callbacks.set(n,cb);return n;};w.cancelAnimationFrame=n=>callbacks.delete(n);
 const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height,x:left,y:top});
 const room=d.querySelector('dialog'),host=d.getElementById('ohana-persistent-hub'),head=d.getElementById('chat-head'),menu=d.getElementById('menu');
 room.getBoundingClientRect=()=>rect(0,0,w.innerWidth,w.innerHeight);host.getBoundingClientRect=()=>rect(w.innerWidth-184,w.innerHeight-112,184,112);head.getBoundingClientRect=()=>rect(w.innerWidth-184,w.innerHeight-84,120,80);menu.getBoundingClientRect=()=>rect(w.innerWidth-60,w.innerHeight-108,56,104);d.getElementById('game-tool').getBoundingClientRect=()=>rect(650,600,80,44);
 let roomSize=actualLayout?'auto calc(100% + 112px)':'cover';
 w.getComputedStyle=e=>{if(e===room)return{display:'block',visibility:'visible',transform:'none',backgroundImage:'url("/ohana-bridge-setting-'+(portrait?'portrait-v1':'v1')+'.webp")',backgroundSize:roomSize,backgroundPosition:actualLayout?'50% -56px':'50% 0px'};if(e===host)return{display:'block',visibility:'visible',backgroundImage:host.dataset.cardinalAway?'none':'url("/ohana-cardinal-control-v1.webp")',backgroundSize:'120px 80px',backgroundPosition:'0% calc(100% - 4px)'};return{display:e.style.display||'block',visibility:e.style.visibility||'visible'};};
 if(actualLayout){const add=(tag,cls,b)=>{const e=d.createElement(tag);e.className=cls;e.getBoundingClientRect=()=>rect(...b);room.append(e);return e;};add('div','hub-controls-panel',[288,365.59375,944.666687,546]);add('div','hub-record-stage',[570.333374,104.447921,380,253.145843]);add('h2','',[628,6,280,92.447921]);}
 if(token)w.localStorage.setItem('ohana_token',token);
 const storageKey='ohana_cardinal_visits_v1:5';if(enabled)w.localStorage.setItem(storageKey,'1');let state={me:{id},token,room:1},instances=[];const instrument={...api,Study:class extends api.Study{constructor(...args){super(...args);instances.push(this);}}};
 w.eval(fs.readFileSync(path.join(root,'cardinal/cardinal-adapter.js'),'utf8'));const controller=w.OhanaCardinalVisits.install({ownerMemberId:5,api:instrument,getState:()=>state});
 function tick(count=1,ms=50){for(let i=0;i<count;i++){now+=ms;const batch=[...callbacks.values()];callbacks.clear();for(const fn of batch)fn(now);}}
 return{w,d,controller,room,host,head,menu,media,tick,instances,setRoomSize(value){roomSize=value;},get state(){return state;},set state(v){state=v;},hide(value){hidden=value;d.dispatchEvent(new w.Event('visibilitychange'));},stop(){controller.stop();dom.window.close();}};
}
{
 const f=fixture();f.tick();ok(!f.controller.snapshot.enabled,'default off');ok(!f.d.querySelector('canvas'),'default off no overlay');eq(f.d.querySelectorAll('[data-cardinal-visit-settings]').length,1,'one owner settings row');
 const input=f.d.querySelector('[data-cardinal-visit-settings] input');input.checked=true;input.dispatchEvent(new f.w.Event('change'));f.tick();ok(f.controller.snapshot.bound,'owner can enable');ok(f.d.querySelector('#ohana-cardinal-visits-layer').hidden,'waiting layer hidden avoids duplicate resting art');f.tick(130);ok(f.controller.snapshot.away,'clear room begins flight');ok(!f.d.querySelector('#ohana-cardinal-visits-layer').hidden,'flight representation visible');eq(f.host.style.backgroundImage,'none','painted host background removed only while away');ok(f.head.isConnected&&f.menu.isConnected,'hit target and menu preserved');eq(f.head.querySelector('[data-unread]').textContent,'3','unread badge preserved');
 const active=f.instances.at(-1),t=active.time;f.controller.setPaused('manual',true);f.controller.setPaused('voice',true);f.tick(20);eq(active.time,t,'independent pause freezes');f.controller.setPaused('manual',false);f.tick(20);eq(active.time,t,'voice pause survives manual resume');f.controller.setPaused('voice',false);f.tick(2);ok(active.time>t,'all reasons released resumes');const t2=active.time;f.hide(true);f.tick(40);eq(active.time,t2,'hidden time frozen');f.hide(false);f.tick(1,10000);eq(active.time,t2,'visibility reset prevents hidden-time catchup');f.tick(2);ok(active.time>t2,'visible resumed normally');
 f.media.matches=true;f.tick();ok(!f.controller.snapshot.bound&&!f.controller.snapshot.away,'reduced motion restores static');ok(f.host.style.backgroundImage.includes('ohana-cardinal-control'),'exact original control restored');f.media.matches=false;f.tick();f.tick(130);ok(f.controller.snapshot.away,'can visit again after reduced motion clears');f.state={...f.state,token:'rotated-fictional-session'};f.tick();ok(!f.controller.snapshot.away,'token rotation tears down old flight');
 f.state={me:{id:8},token:'another-fictional-session',room:1};f.tick();ok(!f.controller.snapshot.eligible&&!f.controller.snapshot.bound,'nonowner excluded immediately');eq(f.d.querySelectorAll('[data-cardinal-visit-settings]').length,0,'owner controls removed on account switch');ok(!f.host.dataset.cardinalAway,'no stranded hidden art');f.stop();
}
for(const options of [{id:8,enabled:true},{token:null,enabled:true},{enabled:true,width:390,height:844},{enabled:true,portrait:true}]){const f=fixture(options);f.tick(150);ok(!f.controller.snapshot.away,'nonowner/signout/portrait surfaces remain static');f.stop();}
{
 const f=fixture({enabled:true});f.tick(130);ok(f.controller.snapshot.away,'room fixture active');f.state={...f.state,room:2};f.tick();ok(!f.controller.snapshot.away,'room change tears down');f.tick(130);ok(f.controller.snapshot.away,'new room has its own safe context');f.room.removeAttribute('open');f.tick();ok(!f.d.querySelector('canvas')&&!f.host.dataset.cardinalAway,'Bridge unmount returns exact original');f.stop();
}
{
 const f=fixture({enabled:true});f.tick(130);const obstacle=f.d.createElement('input');obstacle.getBoundingClientRect=()=>({left:0,top:0,width:1536,height:1024,right:1536,bottom:1024});f.room.append(obstacle);f.tick(2);ok(!f.controller.snapshot.away,'new dynamic input cancels overlapping tour');f.tick(150);ok(!f.controller.snapshot.away,'preflight refuses blocked corridor');f.stop();
}
{
 const f=fixture({enabled:true,actualLayout:true});f.tick(40);const canvas=f.d.querySelector('canvas');f.setRoomSize('cover');f.tick();f.setRoomSize('auto calc(100% + 112px)');f.tick();eq(f.d.querySelector('canvas'),canvas,'settling background does not remount layer');
 const tours=[],completed=[];let priorAway=false;for(let i=0;i<2300;i++){f.tick();const s=f.controller.snapshot;if(s.away&&!priorAway){tours.push(s.tour);if(tours.length>1)ok(tours.at(-1)!==tours.at(-2),'mapped tours do not immediately repeat');}if(!s.away&&priorAway){completed.push(s.tour);ok(f.d.querySelector('#ohana-cardinal-visits-layer').hidden,'completed tour hides overlay');ok(f.host.style.backgroundImage.includes('ohana-cardinal-control'),'completed tour restores original art');eq(f.d.querySelector('canvas'),canvas,'rest retains layer without observer feedback');}priorAway=s.away;}
 ok(completed.length>=3,'three complete mapped visits in actual-layout simulation');ok(tours.every(t=>t===0||t===2),'Menu-obstructed tour 1 never starts');ok(f.head.isConnected&&f.menu.isConnected,'original control and menu survive repeated visits');f.controller.stop();ok(!f.room.dataset.cardinalMapping,'teardown releases scene sizing marker');f.w.close();
}

// Regression: an already-open tab must not keep its old session after storage changes.
for(const kind of ['remove','replace','clear']){
 const f=fixture({enabled:true});f.tick(130);ok(f.controller.snapshot.away,'stale regression starts in flight');
 if(kind==='remove')f.w.localStorage.removeItem('ohana_token');else if(kind==='replace')f.w.localStorage.setItem('ohana_token','different-fictional-session');else f.w.localStorage.clear();
 f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:kind==='clear'?null:'ohana_token',oldValue:'fictional-session',newValue:kind==='replace'?'different-fictional-session':null}));
 const after={...f.controller.snapshot};fs.writeFileSync('stale-'+kind+'.json',JSON.stringify({after,storedToken:f.w.localStorage.getItem('ohana_token'),S_token:f.state.token,staticArtRestored:!f.host.dataset.cardinalAway,settings:f.d.querySelectorAll('[data-cardinal-visit-settings]').length},null,2));
 ok(!after.eligible&&!after.enabled&&!after.bound&&!after.away,'storage '+kind+' synchronously invalidates old session');
 ok(f.host.style.backgroundImage.includes('ohana-cardinal-control'),'storage '+kind+' restores original art');eq(f.d.querySelectorAll('[data-cardinal-visit-settings]').length,0,'storage '+kind+' removes old owner settings');
 f.tick(160);ok(!f.controller.snapshot.away,'stale state cannot restart after '+kind);f.stop();
}
{
 const f=fixture({enabled:true});f.tick(130);f.w.localStorage.removeItem('ohana_token');f.tick();ok(!f.controller.snapshot.eligible&&!f.controller.snapshot.enabled&&!f.controller.snapshot.bound&&!f.controller.snapshot.away,'same-tab logout without storage event stops on next frame');f.stop();
}
{
 const f=fixture({enabled:true});f.tick(130);f.w.localStorage.setItem('ohana_token','new-valid-session');f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:'ohana_token',oldValue:f.state.token,newValue:'new-valid-session'}));ok(!f.controller.snapshot.away,'rotation invalidates synchronously');f.state={...f.state,token:'new-valid-session'};f.tick();ok(f.controller.snapshot.eligible&&f.controller.snapshot.enabled&&f.controller.snapshot.bound&&!f.controller.snapshot.away,'matching new Kevin session rebinds with a fresh wait');f.tick(130);ok(f.controller.snapshot.away,'new valid session can start its own visit');f.stop();
}
{
 const f=fixture({enabled:true});f.tick(130);const flight=f.instances.at(-1),time=flight.time;f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:'unrelated-key',oldValue:'a',newValue:'b'}));ok(f.controller.snapshot.away,'unrelated storage events preserve valid visit');f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:'ohana_token',storageArea:f.w.sessionStorage}));ok(f.controller.snapshot.away,'sessionStorage event does not invalidate localStorage session');f.tick();ok(flight.time>time,'valid session still advances');f.stop();
}
{
 const f=fixture({enabled:true});f.tick(130);const proto=f.w.Storage.prototype,read=proto.getItem;proto.getItem=function(k){if(k==='ohana_token')throw Error('fictional storage denial');return read.call(this,k);};f.tick();ok(!f.controller.snapshot.eligible&&!f.controller.snapshot.bound&&!f.controller.snapshot.away,'storage read denial fails closed');proto.getItem=read;f.stop();
}
{
 const f=fixture({enabled:true});f.w.localStorage.removeItem('ohana_token');f.tick(150);ok(!f.controller.snapshot.eligible&&!f.controller.snapshot.enabled&&!f.controller.snapshot.bound,'missing current token cannot opt in from stale S');eq(f.d.querySelectorAll('[data-cardinal-visit-settings]').length,0,'missing current token exposes no owner controls');f.stop();
}

const result={passed:true,checks,reviewerRegressionCaught:true,networkRequests:0,familyWrites:0,scope:'Synthetic adapter and geometry; rendered pixels are checked separately in browser fixture'};fs.mkdirSync(path.join(root,'artifacts/cardinal'),{recursive:true});fs.writeFileSync(path.join(root,'artifacts/cardinal/adapter-tests.json'),JSON.stringify(result,null,2));console.log(result);
