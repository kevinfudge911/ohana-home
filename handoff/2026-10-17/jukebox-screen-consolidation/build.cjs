const fs=require('fs'),crypto=require('crypto');
const dir=__dirname;
const base=fs.readFileSync('work/current-user-review-release/app.html','utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
if(blob(base)!=='0854ba63c7ec925d7bf16c3b8b6dbe8887358f9c')throw Error('Current app changed; rebase this scoped draft.');
let app=base;const removed=[];
for(const name of ['slipStyle','bankStyle','digitalRepairStyle']){
 const re=new RegExp('const '+name+'=document\\.createElement\\([\'\"]style[\'\"]\\);'+name+'\\.textContent=[^\\r\\n]+?shadow\\.append\\('+name+'\\);');
 const matches=[...app.matchAll(new RegExp(re.source,'g'))];
 if(matches.length!==1)throw Error('Style boundary '+name+': '+matches.length);
 removed.push({name,source:matches[0][0]});app=app.replace(re,'');
}
const css=fs.readFileSync(dir+'/screen.css','utf8');
const insert='const unifiedDigitalStyle=document.createElement("style");unifiedDigitalStyle.textContent='+JSON.stringify(css)+';shadow.append(unifiedDigitalStyle);';
const marker='// Original photograph; CSS frame only. No second audio source or playback mutations.';
if(app.split(marker).length!==2)throw Error('Missing insertion marker');
app=app.replace(marker,insert+'\n'+marker);
let inverse=app.replace(insert+'\n','');
// Recreate the exact original by replacing each line at its original offset in line sequence.
const originalLines=base.split('\n'),newLines=inverse.split('\n');
for(let i=0;i<originalLines.length;i++){
 const r=removed.find(x=>originalLines[i].includes(x.source));
 if(r)newLines[i]=originalLines[i];
}
if(newLines.join('\n')!==base)throw Error('CSS-only inverse proof failed');
let checked=0;for(const m of app.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){if(m[1].trim()){new Function(m[1]);checked++;}}
fs.writeFileSync(dir+'/app.html',app);
fs.writeFileSync(dir+'/scope-proof.json',JSON.stringify({base:blob(base),draft:blob(app),bytes:Buffer.byteLength(app),removedStyleLayers:removed.map(x=>x.name),scriptsParsed:checked,cssOnlyInverse:true,browserVerified:false,published:false},null,2));
console.log('Private CSS consolidation draft built; '+checked+' script blocks parse. Not browser verified or published.');

