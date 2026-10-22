const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict'),Module=require('module');
const root=path.resolve(__dirname,'..'),base=path.join(root,'artifacts');process.chdir(root);
const harness=fs.readFileSync('tests/shuffle-api.cjs','utf8').split('(async()=>{')[0]+'\nmodule.exports={c};';
const mod=new Module(path.join(root,'tests/puzzle-local-harness.cjs'));mod.filename=path.join(root,'tests/puzzle-local-harness.cjs');mod.paths=module.paths;mod._compile(harness,mod.filename);
const c=mod.exports.c,Room=vm.runInContext('PuzzleRoom',c);let checks=0;
const clone=x=>JSON.parse(JSON.stringify(x)),ok=(v,s)=>{assert(v,s);checks++;};
// Independent rectangle oracle, separate from the production intersection helper.
function box(m,p){const x=m.w/m.cols,y=m.h/m.rows,t=Math.min(x,y)*.36;return [p.x-(p.c? t:0),p.y-(p.r?t:0),p.x+x+(p.c<m.cols-1?t:0),p.y+y+(p.r<m.rows-1?t:0)];}
function conflict(m,a,b){const A=box(m,a),B=box(m,b),l=Math.max(A[0],B[0]),t=Math.max(A[1],B[1]),r=Math.min(A[2],B[2]),bt=Math.min(A[3],B[3]);return r-l>.02&&bt-t>.02&&(l<0||t<0||r>m.w||bt>m.h);}
function pieces(m,n=m.cols*m.rows){return Array.from({length:n},(_,i)=>({i,r:Math.floor(i/m.cols),c:i%m.cols,x:(i%4)*20-160,y:i%2?m.h+400:-700,l:false,h:null,g:i,onTable:false}));}
function invoke(name,...args){c.__args=args;return vm.runInContext(name+'(...__args)',c);}
async function room(meta,P){const store=clone({meta,pieces:P,stats:{1:{placed:3,joins:2}},trays:[],chat:[],seq:0});let init;const ctx={blockConcurrencyWhile:f=>init=f(),storage:{get:async k=>clone(store[k]??null),put:async(k,v)=>{if(typeof k==='object')Object.assign(store,clone(k));else store[k]=clone(v);}},getWebSockets:()=>[]};const r=new Room(ctx,{});await init;const messages=[];r.broadcast=(m,except)=>{Room.prototype.broadcast.call(r,m,except);messages.push(clone(m));};r.scheduleSave=()=>{store.pieces=clone(r.pieces);store.seq=r.seq;};return {r,store,messages};}
function clearExterior(meta,P){for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++)if(!P[i].tray&&!P[j].tray&&P[i].g!==P[j].g)assert(!conflict(meta,P[i],P[j]),'exterior overlap '+P[i].i+'/'+P[j].i);checks++;}
(async()=>{
 const cases=[];
 for(const [w,h,cols,rows] of [[600,400,6,4],[1200,240,12,4],[240,1200,4,12],[1000,1000,20,20],[1400,700,40,25]]){
  const m={w,h,cols,rows},P=pieces(m);P[0]={...P[0],x:0,y:0,l:true};P[1].g=1;P[2].g=1;P[1].x=-300;P[2].x=-300+w/cols;P[1].y=P[2].y=200;P[3].tray=5;P[4].h=2;P[4].ht=Date.now();
  const before=clone(P),targets=P.filter(q=>!q.l&&!q.tray&&!q.h&&q.g!==1);invoke('puzzleTidyAround',m,P,targets);
  ok(P.length===before.length&&P.every((q,i)=>q.i===before[i].i&&q.g===before[i].g&&q.l===before[i].l&&q.r===before[i].r&&q.c===before[i].c),'identities/groups/locks');
  for(let i=0;i<5;i++)ok(JSON.stringify(P[i])===JSON.stringify(before[i]),'protected piece '+i);
  ok(targets.every(q=>q.onTable),'off-table pieces included');
  for(const q of targets)for(const other of P)if(other.i!==q.i&&!other.tray)assert(!conflict(m,q,other),'Tidy overlaps '+q.i+'/'+other.i);
  checks++;const sideCounts=[0,0,0,0];for(const q of targets){const b=box(m,q);if(b[3]<0)sideCounts[0]++;if(b[0]>w)sideCounts[1]++;if(b[1]>h)sideCounts[2]++;if(b[2]<0)sideCounts[3]++;}
  ok(sideCounts.every(n=>n>0),'all four sides');
  ok(targets.some(q=>{const b=box(m,q);return Math.min(Math.abs(b[3]),Math.abs(b[0]-w),Math.abs(b[1]-h),Math.abs(b[2]))<=3;}),'close perimeter');
  for(let k=0;k<3;k++){invoke('puzzleTidyAround',m,P,targets.slice().reverse());for(const q of targets)for(const other of P)if(other.i!==q.i&&!other.tray)assert(!conflict(m,q,other));}
  checks++;cases.push({w,h,pieces:P.length,tidied:targets.length,sides:sideCounts,repeated:3});
 }
 const meta={w:600,h:400,cols:6,rows:4},P=pieces(meta),{r,store,messages}=await room(meta,P);
 r.pieces[0].l=true;r.pieces[0].x=0;r.pieces[0].y=0;r.pieces[1].g=r.pieces[2].g=1;r.pieces[1].x=200;r.pieces[2].x=300;r.pieces[1].y=r.pieces[2].y=200;r.pieces[3].tray=5;r.pieces[4].h=2;r.pieces[4].ht=Date.now();
 const fixed=clone(r.pieces.slice(0,5)),stats=JSON.stringify(r.stats),pairOffset=[r.pieces[2].x-r.pieces[1].x,r.pieces[2].y-r.pieces[1].y];r.handle({id:1,name:'Fixture'}, {t:'tidy'});
 ok(messages.at(-1).t==='tidy'&&messages.at(-1).pieces.length===19,'real DO tidy includes only off-table unconnected singles');
 ok([0,1,2,3,4].every(i=>JSON.stringify(r.pieces[i])===JSON.stringify(fixed[i])),'DO joined groups and protected state exact');ok(JSON.stringify(r.stats)===stats,'no Tidy scoring');
 ok(r.pieces[2].g===r.pieces[1].g&&r.pieces[2].x-r.pieces[1].x===pairOffset[0]&&r.pieces[2].y-r.pieces[1].y===pairOffset[1],'Tidy preserves joined group identity and offsets');clearExterior(meta,r.pieces);
 const fresh=await room(store.meta,store.pieces);ok(JSON.stringify(fresh.r.pieces)===JSON.stringify(r.pieces),'restart preserves all positions');
 ok(fresh.r.meta.table.y1>=Math.max(...r.pieces.filter(q=>!q.tray).map(q=>box(meta,q)[3])),'restart derives reachable table extent');
 // Grouped drops: rigid translation, no movement of any other pieces.
 const group=pieces(meta,4);group[0].x=group[1].x=-300;group[0].y=group[1].y=100;group[1].g=0;group[1].x+=100;group[2].x=-300;group[2].y=100;group[3].x=0;group[3].y=0;group[3].l=true;
 const stationary=clone(group.slice(2)),rel=[group[1].x-group[0].x,group[1].y-group[0].y];invoke('puzzleSettleExterior',meta,group,group.slice(0,2));
 ok(JSON.stringify(group.slice(2))===JSON.stringify(stationary),'settlement never moves obstacles');ok(group[1].x-group[0].x===rel[0]&&group[1].y-group[0].y===rel[1],'joined relative positions');ok(!conflict(meta,group[0],group[2])&&!conflict(meta,group[1],group[2]),'exterior collision resolved');
 const inside=pieces(meta,2);for(const q of inside){q.x=200;q.y=180;}const ib=clone(inside);invoke('puzzleSettleExterior',meta,inside,[inside[0]]);ok(JSON.stringify(inside)===JSON.stringify(ib),'inside overlap stays allowed');
 const d=await room(meta,pieces(meta));d.r.pieces.forEach((q,i)=>{q.x=1000+i*180;q.y=900;});d.r.pieces[0].x=d.r.pieces[1].x=800;d.r.pieces[0].y=d.r.pieces[1].y=600;d.r.pieces[0].h=1;d.r.pieces[0].ht=Date.now();
 const unselected=clone(d.r.pieces.slice(1));d.r.handle({id:1,name:'Fixture'},{t:'drop',p:0,x:800,y:600});ok(d.messages.at(-1).t==='drop','real drop accepted');ok(!conflict(meta,d.r.pieces[0],d.r.pieces[1]),'real drop exterior nonoverlap');ok(JSON.stringify(d.r.pieces.slice(1))===JSON.stringify(unselected),'real drop other state unchanged');
 d.r.pieces[0].h=2;d.r.pieces[0].ht=Date.now();const denied=clone(d.r.pieces);d.r.handle({id:1,name:'Fixture'},{t:'drop',p:0,x:900,y:900});ok(JSON.stringify(d.r.pieces)===JSON.stringify(denied),'held by other denied');
 const protocolCases=[];
 for(const [w,h,cols,rows] of [[600,400,6,4],[1200,240,12,4],[240,1200,4,12]]){
  const m={w,h,cols,rows},pw=w/cols,ph=h/rows,P=pieces(m),n=P.length;
  P.forEach((q,i)=>{q.x=-500+(i%8)*(pw+Math.min(pw,ph));q.y=h+600+Math.floor(i/8)*(ph+Math.min(pw,ph));});
  P[0].g=P[1].g=0;P[0].tray=P[1].tray=5;P[1].x=P[0].x+pw;P[1].y=P[0].y;
  P[2].g=P[3].g=2;P[3].x=P[2].x+pw;P[3].y=P[2].y;P[2].h=2;P[2].ht=Date.now();
  P[n-2].tray=7;P[n-1].l=true;P[n-1].x=P[n-1].c*pw;P[n-1].y=P[n-1].r*ph;P[4].x=-200;P[4].y=150;
  const x=await room(m,P),rr=x.r,me={id:1,name:'Fixture'},allIds=rr.pieces.map(q=>q.i),off=[pw,0],unchanged=clone(rr.pieces.slice(2)),score=JSON.stringify(rr.stats);
  const invalid=clone(rr.pieces);rr.handle(me,{t:'tray-out',p:0,x:NaN,y:150});ok(JSON.stringify(rr.pieces)===JSON.stringify(invalid),'nonfinite tray-out rejected');
  rr.pieces[1].tray=6;const split=clone(rr.pieces);ok(rr.handle(me,{t:'tray-out',p:0,x:-200,y:150}).t==='deny'&&JSON.stringify(rr.pieces)===JSON.stringify(split),'inconsistent tray group is not split');rr.pieces[1].tray=5;
  rr.pieces[1].h=2;rr.pieces[1].ht=Date.now();const held=clone(rr.pieces);ok(rr.handle(me,{t:'tray-out',p:0,x:-200,y:150}).t==='deny'&&JSON.stringify(rr.pieces)===JSON.stringify(held),'held tray group denied atomically');rr.pieces[1].h=null;rr.pieces[1].ht=null;
  rr.handle(me,{t:'tray-out',p:0,x:-200,y:150});let event=x.messages.at(-1);
  ok(event.t==='tray-piece'&&event.tray===null&&event.ids.length===2,'sorting tray-out broadcasts both group IDs');
  ok(rr.pieces[0].tray===null&&rr.pieces[1].tray===null&&rr.pieces[1].x-rr.pieces[0].x===off[0]&&rr.pieces[1].y===rr.pieces[0].y,'tray-out rigid joined group');
  ok(JSON.stringify(rr.pieces.slice(2))===JSON.stringify(unchanged),'tray-out leaves other pieces unchanged');
  for(const q of rr.pieces.slice(0,2))for(const p of rr.pieces.slice(2))if(!p.tray)assert(!conflict(m,q,p));checks++;
  ok(event.table&&event.pieces.every(([i,px,py])=>rr.pieces[i].x===px&&rr.pieces[i].y===py),'tray-out positions and extent in actual broadcast');
  let reload=await room(x.store.meta,x.store.pieces);ok(JSON.stringify(reload.r.pieces)===JSON.stringify(rr.pieces),'tray-out survives restart');
  rr.handle(me,{t:'tray-return',p:0});event=x.messages.at(-1);ok(event.t==='tray-return'&&event.pieces.length===2,'return broadcasts complete group');
  ok(rr.pieces[1].x-rr.pieces[0].x===pw&&rr.pieces[1].y===rr.pieces[0].y&&rr.pieces.slice(0,2).every(q=>!q.onTable&&!q.tray&&!q.h),'return retains group and virtual tray eligibility');
  for(const q of rr.pieces.slice(0,2))for(const p of rr.pieces.slice(2))if(!p.tray)assert(!conflict(m,q,p));checks++;
  reload=await room(x.store.meta,x.store.pieces);ok(JSON.stringify(reload.r.pieces)===JSON.stringify(rr.pieces),'return survives restart');
  const protectedBefore=clone(rr.pieces),heldOffset=[rr.pieces[3].x-rr.pieces[2].x,rr.pieces[3].y-rr.pieces[2].y];
  for(let k=0;k<3;k++){
   rr.handle(me,{t:'recall'});event=x.messages.at(-1);ok(event.t==='tidy'&&event.recall&&new Set(event.pieces.map(p=>p[0])).size===n-4,'Recall covers every eligible member exactly once');
   ok([2,3,n-2,n-1].every(i=>JSON.stringify(rr.pieces[i])===JSON.stringify(protectedBefore[i])),'Recall preserves whole held group, placed and sorting tray pieces');
   ok(rr.pieces[1].g===0&&rr.pieces[1].x-rr.pieces[0].x===pw&&rr.pieces[1].y===rr.pieces[0].y,'Recall joined group offsets');clearExterior(m,rr.pieces);
   const beforeTidyGroup=clone(rr.pieces.slice(0,2));rr.handle(me,{t:'tidy'});event=x.messages.at(-1);ok(event.t==='tidy'&&event.pieces.length===n-6,'Tidy covers singles only');ok(JSON.stringify(rr.pieces.slice(0,2))===JSON.stringify(beforeTidyGroup),'Tidy joined absolute coordinates unchanged');clearExterior(m,rr.pieces);
  }
  ok(rr.pieces[3].x-rr.pieces[2].x===heldOffset[0]&&rr.pieces[3].y-rr.pieces[2].y===heldOffset[1],'held partial group never distorted');
  const groupBefore=clone(rr.pieces.slice(0,2));rr.handle(me,{t:'shuffle'});ok(JSON.stringify(rr.pieces.slice(0,2))===JSON.stringify(groupBefore),'Shuffle keeps joined group intact and stationary');clearExterior(m,rr.pieces);
  ok(JSON.stringify(rr.stats)===score&&rr.pieces.every((q,i)=>q.i===allIds[i]),'protocol preserves scoring and all IDs');
  reload=await room(x.store.meta,x.store.pieces);ok(JSON.stringify(reload.r.pieces)===JSON.stringify(rr.pieces),'coordinated operations survive restart');
  protocolCases.push({w,h,pieces:n,recallAndTidyRepeats:3,groupedTrayOutReturn:true});
 }
 const app=fs.readFileSync('live/'+fs.readdirSync('live').find(x=>x.endsWith('-app.html')),'utf8');let parsed=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/src=/.test(m[1])||/application\/(json|ld\+json)/.test(m[1]))continue;new vm.Script(m[2]);parsed++;}
 ok(app.includes("bottom.append($('#pz-leave'),$('#pz-peek-btn'),$('#pz-next-game'))"),'real Preview above people');ok(app.includes("$('#pz-peek-btn').onclick=()=>pzTogglePeek(true)"),'same timed Preview action');
 const worker=fs.readFileSync('live/worker.js','utf8'),extract=s=>s.slice(s.indexOf('function puzzlePieceBounds('),s.indexOf('function puzzleArrangeRows('));ok(extract(app)===extract(worker),'client/server geometry source matches exactly');
 const fractions=pieces(meta,6);fractions.forEach((p,i)=>{p.x=900+i*200;p.y=900;});fractions[0].g=fractions[1].g=0;fractions[0].x=900.25;fractions[1].x=1000.375;fractions[0].y=900.125;fractions[1].y=900.875;
 const fr=await room(meta,fractions),fdx=fractions[1].x-fractions[0].x,fdy=fractions[1].y-fractions[0].y;
 for(const action of ['recall','tidy','recall']){fr.r.handle({id:1,name:'Fixture'},{t:action});ok(Math.abs(fr.r.pieces[1].x-fr.r.pieces[0].x-fdx)<1e-9&&Math.abs(fr.r.pieces[1].y-fr.r.pieces[0].y-fdy)<1e-9,'fractional group translation '+action);clearExterior(meta,fr.r.pieces);}
 // Read the real client message handler into a minimal state fixture. No DOM/network.
 const clientP=pieces(meta,5);clientP[0].g=clientP[1].g=0;clientP[2].l=true;clientP[3].h=2;
 clientP[4].h=1;clientP[4].ht=Date.now()-20000;const initialClient=clone(clientP),client=vm.createContext({PZ:{data:{meta:clone(meta),pieces:clientP},drag:{p:0},carry:null,strip:{lift:null}},S:{me:{id:1}},puzzleWorkspace:c.puzzleWorkspace,pzPaintStrip:()=>{}});
 vm.runInContext(app.slice(app.indexOf('function pzHandle('),app.indexOf('function pzStatus(')),client);
 client.message={t:'tidy',tabled:true,catalogReady:true,table:{x0:-1000,y0:-1000,x1:2000,y1:2000},pieces:clientP.map(q=>[q.i,3000,3000])};vm.runInContext('pzHandle(message)',client);
 ok([0,1,2].every(i=>JSON.stringify(clientP[i])===JSON.stringify(initialClient[i])),'client protects entire active local group and locked piece');ok(clientP[3].x===3000&&!clientP[3].h,'authoritative Tidy supersedes a remote client-clock hold');ok(clientP[4].x===3000&&clientP[4].catalogReady&&!clientP[4].h&&!clientP[4].ht,'client applies eligible Tidy member and clears expired hold');
 client.message={t:'tidy',pieces:[],table:{x0:0,y0:0,x1:600,y1:400}};vm.runInContext('pzHandle(message)',client);ok(client.PZ.data.meta.table.x1===2000&&client.PZ.data.meta.table.x0===-1000,'late smaller extent cannot shrink reachable surface');
 // Regression: receipt time is not the server's hold-lease start time.
 // The remote grab arrives 200ms late. At server age15.1s the client age is14.9s.
 const clock={server:100000,client:100000},RealDate=Date;
 class ServerDate extends RealDate{static now(){return clock.server;}}
 class ClientDate extends RealDate{static now(){return clock.client;}}
 c.Date=ServerDate;const leasePieces=pieces(meta,4);leasePieces[0].x=800;leasePieces[0].y=800;leasePieces[1].x=900;leasePieces[1].y=800;
 const leaseServer=await room(meta,leasePieces),leaseClientP=clone(leasePieces),leaseClient=vm.createContext({Date:ClientDate,PZ:{data:{meta:clone(meta),pieces:leaseClientP},drag:null,carry:null,strip:{lift:null}},S:{me:{id:1}},puzzleWorkspace:c.puzzleWorkspace,pzPaintStrip:()=>{},pzRaise:()=>{}});
 vm.runInContext(app.slice(app.indexOf('function pzHandle('),app.indexOf('function pzStatus(')),leaseClient);
 const deliver=m=>{leaseClient.message=clone(m);vm.runInContext('pzHandle(message)',leaseClient);};
 leaseServer.r.handle({id:2,name:'Remote fixture'},{t:'grab',p:0});clock.client=clock.server+200;deliver(leaseServer.messages.at(-1));
 ok(leaseClientP[0].h===2&&leaseClientP[0].ht===100200,'remote receipt starts later local clock');
 clock.server=115100;clock.client=115100;ok(clock.client-leaseClientP[0].ht===14900,'client remote lease still appears unexpired');leaseServer.r.handle({id:1,name:'Fixture'},{t:'tidy'});deliver(leaseServer.messages.at(-1));
 ok(leaseServer.r.pieces[0].x!==800||leaseServer.r.pieces[0].y!==800,'server expired hold and tidied unconnected single');
 ok(leaseClientP.every((q,i)=>q.x===leaseServer.r.pieces[i].x&&q.y===leaseServer.r.pieces[i].y),'delayed-delivery client immediately matches authoritative coordinates');
 const leaseReconciliation={serverGrabAt:100000,clientReceivedGrabAt:100200,serverTidyAt:115100,clientObservedHoldAge:14900,serverPosition:[leaseServer.r.pieces[0].x,leaseServer.r.pieces[0].y],clientPosition:[leaseClientP[0].x,leaseClientP[0].y],immediateReconciliation:true};
 ok(leaseClientP[0].h===null&&leaseClientP[0].ht===null,'delayed-delivery single clears expired lease');
 // A currently valid remote lease is omitted by the server, so it is untouched.
 leaseServer.r.handle({id:2,name:'Remote fixture'},{t:'grab',p:2});clock.client=clock.server+200;deliver(leaseServer.messages.at(-1));const validRemote=clone(leaseClientP[2]);clock.server+=1000;clock.client=clock.server;leaseServer.r.handle({id:1,name:'Fixture'},{t:'tidy'});const leaseEvent=leaseServer.messages.at(-1);ok(!leaseEvent.pieces.some(q=>q[0]===2),'server excludes valid remote lease');deliver(leaseEvent);ok(JSON.stringify(leaseClientP[2])===JSON.stringify(validRemote),'client retains valid remote lease omitted from authoritative Tidy');
 // Local pointer/carry/lift state protects a whole group, without a clock guess.
 leaseClientP[1].g=leaseClientP[0].g;
 for(const mode of ['drag','carry','lift']){leaseClient.PZ.drag=null;leaseClient.PZ.carry=null;leaseClient.PZ.strip.lift=null;if(mode==='lift')leaseClient.PZ.strip.lift=0;else leaseClient.PZ[mode]={p:0};const before=clone(leaseClientP.slice(0,2));deliver({t:'tidy',tabled:true,pieces:[[0,9000,9000],[1,9100,9000]]});ok(JSON.stringify(leaseClientP.slice(0,2))===JSON.stringify(before),'active local '+mode+' preserves entire group');}
 c.Date=RealDate;
 // Exercise the real deferred storage writer, rather than only the synchronous fixture save.
 const persisted=await room(meta,pieces(meta)),timers=[];c.setTimeout=fn=>{timers.push(fn);return timers.length;};persisted.r.scheduleSave=()=>Room.prototype.scheduleSave.call(persisted.r);persisted.r.handle({id:1,name:'Fixture'},{t:'tidy'});ok(timers.length===1,'real deferred save scheduled once');timers.shift()();await Promise.resolve();const restarted=await room(persisted.store.meta,persisted.store.pieces);ok(JSON.stringify(restarted.r.pieces)===JSON.stringify(persisted.r.pieces),'actual storage writer persists final Tidy geometry');
 const receipt={at:new Date().toISOString(),checks,parsedScripts:parsed,cases,protocolCases,leaseReconciliation,liveMutations:0,publication:'held',limits:'Production functions and real Durable Object handlers/storage tested with fictional state; physical-phone acceptance separate'};fs.writeFileSync(path.join(base,'PUZZLE-WORKSTATION-REGRESSION.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
})().catch(e=>{console.error(e);process.exitCode=1});
