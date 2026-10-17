const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
const root=__dirname,base=fs.readFileSync('work/current-user-review-release/app.html','utf8');
const hash=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
if(hash(base)!=='0854ba63c7ec925d7bf16c3b8b6dbe8887358f9c')throw Error('Rebase current source before building');
let app=base;const applied=[];
function patch(name,from,to){if(app.split(from).length!==2)throw Error('Unique patch anchor: '+name);app=app.replace(from,to);applied.push({name,from,to});}
for(const p of JSON.parse(fs.readFileSync('work/popup-dismissal-followup/patch.json','utf8')))patch(p.name,p.from,p.to);
patch('touch-lifecycle-cancellation','b.onpointercancel=clean;b.onlostpointercapture=clean;b.ondragstart=e=>e.preventDefault();',"// Touch Events own the touch reorder lifecycle; Pointer cancellation must not erase it.\n   const cancelPointer=()=>{if(!drag?.touch)clean();};b.onpointercancel=cancelPointer;b.onlostpointercapture=cancelPointer;b.ondragstart=e=>e.preventDefault();");
const red=JSON.parse(fs.readFileSync('work/handfoot-rank-followup/red-count-patch.json','utf8'));patch('red-three-count',red.from,red.to);
const css=fs.readFileSync('work/handfoot-rank-followup/controls.css','utf8');patch('public-meld-rank-css','</head>','<style id="ohana-hf-public-rank-followup-v1">\n'+css+'</style>\n</head>');
let inverse=app;for(const p of [...applied].reverse()){if(inverse.split(p.to).length!==2)throw Error('Inverse anchor: '+p.name);inverse=inverse.replace(p.to,p.from);}if(inverse!==base)throw Error('Inverse failed');
let scripts=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=|application\/(?:json|ld\+json)/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2]);scripts++;}
fs.writeFileSync(root+'/app.html',app);fs.writeFileSync(root+'/patch.json',JSON.stringify(applied,null,2));
fs.writeFileSync(root+'/scope-proof.json',JSON.stringify({base:hash(base),candidate:hash(app),bytes:Buffer.byteLength(app),patches:applied.map(x=>x.name),exactInverse:true,scriptsParsed:scripts,workerChanged:false,puzzleRoomChanged:false,ownHandArtworkChanged:false,browserVerified:false,published:false},null,2));
console.log('Combined bounded repairs: '+applied.length+'; scripts parsed '+scripts+'; exact inverse PASS. Private, not visually verified.');

