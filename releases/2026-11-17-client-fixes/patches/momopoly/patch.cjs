const OLD='.classic-mode .family-desk > :not(#classic-open):not(#classic-controls-root):not(#solo-mode){display:none}';
const FIX='.classic-mode .family-desk > :not(#classic-open):not(#classic-controls-root):not(#solo-mode):not(#classic-new){display:none}';
function patch(html){if(html.split(OLD).length!==2)throw Error('Expected exactly one Classic family-controls selector');return html.replace(OLD,FIX);}
module.exports={patch,OLD,FIX};
if(require.main===module){const fs=require('node:fs');fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));}
