/* Ohana Memories: easy add, edit, delete and albums (ohana-memories-easy-v1, Nov 25 2026).
   Rides on top of the Memories page and reuses its own functions (call, inbox, jpeg, videoThumbnail,
   loadAlbums, loadPhotos, openPhoto). It never deletes for good: Delete hides a photo, Undo brings it back. */
(()=>{'use strict';
if(window.OhanaMemoriesEasy||typeof M==='undefined'||typeof call!=='function'||!document.querySelector('#album'))return;
const q=s=>document.querySelector(s);
function el(tag,props={},...kids){const e=document.createElement(tag);for(const [k,v] of Object.entries(props||{})){if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.startsWith('on')&&typeof v==='function')e[k]=v;else if(v===true)e.setAttribute(k,'');else e.setAttribute(k,String(v));}for(const kid of kids)if(kid!=null&&kid!==false)e.append(kid);return e;}
const FRESH_MS=20*60*1000;
const E={shapes:new Map(),gone:new Set(),keep:new Map(),words:new Map(),fresh:new Set(),known:new Set(),previews:[],thumbs:new Map(),busy:false,adding:false,orgAlbum:null,orgRows:[],sel:new Set(),edit:null,dirty:false,toastTimer:0,quiet:0};
window.OhanaMemoriesEasy={version:1,state:E};
const plural=(n,w)=>n+' '+w+(n===1?'':'s');
const albumName=id=>id&&id!=='0'?(M.albums.find(a=>a.id===id)?.name||'an album'):'Unfiled photos';
const sessionOk=()=>!!M.token&&M.token===memoriesStoredToken();
function canManage(p){return !!p&&!p.read_only&&!!M.me&&(p.member_id===M.me.id||M.rooms.find(r=>r.id===M.room)?.owner_id===M.me.id||!!M.me.is_admin);}
const isVideo=x=>String(x?.type||x?.mime||'').startsWith('video/');

/* ---------- small toast with Undo ---------- */
function hideToast(){const t=q('#me-toast');if(!t)return;if(t.hidePopover){try{t.hidePopover();}catch{}}t.hidden=true;}
function toast(text,undo){const t=q('#me-toast');if(!t)return;clearTimeout(E.toastTimer);t.replaceChildren(el('span',{text}));if(undo){const b=el('button',{type:'button',class:'me-undo',text:'Undo'});b.onclick=async()=>{hideToast();try{await undo();}catch(e){toast(e.message);}};t.append(b);}t.append(el('button',{type:'button',class:'me-toast-x','aria-label':'Close message',text:'✕',onclick:hideToast}));hideToast();t.hidden=false;if(t.showPopover){try{t.showPopover();}catch{}}E.toastTimer=setTimeout(hideToast,undo?12000:6000);}

/* ---------- albums ---------- */
function fillAlbumSelect(sel,value,{all=false,add=true}={}){sel.replaceChildren();const rows=[...(all?[{id:'',name:'All photos'}]:[]),{id:'0',name:'Unfiled photos'},...M.albums];for(const a of rows)sel.append(el('option',{value:a.id,text:a.name}));if(add)sel.append(el('option',{value:'__new',text:'＋ New album…'}));sel.value=rows.some(a=>a.id===value)?value:(all?'':'0');sel.dataset.last=sel.value;}
function chips(host,current,onPick,{all=true}={}){host.replaceChildren();const rows=[...(all?[{id:'',name:'All'}]:[]),{id:'0',name:'Unfiled'},...M.albums];for(const a of rows){const on=a.id===(current||'');host.append(el('button',{type:'button',class:'me-chip'+(on?' on':''),'aria-pressed':String(on),onclick:()=>onPick(a.id)},a.name,a.photos!=null?el('small',{text:' '+a.photos}):null));}host.append(el('button',{type:'button',class:'me-chip me-chip-new','aria-label':'New album',text:'＋ New',onclick:async()=>{const id=await newAlbumFlow();if(id)onPick(id);}}));requestAnimationFrame(()=>{const on=host.querySelector('.me-chip.on');if(on&&host.scrollWidth>host.clientWidth)host.scrollLeft+=on.getBoundingClientRect().left-host.getBoundingClientRect().left-(host.clientWidth-on.offsetWidth)/2;});}
function askName(){return new Promise(resolve=>{const d=q('#me-name'),input=q('#me-name-input'),status=q('#me-name-status');input.value='';status.textContent='';const done=v=>{d.onclose=null;if(d.open)d.close();resolve(v);};q('#me-name-cancel').onclick=()=>done(null);q('#me-name-form').onsubmit=e=>{e.preventDefault();const v=input.value.trim().replace(/\s+/g,' ');if(!v){status.textContent='Type a name for the album.';return;}done(v);};d.onclose=()=>resolve(null);d.showModal();input.focus();});}
async function newAlbumFlow(){const name=await askName();if(!name)return null;try{const r=await call('/api/memories/albums',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name})});const d=await r.json();await loadAlbums(M.album);toast('New album “'+name+'” is ready.');return d.album.id;}catch(e){await loadAlbums(M.album).catch(()=>{});const same=M.albums.find(a=>a.name.toLowerCase()===name.toLowerCase());if(same){toast('You already have “'+same.name+'”, so I picked it.');return same.id;}toast(e.message);return null;}}
async function pickAlbum(sel){if(sel.value!=='__new'){sel.dataset.last=sel.value;return sel.value;}const id=await newAlbumFlow();fillAlbumSelect(sel,id||sel.dataset.last||'0');return sel.value;}

