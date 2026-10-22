// Local-only transport. Never forwards requests or opens a family session.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),live=path.join(root,'live'),files=fs.readdirSync(live),app=files.find(f=>f.endsWith('app.html'));
const worker=fs.readFileSync(path.join(live,'worker.js'),'utf8'),imports={},aliases={};
for(const m of worker.matchAll(/import\s+(\w+)\s+from\s+["']\.\/([^"']+)["']/g))imports[m[1]]=m[2];
for(const m of worker.matchAll(/["'](\/[^"']+)["']\s*:\s*(\w+)/g))if(imports[m[2]])aliases[m[1]]=imports[m[2]];
for(const m of worker.matchAll(/p\s*===?\s*["'](\/[^"']+)["'][^\n]*?new Response\((\w+)/g))if(imports[m[2]])aliases[m[1]]=imports[m[2]];
const injection=`<script>
(()=>{
 const names={1:{id:1,name:'Alex Fixture',avatar:'@hon'},2:{id:2,name:'Jamie Fixture',avatar:'@flo'},3:{id:3,name:'Riley Fixture',avatar:'@eag'},4:{id:4,name:'Casey Fixture',avatar:'@sun'}};
 const hand=[{id:1,n:1,color:'coral'},{id:2,n:2,color:'ocean'},{id:3,n:3,color:'sun'},{id:4,n:4,color:'leaf'},{id:5,n:8,color:'coral'},{id:6,n:9,color:'ocean'},{id:7,n:10,color:'sun'},{id:8,n:11,color:'leaf'},{id:9,n:12,color:'coral'},{id:10,n:0,wild:true,color:'star'}];
 const params=new URLSearchParams(location.search),long=params.has('long'),players=params.has('four')?[1,2,3,4]:[1,2];
 if(long)for(let i=11;i<=30;i++)hand.push({id:i,n:(i%12)+1,color:['coral','ocean','sun','leaf'][i%4]});
 const g={id:99902,type:'ohana10',name:'Ohana TEN',room_id:1,players,turn:params.has('offturn')?1:0,status:'playing',in_game:true,my_turn:!params.has('offturn'),names,state:{hands:{1:hand,2:10,3:9,4:8},deck:83,discard:[{id:66,n:6,color:'ocean'}],discardCount:1,journeys:{1:0,2:0,3:1,4:2},penalties:{1:0,2:15,3:10,4:20},completed:{1:false,2:true,3:false,4:false},melds:{1:[],2:[{cards:[{id:70,n:3,color:'coral'},{id:71,n:3,color:'ocean'}]}],3:[],4:[]},hasDrawn:true,voyage:1,history:[],chat:[]}};
 window.fixtureRequests=[];window.fixtureGame=g;window.fixtureBaseline=JSON.stringify(g);
 clearTimeout(pollTimer);schedulePoll=()=>{};S.token='fictional-only';S.me=names[1];S.room=1;S.sync={me:names[1],members:Object.values(names),rooms:[{id:1,name:'Fictional Ohana'}],games:[g],allGames:[g],invites:[],prefs:{}};S._pushAsked=true;S.game=g.id;S.gstate=g;S.tab='games';
 api=async(p,body,method)=>{fixtureRequests.push({p,method:method||(body?'POST':'GET')});if(body||method&&method!=='GET')throw Error('Fixture blocks all mutations');if(p.startsWith('/api/sync'))return S.sync;if(p==='/api/game/'+g.id)return structuredClone(g);return {};};
 AudioSys.muted=true;HTMLMediaElement.prototype.play=function(){return Promise.reject(Error('Fixture audio disabled'));};
 window.fixtureRender=()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());S.game=g.id;S.gstate=g;renderGame();if(params.get('felt')==='purple')document.querySelector('.o10')?.style.setProperty('--ten-felt','#352941');};
 window.fixtureRender();document.title='Ohana TEN fictional local preview';
})();</script>`;
module.exports={html:()=>fs.readFileSync(path.join(live,app),'utf8')+injection,asset:name=>{const file=aliases['/'+name]||files.find(f=>f===name)||files.find(f=>f.endsWith('-'+name))||files.find(f=>f.endsWith('-'+name+'.txt'));return file&&path.join(live,file);}};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://127.0.0.1:8807');
 if(req.method!=='GET'){res.writeHead(405);return res.end('Fixture rejects mutations');}
 if(url.pathname==='/'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"connect-src 'self'; form-action 'none'"});return res.end(fs.readFileSync(path.join(live,app),'utf8')+injection);}
 if(url.pathname.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});return res.end('{}');}
 const name=path.posix.basename(url.pathname),file=aliases[url.pathname]||files.find(f=>f===name)||files.find(f=>f.endsWith('-'+name))||files.find(f=>f.endsWith('-'+name+'.txt'));
 if(!file){res.writeHead(404);return res.end('No local fixture asset: '+name);}
 const ext=path.extname(name),mime={'.js':'application/javascript','.html':'text/html','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'}[ext]||'application/octet-stream';res.writeHead(200,{'content-type':mime});fs.createReadStream(path.join(live,file)).pipe(res);
});if(require.main===module)server.listen(8807,'127.0.0.1',()=>console.log('TEN local fixture http://127.0.0.1:8807/; no production forwarding'));
