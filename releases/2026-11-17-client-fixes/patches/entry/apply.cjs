// One-app-only correction. Input must be exact currently released app.
const fs=require('fs'),crypto=require('crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const before="const slot=dock?.querySelector('.dock-gear-menu')||document.querySelector('#ohana-chat-dialog[open] .uc-command-sections');";
const after="const slot=document.querySelector('#ohana-chat-dialog[open] .uc-command-sections')||dock?.querySelector('.dock-gear-menu');";
function patch(source){if(hash(source)!=='3b6f5fa131c20bba7b74cd03e835fa1c091bf1c1981175c78432c46f4e70130a')throw Error('Live app hash mismatch; stop.');if(source.split(before).length!==2)throw Error('Expected exactly one slot anchor; stop.');const result=source.replace(before,after);if(hash(result)!=='8e9b649f55eed6fd11af8fc2fcf57dfd20977ecc0f8d437c5309cb1bfd3e025c')throw Error('Corrected app hash mismatch; stop.');return result;}
module.exports={patch};
if(require.main===module){if(!process.argv[2]||!process.argv[3])throw Error('Provide input and output app paths.');fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));}