/* ---------- thumbnails for our grids ---------- */
const lazy=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){lazy.unobserve(e.target);loadThumbInto(e.target);}},{rootMargin:'250px'});
async function loadThumbInto(img){const id=img.dataset.meId;if(!id)return;if(E.thumbs.has(id)){img.src=E.thumbs.get(id);return;}const p=findPhoto(id);if(!p)return;try{const r=await call(isVideo(p)?p.thumbnail_url:(p.thumbnail_url||p.image_url));const url=URL.createObjectURL(await r.blob());E.thumbs.set(id,url);if(img.isConnected&&img.dataset.meId===id)img.src=url;}catch{img.alt='Picture not available right now';}}
function setShape(media){const w=media.naturalWidth||media.videoWidth,h=media.naturalHeight||media.videoHeight;if(w&&h)media.closest('.me-tile')?.style.setProperty('--r',Math.min(2.2,Math.max(.55,w/h)).toFixed(3));}
function thumbImg(p){const img=el('img',{alt:p.caption||'Family photo',loading:'lazy',decoding:'async'});img.addEventListener('load',()=>setShape(img));img.dataset.meId=p.id;if(E.thumbs.has(p.id))img.src=E.thumbs.get(p.id);else lazy.observe(img);return img;}
function findPhoto(id){return E.orgRows.find(p=>p.id===id)||M.photos.find(p=>p.id===id)||E.edit?.list.find(p=>p.id===id);}
function dropThumbs(){for(const u of E.thumbs.values())URL.revokeObjectURL(u);E.thumbs.clear();}

/* ---------- 1. Add photos: see exactly what goes in before it goes ---------- */
function sameFileKey(f){return [f.name,f.size,f.lastModified,f.type].join('|');}
function sortQueue(){const seen=new Map();for(const item of M.queue){if(!E.keep.has(item.id)){const fresh=E.fresh.has(item.id)||Date.now()-(item.created||0)<FRESH_MS;E.keep.set(item.id,fresh);}const key=sameFileKey(item.file);if(seen.has(key)){item.meDupe=true;if(!E.known.has(item.id))E.keep.set(item.id,false);}else{item.meDupe=false;seen.set(key,item.id);}E.known.add(item.id);}}
function releasePreviews(){for(const u of E.previews)URL.revokeObjectURL(u);E.previews=[];}
function openAddSheet(){const d=q('#me-addsheet');if(!d.open&&!E.adding)fillAlbumSelect(q('#me-add-album'),M.album||'0');renderAddSheet();if(!d.open&&M.queue.length)d.showModal();}
function renderAddSheet(){const d=q('#me-addsheet');if(!M.queue.length&&!E.adding){if(d.open)d.close();renderWaiting();return;}sortQueue();releasePreviews();const grid=q('#me-add-grid');grid.replaceChildren();
 const kept=M.queue.filter(x=>E.keep.get(x.id)),old=M.queue.some(x=>!E.fresh.has(x.id)&&Date.now()-(x.created||0)>=FRESH_MS);
 q('#me-add-title').textContent=kept.length||!old?'Add photos':'Photos still waiting';
 q('#me-add-hint').textContent='Only ✓ photos go in. Tap a photo to change it.'+(old?' Gray ones are from before.':'');
 const isOld=x=>!E.fresh.has(x.id)&&Date.now()-(x.created||0)>=FRESH_MS,rank=x=>x.meDupe?1:isOld(x)?2:0;
 for(const item of [...M.queue].sort((a,b)=>rank(a)-rank(b)||(a.created||0)-(b.created||0))){const on=!!E.keep.get(item.id),video=isVideo(item.file),url=URL.createObjectURL(item.file);E.previews.push(url);
  const media=video?el('video',{src:url+'#t=0.1',muted:true,playsinline:true,preload:'metadata','aria-hidden':'true'}):el('img',{src:url,alt:item.file.name||'Picked photo'});media.addEventListener(video?'loadedmetadata':'load',()=>setShape(media));
  if(!video)media.onerror=()=>{media.replaceWith(el('span',{class:'me-noprev',text:(item.file.name||'Photo')+' (no preview)'}));};
  const tag=item.meDupe?'Same picture twice':(isOld(item)?'From before':(video?'Video':''));const tagEl=tag?el('span',{class:'me-tag',text:tag}):null;
  const pic=el('button',{type:'button',class:'me-pic','aria-pressed':String(on),'aria-label':(on?'Will be added: ':'Not adding: ')+(item.file.name||'photo')+'. Tap to change.',onclick:()=>{E.keep.set(item.id,!E.keep.get(item.id));renderAddSheet();}},media,el('span',{class:'me-tick','aria-hidden':'true',text:on?'✓':''}));
  const words=el('input',{class:'me-words',type:'text',maxlength:'500',placeholder:'Words','aria-label':'Words for '+(item.file.name||'this photo')});words.value=E.words.get(item.id)||'';words.oninput=()=>E.words.set(item.id,words.value);words.disabled=!on||E.adding;
  const x=el('button',{type:'button',class:'me-x','aria-label':'Take '+(item.file.name||'this photo')+' off the list',text:'✕',onclick:async()=>{if(E.adding)return;await inbox('delete',item.id);E.keep.delete(item.id);await loadQueue();}});
  const tile=el('div',{class:'me-tile'+(on?'':' off')},pic,x,tagEl,words);const r=E.shapes.get(item.id);if(r)tile.style.setProperty('--r',r);media.addEventListener(video?'loadedmetadata':'load',()=>E.shapes.set(item.id,tile.style.getPropertyValue('--r')));grid.append(tile);}
 const n=kept.length,save=q('#me-add-save');save.disabled=E.adding||!n||!sessionOk();if(!E.adding)save.textContent=n?'Add '+n:'Add';
 q('#me-add-count').textContent=n+' of '+M.queue.length;
 for(const b of [q('#me-add-more'),q('#me-add-cancel'),q('#me-add-album'),q('#me-add-allwords')])b.disabled=E.adding;
 renderWaiting();}
