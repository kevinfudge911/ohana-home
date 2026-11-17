const fs=require('fs'),crypto=require('crypto'),path=require('path');
const p=JSON.parse(fs.readFileSync(path.join(__dirname,'patch.json'),'utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const s=fs.readFileSync(process.argv[2],'utf8');
if(hash(s)!==p.base)throw Error('Unexpected Flip baseline');
if(s.split(p.old).length!==2)throw Error('Expected exactly one setup renderer');
const out=s.replace(p.old,p.new);if(hash(out)!==p.output)throw Error('Unexpected Flip output');
fs.writeFileSync(process.argv[3],out);console.log(JSON.stringify({base:p.base,output:p.output}));
