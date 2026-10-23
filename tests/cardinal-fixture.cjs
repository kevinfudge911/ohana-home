// Local synthetic fixture. No credentials, family data, or production forwarding.
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),live=path.join(root,'live'),files=fs.readdirSync(live),file=files.find(x=>x.endsWith('app.html')),source=fs.readFileSync(path.join(live,file),'utf8');
const worker=fs.readFileSync(path.join(live,'worker.js'),'utf8'),imports={},aliases={};
for(const m of worker.matchAll(/import\s+(\w+)\s+from\s+["']\.\/([^"']+)["']/g))imports[m[1]]=m[2];
for(const m of worker.matchAll(/["'](\/[^"']+)["']\s*:\s*(\w+)/g))if(imports[m[2]])aliases[m[1]]=imports[m[2]];
const fixture=`<script>
(()=>{
const push=history.pushState.bind(history),replace=history.replaceState.bind(history);history.pushState=(s,t)=>push(s,t);history.replaceState=(s,t)=>replace(s,t);clearTimeout(pollTimer);schedulePoll=()=>{};AudioSys.muted=true;HTMLMediaElement.prototype.play=()=>Promise.reject(Error('Silent fixture'));
const clone=x=>JSON.parse(JSON.stringify(x)),q=new URLSearchParams(location.search);
window.fixtureAudioPlays=0;HTMLMediaElement.prototype.play=function(){fixtureAudioPlays++;return Promise.reject(Error('Silent fixture'))};
if(typeof maybeShowReleaseNews==='function'){const showRelease=maybeShowReleaseNews;maybeShowReleaseNews=force=>force?showRelease(force):undefined;}
const members=[{id:5,name:'Alex Fixture',avatar:'🐢'},{id:202,name:'Jamie Fixture',avatar:'🌺',online:true}];
let game={id:90001,room_id:900,type:'words',name:'Ohana Words',status:'playing',in_game:true,my_turn:true,players:[5,202],turn:0,max_players:2,updated_at:1,mode:'classic',names:Object.fromEntries(members.map(m=>[m.id,m])),state:{board:Array(225).fill(null),bonus:Array(225).fill(''),racks:{5:['F','A','M','I','L','Y','S']},scores:{5:48,202:36},bag:64,lastMove:[],foundSurprises:{},surprises:[],chat:[],history:[]}};
'HOME'.split('').forEach((l,i)=>game.state.board[110+i]={l,v:1});
if(q.get('kind')==='robot')game={...game,type:'shuffle',name:'Regular Rummy',mode:'rummy',players:[5,-1],names:{5:members[0],'-1':{id:-1,name:'Ohana Robot',is_bot:true}},bot:{id:-1,difficulty:'easy'},state:{version:1,mode:'rummy',round:1,dealer:0,phase:'draw',revision:0,target:100,scores:{5:0,'-1':0},melds:[],stock:31,discard:'H7',discardCount:1,hands:{5:['C13','S11','C12','S7','C11','S3','C10','H12','C9','H8'],'-1':10},drawnDiscard:null,openingPasses:0,forceStock:false,result:null,lastPlay:null}};
const thread={key:'room:900',kind:'room',name:'Fictional family',people:members,last:{id:1,sender:202,text:'Ready for another game?'},unread:0};
localStorage.setItem('ohana_room_guide:5:900:bridge:4','1');localStorage.setItem('ohana_token','fictional-only');S.token='fictional-only';S.me=members[0];S.room=900;S._pushAsked=true;S.sync={me:S.me,roomId:900,familyName:'Fictional family',rooms:[{id:900,name:'Fictional family'}],members,games:[game],allGames:[game],types:{words:{name:'Ohana Words',min:2,max:4},shuffle:{name:'Ohana Shuffle',min:2,max:6}},messages:[],invitations:[],sentInvitations:[]};
const sy=clone(S.sync);window.fixtureRequests=[];window.fixtureGame=game;window.fixtureReentries=[];const realOpenGame=openGame;openGame=async id=>{fixtureReentries.push(id);return realOpenGame(id)};
api=async(p,b,m)=>{fixtureRequests.push({path:p,method:m||(b?'POST':'GET')});if(p==='/api/game/90001/leave'&&b){game.status='finished';game.my_turn=false;sy.games=sy.allGames=[clone(game)];return{ok:true};}if(p==='/api/game/create'&&b)return{id:90002};if(p==='/api/game/90002')return{...clone(game),id:90002,status:'playing',my_turn:true};if(b||m&&m!=='GET')throw Error('Synthetic fixture rejects mutations');if(p.startsWith('/api/sync'))return clone(sy);if(p==='/api/chat')return{conversations:[clone(thread)],unread:0};if(p.startsWith('/api/chat?conversation='))return {thread:clone(thread),messages:[{id:1,sender:202,text:'Ready for another game?',created_at:1792644000}],hasMore:false};if(p.startsWith('/api/game/history'))return{games:[],next:null};if(p==='/api/game/90001')return clone(game);if(p.includes('/music'))return{tracks:[],playlists:[],hidden:[]};return{};};
S.game=q.get('room')==='home'?null:game.id;S.gstate=S.game?clone(game):null;S.tab='games';render();
UC.threads=[clone(thread)];UC.member=5;UC.seen=new Map();
setTimeout(async()=>{document.querySelector('#chat-head')?.focus();await openChatInbox(null,true);setTimeout(async()=>{if(q.has('chat')){document.querySelector('[data-hub-tab="chat"]').click();await selectChatThread(thread.key);document.querySelector('#uc-input').value='Fictional unsent draft';saveChatDraft();}if(q.has('expand'))document.querySelector('#uc-expand').click();},150)},150);
document.title='FICTIONAL Bridge candidate';
const proof=document.createElement('div');proof.textContent='FICTIONAL LOCAL PREVIEW';proof.style.cssText='position:fixed;top:0;right:0;z-index:2147483647;padding:2px 6px;background:#fff;color:#333;font:11px sans-serif;pointer-events:none';document.body.append(proof);
})();</script>`;
http.createServer((req,res)=>{const u=new URL(req.url,'http://127.0.0.1:8844');
 if(req.method!=='GET'){res.writeHead(405);return res.end('Mutation blocked')}
 if(u.pathname==='/'){res.writeHead(200,{'content-type':'text/html;charset=utf-8','content-security-policy':"connect-src 'self';media-src 'none'",'cache-control':'no-store'});return res.end(fs.readFileSync(path.join(live,file),'utf8')+fixture+'<script src="/cardinal-browser-fixture.js"></script>')}
 if(u.pathname==='/cardinal-browser-fixture.js'){res.writeHead(200,{'content-type':'application/javascript'});return res.end(fs.readFileSync(path.join(root,'tests/cardinal-browser-fixture.js')))}
 if(u.pathname.startsWith('/api/')){res.writeHead(200,{'content-type':'application/json'});return res.end('{}')}
 const name=path.posix.basename(u.pathname),asset=aliases[u.pathname]||files.find(f=>f===name)||files.find(f=>f.endsWith('-'+name))||files.find(f=>f.endsWith('-'+name+'.txt')),absolute=asset?path.join(live,asset):path.join(root,name);
 if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute)||!fs.statSync(absolute).isFile()){res.writeHead(404);return res.end('Local asset unavailable')}
 const ext=path.extname(name),mime={'.js':'application/javascript','.html':'text/html','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'}[ext]||'application/octet-stream';res.writeHead(200,{'content-type':mime});fs.createReadStream(absolute).pipe(res);
}).listen(0,'127.0.0.1',function(){const r={pid:process.pid,port:this.address().port,url:'http://127.0.0.1:'+this.address().port+'/'};fs.writeFileSync(path.join(root,'CARDINAL-FIXTURE-SERVER.json'),JSON.stringify(r));console.log(r);});

