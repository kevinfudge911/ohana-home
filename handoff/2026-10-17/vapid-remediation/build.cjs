const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
let worker=fs.readFileSync('work/current-user-review-release/worker.js','utf8');
let app=fs.readFileSync('work/current-user-review-release/app.html','utf8');
const hash=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const workerBase=hash(worker),appBase=hash(app),operations=[];
function change(which,from,to,name){let s=which==='worker'?worker:app;if(s.split(from).length!==2)throw Error('Anchor '+name);s=s.replace(from,to);if(which==='worker')worker=s;else app=s;operations.push({name,source:which});}
let removed=0;worker=worker.replace(/^var VAPID_(?:PUBLIC|PRIVATE)_KEY = "[A-Za-z0-9_-]+";\r?\n/gm,()=>{removed++;return '';});if(removed!==2)throw Error('Expected key declarations');
// No old key value is emitted or stored in patch metadata.
change('worker','async function createVapidJwt(audience) {',fs.readFileSync(__dirname+'/key-config.js','utf8')+'\nasync function createVapidJwt(audience, env) {\n  const configured=vapidConfig(env);','signing-config');
change('worker','b64urlDecode(VAPID_PRIVATE_KEY)','configured.privateBytes','private-from-secret');
change('worker','b64urlDecode(VAPID_PUBLIC_KEY)','configured.publicBytes','public-from-config');
change('worker','async function sendPush(subscription, payloadObj) {','async function sendPush(subscription, payloadObj, env) {','send-env');
change('worker','await createVapidJwt(audience);','await createVapidJwt(audience, env);','jwt-env');
change('worker','k=${VAPID_PUBLIC_KEY}','k=${vapidConfig(env).publicKey}','authorization-public');
change('worker','return `${unsigned}.${b64urlEncode(rawSig)}`;','const verifyKey=await crypto.subtle.importKey("raw",configured.publicBytes,{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);\n  if(!await crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},verifyKey,rawSig,new TextEncoder().encode(unsigned)))throw Error("Push signing configuration does not match.");\n  return `${unsigned}.${b64urlEncode(rawSig)}`;','reject-mismatched-keypair');
change('worker','async function notifyMembers(db, memberIds, payload) {','async function notifyMembers(env, db, memberIds, payload) {','notify-env');
change('worker','async function notifyTurnIfAway(db, memberIds, payload) {','async function notifyTurnIfAway(env, db, memberIds, payload) {','away-env');
worker=worker.replaceAll('sendPush(sub, payload)','sendPush(sub, payload, env)').replace('notifyMembers(db, away, payload)','notifyMembers(env, db, away, payload)');
worker=worker.replaceAll('notifyMembers(db,','notifyMembers(env222222, db,').replaceAll('notifyMembers(env222222.DB,','notifyMembers(env222222, env222222.DB,').replaceAll('notifyTurnIfAway(db,','notifyTurnIfAway(env222222, db,');
change('worker','tag: "ohana-test" });','tag: "ohana-test" }, env222222);','test-env');
change('worker','  if (p === "/api/push/subscribe" && req.method === "POST") {','  if (p === "/api/push/public-key" && req.method === "GET") {\n    try{await createVapidJwt(new URL(req.url).origin,env222222);return Response.json({publicKey:vapidConfig(env222222).publicKey},{headers:{"cache-control":"no-store"}});}catch{return err("Notifications need a configuration update.",503);}\n  }\n  if (p === "/api/push/subscribe" && req.method === "POST") {\n    let configured;try{configured=vapidConfig(env222222);}catch{return err("Notifications need a configuration update.",503);}\n    if(body.vapidPublicKey!==configured.publicKey)return err("Refresh Ohana and enable notifications again.",409);','public-endpoint-subscription-key');
let appRemoved=0;app=app.replace(/(?:const|var|let) VAPID_PUBLIC\s*=\s*['"][A-Za-z0-9_-]+['"];?/g,()=>{appRemoved++;return fs.readFileSync(__dirname+'/client-key.js','utf8');});if(appRemoved!==1)throw Error('Client public declaration anchor');
change('app',"const sub=await reg.pushManager.getSubscription();S.pushSub=sub;","const sub=await reg.pushManager.getSubscription();S.pushSub=sub;const publicKey=await currentPushPublicKey();if(sub&&!pushSubscriptionMatches(sub,publicKey)){S.pushError='Notification security was updated. Tap Enable notifications to reconnect this device.';updatePushControls();return;}",'setup-detect-rotation');
change('app',"await api('/api/push/subscribe',{endpoint:sub.endpoint,...keys});","await api('/api/push/subscribe',{endpoint:sub.endpoint,...keys,vapidPublicKey:publicKey});",'setup-key-registration');
change('app',"const existing=await reg.pushManager.getSubscription();","const publicKey=await currentPushPublicKey();const existing=await reg.pushManager.getSubscription();",'enable-load-key-first');
change('app','applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC)','applicationServerKey:urlBase64ToUint8Array(publicKey)','enable-configured-key');
change('app',"await api('/api/push/subscribe',{endpoint:sub.endpoint,...sub.toJSON().keys});","await api('/api/push/subscribe',{endpoint:sub.endpoint,...sub.toJSON().keys,vapidPublicKey:publicKey});",'enable-key-registration');
if(/VAPID_PRIVATE_KEY\s*=\s*['"]/.test(worker)||/VAPID_PUBLIC_KEY\s*=\s*['"]/.test(worker)||/VAPID_PUBLIC\s*=\s*['"]/.test(app))throw Error('Literal key remains');
// Parse transformed worker without resolving deployment imports.
new vm.Script(worker.replace(/^import .*;\r?\n/gm,'').replace(/export\s*\{[\s\S]*?\};/g,''));
for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=|application\/(?:json|ld\+json)/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2]);}
fs.writeFileSync(__dirname+'/worker.js',worker);fs.writeFileSync(__dirname+'/app.html',app);fs.writeFileSync(__dirname+'/scope-proof.json',JSON.stringify({workerBase,appBase,workerCandidate:hash(worker),appCandidate:hash(app),operations,removedServerDeclarations:removed,removedClientDeclaration:appRemoved,syntax:'PASS',deployed:false,secretConfigured:false},null,2));console.log(JSON.stringify({syntax:'PASS',serverDeclarationsRemoved:removed,clientLiteralRemoved:appRemoved}));

