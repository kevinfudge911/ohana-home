const fs=require('fs'),crypto=require('crypto');
let s=fs.readFileSync(process.argv[2]||'thanksgiving-room-release/post/app.html','utf8');
function one(a,b){if(s.split(a).length!==2)throw Error('Unique gold-message anchor missing: '+a.slice(0,90));s=s.replace(a,b)}
// The scenery stays untouched; only its CSS veil and welcome typography change.
one('background-image:linear-gradient(#102b2940,#102b29b8),var(--harvest-scene)!important','background-image:var(--harvest-scene)!important');
one('background:radial-gradient(ellipse at center,#071e19ed 0%,#071e19cf 38%,#071e1960 65%,transparent 85%)!important','background:transparent!important');
one('font:600 clamp(29px,5vw,60px)/1.08 Georgia,serif!important;letter-spacing:-.025em!important;color:#fff5df!important;text-shadow:0 2px 3px #071e19,0 0 18px #071e19!important;margin:8px 0 14px!important','font:italic 700 clamp(30px,5.2vw,64px)/1.12 Georgia,"Times New Roman",serif!important;letter-spacing:-.02em!important;color:#ffdb79!important;text-shadow:0 1px 0 #85500f,0 2px 2px #382408,1px 0 1px #382408,-1px 0 1px #382408!important;margin:8px 0 14px!important;overflow-wrap:normal!important');
one('color:#fff0d2!important;margin:0!important;text-shadow:0 1px 3px #071e19,0 0 12px #071e19!important','color:#ffe7a5!important;margin:0!important;text-shadow:0 1px 2px #382408,1px 0 1px #382408,-1px 0 1px #382408!important');
fs.writeFileSync(process.argv[3]||'gold-message/candidate.html',s);console.log(crypto.createHash('sha256').update(s).digest('hex'));
