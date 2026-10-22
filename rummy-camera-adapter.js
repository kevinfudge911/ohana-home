/* Rummy's actual #gb has a separate fixed dock. Preserve its native nodes and layout. */
(()=>{'use strict';if(window.OhanaRummyCameraAdapter)return;let installed=null;
 const saveStyle=e=>e?.getAttribute('style'),restoreStyle=(e,value)=>{if(!e)return;if(value==null)e.removeAttribute('style');else e.setAttribute('style',value);},put=(e,values)=>{for(const[k,v]of Object.entries(values))e.style.setProperty(k,String(v),'important');};
 function attach(gb){const game=gb.closest('#game.rd-game'),header=game?.querySelector('#game-head'),dock=game?.querySelector('#game-controls-dock'),play=gb.querySelector('.rd-play');if(!header||!dock||!play||gb.contains(dock)||gb.contains(header))return null;
  const plane=document.createElement('div');plane.dataset.rummyCameraPlane='';const css=getComputedStyle(gb),playStyle=saveStyle(play),minPlay=parseFloat(getComputedStyle(play).minHeight)||0;
  put(plane,{display:'flex','flex-direction':'column','flex-wrap':'nowrap','min-width':'0','box-sizing':'border-box',gap:css.gap,'align-items':css.alignItems,'justify-content':css.justifyContent});
  for(const node of [...gb.childNodes])plane.append(node);gb.append(plane);let last='',api=null,stopped=false,frame=0,focusFrame=0;
  const ensureRack=card=>{const rack=card?.closest?.('.shuffle-rack');if(!rack)return;const a=card.getBoundingClientRect(),r=rack.getBoundingClientRect();if(a.left<r.left)rack.scrollLeft-=(r.left-a.left)/(api?.view.scale||1);else if(a.right>r.right)rack.scrollLeft+=(a.right-r.right)/(api?.view.scale||1);};
  const revealFocused=()=>{if(focusFrame||stopped)return;focusFrame=requestAnimationFrame(()=>{focusFrame=0;if(stopped||!api)return;api.wrapper.scrollLeft=0;api.wrapper.scrollTop=0;const focused=document.activeElement;if(plane.contains(focused)){ensureRack(focused);api.reveal(focused);}});};
  const layout=()=>{frame=0;if(stopped||!gb.contains(plane))return;const c=getComputedStyle(gb),height=Math.max(1,gb.clientHeight-(parseFloat(c.paddingTop)||0)-(parseFloat(c.paddingBottom)||0)),key=[gb.clientWidth,gb.clientHeight,header.getBoundingClientRect().height,dock.getBoundingClientRect().height].join(':');if(key===last)return;last=key;
   put(plane,{height:'auto','min-height':'0'});put(play,{flex:'0 0 auto',height:'auto','min-height':'0',overflow:'visible'});
   const naturalPlay=Math.max(minPlay,play.scrollHeight,play.offsetHeight);put(play,{'min-height':naturalPlay+'px'});const naturalPlane=Math.max(1,plane.scrollHeight,plane.offsetHeight);
   put(plane,{'min-height':naturalPlane+'px',height:height+'px'});put(play,{flex:'1 1 auto',height:'auto'});api?.refresh();revealFocused();
  };
  layout();api=OhanaBoardViewport.mount({content:plane,header,dock,id:'rummy:'+game.dataset.tableId});if(!api){for(const node of [...plane.childNodes])gb.insertBefore(node,plane);plane.remove();restoreStyle(play,playStyle);return null;}
  api.wrapper.dataset.rummyBoardViewport='';api.wrapper.setAttribute('aria-label','Playing board, '+(header.querySelector('h2')?.getAttribute('aria-label')||'Rummy'));
  const queue=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(layout);},observer=new ResizeObserver(queue);for(const e of[gb,header,dock])observer.observe(e);
  const wheel=e=>{const rack=e.target.closest('.shuffle-rack');if(!rack||!gb.contains(rack)||e.ctrlKey||e.metaKey)return;const delta=e.deltaX||(e.shiftKey?e.deltaY:0);if(!delta||rack.scrollWidth<=rack.clientWidth)return;rack.scrollLeft+=delta/api.view.scale;if(e.cancelable)e.preventDefault();e.stopPropagation();};
  const focus=e=>{const card=e.target.closest('[data-card]');if(!card)return;ensureRack(card);revealFocused();},scroll=()=>{if(api.wrapper.scrollLeft||api.wrapper.scrollTop)revealFocused();};
  gb.addEventListener('wheel',wheel,{capture:true,passive:false});gb.addEventListener('focusin',focus,true);api.wrapper.addEventListener('scroll',scroll,{passive:true});
  return{gb,plane,camera:api,refresh:queue,destroy(){stopped=true;cancelAnimationFrame(frame);cancelAnimationFrame(focusFrame);observer.disconnect();gb.removeEventListener('wheel',wheel,true);gb.removeEventListener('focusin',focus,true);api.wrapper.removeEventListener('scroll',scroll);const attached=gb.contains(plane);api.destroy();if(attached){for(const node of [...plane.childNodes])gb.insertBefore(node,plane);plane.remove();}restoreStyle(play,playStyle);}};
 }
 function install(){if(installed){installed.scan();return installed;}const active=new Map();let frame=0,stopped=false;
  const scan=()=>{frame=0;if(stopped)return;for(const[gb,c]of active)if(!gb.isConnected||!gb.contains(c.plane)){c.destroy();active.delete(gb);}for(const gb of document.querySelectorAll('#game.rd-game[data-game-type=shuffle] #gb.shuffle-table'))if(!active.has(gb)){const c=attach(gb);if(c)active.set(gb,c);}};
  const queue=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(scan);},observer=new MutationObserver(queue);observer.observe(document.body,{childList:true,subtree:true});installed={scan,entries:()=>[...active.values()],stop(){stopped=true;cancelAnimationFrame(frame);observer.disconnect();for(const c of active.values())c.destroy();active.clear();installed=null;}};scan();return installed;
 }
 window.OhanaRummyCameraAdapter={install};
})();
