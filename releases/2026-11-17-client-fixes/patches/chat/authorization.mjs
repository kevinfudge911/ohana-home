/** Actual production stores; no caller-provided recipients. Read-only. */
export function createScopeResolver({db,puzzleNamespace,childPolicy,momoAllowed,env,legacyCatalog}){
 const first=(sql,...args)=>db.prepare(sql).bind(...args).first();
 const people=async room=>(await db.prepare('SELECT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?').bind(room).all()).results;
 return async(actor,key)=>{
  if(!Number.isSafeInteger(actor?.id)||actor.id<1)return null;
  let match=key.match(/^direct:(\d+),(\d+)$/);
  if(match){const ids=match.slice(1).map(Number);if(ids[0]>=ids[1]||!ids.includes(actor.id))return null;
   const shared=await first('SELECT a.room_id FROM room_members a JOIN room_members b ON b.room_id=a.room_id WHERE a.member_id=? AND b.member_id=? LIMIT 1',...ids);if(!shared)return null;
   const members=(await people(shared.room_id)).filter(p=>ids.includes(p.id));return members.length===2?{key,people:members,roomId:shared.room_id,label:'Private message'}:null;
  }
  if(key.startsWith('people:')){
   if(!legacyCatalog)return null;const catalog=await legacyCatalog(db,actor),thread=catalog.threads.get(key);
   return thread?{...thread,label:thread.name}:null;
  }
  if(key==='classic:1'||key==='journey:1'){
   if(!momoAllowed||!await momoAllowed(env,actor))return null;
   const row=await first('SELECT data FROM momo_saves WHERE key=?',key==='classic:1'?'classic:family:1':'room:family');if(!row)return null;
   let ids;try{const data=JSON.parse(row.data);ids=(key==='classic:1'?data.players:data.room.players).map(p=>/^member-(\d+)$/.exec(p.id)).filter(Boolean).map(m=>Number(m[1]));}catch{return null;}
   if(!ids.includes(actor.id))return null;
   const members=[];for(const id of ids){const p=await first('SELECT id,name,avatar FROM members WHERE id=?',id);if(p&&await momoAllowed(env,p))members.push(p);}
   return {key,people:members,label:key==='classic:1'?'MOMopoly Classic game':'MOMopoly family game'};
  }
  match=key.match(/^(room|game|puzzle):(\d+)$/);if(!match)return null;const [,kind,raw]=match,id=Number(raw);if(!Number.isSafeInteger(id)||id<1)return null;
  let room=id,record,ids;
  if(kind==='game'){
   record=await first('SELECT id,room_id,players,type FROM games WHERE id=?',id);if(!record)return null;room=record.room_id;
   try{ids=JSON.parse(record.players).filter(p=>Number.isSafeInteger(p)&&p>0);}catch{return null;}
   if(!ids.includes(actor.id))return null;const policy=await childPolicy(db,actor.id);if(policy&&!policy.games?.includes(record.type))return null;
  }else if(kind==='puzzle'){
   record=await first("SELECT id,room_id,name,created_by FROM puzzles WHERE id=? AND status!='deleted'",id);if(!record)return null;room=record.room_id;
  }
  if(!await first('SELECT 1 AS ok FROM room_members WHERE room_id=? AND member_id=?',room,actor.id))return null;
  let members=await people(room);
  if(kind==='game'){
   members=members.filter(p=>ids.includes(p.id));const allowed=[];for(const p of members){const policy=await childPolicy(db,p.id);if(!policy||policy.games?.includes(record.type))allowed.push(p);}members=allowed;
  }
  if(kind==='puzzle'){
   // Current visitors + durable contributors + creator. No other room member receives puzzle-only talk.
   const response=await puzzleNamespace.get(puzzleNamespace.idFromName('puzzle-'+id)).fetch('https://puzzle/summary');if(!response.ok)return null;
   const summary=await response.json();ids=new Set([record.created_by,...(summary.people||[]).map(p=>Number(p.id)),...Object.keys(summary.stats||{}).map(Number)]);members=members.filter(p=>ids.has(p.id));
  }
  if(!members.some(p=>p.id===actor.id))return null;
  return {key,roomId:room,people:members,label:kind==='room'?'Room message':kind==='game'?'Game message':'Puzzle: '+record.name};
 };
}
