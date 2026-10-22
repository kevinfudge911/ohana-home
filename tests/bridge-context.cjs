const fs=require('fs'),path=require('path'),assert=require('assert/strict'),vm=require('vm'),{JSDOM}=require('jsdom');
const file=fs.readdirSync('live').find(x=>x.endsWith('app.html')),html=fs.readFileSync(path.join('live',file),'utf8');
function between(a,b){const i=html.indexOf(a),j=html.indexOf(b,i);assert(i>=0&&j>i);return html.slice(i,j)}
const commands=between('function bridgeCommandsHtml(){','\nasync function refreshChatInbox');
const go=between('function bridgeGameContext(){','\nfunction bridgeCommandsHtml');
const open=between('async function openChatInbox(key=null,toolsOpen=false){','\nfunction paintChatList');
let scripts=0,checks=0;function check(value,msg){assert(value,msg);checks++}
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim()){new vm.Script(m[1]);scripts++}
const dom=new JSDOM('<!doctype html><body><button id="trigger">Bridge</button></body>',{url:'https://fictional.test',pretendToBeVisual:true,runScripts:'outside-only'}),w=dom.window;
w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
w.eval(`const S={me:{id:101},sync:{rooms:[{id:900,name:'Fictional'}],roomId:900},game:null,gstate:null},PZ={id:null},AudioSys={muted:true};const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('"','&quot;');const $=s=>document.querySelector(s);const UC={drafts:{},threads:[],request:0};let confirmations=[],confirmAnswer=false,moves=0,navigations=[];const ohanaConfirm=async(...x)=>{confirmations.push(x);return confirmAnswer};const requestRematch=async()=>{moves++};const resignCurrentGame=async()=>{if(await ohanaConfirm('Give up this game?')){moves++;S.game=null}};const saveChatDraft=()=>{const e=$('#uc-input');if(e&&UC.key)UC.drafts[UC.key]=e.value};const chatHeadSide=()=> 'left';const roomBackControl=(attrs,name)=>'<button '+attrs+' aria-label="'+name+'">Back</button>';const paintChatList=()=>{};const refreshChatInbox=async()=>{};const showChatMenu=()=>{};const selectChatThread=async()=>{};const ucNewMessage=()=>{};const sendUnifiedChat=()=>{};const ackChatVisible=()=>{};const openEmojiPicker=()=>{};const shrink=()=>{};const api=async()=>{moves++;return{}};const refreshOhanaPlayControls=()=>{};const toast=()=>{};const leaveGrannyContext=()=>{};const openGamesOrPuzzle=x=>navigations.push(x||'games');const closeGame=()=>S.game=null;const setGameMuted=x=>AudioSys.muted=x;const showTableHelp=x=>navigations.push('rules:'+x);${commands}\n${go}\n${open}\nwindow.run=code=>eval(code);`);
const run=x=>w.run(x),doc=w.document;
(async()=>{
 for(const type of ['words','chess','spades','handfoot','ohana10','shuffle','domino','memory','tictac','checkers'])for(const status of ['playing','finished']){
  run(`S.game=90001;S.gstate={id:90001,type:'${type}',in_game:true,status:'${status}',state:{saved:'unchanged'}};`);
  const before=run('JSON.stringify(S)');const host=doc.createElement('div');host.innerHTML=run('bridgeCommandsHtml()');
  check(host.querySelector('[data-bridge-scope=current] h3').textContent==='Current game',type+' current group');
  check(!host.querySelector('[data-bridge-scope=current] [data-go=games]'),'navigation outside current group');
  check(host.querySelectorAll('[data-go=history]').length===1,'one finished history destination');
  check(host.querySelector('[data-bridge-scope=family] [data-go=history]'),'history correctly names family scope');
  check(!host.querySelector('[data-go=game-leave]'),'no redundant Leave');
  check(!!host.querySelector('[data-go=game-quit],[data-go=chess-resign]')===(status==='playing'),'destructive action only on active games');
  check(host.querySelector('[data-go=game-help]'),'all tables share Rules');
  check(host.querySelector('[aria-pressed="false"]'),'sound has toggle semantics');
  check(before===run('JSON.stringify(S)'),'render preserves state');
 }
 run('S.game=null;PZ.id=77');let host=doc.createElement('div');host.innerHTML=run('bridgeCommandsHtml()');check(host.querySelector('[data-bridge-scope=current] h3').textContent==='Current puzzle','puzzle scope');check(!host.querySelector('[data-go=game-quit]'),'puzzle no quit');check(host.querySelector('[data-go=puzzle-help]'),'puzzle rules');
 run('PZ.id=null');host.innerHTML=run('bridgeCommandsHtml()');check(!host.querySelector('[data-bridge-scope=current]'),'home no fictitious current game');
 doc.querySelector('#trigger').focus();run('S.game=90001;S.gstate={id:90001,type:"words",status:"playing",in_game:true}');
 const d=await run('openChatInbox(null,true)');check(d.open,'Bridge opened');check(d.getAttribute('aria-modal')==='true','modal semantics');
 const quit=doc.createElement('button');quit.id='game-quit-word';quit.onclick=async()=>{if(await run('ohanaConfirm("Quit?")'))run('moves++;S.game=null')};doc.body.append(quit);
 await run('messengerGo("game-quit")');check(d.open,'cancel Quit keeps Bridge');check(run('S.game')===90001&&run('moves')===0,'cancel Quit preserves table');
 await run('messengerGo("game-restart")');check(d.open&&run('moves')===0,'cancel Restart keeps context');
 run('S.gstate.type="chess"');await run('messengerGo("chess-resign")');check(d.open&&run('moves')===0,'cancel Resign keeps context');
 run('UC.key="room:900"');doc.querySelector('#uc-input').value='Unsent fictional draft';doc.querySelector('#uc-input').dispatchEvent(new w.Event('input'));check(run('UC.drafts["room:900"]')==='Unsent fictional draft','draft saved');
 await run('messengerGo("game-help")');check(run('navigations.includes("rules:chess")'),'Rules existing handler');check(run('S.game')===90001,'Rules preserves current table');
 const d2=await run('openChatInbox(null,true)');await run('messengerGo("history")');check(run('navigations.includes("history")'),'history retains existing route');check(run('S.game')===90001,'history action itself does not end game');
 const d3=await run('openChatInbox(null,true)');run('confirmAnswer=true');await run('messengerGo("game-quit")');check(run('moves')===1&&run('S.game')===null,'confirmed quit runs once');check(!d3.isConnected,'successful quit closes Bridge');
 check(!html.includes("document.addEventListener('keydown',e=>{const d=document.querySelector('#ohana-chat-dialog.hub-command-player')"),'obsolete conflicting Escape listener removed');
 check(html.includes("width:bubble?(expanded?'calc(100vw - 24px)'"),'Expand changes actual bubble size');
 fs.mkdirSync('artifacts/bridge',{recursive:true});fs.writeFileSync('artifacts/bridge/unit-results.json',JSON.stringify({checks,scripts,baseline:'6f1a7bf20df57d978da925c7751d0e771024081e',familyMutations:0,passed:true},null,2));
 console.log('PASS '+checks+' synthetic assertions; '+scripts+' scripts parse. Family data, worker and workstation not changed.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>dom.window.close());
