const MAX_FILE = 25 * 1024 * 1024;
const MEMBER_QUOTA = 250 * 1024 * 1024;
const LIBRARY_QUOTA = 8 * 1024 * 1024 * 1024;
const json = (data, status = 200) => Response.json(data, {status, headers: {'cache-control':'no-store'}});
const fault = (status, message) => { throw Object.assign(new Error(message), {musicStatus:status}); };
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2,'0')).join('');

export async function ensureMusicUploadSchema(db) {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS music_uploads(track_id TEXT PRIMARY KEY, room_id INTEGER NOT NULL, member_id INTEGER NOT NULL, object_key TEXT NOT NULL UNIQUE, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS music_uploads_member ON music_uploads(room_id,member_id)'),
    db.prepare('CREATE TABLE IF NOT EXISTS music_playback_tickets(hash TEXT PRIMARY KEY, track_id TEXT NOT NULL, room_id INTEGER NOT NULL, member_id INTEGER NOT NULL, expires_at INTEGER NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS music_playback_expiry ON music_playback_tickets(expires_at)')
  ]);
}

export function musicFileType(bytes, name) {
  const a = new Uint8Array(bytes), text = (start,end) => String.fromCharCode(...a.slice(start,end));
  const ext = String(name).split('.').pop().toLowerCase();
  if (ext==='mp3' && (text(0,3)==='ID3' || a[0]===255 && (a[1]&224)===224 && (a[1]&6)!==0)) return 'audio/mpeg';
  if (ext==='wav' && text(0,4)==='RIFF' && text(8,12)==='WAVE') return 'audio/wav';
  if (ext==='ogg' && text(0,4)==='OggS' && (text(28,35)==='\x01vorbis' || text(28,36)==='OpusHead')) return 'audio/ogg';
  if (ext==='m4a' && text(4,8)==='ftyp' && ['M4A ','M4B ','isom','mp42'].includes(text(8,12))) return 'audio/mp4';
  return null;
}

export async function handleMusicUpload(req, context) {
  const {db,me,room,bucket,ensureMusicSchema,audience,track,text,requestId} = context;
  let key, saved = false;
  try {
    if (req.method!=='POST') return json({error:'Use Add your song to upload a file.'},405);
    if (!bucket) return json({error:'Song uploads are temporarily unavailable. Please try again later.'},503);
    const origin=req.headers.get('origin');
    if (origin && origin!==new URL(req.url).origin) return json({error:'Open Ohana to add your song.'},403);
    if (Number(req.headers.get('content-length')) > MAX_FILE + 128*1024) return json({error:'Choose a song file no larger than 25 MB.'},413);
    let received=0;
    const limited=req.body?.pipeThrough(new TransformStream({transform(chunk,controller){received+=chunk.byteLength;if(received>MAX_FILE+128*1024)controller.error(Object.assign(new Error('Choose a song file no larger than 25 MB.'),{musicStatus:413}));else controller.enqueue(chunk);}}));
    const form=await new Response(limited,{headers:{'content-type':req.headers.get('content-type')||''}}).formData(), file=form.get('file');
    if (!file || typeof file.arrayBuffer!=='function' || file.size<12 || file.size>MAX_FILE) return json({error:'Choose an MP3, M4A, WAV or Ogg song file, up to 25 MB.'},400);
    const title=text(form.get('title'),'title',160), artist=text(form.get('artist'),'artist',120);
    const category=String(form.get('category')||'radio');
    if (!['radio','sunday'].includes(category)) fault(400,'Choose Radio or Sunday Best.');
    let recipients;
    try { recipients=JSON.parse(String(form.get('recipient_ids')||'[]')); } catch { fault(400,'Choose who can listen.'); }
    const sharing=await audience(db,room,me.id,{visibility:String(form.get('visibility')||'private'),recipient_ids:recipients});
    const request=requestId({request_id:form.get('request_id')});
    await ensureMusicSchema(db); await ensureMusicUploadSchema(db);
    const prior=await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();
    if (prior) return json({ok:true,track:track(prior),repeated:true});
    const signature=await file.slice(0,64).arrayBuffer(), mime=musicFileType(signature,file.name);
    if (!mime) return json({error:'This file is not a supported song. Choose an MP3, M4A, WAV or Ogg audio file.'},400);
    const id='m_'+crypto.randomUUID(), stamp=Date.now();
    key='songs/'+room+'/'+me.id+'/'+crypto.randomUUID();
    await bucket.put(key,file,{httpMetadata:{contentType:mime,cacheControl:'private, no-store'}});
    const results=await db.batch([
      db.prepare('INSERT INTO music_uploads(track_id,room_id,member_id,object_key,mime,size,created_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT COALESCE(SUM(size),0) FROM music_uploads WHERE room_id=? AND member_id=?) + ? <= ? AND (SELECT COALESCE(SUM(size),0) FROM music_uploads) + ? <= ? AND NOT EXISTS (SELECT 1 FROM music_tracks WHERE room_id=? AND member_id=? AND request_id=?) AND (SELECT COUNT(*) FROM music_tracks WHERE room_id=? AND member_id=?) < 1000').bind(id,room,me.id,key,mime,file.size,stamp,room,me.id,file.size,MEMBER_QUOTA,file.size,LIBRARY_QUOTA,room,me.id,request,room,me.id),
      db.prepare('INSERT INTO music_tracks(id,room_id,member_id,title,artist,stream_url,category,visibility,recipients,request_id,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM music_uploads WHERE track_id=? AND object_key=?)').bind(id,room,me.id,title,artist,'/api/music/audio/'+id,category,sharing.visibility,sharing.recipients,request,stamp,stamp,id,key)
    ]);
    if (!results[0].meta.changes) {
      const retry=await db.prepare('SELECT * FROM music_tracks WHERE room_id=? AND member_id=? AND request_id=?').bind(room,me.id,request).first();
      await bucket.delete(key); key=null;
      if (retry) return json({ok:true,track:track(retry),repeated:true});
      return json({error:'Your upload space is full. Each person can store up to 250 MB; ask the room owner for help.'},409);
    }
    saved=true;
    const row=await db.prepare('SELECT * FROM music_tracks WHERE id=?').bind(id).first();
    return json({ok:true,track:track(row)},201);
  } catch(error) {
    if (key && !saved) { try { await bucket.delete(key); } catch {} }
    return json({error:error.musicStatus?error.message:'Your song could not be uploaded. Please try again.'},error.musicStatus||500);
  }
}

