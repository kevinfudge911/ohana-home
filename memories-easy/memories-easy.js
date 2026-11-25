/* Ohana Memories: easy add, edit, delete and albums (ohana-memories-easy-v1, Nov 25 2026).
   Rides on top of the Memories page and reuses its own functions (call, inbox, jpeg, videoThumbnail,
   loadAlbums, loadPhotos, openPhoto). It never deletes for good: Delete hides a photo, Undo brings it back. */
(()=>{'use strict';
if(window.OhanaMemoriesEasy||typeof M==='undefined'||typeof call!=='function'||!document.querySelector('#album'))return;
const q=s=>document.querySelector(s);
function el(tag,props={},...kids){const e=document.createElement(tag);for(const [k,v] of Object.entries(props||{})){if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k.startsWith('on')&&typeof v==='function')e[k]=v;else if(v===true)e.setAttribute(k,'');else e.setAttribute(k,String(v));}for(const kid of kids)if(kid!=null&&kid!==false)e.append(kid);return e;}
const FRESH_MS=20*60*1000;
const E={gone:new Set(),keep:new Map(),words:new Map(),fresh:new Set(),known:new Set(),previews:[],thumbs:new Map(),busy:false,adding:false,orgAlbum:null,orgRows:[],sel:new Set(),edit:null,dirty:false,toastTimer:0,quiet:0};
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
function chips(host,current,onPick,{all=true}={}){host.replaceChildren();const rows=[...(all?[{id:'',name:'All'}]:[]),{id:'0',name:'Unfiled'},...M.albums];for(const a of rows){const on=a.id===(current||'');host.append(el('button',{type:'button',class:'me-chip'+(on?' on':''),'aria-pressed':String(on),onclick:()=>onPick(a.id),text:a.name+(a.photos!=null?' · '+a.photos:'')}));}host.append(el('button',{type:'button',class:'me-chip me-chip-new',text:'＋ New album',onclick:async()=>{const id=await newAlbumFlow();if(id)onPick(id);}}));}
function askName(){return new Promise(resolve=>{const d=q('#me-name'),input=q('#me-name-input'),status=q('#me-name-status');input.value='';status.textContent='';const done=v=>{d.onclose=null;if(d.open)d.close();resolve(v);};q('#me-name-cancel').onclick=()=>done(null);q('#me-name-form').onsubmit=e=>{e.preventDefault();const v=input.value.trim().replace(/\s+/g,' ');if(!v){status.textContent='Type a name for the album.';return;}done(v);};d.onclose=()=>resolve(null);d.showModal();input.focus();});}
async function newAlbumFlow(){const name=await askName();if(!name)return null;try{const r=await call('/api/memories/albums',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name})});const d=await r.json();await loadAlbums(M.album);toast('New album “'+name+'” is ready.');return d.album.id;}catch(e){await loadAlbums(M.album).catch(()=>{});const same=M.albums.find(a=>a.name.toLowerCase()===name.toLowerCase());if(same){toast('You already have “'+same.name+'”, so I picked it.');return same.id;}toast(e.message);return null;}}
async function pickAlbum(sel){if(sel.value!=='__new'){sel.dataset.last=sel.value;return sel.value;}const id=await newAlbumFlow();fillAlbumSelect(sel,id||sel.dataset.last||'0');return sel.value;}

/* ---------- thumbnails for our grids ---------- */
const lazy=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){lazy.unobserve(e.target);loadThumbInto(e.target);}},{rootMargin:'250px'});
async function loadThumbInto(img){const id=img.dataset.meId;if(!id)return;if(E.thumbs.has(id)){img.src=E.thumbs.get(id);return;}const p=findPhoto(id);if(!p)return;try{const r=await call(isVideo(p)?p.thumbnail_url:(p.thumbnail_url||p.image_url));const url=URL.createObjectURL(await r.blob());E.thumbs.set(id,url);if(img.isConnected&&img.dataset.meId===id)img.src=url;}catch{img.alt='Picture not available right now';}}
function thumbImg(p){const img=el('img',{alt:p.caption||'Family photo',loading:'lazy',decoding:'async'});img.dataset.meId=p.id;if(E.thumbs.has(p.id))img.src=E.thumbs.get(p.id);else lazy.observe(img);return img;}
function findPhoto(id){return E.orgRows.find(p=>p.id===id)||M.photos.find(p=>p.id===id)||E.edit?.list.find(p=>p.id===id);}
function dropThumbs(){for(const u of E.thumbs.values())URL.revokeObjectURL(u);E.thumbs.clear();}

