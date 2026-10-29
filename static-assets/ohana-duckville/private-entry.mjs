/** Authenticated exterior doorway, mounted only into existing home/room shell. */
export async function mountPrivateGatheringEntry({button,roomId,getToken,isCurrent,onEnter,fetchImpl=fetch,urlAPI=URL}){
 const urls=[];let disposed=false;const controller=new AbortController();
 const dispose=()=>{if(disposed)return;disposed=true;controller.abort();for(const url of urls)urlAPI.revokeObjectURL(url);button.onclick=null;button.remove()};
 button.type='button';button.setAttribute('aria-label','Enter Ohana Gathering');button.style.cssText='display:block;position:relative;width:100%;padding:0;border:0;background:transparent;border-radius:12px;overflow:hidden;cursor:pointer';
 button.textContent='Opening Ohana Gathering porch…';button.disabled=true;
 async function image(name){if(!isCurrent()||!getToken())throw Error('Inactive');const response=await fetchImpl(`/api/duckville/rooms/${encodeURIComponent(roomId)}/files/assets/${name}`,{headers:{Authorization:`Bearer ${getToken()}`},credentials:'omit',redirect:'error',cache:'no-store',signal:controller.signal});
  if(!response.ok||response.headers.get('content-type')!=='image/png')throw Error('Unavailable');const blob=await response.blob();if(disposed||!isCurrent())throw Error('Inactive');const url=urlAPI.createObjectURL(blob);urls.push(url);return url;}
 try{const backdrop=await image('porch-sign.png'),plaque=await image('fudge-family-plaque.png');
  const img=button.ownerDocument.createElement('img');img.src=backdrop;img.alt='Ohana Gathering porch and outside view. Enter the room.';img.style.cssText='display:block;width:100%;height:auto';
  const sign=button.ownerDocument.createElement('img');sign.src=plaque;sign.alt='Kevin & Sue, Fudge, est. 8.16.2003';sign.style.cssText='position:absolute;left:52.54%;top:40.43%;width:4.69%;height:7.52%;object-fit:fill;transform:skewY(-1deg);transform-origin:center;mix-blend-mode:normal;filter:brightness(.84) saturate(.82);opacity:1;mask-image:repeating-linear-gradient(90deg,#000 0 8%,transparent 8% 9.5%,#000 9.5% 20%),repeating-linear-gradient(180deg,#000 0 1%,transparent 1% 2.5%,#000 2.5% 18.7%);mask-composite:intersect;mask-size:100% 100%;';button.replaceChildren(img,sign);button.disabled=false;button.onclick=()=>{if(isCurrent())onEnter()};
  return {dispose};
 }catch(e){dispose();throw e}
}
