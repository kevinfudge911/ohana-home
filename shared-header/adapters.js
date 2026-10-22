/* One owner for approved game signs. Native controls retain their original handlers. */
(()=>{'use strict';
 let installed=null;
 const rules=[
  {id:'table',selector:'#game-head',title:h=>h.querySelector('h2'),type:h=>h.dataset.game||h.closest('#game')?.dataset.gameType||'table'},
  {id:'waiting',selector:'#game #gb>div:first-child:has(>h2)',title:h=>h.querySelector(':scope>h2'),type:h=>h.closest('#game')?.dataset.gameType||'waiting',guard:h=>!document.getElementById('game-head')&&!h.classList.contains('winbox')},
  {id:'setup',selector:'dialog.game-setup-room>header,dialog.ohana-category-room>header',title:h=>h.querySelector('h2'),type:h=>h.closest('.ohana-category-room')?'category':'setup'},
  {id:'granny',selector:'#gr-main>.gr-header',title:h=>h.querySelector('h1'),type:()=> 'granny'},
  {id:'puzzle',selector:'#pz-board>.pz-head',title:h=>h.querySelector('h2'),type:()=> 'united'},
  {id:'color',selector:'#ohana-journey-room>.journey-room-heading',title:h=>h.querySelector('h2'),type:()=> 'color'},
  {id:'puzzle-lobby',selector:'#app>header',title:h=>h.querySelector('.room-current-heading h1'),type:()=> 'united-lobby',guard:h=>h.querySelector('.room-current-heading h1')?.textContent.trim()==='Ohana United'},
  {id:'saved-decks',selector:'.rd-lobby-head',title:h=>h.querySelector('h2'),type:()=> 'decks'}
 ];
 function install(root=document,options={}){
  if(installed){installed.scan();return installed;}
  window.OhanaDecksHeaderAdapter?.stop();
  const active=new Map(),heights=new WeakMap();let frame=0,stopped=false;
  const restoreGame=c=>{if(c.game){if(c.padding)c.game.style.setProperty('padding-top',c.padding,c.priority);else c.game.style.removeProperty('padding-top');}};
  const resized=entry=>{const {header,height}=entry,rounded=Math.ceil(height);if(heights.get(header)===rounded)return;heights.set(header,rounded);
   const game=header.closest('#game');if(game&&!game.matches('[data-game-type=ohana10]')){if(game.matches('.rd-game')||['fixed','absolute'].includes(getComputedStyle(header).position))game.style.setProperty('padding-top',rounded+'px','important');requestAnimationFrame(()=>{if(!stopped&&header.isConnected)window.dispatchEvent(new Event('resize'));});}
   if(header.matches('#pz-board>.pz-head'))requestAnimationFrame(()=>{if(!stopped&&header.isConnected&&typeof pzResize==='function')pzResize();});
   options.onResize?.(entry);
  };
  const scan=()=>{frame=0;if(stopped)return;
   for(const[h,c]of active)if(!h.isConnected||!h.contains(c.title)){c.api.destroy();restoreGame(c);active.delete(h);heights.delete(h);}
   for(const rule of rules)for(const h of root.querySelectorAll(rule.selector)){
    if(active.has(h)||rule.guard&&!rule.guard(h))continue;const title=rule.title(h);if(!title)continue;const type=rule.type(h);
    if(type==='ohana10'||h.closest('[data-game-type=ohana10]')||(rule.id==='setup'&&/^Ohana\s*(?:10|TEN)$/i.test(title.textContent.trim())))continue;
    const home=h.querySelector('.room-home-control,#wback,[data-gr-exit]');
    // Active Puzzle Play belongs in its workstation; Back/Leave are never Next.
    const next=rule.id==='puzzle'?null:h.querySelector('[data-room-next],[data-category-next],#next-game,#pz-next-game');
    const anchor=title.parentElement===h?title:[...h.children].find(e=>e.contains(title));
    const additional=[...h.children].filter(e=>e!==home&&e!==next&&e!==anchor&&!e.hidden&&getComputedStyle(e).display!=='none');
    const game=h.closest('#game'),padding=game?.style.getPropertyValue('padding-top'),priority=game?.style.getPropertyPriority('padding-top');
    const api=OhanaUnifiedGameHeader.mount({header:h,title,home,next,additional,gameType:type,onResize:resized});if(api)active.set(h,{api,title,game,padding,priority,surface:rule.id});
   }
  };
  const queue=()=>{if(!frame&&!stopped)frame=requestAnimationFrame(scan);};const observer=new MutationObserver(queue);observer.observe(root===document?document.body:root,{childList:true,subtree:true});
  installed={scan,entries:()=>[...active].map(([header,c])=>({header,title:c.api.title,surface:c.surface,controller:c.api})),stop(){stopped=true;cancelAnimationFrame(frame);observer.disconnect();for(const c of active.values()){c.api.destroy();restoreGame(c);}active.clear();if(installed===this)installed=null;}};
  scan();return installed;
 }
 window.OhanaUnifiedHeaderAdapters={install,registry:rules.map(({id,selector})=>({id,selector}))};
})();