/* ---------- 1. Add photos: see exactly what goes in before it goes ---------- */
function sameFileKey(f){return [f.name,f.size,f.lastModified,f.type].join('|');}
function sortQueue(){const seen=new Map();for(const item of M.queue){if(!E.keep.has(item.id)){const fresh=E.fresh.has(item.id)||Date.now()-(item.created||0)<FRESH_MS;E.keep.set(item.id,fresh);}const key=sameFileKey(item.file);if(seen.has(key)){item.meDupe=true;if(!E.known.has(item.id))E.keep.set(item.id,false);}else{item.meDupe=false;seen.set(key,item.id);}E.known.add(item.id);}}
function releasePreviews(){for(const u of E.previews)URL.revokeObjectURL(u);E.previews=[];}
function openAddSheet(){const d=q('#me-addsheet');renderAddSheet();if(!d.open)d.showModal();}
function renderAddSheet(){const d=q('#me-addsheet');if(!M.queue.length&&!E.adding){if(d.open)d.close();renderWaiting();return;}sortQueue();releasePreviews();const grid=q('#me-add-grid');grid.replaceChildren();
 const kept=M.queue.filter(x=>E.keep.get(x.id)),old=M.queue.some(x=>!E.fresh.has(x.id)&&Date.now()-(x.created||0)>=FRESH_MS);
 q('#me-add-title').textContent=kept.length||!old?'Add photos':'Photos still waiting';
 q('#me-add-hint').textContent='Only photos with a ✓ get added. Tap a photo to change it.'+(old?' Gray ones were picked earlier and never added.':'');
 const isOld=x=>!E.fresh.has(x.id)&&Date.now()-(x.created||0)>=FRESH_MS,rank=x=>x.meDupe?1:isOld(x)?2:0;
 for(const item of [...M.queue].sort((a,b)=>rank(a)-rank(b)||(a.created||0)-(b.created||0))){const on=!!E.keep.get(item.id),video=isVideo(item.file),url=URL.createObjectURL(item.file);E.previews.push(url);
  const media=video?el('video',{src:url+'#t=0.1',muted:true,playsinline:true,preload:'metadata','aria-hidden':'true'}):el('img',{src:url,alt:item.file.name||'Picked photo'});
  if(!video)media.onerror=()=>{media.replaceWith(el('span',{class:'me-noprev',text:(item.file.name||'Photo')+' (no preview)'}));};
  const tag=item.meDupe?'Same picture twice':(isOld(item)?'From before':(video?'Video':''));
  const pic=el('button',{type:'button',class:'me-pic','aria-pressed':String(on),'aria-label':(on?'Will be added: ':'Not adding: ')+(item.file.name||'photo')+'. Tap to change.',onclick:()=>{E.keep.set(item.id,!E.keep.get(item.id));renderAddSheet();}},media,el('span',{class:'me-tick','aria-hidden':'true',text:on?'✓':''}),tag?el('span',{class:'me-tag',text:tag}):null);
  const words=el('input',{class:'me-words',type:'text',maxlength:'500',placeholder:'Words (optional)','aria-label':'Words for '+(item.file.name||'this photo')});words.value=E.words.get(item.id)||'';words.oninput=()=>E.words.set(item.id,words.value);words.disabled=!on||E.adding;
  const x=el('button',{type:'button',class:'me-x','aria-label':'Take '+(item.file.name||'this photo')+' off the list',text:'✕',onclick:async()=>{if(E.adding)return;await inbox('delete',item.id);E.keep.delete(item.id);await loadQueue();}});
  grid.append(el('div',{class:'me-tile'+(on?'':' off')},pic,x,words));}
 const n=kept.length,save=q('#me-add-save');save.disabled=E.adding||!n||!sessionOk();if(!E.adding)save.textContent=n?'Add '+plural(n,isVideo(kept[0]?.file)&&n===1?'video':'photo')+' to '+albumName(q('#me-add-album').value):'Check a photo to add it';
 q('#me-add-count').textContent=n+' of '+M.queue.length+' checked';
 for(const b of [q('#me-add-more'),q('#me-add-cancel'),q('#me-add-album'),q('#me-add-allwords')])b.disabled=E.adding;
 renderWaiting();}
