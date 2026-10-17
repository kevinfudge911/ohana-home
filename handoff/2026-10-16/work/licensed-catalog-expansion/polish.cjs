const fs=require('fs'),path=require('path');const input=process.argv[2];if(!input)throw Error('Pass latest app');let s=fs.readFileSync(input,'utf8');
const before="if(!ts.length&&!musicMine){const empty=document.createElement('p');empty.textContent='No songs match this view.';songs.append(empty)}";
const after="if(!ts.length){const empty=document.createElement('p');empty.textContent=musicMine?'No songs of yours match this view. Use Song + to add one, or turn off Mine to browse the family library.':'No songs match this view.';songs.append(empty)}";
if(s.split(before).length!==2)throw Error('Expected unique empty-state anchor');s=s.replace(before,after);
const anchor="shadow.append(manageContrast);";if(s.split(anchor).length!==2)throw Error('Expected unique library style anchor');s=s.replace(anchor,"manageContrast.textContent+=' .tunes-library-action{min-height:44px!important;min-width:44px!important}';"+anchor);
fs.writeFileSync(path.join(__dirname,'polished-app.html'),s);console.log(JSON.stringify({delta:Buffer.byteLength(s)-fs.statSync(input).size,scope:'library targets and empty Mine text only'}));
