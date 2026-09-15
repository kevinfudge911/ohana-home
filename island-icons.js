/* Drawn island controls. These decorate interface controls only, never game
   pieces, member avatars, chat content, or the emoji picker. */
(()=>{
 const shapes={
 settings:'<circle cx="32" cy="32" r="23" fill="#a9d9df"/><path d="M17 22h30M17 32h30M17 42h30" stroke="#337f96" stroke-width="4"/><circle cx="25" cy="22" r="5" fill="#ffe4a6"/><circle cx="39" cy="32" r="5" fill="#f6b3a6"/><circle cx="28" cy="42" r="5" fill="#b8e5cd"/>',
 flower:'<g fill="#f08083"><ellipse cx="32" cy="21" rx="11" ry="17"/><ellipse cx="21" cy="31" rx="17" ry="11" transform="rotate(28 21 31)"/><ellipse cx="25" cy="43" rx="11" ry="16" transform="rotate(30 25 43)"/><ellipse cx="41" cy="42" rx="11" ry="16" transform="rotate(-30 41 42)"/><ellipse cx="44" cy="28" rx="16" ry="11" transform="rotate(-25 44 28)"/></g><path d="M33 33q12-7 19-19" fill="none" stroke="#ffe18b" stroke-width="4"/><circle cx="31" cy="33" r="7" fill="#ffdc7e"/>',
 home:'<path d="M9 31L32 10l24 21" fill="#ec997b"/><path d="M15 30h35v27H15z" fill="#f8df9b"/><path d="M8 31L32 8l25 23-7 4-18-16-18 16z" fill="#45a9a8"/><path d="M28 57V39q7-6 12 0v18" fill="#5db5b3"/><path d="M19 35h7v8h-7z" fill="#b7e8e7"/><path d="M9 56h48" fill="none"/>',
 games:'<g transform="rotate(-10 31 33)"><rect x="10" y="12" width="43" height="42" rx="10" fill="#ffe4a6"/><path d="M14 49h34" stroke="#c49959"/><g fill="#247c91" stroke="none"><circle cx="21" cy="23" r="4"/><circle cx="42" cy="23" r="4"/><circle cx="31" cy="33" r="4"/><circle cx="21" cy="43" r="4"/><circle cx="42" cy="43" r="4"/></g></g>',
 chat:'<path d="M7 13q25-8 49 0v32q-12 9-26 4L16 59l2-12Q7 46 7 37z" fill="#b8e5cd"/><path d="M17 23h29M17 32h23" stroke="#3e8c91" stroke-width="4"/><path d="M44 5q9 1 15 8" stroke="#f2b06d" fill="none"/>',
 rooms:'<path d="M8 56V12h47v44" fill="#3c9d99"/><path d="M17 56V17l27-6v45z" fill="#e7ba76"/><path d="M23 20v30M29 18v33" fill="none" stroke="#bd895b"/><circle cx="38" cy="36" r="3" fill="#fff1b5"/><path d="M5 57h54" fill="none"/>',
 invite:'<rect x="6" y="16" width="49" height="35" rx="6" fill="#fff0bd"/><path d="M8 20l23 18 23-18M8 48l15-15m31 15L39 34" fill="none" stroke="#bb8a65"/><circle cx="48" cy="15" r="12" fill="#79cbbc"/><path d="M48 9v12m-6-6h12" fill="none" stroke="#165769" stroke-width="3"/>',
 play:'<path d="M18 8q-5 24 0 48l36-24z" fill="#7fcab4"/><path d="M24 18l20 14-20 14" fill="#c9edbd" stroke="none"/>',
 back:'<path d="M29 12L8 32l21 20V40h25V24H29z" fill="#a9d9df"/>',
 shuffle:'<path d="M9 17c26-6 23 34 44 29M9 47c24 4 23-35 44-30" fill="none" stroke="#855fa0" stroke-width="7"/><path d="M45 8l12 9-12 8m0 12l12 9-12 8" fill="none" stroke="#855fa0" stroke-width="5"/>',
 wave:'<path d="M5 47q16 5 23-19Q39 5 57 22q-20-5-17 11 4 7 17 5v16H5z" fill="#5dbbcc"/><path d="M6 43q18 6 24-13 8-18 22-10" fill="none" stroke="#fff0cf" stroke-width="5"/>',
 star:'<path d="M32 5l8 18 20 2-15 14 4 21-17-11-18 11 4-21L3 25l21-2z" fill="#f5c96f"/><path d="M32 17v21l-11 9" fill="none" stroke="#ffebac"/>',
 leaf:'<path d="M12 52C3 14 36 7 56 7c0 37-12 49-44 45z" fill="#83c7a0"/><path d="M10 58L46 18M21 45l-2-18m11 9 18-2" fill="none" stroke="#327c70"/>',
 sound:'<path d="M7 25h12L35 12v41L19 40H7z" fill="#91cdd6"/><path d="M43 24q10 8 0 17m6-27q19 18 0 37" fill="none" stroke="#337f96" stroke-width="4"/>',
 bell:'<path d="M13 43q6-5 6-20 0-13 13-13t13 13q0 15 6 20z" fill="#ffe3a3"/><path d="M25 49q7 12 14 0" fill="#eda575"/><path d="M30 6h5" fill="none"/>',
 camera:'<path d="M7 21h12l5-8h18l4 8h11v31H7z" fill="#9dc8d8"/><circle cx="32" cy="36" r="12" fill="#356c83"/><circle cx="32" cy="36" r="7" fill="#b7e5db"/><path d="M48 26h4" stroke="#fff1bb"/>',
 send:'<path d="M5 13L58 30 5 53l9-21z" fill="#8fd3bd"/><path d="M14 32l44-2-33 12" fill="none" stroke="#337f7a"/>',
 smile:'<circle cx="32" cy="32" r="25" fill="#ffe1a0"/><path d="M18 36q14 20 28 0" fill="#fff3d5"/><path d="M22 23v3m20-3v3" stroke-width="5"/>',
 turtle:'<ellipse cx="31" cy="34" rx="19" ry="20" fill="#80bf94"/><path d="M19 20l13 6 13-6M15 37l17-11 17 11M32 26v25" fill="none" stroke="#3f8571"/><ellipse cx="32" cy="9" rx="9" ry="8" fill="#acd48b"/><path d="M12 25l-8-4 2 13 7 2m37-11 9-4-2 13-7 2M19 51l-7 7m31-7 7 7" fill="#acd48b"/>',
 shell:'<path d="M15 53C-6 34 9 5 24 13 30 2 44 4 47 16 65 13 68 37 49 53z" fill="#f6b3a6"/><path d="M31 51L16 22m18 29L29 17m7 34 6-29m-2 29 11-21" stroke="#bb777d" fill="none"/>'
 };
 function icon(name){const box=document.createElement('span');box.className='island-icon';box.setAttribute('aria-hidden','true');box.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#275b64" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+(shapes[name]||shapes.flower)+'</svg>';return box;}
 const prefix={'🌺':'flower','🏡':'home','🏠':'home','🎲':'games','💬':'chat','🚪':'rooms','🐢':'turtle','🐚':'shell','🌿':'leaf','🌊':'wave','🔥':'star','⭐':'star','✦':'play','📨':'invite','✉️':'invite','🔊':'sound','🔇':'sound','🔔':'bell','📷':'camera','☺':'smile','➤':'send','↶':'back','⤨':'shuffle','⇄':'shuffle','››':'wave','↻':'shuffle','‹':'back','✏️':'leaf'};
 const exact={'Play word':'play','Invite to Ohana':'invite','Invite friends':'invite','Invite to game':'invite','Send invitation':'invite','Come on in':'home','Your move':'play','Visit':'wave','Open':'rooms','Doorways ▸':'rooms','Take back':'back','Shuffle':'shuffle','Swap':'shuffle','Pass':'wave','Give up':'back','Cancel':'back','Close':'back','New island':'games','Accept':'invite','＋':'smile'};
 const excluded='.emoji-picker,.reacts [data-react],.buddy-choice,[data-av],.honu-host,.ttt,.mem,.chk,.mj-table,.rack,.wb';
 function decorate(){
  if(!document?.body)return;
  document.querySelectorAll('.table-chat-title>span').forEach(el=>{if(!el.querySelector('.island-icon'))el.replaceChildren(icon('flower'));});
  document.querySelectorAll('.game-art').forEach(el=>{if(!el.querySelector('.island-icon')){el.replaceChildren(icon(el.classList.contains('mahjong')?'shell':'games'));el.classList.add('drawn-game-art');}});
  document.querySelectorAll('button,.notification-control>summary,.room-name>i').forEach(b=>{
   if(b.closest(excluded)||b.querySelector('.island-icon'))return;
   const nav=b.dataset.tab;
   if(nav){const holder=b.querySelector('.ic');if(holder){holder.replaceChildren(icon(({games:'games',chat:'chat',family:'home',rooms:'rooms',settings:'settings'})[nav]));}return;}
   let symbol=Object.keys(prefix).find(p=>b.textContent.trimStart().startsWith(p));
   let type=symbol?prefix[symbol]:exact[b.textContent.trim()];if(!type)return;
   if(b.textContent.trim()==='＋')b.textContent='';
   if(symbol){const walker=document.createTreeWalker(b,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.textContent.trim()){n.textContent=n.textContent.replace(symbol,'').trimStart();break;}}}
   if(!b.textContent.trim()&&!b.getAttribute('aria-label'))b.setAttribute('aria-label',b.title||({send:'Send message',smile:'More emojis',camera:'Send a picture'})[type]||type);
   b.prepend(icon(type));b.classList.add('island-control');
  });
 }
 let queued=false;const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;decorate();});}});
 addEventListener('pagehide',()=>observer.disconnect());
 addEventListener('pageshow',e=>{if(e.persisted){decorate();observer.observe(document.body,{subtree:true,childList:true,characterData:true});}});
 decorate();observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