function renderWaiting(){const b=q('#me-cam-n');if(!b)return;const n=M.queue.length;b.hidden=!n||q('#me-addsheet').open;b.textContent=String(n);q('#me-cam')?.setAttribute('aria-label',n?'Add photos ('+n+' waiting)':'Add photos');}
async function addKept(){if(E.adding||!sessionOk())return;const items=M.queue.filter(x=>E.keep.get(x.id));if(!items.length)return;const ctx={room:M.room,token:M.token,album:q('#me-add-album').value==='__new'?'0':q('#me-add-album').value};const all=q('#me-add-allwords').value.trim();E.adding=true;M.busy=true;E.quiet++;renderAddSheet();const save=q('#me-add-save'),bar=q('#me-add-progress');bar.hidden=false;bar.max=items.length;bar.value=0;let saved=0;
 try{for(const item of items){if(ctx.room!==M.room||ctx.token!==M.token)throw Error('Your family room changed. Check the list again before adding.');save.textContent=(saved+1)+' of '+items.length+'…';const video=isVideo(item.file);const set=video?null:await sharpCopies(item.file);const photo=video?item.file:set.display;const thumb=video?await videoThumbnail(item.file):set.thumb;const f=new FormData();f.set('id',item.id);f.set('album',ctx.album);f.set('photo',photo,video?'memory.'+(item.file.type==='video/webm'?'webm':'mp4'):'memory.jpg');f.set('thumbnail',thumb,'memory-small.jpg');f.set('caption',(E.words.get(item.id)||'').trim()||all);await call('/api/memories',{method:'POST',body:f});if(set)await sendOriginal(item.id,set.original);await inbox('delete',item.id);E.keep.delete(item.id);E.words.delete(item.id);saved++;bar.value=saved;}
  const skipped=M.queue.filter(x=>!items.includes(x));for(const x of skipped){await inbox('delete',x.id);E.keep.delete(x.id);}
  q('#me-add-allwords').value='';E.adding=false;M.busy=false;bar.hidden=true;q('#me-addsheet').close();await loadQueue();
  if(M.album&&M.album!==ctx.album){q('#collection').value=ctx.album;M.album=ctx.album;}await loadAlbums(M.album);await loadPhotos();
  toast('Added '+plural(saved,'photo')+' to '+albumName(ctx.album)+(skipped.length?'. Cleared '+skipped.length+' you didn’t check.':'.'));}
 catch(e){E.adding=false;M.busy=false;bar.hidden=true;await loadQueue().catch(()=>{});if(!q('#me-addsheet').open&&M.queue.length)openAddSheet();q('#me-add-status').textContent=e.message+(saved?' The '+plural(saved,'photo')+' already added are safe.':'');}
 finally{E.adding=false;M.busy=false;E.quiet--;renderAddSheet();}}
/* ---------- full quality: keep every photo as sharp as it came in ---------- */
/* One decode of the picked photo, then three copies: the full-size original (kept as sent, up to 4096 on the long side),
   an album copy (2560 on the long side, quality .92) and a small one for lists. Shrinks in halves with high smoothing. */
function stepDown(src,tw,th){let cur=src,cw=src.width,ch=src.height,tmp=null;while(cw/2>=tw&&ch/2>=th){const nw=Math.round(cw/2),nh=Math.round(ch/2),c=document.createElement('canvas');c.width=nw;c.height=nh;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,nw,nh);if(tmp){tmp.width=tmp.height=0;}tmp=c;cur=c;cw=nw;ch=nh;}
 const out=document.createElement('canvas');out.width=tw;out.height=th;const x=out.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,tw,th);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,tw,th);if(tmp){tmp.width=tmp.height=0;}return out;}
async function sharpJpeg(src,edge,limit,qs){const k=Math.min(1,edge/Math.max(src.width,src.height));let tw=Math.max(1,Math.round(src.width*k)),th=Math.max(1,Math.round(src.height*k));
 for(let round=0;round<6;round++){const c=stepDown(src,tw,th);try{for(const qv of qs){const b=await new Promise(r=>c.toBlob(r,'image/jpeg',qv));if(b&&b.size<=limit)return b;}}finally{c.width=c.height=0;}tw=Math.max(1,Math.round(tw*.9));th=Math.max(1,Math.round(th*.9));}
 throw Error('This picture won’t fit. Pick another photo.');}
async function sharpCopies(file){const bm=await createImageBitmap(file).catch(()=>{throw Error('This photo won’t open here. Save it as a JPG or pick another photo.');});
 try{return{original:await sharpJpeg(bm,4096,24e6,[.95,.93,.9]),display:await sharpJpeg(bm,2560,15e5,[.92,.9,.88,.86,.84,.82]),thumb:await sharpJpeg(bm,640,98e3,[.86,.82,.78,.74,.7,.66,.62])};}
 finally{bm.close?.();}}
async function sendOriginal(id,blob){for(let i=0;i<2;i++){try{await call('/api/memories/photo/'+id+'/original',{method:'POST',body:blob,headers:{'content-type':'image/jpeg'}});return true;}catch(e){if(i)console.warn('memories-easy original',e);}}return false;}
async function clearWaiting(){if(E.adding)return;const gone=[...M.queue];for(const x of gone)await inbox('delete',x.id);E.keep.clear();await loadQueue();q('#me-addsheet').close();toast('Cleared '+plural(gone.length,'photo')+'. Nothing was added.',async()=>{for(const x of gone)await inbox('put',{id:x.id,file:x.file,created:x.created,caption:x.caption});await loadQueue();openAddSheet();});}

