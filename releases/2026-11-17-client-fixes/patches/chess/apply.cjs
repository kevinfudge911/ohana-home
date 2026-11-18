const fs=require('fs');
const marker='     // Family Mahjong\'s guide used a legacy outer column and collapsed the action track.';
function apply(s){if(s.includes('Chess has no card-action row'))throw Error('already patched');if(s.split(marker).length!==2)throw Error('anchor mismatch');return s.replace(marker,fs.readFileSync(__dirname+'/controller.js','utf8')+marker)}
module.exports=apply;
if(require.main===module){fs.writeFileSync(process.argv[3]||__dirname+'/candidate.html',apply(fs.readFileSync(process.argv[2]||'thanksgiving-game-tables/tables-candidate.html','utf8')))}