function renderWaiting(){const b=q('#me-waiting');const n=M.queue.length;b.hidden=!n||q('#me-addsheet').open;b.textContent='📥 '+plural(n,'photo')+' waiting';}
async function addKept(){if(E.adding||!sessionOk())return;const items=M.queue.filter(x=>E.keep.get(x.id));if(!items.length)return;const ctx={room:M.room,token:M.token,album:q('#me-add-album').value==='__new'?'0':q('#me-add-album').value};const all=q('#me-add-allwords').value.trim();E.adding=true;M.busy=true;E.quiet++;renderAddSheet();const save=q('#me-add-save'),bar=q('#me-add-progress');bar.hidden=false;bar.max=items.length;bar.value=0;let saved=0;
 try{for(const item of items){if(ctx.room!==M.room||ctx.token!==M.token)throw Error('Your family room changed. Check the list again before adding.');save.textContent='Adding '+(saved+1)+' of '+items.length+'…';const video=isVideo(item.file);const photo=video?item.file:await jpeg(item.file,2200,850000);const thumb=video?await videoThumbnail(item.file):await jpeg(item.file,420,85000);const f=new FormData();f.set('id',item.id);f.set('album',ctx.album);f.set('photo',photo,video?'memory.'+(item.file.type==='video/webm'?'webm':'mp4'):'memory.jpg');f.set('thumbnail',thumb,'memory-small.jpg');f.set('caption',(E.words.get(item.id)||'').trim()||all);await call('/api/memories',{method:'POST',body:f});await inbox('delete',item.id);E.keep.delete(item.id);E.words.delete(item.id);saved++;bar.value=saved;}
  const skipped=M.queue.filter(x=>!items.includes(x));for(const x of skipped){await inbox('delete',x.id);E.keep.delete(x.id);}
  q('#me-add-allwords').value='';E.adding=false;M.busy=false;bar.hidden=true;q('#me-addsheet').close();await loadQueue();
  if(M.album&&M.album!==ctx.album){q('#collection').value=ctx.album;M.album=ctx.album;}await loadAlbums(M.album);await loadPhotos();
  toast('Added '+plural(saved,'photo')+' to '+albumName(ctx.album)+(skipped.length?'. Cleared '+skipped.length+' you didn’t check.':'.'));}
 catch(e){E.adding=false;M.busy=false;bar.hidden=true;await loadQueue().catch(()=>{});if(!q('#me-addsheet').open&&M.queue.length)openAddSheet();q('#me-add-status').textContent=e.message+(saved?' The '+plural(saved,'photo')+' already added are safe.':'');}
 finally{E.adding=false;M.busy=false;E.quiet--;renderAddSheet();}}
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
async function loadOrg(){const grid=q('#me-org-grid'),status=q('#me-org-status');status.textContent='Opening your photos…';chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});const want=E.orgAlbum;try{const rows=await fetchAll(want,()=>want===E.orgAlbum&&q('#me-org').open);if(!rows)return;E.orgRows=rows.filter(canManage);const others=rows.filter(p=>!p.read_only&&!canManage(p)).length;status.textContent=E.orgRows.length?(others?'Showing the '+plural(E.orgRows.length,'photo')+' you can change.':''):'No photos here yet. Tap ＋ Add photos to put some in.';renderOrg();}catch(e){status.textContent=e.message;}}
function renderOrg(){const grid=q('#me-org-grid');grid.replaceChildren();for(const p of E.orgRows){const on=E.sel.has(p.id);const pick=el('button',{type:'button',class:'me-pic','aria-pressed':String(on),'aria-label':(on?'Picked: ':'Pick: ')+(p.caption||'photo')+', '+byline(p),onclick:()=>{on?E.sel.delete(p.id):E.sel.add(p.id);renderOrg();}},thumbImg(p),el('span',{class:'me-tick','aria-hidden':'true',text:on?'✓':''}),isVideo(p)?el('span',{class:'me-tag',text:'Video'}):null);const pen=el('button',{type:'button',class:'me-pen','aria-label':'Change words, date or album for '+(p.caption||'this photo'),text:'✎',onclick:()=>openEdit(E.orgRows,E.orgRows.indexOf(p))});grid.append(el('div',{class:'me-tile'+(on?' picked':'')},pick,pen,el('div',{class:'me-cap',text:p.caption||'No words yet'})));}
 const n=E.sel.size,bar=q('#me-org-bar');bar.hidden=!n;q('#me-org-count').textContent=plural(n,'photo')+' picked';fillAlbumSelect(q('#me-org-move'),'',{add:true});q('#me-org-move').insertBefore(el('option',{value:'',text:'Move to album…'}),q('#me-org-move').firstChild);q('#me-org-move').value='';q('#me-org-all').textContent=n&&n===E.orgRows.length?'Pick none':'Pick all';q('#me-org-all').hidden=!E.orgRows.length;}