/* ---------- 2. Edit one photo: words, date, album, delete ---------- */
const dayOf=ms=>{const d=new Date(ms||Date.now());return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
function openEdit(list,index){list=list.filter(canManage);if(!list.length)return;E.edit={list,index:Math.max(0,Math.min(index,list.length-1)),full:null};q('#me-edit').showModal();showEdit();}
function editNav(){const ed=E.edit;if(!ed)return;q('#me-edit-count').textContent=(ed.index+1)+' of '+ed.list.length;q('#me-edit-prev').disabled=ed.index===0;q('#me-edit-next').disabled=ed.index>=ed.list.length-1;}
function editFromBook(p){const list=M.photos.filter(canManage);openEdit(list,list.indexOf(p));const ed=E.edit;if(!ed||!M.more)return;fetchAll(M.album||'',()=>E.edit===ed).then(rows=>{if(!rows||E.edit!==ed)return;const all=rows.filter(canManage),cur=editPhoto(),i=all.findIndex(x=>x.id===cur?.id);if(i<0)return;for(const x of all){const old=ed.list.find(y=>y.id===x.id);if(old)Object.assign(x,{caption:old.caption,created_at:old.created_at,album_id:old.album_id});}ed.list=all;ed.index=i;editNav();}).catch(()=>{});}
function editPhoto(){return E.edit?.list[E.edit.index];}
async function showEdit(){const ed=E.edit,p=editPhoto();if(!p)return closeEdit();if(ed.full){URL.revokeObjectURL(ed.full);ed.full=null;}const img=q('#me-edit-img');img.removeAttribute('src');img.alt=p.caption||'Family photo';if(E.thumbs.has(p.id))img.src=E.thumbs.get(p.id);
 editNav();
 q('#me-edit-words').value=p.caption||'';q('#me-edit-date').value=p.created_at?dayOf(p.created_at):'';fillAlbumSelect(q('#me-edit-album'),p.album_id||'0');q('#me-edit-status').textContent='';q('#me-edit-by').textContent=byline(p);
 try{if(!E.thumbs.has(p.id)){const r=await call(isVideo(p)?p.thumbnail_url:(p.thumbnail_url||p.image_url));const url=URL.createObjectURL(await r.blob());if(E.thumbs.has(p.id))URL.revokeObjectURL(url);else E.thumbs.set(p.id,url);}if(editPhoto()!==p)return;if(!ed.full)img.src=E.thumbs.get(p.id);if(!isVideo(p)&&p.image_url){const f=await call(p.image_url);const full=URL.createObjectURL(await f.blob());if(editPhoto()!==p||!q('#me-edit').open){URL.revokeObjectURL(full);return;}ed.full=full;img.src=full;}}catch{}}
function editChanges(){const p=editPhoto();if(!p)return null;const body={};const words=q('#me-edit-words').value.trim();if(words!==(p.caption||'').trim())body.caption=words;const day=q('#me-edit-date').value;if(day&&day!==(p.created_at?dayOf(p.created_at):'')){const [y,m,d]=day.split('-').map(Number),old=new Date(p.created_at||Date.now()),t=new Date(y,m-1,d,old.getHours(),old.getMinutes(),old.getSeconds()).getTime();body.created_at=t;}const album=q('#me-edit-album').value;if(album!=='__new'&&album!==(p.album_id||'0'))body.album=album;return Object.keys(body).length?body:null;}
async function saveEdit(){const p=editPhoto(),body=editChanges();if(!p||!body)return true;const status=q('#me-edit-status');status.textContent='Saving…';try{await call('/api/memories/photo/'+p.id+'/edit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});if('caption' in body)p.caption=body.caption;if('created_at' in body)p.created_at=body.created_at;if('album' in body)p.album_id=body.album;E.dirty=true;status.textContent='Saved ✓';return true;}catch(e){status.textContent=e.message;return false;}}
async function stepEdit(dir){if(!(await saveEdit()))return;E.edit.index+=dir;showEdit();}
async function closeEdit(save=true){if(save&&E.edit&&!(await saveEdit()))return;const d=q('#me-edit');if(E.edit?.full)URL.revokeObjectURL(E.edit.full);E.edit=null;if(d.open)d.close();if(q('#me-org').open){if(E.dirty){await loadAlbums(M.album).catch(()=>{});await loadOrg();}else renderOrg();}else await refreshBook();}
async function deleteEdit(){const p=editPhoto();if(!p)return;try{await hidePhotos([p]);E.edit.list.splice(E.edit.index,1);if(!E.edit.list.length){closeEdit(false);return;}E.edit.index=Math.min(E.edit.index,E.edit.list.length-1);showEdit();}catch(e){q('#me-edit-status').textContent=e.message;}}

/* ---------- delete with Undo, move with Undo ---------- */
async function syncAfter(){if(q('#me-org').open){await loadAlbums(M.album).catch(()=>{});await loadOrg();}else await refreshBook();}
async function hidePhotos(list){const done=[];try{for(const p of list){await call('/api/memories/photo/'+p.id+'/hide',{method:'POST'});done.push(p);E.gone.add(p.id);}}finally{if(done.length){E.dirty=true;E.orgRows=E.orgRows.filter(p=>!done.includes(p));for(const p of done)E.sel.delete(p.id);toast('Deleted '+plural(done.length,'photo')+'.',async()=>{for(const p of done){await call('/api/memories/photo/'+p.id+'/unhide',{method:'POST'});E.gone.delete(p.id);}E.dirty=true;toast('Brought back '+plural(done.length,'photo')+'.');await syncAfter();});}}}
async function movePhotos(list,album){const done=[];try{for(const p of list){const from=p.album_id||'0';if(from===album)continue;await call('/api/memories/photo/'+p.id+'/album',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({album})});done.push({p,from});p.album_id=album;}}finally{if(done.length){E.dirty=true;toast('Moved '+plural(done.length,'photo')+' to '+albumName(album)+'.',async()=>{for(const {p,from} of done){await call('/api/memories/photo/'+p.id+'/album',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({album:from})});p.album_id=from;}E.dirty=true;toast('Put '+plural(done.length,'photo')+' back.');await syncAfter();});}else toast('They are already in '+albumName(album)+'.');}}

/* ---------- 3. Edit photos: grid, pick many, move or delete ---------- */
async function openOrganizer(){if(!ensureMemoriesSession())return;E.orgAlbum=M.album||'';E.sel.clear();q('#me-org').showModal();await loadOrg();}
async function fetchAll(want,still){const rows=[];let last=null;for(let page=0;page<40;page++){const params=new URLSearchParams();if(want)params.set('album',want);if(last){params.set('before',last.created_at);params.set('beforeId',last.id);}const d=await(await call('/api/memories/gallery'+(params.size?'?'+params:''))).json();if(still&&!still())return null;rows.push(...d.photos);last=d.photos.at(-1);if(!d.more||!last)break;}return rows.filter(p=>!E.gone.has(p.id));}
async function loadOrg(){const grid=q('#me-org-grid'),status=q('#me-org-status');status.textContent='Opening your photos…';chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});const want=E.orgAlbum;try{const rows=await fetchAll(want,()=>want===E.orgAlbum&&q('#me-org').open);if(!rows)return;E.orgRows=rows.filter(canManage);const others=rows.filter(p=>!p.read_only&&!canManage(p)).length;status.textContent=E.orgRows.length?(others?'Showing the '+plural(E.orgRows.length,'photo')+' you can change.':''):(want&&want!=='0'?'Nothing in '+albumName(want)+' yet. Tap All, pick photos, then Move.':'No photos here yet.');renderOrg();}catch(e){status.textContent=e.message;}}
function renderOrg(){const grid=q('#me-org-grid');grid.replaceChildren();for(const p of E.orgRows){const on=E.sel.has(p.id);const pick=el('button',{type:'button',class:'me-pic','aria-pressed':String(on),'aria-label':(on?'Picked: ':'Pick: ')+(p.caption||'photo')+', '+byline(p),onclick:()=>{on?E.sel.delete(p.id):E.sel.add(p.id);renderOrg();}},thumbImg(p),el('span',{class:'me-tick','aria-hidden':'true',text:on?'✓':''}),isVideo(p)?el('span',{class:'me-tag',text:'Video'}):null);onHold(pick,()=>openEdit(E.orgRows,E.orgRows.indexOf(p)));grid.append(el('div',{class:'me-tile'+(on?' picked':'')},pick,el('div',{class:'me-cap',text:p.caption||'No words yet'})));}
 const n=E.sel.size,bar=q('#me-org-bar');bar.hidden=!n;q('#me-org-count').textContent=n+' picked';fillAlbumSelect(q('#me-org-move'),'',{add:true});q('#me-org-move').insertBefore(el('option',{value:'',text:'Move to…'}),q('#me-org-move').firstChild);q('#me-org-move').value='';q('#me-org-all').textContent=n&&n===E.orgRows.length?'None':'All';q('#me-org-all').hidden=!E.orgRows.length;}
