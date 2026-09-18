/* Shared scene and table composition. No engine or network behavior. */
function worldSetting(g=null){
 const room=Number(g?.room_id||S.sync?.roomId||S.room||1),name=(S.sync?.rooms||[]).find(r=>Number(r.id)===room)?.name||S.sync?.familyName||'';
 const roomKind=/flower|rose|bloom/i.test(name)?'garden':room===1?'home':['cove','garden','home'][Math.abs(room)%3];
 const kind=roomKind==='home'&&g?({words:'cove',mahjong:'garden',memory:'garden',handfoot:'home',ohana10:'home',checkers:'cove',tictac:'home'}[g.type]||'home'):roomKind;
 return {room,name,kind,roomKind};
}
function ensureWorldScene(g=S.game?S.gstate:null){
 const setting=worldSetting(g),html=document.documentElement;
 html.classList.add('ohana-world');html.dataset.ohanaRoom=setting.roomKind;html.dataset.ohanaScene=setting.kind;html.dataset.ohanaGame=g?.type||'home';
 let scene=document.getElementById('world-backdrop');
 if(!scene){scene=document.createElement('ohana-scene');scene.id='world-backdrop';scene.setAttribute('world','');scene.setAttribute('aria-hidden','true');scene.setAttribute('world-theme',setting.kind);document.body.prepend(scene);}else if(scene.getAttribute('world-theme')!==setting.kind)scene.setAttribute('world-theme',setting.kind);
 if(!document.getElementById('world-garden-edge')){const edge=document.createElement('div');edge.id='world-garden-edge';edge.setAttribute('aria-hidden','true');edge.innerHTML='<img src="/ohana-flowers-v1.webp" alt=""><img src="/ohana-flowers-v1.webp" alt="">';document.body.append(edge);}
}
function worldPortrait(id,g=null,st=null){
 const me=id===S.me?.id,member=g?.names?.[id]||(S.sync?.members||[]).find(p=>p.id===id)||(me?S.me:null);
 const name=member?.name||nameOf(id),avatar=member?.avatar||(id===-1?'@hon':'🌺');
 const active=g&&g.status==='playing'&&g.players[g.turn]===id;
 const score=g?.type==='ohana10'?st?.penalties?.[id]:st?.scores?.[id];let sub='';
 if(g?.type==='handfoot'){const pile=st.inFoot?.[id]?st.feet?.[id]:st.hands?.[id];sub=(Array.isArray(pile)?pile.length:Number(pile)||0)+' cards · '+(st.inFoot?.[id]?'Foot':'Hand');}
 else if(g?.type==='tictac')sub=g.players.indexOf(id)===0?'X':'O';
 else if(g?.type==='checkers')sub=(st.board?.filter(c=>c&&c.toLowerCase()===(g.players.indexOf(id)===0?'r':'b')).length||0)+' pieces';
 else if(g?.type==='ohana10')sub='Journey '+Math.min(10,(st.journeys?.[id]||0)+1)+(st.completed?.[id]?' · Complete':'');
 return `<div class="world-seat ${me?'self':''} ${active?'current':''}"><div class="world-portrait">${avatar==='🌺'?'<img src="/ohana-flowers-v1.webp" alt="Hibiscus" class="world-flower-avatar">':avatarMarkup(avatar)}</div><div class="world-nameplate"><b>${esc(name)}</b>${active?'<span class="world-turn" aria-label="Current turn">◆</span>':''}</div>${sub?'<small>'+esc(sub)+'</small>':''}${score!==undefined?'<span class="world-score">'+Number(score)+' '+(g?.type==='ohana10'?'shells':'points')+'</span>':''}</div>`;
}
function mountWorldHome(){
 ensureWorldScene();const m=$('#main');if(!m)return;m.classList.add('world-home');
 m.querySelector(':scope>ohana-scene')?.remove();
 const table=document.createElement('section');table.className='world-home-table';table.setAttribute('aria-label','Your Ohana game table');
 const tabs=m.querySelector('.game-shelf-tabs'),nook=m.querySelector('.game-nook');
 if(tabs)m.prepend(tabs);
 if(nook){nook.querySelector('.nook-heading>img')?.remove();nook.querySelector('.nook-heading .room-conversation')?.remove();table.append(nook);}
 else{table.classList.add('world-catalog');const items=[...m.children].filter(el=>el!==tabs&&!el.classList.contains('invite-card'));items.forEach(el=>table.append(el));}
 table.insertAdjacentHTML('afterbegin','<div class="world-table-crest">'+esc(S.sync?.familyName||'Ohana Home')+'</div>');
 m.append(table);
 const rail=document.createElement('div');rail.className='world-home-rail';rail.innerHTML=worldPortrait(S.me.id)+'<div class="world-home-actions"><button id="world-start">Start a game</button><button id="world-room-chat">Room chat</button></div>';
 m.append(rail);rail.querySelector('#world-start').onclick=()=>{S.gameShelf='new';renderGames();};rail.querySelector('#world-room-chat').onclick=()=>{S.tab='chat';render();};
 m.insertAdjacentHTML('beforeend','<p class="world-blessing">✝ Let all that you do be done with love.<br><small>1 Corinthians 16:14 NKJV</small></p>');
 m.querySelectorAll('.nook-card').forEach(card=>card.classList.add('world-game-ticket'));
}
function mountWorldGame(g=S.gstate,st=g?.state){
 if(!g||!st||g.status==='waiting')return;ensureWorldScene(g);
 const board=$('#board'),game=$('#game'),gb=$('#gb');if(!board||!game||!gb)return;
 game.classList.add('world-game');board.classList.add('world-board');board.dataset.type=g.type;
 let top=$('#world-game-top');if(!top){top=document.createElement('div');top.id='world-game-top';gb.insertBefore(top,board);}
 top.innerHTML=g.players.filter(p=>p!==S.me.id).map(p=>worldPortrait(p,g,st)).join('');
 mountWorldDetails(g,st,top);
 let hand=board.querySelector('.world-hand');
 if(g.type==='handfoot'){
  const area=board.querySelector('.hf-area'),felt=area?.querySelector('.hf-felt');if(!felt)return;
  if(!hand){hand=document.createElement('section');hand.className='world-hand';hand.setAttribute('aria-label','Your cards and actions');area.append(hand);}
  for(const sel of ['.hf-progress','.hf-hand-title','.hf-hand','.wild-assignments','.hf-staged','.hf-acts']){const el=felt.querySelector(sel);if(el)hand.append(el);}
  felt.querySelectorAll(':scope>.hf-public-table').forEach(el=>{const d=document.createElement('details');d.className='world-public-cards';const title=el.querySelector('h3')?.textContent||'Played cards';d.innerHTML='<summary>'+esc(title)+' · View cards</summary>';el.before(d);d.append(el);});
  board.querySelector('.hf-welcome')?.setAttribute('hidden','');
 }else if(g.type==='ohana10'){
  const area=board.querySelector('.o10');if(!area)return;
  if(!hand){hand=document.createElement('section');hand.className='world-hand';hand.setAttribute('aria-label','Your cards and actions');area.append(hand);}
  for(const sel of ['.o10-arrange','.wild-assignments','.o10-hand']){const el=area.querySelector(':scope>'+sel);if(el)hand.append(el);}
 }
 if(g.type==='words'){const tray=document.querySelector('.game-tray'),spacer=board.querySelector('.tray-spacer');if(tray){if(spacer)spacer.replaceWith(tray);else if(tray.parentElement!==board)board.append(tray);}}
 let own=board.querySelector('.world-own-seat');if(!own){own=document.createElement('div');own.className='world-own-seat';(hand||board).append(own);}
 own.innerHTML=worldPortrait(S.me.id,g,st)+'<button type="button" class="world-talk" aria-label="Talk to your Ohana buddy">Say aloha</button>';own.querySelector('button').onclick=()=>announceCharacter(g.players[g.turn]===S.me.id?'turn':'hello');
 const cards=board.querySelectorAll('.world-hand .hf-hand>.hf-card,.world-hand .o10-hand>.o10-card');cards.forEach((c,i)=>{c.style.setProperty('--deal-angle',((i-(cards.length-1)/2)*1.4)+'deg');});
 const head=$('#game-head');if(head&&!head.querySelector('#world-help')){const help=document.createElement('button');help.id='world-help';help.textContent='How to play';help.onclick=()=>{const hf=$('#hf-help');if(g.type==='handfoot'&&hf)hf.click();else showTableHelp(g.type);};head.append(help);}
}

