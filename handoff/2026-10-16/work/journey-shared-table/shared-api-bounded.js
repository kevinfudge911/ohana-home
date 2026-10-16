const SHARED_COLOR_STATIC_PAGES=["honu","hibiscus","palm","canoe","splash","pineapple","sandcastle","home"];
const SHARED_COLOR_PREFIX_PAGES=["buddy:honu","buddy:eddie","buddy:splash","buddy:kiko","buddy:pebble","buddy:mango","buddy:sunny","buddy:otto","buddy:pippa","buddy:lulu","buddy:hoot","buddy:flutter","buddy:rosie","buddy:koa","buddy:milo","buddy:bamboo","buddy:coco","buddy:finn","buddy:inky","buddy:kai","buddy:flora","buddy:reef","adult:hibiscus-mandala","adult:honu-mandala","adult:ohana-wreath","adult:ocean-waves","adult:palm-leaves","adult:coral-reef","adult:ukulele","adult:hummingbird","adult:dolphins","adult:island-tribal","adult:surf-day","adult:pineapple-mandala","adult:beach-cottage","adult:seashells","adult:orchids","adult:family-tree","adult:sunset-sail","adult:hawaiian-quilt"];
/* Private candidate: additive, room-scoped coloring operations. */
async function sharedColoringApi(req,env,url){
 const headers={'cache-control':'private,no-store','x-content-type-options':'nosniff'},reply=(d,status=200)=>Response.json(d,{status,headers});
 const me=await auth(req,env);if(!me)return reply({error:'Sign in to color with your Ohana.'},401);
 const roomId=Number(req.headers.get('x-ohana-room')||url.searchParams.get('room'));if(!Number.isSafeInteger(roomId)||roomId<1)return reply({error:'Choose a family room.'},400);
 const db=env.DB,room=await db.prepare("SELECT r.id,r.name,r.owner_id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')").bind(roomId,me.id).first();if(!room)return reply({error:'This coloring table belongs to another family room.'},403);
 const canManage=!!me.is_admin||(room.id!==1&&room.owner_id===me.id);
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_tables(room_id INTEGER PRIMARY KEY,active_page TEXT NOT NULL)').run();
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_pages(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,page_key TEXT NOT NULL,created_by INTEGER NOT NULL,request_id TEXT NOT NULL,created_at INTEGER NOT NULL,UNIQUE(room_id,created_by,request_id))').run();
 await db.prepare('CREATE TABLE IF NOT EXISTS coloring_shared_ops(seq INTEGER PRIMARY KEY AUTOINCREMENT,page_id TEXT NOT NULL,member_id INTEGER NOT NULL,client_id TEXT NOT NULL,kind TEXT NOT NULL,payload TEXT NOT NULL,undo_target INTEGER,created_at INTEGER NOT NULL,UNIQUE(page_id,member_id,client_id))').run();
 await db.prepare('CREATE INDEX IF NOT EXISTS coloring_shared_ops_page ON coloring_shared_ops(page_id,seq)').run();
 const current=await db.prepare('SELECT p.* FROM coloring_shared_tables t JOIN coloring_shared_pages p ON p.id=t.active_page WHERE t.room_id=?').bind(roomId).first();
 const cleanOp=o=>({seq:o.seq,member_id:o.member_id,client_id:o.client_id,kind:o.kind,payload:JSON.parse(o.payload),undo_target:o.undo_target,created_at:o.created_at});
 if(req.method==='GET'){
  const requested=url.searchParams.get('page'),page=requested?await db.prepare('SELECT * FROM coloring_shared_pages WHERE id=? AND room_id=?').bind(requested,roomId).first():current;if(requested&&!page)return reply({error:'That picture is not in this family room.'},404);
  const since=Number(url.searchParams.get('since')||0);if(!Number.isSafeInteger(since)||since<0)return reply({error:'Invalid coloring position.'},400);if(!page)return reply({page:null,activePage:null,ops:[],more:false,canManage,me:{id:me.id,name:me.name}});
  const rows=(await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND seq>? ORDER BY seq LIMIT 201').bind(page.id,since).all()).results;return reply({page,activePage:current?.id||null,ops:rows.slice(0,200).map(cleanOp),more:rows.length>200,canManage,me:{id:me.id,name:me.name}});
 }
 if(req.method!=='POST')return reply({error:'Unsupported coloring action.'},405);
 const raw=await req.text();if(raw.length>180000)return reply({error:'That marker line is too long. Try a shorter line.'},413);let body;try{body=JSON.parse(raw);}catch{return reply({error:'Invalid coloring action.'},400);}if(!body||typeof body!=='object'||Array.isArray(body))return reply({error:'Invalid coloring action.'},400);
 const validId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{8,80}$/.test(x);
 if(body.action==='open'){
  if(!canManage)return reply({error:'The room owner chooses the shared picture.'},403);if(!validId(body.clientId)||typeof body.pageKey!=='string'||!isSharedColorPage(body.pageKey))return reply({error:'Choose one of Ohana Journey’s pictures.'},400);
  const old=await db.prepare('SELECT * FROM coloring_shared_pages WHERE room_id=? AND created_by=? AND request_id=?').bind(roomId,me.id,body.clientId).first();if(old)return current?.id===old.id?reply({page:old,activePage:old.id,canManage}):reply({error:'The family table has moved to another picture.',activePage:current?.id||null},409);
  if((body.expectedPage||null)!==(current?.id||null))return reply({error:'Someone changed the family picture. Open it again first.',activePage:current?.id||null},409);
  const page={id:crypto.randomUUID(),room_id:roomId,page_key:body.pageKey,created_by:me.id,request_id:body.clientId,created_at:Date.now()};await db.prepare('INSERT INTO coloring_shared_pages(id,room_id,page_key,created_by,request_id,created_at) VALUES(?,?,?,?,?,?)').bind(page.id,roomId,page.page_key,me.id,body.clientId,page.created_at).run();
  const result=current?await db.prepare('UPDATE coloring_shared_tables SET active_page=? WHERE room_id=? AND active_page=?').bind(page.id,roomId,current.id).run():await db.prepare('INSERT OR IGNORE INTO coloring_shared_tables(room_id,active_page) VALUES(?,?)').bind(roomId,page.id).run();if(!result.meta?.changes)return reply({error:'Someone changed the family picture. Open it again first.'},409);return reply({page,activePage:page.id,canManage});
 }
 if(body.action!=='op'||!validId(body.clientId)||typeof body.pageId!=='string')return reply({error:'Invalid coloring action.'},400);
 const page=await db.prepare('SELECT * FROM coloring_shared_pages WHERE id=? AND room_id=?').bind(body.pageId,roomId).first();if(!page)return reply({error:'That picture is not in this family room.'},404);
 const prior=await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND member_id=? AND client_id=?').bind(page.id,me.id,body.clientId).first();if(prior)return reply({op:cleanOp(prior),activePage:current?.id||null});
 let payload={},target=null;const kind=body.kind;
 if(kind==='fill'){if(!Number.isInteger(body.payload?.region)||body.payload.region<0||body.payload.region>10000||!/^#[0-9a-f]{6}$/i.test(body.payload?.color||''))return reply({error:'Invalid fill.'},400);payload={region:body.payload.region,color:body.payload.color.toLowerCase()};}
 else if(kind==='stroke'){const s=body.payload;if(!s||!/^#[0-9a-f]{6}$/i.test(s.color||'')||![5,12,22,40].includes(s.size)||typeof s.erase!=='boolean'||!Array.isArray(s.pts)||!s.pts.length||s.pts.length>5000||s.pts.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||v< -400||v>800)))return reply({error:'Invalid marker line.'},400);payload={color:s.color.toLowerCase(),size:s.size,erase:s.erase,pts:s.pts.map(p=>p.map(v=>Math.round(v*10)/10))};}
 else if(kind==='clear'){if(!canManage)return reply({error:'Only the room owner can clear everyone’s picture.'},403);}
 else if(kind==='undo'){
  const last=await db.prepare("SELECT o.seq FROM coloring_shared_ops o WHERE o.page_id=? AND o.member_id=? AND o.kind IN('fill','stroke') AND o.seq>COALESCE((SELECT MAX(seq) FROM coloring_shared_ops WHERE page_id=? AND kind='clear'),0) AND NOT EXISTS(SELECT 1 FROM coloring_shared_ops u WHERE u.page_id=o.page_id AND u.undo_target=o.seq) ORDER BY o.seq DESC LIMIT 1").bind(page.id,me.id,page.id).first();if(!last)return reply({error:'There is no coloring of yours to undo.'},409);if(body.payload?.target!==last.seq)return reply({error:'Your latest coloring changed. Try Undo again.'},409);target=last.seq;
 }else return reply({error:'Invalid coloring tool.'},400);
 await db.prepare('INSERT OR IGNORE INTO coloring_shared_ops(page_id,member_id,client_id,kind,payload,undo_target,created_at) VALUES(?,?,?,?,?,?,?)').bind(page.id,me.id,body.clientId,kind,JSON.stringify(payload),target,Date.now()).run();const op=await db.prepare('SELECT * FROM coloring_shared_ops WHERE page_id=? AND member_id=? AND client_id=?').bind(page.id,me.id,body.clientId).first();return reply({op:cleanOp(op),activePage:current?.id||null});
}
function isSharedColorPage(key){
 return SHARED_COLOR_STATIC_PAGES.includes(key)||/^gen:(?:0|[1-9]\d{0,9})$/.test(key)&&Number(key.slice(4))<=4294967295||SHARED_COLOR_PREFIX_PAGES.includes(key);
}
