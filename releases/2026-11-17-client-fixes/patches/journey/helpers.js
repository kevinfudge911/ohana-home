// Read existing Journey saves only. Never use solo GET or room/start for discovery.
async function ohanaOpenJourneyListing(mode){
 if(!['solo','room'].includes(mode))return;
 const token=S.token,owner=S.me?.id,room=S.room,roomEpoch=S.roomEpoch||0;
 const session=()=>S.token===token&&S.me?.id===owner&&S.room===room&&(S.roomEpoch||0)===roomEpoch;
 goHomePorch();const nav=window.OhanaScreenHistory?.navigationEpoch?.()??null;
 const navigation=()=>session()&&(nav===null||window.OhanaScreenHistory?.navigationEpoch?.()===nav);
 await new Promise(r=>setTimeout(r,0));if(!navigation())return;
 const context=bridgeGameContext(),shelf=S.gameShelf,granny=S.granny,color=S.colorBook,lobby=PZ.lobby;
 const current=()=>navigation()&&context.valid()&&S.gameShelf===shelf&&S.granny===granny&&S.colorBook===color&&PZ.lobby===lobby;
 await PP.check();if(!current())return;
 await PP.open(current,mode);if(!current())return;
 const frame=document.querySelector('#pp-frame');if(!frame)throw Error('This saved journey could not open. Refresh My Games and try again.');
 const active=()=>current()&&frame.isConnected&&document.querySelector('#pp-frame')===frame;
 for(let n=0;n<80;n++){
  if(!active())return;
  const state=window.__ppHost?.snapshot();if(state?.mode===(mode==='room'?'family':'solo'))return;
  await new Promise(r=>setTimeout(r,150));if(!active())return;
 }
 if(active())throw Error('This saved journey did not finish opening. Please reopen it from My Games.');
}
async function ohanaAppendJourneyListing(list,onOpen){
 const owner=S.me?.id,token=S.token,room=S.room,epoch=S.roomEpoch||0;if(!owner||!token)return;
 let result;try{result=await PP.bridge('GET','saved');}catch{return;}
 if(!list.isConnected||S.me?.id!==owner||S.token!==token||S.room!==room||(S.roomEpoch||0)!==epoch)return;
 for(const data of result.games||[]){
  if(!['solo','room'].includes(data.mode)||!Array.isArray(data.players)||!data.players.length)continue;
  list.querySelector('[data-private-journey="'+data.mode+'"]')?.remove();
  list.querySelector('.ohana-home-games-empty,[data-own-games-empty]')?.remove();
  const row=document.createElement('section');row.className='ohana-home-game-group';row.dataset.privateJourney=data.mode;
  const header=document.createElement('header');header.className='ohana-home-game-group-title';
  const title=document.createElement('h3');title.textContent=data.mode==='solo'?'MOMopoly · My Journey':'MOMopoly · GO / Family Journey';header.append(title);
  const body=document.createElement('article');body.className='ohana-home-game-row';const info=document.createElement('div');
  const people=document.createElement('strong');people.className='ohana-home-opponents';people.textContent=data.players.map(p=>p.name).join(', ');
  const turn=document.createElement('small');turn.className='ohana-home-turn';turn.textContent=data.mode==='solo'?'Continue your saved journey':data.myTurn?'Your turn':(data.players[data.turn]?.name||'Family')+'’s turn';
  const go=document.createElement('button');go.type='button';go.textContent='Open';go.setAttribute('aria-label','Open '+title.textContent+' with '+people.textContent);
  go.onclick=async()=>{if(go.disabled)return;go.disabled=true;try{await onOpen(data.mode);}catch(e){if(row.isConnected)turn.textContent=e.message;else toast(e.message);}finally{go.disabled=false;}};
  info.append(people,turn);body.append(info,go);row.append(header,body);list.append(row);
 }
}
