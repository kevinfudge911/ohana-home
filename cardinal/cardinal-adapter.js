/* Decorative memorial cardinal. No game, message, microphone or audio transport. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.OhanaCardinalVisits=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const W=1536,H=1024,AW=384,AH=256;
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
const SURFACES=[['bridge','#ohana-chat-dialog[open]'],['puzzle','#pz-board'],['granny','#gr-main'],['game','#game'],['blessings','#faith'],['color','#ohana-journey-room'],['home','#app']];
const SCENES=[
 {name:'united-entrance',file:'ohana-united-puzzle-sign-v1.webp',w:1672,h:941,interactiveArt:true,perches:[[.13,.83,1.2],[.88,.83,1.2],[.32,.57,2.2]],protected:[[.20,.035,.60,.16]]},
 {name:'color-entrance',file:'ohana-color-entrance-v1.webp',w:1026,h:684,perches:[[.17,.91,1.2],[.87,.78,1.2],[.92,.55,2.2]],protected:[[310/1026,92/684,396/1026,75/684],[.26,.32,.36,.68],[.55,.59,.13,.15]]},
 ...['crossword','wordfind','wordmix'].map(kind=>({name:'granny-'+kind,file:'ohana-granny-'+kind+'-cherish-20261013.webp',w:1200,h:800,interactiveArt:true,perches:[[.12,.96,1.2],[.94,.94,1.2],[.91,.18,2.5]],protected:[[.055,.065,.88,.62],[.19,.64,.65,.34]]})),
 {name:'bridge-wide',file:'ohana-bridge-setting-v1.webp',w:1536,h:1024,perches:[[.86,.515,2.7],[.875,.88,1.05],[.07,.85,1.05]],protected:[]},
 {name:'bridge-tall',file:'ohana-bridge-setting-portrait-v1.webp',w:941,h:1672,perches:[[.24,.57,2.7],[.76,.57,2.7],[.12,.88,1.05],[.88,.88,1.05]],protected:[]},
 {name:'world',file:'ohana-world-scene.webp',w:1536,h:1024,perches:[[.40,.30,2.7],[.815,.285,2.7],[.10,.91,1.05],[.88,.91,1.05]],protected:[[.87,.31,.12,.11]]},
 {name:'family-home',file:'ohana-family-home-v2.webp',w:1536,h:1024,perches:[[.27,.37,1.8],[.36,.43,2.6],[.91,.27,1.8]],protected:[[.035,.35,.18,.16]]},
 {name:'cove',file:'ohana-cove-v1.webp',w:1536,h:1024,perches:[[.297,.399,1.8],[.878,.402,1.8],[.91,.86,1.05]],protected:[]},
 {name:'garden',file:'ohana-garden-v1.webp',w:1536,h:1024,perches:[[.085,.377,1.8],[.915,.377,1.8],[.125,.84,1.05],[.88,.84,1.05]],protected:[]}
];
function install({getState=()=>null,getPuzzleState=()=>null,api=typeof OhanaMemorialStudy==='undefined'?null:OhanaMemorialStudy,routes=typeof OhanaCardinalRoutes==='undefined'?null:OhanaCardinalRoutes,random=Math.random,requestFrame=cb=>requestAnimationFrame(cb),cancelFrame=id=>cancelAnimationFrame(id)}={}){
 if(!api||!routes)return null;
 const PAUSE='ohana_cardinal_pause_v1:',image=new Image(),wood=new Image(),media=matchMedia('(prefers-reduced-motion: reduce)'),reasons=new Set(),handles=new Map(),recent=[],pointers=new Set();image.src='/ohana-cardinal-control-v1.webp';wood.src='/ohana-workstation-v103.webp';
 let stopped=false,raf=0,last=0,wait=8+random()*8,cooldown=0,state=null,token=null,memberId=null,host=null,room=null,layer=null,canvas=null,study=null,away=false,plan=null,key='',fallback='waiting-for-account',lastPattern=null,lastKind=null,original=null,cache=[],sceneCache={perches:[],painted:[]},dirty=true,cacheAge=0,lastContext=null,planning=null,geometryVersion=0,planningSlices=0,maxPlanningSliceMs=0,planningCancellations=0,lastParkReason=null,frameExclusions=null,structuralVersion=0,trackedGeometry=[],trackedIndex=new WeakMap(),blockedScreen=null,occlusionStamp=null;
 const account=()=>{try{const s=getState(),id=Number(s?.me?.id);return typeof s?.token==='string'&&s.token&&localStorage.getItem('ohana_token')===s.token&&Number.isSafeInteger(id)&&id>0?s:null;}catch{return null;}};
 const readPause=()=>{try{return state&&localStorage.getItem(PAUSE+Number(state.me.id))==='1';}catch{return false;}};
 const reduced=()=>media.matches||document.documentElement.classList.contains('less-motion');
 let visibilityMemo=null,occluderMemo=null;
 const composedParent=e=>e.parentElement||e.getRootNode()?.host||null;
 const painted=e=>{if(!e?.isConnected||e.hidden||e.inert)return false;if(visibilityMemo?.has(e))return visibilityMemo.get(e);const st=getComputedStyle(e),parent=composedParent(e),yes=st.display!=='none'&&st.visibility!=='hidden'&&Number(st.opacity)!==0&&(!parent||painted(parent));visibilityMemo?.set(e,yes);return yes;};
 // Only this inspected RGB wood asset establishes an opaque bottom occluder.
 function opaqueWorkstations(){if(!wood.complete||wood.naturalWidth!==2172||wood.naturalHeight!==724)return[];if(visibilityMemo&&occluderMemo)return occluderMemo;const rows=[];for(const e of document.querySelectorAll('.ohana-workstation')){const st=getComputedStyle(e),r=e.getBoundingClientRect();let solid=true;for(let n=e;n;n=composedParent(n)){const a=getComputedStyle(n);if(a.opacity!=='1'||a.filter!=='none'||a.mixBlendMode!=='normal'||a.clipPath!=='none'||a.transform!=='none'){solid=false;break;}}if(!solid||st.position!=='fixed'||st.opacity!=='1'||!painted(e)||!st.backgroundImage.includes('/ohana-workstation-v103.webp')||!(st.backgroundSize.split(',').some(v=>v.trim()==='cover')||st.backgroundSize.split(',').some(v=>v.trim()==='100% 100%'))||r.left>0||r.right<innerWidth||r.bottom<innerHeight||parseFloat(st.borderTopLeftRadius)||parseFloat(st.borderTopRightRadius))continue;rows.push({e,top:r.top,z:Number(st.zIndex)||0});}if(visibilityMemo)occluderMemo=rows;return rows;}
 const workstationStamp=()=>JSON.stringify([...document.querySelectorAll('.ohana-workstation')].map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return[e.id,r.x,r.y,r.width,r.height,s.backgroundImage,s.backgroundSize,s.opacity,s.display,s.visibility,s.position,s.zIndex,s.borderRadius,(()=>{const chain=[];for(let n=e.parentElement;n;n=composedParent(n)){const a=getComputedStyle(n);chain.push([a.opacity,a.filter,a.mixBlendMode,a.clipPath,a.transform,a.position,a.zIndex,a.visibility,a.display]);}return chain;})()];}));
 function workstationClip(e,bottom){for(const o of opaqueWorkstations()){if(o.e===e||o.e.contains(e))continue;let higher=false;for(let n=e;n&&n!==document.body;n=composedParent(n)){const st=getComputedStyle(n);if(st.position!=='static'&&Number(st.zIndex)>=o.z){higher=true;break;}}if(!higher)bottom=Math.min(bottom,o.top);}return bottom;}
 // Clip padding as well as content to each composed ancestor scrollport.
 function paintRect(e,r=e.getBoundingClientRect(),pad=0){let x=r.x??r.left,y=r.y??r.top,right=x+(r.w??r.width)+pad,bottom=y+(r.h??r.height)+pad;x-=pad;y-=pad;
  for(let n=composedParent(e);n;n=composedParent(n)){const st=getComputedStyle(n),b=n.getBoundingClientRect(),sx=n.offsetWidth?b.width/n.offsetWidth:1,sy=n.offsetHeight?b.height/n.offsetHeight:1,contained=/(^|\s)(paint|strict|content)(\s|$)/.test(st.contain),clipX=/^(hidden|clip|scroll|auto|overlay)$/.test(st.overflowX)||contained,clipY=/^(hidden|clip|scroll|auto|overlay)$/.test(st.overflowY)||contained;
   if(clipX){const left=b.left+n.clientLeft*sx;x=Math.max(x,left);right=Math.min(right,left+n.clientWidth*sx);}if(clipY){const top=b.top+n.clientTop*sy;y=Math.max(y,top);bottom=Math.min(bottom,top+n.clientHeight*sy);}
  }bottom=workstationClip(e,bottom);x=Math.max(0,x);y=Math.max(0,y);right=Math.min(innerWidth,right);bottom=Math.min(innerHeight,bottom);return{x,y,w:Math.max(0,right-x),h:Math.max(0,bottom-y)};
 }
 const visible=e=>{if(!painted(e))return false;const r=paintRect(e);return r.w>0&&r.h>0;};
 function canvasScene(e){const owner=e.tagName==='CANVAS'?e.getRootNode()?.host:null,im=owner?.images?.island;if(owner?.tagName!=='OHANA-SCENE'||owner.canvas!==e||!im?.complete||!im.naturalWidth)return null;const url=im.currentSrc||im.src;if(!owner.artUrl||new URL(owner.artUrl,document.baseURI).href!==url)return null;const scene=SCENES.find(v=>url.endsWith('/'+v.file));return scene?{scene,url,owner}:null;}
 const artScene=e=>{if(e?.tagName!=='IMG'||e.closest('.pz-pic')||!e.complete)return null;const b=e.getBoundingClientRect();if(b.width<128||b.height<128)return null;const scene=SCENES.find(v=>(e.currentSrc||e.src).split('?')[0].endsWith('/'+v.file)&&e.naturalWidth===v.w&&e.naturalHeight===v.h);if(!scene)return null;if(scene.name==='united-entrance'&&!e.matches('.puzzle-feature-scene img'))return null;if(scene.name==='color-entrance'&&!e.matches('.journey-entrance>img'))return null;if(scene.name.startsWith('granny-')&&!e.matches('.gr-choice-scene'))return null;if(e.closest('button,[role="button"]')&&!e.matches('.gr-choice-scene,.puzzle-feature-scene img'))return null;return scene;};
 const illustratedControl=e=>e?.matches?.('button,[role="button"]')&&[...e.querySelectorAll('img')].some(im=>artScene(im)?.interactiveArt)&&e.matches('.gr-start-choice,.puzzle-feature-scene');
 // TEN permits brief decorative flyovers of card faces/wood; retain actual
 // text, numbers, action controls and safe resting footprints.
 const tenSurface=e=>getState()?.gstate?.type==='ohana10'&&(e.matches?.('.ohana-workstation,.o10-character')||e.closest?.('#game,#game-controls-dock'));
 const decorativeCell=e=>getState()?.gstate?.type==='words'&&(e.matches?.('#board [role="grid"]')||e.matches?.('#board .c')&&!e.querySelector('.t,img,canvas')&&!e.textContent.trim());
 const cardIllustration=e=>getState()?.gstate?.type==='handfoot'&&e.matches?.('.hf-card-picture>img');
 const heldPuzzleArt=e=>e.id==='pz-held-overlay'&&e.tagName==='CANVAS'&&e.getAttribute('aria-hidden')==='true'&&getComputedStyle(e).pointerEvents==='none';
 const workstationArt=e=>e.id==='pz-workstation'&&getComputedStyle(e).backgroundImage.includes('ohana-workstation-v103.webp');
 const scenery=e=>{if(canvasScene(e))return true;for(let n=e;n;n=composedParent(n))if(n.id==='world-backdrop'||n.id==='world-garden-edge')return e.tagName!=='CANVAS';return false;};
 const rect=(e,pad=0)=>({...paintRect(e,e.getBoundingClientRect(),pad),owner:e,source:e.id||e.tagName+':'+e.className+(e.dataset.go?'[data-go='+e.dataset.go+']':'')});
 const clipped=r=>{const x=Math.max(0,r.x),y=Math.max(0,r.y),right=Math.min(innerWidth,r.x+r.w),bottom=Math.min(innerHeight,r.y+r.h);return{...r,x,y,w:Math.max(0,right-x),h:Math.max(0,bottom-y)};};
 function cancelPlanning(){if(planning){planning.job.cancel();planning=null;planningCancellations++;}}
 function restore(){if(host&&away){delete host.dataset.cardinalAway;if(original?.background)host.style.setProperty('background',original.background,original.backgroundPriority);else if(original?.value)host.style.setProperty('background-image',original.value,original.priority);else host.style.removeProperty('background-image');}away=false;}
 function park(reason='park'){frameExclusions=null;lastParkReason=reason;cancelPlanning();restore();if(layer)layer.hidden=true;plan=null;study?.reset();}
 function cancel(){resizeObserver?.disconnect();park();if(room)delete room.dataset.cardinalMapping;layer?.remove();layer=canvas=study=null;host=room=original=null;key='';lastContext=null;dirty=true;}
 function invalidate(){cancel();wait=8+random()*8;state=token=memberId=null;reasons.clear();pointers.clear();last=0;for(const row of handles.values())row.remove();handles.clear();}
 function sourceControl(){for(const e of [document.getElementById('ohana-persistent-hub'),document.getElementById('chat-head')])if(visible(e)){const s=getComputedStyle(e);if((e===host&&away)||s.backgroundImage.includes('ohana-cardinal-control-v1.webp')){const r=imageRect(e.getBoundingClientRect(),s.backgroundSize,s.backgroundPosition,AW,AH);if(r)return{e,paint:r};}}return null;}
 function context(){const s=account();if(!s)return null;const settings=document.getElementById('ohana-settings-dialog');if(settings?.open&&visible(settings))return{blocked:'settings-dialog',screen:'settings'};let surface=SURFACES.find(([,sel])=>visible(document.querySelector(sel)));if(!surface)return null;const d=document.querySelector(surface[1]),control=sourceControl();if(!control)return null;
  const modal=[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(e=>visible(e)&&e!==d);if(modal)return{blocked:'modal-open'};
  const id=surface[0]==='game'?'game:'+String(s.gstate?.type||d.dataset.gameType||'unknown'):surface[0],vv=window.visualViewport,viewport={x:vv?.offsetLeft||0,y:vv?.offsetTop||0,width:Math.min(innerWidth,vv?.width||innerWidth),height:Math.min(innerHeight,vv?.height||innerHeight)};
  return{s,d,h:control.e,control:control.paint,screen:id,width:innerWidth,height:innerHeight,viewport,key:[viewport.x,viewport.y,viewport.width,viewport.height,s.me.id,s.room,s.roomEpoch,s.game,s.gameEntryVisit,id,innerWidth,innerHeight,control.paint.x,control.paint.y,control.paint.width].join(':')};
 }
 function* sceneDataSteps(c){visibilityMemo=new WeakMap();occluderMemo=null;let units=0;try{const perches=[],obstacles=[],painted=[],layers=[];const elements=[c.d,...(c.d.tagName==='DIALOG'?[]:[document.getElementById('app'),document.body]),...roots(c).flatMap(r=>[...r.querySelectorAll('img,ohana-scene,canvas')])].filter(Boolean);for(const e of elements){if(++units%4===0)yield;if(!visible(e))continue;const style=getComputedStyle(e),canvas=canvasScene(e),url=canvas?.url||(e.tagName==='IMG'?e.currentSrc||e.src:style.backgroundImage);const scene=canvas?.scene||(e.tagName==='IMG'?artScene(e):SCENES.find(v=>url.includes(v.file)));if(!scene)continue;const b=e.getBoundingClientRect();let m=imageRect(b,canvas||e.tagName==='IMG'?(style.objectFit||'fill'):style.backgroundSize,canvas||e.tagName==='IMG'?(style.objectPosition||'50% 50%'):style.backgroundPosition,canvas?e.width:scene.w,canvas?e.height:scene.h);if(canvas&&m)m.scale=m.width/scene.w;
   if(!m&&((e.tagName==='IMG'&&style.objectFit==='fill')||style.backgroundSize==='100% 100%'))m={x:b.left,y:b.top,width:b.width,height:b.height,scale:Math.min(b.width/scene.w,b.height/scene.h)};
   if(!m)continue;const identity=scene.name+':'+JSON.stringify(m);if(painted.some(v=>v.id===identity))continue;painted.push({id:identity,name:scene.name,rect:m,asset:canvas?.url||url,renderer:canvas?'scene-canvas':'image',role:canvas?'room-canvas':e.tagName==='IMG'?'registered-entrance':'room-background'});layers.push({e,canvas:!!canvas,m,clip:paintRect(e)});
   const clip=paintRect(e);for(const [u,v,z]of scene.perches){const x=m.x+u*m.width,y=m.y+v*m.height;if(x>=clip.x&&x<=clip.x+clip.w&&y>=clip.y&&y<=clip.y+clip.h)perches.push({x,y,z:z/Math.max(.01,m.scale),kind:'illustrated-perch',scene:scene.name,asset:scene.file,element:e,canvas:!!canvas});}
   for(const [x,y,w,h]of scene.protected){const mapped=paintRect(e,{x:m.x+x*m.width,y:m.y+y*m.height,w:w*m.width,h:h*m.height});if(mapped.w&&mapped.h)obstacles.push({...mapped,owner:e,artText:true,source:'art-text:'+scene.name});}
  }const imageOccluders=[...new Set(elements.filter(e=>e.tagName==='IMG'))].filter(e=>visible(e)&&e.complete&&e.naturalWidth).map(e=>{const st=getComputedStyle(e),m=imageRect(e.getBoundingClientRect(),st.objectFit||'fill',st.objectPosition||'50% 50%',e.naturalWidth,e.naturalHeight);return{e,m,clip:paintRect(e)};}).filter(o=>o.m);const visiblePerches=perches.filter(p=>{if(.72/p.z<.18)return false;const hits=document.elementsFromPoint(p.x,p.y),control=hits.find(e=>e.matches?.('button,input,select,textarea,a[href],[role="button"],[role="grid"],[role="gridcell"]')&&visible(e));if(control&&!(illustratedControl(control)&&control.contains(p.element)))return false;if(p.canvas&&imageOccluders.some(o=>o.e!==p.element&&p.x>=o.clip.x&&p.x<=o.clip.x+o.clip.w&&p.y>=o.clip.y&&p.y<=o.clip.y+o.clip.h&&p.x>=o.m.x&&p.x<=o.m.x+o.m.width&&p.y>=o.m.y&&p.y<=o.m.y+o.m.height))return false;return true;}).map(({element,canvas,...p})=>p);return{perches:visiblePerches,obstacles,painted};}finally{visibilityMemo=null;occluderMemo=null;}
 }
 function sceneData(c){const it=sceneDataSteps(c);let step;do{step=it.next();}while(!step.done);return step.value;}
 const inContext=(e,c=lastContext)=>{if(!c||c.d.tagName!=='DIALOG')return true;for(let n=e;n;n=composedParent(n))if(n===c.d)return true;return false;};
 function roots(c){const result=[c.d.tagName==='DIALOG'?c.d:document];for(let i=0;i<result.length;i++)for(const e of result[i].querySelectorAll('*'))if(e.shadowRoot)result.push(e.shadowRoot);return result;}
 function* staticObstaclesSteps(c){visibilityMemo=new WeakMap();occluderMemo=null;let units=0;try{const boxes=[],nextTracked=[],trackedSet=new Set(),track=e=>{if(trackedSet.has(e))return;trackedSet.add(e);const r=e.getBoundingClientRect();nextTracked.push({element:e,raw:{x:r.x,y:r.y,w:r.width,h:r.height},paint:paintRect(e,r,6),wasVisible:visible(e)});},skip=e=>scenery(e)||cardIllustration(e)||heldPuzzleArt(e)||e===c.h||e.id==='chat-head'||e.closest('#ohana-cardinal-visits-layer');const selector='button,input,select,textarea,a[href],[role="button"],[role="grid"],[role="gridcell"],[contenteditable="true"],canvas,iframe,video,object,.card,.tile,.domino,[data-card],.world-portrait,.hub-record-stage,#ohana-personal-mango,.ohana-workstation,.c .t';
  for(const root of roots(c)){
   for(const e of root.querySelectorAll(selector)){if(++units%8===0)yield;if(!skip(e))track(e);if(!skip(e)&&!illustratedControl(e)&&!e.matches('.world-seat')&&!decorativeCell(e)&&!workstationArt(e)&&!tenSurface(e)&&visible(e)&&e.id!=='pz-canvas'&&e.id!=='pz-strip')boxes.push(rect(e,5));}
   for(const e of root.querySelectorAll('img')){if(++units%8===0)yield;if(!skip(e))track(e);if(!skip(e)&&visible(e)&&!artScene(e)&&!tenSurface(e))boxes.push(rect(e));}
   const walker=document.createTreeWalker(root===document?document.body:root,NodeFilter.SHOW_TEXT);let text;while(text=walker.nextNode()){if(++units%8===0)yield;const e=text.parentElement;if(e&&text.textContent.trim()&&!e.closest('script,style')&&!skip(e))track(e);if(!e||!text.textContent.trim()||skip(e)||e.closest('script,style,input,textarea,select')||(getState()?.gstate?.type!=='ohana10'&&e.closest('button,[role="button"]')&&!illustratedControl(e.closest('button,[role="button"]')))||!visible(e))continue;const range=document.createRange();range.selectNodeContents(text);for(const r of range.getClientRects())if(r.width>0&&r.height>0){const box=paintRect(e,r,4);if(box.w&&box.h)boxes.push({...box,owner:e,source:'text:'+ (e.id||e.tagName+':'+e.className)});}}
  }
  const currentTracked=new Set(nextTracked.map(row=>row.element));trackedGeometry=[...nextTracked,...trackedGeometry.filter(old=>old.element.isConnected&&inContext(old.element,c)&&!currentTracked.has(old.element))];trackedIndex=new WeakMap(trackedGeometry.map(row=>[row.element,row]));occlusionStamp=workstationStamp();return boxes;}finally{visibilityMemo=null;occluderMemo=null;}
 }
 function staticObstacles(c){const it=staticObstaclesSteps(c);let step;do{step=it.next();}while(!step.done);return step.value;}
 function* geometrySteps(c){yield;const scene=yield*sceneDataSteps(c);yield;const boxes=yield*staticObstaclesSteps(c);return{scene,boxes:[...boxes,...scene.obstacles]};}
 const sceneStamp=()=>JSON.stringify([...document.querySelectorAll('ohana-scene')].map(e=>[e.artUrl,e.images?.island?.currentSrc||e.images?.island?.src,e.canvas?.width,e.canvas?.height,e.getAttribute('world-theme')]));
 function puzzleGeometry(){
  const cv=document.getElementById('pz-canvas'),strip=document.getElementById('pz-strip');let p;try{p=getPuzzleState();}catch{}
  // Pieces are decorative landing surfaces. Their drag/selection never owns the
  // cardinal clock. Keep tray choices and actual DOM controls/text protected.
  const boxes=visible(strip)?[rect(strip)]:[];
  if(!visible(cv))return{boxes,perches:[]};
  if(!p?.data?.pieces||!p.geo||!p.view||!cv.width||!cv.height)return{boxes:[...boxes,rect(cv)],perches:[]};
  return{boxes,perches:[]};
 }
 function tenPerches(c){
  if(c.screen!=='game:ohana10')return[];const result=[],v=c.viewport;
  for(const e of document.querySelectorAll('#game .o10-card,#game .o10-table,#game .o10-journey')){if(!visible(e)||e.closest('.o10-hand'))continue;const r=paintRect(e);if(r.w<30||r.h<20)continue;for(const x of [r.x+r.w*.78,r.x+r.w*.30]){const y=r.y-3,scale=.28+.10*Math.max(0,Math.min(1,(y-v.y)/v.height));if(x>v.x+60&&x<v.x+v.width-30&&y>v.y+65&&y<v.y+v.height-25)result.push({x,y,z:.72/scale,kind:'card-table-border'});}}
  const board=document.getElementById('board');if(visible(board)){const r=paintRect(board),y=r.y+r.h-7;for(const x of [r.x+75,r.x+r.w-55])if(x>v.x+55&&x<v.x+v.width-25&&y<v.y+v.height-20)result.push({x,y,z:.72/.38,kind:'visible-table-rim'});}
  // In a short view the fitted content is narrower than the painted table.
  // Use that real viewport's upper/lower side rims, not its transformed cards.
  if(v.height<480){const table=document.getElementById('gb');if(visible(table)){const r=paintRect(table);for(const y of [r.y-5,r.y+r.h-7])for(const x of [r.x+75,r.x+r.w-70])if(x>v.x+55&&x<v.x+v.width-25&&y>v.y+65&&y<v.y+v.height-20)result.push({x,y,z:.72/.30,kind:'visible-table-rim'});}}
  return result;
 }
 const cardRoomArt=new Map();
 function cardRoomPaint(c,table,shuffle){
  const owner=shuffle?table:document.querySelector('#game[data-game-type="spades"]'),style=owner&&getComputedStyle(owner);if(!style)return null;
  const file=shuffle?'ohana-world-scene.webp':'ohana-mikes-room.webp',url=[...style.backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]).find(u=>{try{return new URL(u,document.baseURI).pathname==='/'+file;}catch{return false;}});if(!url)return null;
  let im=cardRoomArt.get(url);if(!im){im=new Image();im.src=url;cardRoomArt.set(url,im);}const iw=shuffle?1536:1672,ih=shuffle?1024:940;
  if(!im.complete||im.naturalWidth!==iw||im.naturalHeight!==ih)return null;
  const fixed=style.backgroundAttachment.split(',').at(-1).trim()==='fixed',box=fixed?{left:0,top:0,width:innerWidth,height:innerHeight}:owner.getBoundingClientRect();
  return imageRect(box,style.backgroundSize.split(',').at(-1).trim(),style.backgroundPosition.split(',').at(-1).trim(),iw,ih);
 }
 // These two adapters measure the actual painted table and non-hand card
 // borders. Candidate feet never infer private cards or affect their state.
 function cardRoomPerches(c){
  const shuffle=c.screen==='game:shuffle',spades=c.screen==='game:spades';if(!shuffle&&!spades)return[];
  const table=document.querySelector(shuffle?'#game.rd-game #gb.shuffle-table':'#game[data-game-type="spades"] #board');if(!visible(table))return[];
  const b=paintRect(table),v=c.viewport,dock=document.getElementById('game-controls-dock'),d=visible(dock)?paintRect(dock):null;
  const left=Math.max(b.x,v.x),right=Math.min(b.x+b.w,v.x+v.width),top=Math.max(b.y,v.y+65),bottom=Math.min(b.y+b.h,v.y+v.height-32,d?.y>top?d.y-10:Infinity),out=[];
  const scaleAt=y=>.28+.10*Math.max(0,Math.min(1,(y-top)/Math.max(1,bottom-top)));
  const add=(x,y,kind)=>{if(x>left+32&&x<right-25&&y>top+45&&y<bottom)out.push({x,y,z:.72/scaleAt(y),kind});};
  const cards=shuffle?'#game .rd-opponent .rd-card,#game .shuffle-meld-cards .shuffle-card':'#game .sp-trick .sp-card';
  for(const card of document.querySelectorAll(cards)){if(!visible(card))continue;const r=paintRect(card);if(r.w<20||r.h<20)continue;for(const x of [r.x+r.w*.30,r.x+r.w*.78])add(x,r.y-8,'card-border');}
  // Pixel-inspected deck planks and felt replace a generic DOM rectangle that
  // also contains sky/ocean. Use the actual decoded active CSS image transform.
  const map=cardRoomPaint(c,table,shuffle);
  if(map){
   if(!shuffle)for(const [u,v]of [[.36,493/940],[.5,493/940],[.64,499/940]])add(map.x+u*map.width,map.y+v*map.height,'visible-table-rim');
   const sourceTop=shuffle?500:550;
   for(let y=Math.max(top+65,map.y+sourceTop*map.scale);y<bottom-5;y+=42)for(let x=left+42;x<right-30;x+=56){const sx=(x-map.x)/map.scale,sy=(y-map.y)/map.scale;
    const painted=shuffle?sx>=420&&sx<=1140&&sy>=500&&sy<=860:sy>=550&&sy<=760&&((sx-837)/700)**2+((sy-650)/135)**2<1;
    if(painted)add(x,y,shuffle?'painted-deck-planks':'painted-table-felt');
   }
  }
  // A native private-card selection rebuilds the Rummy camera. The diagnosed
  // stock-pile position differs by 20.03125px before its final layout commit.
  // Resting anchors reserve 32px vertically (and 4px laterally) around current
  // protected footprints, for both settled facings; live controls stay intact.
  return shuffle?out.filter(p=>[-1,1].every(facing=>{const body=api.bounds({...p,scale:.72/p.z,phase:'rest',facing});return!cache.some(o=>api.intersects(body,{x:o.x-4,y:o.y-32,w:o.w+8,h:o.h+64}));})):out;
 }
 function tablePerches(c){
  const selector=c.screen==='game:handfoot'?'#board .hf-felt':c.screen==='game:words'?'#board':c.screen==='puzzle'?'#pz-canvas':null;
  if(!selector)return[];const table=document.querySelector(selector);if(!visible(table))return[];
  const b=paintRect(table),v=c.viewport,dock=document.getElementById('game-controls-dock'),d=visible(dock)?paintRect(dock):null;
  const left=Math.max(b.x,v.x),right=Math.min(b.x+b.w,v.x+v.width),top=Math.max(b.y,v.y+65),bottom=Math.min(b.y+b.h,v.y+v.height-32,d?.y>top?d.y-10:Infinity),out=[];
  if(c.screen==='game:handfoot')for(const card of document.querySelectorAll('#board .hf-public-cards>.hf-card,#board .hf-decks .hf-card')){if(!visible(card))continue;const r=paintRect(card);for(const x of [r.x+r.w*.78,r.x+r.w*.30]){const y=r.y-3,scale=.28+.10*Math.max(0,Math.min(1,(y-top)/Math.max(1,bottom-top)));if(x>left+32&&x<right-25&&y>top+45&&y<bottom)out.push({x,y,z:.72/scale,kind:'card-border'});}}
  if(c.screen==='puzzle'){let p;try{p=getPuzzleState();}catch{}if(p?.geo&&p?.view&&p?.data?.pieces&&table.width&&table.height){const r=table.getBoundingClientRect(),sx=r.width/table.width,sy=r.height/table.height,locked=p.data.pieces.filter(pc=>pc.l&&!pc.tray),step=Math.max(1,Math.ceil(locked.length/64));for(let i=0;i<locked.length;i+=step){const pc=locked[i],x=r.left+(p.view.x+(pc.x+p.geo.pw*.12)*p.view.s)*sx,y=r.top+(p.view.y+pc.y*p.view.s)*sy-3,scale=.28+.10*Math.max(0,Math.min(1,(y-top)/Math.max(1,bottom-top)));if(x>left+35&&x<right-25&&y>top+45&&y<bottom)out.push({x,y,z:.72/scale,kind:'piece-border'});}}}

  for(let y=top+65;y<bottom-5;y+=56)for(let x=left+42;x<right-30;x+=56){const scale=.28+.10*Math.max(0,Math.min(1,(y-top)/Math.max(1,bottom-top)));out.push({x,y,z:.72/scale,kind:'painted-table-patch'});}
  return out;
 }
 function obstacles(c,dt=0,holdStatic=false){cacheAge+=dt;if(dirty&&!holdStatic){const scene=sceneData(c);cache=[...staticObstacles(c),...scene.obstacles];sceneCache=scene;dirty=false;cacheAge=0;}c.painted=sceneCache.painted;const puzzle=puzzleGeometry();c.perches=(c.screen==='game:shuffle'||c.screen==='game:spades')?cardRoomPerches(c):[...sceneCache.perches,...puzzle.perches,...tenPerches(c),...tablePerches(c)];return[...cache,...puzzle.boxes].map(clipped).filter(b=>b.w>0&&b.h>0);}
 function liveGeometryChanged(dt=0){
  if(!plan?.envelope)return false;if(!plan.visibleTour&&occlusionStamp!==workstationStamp())return true;
  const at=away?study.time:0,poses=[api.pose(at,'bridge',0,plan),api.pose(at+dt,'bridge',0,plan)].filter(p=>p.visible!==false&&!p.maskedPerch&&!p.foregroundPass&&!p.foregroundTransit&&!routes.unchangedHome(p,study.home));if(!poses.length)return false;const a=api.bounds(poses[0]),b=api.bounds(poses.at(-1)),sweep={x:Math.min(a.x,b.x)-2,y:Math.min(a.y,b.y)-2,w:Math.max(a.x+a.w,b.x+b.w)-Math.min(a.x,b.x)+4,h:Math.max(a.y+a.h,b.y+b.h)-Math.min(a.y,b.y)+4},contains=v=>cache.some(o=>v.x>=o.x&&v.y>=o.y&&v.x+v.w<=o.x+o.w&&v.y+v.h<=o.y+o.h);
  const motionProperties=new Set(['transform','translate','rotate','scale','left','top','right','bottom','width','height','marginLeft','marginTop','offsetPath','offsetDistance','flexBasis','gridTemplateRows','gridTemplateColumns']),motionTargets=(document.getAnimations?.()||[]).filter(a=>(a.playState==='running'||a.pending)&&(a.effect?.getKeyframes?.()||[]).some(k=>Object.keys(k).some(p=>motionProperties.has(p)))).map(a=>a.effect?.target).filter(Boolean),physical=e=>!!e.closest('.dragging,[data-dragging="true"]')||motionTargets.some(target=>{for(let n=e;n;n=composedParent(n))if(n===target)return true;return false;});
  visibilityMemo=new WeakMap();occluderMemo=null;try{cache=cache.filter(o=>!o.owner||o.owner.isConnected&&o.owner!==host&&o.owner.id!=='chat-head'&&inContext(o.owner)&&painted(o.owner));for(const entry of trackedGeometry){const e=entry.element;if(!e.isConnected||e===host||e.id==='chat-head'||!inContext(e))continue;const r=e.getBoundingClientRect(),now={x:r.x,y:r.y,w:r.width,h:r.height},old=entry.raw,changed=['x','y','w','h'].some(k=>Math.abs(now[k]-old[k])>.25);if(!changed&&!entry.needsProtection&&!api.intersects(now,sweep))continue;entry.raw=now;entry.needsProtection=false;if(artScene(e)||canvasScene(e)){if(changed)return true;continue;}cache=cache.filter(o=>o.owner!==e);if(!visible(e))continue;const boxes=[];
   if(fullControl(e)){boxes.push(paintRect(e,r,6));}else for(const n of e.childNodes)if(n.nodeType===3&&n.textContent.trim()){const range=document.createRange();range.selectNode(n);for(const box of range.getClientRects())boxes.push(paintRect(e,box,4));}
   for(const box of boxes){if(!box.w||!box.h)continue;const covered=contains(box);cache.push({...box,owner:e,source:'live-control'});if(!covered&&away&&api.intersects(box,sweep))return true;}
   if(away&&changed&&old.w>0&&old.h>0&&now.w>0&&now.h>0&&fullControl(e)&&physical(e)){const motion={x:Math.min(old.x,now.x)-6,y:Math.min(old.y,now.y)-6,w:Math.max(old.x+old.w,now.x+now.w)-Math.min(old.x,now.x)+12,h:Math.max(old.y+old.h,now.y+now.h)-Math.min(old.y,now.y)+12};if(!contains(motion)&&api.intersects(motion,sweep))return true;}
  }return false;}finally{visibilityMemo=null;occluderMemo=null;}
 }
 const cardRoomScreen=screen=>screen==='game:shuffle'||screen==='game:spades';
 function reuseCardRoom(c){
  // Rummy's private selection replaces #game while preserving the same logical
  // table, viewport, original hub and painted perch coordinates. Keep its tour
  // and deadline; the existing current-control guards still check new nodes.
  if(!cardRoomScreen(c.screen)||key!==c.key||host!==c.h||!room||room.isConnected||room===c.d)return false;
  resizeObserver?.unobserve(room);delete room.dataset.cardinalMapping;room=c.d;room.dataset.cardinalMapping='true';resizeObserver?.observe(room);dirty=true;return true;
 }
 function mount(c){host=c.h;room=c.d;key=c.key;room.dataset.cardinalMapping='true';original={value:host.style.getPropertyValue('background-image'),priority:host.style.getPropertyPriority('background-image'),background:host.style.getPropertyValue('background'),backgroundPriority:host.style.getPropertyPriority('background')};
  layer=document.createElement('div');layer.id='ohana-cardinal-visits-layer';layer.setAttribute('aria-hidden','true');layer.inert=true;layer.hidden=true;layer.style.cssText='position:fixed;inset:0;overflow:hidden;pointer-events:none!important;z-index:79;';canvas=document.createElement('canvas');canvas.width=c.width;canvas.height=c.height;canvas.style.cssText='width:100%;height:100%;pointer-events:none!important;';if(c.screen==='game:ohana10')layer.style.zIndex='1000000';layer.append(canvas);(c.d.tagName==='DIALOG'?c.d:document.body).append(layer);
  const h=c.control,home={x:h.x+220*h.scale,y:h.y+174*h.scale,z:.72/h.scale};study=new api.Study(canvas,image,{home,getPlan:()=>plan,getExclusions:()=>{if(frameExclusions)return frameExclusions;const current=context();return (current&&!current.blocked?obstacles(current,0,away):[{x:0,y:0,w:innerWidth,h:innerHeight}]);}});dirty=true;lastContext=c;for(const e of new Set([room,host,...roots(c).flatMap(r=>[...r.querySelectorAll('ohana-scene,canvas,.hub-record-stage')])]))if(!e.closest?.('#ohana-cardinal-visits-layer')&&!heldPuzzleArt(e))resizeObserver?.observe(e);
 }
 function controls(){const s=account();for(const [container,row]of handles)if(!container.isConnected||!s){row.remove();handles.delete(container);}if(!s)return;
  for(const container of document.querySelectorAll('#access-help,.settings-content'))if(!handles.has(container)){const row=document.createElement('div');row.dataset.cardinalVisitSettings='';const title=document.createElement('span');title.textContent='Cardinal motion ';const button=document.createElement('button');button.type='button';button.style.minHeight='44px';row.append(title,button);button.onclick=()=>{if(!account()){invalidate();return;}const pause=!reasons.has('manual');pause?reasons.add('manual'):reasons.delete('manual');try{localStorage.setItem(PAUSE+Number(s.me.id),pause?'1':'0');}catch{}if(pause)park();refreshControls();};container.append(row);handles.set(container,row);}refreshControls();
 }
 function refreshControls(){for(const row of handles.values()){const button=row.querySelector('button'),paused=reasons.has('manual');const text=paused?'Resume cardinal':'Pause cardinal';if(button.textContent!==text)button.textContent=text;if(button.getAttribute('aria-pressed')!==String(paused))button.setAttribute('aria-pressed',String(paused));}}
 // Input remains owned by the game. Its real geometry/state changes are guarded below.
 function interaction(){dirty=true;}
 function released(){dirty=true;}
 function planFrame(c,now,dt){
  if(!planning){fallback='waiting';if(wait>0)return;planning={job:routes.createTask(geometrySteps(c)),phase:'geometry',key:c.key,version:geometryVersion,sceneStamp:sceneStamp()};}
  const pending=planning;if(pending.key!==c.key||pending.version!==geometryVersion||pending.sceneStamp!==sceneStamp()){cancelPlanning();dirty=true;fallback='planning-context-changed';return;}
  const step=pending.job.advance({budgetMs:3,maxSteps:32});planningSlices++;maxPlanningSliceMs=Math.max(maxPlanningSliceMs,step.sliceMs);fallback='planning-'+pending.phase;if(!step.done)return;
  if(step.cancelled){planning=null;fallback='planning-cancelled';return;}
  const commit=value=>{cache=value.boxes;sceneCache=value.scene;dirty=false;cacheAge=0;};
  const validate=()=>{pending.phase='validate-geometry';pending.job=routes.createTask(geometrySteps(c));};
  if(pending.phase==='geometry'){commit(step.value);const obs=obstacles(c,0);for(let i=recent.length-1;i>=0;i--)if(now-recent[i].at>300000)recent.splice(i,1);pending.phase='route';pending.job=routes.createPlanner({...c,home:study.home,obstacles:obs,perches:c.perches||[]},api,recent.map(v=>({...v})),random);return;}
  if(pending.phase==='route'){pending.picked=step.value;if(!pending.picked.plan){planning=null;wait=20;fallback=pending.picked.reason;return;}validate();return;}
  if(pending.phase==='validate-geometry'){commit(step.value);const obs=obstacles(c,0);pending.dynamic=JSON.stringify(puzzleGeometry().boxes.map(({x,y,w,h})=>({x,y,w,h})));pending.phase='validate-route';pending.job=routes.createTask(routes.safePlanSteps(pending.picked.plan,{...c,home:study.home,obstacles:obs},api,routes.index(obs)));return;}
  if(pending.dynamic!==JSON.stringify(puzzleGeometry().boxes.map(({x,y,w,h})=>({x,y,w,h})))){validate();return;}
  if(!step.value){planning=null;dirty=true;fallback='planning-route-obstructed';return;}
  const picked=pending.picked;plan=picked.plan;
  if(liveGeometryChanged(0)){plan=null;validate();fallback='planning-live-geometry';return;}
  planning=null;dirty=false;lastPattern=picked.key;lastKind=picked.kind;recent.push({key:picked.key,at:now});if(recent.length>8)recent.shift();study.time=0;study.active=true;study.tour=0;away=true;frameExclusions=Object.freeze(obstacles(c,0,true).map(({x,y,w,h})=>Object.freeze({x,y,w,h})));host.dataset.cardinalAway='true';host.style.setProperty('background-image','none','important');layer.hidden=false;study.draw();fallback='flying';
 }
 function frame(now){if(stopped)return;const elapsed=last?Math.max(0,(now-last)/1000):0,dt=Math.min(.05,elapsed);last=now;const s=account();if(!s){if(state||study||handles.size)invalidate();fallback='signed-out';}else if(!state||token!==s.token||memberId!==Number(s.me.id)){invalidate();state=s;token=s.token;memberId=Number(s.me.id);if(readPause())reasons.add('manual');}else state=s;
  // Scheduling uses foreground wall time, independently of ordinary play/motion.
  if(s&&!document.hidden&&!reduced()&&!reasons.size)wait-=elapsed;
  controls();if(s&&!document.hidden){const c=context();blockedScreen=c?.blocked?c.screen||null:null;if(!c||c.blocked){if(study)cancel();fallback=c?.blocked||'no-original-perch';}else if(reduced()){if(study)cancel();fallback='reduced-motion';}else if(image.complete&&image.naturalWidth){
   if(key!==c.key||room!==c.d||host!==c.h){if(!reuseCardRoom(c)){if(study)cancel();mount(c);}}lastContext=c;
   if(reasons.size){if(away)park('paused');cancelPlanning();fallback='paused';}else if(study){
    // Only actual route-relative geometry can stop a decorative flight. A
    // pulsing pile, active game input or unrelated animation cannot stop its clock.
    if(away){if(liveGeometryChanged(dt)){dirty=true;park('live-control-geometry');fallback='live-control-geometry';}else{frameExclusions=Object.freeze(obstacles(c,dt,true).map(({x,y,w,h})=>Object.freeze({x,y,w,h})));const pose=study.update(dt);if(!study.safe){park('new-obstruction');fallback='new-obstruction';}else if(pose.complete||!study.active){park('completed');wait=18+random()*37;fallback='resting';}}}else planFrame(c,now,dt);
   }
  }}raf=requestFrame(frame);
 }
 const storage=event=>{if(event.key==='ohana_token'||event.key===null){try{if(event.storageArea&&event.storageArea!==localStorage)return;}catch{}invalidate();}else if(state&&event.key===PAUSE+Number(state.me.id)){readPause()?reasons.add('manual'):reasons.delete('manual');park();refreshControls();}};
 const visibility=()=>{last=0;pointers.clear();reasons.delete('interaction');if(document.hidden){cancelFrame(raf);park();}else if(!stopped)raf=requestFrame(frame);};
 const layout=event=>{const resize=event==='resize'||event?.type==='resize'||typeof event==='string'&&event.startsWith('resize:');if(resize&&cardRoomScreen(lastContext?.screen)){const current=context();if(current&&!current.blocked&&current.key===key){dirty=true;return;}}geometryVersion++;dirty=true;cancelPlanning();if(away)park(typeof event==='string'?event:event?.type||'layout');};
 const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{const outside=entries.filter(entry=>!entry.target.closest?.('#ohana-cardinal-visits-layer'));if(outside.length)layout('resize:'+outside.map(e=>e.target.id||e.target.tagName).join(','));}):null;
 const mutationTag=r=>{const e=r?.target,parent=e?.parentElement;let props='';if(r?.attributeName==='style'&&e?.style){const old=document.createElement('div').style;old.cssText=r.oldValue||'';props=[...new Set([...Array.from(old),...Array.from(e.style)])].filter(p=>old.getPropertyValue(p)!==e.style.getPropertyValue(p)||old.getPropertyPriority(p)!==e.style.getPropertyPriority(p)).join(',');}return [r?.type,e?.id||e?.nodeName,e?.className,parent?.id||parent?.className,r?.attributeName,props].join(':');};
 const containedTransport=r=>{const e=r.target,row=e.closest?.('[data-hub-transport]');if(r.type!=='attributes'||r.attributeName!=='style'||!row||getComputedStyle(row).position!=='absolute')return false;const stage=row.closest('.hub-record-stage');if(!stage||!visible(stage))return false;const a=rect(stage,5),range=document.createRange();range.selectNodeContents(e);const boxes=[rect(e,8),...[...range.getClientRects()].map(v=>paintRect(e,v,4))];return boxes.every(b=>b.x>=a.x&&b.y>=a.y&&b.x+b.w<=a.x+a.w&&b.y+b.h<=a.y+a.h);};
 const paintOnly=r=>{if(r.type!=='attributes'||r.attributeName!=='style'||!r.target.style)return false;const old=document.createElement('div').style;old.cssText=r.oldValue||'';const changed=[...new Set([...Array.from(old),...Array.from(r.target.style)])].filter(p=>old.getPropertyValue(p)!==r.target.style.getPropertyValue(p)||old.getPropertyPriority(p)!==r.target.style.getPropertyPriority(p));return changed.length>0&&changed.every(p=>['color','background-color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','text-decoration-color','caret-color'].includes(p));};
 const containedTypeChange=r=>{if(r.type!=='attributes'||r.attributeName!=='style'||!r.target.closest?.('button,input,select,textarea,a[href],[role=button]'))return false;const old=document.createElement('div').style;old.cssText=r.oldValue||'';const changes=[...new Set([...Array.from(old),...Array.from(r.target.style)])].filter(p=>old.getPropertyValue(p)!==r.target.style.getPropertyValue(p)||old.getPropertyPriority(p)!==r.target.style.getPropertyPriority(p));if(!changes.length||!changes.every(p=>['color','font-size','font-family','font-weight','font-style','line-height','letter-spacing','text-align','white-space'].includes(p)))return false;const control=r.target.closest('button,input,select,textarea,a[href],[role=button]'),b=rect(control),range=document.createRange();range.selectNodeContents(control);const boxes=[b,...[...range.getClientRects()].map(v=>paintRect(control,v,4))];if(cache.some(o=>boxes.every(v=>v.x>=o.x&&v.y>=o.y&&v.x+v.w<=o.x+o.w&&v.y+v.h<=o.y+o.h)))return true;if(away&&plan?.envelope&&boxes.every(b=>!api.intersects(b,plan.envelope))){for(const b of boxes)cache.push({...b,owner:control,source:'updated-control-type'});return true;}return false;};
 const noChange=r=>(r.type==='attributes'&&r.oldValue===r.target.getAttribute(r.attributeName))||(r.type==='characterData'&&r.oldValue===r.target.textContent)||(r.type==='childList'&&[...r.addedNodes,...r.removedNodes].every(n=>n.nodeType===3)&&[...r.addedNodes].map(n=>n.textContent).join('')===[...r.removedNodes].map(n=>n.textContent).join(''));
 const ownMutation=r=>noChange(r)||paintOnly(r)||containedTransport(r)||containedTypeChange(r)||r.target.closest?.('#ohana-cardinal-visits-layer,[data-cardinal-visit-settings]')||(r.target===host&&r.attributeName==='style')||(r.type==='childList'&&[...r.addedNodes,...r.removedNodes].length&&[...r.addedNodes,...r.removedNodes].every(n=>n.nodeType===1&&n.id==='ohana-cardinal-visits-layer'));
 const protectedSelector='button,input,select,textarea,a[href],[role="button"],[role="grid"],[role="gridcell"],[contenteditable="true"],canvas,img,iframe,video,.card,.tile,.domino,[data-card],.world-portrait,.hub-record-stage,#ohana-personal-mango,.ohana-workstation,.c .t';
 // These containers include verified decorative/empty painted space. Their
 // actual text and portrait descendants remain separate protected geometry.
 const fullControl=e=>e.matches(protectedSelector)&&!e.matches('#pz-canvas,#pz-strip')&&!heldPuzzleArt(e)&&!illustratedControl(e)&&!e.matches('.world-seat')&&!decorativeCell(e)&&!cardIllustration(e)&&!workstationArt(e)&&!tenSurface(e)&&!(e.tagName==='IMG'&&artScene(e));
 const trackAdded=e=>{if(!e?.isConnected||e===host||e.id==='chat-head'||!inContext(e)||e.closest?.('#ohana-cardinal-visits-layer')||e.matches?.('script,style')||scenery(e)||cardIllustration(e)||heldPuzzleArt(e))return;if(!e.matches(protectedSelector)&&![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return;const previous=trackedIndex.get(e);if(previous){previous.needsProtection=true;return;}const r=e.getBoundingClientRect(),entry={element:e,raw:{x:r.x,y:r.y,w:r.width,h:r.height},needsProtection:true};trackedGeometry.push(entry);trackedIndex.set(e,entry);};
 const observer=new MutationObserver(records=>{const changes=records.filter(r=>!ownMutation(r));if(changes.length){dirty=true;for(const r of changes){trackAdded(r.target.nodeType===3?r.target.parentElement:r.target);for(const n of r.addedNodes||[]){if(n.nodeType===3)trackAdded(n.parentElement);else if(n.nodeType===1){trackAdded(n);for(const e of n.querySelectorAll(protectedSelector))trackAdded(e);const walker=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let text;while(text=walker.nextNode())if(text.textContent.trim())trackAdded(text.parentElement);}}}}if(records.some(r=>r.attributeName==='world-theme'))layout();});observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeOldValue:true,characterDataOldValue:true,attributeFilter:['world-theme','class','hidden','style']});
 document.addEventListener('pointerdown',interaction,true);document.addEventListener('pointerup',released,true);document.addEventListener('pointercancel',released,true);document.addEventListener('visibilitychange',visibility);addEventListener('storage',storage);addEventListener('resize',layout);addEventListener('scroll',layout,true);window.visualViewport?.addEventListener('resize',layout);window.visualViewport?.addEventListener('scroll',layout);raf=requestFrame(frame);
 return{setPaused(reason,value){if(!reason)return;value?reasons.add(String(reason)):reasons.delete(String(reason));if(value)park();},get snapshot(){return{eligible:!!account(),enabled:!!account(),bound:!!study,away,fullBirdVisible:away&&!!study?.snapshot&&study.snapshot.visible!==false&&!study.snapshot.maskedPerch&&(()=>{const b=api.bounds(study.snapshot);return b.x>=0&&b.y>=0&&b.x+b.w<=innerWidth&&b.y+b.h<=innerHeight;})(),maskedPerch:!!study?.snapshot?.maskedPerch,planning:!!planning,planningSlices,maxPlanningSliceMs,planningCancellations,lastParkReason,screen:lastContext?.screen||blockedScreen||null,paused:[...reasons],reduced:reduced(),waitSeconds:wait,flightTime:study?.time||0,phase:study?.snapshot?.phase||'rest',position:study?.snapshot?{x:study.snapshot.x,y:study.snapshot.y,scale:study.snapshot.scale}:null,routeKind:lastKind,reason:fallback,pattern:lastPattern,recentPatterns:recent.length,paintedScenes:lastContext?.painted?.map(p=>p.name)||[]};},stop(){stopped=true;cancelFrame(raf);resizeObserver?.disconnect();observer.disconnect();document.removeEventListener('pointerdown',interaction,true);document.removeEventListener('pointerup',released,true);document.removeEventListener('pointercancel',released,true);document.removeEventListener('visibilitychange',visibility);removeEventListener('storage',storage);removeEventListener('resize',layout);removeEventListener('scroll',layout,true);window.visualViewport?.removeEventListener('resize',layout);window.visualViewport?.removeEventListener('scroll',layout);invalidate();}};
}
return{axis,imageRect,toRoom,homeFromControl,geometry,tourClear,SURFACES,SCENES,install};
});