const picked=()=>E.orgRows.filter(p=>E.sel.has(p.id));
async function orgMove(){const sel=q('#me-org-move');if(!sel.value)return;let album=sel.value;if(album==='__new'){album=await newAlbumFlow();if(!album){renderOrg();return;}}const list=picked();if(!list.length)return;try{await movePhotos(list,album);}catch(e){toast(e.message);}E.sel.clear();if(E.orgAlbum&&E.orgAlbum!==album)E.orgRows=E.orgRows.filter(p=>!list.includes(p)||p.album_id===E.orgAlbum);await loadAlbums(M.album);chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});renderOrg();}
async function orgDelete(){const list=picked();if(!list.length)return;try{await hidePhotos(list);}catch(e){toast(e.message);}await loadAlbums(M.album).catch(()=>{});chips(q('#me-org-chips'),E.orgAlbum,id=>{E.orgAlbum=id;E.sel.clear();loadOrg();});renderOrg();}
async function closeOrg(){q('#me-org').close();E.sel.clear();await refreshBook();}

/* ---------- keep the book in step ---------- */
async function refreshBook(){if(!E.dirty)return;E.dirty=false;const keepId=M.photos[M.page*bookPageSize()]?.id;try{await loadAlbums(M.album);await loadPhotos();const i=keepId?M.photos.findIndex(p=>p.id===keepId):-1;if(i>0){M.page=Math.floor(i/bookPageSize());renderBook();}}catch(e){toast(e.message);}renderChips();}
function renderChips(){const host=q('#me-chips');if(host)chips(host,M.album,id=>{const c=q('#collection');if(!c)return;c.value=id;M.album=id;c.onchange&&c.onchange();renderChips();});}
function addPencils(){for(const fig of document.querySelectorAll('#gallery figure.memory')){if(fig.querySelector('.me-pen'))continue;const id=fig.querySelector('img[data-id]')?.dataset.id,p=M.photos.find(x=>x.id===id);if(!canManage(p))continue;fig.classList.add('me-has-pen');fig.append(el('button',{type:'button',class:'me-pen','aria-label':'Change words, date or album for '+(p.caption||'this photo'),text:'✎',onclick:e=>{e.stopPropagation();editFromBook(p);}}));}}
function viewerTools(){q('#me-vtools')?.remove();const p=M.photos[M.index];if(!q('#viewer').open||!canManage(p))return;const row=el('div',{id:'me-vtools',class:'me-row'},el('button',{type:'button',class:'me-btn',text:'✎ Edit words, date, album',onclick:()=>{q('#viewer').close();editFromBook(p);}}),el('button',{type:'button',class:'me-btn me-danger',text:'🗑 Delete',onclick:async()=>{q('#viewer').close();try{await hidePhotos([p]);await refreshBook();}catch(e){toast(e.message);}}}));q('#viewer-byline').after(row);}

