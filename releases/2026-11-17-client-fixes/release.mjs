// Git-triggered, content-pinned client and response release. No credentials or live data in Git.
import fs from 'node:fs/promises';
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
let directory,writeStarted=false;
try{
 assert(plan.worker==='ohana-home','Unexpected public Worker name');
 if(mode!=='offline')assert(/^[0-9a-f]{32}$/i.test(account||''),'Existing Workers Builds account environment is unavailable; no deployment');
 if(mode==='deploy')assert(process.env.WORKERS_CI==='1'&&process.env.WORKERS_CI_BRANCH==='main'&&/^[0-9a-f]{40}$/.test(process.env.WORKERS_CI_COMMIT_SHA||'')&&!!process.env.WORKERS_CI_BUILD_UUID,'Deployment allowed only from existing main-branch Workers Builds; no local/preview deployment');
 let modules,settings,version;
 if(mode==='offline'){
  const root=path.resolve(process.argv[3]);modules=parseModules(await fs.readFile(path.join(root,'production-v2.multipart')),await fs.readFile(path.join(root,'content-type-v2.txt'),'utf8'));const savedSettings=JSON.parse(await fs.readFile(path.join(root,'settings.json'),'utf8')).result;assert(settingsFingerprint(savedSettings)===plan.settingsSha,'Reviewed settings mismatch');const savedRuntime=JSON.parse(await fs.readFile(path.join(root,'version.json'),'utf8')).result.resources.script_runtime;assert(hash(canonical(savedRuntime))===plan.runtimeSha,'Reviewed runtime metadata mismatch');
 }else{
  const d=await json('/deployments');version=d.deployments[0]?.versions;
  assert(version?.length===1&&version[0].percentage===100,'Split or missing production deployment');
  settings=await json('/settings');assert(settingsFingerprint(settings)===plan.settingsSha,'Reviewed settings mismatch');const runtime=(await json('/versions/'+version[0].version_id)).resources.script_runtime;assert(hash(canonical(runtime))===plan.runtimeSha,'Reviewed runtime/assets metadata mismatch');modules=await getModules();
 }
 const appNames=[...modules.keys()].filter(name=>name.endsWith('-app.html.gz'));assert(appNames.length===1,'Ambiguous private app module');const appModule=appNames[0];
 if(mode!=='offline'&&fingerprint(modules)===plan.outputModuleFingerprint){
  assertModules(modules,plan.outputModuleFingerprint);console.log('Exact reviewed release already live; no change');process.exit(0);
 }
 assertModules(modules,plan.baseModuleFingerprint);
 const raw=zlib.gunzipSync(modules.get(appModule));assert(hash(raw)===plan.baseAppSha,'Base client mismatch');
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'ohana-reviewed-release-'));
 let input=path.join(directory,'input.html');await fs.writeFile(input,raw);
 for(let i=0;i<plan.patches.length;i++){
  const output=path.join(directory,`step-${i}.html`);
  execFileSync(process.execPath,[path.join(here,plan.patches[i]),input,output],{stdio:'pipe',env:{PATH:process.env.PATH||''}});input=output;
 }
 const candidate=await fs.readFile(input);assert(hash(candidate)===plan.outputAppSha,'Candidate differs from reviewed bytes');
 const html=candidate.toString('utf8');let scripts=0;
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  if(/\bsrc\s*=|application\/ld\+json|application\/json/i.test(match[1])||!match[2].trim())continue;
  scripts++;if(/type\s*=\s*["']module["']/i.test(match[1])){const f=path.join(directory,`inline-${scripts}.mjs`);await fs.writeFile(f,match[2]);execFileSync(process.execPath,['--check',f],{stdio:'pipe',env:{PATH:process.env.PATH||''}})}else new vm.Script(match[2],{filename:`inline-${scripts}.js`});
 }
 const packed=zlib.gzipSync(candidate,{level:9,mtime:0});assert(hash(packed)===plan.outputPackedSha,'Packed candidate differs from reviewed bytes');
 const candidateModules=new Map(modules);candidateModules.contentTypes=new Map(modules.contentTypes);candidateModules.set(appModule,packed);
 assert(modules.has('worker.js')&&modules.contentTypes.get('worker.js')===plan.workerContentType,'Worker entry or MIME changed');
 assert(hash(modules.get('worker.js'))===plan.baseWorkerSha,'Worker baseline changed');
 const workerInput=path.join(directory,'worker-input.mjs'),workerOutput=path.join(directory,'worker-output.mjs');
 await fs.writeFile(workerInput,modules.get('worker.js'));
 execFileSync(process.execPath,[path.join(here,plan.workerPatch),workerInput,workerOutput],{stdio:'pipe',env:{PATH:process.env.PATH||''}});
 const workerCandidate=await fs.readFile(workerOutput);assert(hash(workerCandidate)===plan.outputWorkerSha,'Worker candidate differs from reviewed bytes');
 execFileSync(process.execPath,['--check',workerOutput],{stdio:'pipe',env:{PATH:process.env.PATH||''}});
 candidateModules.set('worker.js',workerCandidate);
 assert(Array.isArray(plan.addedModules)&&plan.addedModules.length===1,'Expected one reviewed Word scenery module');
 const addedNames=new Set();
 for(const asset of plan.addedModules){
  assert(/^seasonal\/ohana-word-harvest-scenery-v4\.webp$/.test(asset.name),'Unexpected asset module name');
  assert(asset.path==='assets/'+path.basename(asset.name),'Unexpected asset file path');
  assert(asset.type==='application/octet-stream'&&!modules.has(asset.name)&&!addedNames.has(asset.name),'Asset collision or MIME mismatch');
  const recipeRoot=await fs.realpath(here),file=await fs.realpath(path.join(here,asset.path)),assetRoot=await fs.realpath(path.join(here,'assets'));
  assert(assetRoot.startsWith(recipeRoot+path.sep),'Asset directory escapes recipe');
  assert(file.startsWith(assetRoot+path.sep),'Asset escapes recipe directory');
  const data=await fs.readFile(file);assert(data.length>12&&data.length<=2*1024*1024&&data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP','Invalid or oversized WebP');
  assert(hash(data)===asset.sha,'Asset differs from reviewed bytes');
  candidateModules.set(asset.name,data);candidateModules.contentTypes.set(asset.name,asset.type);addedNames.add(asset.name);
 }

 assertModules(candidateModules,plan.outputModuleFingerprint);
 console.log(`Verified ${modules.size} baseline modules; ${scripts} scripts parse; candidate ${hash(candidate)}`);
 if(mode!=='deploy'){console.log('Read-only release check passed; no deployment');process.exitCode=0;}
 else{
  // Recheck immediately before write. Other publishers must remain paused.
  const d=await json('/deployments');assert(JSON.stringify(d.deployments[0]?.versions)===JSON.stringify(version),'Concurrent release detected');
  assert(settingsFingerprint(await json('/settings'))===settingsFingerprint(settings),'Concurrent settings change detected');
  assertModules(await getModules(),plan.baseModuleFingerprint);
  const form=new FormData();form.set('metadata',JSON.stringify({main_module:'worker.js'}));
  for(const [name,data] of candidateModules)form.append(name,new Blob([data],{type:candidateModules.contentTypes.get(name)}),name);
  writeStarted=true;const upload=await(await api('/content',{method:'PUT',body:form})).json();assert(upload.success,'Upload failed; inspect deployment state before retry');
  const afterUpload=await json('/deployments');const released=afterUpload.deployments[0]?.versions;assert(released?.length===1&&released[0].percentage===100&&released[0].version_id!==version[0].version_id,'New release not at100%');const verified=await getModules();assertModules(verified,plan.outputModuleFingerprint);
  assert(settingsFingerprint(await json('/settings'))===settingsFingerprint(settings),'Post-release settings differ; inspect immediately');
  const deployed=await json('/deployments');const v=deployed.deployments[0]?.versions;assert(JSON.stringify(v)===JSON.stringify(released),'Concurrent release during verification');const runtime=(await json('/versions/'+v[0].version_id)).resources.script_runtime;assert(hash(canonical(runtime))===plan.runtimeSha,'Post-release runtime/assets metadata differs');
  console.log(JSON.stringify({verified:true,commit:process.env.WORKERS_CI_COMMIT_SHA,appSha:plan.outputAppSha,modules:verified.size,unchangedModules:[...modules].filter(([n,b])=>verified.has(n)&&hash(verified.get(n))===hash(b)&&verified.contentTypes.get(n)===modules.contentTypes.get(n)).length,addedModules:addedNames.size,operationalSettingsUnchanged:true}));
 }
}catch(error){console.error(error.name==='ReleaseSafetyError'?error.message:'Release stopped on build/transport error; private source and credential details suppressed');if(writeStarted)console.error('Upload was attempted. Inspect current production before retrying.');process.exitCode=1;}finally{if(directory)await fs.rm(directory,{recursive:true,force:true});}
