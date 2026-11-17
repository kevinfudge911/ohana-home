// Existing room-authorized discovery only. Do not infer participation from room membership.
const ohanaPuzzleListings={key:null,at:0,value:[],pending:null};
function ohanaMyPuzzles(puzzles,member){return(puzzles||[]).filter(p=>!p.done&&p.status!=='finished'&&p.status!=='deleted'&&p.status!=='memory'&&(Number(p.created_by)===Number(member)||Object.prototype.hasOwnProperty.call(p.stats||{},String(member))||(p.people||[]).some(x=>Number(x.id)===Number(member))));}
async function ohanaReadPuzzleListings(){
 const rooms=[...new Set((S.sync?.rooms||[{id:S.room}]).map(r=>Number(r.id)).filter(id=>Number.isSafeInteger(id)&&id>0))],token=S.token,member=S.me?.id,key=JSON.stringify([token,member,rooms]);if(!token||!member)return[];
 if(ohanaPuzzleListings.key!==key)Object.assign(ohanaPuzzleListings,{key,at:0,value:[],pending:null});
 if(ohanaPuzzleListings.pending)return ohanaPuzzleListings.pending;
 if(Date.now()-ohanaPuzzleListings.at<5000)return ohanaPuzzleListings.value;
 const pending=Promise.all(rooms.map(async room=>{try{const d=await api('/api/puzzles',undefined,'GET',room);return ohanaMyPuzzles(d.puzzles,member).map(p=>({...p,room_id:room}));}catch{return[];}})).then(groups=>[...new Map(groups.flat().map(p=>[p.id,p])).values()]);
 ohanaPuzzleListings.pending=pending;const value=await pending;if(ohanaPuzzleListings.key===key){ohanaPuzzleListings.value=value;ohanaPuzzleListings.at=Date.now();ohanaPuzzleListings.pending=null;}return value;
}
async function ohanaAppendPuzzleListings(list,onOpen){
 const token=S.token,member=S.me?.id,rooms=JSON.stringify(S.sync?.rooms?.map(r=>r.id)||[S.room]),puzzles=await ohanaReadPuzzleListings();if(!list.isConnected||S.token!==token||S.me?.id!==member||rooms!==JSON.stringify(S.sync?.rooms?.map(r=>r.id)||[S.room])||!puzzles.length)return;
 list.querySelector('[data-my-puzzle-listings]')?.remove();list.querySelector('.ohana-home-games-empty,[data-own-games-empty]')?.remove();
 const group=document.createElement('section');group.className='ohana-home-game-group';group.dataset.myPuzzleListings='1';const title=document.createElement('h3');title.textContent='Ohana United · Puzzles';group.append(title);
 for(const p of puzzles){const row=document.createElement('article');row.className='ohana-home-game-row';const info=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('small'),go=document.createElement('button');name.textContent=p.name||'Family puzzle';name.className='ohana-home-opponents';detail.className='ohana-home-turn';detail.textContent=Math.round((p.locked||0)/Math.max(1,p.total||1)*100)+'% together · '+((S.sync?.rooms||[]).find(r=>Number(r.id)===Number(p.room_id))?.name||'Ohana');go.type='button';go.textContent='Open';go.setAttribute('aria-label','Open puzzle '+name.textContent);go.onclick=async()=>{if(go.disabled)return;go.disabled=true;try{await onOpen(p);}catch(e){if(row.isConnected)detail.textContent=e.message;else toast(e.message);}finally{go.disabled=false;}};info.append(name,detail);row.append(info,go);group.append(row);}list.append(group);
}
