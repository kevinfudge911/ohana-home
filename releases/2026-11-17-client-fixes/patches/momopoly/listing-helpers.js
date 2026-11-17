// Read-only discovery of the separately stored Classic family board.
const ohanaClassicListing={owner:null,at:0,value:null,pending:null};
async function ohanaReadClassicListing(){
 const owner=String(S.me?.id||'')+':'+String(S.token||'');if(!S.me||!S.token)return null;
 if(ohanaClassicListing.owner!==owner)Object.assign(ohanaClassicListing,{owner,at:0,value:null,pending:null});
 if(ohanaClassicListing.pending){const value=await ohanaClassicListing.pending;return ohanaClassicListing.owner===owner&&String(S.me?.id||'')+':'+String(S.token||'')===owner?value:null;}
 if(Date.now()-ohanaClassicListing.at<5000)return ohanaClassicListing.value;
 const pending=PP.bridge('GET','classic').then(r=>{const s=r.state;return s&&s.phase!=='finished'&&s.players?.some(p=>p.id===r.actor)?{players:s.players,turn:s.turn,actor:r.actor}:null;}).catch(()=>null);
 ohanaClassicListing.pending=pending;const value=await pending;
 if(ohanaClassicListing.owner===owner){ohanaClassicListing.value=value;ohanaClassicListing.at=Date.now();ohanaClassicListing.pending=null;}return ohanaClassicListing.owner===owner&&String(S.me?.id||'')+':'+String(S.token||'')===owner?value:null;
}
async function ohanaOpenClassicListing(){
 const token=S.token,owner=S.me?.id,room=S.room,roomEpoch=S.roomEpoch||0;
 const session=()=>S.token===token&&S.me?.id===owner&&S.room===room&&(S.roomEpoch||0)===roomEpoch;
 goHomePorch();const nav=window.OhanaScreenHistory?.navigationEpoch?.()??null;
 const navigation=()=>session()&&(nav===null||window.OhanaScreenHistory?.navigationEpoch?.()===nav);
 await new Promise(r=>setTimeout(r,0));if(!navigation())return;
 const context=bridgeGameContext(),shelf=S.gameShelf,granny=S.granny,color=S.colorBook,lobby=PZ.lobby;
 const current=()=>navigation()&&context.valid()&&S.gameShelf===shelf&&S.granny===granny&&S.colorBook===color&&PZ.lobby===lobby;
 await PP.check();if(!current())return;
 await PP.open(current);if(!current())return;
 const frame=document.querySelector('#pp-frame');if(!frame)throw Error('Could not open MOMopoly. Please try again.');
 const active=()=>current()&&frame.isConnected&&document.querySelector('#pp-frame')===frame;
 let requested=false;
 for(let n=0;n<80;n++){
  if(!active())return;
  const s=window.__ppHost?.snapshot();if(s?.mode==='classic')return;
  if(!requested&&s?.view==='board'&&s.actions.some(a=>a.id==='classic-controls'&&!a.disabled&&!a.hidden))requested=window.__ppHost.command('classic-controls');
  await new Promise(r=>setTimeout(r,150));if(!active())return;
 }
 if(active())throw Error('MOMopoly opened. Choose Classic to see your family board.');
}
async function ohanaAppendClassicListing(list,onOpen){
 const owner=S.me?.id,token=S.token,room=S.room,epoch=S.roomEpoch||0,data=await ohanaReadClassicListing();if(!list.isConnected||S.me?.id!==owner||S.token!==token||S.room!==room||(S.roomEpoch||0)!==epoch||!data)return;
 list.querySelector('[data-private-classic-listing]')?.remove();list.querySelector('.ohana-home-games-empty,[data-own-games-empty]')?.remove();
 const row=document.createElement('section');row.className='ohana-home-game-group';row.dataset.privateClassicListing='1';
 const title=document.createElement('h3');title.textContent='MOMopoly · Classic';
 const body=document.createElement('article');body.className='ohana-home-game-row';const info=document.createElement('div');
 const people=document.createElement('strong');people.className='ohana-home-opponents';people.textContent=data.players.map(p=>p.name).join(', ');
 const turn=document.createElement('small');turn.className='ohana-home-turn';turn.textContent=data.players[data.turn]?.id===data.actor?'Your turn':(data.players[data.turn]?.name||'Family')+'’s turn';
 const go=document.createElement('button');go.type='button';go.textContent='Open';go.setAttribute('aria-label','Open MOMopoly Classic with '+data.players.map(p=>p.name).join(', '));
 go.onclick=async()=>{if(go.disabled)return;go.disabled=true;try{await onOpen();}catch(e){if(row.isConnected)turn.textContent=e.message;else toast(e.message);}finally{go.disabled=false;}};
 info.append(people,turn);body.append(info,go);row.append(title,body);list.prepend(row);
}
