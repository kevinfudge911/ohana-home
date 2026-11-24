// Adds the one-bubble chat to the live worker.js (Ohana Home), the same way as the other add-ons.
// Usage: node apply-to-worker.cjs <live worker.js> <out worker.js>
const fs=require('fs'),path=require('path');
const [src,out]=process.argv.slice(2);
let w=fs.readFileSync(src,'utf8');
if(w.includes('ohana-one-chat-v1'))throw Error('Already has the one-bubble chat');
const anchor='function ohanaAddJoke(...a){return ';
if(w.split(anchor).length!==2)throw Error('Add-on chain anchor not found once');
const i=w.indexOf(anchor)+anchor.length, end=w.indexOf('}',i);
const body=w.slice(i,end).replace(/;\s*$/,'');
w=w.slice(0,i)+'ohanaAddOneChat('+body+')'+w.slice(end);
const css=fs.readFileSync(path.join(__dirname,'one-chat.css'),'utf8'),js=fs.readFileSync(path.join(__dirname,'one-chat.js'),'utf8');
const fn='\nfunction ohanaAddOneChat(h){if(typeof h!=="string")return h;if(h.indexOf("ohana-one-chat-v1")>=0)return h;const add='+JSON.stringify('<style id="ohana-one-chat-v1-css">'+css+'</style><script id="ohana-one-chat-v1">'+js.replace(/<\/script/gi,'<\\/script')+'</script>')+';const i=h.lastIndexOf("</body>");return i<0?h+add:h.slice(0,i)+add+h.slice(i);}\n';
const gifFn=fs.readFileSync(path.join(__dirname,'gif-route.js'),'utf8').trim()+'\n';
const route='if(p==="/api/chat-v2")return chatV2Route(';
if(w.split(route).length!==2)throw Error('chat-v2 route anchor not found once');
if(!/import\{env as OHANA_PUSH_ENV\}from"cloudflare:workers"/.test(w))throw Error('OHANA_PUSH_ENV import missing');
w=w.replace(route,'if(p==="/api/gif")return ohanaGifRoute(url,me);'+route);
w=w.replace(anchor,fn.trimStart()+gifFn+anchor);
fs.writeFileSync(out,w);console.log('ok',w.length);
