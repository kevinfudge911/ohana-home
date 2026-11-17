const fs=require('fs'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
let s=fs.readFileSync(process.argv[2],'utf8');
if(hash(s)!=='41b60dae26105e997ea5da51cedd053c74ca6b603ff1ad86aa0252d55d6cdbbe')throw Error('Seasonal artwork worker baseline drift');
const imports='import thanksgivingWide from "./seasonal/ohana-thanksgiving-gathering-wide-v1.webp";\nimport thanksgivingPortrait from "./seasonal/ohana-thanksgiving-gathering-portrait-v1.webp";\n';
const anchor='const p=url.pathname;const bridgeArtNames=';
if(s.split(anchor).length!==2)throw Error('Seasonal artwork route anchor drift');
const route=`const thanksgivingArt=p==='/ohana-thanksgiving-gathering-wide-v1.webp'?thanksgivingWide:p==='/ohana-thanksgiving-gathering-portrait-v1.webp'?thanksgivingPortrait:null;if(thanksgivingArt&&(req.method==='GET'||req.method==='HEAD'))return new Response(req.method==='HEAD'?null:thanksgivingArt,{headers:{'Content-Type':'image/webp','Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff'}});`;
s=imports+s.replace(anchor,'const p=url.pathname;'+route+'const bridgeArtNames=');fs.writeFileSync(process.argv[3],s);
