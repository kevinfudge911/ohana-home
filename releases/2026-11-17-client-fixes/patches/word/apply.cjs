// Apply only to a fresh verified production export. Never deploy recovered fixture.
const fs=require('fs'),path=require('path');
const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node apply.cjs fresh-app.html candidate-app.html');
let src=fs.readFileSync(input,'utf8');
if(src.includes('function wordOpponentLastPlay('))throw Error('Already patched; review current implementation');
const fn='function mountGameControlDock(external){';
const hook=" center.setAttribute('role','group');center.setAttribute('aria-label','All players and scores');if(g&&st&&S.me)center.innerHTML=gamePlayerOrder(g,S.me.id).map(p=>worldPortrait(p,g,st)).join('');";
for(const a of [fn,hook,'</head>'])if(src.split(a).length!==2)throw Error('Expected unique integration anchor; current source changed');
src=src.replace(fn,fs.readFileSync(path.join(__dirname,'last-play.js'),'utf8')+'\n'+fn);
src=src.replace(hook,hook+'\n mountWordOpponentLastPlay(dock,st,g,S.me?.id);');
src=src.replace('</head>','<style id="word-opponent-last-play-style">\n'+fs.readFileSync(path.join(__dirname,'style.css'),'utf8')+'</style>\n</head>');
fs.writeFileSync(output,src);console.log('Presentation-only patch applied; needs rendered and production verification');
