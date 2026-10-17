const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=__dirname,input=process.argv[2];if(!input)throw Error('Pass current app.html');
let app=fs.readFileSync(input,'utf8');const additions=JSON.parse(fs.readFileSync(path.join(dir,'tracks.json'),'utf8'));
const marker=app.indexOf('ohana-tscms-release-v1');if(marker<0)throw Error('Music marker missing');
const start=app.indexOf('shadow.innerHTML=',marker)+'shadow.innerHTML='.length;
if(start<marker||app[start]!=='"')throw Error('Expected serialized shadow HTML');
let end=start+1;for(;end<app.length;end++){if(app[end]==='"'){let sl=0;for(let j=end-1;app[j]==='\\';j--)sl++;if(sl%2===0)break;}}
let html=JSON.parse(app.slice(start,end+1));const re=/(<script[^>]*id="jb-tracks"[^>]*>)([\s\S]*?)(<\/script>)/;
const match=html.match(re);if(!match)throw Error('Catalog missing');const old=JSON.parse(match[2]);if(old.length!==907)throw Error('Expected original 907; inspect rather than double import');
for(const t of additions){if(old.some(o=>o.id===t.id||o.stream===t.stream))throw Error('Duplicate '+t.id);}
html=html.replace(re,(_,a,b,c)=>a+JSON.stringify([...old,...additions])+c);app=app.slice(0,start)+JSON.stringify(html).replace(/<\/script/gi,'<\\/script')+app.slice(end+1);
// Preserve original records, audio singleton, ACL and playback logic. New categories reuse playlist selector.
fs.writeFileSync(path.join(dir,'app.html'),app);
const workerInput=process.argv[3];if(workerInput){let w=fs.readFileSync(workerInput,'utf8');const m=w.match(/OHANA_MUSIC_BUILTIN_IDS=new Set\((\[[^\n]*?\])\)/);if(!m)throw Error('Builtin allowlist missing');const ids=JSON.parse(m[1]);for(const t of additions)if(!ids.includes(t.id))ids.push(t.id);w=w.replace(m[0],'OHANA_MUSIC_BUILTIN_IDS=new Set('+JSON.stringify(ids)+')');fs.writeFileSync(path.join(dir,'worker.js'),w);}
const scripts=[...app.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].filter(m=>!/^\s*[{[]/.test(m[1]));for(const s of scripts)new vm.Script(s[1]);
console.log(JSON.stringify({original:old.length,added:additions.length,total:old.length+additions.length,originalsUnchanged:true,source:input,bytes:Buffer.byteLength(app)}));

