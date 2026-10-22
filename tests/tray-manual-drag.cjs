const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);
const prefix=fs.readFileSync('tests/puzzle-workstation.cjs','utf8').split('\n(async()=>{')[0]+'\nmodule.exports={c,room,pieces,clone,conflict};';
const mod=new Module(path.join(__dirname,'manual-drag-harness.cjs'));mod.filename=path.join(__dirname,'manual-drag-harness.cjs');mod.paths=module.paths;mod._compile(prefix,mod.filename);
const {c:server,room,pieces,clone,conflict}=mod.exports;
const app=fs.readFileSync('live/'+fs.readdirSync('live').find(f=>f.endsWith('-app.html')),'utf8');
const block=(a,b)=>app.slice(app.indexOf(a),app.indexOf(b,app.indexOf(a)));
let checks=0;const ok=(v,m)=>{assert(v,m);checks++},near=(a,b)=>Math.abs(a-b)<1e-8;
const alpha=new Uint8ClampedArray(86*86*4);for(let y=18;y<68;y++)for(let x=18;x<68;x++)alpha[(y*86+x)*4+3]=255;
const sprite={width:86,height:86,getContext:()=>({getImageData:()=>({data:alpha})})};
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});

async function fixture({width=390,height=844,dpr=2,zoom=1.6,trayZoom=1.5,joined=false,mode='ws',overlap=false,neighbor=false}={}){
 const meta={w:600,h:400,cols:12,rows:8},P=pieces(meta),id=20;
 for(const q of P){q.x=-1000+q.i*150;q.y=1200;q.onTable=false;}
 P[0].l=true;P[0].x=P[0].y=0;P[1].g=P[2].g=1;P[1].x=70;P[2].x=120;P[1].y=P[2].y=80;P[1].onTable=P[2].onTable=true;
 P[id].x=2000;P[id].y=1200;
 if(joined){P[21].g=id;P[21].x=2050;P[21].y=1200;}
 if(overlap){P[55].x=167;P[55].y=184;P[55].onTable=true;}
 if(neighbor){P[21].x=220;P[21].y=180;P[21].onTable=true;}
 const authoritative=await room(clone(meta),clone(P)),clientP=clone(P),commands=[],replies=[],captures=[],timers=[],toasts=[];
 const stripTop=height-190,boardRect=rect(11,84,width,stripTop-110),board={width:width*dpr,height:boardRect.height*dpr,getBoundingClientRect:()=>boardRect};
 const stripRect=rect(11,stripTop,width,0),events={};
 const strip={width:width*dpr,height:0,getBoundingClientRect:()=>stripRect,addEventListener:(type,fn)=>events[type]=fn,setPointerCapture:id=>captures.push(id)};
 const PZ={id:9001,data:{meta:clone(meta),pieces:clientP},geo:{pw:50,ph:50,off:18},sprites:true,trayZoom,dpr,view:{s:zoom*dpr,x:-40*dpr,y:-30*dpr},strip:{scroll:0,lift:null},drag:null,carry:null,mode,queue:[],lastMoveSent:0};
 let timerId=0;
 const accept=message=>{commands.push(clone(message));const reply=authoritative.r.handle({id:1,name:'Synthetic fixture'},message);if(reply)replies.push(clone(reply));return reply;};
 PZ.ws={readyState:1,send:raw=>accept(JSON.parse(raw))};
 const client=vm.createContext({PZ,PZ_STRIP_CELL:76,S:{me:{id:1},token:'synthetic'},Date,console,crypto:{randomUUID:()=> 'synthetic-session'},innerWidth:width,innerHeight:height,window:{visualViewport:null},document:{querySelectorAll:()=>[],elementFromPoint:()=>null},localStorage:{getItem:()=>null,setItem(){}},$:s=>s==='#pz-strip'?strip:s==='#pz-canvas'?board:null,pzSprite:()=>sprite,pzPaintStrip:()=>{},pzPaintTrays:()=>{},pzStatus:()=>{},pzToast:s=>toasts.push(s),pzResize:()=>{},pzTrayZoomHint:()=>{},pzHandle:m=>replies.push(clone(m)),setTimeout:fn=>{timers.push(fn);return ++timerId},fetch:async(url,options)=>{const acts=JSON.parse(options.body),out=[];for(const act of acts){const reply=accept(act);if(reply)out.push(reply);}return {ok:true,json:async()=>({replies:out})};},puzzleWorkspace:server.puzzleWorkspace,puzzleSettleExterior:server.puzzleSettleExterior,puzzleOnTable:server.puzzleOnTable,puzzlePieceBounds:server.puzzlePieceBounds});
 vm.runInContext(app.match(/function pzStripCell\([^\n]+/)[0],client);
 vm.runInContext(block('const PZ_STRIP_ALPHA=','function pzPaintStrip(){'),client);
 stripRect.height=client.pzSnugTrayHeight(500);stripRect.bottom=stripTop+stripRect.height;strip.height=Math.round(stripRect.height*dpr);
 vm.runInContext(block('function pzCanvasPoint(','function pzRaise('),client);
 vm.runInContext(block('function pzLocalSnap(','function pzBindPointer('),client);
 vm.runInContext(block('function pzReleaseAt(','// --- drawing ---'),client);
 vm.runInContext(block('function pzCancelHeldPiece(','function puzzleWorkspace('),client);
 vm.runInContext(block('function puzzleTrayDeploymentPlan(','function puzzleEdgeInventory('),client);
 vm.runInContext(app.match(/function pzTrayAt\([^\n]+/)[0],client);
 vm.runInContext(block('function pzSend(','function pzHandle('),client);
 client.pzPutInTray=(pc,tray)=>client.pzSend({t:'tray-return',p:pc.i});
 const seen=new Set(),catalog=clientP.filter(q=>!q.l&&!q.tray&&!q.onTable&&!seen.has(q.g)&&(seen.add(q.g),true));
 PZ.strip.renderPlans=client.pzStripRenderPlans(catalog,strip.height);
 const plan=PZ.strip.renderPlans.find(p=>p.pc.i===id);PZ.strip.scroll=plan.start;
 client.pzBindStrip();
 const event=(x,y,pointerId=7)=>({clientX:x,clientY:y,pointerId,preventDefault(){}});
 const pickup=(offset=[7.5,13.25])=>[stripRect.left+(plan.pad+(offset[0]-plan.b.x0)*plan.scale)*stripRect.width/strip.width,stripRect.top+(plan.top+(offset[1]-plan.b.y0)*plan.scale)*stripRect.height/strip.height];
 const boardPoint=(target,offset)=>[boardRect.left+((target[0]+offset[0])*PZ.view.s+PZ.view.x)*boardRect.width/board.width,boardRect.top+((target[1]+offset[1])*PZ.view.s+PZ.view.y)*boardRect.height/board.height];
 const flush=async()=>{while(timers.length){timers.shift()();await Promise.resolve();if(PZ.sendChain)await PZ.sendChain;}};
 return {client,PZ,meta,id,authoritative,commands,replies,captures,toasts,events,event,pickup,boardPoint,flush,stripRect,boardRect,initial:clone(P)};
}

(async()=>{
 const cases=[],wireExamples=[];
 for(const [width,height] of [[390,844],[768,1024]])for(const dpr of [1,2])for(const zoom of [.8,1.6])for(const trayZoom of [1,1.5,2.2])for(const joined of [false,true])for(const mode of ['ws','poll']){
  const f=await fixture({width,height,dpr,zoom,trayZoom,joined,mode,overlap:true}),offset=joined?[68,37.25]:[7.5,13.25],start=f.pickup(offset),view=JSON.stringify(f.PZ.view),fixed=JSON.stringify(f.initial.slice(0,3));
  f.events.pointerdown(f.event(...start));f.events.pointermove(f.event(start[0]+3,start[1]-3));
  ok(f.commands.length===0,'subthreshold pointer jitter is not a drag or deploy');
  const first=f.boardPoint([120,150],offset);f.events.pointermove(f.event(...first));
  ok(f.PZ.strip.lift===20&&f.captures.includes(7),'drag captures and lifts the actual tray ID');
  const final=f.boardPoint([167.25,183.5],offset);f.events.pointerup(f.event(...final));await f.flush();
  const drop=f.commands.findLast(m=>m.t==='drop');
  ok(!!drop&&!f.commands.some(m=>m.t==='deploy'),'manual drag sends normal drop, never the automatic chooser');
  ok(drop.p===20&&drop.x===167&&drop.y===184,'final pointer sample and off-center pickup convert exactly through pan/zoom/DPR');
  ok(!drop.staged,'manual interior overlap is not routed through automatic staging');
  const state=f.authoritative.r.pieces[20];ok(state.x===167&&state.y===184&&!state.l,'server honors chosen interior coordinates without automatic solving');
  ok(f.authoritative.r.pieces[55].x===167&&f.authoritative.r.pieces[55].y===184,'temporary interior overlap is allowed without moving its obstacle');
  ok(JSON.stringify(f.authoritative.r.pieces.slice(0,3))===fixed,'unrelated joined and placed pieces stay exact');
  ok(JSON.stringify(f.PZ.view)===view,'drag never pans or zooms the board');
  ok(f.PZ.strip.lift===null&&f.PZ.carry===null,'drop clears the local held state');
  if(joined)ok(near(f.authoritative.r.pieces[21].x-state.x,50)&&near(f.authoritative.r.pieces[21].y,state.y),'off-center pickup on a joined member preserves whole group offsets');
  cases.push({width,height,dpr,zoom,trayZoom,joined,mode,requested:[167.25,183.5],server:[state.x,state.y],pickupOffset:offset});
  if(width===390&&dpr===2&&zoom===1.6&&trayZoom===1.5&&!joined)wireExamples.push({mode,requested:[167.25,183.5],server:[state.x,state.y],commands:clone(f.commands)});
 }
 // Taps keep the existing automatic in-board deployment route. Horizontal
 // scrolling, cancellation and pinch capture never become an accidental drop.
 for(const [width,height] of [[390,844],[768,1024]]){
  const tap=await fixture({width,height}),start=tap.pickup();tap.events.pointerdown(tap.event(...start));tap.events.pointermove(tap.event(start[0]+4,start[1]-3));tap.events.pointerup(tap.event(start[0]+4,start[1]-3));await tap.flush();
  ok(tap.commands.length===1&&tap.commands[0].t==='deploy','tap with jitter retains automatic deployment');ok(!tap.authoritative.r.pieces[20].l&&tap.authoritative.r.pieces[20].onTable,'tap does not auto-solve');
  const scroll=await fixture({width,height}),s=scroll.pickup();scroll.events.pointerdown(scroll.event(...s));scroll.events.pointermove(scroll.event(s[0]+14,s[1]+2));scroll.events.pointerup(scroll.event(s[0]+14,s[1]+2));await scroll.flush();ok(scroll.commands.length===0,'horizontal scroll never places a piece');
  const cancel=await fixture({width,height}),p=cancel.pickup();cancel.events.pointerdown(cancel.event(...p));cancel.events.pointermove(cancel.event(...cancel.boardPoint([180,170],[7.5,13.25])));cancel.events.pointercancel(cancel.event(...p));await cancel.flush();ok(cancel.PZ.strip.lift===null&&!cancel.commands.some(m=>m.t==='drop'||m.t==='deploy'),'pointer cancel releases without automatic placement');
  const pinch=await fixture({width,height}),a=pinch.pickup();pinch.events.pointerdown(pinch.event(...a));pinch.events.pointerdown(pinch.event(a[0]+70,a[1],8));pinch.events.pointermove(pinch.event(a[0]+100,a[1],8));pinch.events.pointerup(pinch.event(...a));pinch.events.pointerup(pinch.event(a[0]+100,a[1],8));await pinch.flush();ok(pinch.PZ.trayZoom>1.5&&!pinch.commands.length,'two-pointer pinch only changes the accepted tray zoom');
  const flick=await fixture({width,height}),f=flick.pickup();flick.events.pointerdown(flick.event(...f));flick.events.pointerup(flick.event(f[0]+20,f[1]+2));await flick.flush();ok(!flick.commands.length,'coalesced horizontal flick is not mistaken for a tap');
  for(const [dy,lifts] of [[18,false],[18.01,true]]){const t=await fixture({width,height}),p=t.pickup([25,25]);t.events.pointerdown(t.event(...p));t.events.pointermove(t.event(p[0],p[1]-dy));ok((t.PZ.strip.lift===20)===lifts,'vertical 18px threshold is respected at '+dy);t.events.pointercancel(t.event(...p));await t.flush();}
  for(const [dx,scrolls] of [[8,false],[8.01,true]]){const t=await fixture({width,height}),p=t.pickup([25,25]);t.events.pointerdown(t.event(...p));t.events.pointermove(t.event(p[0]+dx,p[1]));t.events.pointerup(t.event(p[0]+dx,p[1]));await t.flush();ok((t.commands.length===0)===scrolls,'horizontal 8px threshold distinguishes scroll from tap at '+dx);}
  for(const mode of ['ws','poll'])for(const joined of [false,true]){const fast=await fixture({width,height,mode,joined}),offset=joined?[68,37.25]:[7.5,13.25],s=fast.pickup(offset);fast.events.pointerdown(fast.event(...s));fast.events.pointerup(fast.event(...fast.boardPoint([167.25,183.5],offset)));await fast.flush();const d=fast.commands.find(m=>m.t==='drop');ok(d?.x===167&&d?.y===184&&!fast.commands.some(m=>m.t==='deploy'),'release sample classifies a fast drag even when move events were coalesced');}
 }
 // Near a legitimate solution point, keep the normal threshold. Beyond that
 // threshold, neither the client nor server seeks a solution automatically.
 for(const [dx,locks] of [[14,true],[16,false]]){
  const f=await fixture({width:768,height:1024}),offset=[7.5,13.25],start=f.pickup(offset);f.events.pointerdown(f.event(...start));const end=f.boardPoint([400+dx,50],offset);f.events.pointermove(f.event(...end));f.events.pointerup(f.event(...end));await f.flush();ok(f.authoritative.r.pieces[20].l===locks,'normal 15-unit snap threshold retained at '+dx);ok(f.authoritative.r.pieces.filter(p=>p.l).length===(locks?2:1),'manual drop cannot solve unrelated puzzle pieces');
 }
 const join=await fixture({neighbor:true}),offset=[7.5,13.25],a=join.pickup(offset);join.events.pointerdown(join.event(...a));const end=join.boardPoint([184,180],offset);join.events.pointermove(join.event(...end));join.events.pointerup(join.event(...end));await join.flush();ok(join.authoritative.r.pieces[20].g===join.authoritative.r.pieces[21].g&&join.authoritative.r.pieces[20].x===170,'legitimate adjacent-piece join still uses the normal threshold');
 const outside=await fixture();outside.PZ.view.x=320*outside.PZ.dpr;outside.authoritative.r.pieces[55].x=outside.PZ.data.pieces[55].x=-200;outside.authoritative.r.pieces[55].y=outside.PZ.data.pieces[55].y=100;outside.authoritative.r.pieces[55].onTable=outside.PZ.data.pieces[55].onTable=true;
 const x=outside.pickup(offset);outside.events.pointerdown(outside.event(...x));const q=outside.boardPoint([-200,100],offset);outside.events.pointermove(outside.event(...q));outside.events.pointerup(outside.event(...q));await outside.flush();
 ok(!conflict(outside.meta,outside.authoritative.r.pieces[20],outside.authoritative.r.pieces[55]),'settled exterior overlap is still resolved');ok(outside.authoritative.r.pieces[55].x===-200&&outside.authoritative.r.pieces[55].y===100,'exterior obstacle never moves');
 const result={status:'PASS',checks,cases:cases.length,configurations:cases,wireExamples,workerChanged:false,coverage:'actual pointer capture/thresholds, off-center single/joined pickup, phone/tablet pan/zoom/DPR, WS and poll serialization to actual DO handler, final-sample coordinates, tap/scroll/cancel/pinch, interior overlap, normal snap/join and exterior collision'};
 fs.writeFileSync('artifacts/TRAY-MANUAL-DRAG-RECEIPT.json',JSON.stringify(result,null,2));console.log({...result,configurations:undefined});
})().catch(e=>{console.error(e.stack);process.exitCode=1});
