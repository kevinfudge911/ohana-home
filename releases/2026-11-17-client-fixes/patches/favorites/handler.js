async function profileFavoritesApi(req,db,me,roomId,body){
  const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'private, no-store'}});
  if(!me||!Number.isSafeInteger(me.id)||me.id<=0)return reply({error:'Please sign in.'},401);
  if(!['GET','POST'].includes(req.method))return reply({error:'Use GET or POST.'},405);
  const roomGuard="EXISTS(SELECT 1 FROM rooms r JOIN room_members own ON own.room_id=r.id JOIN members owner ON owner.id=own.member_id WHERE r.id=? AND own.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>''))";
  if(!Number.isSafeInteger(roomId)||roomId<=0||!await db.prepare('SELECT 1 AS allowed WHERE '+roomGuard).bind(roomId,me.id).first())return reply({error:'This room is no longer available.'},403);
  if(req.method==='POST'){
    if(!body||!Number.isSafeInteger(body.member_id)||body.member_id<=0||body.member_id===me.id||typeof body.favorite!=='boolean')return reply({error:'Choose another member and a favorite setting.'},400);
    // One row per owner/target: distinct favorites never overwrite each other.
    // Authorization is rechecked within the mutation, not just before it.
    const changed=await db.prepare("INSERT INTO settings(key,value) SELECT ?,? WHERE "+roomGuard+" AND EXISTS(SELECT 1 FROM room_members target JOIN members m ON m.id=target.member_id WHERE target.room_id=? AND target.member_id=?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind('profile_favorite_'+me.id+'_'+body.member_id,body.favorite?'1':'0',roomId,me.id,roomId,body.member_id).run();
    if(!changed.meta?.changes)return reply({error:'That member or room is no longer available.'},403);
  }
  const rows=await db.prepare("SELECT DISTINCT m.id FROM members m JOIN room_members target ON target.member_id=m.id JOIN settings favorite ON favorite.key='profile_favorite_'||?||'_'||m.id AND favorite.value='1' WHERE target.room_id=? AND m.id<>? AND "+roomGuard+" ORDER BY m.id").bind(me.id,roomId,me.id,roomId,me.id).all();
  return reply({ok:true,member_ids:(rows.results||[]).map(row=>row.id)});
}
