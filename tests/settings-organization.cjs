const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');
const html=fs.readFileSync('app.html','utf8'),dom=new JSDOM(html,{url:'https://test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.matchMedia=()=>({matches:true});w.fetch=async()=>({ok:true,json:async()=>({})});
w.eval([...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).join('\n')+'\n'+fs.readFileSync('tests/fixtures/words-ui.js','utf8')+'\nwindow.run=code=>eval(code);');
(async()=>{
 const d=w.document;
 w.run('S.game=null;S.tab="family";render()');assert(d.querySelector('[data-invite-member]'));assert(d.querySelector('#invite-to-room'));assert(!d.querySelector('#out,#install,#ntoggle,#adm'));
 w.run('S.tab="settings";render()');assert(d.querySelector('#out'));assert(d.querySelector('#install'));assert(d.querySelector('#access-open'));assert(d.querySelector('.notification-control'));assert(!d.querySelector('#adm'));w.confirm=()=>false;d.querySelector('#out').click();assert(w.run('S.token'));
 w.run(`S.me.is_admin=true;S.sync.roomId=1;api=async()=>({family_code:'test',family_name:'Our Ohana'});render()`);await new Promise(r=>setTimeout(r,0));assert(d.querySelector('#adm #fc'));assert(d.querySelector('#adm [data-pin]'));assert(d.querySelector('#adm #clr'));
 w.run('S.sync.roomId=2;render()');assert(!d.querySelector('#adm'));
 w.run('S.game=1;S.gstate=previewGame;renderGame()');assert(!d.querySelector('.notification-control'));assert(d.querySelector('.voice-toggle'));assert(d.querySelector('#next-game'));
 console.log('PASS: Ohana contains members/invites; preferences/install/sign-out in Settings; sign-out cancel preserves session; admin restricted to family/admin; game keeps quick mute and Next.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
