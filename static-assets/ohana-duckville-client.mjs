import {parentHostChannel} from './ohana-duckville/private-channel.mjs';
import {mountSceneBridge} from './ohana-duckville/scene-bridge.mjs';
import {files} from './ohana-duckville/private-route.mjs';
/** Mount ONLY from authenticated Ohana app. Capture session+room epoch in isCurrent.
 * getToken returns current in-memory token. No localStorage/token URL/cookies added.
 * Host MUST call returned dispose on logout, room/account switch, and navigation. */
export async function mountPrivateDuckville({container,roomId,getToken,isCurrent,getHostState,bridgeHeader=null,fetchImpl=fetch}){
 if(!/^[A-Za-z0-9_-]+$/.test(String(roomId)))throw Error('Verified room required');
 const abort=new AbortController(),urls=[];let frame=null,disposed=false,channel=null,bridge=null;
 const dispose=()=>{disposed=true;abort.abort();channel?.dispose();bridge?.dispose();frame?.remove();urls.forEach(u=>URL.revokeObjectURL(u))};
 const assertCurrent=()=>{if(disposed||!isCurrent())throw Error('Session or room changed')};
 try{
  const data={};
  const load=async name=>{
   assertCurrent();const token=getToken();if(!token)throw Error('Sign in required');
   const r=await fetchImpl(`/api/duckville/rooms/${encodeURIComponent(roomId)}/files/${name}`,{headers:{Authorization:`Bearer ${token}`},credentials:'omit',cache:'no-store',redirect:'error',signal:abort.signal});
   assertCurrent();if(!r.ok)throw Error('Room unavailable');
   if(name.startsWith('assets/')){const blob=await r.blob();assertCurrent();if(blob.type!==files[name])throw Error('Unexpected private asset type');const bytes=new Uint8Array(await blob.arrayBuffer());assertCurrent();let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));data[name]='data:'+files[name]+';base64,'+btoa(binary)}
   else data[name]=await r.text();assertCurrent();
  };
  await Promise.all(['room.html','room.css','room.js'].map(load));
  const source=data['room.html']+'\n'+data['room.css']+'\n'+data['room.js'];
  const referenced=[...new Set(source.match(/assets\/[A-Za-z0-9_.-]+/g)||[])];
  if(referenced.some(name=>!Object.hasOwn(files,name)))throw Error('Unknown private asset');
  await Promise.all(referenced.map(load));
  const nonce=crypto.randomUUID().replaceAll('-','');
  let html=data['room.html'],script=data['room.js'];
  script=script.replaceAll('__PRIVATE_PARENT_ORIGIN__',JSON.stringify(typeof location==='undefined'?'http://fixture.invalid':location.origin)).replaceAll('__PRIVATE_CHANNEL_NONCE__',JSON.stringify(nonce));
  for(const name of Object.keys(data).filter(n=>n.startsWith('assets/'))){html=html.replaceAll(name,data[name]);script=script.replaceAll(name,data[name])}
  const policy=`default-src 'none'; img-src data:; media-src data:; style-src 'nonce-${nonce}'; style-src-attr 'unsafe-inline'; script-src 'nonce-${nonce}'; connect-src 'none'; base-uri 'none'; form-action 'none'`;
  html=html.replace('<head>',`<head><meta http-equiv="Content-Security-Policy" content="${policy}">`).replace('<!--PRIVATE_STYLE-->',`<style nonce="${nonce}">${data['room.css'].replaceAll('</style','<\\/style')}</style>`).replace('<!--PRIVATE_SCRIPT-->',`<script nonce="${nonce}">${script.replaceAll('</script','<\\/script')}</script>`);
  assertCurrent();frame=document.createElement('iframe');frame.title='Ohana Gathering private room';frame.style.cssText='width:100%;height:85vh;border:0;display:block';frame.setAttribute('sandbox','allow-scripts');frame.referrerPolicy='no-referrer';if(typeof window!=='undefined')channel=parentHostChannel({root:window,frame,nonce,readState:getHostState,isCurrent});frame.srcdoc=html;container.replaceChildren(frame);if(bridgeHeader){const layoutMatch=html.match(/\bdata-room-layout\s*=\s*(?:"([^"]*)"|'([^']*)')/);if(html.includes('data-room-layout')&&!layoutMatch)throw Error('Invalid room layout');const fields=layoutMatch?(layoutMatch[1]??layoutMatch[2]).split(','):null;const layout=fields?.map(Number);if(layout&&(layout.length!==6||fields.some(v=>!v.trim())||!layout.every(Number.isFinite)))throw Error('Invalid room layout');bridge=mountSceneBridge({header:bridgeHeader,frame,...(layout?{sceneWidth:layout[0],sceneHeight:layout[1],bridgeRect:{left:layout[2],top:layout[3],width:layout[4],height:layout[5]}}:{})});}
  return {dispose,frame,refreshHostState:()=>channel?.refresh()};
 }catch(error){dispose();throw error}
}
