// Existing-save discovery and resume. No initialization, insert, update, or reset.
import { validateState, regenerate } from './engine.mjs';
import { validateRoom } from './shared.mjs';
const headers={'content-type':'application/json','cache-control':'private, no-store','x-robots-tag':'noindex'};
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
export const savedBoot="if(NET){setInterval(netPoll,5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)netPoll();});netLoadSolo();classicProbe();}";
export function resumePage(html,view){
 if(html.split(savedBoot).length!==2)throw Error('Unsupported saved-game template');
 const literal=JSON.stringify(view).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const boot="if(NET){netApply("+literal+");saveWarning='';render();setInterval(netPoll,5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)netPoll();});classicProbe();}";
 const old=".classic-mode .family-desk > :not(#classic-open):not(#classic-controls-root):not(#solo-mode){display:none}";
 const fixed=".classic-mode .family-desk > :not(#classic-open):not(#classic-controls-root):not(#solo-mode):not(#classic-new){display:none}";
 return (html.split(old).length===2?html.replace(old,fixed):html).replace(savedBoot,boot);
}
export async function savedRoute({db,env,me,sub,objectKey}){
 const exists=await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='momo_saves'").first();
 if(!exists)return sub==='saved'?reply({games:[]}):reply({error:'This saved game is no longer available.'},404);
 const read=async key=>{const row=await db.prepare('SELECT version, data FROM momo_saves WHERE key = ?').bind(key).first();if(!row)return null;try{return {version:row.version,data:JSON.parse(row.data)};}catch{return null;}};
 const solo= sub==='saved'||sub==='game/saved-solo'?await read('solo:'+me.id):null;
 const family=sub==='saved'||sub==='game/saved-room'?await read('room:family'):null;
 const soloOK=solo&&validateState(solo.data?.game);
 const room=family?.data?.room,seat=room?.players?.findIndex(p=>p.id==='member-'+me.id)??-1;
 const roomOK=family&&validateRoom(room)&&seat>=0;
 if(sub==='saved'){
  const games=[];
  if(soloOK)games.push({mode:'solo',players:[{name:me.name||'My Journey'}],turn:0,myTurn:true});
  if(roomOK)games.push({mode:'room',players:room.players.map(p=>({name:p.name})),turn:room.activeIndex,myTurn:room.activeIndex===seat});
  return reply({games});
 }
 if(sub==='game/saved-solo'&&!soloOK||sub==='game/saved-room'&&!roomOK)return reply({error:'This saved game is no longer available.'},404);
 const view=sub==='game/saved-solo'?{mode:'solo',version:solo.version,state:regenerate(solo.data.game,Date.now())}:{mode:'room',saveVersion:family.version,room,mySeat:seat};
 const object=await env.DUCKVILLE_PRIVATE.get(objectKey);if(!object)return reply({error:'Saved game could not open.'},503);
 let page;try{page=resumePage(await object.text(),view);}catch{return reply({error:'Saved game could not open safely. Please try again later.'},503);}
 return new Response(page,{headers:{...headers,'content-type':'text/html; charset=utf-8'}});
}
