// Adds easy Memories (add, edit, delete with Undo, albums) to the live Ohana Home worker.js.
// Usage: node apply-to-worker.cjs <live worker.js> <out worker.js>
// Changes only worker.js: photo routes (edit, unhide, full-size original in R2), a larger album-copy limit, and the /memories page served with the add-on.
const fs=require('fs'),path=require('path');
const [src,out]=process.argv.slice(2);
if(!src||!out)throw Error('Usage: node apply-to-worker.cjs <live worker.js> <out worker.js>');
let w=fs.readFileSync(src,'utf8');
if(w.includes('ohana-memories-easy-v1'))throw Error('Already has easy Memories');
const once=(a,what)=>{if(w.split(a).length!==2)throw Error(what+' anchor not found exactly once');};
const hideAnchor='const hide=path.match(/^\\/api\\/memories\\/photo\\/([a-f0-9-]{36})\\/hide$/);';
once(hideAnchor,'Memories hide route');
const envMatch=w.match(/async function memoriesApi\(req,(\w+),url\)/);
if(!envMatch)throw Error('memoriesApi signature not found');
const routes=fs.readFileSync(path.join(__dirname,'api-routes.js'),'utf8').trim().split('__ENV__').join(envMatch[1]);
// album copy of each photo may now be up to 1.6 MB (sharper); the full-size original goes to R2 by its own route
const sizeCheck='image.size>(video?limit:9e5)';
once(sizeCheck,'Photo size check');
w=w.replace(sizeCheck,'image.size>(video?limit:16e5)');
w=w.replace(hideAnchor,routes+hideAnchor);
const page='if(p==="/memories"&&req.method==="GET")return new Response(MEMORIES_HTML,';
once(page,'/memories page');
w=w.replace(page,'if(p==="/memories"&&req.method==="GET")return new Response(ohanaAddMemoriesEasy(MEMORIES_HTML),');
const anchor='function ohanaAddJoke(...a){return ';
once(anchor,'Add-on chain');
const css=fs.readFileSync(path.join(__dirname,'memories-easy.css'),'utf8'),js=fs.readFileSync(path.join(__dirname,'memories-easy.js'),'utf8');
const add='<style id="ohana-memories-easy-v1-css">'+css+'</style><script id="ohana-memories-easy-v1">'+js.replace(/<\/script/gi,'<\\/script')+'</script>';
const fn='let ohanaMemoriesEasyPage=null;function ohanaAddMemoriesEasy(h){if(typeof h!=="string")return h;if(h.indexOf("ohana-memories-easy-v1")>=0)return h;if(ohanaMemoriesEasyPage&&ohanaMemoriesEasyPage[0]===h)return ohanaMemoriesEasyPage[1];const add='+JSON.stringify(add)+';const i=h.indexOf("</body>");const r=i<0?h+add:h.slice(0,i)+add+h.slice(i);ohanaMemoriesEasyPage=[h,r];return r;}\n';
w=w.replace(anchor,fn+anchor);
fs.writeFileSync(out,w);console.log('ok',w.length);
