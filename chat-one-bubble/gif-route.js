async function ohanaGifRoute(url,me){
const H={"content-type":"application/json","cache-control":"no-store"},out=(o,s)=>new Response(JSON.stringify(o),{status:s||200,headers:H});
if(!me||!me.id)return out({ok:false,error:"Sign in first."},401);
let key="";try{key=String(OHANA_PUSH_ENV.GIPHY_API_KEY||"")}catch(e){}
if(!key)return out({ok:false,error:"GIF search is not turned on yet."},503);
const id=String(url.searchParams.get("id")||"");
if(id){
 if(!/^[A-Za-z0-9]{3,40}$/.test(id))return out({ok:false,error:"That GIF would not load. Pick another."},400);
 const r=await fetch("https://api.giphy.com/v1/gifs/"+id+"?rating=g&api_key="+encodeURIComponent(key));
 if(!r.ok)return out({ok:false,error:"GIF search is resting. Try again soon."},502);
 const im=(((await r.json())||{}).data||{}).images||{};
 const picks=[im.fixed_width_downsampled,im.fixed_width_small,im.fixed_height_small].map(x=>x&&x.webp).filter(Boolean);
 for(const u of picks){let h="";try{h=new URL(u).hostname}catch(e){continue}if(!/(^|\.)giphy\.com$/.test(h))continue;
  const g=await fetch(u);if(!g.ok)continue;const b=new Uint8Array(await g.arrayBuffer());if(!b.length||b.length>660000)continue;
  let s="";for(let i=0;i<b.length;i+=32768)s+=String.fromCharCode.apply(null,b.subarray(i,i+32768));
  return out({ok:true,image:"data:image/webp;base64,"+btoa(s)})}
 return out({ok:false,error:"That GIF is too big. Pick another."},413)}
const q=String(url.searchParams.get("q")||"").trim().toLowerCase().slice(0,50);
if(q.length<2)return out({ok:true,results:[]});
const cache=caches.default,ck=new Request(url.origin+"/__ohana_gif_cache?q="+encodeURIComponent(q));
try{const hit=await cache.match(ck);if(hit)return new Response(await hit.text(),{headers:H})}catch(e){}
const r=await fetch("https://api.giphy.com/v1/gifs/search?limit=18&rating=g&lang=en&q="+encodeURIComponent(q)+"&api_key="+encodeURIComponent(key));
if(r.status===429)return out({ok:false,error:"GIF search is resting for a bit. Try again in a little while."},429);
if(!r.ok)return out({ok:false,error:"GIF search is resting. Try again soon."},502);
const data=((await r.json())||{}).data||[];
const results=data.map(x=>{const i=x.images||{},t=i.fixed_width_small||i.fixed_height_small||{};return {id:String(x.id||""),title:String(x.title||"").slice(0,80),thumb:t.webp||t.url||""}}).filter(x=>x.id&&/^https:\/\/[a-z0-9.]*giphy\.com\//.test(x.thumb));
const body=JSON.stringify({ok:true,results});
try{await cache.put(ck,new Response(body,{headers:{"content-type":"application/json","cache-control":"public, max-age=3600"}}))}catch(e){}
return new Response(body,{headers:H})}
