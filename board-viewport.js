/* Presentation-only camera. Existing board nodes/handlers remain intact. */
(()=>{'use strict';
 const controllers=new WeakMap(),views=new Map(),interactive='button,a,input,textarea,select,[role=button],[role=checkbox],[draggable=true],[data-o10-card],[data-hf-card],[data-cb],[data-i],[data-square],.cp,.chess-piece,.hf-card,.sp-card,.shuffle-card,canvas';
 const rect=e=>e.getBoundingClientRect();
 function mount({content,header,dock,id='board',minScale=.25,maxScale=4}){
  if(!content?.parentElement||!header||!dock||content.contains(dock)||content.contains(header))return null;
  if(controllers.has(content))return controllers.get(content);
  const original={style:content.getAttribute('style')},wrapper=document.createElement('div'),parent=content.parentElement;
  wrapper.dataset.gameBoardViewport='';wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Playing board');wrapper.setAttribute('aria-keyshortcuts','+ - 0 ArrowUp ArrowDown ArrowLeft ArrowRight');wrapper.setAttribute('aria-description','Pinch to zoom this board. Drag empty board space to pan. With this region focused, use plus, minus, zero to fit, or arrow keys to pan.');
  wrapper.style.cssText='position:fixed!important;overflow:hidden!important;box-sizing:border-box!important;touch-action:none!important;overscroll-behavior:contain!important;isolation:isolate;z-index:2;';
  content.before(wrapper);wrapper.append(content);content.dataset.boardCameraPlane='';
  content.style.setProperty('margin','0','important');content.style.setProperty('transform-origin','0 0','important');
  const v={scale:1,x:0,y:0,...views.get(String(id))},points=new Map(),listeners=[];let size={w:0,h:0,cw:0,ch:0},gesture=null,blocked=false,canceling=false,ignoreClick=0,ignoreTouch=0,stopped=false,frame=0;
  const on=(node,type,fn,options)=>{node.addEventListener(type,fn,options);listeners.push(()=>node.removeEventListener(type,fn,options));};
  const remember=()=>views.set(String(id),{...v});
  const clamp=()=>{v.scale=Math.max(minScale,Math.min(maxScale,v.scale));const w=size.cw*v.scale,h=size.ch*v.scale;v.x=w<=size.w?(size.w-w)/2:Math.min(0,Math.max(size.w-w,v.x));v.y=h<=size.h?(size.h-h)/2:Math.min(0,Math.max(size.h-h,v.y));};
  const apply=()=>{clamp();content.style.setProperty('transform',`translate(${v.x}px,${v.y}px) scale(${v.scale})`,'important');wrapper.dataset.boardScale=String(v.scale);remember();};
  const measure=()=>{frame=0;if(stopped||!content.isConnected)return;const h=rect(header),d=rect(dock),p=rect(parent),top=Math.max(0,h.bottom),left=Math.max(0,p.left),w=Math.max(1,Math.min(innerWidth-left,p.width)),bottom=Math.min(d.top,window.visualViewport?visualViewport.height+visualViewport.offsetTop:innerHeight),available=Math.max(44,bottom-top-8);
   wrapper.style.left=left+'px';wrapper.style.top=top+'px';wrapper.style.width=w+'px';
   size={w,h:Math.min(Math.max(1,content.offsetHeight),available),cw:content.offsetWidth,ch:content.offsetHeight};wrapper.style.height=size.h+'px';apply();
  };
  const queue=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(measure);};
  const local=e=>{const r=rect(wrapper);return{x:e.clientX-r.left,y:e.clientY-r.top};};
  const zoom=(factor,x=size.w/2,y=size.h/2)=>{const scale=Math.max(minScale,Math.min(maxScale,v.scale*factor)),ratio=scale/v.scale;v.x=x-(x-v.x)*ratio;v.y=y-(y-v.y)*ratio;v.scale=scale;apply();};
  const stop=e=>{if(e.cancelable)e.preventDefault();e.stopImmediatePropagation();};
  const cancelOriginal=()=>{canceling=true;for(const p of points.values())if(p.target?.isConnected){p.target.dispatchEvent(new PointerEvent('pointercancel',{pointerId:p.id,pointerType:p.type,bubbles:true}));p.target.dispatchEvent(new Event('touchcancel',{bubbles:true}));}canceling=false;};
  const beginPinch=()=>{cancelOriginal();blocked=true;ignoreClick=Date.now()+500;const[a,b]=[...points.values()];gesture={kind:'pinch',distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),mx:(a.x+b.x)/2,my:(a.y+b.y)/2,scale:v.scale,x:v.x,y:v.y};for(const p of points.values())try{wrapper.setPointerCapture(p.id);}catch{}};
  on(wrapper,'pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;const p={...local(e),id:e.pointerId,type:e.pointerType,target:e.target};points.set(e.pointerId,p);if(points.size===2){beginPinch();stop(e);return;}if(points.size===1){const blank=!e.target.closest(interactive)&&!e.target.closest('[tabindex]:not([data-game-board-viewport])');gesture={kind:blank?'pending-pan':'card',x:v.x,y:v.y,px:p.x,py:p.y};}},true);
  on(document,'pointermove',e=>{if(canceling||!points.has(e.pointerId))return;const p=points.get(e.pointerId);Object.assign(p,local(e));if(points.size>=2&&gesture?.kind==='pinch'){const[a,b]=[...points.values()],scale=Math.max(minScale,Math.min(maxScale,gesture.scale*Math.hypot(a.x-b.x,a.y-b.y)/gesture.distance)),ratio=scale/gesture.scale;v.x=(a.x+b.x)/2-(gesture.mx-gesture.x)*ratio;v.y=(a.y+b.y)/2-(gesture.my-gesture.y)*ratio;v.scale=scale;apply();stop(e);return;}if(blocked){stop(e);return;}if(gesture?.kind==='pending-pan'&&Math.hypot(p.x-gesture.px,p.y-gesture.py)>=7){gesture.kind='pan';try{wrapper.setPointerCapture(e.pointerId);}catch{}}
   if(gesture?.kind==='pan'){v.x=gesture.x+p.x-gesture.px;v.y=gesture.y+p.y-gesture.py;apply();ignoreClick=Date.now()+400;stop(e);}
  },{capture:true,passive:false});
  const up=e=>{if(canceling||!points.has(e.pointerId))return;const wasGesture=blocked||gesture?.kind==='pan';points.delete(e.pointerId);if(wasGesture){ignoreClick=Date.now()+450;ignoreTouch=Date.now()+100;stop(e);}if(!points.size){blocked=false;gesture=null;}else if(blocked)gesture=null;};
  on(document,'pointerup',up,true);on(document,'pointercancel',up,true);
  for(const type of['touchstart','touchmove','touchend','touchcancel'])on(wrapper,type,e=>{if(!canceling&&(blocked||Date.now()<ignoreTouch||gesture?.kind==='pan'))stop(e);},{capture:true,passive:false});
  on(wrapper,'click',e=>{if(Date.now()<ignoreClick)stop(e);},true);
  on(wrapper,'wheel',e=>{const p=local(e);if(e.ctrlKey||e.metaKey){zoom(Math.exp(-e.deltaY*.006),p.x,p.y);stop(e);}else if(size.cw*v.scale>size.w+.5||size.ch*v.scale>size.h+.5){v.x-=e.deltaX;v.y-=e.deltaY;apply();stop(e);}},{passive:false});
  const fit=()=>{v.scale=Math.max(minScale,Math.min(1,size.w/Math.max(1,size.cw),size.h/Math.max(1,size.ch)));v.x=0;v.y=0;apply();};
  on(wrapper,'keydown',e=>{if(e.target!==wrapper||e.ctrlKey||e.metaKey||e.altKey)return;if(['+','=','-','0'].includes(e.key)){if(e.key==='0')fit();else zoom(e.key==='-'?1/1.25:1.25);stop(e);}else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){v.x+=e.key==='ArrowLeft'?60:e.key==='ArrowRight'?-60:0;v.y+=e.key==='ArrowUp'?60:e.key==='ArrowDown'?-60:0;apply();stop(e);}});
  const reveal=e=>{if(e===wrapper||!content.contains(e))return;const a=rect(e),b=rect(wrapper),dx=a.left<b.left+4?b.left+4-a.left:a.right>b.right-4?b.right-4-a.right:0,dy=a.top<b.top+4?b.top+4-a.top:a.bottom>b.bottom-4?b.bottom-4-a.bottom:0;if(dx||dy){v.x+=dx;v.y+=dy;apply();}};
  on(wrapper,'focusin',e=>reveal(e.target));on(window,'resize',queue);if(window.visualViewport)on(visualViewport,'resize',queue);
  const observer=new ResizeObserver(queue);for(const e of[content,header,dock,parent])observer.observe(e);measure();
  const api={wrapper,content,get view(){return{...v};},get size(){return{...size};},zoom,fit,reveal,refresh:measure,destroy(){stopped=true;cancelAnimationFrame(frame);observer.disconnect();listeners.forEach(f=>f());remember();if(original.style==null)content.removeAttribute('style');else content.setAttribute('style',original.style);delete content.dataset.boardCameraPlane;if(wrapper.parentElement)wrapper.replaceWith(content);controllers.delete(content);}};controllers.set(content,api);return api;
 }
 function install({getId=()=>document.querySelector('#game')?.dataset.gameType||'board'}={}){const active=new Map();let frame=0,stopped=false;
  const scan=()=>{frame=0;if(stopped)return;for(const[e,c]of active)if(!e.isConnected){c.destroy();active.delete(e);}const content=document.querySelector('#game #board'),type=content?.dataset.type||content?.closest('#game')?.dataset.gameType;
   // Keep existing native Words, Domino, Puzzle and Granny cameras. Never nest cameras.
   if(!content||['words','domino'].includes(type)||content.querySelector('.wbwrap,.domino-board')||active.has(content))return;
   const header=document.getElementById('game-head'),dock=document.getElementById('game-controls-dock'),api=mount({content,header,dock,id:getId(content)});if(api)active.set(content,api);
  };const queue=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(scan);},observer=new MutationObserver(queue);observer.observe(document.body,{childList:true,subtree:true});scan();return{scan,entries:()=>[...active.values()],stop(){stopped=true;cancelAnimationFrame(frame);observer.disconnect();for(const c of active.values())c.destroy();active.clear();}};
 }
 window.OhanaBoardViewport={mount,install};
})();