export async function createMusicPlaybackTicket(req, {db,me,room,bucket,id,readable}) {
  if (req.method!=='POST') return json({error:'Method not supported.'},405);
  if (!bucket) return json({error:'This song is temporarily unavailable.'},503);
  await ensureMusicUploadSchema(db);
  const row=await db.prepare('SELECT * FROM music_tracks WHERE id=? AND room_id=? AND deleted_at IS NULL').bind(id,room).first();
  if (!row || !readable(row,me.id)) return json({error:'This song is unavailable.'},404);
  const upload=await db.prepare('SELECT track_id FROM music_uploads WHERE track_id=? AND room_id=?').bind(id,room).first();
  if (!upload) return json({error:'This song is unavailable.'},404);
  const ticket=crypto.randomUUID()+crypto.randomUUID(), expires=Date.now()+60*60*1000;
  await db.batch([
    db.prepare('DELETE FROM music_playback_tickets WHERE expires_at<?').bind(Date.now()),
    db.prepare('INSERT INTO music_playback_tickets(hash,track_id,room_id,member_id,expires_at) VALUES(?,?,?,?,?)').bind(await hash(ticket),id,room,me.id,expires)
  ]);
  return json({url:'/api/music/audio/'+id+'?ticket='+ticket,expires_at:expires});
}

export async function handleMusicAudio(req, env, readable) {
  const url=new URL(req.url), id=url.pathname.split('/').pop(), ticket=url.searchParams.get('ticket')||'';
  const unavailable=()=>new Response('This song is unavailable.',{status:404,headers:{'cache-control':'no-store'}});
  if (!['GET','HEAD'].includes(req.method)) return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
  if (!env.MUSIC_FILES || !/^[a-f0-9-]{72}$/.test(ticket)) return unavailable();
  try {
    const db=env.DB, access=await db.prepare('SELECT * FROM music_playback_tickets WHERE hash=? AND track_id=? AND expires_at>?').bind(await hash(ticket),id,Date.now()).first();
    if (!access) return unavailable();
    const member=await db.prepare('SELECT 1 FROM room_members WHERE room_id=? AND member_id=?').bind(access.room_id,access.member_id).first();
    const row=await db.prepare('SELECT * FROM music_tracks WHERE id=? AND room_id=? AND deleted_at IS NULL').bind(id,access.room_id).first();
    if (!member || !row || !readable(row,access.member_id)) return unavailable();
    const upload=await db.prepare('SELECT * FROM music_uploads WHERE track_id=? AND room_id=?').bind(id,access.room_id).first();
    if (!upload) return unavailable();
    const headers=new Headers({'content-type':upload.mime,'accept-ranges':'bytes','cache-control':'private, no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'});
    let range=null, status=200;
    const requested=req.headers.get('range');
    if (requested) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(requested);
      if (!match || (!match[1]&&!match[2])) return new Response(null,{status:416,headers:{'content-range':'bytes */'+upload.size}});
      let start=match[1]?Number(match[1]):Math.max(0,upload.size-Number(match[2]));
      let end=match[1]&&match[2]?Math.min(Number(match[2]),upload.size-1):upload.size-1;
      if (!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=upload.size) return new Response(null,{status:416,headers:{'content-range':'bytes */'+upload.size}});
      range={offset:start,length:end-start+1}; status=206;
      headers.set('content-range','bytes '+start+'-'+end+'/'+upload.size);
    }
    headers.set('content-length',String(range?.length??upload.size));
    if (req.method==='HEAD') return new Response(null,{status,headers});
    const object=await env.MUSIC_FILES.get(upload.object_key,range?{range}:undefined);
    return object?new Response(object.body,{status,headers}):unavailable();
  } catch { return unavailable(); }
}
