/** Per-viewer in-memory portrait. No persistence/profile writes; caller owns auth-state subscription. */
export function createPePawPortrait({ownerMemberId=null,roomId=null,getState,fetcher=fetch,urlAPI=URL,ImageClass=Image,onChange=()=>{},now=Date.now}){
 let retryAt=0;let key='',generation=0,controller=null,url=null,image=null,disposed=false;
 const valid=n=>Number.isSafeInteger(n)&&n>0;
 function stateKey(){const s=getState();return valid(ownerMemberId)&&valid(roomId)&&s?.authorized===true&&s?.token&&valid(Number(s.memberId))&&Number(s.roomId)===roomId?`${s.memberId}:${s.roomId}:${s.token}`:'';}
 function clear(){generation++;controller?.abort();controller=null;if(url)urlAPI.revokeObjectURL(url);url=null;image=null;key='';onChange();}
 async function sync(){
  if(disposed)return;const s=getState();
  const next=valid(ownerMemberId)&&valid(roomId)&&s?.authorized===true&&s?.token&&valid(Number(s.memberId))&&Number(s.roomId)===roomId?`${s.memberId}:${s.roomId}:${s.token}`:'';
  if(!next){if(key||url||controller)clear();return}if(next===key&&(url||controller||now()<retryAt))return;clear();key=next;const run=++generation;controller=new AbortController();
  try{const r=await fetcher(`/api/ohana-character/rooms/${roomId}/pepaw.png`,{headers:{Authorization:`Bearer ${s.token}`},signal:controller.signal,cache:'no-store',credentials:'omit',redirect:'error'});
   if(!r.ok||!(r.headers.get('content-type')||'').startsWith('image/png'))throw Error('Private portrait unavailable');
   const blob=await r.blob();if(disposed||run!==generation||stateKey()!==key)return;
   const candidate=urlAPI.createObjectURL(blob);const im=new ImageClass();im.src=candidate;
   try{await im.decode()}catch(e){urlAPI.revokeObjectURL(candidate);throw e}
   if(disposed||run!==generation||stateKey()!==key){urlAPI.revokeObjectURL(candidate);return}url=candidate;image=im;onChange();
  }catch{if(run===generation){url=null;image=null;retryAt=now()+30000;onChange()}}finally{if(run===generation)controller=null}
 }
 return {sync,clear,resolve(memberId){if(key&&stateKey()!==key)clear();return !disposed&&url&&Number(memberId)===ownerMemberId?{name:'PePaw',url,image}:null},dispose(){if(disposed)return;disposed=true;clear()}};
}
