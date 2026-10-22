// Media is saved only with an explicit Send. No staging upload can broadcast.
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const LIMIT=8*1024*1024,PART=1024*1024;
const headers={'cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(body,status=200)=>Response.json(body,{status,headers});
const jpeg=data=>{const b=new Uint8Array(data);return b.length>=4&&b[0]===255&&b[1]===216&&b[b.length-2]===255&&b[b.length-1]===217;};
const digest=async data=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',data))].map(n=>n.toString(16).padStart(2,'0')).join('');
async function schema(db){await db.batch([
 db.prepare('CREATE TABLE IF NOT EXISTS megaphone_media(id TEXT PRIMARY KEY,room_id INTEGER NOT NULL,author_id INTEGER NOT NULL,announcement_id INTEGER NOT NULL,mime TEXT NOT NULL,data BLOB NOT NULL,thumbnail BLOB NOT NULL)'),
 db.prepare('CREATE TABLE IF NOT EXISTS megaphone_media_parts(media_id TEXT NOT NULL,part INTEGER NOT NULL,data BLOB NOT NULL,PRIMARY KEY(media_id,part))'),
 db.prepare('CREATE TABLE IF NOT EXISTS megaphone_media_sends(room_id INTEGER NOT NULL,author_id INTEGER NOT NULL,request_id TEXT NOT NULL,signature TEXT NOT NULL,announcement_id INTEGER NOT NULL,PRIMARY KEY(room_id,author_id,request_id))')
]);}
async function saved(db,me,room,requestId,signature){
 const row=await db.prepare('SELECT signature,announcement_id FROM megaphone_media_sends WHERE room_id=? AND author_id=? AND request_id=?').bind(room,me.id,requestId).first();if(!row)return null;
 if(row.signature!==signature)return reply({error:'This Send request changed. Review the announcement and send again.'},409);
 const a=await db.prepare("SELECT a.id,a.text,a.author_id AS member_id,a.name,a.avatar,a.created_at,media.images FROM megaphone_announcements a JOIN megaphone_attachments media ON media.announcement_id=a.id WHERE a.id=? AND a.room_id=? AND a.author_id=?").bind(row.announcement_id,room,me.id).first();
 if(!a)return reply({error:'Could not confirm the saved announcement. Check your announcement history.'},409);
 const count=await db.prepare('SELECT COUNT(*) AS n FROM megaphone_recipients WHERE announcement_id=?').bind(a.id).first();return reply({ok:true,already_sent:true,announcement:{...a,images:JSON.parse(a.images),recipient_count:count.n,responses_enabled:true}});
}
export async function handleAnnouncementMedia(req,{db,me,room,roomAccess,normalize,ensureSchema}){
 const url=new URL(req.url),path=url.pathname;
 // The enclosing API supplies the existing auth, child policy and room context.
 if(!me)return reply({error:'Sign in to open announcement media.'},401);
 if(Number(req.headers.get('x-ohana-room'))!==room||!await roomAccess(db,room,me.id))return reply({error:'This announcement is not in your current room.'},403);
 await ensureSchema(db);await schema(db);
 const match=path.match(/^\/api\/announce-media\/([a-f0-9-]{36})$/);
 if(match&&UUID.test(match[1])&&req.method==='GET'){
  const thumbnail=url.searchParams.has('thumbnail');
  const row=await db.prepare('SELECT m.id,m.mime,'+(thumbnail?'m.thumbnail':'m.data')+' AS bytes FROM megaphone_media m WHERE m.id=? AND m.room_id=? AND (m.author_id=? OR EXISTS(SELECT 1 FROM megaphone_recipients r WHERE r.announcement_id=m.announcement_id AND r.member_id=?))').bind(match[1],room,me.id,me.id).first();
  if(!row)return reply({error:'This announcement media is unavailable.'},404);
  let data=new Uint8Array(row.bytes);
  if(!thumbnail&&row.mime.startsWith('video/')){const count=await db.prepare('SELECT COUNT(*) AS n FROM megaphone_media_parts WHERE media_id=?').bind(row.id).first();if(!count.n||count.n>8)return reply({error:'This video is unavailable.'},404);const parts=[];let size=0;for(let i=0;i<count.n;i++){const part=await db.prepare('SELECT data FROM megaphone_media_parts WHERE media_id=? AND part=?').bind(row.id,i).first();if(!part)return reply({error:'This video is unavailable.'},404);const b=new Uint8Array(part.data);parts.push(b);size+=b.length;}data=new Uint8Array(size);let offset=0;for(const part of parts){data.set(part,offset);offset+=part.length;}}
  return new Response(data,{headers:{...headers,'content-type':thumbnail?'image/jpeg':row.mime,'content-length':String(data.length)}});
 }
 if(path!=='/api/announce-media/send'||req.method!=='POST')return reply({error:'Use explicit Send for announcement media.'},405);
 const access=await db.prepare('SELECT value FROM settings WHERE key=?').bind('announce_access_'+room+'_'+me.id).first();
 if(!me.is_admin&&access?.value!=='1')return reply({error:'Ask an administrator for shout-out access in this room.'},403);
 if(Number(req.headers.get('content-length'))>LIMIT+300000)return reply({error:'Choose photos/videos totaling up to 8 MB.'},413);
 const form=await req.formData(),requestId=String(form.get('request_id')||''),text=String(form.get('text')||'').trim(),count=Number(form.get('media_count'));
 if(form.get('intent')!=='send'||!UUID.test(requestId)||!text||text.length>300||!Number.isInteger(count)||count<1||count>2)return reply({error:'Review the announcement, then choose Send.'},400);
 let images;try{images=normalize(JSON.parse(String(form.get('images')||'[]')));}catch{return reply({error:'Choose an available announcement picture.'},400);}
 if(images.some(i=>i.src.startsWith('/api/'))||images.length+count>2)return reply({error:'Choose up to two pictures/videos, including the Menu notice.'},400);
 const files=[];let total=0;
 for(let i=0;i<count;i++){
  const file=form.get('media_'+i),thumbnail=form.get('thumbnail_'+i);if(!file?.arrayBuffer||!thumbnail?.arrayBuffer)return reply({error:'Choose a photo or video and its preview.'},400);
  const video=['video/mp4','video/webm'].includes(file.type),mime=video?file.type:'image/jpeg';total+=file.size;
  if(file.size<4||file.size>(video?LIMIT:900000)||thumbnail.size<4||thumbnail.size>100000||total>LIMIT)return reply({error:'Photos/videos must total up to 8 MB; choose photos again to resize them.'},413);
  const data=new Uint8Array(await file.arrayBuffer()),thumb=new Uint8Array(await thumbnail.arrayBuffer());
  const valid=video?(mime==='video/mp4'?data.length>=12&&String.fromCharCode(...data.slice(4,8))==='ftyp':data[0]===26&&data[1]===69&&data[2]===223&&data[3]===163):jpeg(data);
  if(!valid||!jpeg(thumb))return reply({error:'Choose JPG photos or supported MP4/WebM videos.'},400);
  files.push({id:crypto.randomUUID(),mime,data,thumb,alt:String(form.get('alt_'+i)||'Announcement '+(video?'video':'photo')).slice(0,160),hash:await digest(data),thumbHash:await digest(thumb)});
 }
 const signature=await digest(new TextEncoder().encode(JSON.stringify({text,images,files:files.map(f=>[f.mime,f.alt,f.hash,f.thumbHash])})));const previous=await saved(db,me,room,requestId,signature);if(previous)return previous;
 for(let attempt=0;attempt<2;attempt++){
  const accessNow=await db.prepare('SELECT value FROM settings WHERE key=?').bind('announce_access_'+room+'_'+me.id).first();if(!await roomAccess(db,room,me.id)||!me.is_admin&&accessNow?.value!=='1')return reply({error:'Your room or shout-out access changed.'},403);
  const maximum=await db.prepare('SELECT MAX(id) AS id FROM megaphone_announcements').first(),createdAt=Date.now(),id=Math.max(createdAt,Number(maximum?.id||0)+1),attachments=[...images,...files.map(f=>({src:'/api/announce-media/'+f.id,alt:f.alt,mime:f.mime}))],announcement={id,text,member_id:me.id,name:String(me.name||''),avatar:String(me.avatar||''),created_at:createdAt,responses_enabled:true,images:attachments};
  const statements=[db.prepare('INSERT INTO megaphone_announcements(id,room_id,author_id,text,name,avatar,created_at) VALUES(?,?,?,?,?,?,?)').bind(id,room,me.id,text,announcement.name,announcement.avatar,createdAt),db.prepare('INSERT INTO megaphone_attachments(announcement_id,images) VALUES(?,?)').bind(id,JSON.stringify(attachments)),db.prepare('INSERT INTO megaphone_recipients(announcement_id,member_id) SELECT ?,member_id FROM room_members WHERE room_id=? AND member_id<>?').bind(id,room,me.id),db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind('announce_room_'+room,JSON.stringify(announcement)),db.prepare('INSERT INTO megaphone_media_sends(room_id,author_id,request_id,signature,announcement_id) VALUES(?,?,?,?,?)').bind(room,me.id,requestId,signature,id)];
  for(const file of files){const video=file.mime.startsWith('video/');statements.push(db.prepare('INSERT INTO megaphone_media(id,room_id,author_id,announcement_id,mime,data,thumbnail) VALUES(?,?,?,?,?,?,?)').bind(file.id,room,me.id,id,file.mime,video?new Uint8Array([0]):file.data,file.thumb));if(video)for(let offset=0,part=0;offset<file.data.length;offset+=PART,part++)statements.push(db.prepare('INSERT INTO megaphone_media_parts(media_id,part,data) VALUES(?,?,?)').bind(file.id,part,file.data.slice(offset,offset+PART)));}
  try{const writes=await db.batch(statements);return reply({ok:true,announcement:{...announcement,recipient_count:Number(writes[2]?.meta?.changes||0)}},201);}catch(error){const retry=await saved(db,me,room,requestId,signature);if(retry)return retry;if(attempt)throw error;}
 }
}