const picked=()=>E.orgRows.filter(p=>E.sel.has(p.id));
async function orgMove(){const sel=q('#me-org-move');if(!sel.value)return;let album=sel.value;if(album==='__new'){album=await newAlbumFlow();if(!album){renderOrg();return;}}const list=picked();if(!list.length)return;try{await movePhotos(list,album);}catch(e){toast(e.message);}E.sel.clear();if(E.orgAlbum&&E.orgAlbum!==album)E.orgRows=E.orgRows.filter(p=>!list.includes(p)||p.album_id===E.orgAlbum);await loadAlbums(M.album);chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});renderOrg();}
async function orgDelete(){const list=picked();if(!list.length)return;try{await hidePhotos(list);}catch(e){toast(e.message);}await loadAlbums(M.album).catch(()=>{});chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});renderOrg();}
async function closeOrg(){q('#me-org').close();E.sel.clear();await refreshBook();}

/* ---------- keep the book in step ---------- */
async function refreshBook(){if(!E.dirty)return;E.dirty=false;const keepId=M.photos[M.page*bookPageSize()]?.id;try{await loadAlbums(M.album);await loadPhotos();const i=keepId?M.photos.findIndex(p=>p.id===keepId):-1;if(i>0){M.page=Math.floor(i/bookPageSize());renderBook();}}catch(e){toast(e.message);}renderChips();}
function albumTitle(){const a=M.album||'';return a===''?'All memories':a==='0'?'Unfiled photos':(M.albums.find(x=>x.id===a)?.name||'Album');}
function renderChips(){const t=q('#me-title-text');if(t)t.textContent=albumTitle();}
function showAlbum(id){const c=q('#collection');if(!c)return;if(![...c.options].some(o=>o.value===id))c.append(el('option',{value:id,text:id}));c.value=id;M.album=id;renderChips();c.onchange&&c.onchange();}


