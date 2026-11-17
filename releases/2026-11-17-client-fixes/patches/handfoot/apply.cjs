// Use ONLY on a verified current production export; never deploy the fixture.
const fs=require('fs'),path=require('path');
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node apply.cjs fresh.html candidate.html');
let src=fs.readFileSync(input,'utf8');
if(src.includes('function hfQuickMeldPlan('))throw Error('Already patched; review implementation');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const anchor='function handFootPickupMelds(',handler=read('old-handler.txt'),clear='const clear=()=>{S.hfQueue=[];S.hfSel=[];S.hfMeldTarget=null;S.hfChoosingMeld=false;S.hfWild={};S.hfWildAuto={};S.hfWildSkip={};};';
for(const text of [anchor,handler,clear])if(src.split(text).length!==2)throw Error('Expected unique source anchor; current source changed');
src=src.replace(anchor,read('helper.js')+'\n'+anchor).replace(handler,read('new-handler.txt').trimEnd()).replace(clear,clear.replace('S.hfQueue=[];','S.hfQuickTap=null;S.hfQueue=[];'));
fs.writeFileSync(output,src);console.log('Double-tap patch applied; browser and production verification still required.');
