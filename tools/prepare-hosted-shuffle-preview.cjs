// Prepares the established same-site fictional-preview workflow in a separate worktree.
// No account, API, notification, game or persistent-storage writes occur in the fixture.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.argv[2]||'../ohana-shuffle-preview');
let html=fs.readFileSync('artifacts/shuffle-fictional-review.html','utf8').replaceAll('localStorage.','fixtureStorage.');
html=html.replace('const S={',"const fixtureValues=new Map(),fixtureStorage={getItem:key=>fixtureValues.get(key)||null,setItem:(key,value)=>fixtureValues.set(key,value)};\nconst S={");
html=html.replace('ensureWorldScene=()=>{}',"ensureWorldScene=g=>{document.documentElement.dataset.ohanaGame=g.type}");
html=html.replace("roomHomeControl=attr=>'<button '+attr+'>Ohana Home</button>'","roomHomeControl=attr=>'<button type=\"button\" class=\"room-home-control\" '+attr+' aria-label=\"Home\"><span class=\"room-home-arrow\" aria-hidden=\"true\">←</span><span class=\"room-home-wordmark\" aria-hidden=\"true\">Ohana Home</span></button>'");
html=html.replace('raw.nextTurn=0;','').replace("turn:0,status:'playing'","turn:raw.nextTurn,status:'playing'").replace('S.shuffleDraft=null;renderGame()',"S.me.id=game.players[game.turn];S.shuffleDraft=null;renderGame()");
const fixture=path.join(root,'live','ohana-shuffle-fictional-check.html');fs.writeFileSync(fixture,html);
const workerPath=path.join(root,'live','worker.js');let worker=fs.readFileSync(workerPath,'utf8').replace(/\r\n/g,'\n');
if(worker.includes('SHUFFLE_FICTIONAL_CHECK'))throw Error('Preview already integrated.');
worker='import SHUFFLE_FICTIONAL_CHECK from "./ohana-shuffle-fictional-check.html";\n'+worker;
const anchor='    if (req.method === "GET" && p === "/layout-preview") {';
if(worker.split(anchor).length!==2)throw Error('Expected preview route anchor once.');
worker=worker.replace(anchor,`    if (req.method === "GET" && p === "/ohana-shuffle-check") {
      if (url.searchParams.get("fictional") !== "1") return new Response("Not found", {status:404});
      const styles = APP_HTML.match(/<style(?:\\s[^>]*)?>[\\s\\S]*?<\\/style>/g) || [];
      const before = (APP_HTML.slice(0,APP_HTML.indexOf("<script")).match(/<style(?:\\s[^>]*)?>[\\s\\S]*?<\\/style>/g) || []).length;
      const own = SHUFFLE_FICTIONAL_CHECK.match(/<style>[\\s\\S]*?<\\/style>/)[0];
      styles.splice(before,0,own);
      return new Response(SHUFFLE_FICTIONAL_CHECK.replace(own,styles.join("\\n")), {headers:{"content-type":"text/html;charset=utf-8","cache-control":"no-store","x-ohana-preview":"fictional-api-free"}});
    }
`+anchor);
fs.writeFileSync(workerPath,worker);console.log('Prepared query-gated same-site fictional preview. Normal APP_HTML unchanged.');