/* ---------- build the screens ---------- */
function build(){
 const pj=q('.photo-journal');
 pj.before(el('button',{type:'button',id:'me-title','aria-haspopup':'dialog','aria-label':'Choose an album',onclick:openAlbumMenu},el('span',{id:'me-title-text',text:albumTitle()}),el('span',{class:'me-caret','aria-hidden':'true'})));
 pj.append(el('button',{type:'button',id:'me-prev',class:'me-tab me-tab-l','aria-label':'Turn back a page',hidden:true,onclick:()=>turnPage(-1)},el('span',{'aria-hidden':'true',text:'‹'})),
  el('button',{type:'button',id:'me-next',class:'me-tab me-tab-r','aria-label':'Turn the page',hidden:true,onclick:()=>turnPage(1)},el('span',{'aria-hidden':'true',text:'›'})));
 const cam=el('button',{type:'button',id:'me-cam',class:'me-cam','aria-label':'Add photos',onclick:()=>{if(M.queue.length)openAddSheet();else q('#photo-file').click();}});
 cam.innerHTML='<svg viewBox="0 0 48 40" aria-hidden="true" focusable="false"><path d="M6 12h8l3.5-5h13L34 12h8a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><circle cx="24" cy="24.5" r="7.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M38.5 3v9M34 7.5h9" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
 cam.append(el('span',{id:'me-cam-n',class:'me-cam-n',hidden:true}));
 pj.append(cam);
 const mm=q('#memory-management');if(mm)mm.open=false;
 document.body.append(
  el('dialog',{id:'me-addsheet',class:'me-sheet','aria-labelledby':'me-add-title'},
   el('div',{class:'me-head'},el('h2',{id:'me-add-title',text:'Add photos',tabindex:'-1',autofocus:true}),el('button',{type:'button',class:'me-btn','aria-label':'Close and keep them waiting',text:'Close',onclick:()=>q('#me-addsheet').close()})),
   el('p',{id:'me-add-hint',class:'me-hint'}),
   el('textarea',{id:'me-add-allwords',maxlength:'500',rows:'1',placeholder:'Words for all (optional)','aria-label':'Words for all of them'}),
   el('div',{class:'me-row'},el('span',{id:'me-add-count',class:'me-count'}),el('button',{type:'button',id:'me-add-more',class:'me-btn','aria-label':'Pick more photos',text:'More',onclick:()=>q('#photo-file').click()}),el('button',{type:'button',id:'me-add-cancel',class:'me-btn','aria-label':'Clear all waiting photos',text:'Clear',onclick:clearWaiting})),
   el('div',{id:'me-add-grid',class:'me-grid me-grid-add'}),
   el('p',{id:'me-add-status',class:'me-status',role:'status','aria-live':'polite'}),
   el('div',{class:'me-foot'},el('progress',{id:'me-add-progress',hidden:true}),
    el('select',{id:'me-add-album','aria-label':'Album'}),
    el('button',{type:'button',id:'me-add-save',class:'me-btn me-primary',onclick:addKept}))),
  el('dialog',{id:'me-edit',class:'me-sheet','aria-label':'Change this photo'},
   el('div',{class:'me-head'},el('button',{type:'button',id:'me-edit-prev',class:'me-btn','aria-label':'Save and go to the previous photo',text:'‹',onclick:()=>stepEdit(-1)}),el('span',{id:'me-edit-count',class:'me-count',tabindex:'-1',autofocus:true}),el('button',{type:'button',id:'me-edit-next',class:'me-btn','aria-label':'Save and go to the next photo',text:'›',onclick:()=>stepEdit(1)}),el('button',{type:'button',class:'me-btn me-primary me-done',text:'Done',onclick:()=>closeEdit(true)})),
   el('img',{id:'me-edit-img',class:'me-edit-img',alt:''}),el('p',{id:'me-edit-by',class:'me-hint'}),
   el('label',{for:'me-edit-words',text:'Words'}),el('textarea',{id:'me-edit-words',maxlength:'500',rows:'2',placeholder:'A name, a place, a little story'}),
   el('div',{class:'me-two'},el('div',{},el('label',{for:'me-edit-date',text:'Date'}),el('input',{id:'me-edit-date',type:'date'})),el('div',{},el('label',{for:'me-edit-album',text:'Album'}),el('select',{id:'me-edit-album'}))),
   el('div',{class:'me-row me-edit-actions'},el('button',{type:'button',class:'me-btn me-primary',text:'Save',onclick:saveEdit}),el('span',{id:'me-edit-status',class:'me-status',role:'status','aria-live':'polite'}),el('button',{type:'button',class:'me-btn me-danger',text:'Delete',onclick:deleteEdit}))),
  el('dialog',{id:'me-org',class:'me-sheet','aria-labelledby':'me-org-title'},
   el('div',{class:'me-head'},el('h2',{id:'me-org-title',text:'Pick photos',tabindex:'-1',autofocus:true}),el('button',{type:'button',id:'me-org-all',class:'me-btn','aria-label':'Pick all or none',text:'All',onclick:()=>{if(E.sel.size===E.orgRows.length)E.sel.clear();else for(const p of E.orgRows)E.sel.add(p.id);renderOrg();}}),el('button',{type:'button',class:'me-btn me-primary me-done',text:'Done',onclick:closeOrg})),
   el('div',{id:'me-org-chips',class:'me-chips',role:'group','aria-label':'Show album'}),
   el('p',{class:'me-hint',text:'Tap photos to pick them. Hold one to change it.'}),
   el('p',{id:'me-org-status',class:'me-status',role:'status','aria-live':'polite'}),
   el('div',{id:'me-org-grid',class:'me-grid me-grid-org'}),
   el('div',{id:'me-org-bar',class:'me-foot',hidden:true},el('span',{id:'me-org-count',class:'me-count'}),el('select',{id:'me-org-move','aria-label':'Move picked photos to album'}),el('button',{type:'button',class:'me-btn me-danger',text:'Delete',onclick:orgDelete}),el('button',{type:'button',class:'me-btn',text:'Clear',onclick:()=>{E.sel.clear();renderOrg();}}))),
  el('dialog',{id:'me-name',class:'me-small','aria-label':'Name a new album'},el('form',{id:'me-name-form'},el('label',{for:'me-name-input',text:'New album'}),el('input',{id:'me-name-input',maxlength:'80',placeholder:'CHRISTmas 2026, Beach trip…',autocomplete:'off'}),el('p',{id:'me-name-status',class:'me-status',role:'status'}),el('div',{class:'me-row'},el('button',{type:'submit',class:'me-btn me-primary',text:'Make'}),el('button',{type:'button',id:'me-name-cancel',class:'me-btn',text:'Cancel'})))),
  el('dialog',{id:'me-albums',class:'me-small me-menu','aria-label':'Albums'},el('div',{id:'me-albums-list'})),
  el('div',{id:'me-toast',role:'status','aria-live':'polite',popover:'manual',hidden:true}));
 q('#me-albums').addEventListener('click',e=>{if(e.target===q('#me-albums'))q('#me-albums').close();});
 q('#me-add-album').onchange=async()=>{await pickAlbum(q('#me-add-album'));renderAddSheet();};
 q('#me-edit-album').onchange=()=>pickAlbum(q('#me-edit-album'));
 q('#me-org-move').onchange=orgMove;
 q('#me-addsheet').addEventListener('close',()=>{releasePreviews();renderWaiting();});
 q('#me-edit').addEventListener('cancel',e=>{e.preventDefault();closeEdit(true);});
 q('#me-org').addEventListener('cancel',e=>{e.preventDefault();closeOrg();});
 fillAlbumSelect(q('#me-add-album'),M.album&&M.album!==''?M.album:'0');renderChips();}

