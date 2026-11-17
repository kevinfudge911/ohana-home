const fs=require('fs'),path=require('path');
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node apply.cjs fresh-app.html candidate-app.html');
let src=fs.readFileSync(input,'utf8');
function replace(a,b){if(src.split(a).length!==2)throw Error('Expected unique integration anchor: '+a.slice(0,100));src=src.replace(a,b);}
if(src.includes('const OhanaHomeGamesView='))throw Error('Already patched');
replace('function mountOhanaHomeGames(main,table,nook){',fs.readFileSync(path.join(__dirname,'state.js'),'utf8')+'\nfunction mountOhanaHomeGames(main,table,nook){');
replace("const section=document.createElement('section');section.className='ohana-home-games';section.id='ohana-home-games';section.hidden=true;","const section=document.createElement('section');section.className='ohana-home-games';section.id='ohana-home-games';section.hidden=!OhanaHomeGamesView.read();");
replace("toggle.setAttribute('aria-controls',section.id);toggle.setAttribute('aria-expanded','false');","toggle.setAttribute('aria-controls',section.id);toggle.setAttribute('aria-expanded',String(!section.hidden));");
replace("const collapse=()=>{section.hidden=true;toggle.setAttribute('aria-expanded','false');","const collapse=()=>{OhanaHomeGamesView.set(false);section.hidden=true;toggle.setAttribute('aria-expanded','false');");
replace("toggle.onclick=()=>{if(!section.hidden){collapse();return;}section.hidden=false;","toggle.onclick=()=>{if(!section.hidden){collapse();return;}OhanaHomeGamesView.set(true);section.hidden=false;");
replace('function render() {\n syncPePawPortrait();','function render() {\n OhanaHomeGamesView.read();\n syncPePawPortrait();');
replace('function renderGames() {\n','function renderGames() {\n  OhanaHomeGamesView.read();\n');
replace('function goHomePorch(){\n','function goHomePorch(){\n OhanaHomeGamesView.clear();\n');
fs.writeFileSync(output,src);
