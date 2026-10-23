/* Kevin's optional decorative visits. No account, game, message or audio writes. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.OhanaCardinalVisits=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const W=1536,H=1024,AW=384,AH=256,KEY='ohana_cardinal_visits_v1';
function axis(value,free){
 value=value.trim();if(value==='center')return free/2;if(value==='left'||value==='top')return 0;if(value==='right'||value==='bottom')return free;
 if(/^-?[\d.]+%$/.test(value))return free*parseFloat(value)/100;if(/^-?[\d.]+px$/.test(value))return parseFloat(value);
 const m=/^calc\(\s*(-?[\d.]+)%\s*([+-])\s*([\d.]+)px\s*\)$/.exec(value);if(m)return free*Number(m[1])/100+(m[2]==='-'?-1:1)*Number(m[3]);return NaN;
}
function tokens(value){return value.match(/calc\([^)]*\)|[^\s]+/g)||[];}
function imageRect(box,size,position,iw,ih){
 if(!box||!(box.width>0&&box.height>0))return null;let width,height;
 if(size==='cover'||size==='contain'){const scale=Math[size==='cover'?'max':'min'](box.width/iw,box.height/ih);width=iw*scale;height=ih*scale;}
 else{const p=tokens(size);if(p.length!==2)return null;const dimension=(v,total)=>v==='auto'?null:axis(v,total);width=dimension(p[0],box.width);height=dimension(p[1],box.height);if(width===null&&Number.isFinite(height))width=height*iw/ih;else if(height===null&&Number.isFinite(width))height=width*ih/iw;else if(width===null&&height===null){width=iw;height=ih;}}
 if(!(width>0&&height>0)||Math.abs(width/iw-height/ih)>.002)return null;
 const p=tokens(position);if(p.length!==2)return null;const x=box.left+axis(p[0],box.width-width),y=box.top+axis(p[1],box.height-height);
 return Number.isFinite(x)&&Number.isFinite(y)?{x,y,width,height,scale:width/iw}:null;
}
function toRoom(b,map,pad=0){return{x:(b.left-pad-map.x)/map.scale,y:(b.top-pad-map.y)/map.scale,w:(b.width+2*pad)/map.scale,h:(b.height+2*pad)/map.scale};}
function homeFromControl(control,map){const scale=control.scale/map.scale;return{x:(control.x+220*control.scale-map.x)/map.scale,y:(control.y+174*control.scale-map.y)/map.scale,z:.72/scale};}
function geometry(room,control){const home=homeFromControl(control,room);return{home,scale:.72/home.z,asset:{x:room.x+(home.x-220*.72/home.z)*room.scale,y:room.y+(home.y-174*.72/home.z)*room.scale,width:AW*.72/home.z*room.scale,height:AH*.72/home.z*room.scale}};}
function tourClear(api,tour,map,clip,exclusions){
 for(let i=0;i<=610;i++){const p=api.pose(i/20,'bridge',tour),b=api.bounds(p);if(exclusions.some(e=>api.intersects(b,e)))return false;
  const r={x:map.x+b.x*map.scale,y:map.y+b.y*map.scale,w:b.w*map.scale,h:b.h*map.scale};if(r.x<clip.left||r.y<clip.top||r.x+r.w>clip.right||r.y+r.h>clip.bottom)return false;
 }return true;
}
function install({getState=()=>null,ownerMemberId=null,api=typeof OhanaMemorialStudy==='undefined'?null:OhanaMemorialStudy}={}){
 if(!api||!Number.isSafeInteger(ownerMemberId)||ownerMemberId<=0)return null;
 let state=null,accountToken=null,host=null,layer=null,canvas=null,study=null,room=null,boundRoomId=null,map=null,key='',last=0,wait=5,raf=0,away=false,stopped=false,enabled=false,lastTour=-1;
 const reasons=new Set(),media=matchMedia('(prefers-reduced-motion: reduce)'),image=new Image(),originalMap=JSON.parse(JSON.stringify(api.maps.bridge)),handles=new Map();image.src='/ohana-cardinal-control-v1.webp';
 const account=()=>{try{const s=getState(),storedToken=localStorage.getItem('ohana_token');return typeof s?.token==='string'&&s.token&&storedToken===s.token&&Number(s.me?.id)===ownerMemberId?s:null;}catch{return null;}};
 const read=()=>{try{return localStorage.getItem(KEY+':'+ownerMemberId)==='1';}catch{return false;}};
 const reduced=()=>media.matches||document.documentElement.classList.contains('less-motion');
 const visible=e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return !e.hidden&&!e.closest('[hidden],[inert]')&&s.display!=='none'&&s.visibility!=='hidden'&&b.width>0&&b.height>0;};
 function restore(){if(host&&away){delete host.dataset.cardinalAway;host.style.setProperty('background-image','url("/ohana-cardinal-control-v1.webp")','important');}if(room)delete room.dataset.cardinalMapping;away=false;layer?.remove();layer=canvas=study=null;api.maps.bridge=JSON.parse(JSON.stringify(originalMap));}
 function cancel(){restore();key='';boundRoomId=null;room=host=map=null;wait=5;}
 function invalidateSession(){cancel();enabled=false;accountToken=null;state=null;reasons.clear();last=0;for(const entry of handles.values())entry.remove();handles.clear();}
 function context(){
  const s=account();if(!s)return null;const d=document.querySelector('#ohana-chat-dialog[open]'),h=document.getElementById('ohana-persistent-hub');if(!d||!h||!d.contains(h)||!visible(d)||!visible(h)||innerWidth<innerHeight)return null;
  const ds=getComputedStyle(d),hs=getComputedStyle(h);if(!ds.backgroundImage.includes('/ohana-bridge-setting-v1.webp')||ds.transform!=='none')return null;
  if([...document.querySelectorAll('dialog[open]')].some(e=>e!==d)||document.querySelector('#ohana-personal-mango'))return null;
  const b=d.getBoundingClientRect(),rb=imageRect(b,ds.backgroundSize,ds.backgroundPosition,W,H),hc=imageRect(h.getBoundingClientRect(),hs.backgroundSize,hs.backgroundPosition,AW,AH);
  if(!rb||!hc||(!away&&!hs.backgroundImage.includes('/ohana-cardinal-control-v1.webp')))return null;
  const clip={left:Math.max(0,b.left),top:Math.max(0,b.top),right:Math.min(innerWidth,b.right),bottom:Math.min(innerHeight,b.bottom)};
  return{s,d,h,map:rb,control:hc,clip,key:ownerMemberId+':'+s.room+':bridge:'+JSON.stringify([rb,hc,clip])};
 }
 function exclusions(c){
  return [...c.d.querySelectorAll('button,input,select,textarea,a[href],h1,h2,h3,h4,label,[role="grid"],[role="status"],.uc-main,.hub-controls-panel,.hub-record-stage')]
   .filter(e=>e!==document.getElementById('chat-head')&&!e.closest('#ohana-cardinal-visits-layer')&&visible(e)).map(e=>toRoom(e.getBoundingClientRect(),c.map,5));
 }
 function mount(c){
  room=c.d;host=c.h;map=c.map;key=c.key;boundRoomId=String(c.s.room);room.dataset.cardinalMapping='true';
  // The live Bridge workstation covers the study's central rails. Map visits
  // to the visible right rail/post and foreground flower cluster instead.
  const high=[{x:1350,y:400,z:2.7},{x:1365,y:300,z:3.45},{x:1360,y:220,z:3.15},{x:1325,y:300,z:2.35},{x:1305,y:630,z:1.5}];
  api.maps.bridge={...JSON.parse(JSON.stringify(originalMap)),home:geometry(c.map,c.control).home,rail:{x:1320,y:527,z:2.7},flower:{x:1345,y:900,z:1.05},altRail:{x:1355,y:470,z:2.85},altFlower:{x:1320,y:930,z:1.05},high,first:[{x:1330,y:790,z:1.85},{x:1325,y:630,z:2.3},{x:1320,y:470,z:2.85}],back:[...high.slice().reverse(),{x:1325,y:700,z:2.1},{x:1330,y:850,z:1.8}]};
  layer=document.createElement('div');layer.id='ohana-cardinal-visits-layer';layer.hidden=true;layer.setAttribute('aria-hidden','true');layer.inert=true;layer.style.cssText='position:fixed;inset:0;overflow:hidden;pointer-events:none!important;z-index:79;';
  canvas=document.createElement('canvas');canvas.width=Math.ceil(Math.max(W,(c.control.x+c.control.width-map.x)/map.scale));canvas.height=Math.ceil(Math.max(H,(c.control.y+c.control.height-map.y)/map.scale));canvas.style.cssText='position:absolute;pointer-events:none!important;';Object.assign(canvas.style,{left:map.x+'px',top:map.y+'px',width:canvas.width*map.scale+'px',height:canvas.height*map.scale+'px'});layer.append(canvas);room.append(layer);
  study=new api.Study(canvas,image,{room:'bridge',getExclusions:()=>{const current=context();return current?exclusions(current):[{x:-1e6,y:-1e6,w:2e6,h:2e6}];}});
 }
 function align(c){
  // Existing scene observers adjust cover sizing after a child is mounted.
  // Reuse this layer while the layout settles rather than remounting it and
  // repeatedly retriggering those observers. A real room/account exit still unmounts.
  const pendingWait=wait,wasAway=away;if(away){delete host.dataset.cardinalAway;host.style.setProperty('background-image','url("/ohana-cardinal-control-v1.webp")','important');away=false;}
  layer.hidden=true;map=c.map;key=c.key;api.maps.bridge.home=geometry(c.map,c.control).home;
  canvas.width=Math.ceil(Math.max(W,(c.control.x+c.control.width-map.x)/map.scale));canvas.height=Math.ceil(Math.max(H,(c.control.y+c.control.height-map.y)/map.scale));Object.assign(canvas.style,{left:map.x+'px',top:map.y+'px',width:canvas.width*map.scale+'px',height:canvas.height*map.scale+'px'});study.reset();wait=wasAway?5:pendingWait;
 }
 function park(){if(away){delete host.dataset.cardinalAway;host.style.setProperty('background-image','url("/ohana-cardinal-control-v1.webp")','important');away=false;}layer.hidden=true;study.reset();wait=6+Math.random()*6;}
 function start(c){const ex=[...api.maps.bridge.exclusions,...exclusions(c)],choices=[0,1,2].filter(t=>t!==lastTour&&tourClear(api,t,c.map,c.clip,ex));if(!choices.length)return false;
  const tour=choices[Math.floor(Math.random()*choices.length)];study.tour=tour;study.time=0;study.active=true;study.safe=true;lastTour=tour;host.dataset.cardinalAway='true';host.style.setProperty('background-image','none','important');layer.hidden=false;away=true;study.draw();return true;
 }
 function controls(){
  const s=account();for(const [container,entry]of handles)if(!container.isConnected||!s){entry.remove();handles.delete(container);}
  if(!s)return;for(const container of document.querySelectorAll('#access-help,#ohana-settings-dialog .settings-content')){if(handles.has(container))continue;
   const row=document.createElement('div');row.dataset.cardinalVisitSettings='';const label=document.createElement('label'),input=document.createElement('input');label.style.cssText='display:flex!important;align-items:center;gap:8px;min-height:44px;';input.type='checkbox';input.checked=enabled;label.append(input,document.createTextNode(' Cardinal visits'));const pause=document.createElement('button');pause.type='button';pause.textContent=reasons.has('manual')?'Resume visits':'Pause visits';pause.hidden=!enabled;pause.disabled=!enabled;pause.style.setProperty('display',enabled?'inline-block':'none','important');pause.setAttribute('aria-pressed',String(reasons.has('manual')));row.append(label,pause);
   input.onchange=()=>{if(!account()){invalidateSession();return;}enabled=input.checked;try{localStorage.setItem(KEY+':'+ownerMemberId,enabled?'1':'0');}catch{}if(!enabled)cancel();for(const e of handles.values()){e.querySelector('input').checked=enabled;const b=e.querySelector('button');b.hidden=b.disabled=!enabled;b.style.setProperty('display',enabled?'inline-block':'none','important');}};
   pause.onclick=()=>{if(!account()){invalidateSession();return;}const p=!reasons.has('manual');p?reasons.add('manual'):reasons.delete('manual');for(const e of handles.values()){const b=e.querySelector('button');b.textContent=p?'Resume visits':'Pause visits';b.setAttribute('aria-pressed',String(p));}};
   container.append(row);handles.set(container,row);
  }
 }
 function frame(now){if(stopped)return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;const s=account();if(!s){if(state||study||layer||enabled||handles.size)invalidateSession();}else if(!state||accountToken!==s.token){invalidateSession();enabled=read();accountToken=s.token;}state=s;
  controls();const c=enabled&&!reduced()?context():null;
  if(!c||!image.complete||!image.naturalWidth){if(study)cancel();}else if(!document.hidden){
   if(key!==c.key){if(study&&room===c.d&&host===c.h&&boundRoomId===String(c.s.room))align(c);else{if(study)cancel();mount(c);}}if(study){study.setPaused(reasons.size>0);if(!reasons.size){if(study.active){const p=study.update(dt);if(!study.safe){cancel();}else if(!study.active||p.complete){park();}}else{wait-=dt;if(wait<=0){if(!start(c))wait=6;}}}}
  }raf=requestAnimationFrame(frame);
 }
 const visibility=()=>{last=0;};
 const storage=event=>{if(event.key!=='ohana_token'&&event.key!==null)return;try{if(event.storageArea&&event.storageArea!==localStorage)return;}catch{}invalidateSession();};
 document.addEventListener('visibilitychange',visibility);addEventListener('storage',storage);raf=requestAnimationFrame(frame);
 return{setPaused(reason,value){if(!reason)return;value?reasons.add(String(reason)):reasons.delete(String(reason));},get snapshot(){return{eligible:!!account(),enabled,bound:!!study,away,room:room?'bridge':null,paused:[...reasons],reduced:reduced(),tour:lastTour,waitSeconds:wait,flightTime:study?.time||0};},stop(){stopped=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);removeEventListener('storage',storage);cancel();for(const entry of handles.values())entry.remove();handles.clear();}};
}
return{axis,imageRect,toRoom,homeFromControl,geometry,tourClear,install};
});

