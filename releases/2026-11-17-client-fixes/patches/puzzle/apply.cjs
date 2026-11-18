const fs=require('fs');
const old=' return joined;\n}\nfunction pzRememberPickup';
const replacement=' // A neighbor join is movable, not a permanent snap into the finished picture.\n return joined ? "joined" : false;\n}\nfunction pzRememberPickup';
function patch(source){if(source.split(old).length!==2)throw Error('Expected exactly one puzzle snap result');return source.replace(old,replacement);}
module.exports={patch};
if(require.main===module){const src=process.argv[2]||'female-voice-release/post/app.html';fs.writeFileSync(process.argv[3]||'puzzle-sync-fix/candidate.html',patch(fs.readFileSync(src,'utf8')));}
