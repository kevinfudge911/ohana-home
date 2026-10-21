// Regenerate only the marked shared-card-table block in the configured live app.
const fs=require('node:fs'),path=require('node:path');
const worker=fs.readFileSync('live/worker.js','utf8'),appPath=path.join('live',worker.match(/^import APP_HTML from "\.\/(.*?)";/m)[1]);
let app=fs.readFileSync(appPath,'utf8');
const catalog=JSON.parse(fs.readFileSync('live/shuffle-catalog.json','utf8'));
const engine=fs.readFileSync('live/shuffle-engine.js','utf8').replace(/export /g,'');
const css=fs.readFileSync('live/shuffle-table.css','utf8'),ui=fs.readFileSync('live/shuffle-ui.js','utf8');
const block='<!-- OHANA SHARED CARD TABLE START -->\n<style id="ohana-shared-card-table">'+css+'</style>\n<script id="ohana-shared-card-rules">const OhanaCardRules=(()=>{'+engine+'\nreturn {isCardMeld,bestCardHand};})();\nconst OHANA_CARD_CATALOG='+JSON.stringify(catalog.records).replace(/</g,'\\u003c')+';\n'+ui+'\n</script>\n<!-- OHANA SHARED CARD TABLE END -->';
if(app.includes('<!-- OHANA SHARED CARD TABLE START -->'))app=app.replace(/<!-- OHANA SHARED CARD TABLE START -->[\s\S]*?<!-- OHANA SHARED CARD TABLE END -->/,block);
else {
 // Load before the original app scripts, so setup/render calls always see it.
 const script=app.indexOf('<script');if(script<0)throw Error('No script insertion point.');
 app=app.slice(0,script)+block+'\n'+app.slice(script);
}
fs.writeFileSync(appPath,app);
console.log('Updated shared card block: '+appPath);
