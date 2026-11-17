const fs=require('fs'),crypto=require('crypto');const base=process.argv[2]||'bridge-toggle-release/post/app.html';let s=fs.readFileSync(base,'utf8');
function one(a,b){if(s.split(a).length!==2)throw Error('anchor '+a);s=s.replace(a,b)}
one('background:#123c36f5!important;color:#fff5df!important;border-top:1px solid #dba95580;border-bottom:1px solid #dba95580','background:radial-gradient(ellipse at center,#071e19ed 0%,#071e19cf 38%,#071e1960 65%,transparent 85%)!important;color:#fff5df!important;border:0!important;box-shadow:none!important');
one('color:#fff5df!important;text-shadow:none!important;margin:8px 0 14px!important','color:#fff5df!important;text-shadow:0 2px 3px #071e19,0 0 18px #071e19!important;margin:8px 0 14px!important');
one('color:#f6dfb4!important;margin:0!important;text-shadow:none!important','color:#fff0d2!important;margin:0!important;text-shadow:0 1px 3px #071e19,0 0 12px #071e19!important');
fs.writeFileSync(process.argv[3]||'thanksgiving-freeflow/candidate.html',s);console.log(crypto.createHash('sha256').update(s).digest('hex'));