/* ---------- build the screens ---------- */
function build(){
 const top=el('div',{id:'me-top'},
  el('div',{class:'me-row',role:'toolbar','aria-label':'Photo tools'},
   el('button',{type:'button',id:'me-add',class:'me-btn me-primary',text:'＋ Add photos',onclick:()=>q('#photo-file').click()}),
   el('button',{type:'button',id:'me-cam',class:'me-btn','aria-label':'Take a photo',text:'📷',onclick:()=>q('#camera-file').click()}),
   el('button',{type:'button',id:'me-org-open',class:'me-btn',text:'✎ Edit photos',onclick:openOrganizer})),
  el('button',{type:'button',id:'me-waiting',class:'me-btn me-wait',hidden:true,onclick:openAddSheet}),
  el('div',{id:'me-chips',class:'me-chips',role:'group','aria-label':'Albums'}));
 q('.photo-journal').before(top);
 const summary=q('#memory-management>summary');if(summary)summary.textContent='More: share album, journey memories, refresh';
 const mm=q('#memory-management');if(mm)mm.open=false;
 document.body.append(
  el('dialog',{id:'me-addsheet',class:'me-sheet','aria-labelledby':'me-add-title'},
   el('div',{class:'me-head'},el('h2',{id:'me-add-title',text:'Add photos',tabindex:'-1',autofocus:true}),el('button',{type:'button',class:'me-close','aria-label':'Close (keeps them waiting)',text:'✕',onclick:()=>q('#me-addsheet').close()})),
   el('p',{id:'me-add-hint',class:'me-hint'}),
   el('div',{class:'me-row'},el('label',{for:'me-add-album',text:'Put them in'}),el('select',{id:'me-add-album'})),
   el('textarea',{id:'me-add-allwords',maxlength:'500',rows:'2',placeholder:'Words for all of them (optional)','aria-label':'Words for all of them'}),
   el('div',{class:'me-row me-add-tools'},el('span',{id:'me-add-count',class:'me-count'}),el('button',{type:'button',id:'me-add-more',class:'me-btn me-small-btn',text:'＋ Pick more',onclick:()=>q('#photo-file').click()}),el('button',{type:'button',id:'me-add-cancel',class:'me-btn me-small-btn',text:'Clear all',onclick:clearWaiting})),
   el('div',{id:'me-add-grid',class:'me-grid me-grid-add'}),
   el('p',{id:'me-add-status',class:'me-status',role:'status','aria-live':'polite'}),
   el('div',{class:'me-foot'},el('progress',{id:'me-add-progress',hidden:true}),
    el('button',{type:'button',id:'me-add-save',class:'me-btn me-primary',onclick:addKept}))),
  el('dialog',{id:'me-edit',class:'me-sheet','aria-label':'Change this photo'},
   el('div',{class:'me-head'},el('button',{type:'button',id:'me-edit-prev',class:'me-btn','aria-label':'Save and go to the previous photo',text:'‹',onclick:()=>stepEdit(-1)}),el('span',{id:'me-edit-count',class:'me-count',tabindex:'-1',autofocus:true}),el('button',{type:'button',id:'me-edit-next',class:'me-btn','aria-label':'Save and go to the next photo',text:'›',onclick:()=>stepEdit(1)}),el('button',{type:'button',class:'me-btn me-done',text:'Done',onclick:()=>closeEdit(true)})),
   el('img',{id:'me-edit-img',class:'me-edit-img',alt:''}),el('p',{id:'me-edit-by',class:'me-hint'}),
   el('label',{for:'me-edit-words',text:'Words'}),el('textarea',{id:'me-edit-words',maxlength:'500',rows:'2',placeholder:'A name, a place, a little story'}),
   el('div',{class:'me-two'},el('div',{},el('label',{for:'me-edit-date',text:'Date'}),el('input',{id:'me-edit-date',type:'date'})),el('div',{},el('label',{for:'me-edit-album',text:'Album'}),el('select',{id:'me-edit-album'}))),
   el('div',{class:'me-row me-edit-actions'},el('button',{type:'button',class:'me-btn me-primary',text:'Save',onclick:saveEdit}),el('span',{id:'me-edit-status',class:'me-status',role:'status','aria-live':'polite'}),el('button',{type:'button',class:'me-btn me-danger',text:'🗑 Delete',onclick:deleteEdit}))),
  el('dialog',{id:'me-org',class:'me-sheet','aria-labelledby':'me-org-title'},
   el('div',{class:'me-head'},el('h2',{id:'me-org-title',text:'Edit photos',tabindex:'-1',autofocus:true}),el('button',{type:'button',id:'me-org-all',class:'me-btn',text:'Pick all',onclick:()=>{if(E.sel.size===E.orgRows.length)E.sel.clear();else for(const p of E.orgRows)E.sel.add(p.id);renderOrg();}}),el('button',{type:'button',class:'me-btn me-done',text:'Done',onclick:closeOrg})),
   el('div',{id:'me-org-chips',class:'me-chips',role:'group','aria-label':'Show album'}),
   el('p',{class:'me-hint',text:'Tap photos to pick them, then move or delete. Tap ✎ to change words, date or album.'}),
   el('p',{id:'me-org-status',class:'me-status',role:'status','aria-live':'polite'}),
   el('div',{id:'me-org-grid',class:'me-grid me-grid-org'}),
   el('div',{id:'me-org-bar',class:'me-foot',hidden:true},el('span',{id:'me-org-count',class:'me-count'}),el('div',{class:'me-row'},el('select',{id:'me-org-move','aria-label':'Move picked photos to album'}),el('button',{type:'button',class:'me-btn me-danger',text:'🗑 Delete',onclick:orgDelete}),el('button',{type:'button',class:'me-btn',text:'Clear',onclick:()=>{E.sel.clear();renderOrg();}})))),
  el('dialog',{id:'me-name',class:'me-small','aria-label':'Name a new album'},el('form',{id:'me-name-form'},el('label',{for:'me-name-input',text:'Name the new album'}),el('input',{id:'me-name-input',maxlength:'80',placeholder:'Christmas 2026, Beach trip…',autocomplete:'off'}),el('p',{id:'me-name-status',class:'me-status',role:'status'}),el('div',{class:'me-row'},el('button',{type:'submit',class:'me-btn me-primary',text:'Make album'}),el('button',{type:'button',id:'me-name-cancel',class:'me-btn',text:'Cancel'})))),
  el('div',{id:'me-toast',role:'status','aria-live':'polite',popover:'manual',hidden:true}));
 q('#me-add-album').onchange=async()=>{await pickAlbum(q('#me-add-album'));renderAddSheet();};
 q('#me-edit-album').onchange=()=>pickAlbum(q('#me-edit-album'));
 q('#me-org-move').onchange=orgMove;
 q('#me-addsheet').addEventListener('close',()=>{releasePreviews();renderWaiting();});
 q('#me-edit').addEventListener('cancel',e=>{e.preventDefault();closeEdit(true);});
 q('#me-org').addEventListener('cancel',e=>{e.preventDefault();closeOrg();});
 fillAlbumSelect(q('#me-add-album'),M.album&&M.album!==''?M.album:'0');renderChips();}

