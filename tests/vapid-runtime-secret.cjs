// Public deterministic fixture material only. Never uses the production key.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {webcrypto,createECDH,createPublicKey,verify,createDecipheriv,hkdfSync}=require('node:crypto');
const signing=createECDH('prime256v1');signing.setPrivateKey(Buffer.alloc(32,1));
const browser=createECDH('prime256v1');browser.setPrivateKey(Buffer.alloc(32,2));
const privateFixture=signing.getPrivateKey().toString('base64url'),publicFixture=signing.getPublicKey().toString('base64url');
const endpoint='https://fcm.googleapis.com/fictional-no-network';
const sub={id:7,member_id:11,endpoint,p256dh:browser.getPublicKey().toString('base64url'),auth:Buffer.alloc(16,3).toString('base64url')};
const payload={type:'test',title:'Fictional only',body:'No real notification was sent.'};
function context(path){
 const source=fs.readFileSync(path,'utf8');assert(source.includes('import { env as OHANA_PUSH_ENV } from "cloudflare:workers";'));
 assert(!/\b(?:const|var|let)\s+VAPID_PRIVATE_KEY\s*=/.test(source),'no private literal/fallback remains');
 const start=source.indexOf('function ohanaVapidPrivateKey()'),end=path.startsWith('live/')?source.indexOf('async function notifyTurnIfAway('):source.indexOf('// ========== END WEB PUSH');
 assert(start>0&&end>start);const snippet=source.slice(start,end).replace(/((?:const|var) VAPID_SUBJECT = )["'][^"']+["'];/,'$1"mailto:push-fixture@example.invalid";');
 const names=Object.fromEntries(['__name','__name2','__name22','__name222','__name2222','__name22222','__name222222'].map(x=>[x,fn=>fn]));
 let request=null,fetches=0,deleted=0,encryptions=0;
 const runtime={},c=vm.createContext({...names,OHANA_PUSH_ENV:runtime,VAPID_PUBLIC_KEY:publicFixture,VAPID_SUBJECT:'mailto:push-fixture@example.invalid',console:{warn(){},log(){}},crypto:webcrypto,URL,Response,TextEncoder,Uint8Array,DataView,atob,btoa,fetch:async(url,options)=>{assert.equal(url,endpoint);fetches++;request=options;return {status:201};}});
 vm.runInContext(snippet,c);const original=c.encryptPayload;c.encryptPayload=async(...args)=>{encryptions++;return original(...args);};
 const DB={prepare(q){return {bind(){return this},async all(){return {results:[sub]}},async run(){if(q.startsWith('DELETE'))deleted++;return {meta:{changes:1}}}}}};
 return {c,runtime,DB,get request(){return request},get fetches(){return fetches},get deleted(){return deleted},get encryptions(){return encryptions},source};
}
(async()=>{
 for(const path of ['live/worker.js','worker.js']){
  const t=context(path),{c,runtime}=t;
  for(const value of [undefined,null,'',42,'invalid','x'.repeat(42),'x'.repeat(44)]){
    runtime.VAPID_PRIVATE_KEY=value;await assert.rejects(c.createVapidJwt('https://fcm.googleapis.com'),/Push signing is not configured/);
    assert.equal(await c.sendPush(sub,payload),0);
  }
  assert.equal(t.fetches,0);assert.equal(t.encryptions,0,'missing config stops before encryption');
  await c.notifyMembers(t.DB,[11],payload);assert.equal(t.fetches,0);assert.equal(t.deleted,0,'configuration failure preserves subscriptions');
  runtime.VAPID_PRIVATE_KEY=privateFixture;
  assert.equal(await c.sendPush(sub,payload),201);assert.equal(t.fetches,1);
  const request=t.request;assert.equal(request.headers['Content-Encoding'],'aes128gcm');assert.equal(request.headers.Urgency,'high');assert.equal(request.headers.TTL,'86400');
  const header=request.headers.Authorization;assert(header.endsWith('k='+publicFixture));
  const jwt=header.match(/^vapid t=([^,]+), k=/)[1].split('.');assert.equal(jwt.length,3);
  assert.deepEqual(JSON.parse(Buffer.from(jwt[0],'base64url')),{typ:'JWT',alg:'ES256'});
  const claims=JSON.parse(Buffer.from(jwt[1],'base64url'));assert.equal(claims.aud,'https://fcm.googleapis.com');assert.equal(claims.sub,'mailto:push-fixture@example.invalid');assert(Math.abs(claims.exp-Math.floor(Date.now()/1000)-3600)<3);
  const pub=signing.getPublicKey(),key=createPublicKey({key:{kty:'EC',crv:'P-256',x:pub.subarray(1,33).toString('base64url'),y:pub.subarray(33,65).toString('base64url')},format:'jwk'});
  assert(verify('sha256',Buffer.from(jwt[0]+'.'+jwt[1]),{key,dsaEncoding:'ieee-p1363'},Buffer.from(jwt[2],'base64url')),'ES256 signature verifies independently');
  const data=Buffer.from(request.body),salt=data.subarray(0,16),server=data.subarray(21,86);assert.equal(data.readUInt32BE(16),4096);assert.equal(data[20],65);
  const hkdf=(ikm,salt,info,len)=>Buffer.from(hkdfSync('sha256',ikm,salt,info,len));
  const ikm=hkdf(browser.computeSecret(server),Buffer.alloc(16,3),Buffer.concat([Buffer.from('WebPush: info\0'),browser.getPublicKey(),server]),32);
  const aes=hkdf(ikm,salt,Buffer.from('Content-Encoding: aes128gcm\0'),16),nonce=hkdf(ikm,salt,Buffer.from('Content-Encoding: nonce\0'),12),dec=createDecipheriv('aes-128-gcm',aes,nonce);dec.setAuthTag(data.subarray(-16));
  const plain=Buffer.concat([dec.update(data.subarray(86,-16)),dec.final()]);assert.equal(plain.at(-1),2);assert.deepEqual(JSON.parse(plain.subarray(0,-1)),payload,'RFC8291 payload decrypts independently');
  delete runtime.VAPID_PRIVATE_KEY;assert.equal(await c.sendPush(sub,payload),0);assert.equal(t.fetches,1,'binding is reread, not cached in source/global state');
  console.log('PASS '+path+': encrypted runtime binding only; missing/invalid config stops before delivery/encryption; subscriptions retained; ES256 claims/signature and RFC8291 encryption compatible; no network.');
 }
 // Active source has no change outside the push-key definition/use and guard.
 console.log('PASS: deterministic fictional crypto fixtures only; no production key values read by signing tests; no real endpoints contacted.');
})().catch(error=>{console.error(error);process.exitCode=1});
