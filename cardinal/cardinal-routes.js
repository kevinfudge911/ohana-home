/* Decorative route planning only; no application state mutations or requests. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.OhanaCardinalRoutes=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function intersects(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function index(rects){const buckets=new Map(),cell=80;for(const r of rects){if(![r.x,r.y,r.w,r.h].every(Number.isFinite)||r.w<=0||r.h<=0)continue;for(let x=Math.floor(r.x/cell);x<=Math.floor((r.x+r.w)/cell);x++)for(let y=Math.floor(r.y/cell);y<=Math.floor((r.y+r.h)/cell);y++){const key=x+','+y;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(r);}}
 return box=>{for(let x=Math.floor(box.x/cell);x<=Math.floor((box.x+box.w)/cell);x++)for(let y=Math.floor(box.y/cell);y<=Math.floor((box.y+box.h)/cell);y++)for(const r of buckets.get(x+','+y)||[])if(intersects(box,r))return true;return false;};}
function hull(api,scale,facings=[-1,1]){const boxes=[];for(const pitch of [-.44,0,.44])for(const facing of facings)for(const wing of [-1,0,1])for(const landing of [0,1])boxes.push(api.bounds({x:0,y:0,scale,pitch,facing,wing,landing,phase:'flight',launch:1,flightTime:0}));const x=Math.min(...boxes.map(b=>b.x))-4,y=Math.min(...boxes.map(b=>b.y))-4;return{x,y,w:Math.max(...boxes.map(b=>b.x+b.w))+4-x,h:Math.max(...boxes.map(b=>b.y+b.h))+4-y};}
function shifted(p,h){return{x:p.x+h.x,y:p.y+h.y,w:h.w,h:h.h};}
function inView(b,w,h){return b.x>=1&&b.y>=1&&b.x+b.w<=w-1&&b.y+b.h<=h-1;}
function* gridSteps(c,api,scale){let checks=0;const hit=index(c.obstacles),guard=hull(api,scale,[-.34,.34]),wideGuard=hull(api,scale),step=40,nodes=[];for(let y=Math.ceil(-guard.y+3);y<c.height-guard.y-guard.h-3;y+=step)for(let x=Math.ceil(-guard.x+3);x<c.width-guard.x-guard.w-3;x+=step){const p={x,y};if(!hit(shifted(p,guard)))nodes.push(p);if(++checks%32===0)yield;}return{nodes,hit,guard,wideGuard,step,lookup:new Map(nodes.map((p,i)=>[p.x+','+p.y,i]))};}
function lineClear(a,b,g,c){const guard=Math.abs(b.y-a.y)>Math.abs(b.x-a.x)*2?g.guard:g.wideGuard;const count=Math.ceil(distance(a,b)/12);for(let i=1;i<count;i++){const p={x:a.x+(b.x-a.x)*i/count,y:a.y+(b.y-a.y)*i/count},r=shifted(p,guard);if(!inView(r,c.width,c.height)||g.hit(r))return false;}return true;}
function* searchSteps(a,b,g,c,rng){
 const nearest=p=>g.nodes.map((v,i)=>({i,d:distance(v,p)})).sort((x,y)=>x.d-y.d).slice(0,3).map(x=>x.i),starts=nearest(a),ends=new Set(nearest(b));if(!starts.length||!ends.size)return null;
 const seen=new Set(starts),parent=new Map(),queue=starts.slice();let goal=null;
 for(let n=0;n<queue.length;n++){if(n%8===0)yield;const i=queue[n];if(ends.has(i)){goal=i;break;}const neighbors=[];for(const dx of [-g.step,0,g.step])for(const dy of [-g.step,0,g.step]){if(!dx&&!dy)continue;const j=g.lookup.get((g.nodes[i].x+dx)+','+(g.nodes[i].y+dy));if(j!==undefined&&!seen.has(j))neighbors.push(j);}neighbors.sort((i,j)=>distance(g.nodes[i],b)-distance(g.nodes[j],b)+(rng()-.5)*25);for(const j of neighbors)if(lineClear(g.nodes[i],g.nodes[j],g,c)){seen.add(j);parent.set(j,i);queue.push(j);}}
 if(goal===null)return null;const points=[];for(let i=goal;i!==undefined;i=parent.get(i))points.unshift(g.nodes[i]);points.unshift(a);points.push(b);
 // Remove straight grid runs, retaining turns. The renderer eases the final curve.
 const reduced=[points[0]];for(let i=1;i<points.length-1;i++){const u=points[i-1],v=points[i],w=points[i+1];if(Math.abs((v.x-u.x)*(w.y-v.y)-(v.y-u.y)*(w.x-v.x))>1)reduced.push(v);}reduced.push(points.at(-1));return reduced;
}
function leg(points,start,label,destination){const length=points.slice(1).reduce((n,p,i)=>n+distance(points[i],p),0),duration=clamp(length/135+2,3.5,11);return{points,start,duration,end:start+duration,label,destination};}
function depths(points,a,b){return points.map((p,i)=>{const t=i/(points.length-1);return{x:p.x,y:p.y,z:i===0?a.z:i===points.length-1?b.z:(a.z+(b.z-a.z)*t)/1.22};});}
function unchangedHome(p,home){return p.phase==='rest'&&p.x===home.x&&p.y===home.y&&Math.abs(p.scale-.72/home.z)<1e-9&&(p.facing===undefined||p.facing===1)&&!p.pitch;}
function* safePlanSteps(legs,c,api,hit){if(legs.visibleTour)return yield*visibleSafetySteps(legs,c,api);let previous=null,previousUnchanged=false,samples=0,envelope=null,fullyVisible=0;const edge=legs[0]?.edgeVisit;delete legs.envelope;const end=edge?.end||legs.at(-1).end;for(let t=0;t<=end+.011;t+=.01){if(++samples%8===0)yield;const p=api.pose(t,'bridge',0,legs);if(edge&&(p.maskedPerch||p.visible===false)){if(p.maskedPerch&&(p.x!==c.home.x||p.y!==c.home.y||p.scale!==.72/c.home.z))return false;previous=null;previousUnchanged=false;const next=legs.find(leg=>leg.start>t+.000001);t=(next?next.start:edge.end)-.01;continue;}const b=api.bounds(p),unchanged=unchangedHome(p,c.home);if(legs.visibleTour){const v=c.viewport||{x:0,y:0,width:c.width,height:c.height};if(b.x<v.x+1||b.y<v.y+1||b.x+b.w>v.x+v.width-1||b.y+b.h>v.y+v.height-1)return false;}if(p.foregroundPass){previous=null;previousUnchanged=false;continue;}if(edge&&unchanged){previous=null;previousUnchanged=true;continue;}if(edge&&p.phase!=='rest'&&inView(b,c.width,c.height))fullyVisible++;if(!edge&&!inView(b,c.width,c.height)||!unchanged&&hit(b))return false;const e={x:b.x-2,y:b.y-2,w:b.w+4,h:b.h+4};if(!envelope)envelope=e;else{const x=Math.min(envelope.x,e.x),y=Math.min(envelope.y,e.y);envelope={x,y,w:Math.max(envelope.x+envelope.w,e.x+e.w)-x,h:Math.max(envelope.y+envelope.h,e.y+e.h)-y};}
 if(previous&&!(unchanged&&previousUnchanged)){const sweep={x:Math.min(previous.x,b.x)-2,y:Math.min(previous.y,b.y)-2,w:Math.max(previous.x+previous.w,b.x+b.w)-Math.min(previous.x,b.x)+4,h:Math.max(previous.y+previous.h,b.y+b.h)-Math.min(previous.y,b.y)+4};if(hit(sweep))return false;}previous=b;previousUnchanged=unchanged;}if(edge&&fullyVisible<35)return false;legs.envelope=envelope;return true;}
function* foregroundSteps(c,api,recent,rng){
 // The dock can separate a valid home perch from the interior air grid.
 // Stay in its actual clear foreground band rather than jumping through controls.
 const home=c.home,direction=home.x>c.width/2?-1:1,hit=index(c.obstacles),unit=Math.min(1000,c.width),reaches=[.18,.26,.34,.44].map(v=>unit*(v+(rng()-.5)*.025));
 for(const factor of [1.22,1.15,1.1])for(const lift of [8,16,24,4])for(const reach of reaches){
  const z=home.z/factor,points=[home,{x:home.x+direction*reach*.25,y:home.y-lift*.7,z},{x:home.x+direction*reach*.8,y:home.y-lift,z},{x:home.x+direction*reach,y:home.y-lift*.85,z},{x:home.x+direction*reach*.8,y:home.y-lift*.7,z},{x:home.x+direction*reach*.25,y:home.y-lift*.4,z},home];
  const key=c.screen+':foreground:'+factor+':'+lift+':'+Math.round(reach/16),legs=[leg(points,.25,'A quiet flight through the clear foreground','the original perch')];if(recent.some(v=>v.key===key))continue;
  if(yield* safePlanSteps(legs,c,api,hit))return{plan:legs,key,kind:'foreground-flight',scaleFactor:factor,reason:null};
 }
 // A short lift before turning keeps the wings clear of the lower edge and dock.
 for(const factor of [1.15,1.1,1.22])for(const lift of [20,24,40,16,64])for(const reach of [35,50,80,120]){
  const z=home.z/factor,p=(x,y)=>({x:home.x+direction*x,y:home.y-y,z}),points=[home,p(reach*.15,lift),p(reach,lift),p(reach*.5,lift),p(0,lift),home],key=c.screen+':lift:'+factor+':'+lift+':'+reach,legs=[leg(points,.25,'Lifting into clear room air','the original perch')];if(recent.some(v=>v.key===key))continue;if(yield*safePlanSteps(legs,c,api,hit))return{plan:legs,key,kind:'lifted-foreground-flight',scaleFactor:factor,reason:null};
 }
 // Compact foreground excursions retain a recognizably larger bird (5-8%).
 // These exact trajectories are checked with the same full wing/sweep guards.
 for(const reach of [...new Set([Math.min(300,c.width*.3),Math.min(200,c.width*.2),80,40])])for(const factor of [1.08,1.05])for(const lift of [6,10,14,18,24])for(const shape of [0,1]){
  const z=home.z/factor,p=(x,y)=>({x:home.x+direction*x,y:home.y-y,z}),points=shape?[home,p(reach*.15,lift),p(reach,lift),p(reach*.5,lift),p(0,lift),home]:[home,p(reach*.25,lift*.7),p(reach*.8,lift),p(reach,lift*.85),p(reach*.8,lift*.7),p(reach*.25,lift*.4),home],key=c.screen+':compact:'+factor+':'+lift+':'+Math.round(reach)+':'+shape,legs=[{points,start:.25,duration:3.5,end:3.75,label:'A brief flight through the clear foreground',destination:'the original perch'}];if(recent.some(v=>v.key===key))continue;if(yield*safePlanSteps(legs,c,api,hit))return{plan:legs,key,kind:'compact-foreground-flight',scaleFactor:factor,reason:null};
 }return null;
}
function* edgeSteps(c,api,recent,rng){
 if(c.obstacles.some(o=>o.x<=0&&o.y<=0&&o.x+o.w>=c.width&&o.y+o.h>=c.height))return{plan:null,reason:'fully-obstructed'};const rows=Array.from({length:Math.max(0,Math.ceil((c.height-35)/5))},(_,i)=>35+i*5);for(let i=rows.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}const hit=index(c.obstacles),home=c.home,scales=[...new Set([clamp(.72/home.z*1.1,.18,.45),.28,.22,.18])],make=(points,duration,style,key)=>{const start=.65+clamp(distance(home,points[0])/180,1.2,6),leg={points,start,duration,end:start+duration,label:'A flight through clear room air',destination:'the room edge',flightStyle:style},revealStart=leg.end+clamp(distance(points.at(-1),home)/180,1.2,6),meta={home,tuckStart:.1,tuckEnd:.65,revealStart,end:revealStart+.6};leg.edgeVisit=meta;return{legs:[leg],key};};
 for(const scale of scales)for(const direction of rng()<.5?[1,-1]:[-1,1])for(const y of rows){yield;const z=.72/scale,xs=direction>0?[-120,c.width*.3,c.width*.7,c.width+120]:[c.width+120,c.width*.7,c.width*.3,-120],key=c.screen+':edge-glide:'+scale+':'+direction+':'+Math.round(y/24);if(recent.some(v=>v.key===key))continue;const a=make(xs.map(x=>({x,y,z})),clamp((c.width+240)/180,3.5,8),'glide',key);if(yield*safePlanSteps(a.legs,c,api,hit))return{plan:a.legs,key,kind:'edge-glide',reason:null};}
 for(const glide of [false,true])for(const scale of scales)for(const side of [1,-1])for(let y=80;y<c.height-30;y+=15)for(const reach of [60,80,110,150])for(const dy of [-30,30,-60,60]){yield;const z=.72/scale,x=side>0?c.width+120:-120,inside=side>0?c.width-25:25,turn=side>0?c.width-reach:reach,points=[{x,y,z},{x:inside,y,z},{x:turn,y:y+dy,z},{x:inside,y:y+2*dy,z},{x,y:y+2*dy,z}],key=c.screen+':edge-arc:'+scale+':'+side+':'+y+':'+reach+':'+dy+':'+glide;if(recent.some(v=>v.key===key))continue;const a=make(points,4,glide?'glide':'flap',key);if(yield*safePlanSteps(a.legs,c,api,hit))return{plan:a.legs,key,kind:'edge-arc',reason:null};}
 return{plan:null,reason:'no-verified-edge-route'};
}
function* closePassSteps(c,api,recent,rng){
 // Approach and recede along a 3-D path: scale follows depth, not a pulse.
 // Try only a bounded set of clear corridors; essential content stays guarded.
 const home=c.home,hit=index(c.obstacles),nearScale=clamp(c.width/590,.9,1.5),farZ=.72/.28;
 for(const direction of rng()<.5?[1,-1]:[-1,1])for(const row of [.32,.48,.65,.22]){
  yield;const y=c.height*row,xs=direction>0?[-200,c.width*.25,c.width*.5,c.width*.75,c.width+200]:[c.width+200,c.width*.75,c.width*.5,c.width*.25,-200],zs=[farZ,1.2,.72/nearScale,1.2,farZ],points=xs.map((x,i)=>({x,y:y+(i===2?30:0),z:zs[i]})),start=.65+clamp(distance(home,points[0])/180,1.2,6),duration=7.5,leg={points,start,duration,end:start+duration,label:'Approaching the window, then receding into the room',destination:'the room edge'},revealStart=leg.end+clamp(distance(points.at(-1),home)/180,1.2,6),legs=[leg],key=c.screen+':close-pass:'+direction+':'+row;
  leg.edgeVisit={home,tuckStart:.1,tuckEnd:.65,revealStart,end:revealStart+.6};
  if(!recent.some(p=>p.key===key)&&(yield*safePlanSteps(legs,c,api,hit)))return{plan:legs,key,kind:'perspective-close-pass',reason:null};
 }return null;
}
function* visibleSafetySteps(legs,c,api){
 const v=c.viewport||{x:0,y:0,width:c.width,height:c.height},runs=new Map();let samples=0,maxNormalOverlap=0,maxCloseOverlap=0;for(let t=0;t<=legs.at(-1).end+.01;t+=.01){if(++samples%8===0)yield;const p=api.pose(t,'bridge',0,legs),b=api.bounds(p);if(p.visible===false||p.maskedPerch||b.x<v.x+1||b.y<v.y+1||b.x+b.w>v.x+v.width-1||b.y+b.h>v.y+v.height-1)return false;
  for(let i=0;i<c.obstacles.length;i++){const hit=intersects(b,c.obstacles[i]);if(!hit){runs.delete(i);continue;}if(p.phase==='rest'&&!unchangedHome(p,c.home))return false;if(unchangedHome(p,c.home))continue;const old=runs.get(i)||{time:0,close:false};old.time+=.01;old.close=old.close||p.foregroundPass;runs.set(i,old);if(old.close)maxCloseOverlap=Math.max(maxCloseOverlap,old.time);else maxNormalOverlap=Math.max(maxNormalOverlap,old.time);if(old.time>(old.close?3.2:.95))return false;}
 }legs.envelope={x:v.x,y:v.y,w:v.width,h:v.height};legs.visibilityProof={samples,maxNormalOverlap,maxCloseOverlap,hiddenSeconds:0};return true;
}
function* visibleAirSteps(c,api,recent,rng){
 const v=c.viewport||{x:0,y:0,width:c.width,height:c.height},home=c.home,near=clamp(Math.min(v.width/590,v.height/500),.55,1.1),zNear=.72/near,point=(x,y,z)=>({x:v.x+x*v.width,y:v.y+y*v.height,z});
 for(const shape of [0,1,2,3].sort(()=>rng()-.5))for(const mirror of rng()<.5?[false,true]:[true,false])for(const duration of [12,14,16]){
  yield;const key=c.screen+':visible-air:'+shape+':'+Number(mirror);if(recent.some(p=>p.key===key))continue;
  const x=t=>mirror?1-t:t,A=point(x(.18),.30,2.6),B=point(x(.80),.31,2.6),N=point(x(.54),.56,zNear),C=point(x(.23),.67,2.2),D=point(x(.78),.64,2.2),lift={x:home.x,y:Math.max(v.y+90,home.y-Math.min(75,v.height*.2)),z:home.z/1.05};
  const banks=[[A,B,N,C],[B,C,N,A,D],[A,N,B,C,D],[B,A,C,N]][shape],legs=[{points:[home,lift,...banks,lift,home],start:.15,duration,end:.15+duration,label:'Banking through the room, approaching and receding',destination:'the original perch',foregroundPass:true}];legs.visibleTour=true;
  if(yield*visibleSafetySteps(legs,c,api))return{plan:legs,key,kind:'visible-air-tour',reason:null};
 }return{plan:null,reason:'no-visible-tour-within-protected-content-limits'};
}
function* visibleTourSteps(c,api,recent,rng){
 const home=c.home,v=c.viewport||{x:0,y:0,width:c.width,height:c.height},hit=index(c.obstacles),clear=(p,facing)=>!hit(api.bounds({...p,scale:.72/p.z,phase:'rest',facing})),supports=c.perches.filter(p=>c.width>=600||p.y<v.y+v.height*(c.screen==='game:ohana10'?.62:.86)),firsts=supports.filter(p=>p.y<v.y+v.height*(c.screen==='game:ohana10'?.66:.86)&&clear(p,-1)).sort((a,b)=>(['card-border','piece-border'].includes(b.kind)?1:0)-(['card-border','piece-border'].includes(a.kind)?1:0)+(rng()-.5)),seconds=supports.filter(p=>clear(p,1)).sort((a,b)=>(b.kind==='visible-table-rim')-(a.kind==='visible-table-rim')+(['card-border','piece-border'].includes(b.kind)?1:0)-(['card-border','piece-border'].includes(a.kind)?1:0)+(rng()-.5));
 for(const first of firsts.slice(0,8))for(const second of seconds.filter(p=>distance(p,first)>Math.min(c.width,c.height)*(c.screen==='game:shuffle'?.26:.3)&&(c.screen!=='game:ohana10'||Math.abs(p.y-first.y)>v.height*.18)).slice(0,6))for(const candidateVariant of c.width<600?[0,1,2,3].sort(()=>rng()-.5):[null]){
  yield;const variant=candidateVariant===null?Math.floor(rng()*4):candidateVariant,key=c.screen+':visible:'+Math.round(first.x/20)+','+Math.round(first.y/20)+':'+Math.round(second.x/20)+','+Math.round(second.y/20)+':'+variant;if(recent.some(p=>p.key===key))continue;
  const high={x:v.x+v.width*(variant%2?.84:.18),y:v.y+v.height*(.25+variant*.025),z:2.6},lift={x:home.x,y:home.y-75,z:home.z/1.05},out=[home,lift,high,first],a=leg(out,.15,'Taking visible flight from the original perch','a clear card border');a.duration=clamp(out.slice(1).reduce((n,p,i)=>n+distance(p,out[i]),0)/(c.screen==='game:ohana10'?190:230)+(c.screen==='game:ohana10'?1:.1),3.5,8);a.end=a.start+a.duration;
  const dwellA=(c.screen==='game:ohana10'?1.4:2)+rng()*.8,dwellB=(c.screen==='game:ohana10'?1.4:2)+rng()*.8,start=a.end+dwellA,close=rng()<.5,near=clamp(c.width/590,.9,1.4),center={x:v.x+v.width*.57,y:!close&&c.width<600?Math.max(v.y+95,Math.min(first.y,second.y)-65):v.y+v.height*.51,z:close?.72/near:2.3},middle=[first,{x:v.x+v.width*.20,y:v.y+v.height*.32,z:2.5},center,second],b={points:middle,start,duration:close?(c.screen==='game:ohana10'?3.4:5.5):5,end:start+(close?(c.screen==='game:ohana10'?3.4:5.5):5),label:close?'Approaching the window, then landing on a second border':'Flying around the room to a second border',destination:'a second clear border',foregroundPass:close};
  const back=[second,{x:home.x,y:home.y-90,z:home.z/1.06},home],last=leg(back,b.end+dwellB,'Returning visibly to the original perch','the original perch');last.duration=clamp(back.slice(1).reduce((n,p,i)=>n+distance(p,back[i]),0)/230+.35,1.35,6);last.end=last.start+last.duration;const legs=[a,b,last];if(['game:shuffle','game:spades'].includes(c.screen)){a.foregroundPass=true;last.foregroundPass=true;}legs.visibleTour=true;
  if(last.end<=29.75&&(yield*visibleSafetySteps(legs,c,api)))return{plan:legs,key,kind:close?'visible-multi-stop-close-pass':'visible-multi-stop',reason:null};
 }
 return yield*visibleAirSteps(c,api,recent,rng);
}
function* chooseSteps(c,api,recent,rng=Math.random){
 if(['game:ohana10','game:handfoot','game:words','puzzle','game:shuffle','game:spades'].includes(c.screen))return yield*visibleTourSteps(c,api,recent,rng);
 if(rng()<.24){const near=yield*closePassSteps(c,api,recent,rng);if(near)return near;}
 const home=c.home,rest=api.bounds({...home,scale:.72/home.z,phase:'rest',facing:1}),near={x:rest.x-2,y:rest.y-2,w:rest.w+4,h:rest.h+4};if(index(c.obstacles)(near))return yield*edgeSteps(c,api,recent,rng);const homeScale=.72/home.z,scale=clamp(homeScale*1.22,.18,.6),g=yield* gridSteps(c,api,scale);if(!g.nodes.length||Math.min(...g.nodes.map(p=>distance(p,home)))>Math.max(100,homeScale*300)){const clear=yield* foregroundSteps(c,api,recent,rng);if(clear)return clear;}if(!g.nodes.length)return yield*edgeSteps(c,api,recent,rng);
 const targets=[...c.perches.map(p=>({...p,land:true})),...g.nodes.filter(p=>distance(p,home)>Math.min(c.width,c.height)*.25).sort(()=>rng()-.5).slice(0,12).map(p=>({...p,z:.72/scale,land:false,kind:'air-arc'}))];
 for(const target of targets){if(!(target.x>0&&target.y>0&&target.x<c.width&&target.y<c.height))continue;const outbound=yield* searchSteps(home,target,g,c,rng),inbound=yield* searchSteps(target,home,g,c,rng);if(!outbound||!inbound)continue;
 const key=c.screen+':'+target.kind+':'+outbound.map(p=>Math.round(p.x/48)+','+Math.round(p.y/48)).join(';')+':'+inbound.map(p=>Math.round(p.x/48)+','+Math.round(p.y/48)).join(';');if(recent.some(v=>v.key===key))continue;
 let legs;if(target.land){
  // A journey may visit two distinct verified room perches before its flag home.
  // Keep it inside the renderer's existing duration and full swept-wing guards.
  for(const second of c.perches.filter(p=>distance(p,target)>80&&distance(p,home)>40).sort(()=>rng()-.5).slice(0,4)){
   const across=yield*searchSteps(target,second,g,c,rng),returning=yield*searchSteps(second,home,g,c,rng);if(!across||!returning)continue;
   const a=leg(depths(outbound,home,target),.25,'Approaching a clear '+target.kind,'a clear '+target.kind),b=leg(depths(across,target,second),a.end+1+rng()*1.8,'Visiting another clear perch','another clear '+second.kind),back=leg(depths(returning,second,home),b.end+1+rng()*1.8,'Returning to the original perch','the original perch'),multi=[a,b,back],multiKey=key+':via:'+Math.round(second.x/24)+','+Math.round(second.y/24);
   if(back.end<=29.75&&!recent.some(v=>v.key===multiKey)&&(yield*safePlanSteps(multi,c,api,g.hit)))return{plan:multi,key:multiKey,kind:'multi-perch',reason:null};
  }
  const first=leg(depths(outbound,home,target),.25,'Approaching a clear '+target.kind,'a clear '+target.kind),back=leg(depths(inbound,target,home),first.end+2+rng()*2,'Returning to the original perch','the original perch');legs=[first,back];}else{const points=[...outbound,...inbound.slice(1)],all=depths(points,home,home);legs=[leg(all,.25,'A quiet flight through the room','the original perch')];}
 if(yield* safePlanSteps(legs,c,api,g.hit))return{plan:legs,key,kind:target.kind,reason:null};
 }return (yield* foregroundSteps(c,api,recent,rng))||(yield*edgeSteps(c,api,recent,rng));
}
function drain(iterator){let step;do{step=iterator.next();}while(!step.done);return step.value;}
function safePlan(...args){return drain(safePlanSteps(...args));}
function foreground(...args){return drain(foregroundSteps(...args));}
function choose(...args){return drain(chooseSteps(...args));}
function createTask(iterator){
 let done=false,cancelled=false,value=null;
 return{advance({budgetMs=3,maxSteps=32,clock=()=>performance.now()}={}){const start=clock();let units=0;if(!done&&!cancelled)do{const step=iterator.next();units++;if(step.done){done=true;value=step.value;break;}}while(units<maxSteps&&clock()-start<budgetMs);return{done:done||cancelled,cancelled,value,sliceMs:clock()-start,units};},cancel(){if(!done&&!cancelled){cancelled=true;iterator.return();}}};
}

function createPlanner(c,api,recent,rng=Math.random){return createTask(chooseSteps(c,api,recent,rng));}
return{visibleSafetySteps,visibleTourSteps,visibleAirSteps,closePassSteps,safePlanSteps,edgeSteps,intersects,index,hull,inView,safePlan,choose,unchangedHome,foreground,createPlanner,createTask};
});
