// Local-only, credential-free transformation. Never includes the old literal.
// Run from the repository root; review and test before any approved publication.
const fs=require('node:fs');
const paths=['live/worker.js','worker.js'];
const importLine='import { env as OHANA_PUSH_ENV } from "cloudflare:workers";';
const helper=`// Read the encrypted Worker binding when signing; never cache or embed its value.
function ohanaVapidPrivateKey() {
  const value = OHANA_PUSH_ENV.VAPID_PRIVATE_KEY;
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value) || b64urlDecode(value).length !== 32) {
    throw new Error("Push signing is not configured.");
  }
  return value;
}`;
const planned=[];
for(const path of paths){
 let source=fs.readFileSync(path,'utf8');
 if(source.includes(importLine)&&source.includes('function ohanaVapidPrivateKey()')){
   if(/\b(?:var|const|let)\s+VAPID_PRIVATE_KEY\s*=/.test(source))throw Error('Mixed old/new signing configuration in '+path);
   continue;
 }
 const literal=/^(?:var|const|let) VAPID_PRIVATE_KEY\s*=\s*["'][^"'\r\n]+["'];\r?$/gm;
 if([...source.matchAll(literal)].length!==1)throw Error('Expected one hardcoded signing-key definition in '+path);
 source=source.replace(literal,helper);
 const use='b64urlDecode(VAPID_PRIVATE_KEY)';
 if(source.split(use).length!==2)throw Error('Unexpected signing-key use in '+path);
 source=source.replace(use,'b64urlDecode(ohanaVapidPrivateKey())');
 const push=/async function sendPush\(subscription, payloadObj\) \{\r?\n\s*try \{/;
 // Preserve the existing push delivery body and status handling.
 const anchor=source.match(push);
 if(!anchor)throw Error('Unexpected push entrypoint in '+path);
 source=source.replace(anchor[0],anchor[0]+'\n    ohanaVapidPrivateKey(); // Missing configuration must stop before encryption or delivery.');
 source=importLine+'\n'+source;
 planned.push({path,source});
}
for(const {path,source} of planned)fs.writeFileSync(path,source);
console.log(JSON.stringify({sanitized:planned.map(x=>x.path),secretValuesPrinted:false,remoteWrites:false}));