/* ---------- hook into the page's own steps ---------- */
function hook(name,{before,after,now}={}){const orig=window[name];if(typeof orig!=='function')return;const isAsync=orig.constructor&&orig.constructor.name==='AsyncFunction';window[name]=isAsync?async function(...a){const s=before?.(...a);const pending=orig.apply(this,a);try{now?.(...a);}catch(e){console.warn('memories-easy',e);}const r=await pending;try{after?.(s,...a);}catch(e){console.warn('memories-easy',e);}return r;}:function(...a){const s=before?.(...a);const r=orig.apply(this,a);try{after?.(s,...a);}catch(e){console.warn('memories-easy',e);}return r;};}
build();
const origQueueFiles=window.queueFiles;window.queueFiles=async function(files){const t0=Date.now()-1;E.quiet++;try{await origQueueFiles.call(this,files);for(const x of M.queue)if((x.created||0)>=t0)E.fresh.add(x.id);openAddSheet();}catch(e){toast(e.message);throw e;}finally{E.quiet--;}};
hook('renderQueue',{before:()=>q('#memory-management')?.open,after:wasOpen=>{const mm=q('#memory-management');if(mm)mm.open=!!wasOpen;if(!sessionOk()){if(q('#me-addsheet').open)q('#me-addsheet').close();renderWaiting();return;}if(q('#me-addsheet').open||E.adding)renderAddSheet();else if(M.queue.length&&M.queue.some(x=>!E.known.has(x.id))){openAddSheet();}else renderWaiting();}});
hook('appendPhotos',{after:()=>addPencils()});
hook('openPhoto',{now:()=>viewerTools(),after:()=>{if(!q('#me-vtools'))viewerTools();}});
hook('loadAlbums',{after:()=>{renderChips();const a=q('#me-add-album');if(a)fillAlbumSelect(a,a.value&&a.value!=='__new'?a.value:(M.album||'0'));}});
hook('loadPhotos',{after:()=>{renderChips();addPencils();}});
hook('say',{after:(s,text)=>{if(text&&!E.quiet&&!q('#memory-management')?.open&&!q('#me-addsheet')?.open)toast(text);}});
hook('invalidateMemoriesSession',{after:()=>{for(const id of ['#me-addsheet','#me-edit','#me-org','#me-name'])if(q(id)?.open)q(id).close();E.edit=null;E.orgRows=[];E.sel.clear();dropThumbs();renderWaiting();}});
if(M.queue.length&&sessionOk())openAddSheet();
addPencils();
})();
