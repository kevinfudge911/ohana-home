// Extract configured production code for local DOM/browser tests. No real API.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),app=path.join(root,'live',fs.readdirSync(path.join(root,'live')).find(f=>f.endsWith('app.html'))),html=fs.readFileSync(app,'utf8');
function extract(name){const a=html.search(new RegExp('(?:async )?function '+name+'\\('));if(a<0)throw Error(name);const rest=html.slice(a),b=rest.slice(1).search(/\n(?:async )?function [A-Za-z_$]/);return b<0?rest:rest.slice(0,b+1);}
const composer=html.slice(html.indexOf('let ohanaInvite=null;'),html.indexOf('function openTableInvite(g)',html.indexOf('let ohanaInvite=null;')));
const overlay=html.match(/<script id="ohana-overlay-navigation">([\s\S]*?)<\/script>/)[1];
const model=fs.readFileSync(path.join(root,'tests/fixtures/invitation-model.js'),'utf8');
const code=model+'\n'+['ohanaStartRules','ohanaDiscoverablePerson','showOhanaStartGame'].map(extract).join('\n')+'\n'+composer+'\n'+overlay;
module.exports={html,composer,overlay,model,code,extract};
if(require.main===module){
 const out=path.resolve(process.argv[2]||path.join(root,'..','invite-review-fixture.html'));
 const styles=[...html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 const setup="document.getElementById('fixture-open').onclick=()=>showOhanaStartGame();document.getElementById('fixture-lost').onclick=()=>{nextPost=body=>{committed(body);throw Error('Fictional lost response');};};document.getElementById('fixture-partial').onclick=()=>{nextPost=body=>{committed(body);return {ok:false};};};document.getElementById('fixture-reject').onclick=()=>{nextPost=()=>{throw Object.assign(Error('Fictional rejection; refresh and retry.'),{status:400});};};document.getElementById('fixture-delay').onclick=()=>{nextPost=body=>new Promise(resolve=>setTimeout(()=>resolve(committed(body)),3000));};showOhanaStartGame();";
 fs.writeFileSync(out,'<!doctype html><html class="ohana-world"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\';script-src \'unsafe-inline\';style-src \'unsafe-inline\';img-src data:;font-src data:"><title>Fictional Ohana invitation review</title><style>'+styles+'</style><body><main id="app"><h1>Fictional invitation review</h1><p>No real people, invitations, accounts or game moves.</p><button id="fixture-open">Invite people</button><button id="fixture-lost">Next Send: lose success response</button><button id="fixture-partial">Next Send: malformed response</button><button id="fixture-reject">Next Send: reject</button><button id="fixture-delay">Next Send: delay 3 seconds</button><p id="fixture-status" role="status"></p></main><script>'+code+'\n'+setup+'</script></body></html>');
 console.log(out);
}
