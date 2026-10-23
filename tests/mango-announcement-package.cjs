const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),live=path.join(root,'live'),app=fs.readdirSync(live).find(x=>x.endsWith('-app.html'));
const raw=fs.readFileSync(path.join(live,app)),gzip=fs.readFileSync(path.join(live,app+'.gz'));
assert.ok(zlib.gunzipSync(gzip).equals(raw),'Current runtime gzip must expand to exact merged source');
const before=crypto.createHash('sha256').update(gzip).digest('hex');
cp.execFileSync(process.execPath,['scripts/package-main-html.cjs'],{cwd:root});
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(live,app+'.gz'))).digest('hex'),before,'Packaging is deterministic');
for(const file of ['live/worker.js','wrangler.toml','scripts/package-main-html.cjs'])assert.deepEqual(fs.readFileSync(path.join(root,file)),cp.execFileSync('git',['show','HEAD:'+file],{cwd:root,maxBuffer:10*1024*1024}));
const queue=['worker.js'],needed=new Set();while(queue.length){const p=queue.shift();if(needed.has(p))continue;needed.add(p);const bytes=fs.readFileSync(path.join(live,p));if(p.endsWith('.js'))for(const m of bytes.toString().matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["'](\.[^"']+)["']/g))queue.push(path.posix.normalize(path.posix.join(path.posix.dirname(p),m[1])));}
assert.ok(needed.has(app+'.gz')&&!needed.has(app),'Existing gzip loader retained');
assert.ok(!needed.has('ohana-mango-announcement.js'),'Presentation code is embedded, no new runtime dependency');
const modified=cp.execFileSync('git',['-c','core.autocrlf=false','diff','--name-only','HEAD','--','live'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(Boolean);
assert.ok(modified.every(f=>['live/'+app,'live/'+app+'.gz','live/ohana-mango-announcement.js'].includes(f)),'No other runtime asset/dependency changed');
console.log(JSON.stringify({passed:true,lossless:true,deterministic:true,existingDependencyCount:needed.size,newWorkerDependencies:0,workerConfigBindingsAndPackagerUnchanged:true,rawBytes:raw.length,gzipBytes:gzip.length},null,2));
