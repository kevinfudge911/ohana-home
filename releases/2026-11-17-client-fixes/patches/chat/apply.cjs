const fs=require('node:fs'),path=require('node:path');
const dir=__dirname;
function apply(app,worker){
 if(app.includes('ohana-chat-v2-feature'))throw Error('Already patched');
 const delegation='openMemberProfile(el.dataset.dm);';
 if(app.split(delegation).length!==3)throw Error('Character delegation drift');
 app=app.split(delegation).join("(el.closest('.ohana-workstation,#game-controls-dock,#pz-workstation')?openMemberDM:openMemberProfile)(el.dataset.dm);");
 app=app.replace("(t?.kind==='room'?'Room':'Private')","(t?.kind==='room'?'Room':t?.kind==='person'?'Private':'Group')");
 const quickSend='await api(`/api/game/${gameId}/chat`, { text });';
 if(app.split(quickSend).length!==2)throw Error('Game quick-chat anchor drift');
 app=app.replace(quickSend,"await api('/api/chat-v2',{action:'send',scope:{kind:'game',id:Number(gameId)},text,clientId:crypto.randomUUID()});");
 const playerAnchor='players:s.players.slice(0,20).map(p=>({name:text(p.name,80),coins:Number.isFinite(p.coins)?p.coins:0,active:p.active===true}))';
 if(app.split(playerAnchor).length!==2)throw Error('MOM snapshot anchor drift');
 app=app.replace(playerAnchor,'players:s.players.slice(0,20).map(p=>({memberId:/^member-[1-9][0-9]*$/.test(p.id)&&Number.isSafeInteger(Number(p.id.slice(7)))?Number(p.id.slice(7)):null,name:text(p.name,80),coins:Number.isFinite(p.coins)?p.coins:0,active:p.active===true}))');
 const railAnchor="const n=document.createElement('span');n.className='pp-player'+(p.active?' active':'');n.textContent=p.name+' · '+p.coins;rail.append(n);";
 if(app.split(railAnchor).length!==2)throw Error('MOM rail anchor drift');
 app=app.replace(railAnchor,"const n=document.createElement(p.memberId&&p.memberId!==S.me?.id?'button':'span');n.className='pp-player'+(p.active?' active':'');if(n.tagName==='BUTTON'){n.type='button';n.style.minHeight='44px';n.setAttribute('aria-label','Send a private message to '+p.name);n.onclick=()=>openMemberDM(p.memberId);const av=document.createElement('span');av.setAttribute('aria-hidden','true');av.innerHTML=avatarMarkup((S.sync?.members||[]).find(m=>m.id===p.memberId)?.avatar||'@hon');n.append(av);}const label=document.createElement('span');label.textContent=p.name+' · '+p.coins;n.append(label);rail.append(n);");
 const client=['controller.mjs','bubble-view.mjs','bootstrap.js'].map(f=>fs.readFileSync(path.join(dir,f),'utf8').replace(/^export /gm,'')).join('\n');
 app=app.replace('</body>','<script id="ohana-chat-v2-feature">\n'+client+'\n</script></body>');
 const anchor='if(p==="/api/chat")return unifiedChat(req,env222222,me,body,url);';
 if(worker.split(anchor).length!==2)throw Error('Worker anchor drift');
 // Main worker has already parsed POST JSON. Reconstruct body for scoped handler without rereading consumed stream.
 worker='import {chatV2Route,extendChatV2Catalog,chatV2LegacySend} from "./chat-v2/runtime.mjs";\n'+worker.replace(anchor,'if(p==="/api/chat-v2")return chatV2Route(new Request(req.url,{method:req.method,headers:req.headers,...(req.method==="POST"?{body:JSON.stringify(body)}:{})}),env222222,me,childPolicy,chatCatalog,notifyMembers);'+anchor);
 const catalogAnchor='catalog={threads,...rest};await chatImport(db,catalog);';
 if(worker.split(catalogAnchor).length!==2)throw Error('Catalog anchor drift');
 worker=worker.replace(catalogAnchor,'catalog={threads,...rest};await extendChatV2Catalog(env222222,me,catalog,childPolicy,chatCatalog);await chatImport(db,catalog);');
 const sendAnchor='const text=String(body.text||"").trim().slice(0,2e3),image=body.image?String(body.image):null,client=String(body.clientId||"");';
 if(worker.split(sendAnchor).length!==2)throw Error('Legacy send anchor drift');
 const from=worker.indexOf(sendAnchor),to=worker.indexOf('if(thread&&url.searchParams.get("reactionsOnly")',from);if(to<0)throw Error('Legacy send boundary drift');
 worker=worker.slice(0,from)+'return chatV2LegacySend(req,env222222,me,body,thread,childPolicy,chatCatalog,notifyMembers); }'+worker.slice(to);
 worker=require('./history-filter.cjs').apply(worker);
 worker=require('./puzzle-patch.cjs').apply(worker);
 return {app,worker};
}
module.exports={apply};
if(require.main===module){const app=fs.readFileSync(process.argv[2]||'porch-polish/candidate.html','utf8'),worker=fs.readFileSync(process.argv[3]||'porch-polish/modules/worker.js','utf8');const result=apply(app,worker);fs.mkdirSync(path.join(dir,'candidate/chat-v2'),{recursive:true});fs.writeFileSync(path.join(dir,'candidate/app.html'),result.app);fs.writeFileSync(path.join(dir,'candidate/worker.js'),result.worker);for(const f of ['runtime.mjs','service.mjs','d1-repository.mjs','authorization.mjs','http.mjs'])fs.copyFileSync(path.join(dir,f),path.join(dir,'candidate/chat-v2',f));console.log('Isolated app/worker candidate generated; migration and review required.');}
