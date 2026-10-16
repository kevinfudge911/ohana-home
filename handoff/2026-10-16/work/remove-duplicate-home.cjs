const fs=require('fs');
const source=process.argv[2],out=process.argv[3];
if(!source||!out)throw Error('Pass source and output app paths');
let app=fs.readFileSync(source,'utf8');
const duplicate=" if(nook)table.insertAdjacentHTML('afterbegin','<div class=\"world-table-crest\">'+esc(S.sync?.familyName||'Ohana Home')+'</div>');";
if(app.split(duplicate).length!==2)throw Error('Duplicate Home crest guard failed');
app=app.replace(duplicate,' // Home branding stays in the entrance header; keep the turn area clear.');
fs.writeFileSync(out,app);
console.log('Removed duplicate Home crest; header and Play now preserved.');