/* ---------- the album itself: page tabs, swipe, hold a photo to change it ---------- */
function canTurn(d){const size=2;return d<0?M.page>0:(M.page+1)*size<M.photos.length||!!M.more;}
let turnNext=0;function turnPage(d){if(typeof pageTurning!=='undefined'&&pageTurning){turnNext=d;return;}if(!canTurn(d)||typeof turnAlbum!=='function')return;turnAlbum(d).finally?.(()=>{placeTabs();const n=turnNext;turnNext=0;if(n)setTimeout(()=>turnPage(n),0);});}
function placeTabs(){const g=q('#gallery'),pv=q('#me-prev'),nx=q('#me-next'),cam=q('#me-cam');if(!g||!pv||!nx)return;const show=!!M.photos.length;pv.hidden=!show||!canTurn(-1);nx.hidden=!show||!canTurn(1);
 const mid=g.offsetTop+g.offsetHeight*.47;pv.style.top=nx.style.top=mid+'px';const pw=(nx.offsetParent||document.documentElement).clientWidth;pv.style.left=Math.max(40,g.offsetLeft+g.offsetWidth*.03+18)+'px';nx.style.left=Math.min(pw-40,g.offsetLeft+g.offsetWidth*.97-18)+'px';
 if(cam){cam.style.top=(g.offsetTop+g.offsetHeight*.9)+'px';cam.style.left=(g.offsetLeft+g.offsetWidth*.93)+'px';}}
addEventListener('resize',()=>placeTabs());
/* hold about half a second: works on photos in the book, in the full-size view and in Pick photos */
function onHold(node,fire,{ms=500}={}){let t=0,x=0,y=0,held=0;const stop=()=>{clearTimeout(t);t=0;node.classList.remove('me-pressing');};
 node.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;x=e.clientX;y=e.clientY;stop();node.classList.add('me-pressing');t=setTimeout(()=>{t=0;node.classList.remove('me-pressing');held=Date.now();navigator.vibrate?.(12);fire(e);},ms);});
 node.addEventListener('pointermove',e=>{if(t&&Math.hypot(e.clientX-x,e.clientY-y)>10)stop();});
 for(const ev of ['pointerup','pointercancel','pointerleave'])node.addEventListener(ev,stop);
 node.addEventListener('contextmenu',e=>{e.preventDefault();if(t){stop();held=Date.now();fire(e);}else if(Date.now()-held>900){held=Date.now();fire(e);}});
 node.addEventListener('click',e=>{if(Date.now()-held<900){e.preventDefault();e.stopImmediatePropagation();}},true);}
