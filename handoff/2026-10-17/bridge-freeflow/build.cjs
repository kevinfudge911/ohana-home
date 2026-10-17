const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const base=fs.readFileSync('work/heartfelt-batch-two/preview-app.html','utf8');let app=base;
const rep=(from,to)=>{if(app.split(from).length!==2)throw Error('Unique anchor: '+from.slice(0,90));app=app.replace(from,to)};
const old=app.match(/<style id="ohana-blessings-controls-v1">[\s\S]*?<\/style>/);if(!old)throw Error('Blessings style missing');
rep(old[0],'<style id="ohana-blessings-controls-v1">\n'+fs.readFileSync(__dirname+'/blessings.css','utf8')+'\n</style>');
rep("chatButton.setAttribute('aria-expanded',String(chat));};","chatButton.setAttribute('aria-expanded',String(chat));d.classList.toggle('ohana-chat-bubble',chat);};");
const mainAnchor="apply(main,{display:main.hidden?'none':'block',order:'1',width:'100%','min-height':'0',flex:'0 0 auto',overflow:'visible',padding:'0',color:'#214b49'});";
rep(mainAnchor,mainAnchor+`
const bubble=d.classList.contains('ohana-chat-bubble')&&!main.hidden;
apply(main,{position:bubble?'fixed':'static',top:bubble?'calc(var(--bridge-top,0px) + 12px)':'auto',right:bubble?'12px':'auto',bottom:'auto',left:'auto',width:bubble?'min(520px,calc(100vw - 24px))':'100%',height:bubble?'min(680px,calc(var(--bridge-height,100dvh) - 124px))':'auto','max-height':bubble?'calc(var(--bridge-height,100dvh) - 124px)':'none',display:main.hidden?'none':bubble?'flex':'block','flex-direction':'column',overflow:bubble?'hidden':'visible','box-sizing':'border-box',padding:bubble?'12px':'0','z-index':bubble?'2147483647':'auto',background:bubble?'#fff4dd':'none',border:bubble?'2px solid #d4b36e':'0','border-radius':bubble?'24px 24px 6px 24px':'0','box-shadow':bubble?'0 12px 36px #261b1599':'none'});
let bubbleNav=main.querySelector('.ohana-chat-bubble-nav');if(!bubbleNav){bubbleNav=document.createElement('nav');bubbleNav.className='ohana-chat-bubble-nav';bubbleNav.setAttribute('aria-label','Chat bubble controls');const title=document.createElement('strong');title.textContent='Ohana Chat';const back=document.createElement('button');back.type='button';back.textContent='Chats';back.setAttribute('aria-label','Back to all chat conversations');back.onclick=()=>d.querySelector('#uc-back')?.click();const close=document.createElement('button');close.type='button';close.textContent='Close';close.setAttribute('aria-label','Close chat bubble');close.onclick=()=>d.querySelector('[data-hub-tab="chat"]')?.click();bubbleNav.append(title,back,close);main.prepend(bubbleNav);}if(bubbleNav.hidden!==!bubble)bubbleNav.hidden=!bubble;
`);
rep("lid.onclick=()=>d.querySelector('[aria-label=\"Open Ohana TSCMS music room\"]')?.click();","lid.textContent='Playlist';lid.onclick=()=>{d.close();document.dispatchEvent(new Event('ohana-open-music-room'));};");
rep('function musicCommands(){',"document.addEventListener('ohana-open-music-room',()=>{openMusicRoom();shadow.querySelector('.open')?.click()});\nfunction musicCommands(){");
rep("buttons[3].onclick=()=>{document.querySelector('[aria-label=\"Minimize chat\"]')?.click();openMusicRoom()};","buttons[3].onclick=()=>messengerGo('rooms');buttons[3].setAttribute('aria-label','Choose an Ohana room');");
// Keep the room selector in its original slot rather than moving it into transport.
rep("const room=section.querySelector('[aria-label=\"Open Ohana TSCMS music room\"]');","const room=section.querySelector('[aria-label=\"Choose an Ohana room\"]');");
const row="const row=document.createElement('div');row.style.cssText='padding:12px 0;border-bottom:1px solid #c4b38d';";
rep(row,row+`row.className='ohana-own-game';const picture=document.createElement('img');const art={spades:'ohana-mikes-cards-v4',domino:'ohana-domino-sign-v2',ohana10:'ohana-ten-room-v103',handfoot:'ohana-handfoot-cards-v4',chess:'ohana-chess-beach-v3',tictac:'ohana-tictac-beach-v3',words:'ohana-words-detail-v3'};picture.src='/'+(art[game.type]||'ohana-'+game.type+'-sign-v2')+'.webp?asset=ohana-v105-binary-repair-20261011';picture.alt=(game.name||game.type)+' game';picture.loading='lazy';picture.onerror=()=>picture.remove();row.append(picture);`);
const css=`
#ohana-own-games#ohana-own-games#ohana-own-games button{background:none!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;color:#4b351c!important;text-shadow:none!important;min-height:44px!important;font:800 17px Nunito,sans-serif!important;padding:7px 9px!important}
#ohana-own-games button::before,#ohana-own-games button::after{display:none!important;content:none!important}
#ohana-own-games .ohana-own-game{display:grid;grid-template-columns:minmax(100px,170px) minmax(0,1fr);gap:8px 16px;align-items:center}
#ohana-own-games .ohana-own-game img{grid-row:span 2;width:100%;height:116px;object-fit:contain}
#ohana-own-games .ohana-own-game p{margin:0;overflow-wrap:anywhere}
#ohana-own-games .ohana-own-game button{justify-self:start}
@media(max-width:430px){#ohana-own-games .ohana-own-game{grid-template-columns:minmax(90px,36%) minmax(0,1fr);gap:6px 10px}#ohana-own-games .ohana-own-game img{height:100px}}
`;
const prefix='#ohana-chat-dialog'.repeat(130)+'.ohana-chat-bubble';
const bubbleCSS=[
[' .uc-main .ohana-chat-bubble-nav','display:flex!important;align-items:center;gap:10px;flex:none;min-height:44px;color:#493319'],
[' .ohana-chat-bubble-nav strong','margin-right:auto'],
[' .uc-main :is(button,#uc-start)','background:none!important;background-image:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;color:#493319!important;text-shadow:none!important;min-height:44px!important;padding:6px!important'],
[' .uc-main .uc-layout','flex:1 1 0!important;min-height:0!important;display:flex!important;overflow:hidden!important'],
[' .uc-main #uc-list','min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;touch-action:pan-y!important'],
[' .uc-main #uc-thread','flex:1 1 0!important;min-height:0!important;display:flex!important;overflow:hidden!important'],
[' .uc-main :is(#uc-thread,#uc-list)[hidden]','display:none!important'],
[' .uc-main #uc-messages','flex:1 1 0!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;touch-action:pan-y!important'],
[' .uc-main :is(.uc-filters,.uc-thread-head,#uc-compose,#uc-status,#uc-start)','flex:none!important'],
[' .uc-main #uc-compose:not([hidden])','display:flex!important;align-items:flex-end;gap:5px'],
[' .uc-main #uc-input','min-width:0!important;flex:1 1 0!important;max-height:90px'],
[' .uc-main .uc-message','flex:none!important'],
[' .uc-main :is(.uc-message p,.uc-message time,.uc-message b)','color:#493319!important;text-shadow:none!important;overflow-wrap:anywhere!important'],
[' .uc-main .uc-photo','max-width:100%!important;height:auto!important'],
].map(([selector,body])=>prefix+selector+'{'+body+'}').join('\n');
rep('</head>','<style id="ohana-freeflow-chat-repair">'+css+bubbleCSS+'</style>\n</head>');
let blocks=0;for(const m of app.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=|application\/(?:json|ld\+json)/.test(m[1])||!m[2].trim())continue;new vm.Script(m[2]);blocks++;}
fs.writeFileSync(__dirname+'/app.html',app);
fs.copyFileSync('work/heartfelt-batch-two/worker.js',__dirname+'/worker.js');
const git=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
fs.writeFileSync(__dirname+'/scope-proof.json',JSON.stringify({app:git(app),bytes:Buffer.byteLength(app),scriptBlocksParsed:blocks,musicGatePreserved:app.includes("get('ohana-music-preview')"),newAudioPlayback:false,chatBackendAndPermissionsUnchanged:true,workerUnchangedFromGatedCatalog:true,browser:'NOT RUN'},null,2));
console.log(fs.readFileSync(__dirname+'/scope-proof.json','utf8'));

