// Private per-member word-puzzle summaries. Reading never changes saved answers.
const ohanaGrannyListings={owner:null,at:0,rows:[],pending:null};
function ohanaGrannyLocal(member){if(GR.owner===member&&GR.book?.records)return GR.book.records;try{return JSON.parse(localStorage.getItem('ohana_granny_v1_'+member)||'null')?.records||{};}catch{return{};}}
function ohanaGrannyMerge(remote,local){const records=Object.fromEntries((remote||[]).map(r=>[r.key,{state:r.state,revision:r.revision,changed:r.updated_at}]));for(const[key,r]of Object.entries(local||{}))if(r?.dirty||!records[key])records[key]=r;return Object.entries(records).filter(([key,r])=>/^(crossword|wordfind|wordmix)-/.test(key)&&r?.state&&!r.state.finished&&grKinds[r.state.kind]&&grDefinition(r)).sort((a,b)=>(b[1].changed||0)-(a[1].changed||0));}
async function ohanaReadGrannyListings(){
 const member=S.me?.id,token=S.token,owner=JSON.stringify([member,token]);if(!member||!token)return[];
 if(ohanaGrannyListings.owner!==owner)Object.assign(ohanaGrannyListings,{owner,at:0,rows:[],pending:null});
 if(!ohanaGrannyListings.pending&&Date.now()-ohanaGrannyListings.at>=5000){const pending=api('/api/granny',undefined,'GET').then(d=>d.records||[]);ohanaGrannyListings.pending=pending;try{const rows=await pending;if(ohanaGrannyListings.owner===owner){ohanaGrannyListings.rows=rows;ohanaGrannyListings.at=Date.now();}}catch{}finally{if(ohanaGrannyListings.owner===owner)ohanaGrannyListings.pending=null;}}
 else if(ohanaGrannyListings.pending){try{await ohanaGrannyListings.pending;}catch{}}
 if(S.me?.id!==member||S.token!==token||ohanaGrannyListings.owner!==owner)return[];return ohanaGrannyMerge(ohanaGrannyListings.rows,ohanaGrannyLocal(member));
}
async function ohanaOpenGrannyListing(key){
 const token=S.token,member=S.me?.id;openGranny();const visit=GR.entryVisit,nav=window.OhanaScreenHistory?.navigationEpoch?.();
 const current=()=>S.token===token&&S.me?.id===member&&S.granny&&GR.owner===member&&GR.entryVisit===visit&&GR.record===null&&window.OhanaScreenHistory?.navigationEpoch?.()===nav;
 for(let n=0;n<100&&GR.loading;n++){await new Promise(r=>setTimeout(r,100));if(!current())return;}
 if(!current())return;if(GR.loading)throw Error('Your saved puzzles are still loading. Choose your puzzle when loading finishes.');
 const record=GR.book?.records[key];if(!record||record.state.finished)throw Error('That puzzle is no longer in progress. Your saved puzzles are still available.');grOpen(key);
}
async function ohanaAppendGrannyListings(list,onOpen){
 const token=S.token,member=S.me?.id,room=S.room,epoch=S.roomEpoch,rows=await ohanaReadGrannyListings();if(!list.isConnected||S.token!==token||S.me?.id!==member||S.room!==room||S.roomEpoch!==epoch||!rows.length)return;
 list.querySelector('[data-my-granny-listings]')?.remove();list.querySelector('.ohana-home-games-empty,[data-own-games-empty]')?.remove();const group=document.createElement('section');group.dataset.myGrannyListings='1';group.className='ohana-home-game-group';const heading=document.createElement('header');heading.className='ohana-home-game-group-title';const title=document.createElement('h3'),count=document.createElement('span');title.textContent='Ohana Granny’s · Saved puzzles';count.textContent=String(rows.length);heading.append(title,count);group.append(heading);
 for(const[key,record]of rows){const row=document.createElement('article');row.className='ohana-home-game-row';const info=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('small'),go=document.createElement('button');name.className='ohana-home-opponents';name.textContent=grKinds[record.state.kind]+' · Puzzle '+(record.state.puzzleNumber||1);detail.className='ohana-home-turn';detail.textContent=(GR_CATALOG[record.state.theme]?.title||'Saved puzzle')+' · '+grProgress(record);go.type='button';go.textContent='Open';go.setAttribute('aria-label','Open '+name.textContent);go.onclick=async()=>{if(go.disabled||!list.isConnected||S.token!==token||S.me?.id!==member)return;go.disabled=true;try{await onOpen(key);}catch(e){if(row.isConnected)detail.textContent=e.message;else toast(e.message);}finally{go.disabled=false;}};info.append(name,detail);row.append(info,go);group.append(row);}list.append(group);
}