function setupBook(){const g=q('#gallery');if(!g||g.dataset.meBook)return;g.dataset.meBook='1';let hold=null,sw=null,held=0,swiped=0;
 const photoAt=t=>{const id=t.closest?.('figure.memory')?.querySelector('img[data-id]')?.dataset.id;return id?M.photos.find(p=>p.id===id):null;};
 const stopHold=()=>{if(hold){clearTimeout(hold.t);hold.fig.classList.remove('me-pressing');hold=null;}};
 const fireHold=p=>{stopHold();sw=null;held=Date.now();navigator.vibrate?.(12);editFromBook(p);};
 g.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;sw={x:e.clientX,y:e.clientY,t:Date.now()};stopHold();const fig=e.target.closest('figure.memory'),p=fig&&photoAt(e.target);if(p&&canManage(p)){fig.classList.add('me-pressing');hold={fig,p,x:e.clientX,y:e.clientY,t:setTimeout(()=>fireHold(p),500)};}});
 g.addEventListener('pointermove',e=>{if(hold&&Math.hypot(e.clientX-hold.x,e.clientY-hold.y)>10)stopHold();});
 g.addEventListener('pointerup',e=>{stopHold();if(!sw)return;const dx=e.clientX-sw.x,dy=e.clientY-sw.y,dt=Date.now()-sw.t;sw=null;if(Math.abs(dx)>45&&Math.abs(dx)>1.4*Math.abs(dy)&&dt<900){swiped=Date.now();turnPage(dx<0?1:-1);}});
 g.addEventListener('pointercancel',()=>{stopHold();sw=null;});
 g.addEventListener('contextmenu',e=>{if(!e.target.closest('figure.memory'))return;e.preventDefault();const p=photoAt(e.target);if(!p||!canManage(p))return;if(hold||Date.now()-held>900)fireHold(p);});
 g.addEventListener('click',e=>{if(Date.now()-held<900||Date.now()-swiped<600){e.preventDefault();e.stopImmediatePropagation();}},true);
 g.addEventListener('dragstart',e=>e.preventDefault());
 const vi=q('#viewer-image');if(vi)onHold(vi,()=>{const p=M.photos[M.index];if(!canManage(p))return;q('#viewer').close();editFromBook(p);});
 document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowRight'){e.preventDefault();turnPage(1);}else if(e.key==='ArrowLeft'){e.preventDefault();turnPage(-1);}});
 /* the viewer's top row: small marks instead of words */
 const mark=(sel,label,svg)=>{const b=q(sel);if(!b)return;b.classList.add('me-mark');const put=()=>{if(!b.querySelector('svg'))b.innerHTML=svg;b.setAttribute('aria-label',label);b.title=label;};put();new MutationObserver(put).observe(b,{childList:true,characterData:true,subtree:true});};
 mark('#close','Close','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>');
 mark('#share-photo','Share photo','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5M5 12.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
 mark('#download','Save photo','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 10.5L12 15l4.5-4.5M5 19.5h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
 mark('#viewer-feedback-jump','Reactions and comments','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>');}
/* the full-size view swaps in the full original once it arrives, so it stays sharp when pinched */
async function viewerOriginal(){const p=M.photos[M.index];if(!p||p.read_only||isVideo(p)||!q('#viewer').open)return;const id=p.id;try{const r=await call('/api/memories/photo/'+id+'/original');const b=await r.blob();if(!b.type.startsWith('image/')||M.photos[M.index]?.id!==id||!q('#viewer').open)return;const u=URL.createObjectURL(b);const im=new Image();im.src=u;await im.decode();if(M.photos[M.index]?.id!==id||!q('#viewer').open){URL.revokeObjectURL(u);return;}const old=M.fullUrl;M.fullUrl=u;q('#viewer-image').src=u;q('#full-size')?.setAttribute('href',u);if(old&&old!==u)URL.revokeObjectURL(old);}catch{}}
/* albums: tap the album's name above the book */
function menuItem(text,on,fn){return el('button',{type:'button',class:'me-item'+(on?' on':''),'aria-current':on?'true':null,onclick:fn},text);}
function openAlbumMenu(){if(!ensureMemoriesSession())return;const d=q('#me-albums'),list=q('#me-albums-list');list.replaceChildren();
 const rooms=M.rooms||[];if(rooms.length>1){list.append(el('p',{class:'me-menu-h',text:'Family'}));for(const r of rooms)list.append(menuItem(r.name,r.id===M.room,()=>{d.close();const s=q('#room');if(!s||r.id===M.room)return;s.value=String(r.id);s.onchange&&s.onchange();}));}
 list.append(el('p',{class:'me-menu-h',text:'Albums'}));
 for(const a of [{id:'',name:'All memories'},{id:'0',name:'Unfiled photos'},...M.albums])list.append(menuItem(a.name,(M.album||'')===a.id,()=>{d.close();if((M.album||'')!==a.id)showAlbum(a.id);}));
 list.append(el('div',{class:'me-menu-more'},menuItem('＋ New album',false,async()=>{d.close();const id=await newAlbumFlow();if(id)showAlbum(id);}),menuItem('Pick photos',false,()=>{d.close();openOrganizer();}),q('#share-album')?menuItem('Share',false,()=>{d.close();q('#share-album').click();}):null));
 d.showModal();list.querySelector('.me-item.on')?.focus();}

/* ---------- hook into the page's own steps ---------- */
function hook(name,{before,after,now}={}){const orig=window[name];if(typeof orig!=='function')return;const isAsync=orig.constructor&&orig.constructor.name==='AsyncFunction';window[name]=isAsync?async function(...a){const s=before?.(...a);const pending=orig.apply(this,a);try{now?.(...a);}catch(e){console.warn('memories-easy',e);}const r=await pending;try{after?.(s,...a);}catch(e){console.warn('memories-easy',e);}return r;}:function(...a){const s=before?.(...a);const r=orig.apply(this,a);try{after?.(s,...a);}catch(e){console.warn('memories-easy',e);}return r;};}
build();
const origQueueFiles=window.queueFiles;window.queueFiles=async function(files){const t0=Date.now()-1;E.quiet++;try{await origQueueFiles.call(this,files);for(const x of M.queue)if((x.created||0)>=t0)E.fresh.add(x.id);openAddSheet();}catch(e){toast(e.message);throw e;}finally{E.quiet--;}};
hook('renderQueue',{before:()=>q('#memory-management')?.open,after:wasOpen=>{const mm=q('#memory-management');if(mm)mm.open=!!wasOpen;if(!sessionOk()){if(q('#me-addsheet').open)q('#me-addsheet').close();renderWaiting();return;}if(q('#me-addsheet').open||E.adding)renderAddSheet();else if(M.queue.length&&M.queue.some(x=>!E.known.has(x.id))){openAddSheet();}else renderWaiting();}});
function shortBylines(){if(!matchMedia('(max-width:1100px)').matches)return;for(const b of document.querySelectorAll('#gallery figure.memory .byline'))b.textContent=b.textContent.replace(/^Shared by /,'');}
hook('appendPhotos',{after:()=>{shortBylines();}});
hook('renderBook',{after:()=>placeTabs()});
hook('openPhoto',{after:()=>viewerOriginal()});
hook('loadAlbums',{after:()=>{renderChips();const a=q('#me-add-album');if(a)fillAlbumSelect(a,a.value&&a.value!=='__new'?a.value:(M.album||'0'));}});
function emptyHint(){const g=q('#gallery');if(!g||M.photos.length||g.querySelector('.me-empty'))return;g.append(el('p',{class:'me-empty',text:M.album?'Nothing in '+albumTitle()+' yet.':'No photos yet.'}));}
hook('loadPhotos',{after:()=>{renderChips();emptyHint();placeTabs();}});
hook('say',{after:(s,text)=>{if(text&&!E.quiet&&!q('#memory-management')?.open&&!q('#me-addsheet')?.open)toast(text);}});
hook('invalidateMemoriesSession',{after:()=>{for(const id of ['#me-addsheet','#me-edit','#me-org','#me-name','#me-albums'])if(q(id)?.open)q(id).close();E.edit=null;E.orgRows=[];E.sel.clear();dropThumbs();renderWaiting();}});
/* the whole open album on every screen: two pages, one photo on each */
window.bookPageSize=()=>2;try{lastBookSize=2;}catch{}
if(M.photos.length&&typeof renderBook==='function'){M.page=Math.floor(M.page/2);renderBook();}
if(M.queue.length&&sessionOk())openAddSheet();
setupBook();placeTabs();renderWaiting();
})();
