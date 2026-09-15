const fs=require('fs'),{JSDOM}=require('jsdom'),assert=require('assert');
const html=fs.readFileSync('app.html','utf8'),scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
const dom=new JSDOM(html,{url:'https://test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.matchMedia=()=>({matches:true});w.fetch=async()=>({ok:true,json:async()=>({})});w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.remove();};
w.eval(scripts.join('\n')+'\n'+fs.readFileSync('tests/fixtures/words-ui.js','utf8')+`\nwindow.invEval=code=>eval(code);S.room=1;S.game=null;S.sync.roomId=1;S.sync.types.mahjong={name:'Ohana Mahjong',max:2};S.tab='family';render();`);
(async()=>{
const d=w.document;assert.equal(d.querySelector('[data-tab="family"]').textContent,'🏠Ohana');assert.equal(d.querySelectorAll('[data-invite-member]').length,2);d.querySelector('[data-invite-member="2"]').click();assert.equal(d.querySelectorAll('dialog option').length,5);assert(d.querySelector('dialog').textContent.includes('Jamie'));
if(process.argv.includes('--preview')){
 const dialog=d.querySelector('dialog').outerHTML.replace(' open=""','');
 fs.writeFileSync('ohana-preview.html',`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Our Ohana · Preview</title><style>${html.match(/<style>([\s\S]*?)<\/style>/)[1]}body{display:block}#app{width:390px;max-width:100%;margin:auto}main{overflow:visible}nav.tabs{position:static}</style><p style="text-align:center;font-size:12px">Appearance preview · fictional Ohana</p>${d.querySelector('#app').outerHTML}${dialog}<script>document.querySelectorAll('button').forEach(b=>{b.disabled=!b.hasAttribute('data-invite-member')&&!b.closest('dialog')});document.querySelectorAll('[data-invite-member]').forEach(b=>b.onclick=()=>document.querySelector('dialog').showModal());document.querySelector('#cancel-ohana-invite').onclick=()=>document.querySelector('dialog').close();document.querySelector('#send-ohana-invite').onclick=()=>document.querySelector('.invite-error').textContent='Preview only — no invitation was sent.';</script>`);
}
w.invEval(`window.calls=[];api=async(path,body)=>{window.calls.push({path,body});return {id:44}};sync=async()=>{};`);await d.querySelector('#send-ohana-invite').onclick();assert.equal(w.calls[0].path,'/api/game/create');assert.equal(w.calls[1].path,'/api/game/44/invite');assert.equal(w.calls[1].body.member_id,2);
w.invEval(`S.sync.invitations=[{game_id:55,sender_name:'Riley',room_id:2,room_name:'Friends',type:'words'}];S.tab='games';render();window.sequence=[];enterRoom=async id=>window.sequence.push(['room',id]);api=async path=>window.sequence.push(['api',path]);openGame=async id=>window.sequence.push(['game',id]);`);
assert(d.querySelector('.ohana-invitation').textContent.includes('Riley saved you a seat'));await d.querySelector('[data-accept-invite]').onclick();assert.equal(JSON.stringify(w.sequence),'[["room",2],["api","/api/game/55/join"],["game",55]]');w.invEval(`S.game=77;S.gstate={id:77,room_id:2,type:'words',name:'Ohana Words',status:'waiting',players:[1],max_players:2,in_game:true,created_by:1,invite_code:'table-code',names:{1:{id:1,name:'Me',avatar:'@hon'},2:{id:2,name:'Jamie',avatar:'@eag'}},invited_members:[]};window.directCalls=[];api=async(...args)=>{window.directCalls.push(args);return {ok:true}};renderGame();`);
assert(d.querySelector('#inviteb'),'new guests can still receive a link');w.invEval('window.shared=[];shareInvite=async(...args)=>window.shared.push(args)');await d.querySelector('#inviteb').onclick();assert.equal(w.shared[0][0],'table-code');
assert.equal(d.querySelectorAll('[data-table-invite]').length,1);
await d.querySelector('[data-table-invite]').onclick();
assert.equal(JSON.stringify(w.directCalls),JSON.stringify([['/api/game/77/invite',{member_id:2},'POST',2]]));
assert.equal(d.querySelector('[data-table-invite]').textContent,'Invited');
w.invEval('renderGame()');assert(d.querySelector('[data-table-invite]').disabled);
w.invEval(`S.gstate.invited_members=[];api=async()=>{throw new Error('Connection hiccup')};renderGame()`);
await d.querySelector('[data-table-invite]').onclick();assert(!d.querySelector('[data-table-invite]').disabled);assert(d.querySelector('.waiting-invite-status').textContent.includes('Connection hiccup'));
console.log('PASS: Ohana label, member invite buttons, all five game choices, addressed invitation, cross-room accept opens correct room.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>w.close());
