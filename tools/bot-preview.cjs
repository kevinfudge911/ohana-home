// Local fictional Worker + SQLite. No requests are forwarded to a live service.
const http=require('http'),fs=require('fs'),path=require('path');
const root=process.cwd(),live=path.join(root,'live'),files=fs.readdirSync(live),worker=fs.readFileSync(path.join(live,'worker.js'),'utf8');
const app=worker.match(/^import APP_HTML from "\.\/(.*?)";/m)[1];
const fixture=fs.readFileSync('tests/shuffle-api.cjs','utf8').split('(async()=>{')[0];
const {c,env,sql}=new Function('require',fixture+'\nreturn {c,env,sql};')(require);
const calls=[];env.ctx.waitUntil=p=>p.catch(e=>console.error('Fictional background task:',e.message));
const bootstrap='<script>localStorage.setItem("ohana_token","host");localStorage.setItem("ohana_room","1");HTMLMediaElement.prototype.play=function(){return Promise.reject(Error("Audio disabled in fictional preview"))};</script>';
const imports={};for(const m of worker.matchAll(/import\s+(\w+)\s+from\s+["']\.\/([^"']+)["']/g))imports[m[1]]=m[2];
const aliases={};for(const m of worker.matchAll(/["'](\/[^"']+)["']\s*:\s*(\w+)/g))if(imports[m[2]])aliases[m[1]]=imports[m[2]];
for(const m of worker.matchAll(/p\s*===?\s*["'](\/[^"']+)["'][^\n]*?new Response\((\w+)/g))if(imports[m[2]])aliases[m[1]]=imports[m[2]];
const server=http.createServer(async(req,res)=>{const url=new URL(req.url,'http://127.0.0.1:8794');try{
 if(url.pathname.startsWith('/api/')){let body='';for await(const chunk of req)body+=chunk;const request=new Request(url,{method:req.method,headers:req.headers,body:!['GET','HEAD'].includes(req.method)?body||'{}':undefined});const response=await c.api2(request,env,url);const text=await response.text();calls.push({path:url.pathname,method:req.method,status:response.status});fs.writeFileSync('artifacts/bot-preview-requests.json',JSON.stringify(calls,null,2));res.writeHead(response.status,{'content-type':'application/json','cache-control':'no-store'});return res.end(text);}
 if(req.method!=='GET'){res.writeHead(405);return res.end('Fixture only');}
 if(url.pathname==='/'){let html=fs.readFileSync(path.join(live,app),'utf8');const start=html.indexOf('<script');html=html.slice(0,start)+bootstrap+html.slice(start);res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','content-security-policy':"connect-src 'self'"});return res.end(html);}
 const name=path.posix.basename(url.pathname),file=aliases[url.pathname]||files.find(f=>f===name)||files.find(f=>f.endsWith('-'+name))||files.find(f=>f.endsWith('-'+name+'.txt'));
 const absolute=file?path.join(live,file):path.join(root,name);if(!absolute.startsWith(root)||!fs.existsSync(absolute)||!fs.statSync(absolute).isFile()){res.writeHead(404);return res.end('Fixture asset unavailable');}
 const mime={'.js':'application/javascript','.html':'text/html','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'}[path.extname(name)]||'application/octet-stream';res.writeHead(200,{'content-type':mime});fs.createReadStream(absolute).pipe(res);
 }catch(e){calls.push({path:url.pathname,method:req.method,error:e.message});fs.writeFileSync('artifacts/bot-preview-requests.json',JSON.stringify(calls,null,2));res.writeHead(400,{'content-type':'application/json'});res.end(JSON.stringify({error:e.message}));}});
server.listen(8794,'127.0.0.1',()=>console.log('Fictional Rummy/Gin preview ready: http://127.0.0.1:8794/; local SQLite only, no production forwarding.'));
