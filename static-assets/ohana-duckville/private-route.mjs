/** Private Worker adapter. Deliberately no inferred room ID or storage binding. */
export const files = Object.freeze({
 'room.html':'text/html; charset=utf-8','room.css':'text/css; charset=utf-8','room.js':'text/javascript; charset=utf-8',
 'assets/porch-outside.png':'image/png','assets/room-art.png':'image/png','assets/duck-motion-atlas.png':'image/png','assets/fudge-family-plaque.png':'image/png','assets/chime-primary-canopy.webp':'image/webp','assets/chime-v6-atlas.webp':'image/webp','assets/chime-tube01.mp3':'audio/mpeg','assets/chime-tube03.mp3':'audio/mpeg','assets/chime-tube04.mp3':'audio/mpeg','assets/memorial-original.jpg':'image/jpeg'
});
const headers = {'Cache-Control':'private, no-store, max-age=0','Vary':'Authorization','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin','Referrer-Policy':'no-referrer'};
const deny=(status)=>new Response('Unavailable',{status,headers});
export function createPrivateDuckvilleHandler({authenticate,canEnterRoom,readPrivateFile,configuredRoomId}){
 if(!authenticate||!canEnterRoom||!readPrivateFile)throw Error('Missing private adapter');
 return async function handle(request,env){
  const u=new URL(request.url);
  if(!u.pathname.startsWith('/api/duckville/'))return null;
  if(request.method!=='GET')return deny(405);
  // No query token or alternate authentication channel; no location information.
  if(env?.__ohanaInviteMe||u.search||!/^Bearer \S+$/.test(request.headers.get('Authorization')||''))return deny(401);
  const match=/^\/api\/duckville\/rooms\/([A-Za-z0-9_-]+)\/files\/(.+)$/.exec(u.pathname);
  if(!match)return deny(404);
  const [,roomId,name]=match;
  if(!configuredRoomId||String(configuredRoomId)!==roomId||!Object.hasOwn(files,name))return deny(404);
  try {
   const member=await authenticate(request,env);
   if(!member)return deny(401);
   if(!await canEnterRoom(env,member,roomId))return deny(404);
   // readPrivateFile must be a private module/R2 binding, NEVER env.ASSETS or public CDN.
   const bytes=await readPrivateFile(env,name);
   if(bytes==null)return deny(404);
   return new Response(bytes,{headers:{...headers,'Content-Type':files[name]}});
  }catch{return deny(503)}
 };
}
