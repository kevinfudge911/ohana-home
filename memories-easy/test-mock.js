/* Test-only: pretend Memories server inside the page, so trying the screens never touches the real family photos.
   Load into a /memories page (or an iframe of it) BEFORE memories-easy.js, then run start(). */
(()=>{'use strict';
const W=window;if(W.__meMock)return;W.__meMock=true;
const colors=['#d94f3d','#3d8bd9','#4caf50','#f2c14e','#9c27b0','#ff7043','#26a69a','#8d6e63','#5c6bc0','#ec407a','#7cb342','#29b6f6'];
const now=Date.now(),day=864e5;
const db={me:{id:5,name:'Pe-paw',is_admin:true},rooms:[{id:1,name:'Ohana Family',owner_id:5}],albums:[{id:'95a5fcbd-f122-458c-85ee-339381d99eb3',name:'Momma Fudge'}],photos:[]};
const uuid=()=>crypto.randomUUID();
const names=['Christmas morning','Pumpkin patch','Grandma with baby','Tummy time','Duck pond','Kayden first Halloween','Thanksgiving table','Beach day','Lake trip','Birthday cake','Snow day','Porch swing'];
for(let i=0;i<12;i++)db.photos.push({id:uuid(),member_id:i%4===3?8:5,author:i%4===3?'Tara':'Pe-paw',caption:names[i],created_at:now-i*3*day,album_id:i<3?db.albums[0].id:'0',mime:'image/jpeg',hidden:0,color:colors[i]});
W.__meMockDb=db;
function picture(p,size){const c=document.createElement('canvas');c.width=size;c.height=Math.round(size*.75);const g=c.getContext('2d');g.fillStyle=p.color||'#888';g.fillRect(0,0,c.width,c.height);g.fillStyle='#fff';g.font='bold '+Math.round(size/9)+'px sans-serif';g.textAlign='center';g.fillText(p.caption.slice(0,14),c.width/2,c.height/2);g.font=Math.round(size/14)+'px sans-serif';g.fillText(new Date(p.created_at).toLocaleDateString(),c.width/2,c.height/2+size/8);return new Promise(r=>c.toBlob(r,'image/jpeg',.8));}
const json=(d,status=200)=>new Response(JSON.stringify(d),{status,headers:{'content-type':'application/json'}});
const visible=()=>db.photos.filter(p=>!p.hidden);
const shape=p=>({id:p.id,member_id:p.member_id,author:p.author,caption:p.caption,created_at:p.created_at,album_id:p.album_id,mime:p.mime,image_url:'/api/memories/photo/'+p.id,thumbnail_url:'/api/memories/photo/'+p.id+'?thumbnail=1'});
async function handle(path,opts={}){
 const u=new URL(path,location.origin),m=(opts.method||'GET').toUpperCase(),p=u.pathname;let mt;
 await new Promise(r=>setTimeout(r,60));
 if(p==='/api/memories/rooms')return json({rooms:db.rooms,me:db.me});
 if(p==='/api/memories/albums'&&m==='GET')return json({albums:db.albums.map(a=>({...a,photos:visible().filter(x=>x.album_id===a.id).length}))});
 if(p==='/api/memories/albums'&&m==='POST'){const name=JSON.parse(opts.body).name.trim();if(db.albums.some(a=>a.name.toLowerCase()===name.toLowerCase()))return json({error:'There is already an album with that name.'},409);const a={id:uuid(),name};db.albums.push(a);return json({album:{...a,photos:0}},201);}
 if((mt=p.match(/^\/api\/memories\/albums\/([\w-]+)$/))&&m==='DELETE'){db.albums=db.albums.filter(a=>a.id!==mt[1]);return json({deleted:true});}
 if(p==='/api/memories/gallery'){const album=u.searchParams.get('album');let rows=visible().filter(x=>!album||x.album_id===album).sort((a,b)=>b.created_at-a.created_at||b.id.localeCompare(a.id)).map(shape);if(!album)rows.push({id:'mike-birthday',caption:'Mike',created_at:0,author:'Our Ohana',read_only:true,image_url:'/mike-birthday.webp'});const before=Number(u.searchParams.get('before')),bid=u.searchParams.get('beforeId');if(bid)rows=rows.filter(x=>x.created_at<before||x.created_at===before&&x.id<bid);return json({photos:rows.slice(0,5),more:rows.length>5});}
 if((mt=p.match(/^\/api\/memories\/photo\/([\w-]+)$/))&&m==='GET'){const x=db.photos.find(y=>y.id===mt[1]&&!y.hidden);if(!x)return json({error:'Photo not found.'},404);return new Response(await picture(x,u.searchParams.has('thumbnail')?300:900),{headers:{'content-type':'image/jpeg'}});}
 if((mt=p.match(/^\/api\/memories\/photo\/([\w-]+)\/(album|hide|unhide|edit)$/))&&m==='POST'){const x=db.photos.find(y=>y.id===mt[1]);if(!x)return json({error:'Photo not found.'},404);const body=opts.body?JSON.parse(opts.body):{};
  if(mt[2]==='album'){x.album_id=body.album||'0';return json({moved:true});}if(mt[2]==='hide'){x.hidden=1;return json({hidden:true});}if(mt[2]==='unhide'){x.hidden=0;return json({restored:true});}
  if('caption' in body)x.caption=body.caption;if('created_at' in body)x.created_at=body.created_at;if('album' in body)x.album_id=body.album;W.__meLastEdit=body;return json({saved:true});}
 if(p==='/api/memories'&&m==='POST'){const f=opts.body;const x={id:f.get('id'),member_id:5,author:'Pe-paw',caption:f.get('caption')||'',created_at:Date.now(),album_id:f.get('album')||'0',mime:f.get('photo').type||'image/jpeg',hidden:0,color:'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0')};db.photos.push(x);(W.__meUploads||(W.__meUploads=[])).push({id:x.id,caption:x.caption,album:x.album_id,size:f.get('photo').size});return json({id:x.id,saved:true},201);}
 if(p.startsWith('/api/memories/photo/')&&m==='GET')return json({reactions:[],comments:[],allowed_emojis:[],my_reaction:null});
 if(p==='/api/memories/journeys')return json({journeys:[]});
 if(p==='/api/album')return json({album:[]});
 if(p==='/api/prefs')return json({});
 throw Error('Test page: '+m+' '+p+' is not pretend-able');
}
W.call=async function(path,opts={}){const r=await handle(path,opts);if(!r.ok){const d=await r.json().catch(()=>({}));throw Error(d.error||'The connection stopped. Please try again.');}return r;};
W.__meFakeFile=(name,color,type='image/jpeg')=>new Promise(r=>{const c=document.createElement('canvas');c.width=640;c.height=480;const g=c.getContext('2d');g.fillStyle=color;g.fillRect(0,0,640,480);g.fillStyle='#fff';g.font='bold 60px sans-serif';g.fillText(name,30,260);c.toBlob(b=>r(new File([b],name+'.jpg',{type,lastModified:1700000000000})),'image/jpeg',.8);});
})();
