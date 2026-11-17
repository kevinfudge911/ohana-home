// Git-triggered, content-pinned client and response release. No credentials or live data in Git.
import fs from 'node:fs/promises';
import {schemaGate} from './schema-gate.mjs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const mode=process.argv[2];
if(!['check','deploy','offline'].includes(mode))throw Error('Usage: node release.mjs check|deploy|offline [private-export-directory]');
const plan=JSON.parse(await fs.readFile(path.join(here,'plan.json'),'utf8'));
const canonical=x=>JSON.stringify(x,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Cloudflare replaces the descriptive release message on code uploads; operational settings stay pinned.
const comparableSettings=value=>{const copy=structuredClone(value);if(copy.annotations)delete copy.annotations['workers/message'];return copy};
const settingsFingerprint=value=>hash(canonical(comparableSettings(value)));
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const base=`https://api.cloudflare.com/client/v4/accounts/${account}/workers/scripts/${plan.worker}`;
const token=process.env.CLOUDFLARE_API_TOKEN;
const assert=(v,s)=>{if(!v){const e=Error(s);e.name='ReleaseSafetyError';throw e}};
const api=async(suffix,opts={})=>{
 assert(token,'Existing Workers Builds CLOUDFLARE_API_TOKEN unavailable; nothing deployed');
 const r=await fetch(base+suffix,{...opts,headers:{...opts.headers,Authorization:`Bearer ${token}`}});
 assert(r.ok,`Cloudflare request failed (${r.status}); private response details suppressed`);return r;
};
const json=async suffix=>{const j=await(await api(suffix)).json();assert(j.success,'Cloudflare API error; response suppressed');return j.result};
const parseModules=(body,contentType)=>{
 const boundary=contentType.match(/boundary=(?:"([^"\r\n]+)"|([^;\s]+))/i);assert(boundary,'Missing multipart boundary');
 const divider=Buffer.from('--'+(boundary[1]||boundary[2]));const modules=new Map();modules.contentTypes=new Map();let cursor=0;
 assert(body.subarray(0,divider.length).equals(divider),'Invalid multipart start');
 while(true){
  cursor+=divider.length;
  if(body.subarray(cursor,cursor+2).toString()==='--')break;
  assert(body.subarray(cursor,cursor+2).toString()==='\r\n','Invalid part delimiter');cursor+=2;
  const end=body.indexOf(Buffer.from('\r\n\r\n'),cursor);assert(end>=cursor,'Missing part headers');
  const headers=body.subarray(cursor,end).toString('utf8');const name=headers.match(/Content-Disposition:[^\r\n]*?\bname="([^"\r\n]+)"/i)?.[1];
  assert(name&&!modules.has(name),'Missing or duplicate module name');
  const next=body.indexOf(Buffer.concat([Buffer.from('\r\n'),divider]),end+4);assert(next>=end+4,'Missing next module boundary');
  const ct=headers.match(/(?:^|\r\n)Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim();assert(ct,'Missing original module Content-Type');modules.contentTypes.set(name,ct);modules.set(name,body.subarray(end+4,next));cursor=next+2;
 }
 return modules;
};
const getModules=async()=>{const r=await api('/content/v2');return parseModules(Buffer.from(await r.arrayBuffer()),r.headers.get('content-type')||'')};
const fingerprint=modules=>hash(JSON.stringify([...modules].map(([name,data])=>[name,modules.contentTypes.get(name),hash(data)]).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0)));
const assertModules=(modules,expected)=>assert(fingerprint(modules)===expected,'Private module fingerprint changed; fresh private review required');
let directory,writeStarted=false,schemaWriteStarted=false;
try{
 assert(plan.worker==='ohana-home','Unexpected public Worker name');
 if(mode!=='offline')assert(/^[0-9a-f]{32}$/i.test(account||''),'Existing Workers Builds account environment is unavailable; no deployment');
 if(mode==='deploy')assert(process.env.WORKERS_CI==='1'&&process.env.WORKERS_CI_BRANCH==='main'&&/^[0-9a-f]{40}$/.test(process.env.WORKERS_CI_COMMIT_SHA||'')&&!!process.env.WORKERS_CI_BUILD_UUID,'Deployment allowed only from existing main-branch Workers Builds; no local/preview deployment');
 const migration=await fs.readFile(path.join(here,'patches/chat/schema.sql'),'utf8');assert(hash(migration)===plan.migrationSha,'Migration SQL differs from reviewed bytes');
 let modules,settings,version,gate,schemaState;
 if(mode==='offline'){
  const root=path.resolve(process.argv[3]);modules=parseModules(await fs.readFile(path.join(root,'production-v2.multipart')),await fs.readFile(path.join(root,'content-type-v2.txt'),'utf8'));const savedSettings=JSON.parse(await fs.readFile(path.join(root,'settings.json'),'utf8')).result;assert(settingsFingerprint(savedSettings)===plan.settingsSha,'Reviewed settings mismatch');const savedRuntime=JSON.parse(await fs.readFile(path.join(root,'version.json'),'utf8')).result.resources.script_runtime;assert(hash(canonical(savedRuntime))===plan.runtimeSha,'Reviewed runtime metadata mismatch');
 }else{
  const d=await json('/deployments');version=d.deployments[0]?.versions;
  assert(version?.length===1&&version[0].percentage===100,'Split or missing production deployment');
  settings=await json('/settings');assert(settingsFingerprint(settings)===plan.settingsSha,'Reviewed settings mismatch');const runtime=(await json('/versions/'+version[0].version_id)).resources.script_runtime;assert(hash(canonical(runtime))===plan.runtimeSha,'Reviewed runtime/assets metadata mismatch');modules=await getModules();
 }
 if(mode!=='offline'){gate=schemaGate({settings,account,token,migration});schemaState=await gate.inspect();}
 const appNames=[...modules.keys()].filter(name=>name.endsWith('-app.html.gz'));assert(appNames.length===1,'Ambiguous private app module');const appModule=appNames[0];
 if(mode!=='offline'&&fingerprint(modules)===plan.outputModuleFingerprint){
  assertModules(modules,plan.outputModuleFingerprint);assert(schemaState==='ready','Live chat code requires verified schema');console.log('Exact reviewed release and schema already live; no change');process.exit(0);
 }
 assertModules(modules,plan.baseModuleFingerprint);
 const raw=zlib.gunzipSync(modules.get(appModule));assert(hash(raw)===plan.baseAppSha,'Base client mismatch');
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'ohana-reviewed-release-'));
 const inputApp=path.join(directory,'input.html'),inputWorker=path.join(directory,'input-worker.mjs'),input=path.join(directory,'output.html'),outputWorker=path.join(directory,'output-worker.mjs');
 assert(modules.has('worker.js'),'Missing main Worker');await fs.writeFile(inputApp,raw);await fs.writeFile(inputWorker,modules.get('worker.js'));
 execFileSync(process.execPath,[path.join(here,'patches/chat/build.cjs'),inputApp,inputWorker,input,outputWorker],{stdio:'pipe',env:{PATH:process.env.PATH||''}});
 const worker=await fs.readFile(outputWorker);assert(hash(worker)===plan.outputWorkerSha,'Worker differs from reviewed bytes');execFileSync(process.execPath,['--check',outputWorker],{stdio:'pipe',env:{PATH:process.env.PATH||''}});
 const candidate=await fs.readFile(input);assert(hash(candidate)===plan.outputAppSha,'Candidate differs from reviewed bytes');
 const html=candidate.toString('utf8');let scripts=0;
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json|application\/json/i.test(match[1])||!match[2].trim())continue;
  scripts++;if(/type\s*=\s*["']module["']/i.test(match[1])){const f=path.join(directory,`inline-${scripts}.mjs`);await fs.writeFile(f,match[2]);execFileSync(process.execPath,['--check',f],{stdio:'pipe',env:{PATH:process.env.PATH||''}})}else new vm.Script(match[2],{filename:`inline-${scripts}.js`});
 }
 const packed=zlib.gzipSync(candidate,{level:9,mtime:0});assert(hash(packed)===plan.outputPackedSha,'Packed candidate differs from reviewed bytes');
 const candidateModules=new Map(modules);candidateModules.contentTypes=new Map(modules.contentTypes);candidateModules.set(appModule,packed);candidateModules.set('worker.js',worker);
 const expectedNew=['runtime.mjs','service.mjs','authorization.mjs','d1-repository.mjs','http.mjs'];assert(plan.newModules.length===expectedNew.length,'Unexpected new module count');
 for(const file of expectedNew){const name='chat-v2/'+file,entry=plan.newModules.find(x=>x.name===name);assert(entry&&!modules.has(name)&&entry.contentType==='application/javascript+module','New module/type collision');const source=path.join(here,'patches/chat',file),data=await fs.readFile(source);assert(hash(data)===entry.sha,'New module differs from reviewed bytes');execFileSync(process.execPath,['--check',source],{stdio:'pipe',env:{PATH:process.env.PATH||''}});candidateModules.set(name,data);candidateModules.contentTypes.set(name,entry.contentType);}

 assertModules(candidateModules,plan.outputModuleFingerprint);
 console.log(`Verified ${modules.size} baseline modules; ${scripts} scripts parse; candidate ${hash(candidate)}`);
 if(mode!=='deploy'){console.log('Read-only release check passed; no deployment');process.exitCode=0;}
 else{
  // Recheck immediately before write. Other publishers must remain paused.
  const d=await json('/deployments');assert(JSON.stringify(d.deployments[0]?.versions)===JSON.stringify(version),'Concurrent release detected');
  assert(settingsFingerprint(await json('/settings'))===settingsFingerprint(settings),'Concurrent settings change detected');
  assertModules(await getModules(),plan.baseModuleFingerprint);
  if(schemaState==='absent'){schemaWriteStarted=true;await gate.migrate();console.log('Additive chat schema created and verified; old Worker remains live until code upload');}else assert(await gate.inspect()==='ready','Chat schema changed before deployment');
  // Recheck after migration; never upload stale code even when new empty tables were created.
  assert(JSON.stringify((await json('/deployments')).deployments[0]?.versions)===JSON.stringify(version),'Concurrent release after schema check');
  assert(settingsFingerprint(await json('/settings'))===settingsFingerprint(settings),'Concurrent settings change after schema check');assertModules(await getModules(),plan.baseModuleFingerprint);
  const form=new FormData();form.set('metadata',JSON.stringify({main_module:'worker.js'}));
  for(const [name,data] of candidateModules)form.append(name,new Blob([data],{type:candidateModules.contentTypes.get(name)}),name);
  writeStarted=true;const upload=await(await api('/content',{method:'PUT',body:form})).json();assert(upload.success,'Upload failed; inspect deployment state before retry');
  const afterUpload=await json('/deployments');const released=afterUpload.deployments[0]?.versions;assert(released?.length===1&&released[0].percentage===100&&released[0].version_id!==version[0].version_id,'New release not at100%');const verified=await getModules();assertModules(verified,plan.outputModuleFingerprint);
  assert(settingsFingerprint(await json('/settings'))===settingsFingerprint(settings),'Post-release settings differ; inspect immediately');
  const deployed=await json('/deployments');const v=deployed.deployments[0]?.versions;assert(JSON.stringify(v)===JSON.stringify(released),'Concurrent release during verification');const runtime=(await json('/versions/'+v[0].version_id)).resources.script_runtime;assert(hash(canonical(runtime))===plan.runtimeSha,'Post-release runtime/assets metadata differs');
  assert(await gate.inspect()==='ready','Post-release schema verification failed');
  console.log(JSON.stringify({verified:true,commit:process.env.WORKERS_CI_COMMIT_SHA,appSha:plan.outputAppSha,modules:verified.size,unchangedModules:modules.size-2,newModules:5,schemaReady:true,operationalSettingsUnchanged:true}));
 }
}catch(error){console.error(error.name==='ReleaseSafetyError'?error.message:'Release stopped on build/transport error; private source and credential details suppressed');if(writeStarted)console.error('Upload was attempted. Inspect current production before retrying.');if(schemaWriteStarted)console.error('Schema migration was attempted; retain tables and inspect schema before retrying.');process.exitCode=1;}finally{if(directory)await fs.rm(directory,{recursive:true,force:true});}
