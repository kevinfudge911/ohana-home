/** Existing worker auth + existing membership schema; separate from room's 13-file media contract. */
export function createPePawRoute({auth,roomId=null,ownerMemberId=null}){
 const valid=n=>Number.isSafeInteger(Number(n))&&Number(n)>0;
 const headers={'Cache-Control':'private, no-store','Vary':'Authorization','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin'};
 const deny=n=>new Response('Unavailable',{status:n,headers});
 return async(req,env)=>{
  const u=new URL(req.url);if(!u.pathname.startsWith('/api/ohana-character/'))return null;
  if(!valid(roomId)||!valid(ownerMemberId)||u.pathname!==`/api/ohana-character/rooms/${Number(roomId)}/pepaw.png`)return deny(404);
  if(req.method!=='GET')return deny(405);
  if(u.search||env?.__ohanaInviteMe||!/^Bearer \S+$/.test(req.headers.get('Authorization')||''))return deny(401);
  try{const me=await auth(req,env);if(!me)return deny(401);
   const row=await env.DB.prepare("SELECT r.id FROM rooms r JOIN room_members viewer ON viewer.room_id=r.id JOIN room_members owner ON owner.room_id=r.id WHERE r.id=? AND viewer.member_id=? AND owner.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')").bind(Number(roomId),me.id,Number(ownerMemberId)).first();
   if(!row)return deny(404);const object=await env.DUCKVILLE_PRIVATE?.get(String(env.DUCKVILLE_PRIVATE_PREFIX||'ohana-gathering/').replace(/\/?$/,'/')+'pepaw-firefighter-cardinal.png');if(!object)return deny(404);
   return new Response(await object.arrayBuffer(),{headers:{...headers,'Content-Type':'image/png'}});
  }catch{return deny(503)}
 };
}
