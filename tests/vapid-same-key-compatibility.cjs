// Read-only local compatibility audit. No key is printed, persisted, or transmitted.
// The existing baseline private scalar is used only to derive its public point;
// this test does not sign a token, send push, or change any subscription.
const fs=require('node:fs'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {createECDH}=require('node:crypto');
const base='8c3e0355e9fdf49916eb4740707078c2dff5b7de';
const old=cp.execFileSync('git',['show',base+':live/worker.js'],{encoding:'utf8',maxBuffer:4*1024*1024});
const literal=(source,name)=>source.match(new RegExp('\\b(?:var|const|let) '+name+'\\s*=\\s*["\x27]([^"\x27]+)["\x27]'))?.[1];
const existing=literal(old,'VAPID_PRIVATE_KEY'),publicKey=literal(old,'VAPID_PUBLIC_KEY');assert(existing&&publicKey);
const ec=createECDH('prime256v1');ec.setPrivateKey(Buffer.from(existing,'base64url'));
assert.equal(ec.getPublicKey().toString('base64url'),publicKey,'existing private key matches unchanged application-server public key');
for(const path of ['live/worker.js','worker.js']){
 const current=fs.readFileSync(path,'utf8');assert.equal(literal(current,'VAPID_PUBLIC_KEY'),publicKey);
 assert(!current.includes(existing));assert(current.includes('OHANA_PUSH_ENV.VAPID_PRIVATE_KEY'));
}
const appPath='live/'+fs.readdirSync('live').find(p=>p.endsWith('-app.html'));
assert.equal(literal(fs.readFileSync(appPath,'utf8'),'VAPID_PUBLIC'),publicKey,'browser public key unchanged');
for(const path of ['live/worker.js','worker.js']){
 const before=cp.execFileSync('git',['show',base+':'+path],{encoding:'utf8',maxBuffer:4*1024*1024});
 const after=fs.readFileSync(path,'utf8');
 // No subscription insert/delete or client-registration path changed.
 for(const prefix of ['async function notifyMembers','async function api2']){
  const from=before.indexOf(prefix),to=after.indexOf(prefix);if(from<0)continue;
  const oldPart=before.slice(from).replace(/\r\n/g,'\n'),newPart=after.slice(to).replace(/\r\n/g,'\n');
  assert.equal(newPart,oldPart,'existing notification/subscription/application code remains byte-identical after signing block');
 }
}
console.log('PASS: existing private scalar derives the unchanged worker/browser public key; no rotation, token signing, key output, network, or subscription changes.');