function mountWorldDetails(g,st,top){
 const cards=['handfoot','ohana10'].includes(g.type);
 if(cards)top.querySelectorAll('.world-seat').forEach(seat=>{const fan=document.createElement('div');fan.className='world-card-fan';fan.setAttribute('aria-hidden','true');fan.innerHTML=Array.from({length:5},(_,i)=>'<i style="--fan:'+i+'"></i>').join('');seat.prepend(fan);});
 let scores=document.getElementById('world-scoreboard');if(!scores){scores=document.createElement('aside');scores.id='world-scoreboard';scores.setAttribute('aria-label','Game score and progress');top.after(scores);}
 const values=g.players.map(id=>{let value=st.scores?.[id]??0,label='points';
  if(g.type==='ohana10'){value=st.penalties?.[id]??0;label='shells';}
  else if(g.type==='checkers'){value=st.board?.filter(c=>c&&c.toLowerCase()===(g.players.indexOf(id)===0?'r':'b')).length||0;label='pieces';}
  else if(g.type==='tictac'){value=g.players.indexOf(id)===0?'X':'O';label='playing';}
  const name=g.names?.[id]?.name||(S.sync?.members||[]).find(m=>m.id===id)?.name||nameOf(id);
  return '<div class="world-score-entry '+(g.players[g.turn]===id?'active':'')+'"><span>'+esc(name)+'</span><strong>'+value+'</strong><small>'+label+'</small></div>';
 }).join('');
 scores.innerHTML='<div class="world-score-heading">'+(g.type==='handfoot'?'Round '+(st.round||1):g.type==='ohana10'?'Voyage '+(st.voyage||1):'At the table')+'</div><div class="world-score-entries">'+values+'</div>';
}
function decorateWorldRooms(){
 document.querySelectorAll('.room-card').forEach(card=>{const id=Number(card.querySelector('[data-room]')?.dataset.room),room=S.sync?.rooms?.find(r=>Number(r.id)===id),kind=/flower|rose|bloom/i.test(room?.name||'')?'garden':id===1?'home':['cove','garden','home'][Math.abs(id)%3];card.dataset.worldRoom=kind;});
}
