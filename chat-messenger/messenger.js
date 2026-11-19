(function(){
'use strict';
if(window.ohanaMessenger)return;
var d=document,ID='om-chat',POLL=4000,LISTPOLL=12000;
var GIFS=['LOL','Nice play','Domino','Your turn','Good game','Oops','Woo hoo','Hurry up','Love you','No way','Hmm','Too easy','Hi','Zzz','Merry CHRISTmas','Happy Thanksgiving'];
var st={open:false,view:'home',key:null,thread:null,rows:new Map(),list:[],timer:0,ltimer:0,gen:0,pending:[],img:null,gifCache:{},sending:false};
function esc2(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function me(){try{return (typeof S!=='undefined'&&S&&S.me)?Number(S.me.id):0;}catch(e){return 0;}}
function sval(){try{return typeof S!=='undefined'?S:null;}catch(e){return null;}}
function call(path,body,method){if(typeof window.api==='function')return window.api(path,body,method);return Promise.reject(Error('Sign in again.'));}
function av(p){try{if(typeof window.memberAvatarMarkup==='function')return window.memberAvatarMarkup(p.id,p.avatar);}catch(e){}return esc2((p&&p.name||'?').slice(0,1));}
function uid(){return (crypto.randomUUID?crypto.randomUUID():('om-'+Date.now()+'-'+Math.random().toString(16).slice(2)));}
function scopeOf(key){
 var m=/^people:([\d,]+)$/.exec(key||'');
 if(m){var ids=m[1].split(',').map(Number).filter(function(n){return n>0;});if(ids.length===2)return {kind:'direct',members:ids};if(ids.length>2)return {kind:'people',members:ids};return null;}
 m=/^room:(\d+)$/.exec(key||'');if(m)return {kind:'room',id:Number(m[1])};
 return null;
}
function convName(c){if(!c)return 'Chat';if(c.kind==='person'){var o=(c.people||[]).find(function(p){return Number(p.id)!==me();});return (o&&o.name)||c.name||'Chat';}return c.name||'Chat';}
function convAv(c){if(!c)return '';if(c.kind==='person'){var o=(c.people||[]).find(function(p){return Number(p.id)!==me();});if(o)return av(o);}if(c.kind==='room')return '<span class="om-room"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#8a5a2b" d="M12 3 2 11.5h3V21h5.5v-6h3v6H19v-9.5h3z"/></svg></span>';var ps=(c.people||[]).filter(function(p){return Number(p.id)!==me();}).slice(0,2);if(!ps.length)return esc2((c.name||'?').slice(0,1));return '<span class="om-duo">'+ps.map(function(p){return '<i>'+av(p)+'</i>';}).join('')+'</span>';}
function nameFor(id){id=Number(id);var t=st.thread;var p=t&&(t.people||[]).find(function(x){return Number(x.id)===id;});if(p)return p.name;var s=sval();var m=s&&s.sync&&(s.sync.members||[]).find(function(x){return Number(x.id)===id;});return m?m.name:'Someone';}
function personFor(id){id=Number(id);var t=st.thread;var p=t&&(t.people||[]).find(function(x){return Number(x.id)===id;});if(p)return p;var s=sval();var m=s&&s.sync&&(s.sync.members||[]).find(function(x){return Number(x.id)===id;});return m||{id:id,name:'?'};}
function clock(t){var x=new Date(Number(t)||Date.now());return x.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function dayLabel(t){var x=new Date(Number(t)),n=new Date();var a=new Date(x.getFullYear(),x.getMonth(),x.getDate()),b=new Date(n.getFullYear(),n.getMonth(),n.getDate());var diff=Math.round((b-a)/864e5);if(diff===0)return 'Today';if(diff===1)return 'Yesterday';if(diff<7)return x.toLocaleDateString([], {weekday:'long'});return x.toLocaleDateString([], {month:'short',day:'numeric'});}
function short(t){var x=new Date(Number(t)),n=new Date();if(x.toDateString()===n.toDateString())return clock(t);var diff=(n-x)/864e5;if(diff<7)return x.toLocaleDateString([], {weekday:'short'});return x.toLocaleDateString([], {month:'short',day:'numeric'});}

/* ---------- shell ---------- */
function root(){
 var r=d.getElementById(ID);if(r)return r;
 r=d.createElement('div');r.id=ID;r.setAttribute('role','dialog');r.setAttribute('aria-modal','true');r.setAttribute('aria-label','Chats');r.hidden=true;
 r.innerHTML='<section class="om-home"><header class="om-bar"><button type="button" class="om-ic" data-om-close aria-label="Close chats">‹</button><h2>Chats</h2><button type="button" class="om-link" data-om-tools>Tools</button></header><div class="om-list" role="list"></div></section>'+
 '<section class="om-talk" hidden><header class="om-bar"><button type="button" class="om-ic" data-om-back aria-label="Back to chats">‹</button><span class="om-who"></span><h2 class="om-title"></h2></header><div class="om-msgs" aria-live="polite"></div>'+
 '<div class="om-tray" hidden><div class="om-tray-top"><button type="button" class="om-chip" data-om-photo>📷 Photo</button><button type="button" class="om-chip" data-om-mygif>GIF from phone</button></div><div class="om-gifs"></div></div>'+
 '<div class="om-prev" hidden></div>'+
 '<form class="om-input" autocomplete="off"><button type="button" class="om-plus" data-om-plus aria-label="Add a picture or GIF" aria-expanded="false">+</button><textarea rows="1" maxlength="2000" placeholder="Message" aria-label="Message"></textarea><button type="submit" class="om-send" aria-label="Send"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z"/></svg></button></form></section>';
 d.body.appendChild(r);
 r.querySelector('[data-om-close]').onclick=close;
 r.querySelector('[data-om-back]').onclick=home;
 r.querySelector('[data-om-tools]').onclick=function(){close();if(orig.inbox)orig.inbox(null,true);};
 r.querySelector('[data-om-plus]').onclick=function(){toggleTray();};
 r.querySelector('[data-om-photo]').onclick=function(){pick('image/*');};
 r.querySelector('[data-om-mygif]').onclick=function(){pick('image/gif,image/*');};
 var f=r.querySelector('.om-input'),ta=f.querySelector('textarea');
 f.onsubmit=function(e){e.preventDefault();send();};
 ta.addEventListener('input',function(){size(ta);});
 ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&window.matchMedia('(pointer:fine)').matches){e.preventDefault();send();}});
 ta.addEventListener('focus',function(){closeTray();setTimeout(function(){bottom(true);},250);});
 ta.addEventListener('paste',async function(e){var f2=e.clipboardData&&e.clipboardData.files&&e.clipboardData.files[0];if(!f2||!/^image\//.test(f2.type))return;e.preventDefault();try{st.img=await prep(f2);showPrev();}catch(x){toast2(x.message);}});
 r.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();if(st.view==='talk')home();else close();}});
 r.querySelector('.om-list').addEventListener('click',function(e){var b=e.target.closest('[data-om-key]');if(b)openTalk(b.getAttribute('data-om-key'));});
 if(window.visualViewport){var fit=function(){if(!st.open)return;var v=window.visualViewport;r.style.height=v.height+'px';r.style.top=v.offsetTop+'px';bottom(false);};visualViewport.addEventListener('resize',fit);visualViewport.addEventListener('scroll',fit);}
 return r;
}
function size(t){t.style.height='auto';t.style.height=Math.min(110,Math.max(36,t.scrollHeight))+'px';}
function toast2(m){try{if(typeof window.toast==='function')return window.toast(m);}catch(e){}alert(m);}
function show(){var r=root();if(!st.open){st.open=true;r.hidden=false;d.documentElement.classList.add('om-lock');if(window.visualViewport){r.style.height=visualViewport.height+'px';r.style.top=visualViewport.offsetTop+'px';}}return r;}
function close(){st.open=false;st.gen++;clearTimeout(st.timer);clearTimeout(st.ltimer);var r=d.getElementById(ID);if(r)r.hidden=true;d.documentElement.classList.remove('om-lock');closeTray();try{if(typeof window.refreshChatInbox==='function')window.refreshChatInbox();}catch(e){}bubble();}

/* ---------- home ---------- */
async function home(){
 var r=show();st.view='home';st.key=null;st.gen++;clearTimeout(st.timer);closeTray();
 r.querySelector('.om-home').hidden=false;r.querySelector('.om-talk').hidden=true;
 if(!st.list.length)r.querySelector('.om-list').innerHTML='<p class="om-empty">Loading chats…</p>';
 await loadList();
 r.querySelector('[data-om-close]').focus({preventScroll:true});
}
async function loadList(){
 var g=st.gen;clearTimeout(st.ltimer);
 try{var data=await call('/api/chat');if(g!==st.gen||!st.open)return;st.list=(data.conversations||[]).filter(function(c){return scopeOf(c.key);});drawList();}
 catch(e){if(g===st.gen&&!st.list.length)d.getElementById(ID).querySelector('.om-list').innerHTML='<p class="om-empty">Chats did not load. Pull down or reopen.</p>';}
 if(st.open&&st.view==='home')st.ltimer=setTimeout(loadList,LISTPOLL);
}
function drawList(){
 var r=root(),box=r.querySelector('.om-list');
 var list=st.list.slice().sort(function(a,b){return ((b.last&&b.last.id)||0)-((a.last&&a.last.id)||0);});
 if(!list.length){box.innerHTML='<p class="om-empty">No chats yet.</p>';return;}
 box.innerHTML=list.map(function(c){
  var l=c.last,prev=l?((Number(l.sender)===me()?'You: ':(c.kind!=='person'?nameFor(l.sender).split(' ')[0]+': ':''))+(l.text||'📷 Picture')):'Say hi 👋';
  return '<button type="button" role="listitem" class="om-row'+(c.unread?' om-unread':'')+'" data-om-key="'+esc2(c.key)+'"><span class="om-av">'+convAv(c)+'</span><span class="om-mid"><b>'+esc2(convName(c))+'</b><small>'+esc2(prev)+'</small></span><span class="om-end">'+(l?'<time>'+short(l.created_at)+'</time>':'')+(c.unread?'<em>'+(c.unread>99?'99+':c.unread)+'</em>':'')+'</span></button>';
 }).join('');
}

/* ---------- conversation ---------- */
async function openTalk(key,opts){
 if(!scopeOf(key))return false;
 var r=show();st.view='talk';st.key=key;st.gen++;st.rows=new Map();st.thread=null;st.img=null;showPrev();closeTray();clearTimeout(st.ltimer);
 var c=st.list.find(function(x){return x.key===key;});
 r.querySelector('.om-home').hidden=true;r.querySelector('.om-talk').hidden=false;
 r.querySelector('.om-title').textContent=c?convName(c):'Chat';r.querySelector('.om-who').innerHTML=c?convAv(c):'';
 r.querySelector('.om-msgs').innerHTML='<p class="om-empty">Loading…</p>';
 var ta=r.querySelector('.om-input textarea');ta.value='';size(ta);
 await pull(true);
 if(!(opts&&opts.noFocus)&&window.matchMedia('(pointer:fine)').matches)ta.focus({preventScroll:true});
 return true;
}
async function pull(first){
 var g=st.gen,key=st.key;clearTimeout(st.timer);
 if(!d.hidden||first){
  try{
   var data=await call('/api/chat?conversation='+encodeURIComponent(key));
   if(g!==st.gen||key!==st.key)return;
   if(data.thread){st.thread=data.thread;var r=root();if(!st.list.find(function(x){return x.key===key;})){var c={key:key,kind:(data.thread.people||[]).length===2&&/^people:/.test(key)?'person':(/^room:/.test(key)?'room':'group'),name:data.thread.name||data.thread.label,people:data.thread.people};r.querySelector('.om-title').textContent=convName(c);r.querySelector('.om-who').innerHTML=convAv(c);}}
   var before=st.rows.size,lastBefore=lastId();
   (data.messages||[]).forEach(function(m){st.rows.set(Number(m.id),m);});
   st.pending=st.pending.filter(function(p){return p.key===key&&!p.done;});
   draw(first||lastId()!==lastBefore);
   if(lastId()>lastBefore)markRead();
  }catch(e){if(first&&g===st.gen)root().querySelector('.om-msgs').innerHTML='<p class="om-empty">'+esc2((e&&e.message)||'This chat did not load.')+'</p>';}
 }
 if(g===st.gen&&st.open&&st.view==='talk')st.timer=setTimeout(function(){pull(false);},POLL);
}
function lastId(){var x=0;st.rows.forEach(function(v,k){if(k>x)x=k;});return x;}
function markRead(){var id=lastId();if(!id||!st.key)return;call('/api/chat',{conversation:st.key,action:'read',through:id}).catch(function(){});var c=st.list.find(function(x){return x.key===st.key;});if(c)c.unread=0;}
function nearBottom(){var b=root().querySelector('.om-msgs');return b.scrollHeight-b.scrollTop-b.clientHeight<120;}
function bottom(force){var b=d.getElementById(ID);if(!b)return;b=b.querySelector('.om-msgs');if(force||nearBottom())b.scrollTop=b.scrollHeight;}
function draw(scroll){
 var r=root(),box=r.querySelector('.om-msgs'),stick=scroll||nearBottom();
 var mine=me(),group=!/^people:\d+,\d+$/.test(st.key||'');
 var all=[...st.rows.values()].sort(function(a,b){return a.id-b.id;}).map(function(m){return {id:m.id,sender:Number(m.sender),text:m.text||'',image:m.image||null,at:Number(m.created_at)||0};});
 st.pending.forEach(function(p){all.push({pend:p,sender:mine,text:p.text,image:p.image,at:p.at,fail:p.fail});});
 if(!all.length){box.innerHTML='<p class="om-empty">No messages yet. Say hi 👋</p>';return;}
 var html='',lastDay='',prev=null;
 all.forEach(function(m,i){
  var day=dayLabel(m.at||Date.now());if(day!==lastDay){html+='<div class="om-day">'+esc2(day)+'</div>';lastDay=day;prev=null;}
  var out=m.sender===mine,next=all[i+1],tail=!next||next.sender!==m.sender||(next.at-m.at)>300000||dayLabel(next.at||Date.now())!==day;
  var head=!prev||prev.sender!==m.sender||(m.at-prev.at)>300000;
  html+='<div class="om-msg '+(out?'om-out':'om-in')+(tail?' om-tail':'')+(m.pend?' om-pend':'')+(m.fail?' om-fail':'')+'"'+(m.pend?' data-om-retry="'+esc2(m.pend.clientId)+'"':'')+'>';
  if(!out)html+='<span class="om-face">'+(tail?av(personFor(m.sender)):'')+'</span>';
  html+='<div class="om-col">';
  if(!out&&group&&head)html+='<span class="om-name">'+esc2(nameFor(m.sender))+'</span>';
  if(m.image)html+='<img class="om-pic" src="'+esc2(m.image)+'" alt="Picture" loading="lazy">';
  if(m.text)html+='<div class="om-bub">'+esc2(m.text).replace(/\n/g,'<br>')+'</div>';
  if(tail)html+='<time>'+(m.fail?'Not sent. Tap to try again':(m.pend?'Sending…':clock(m.at)))+'</time>';
  html+='</div></div>';prev=m;
 });
 box.innerHTML=html;
 box.querySelectorAll('img.om-pic').forEach(function(im){im.addEventListener('load',function(){if(stick)bottom(true);},{once:true});im.onclick=function(){var w=d.createElement('div');w.className='om-zoom';w.innerHTML='<img alt="Picture">';w.firstChild.src=im.src;w.onclick=function(){w.remove();};root().appendChild(w);};});
 box.querySelectorAll('[data-om-retry]').forEach(function(el){el.onclick=function(){var p=st.pending.find(function(x){return x.clientId===el.getAttribute('data-om-retry');});if(p&&p.fail)deliver(p);};});
 if(stick)box.scrollTop=box.scrollHeight;
}
async function send(gifUrl){
 var r=root(),ta=r.querySelector('.om-input textarea'),text=gifUrl?'':String(ta.value||'').trim(),image=gifUrl||st.img||null;
 if(!text&&!image){ta.focus();return;}
 if(text.length>2000){toast2('Keep it under 2,000 letters.');return;}
 var sc=scopeOf(st.key);if(!sc)return;
 var p={key:st.key,scope:sc,text:text,image:image,clientId:uid(),at:Date.now(),fail:false,done:false};
 st.pending.push(p);
 if(!gifUrl){ta.value='';size(ta);st.img=null;showPrev();}
 closeTray();draw(true);
 if(window.matchMedia('(pointer:coarse)').matches&&!gifUrl)ta.focus({preventScroll:true});
 await deliver(p);
}
async function deliver(p){
 p.fail=false;draw(true);
 try{
  var body={action:'send',scope:p.scope,text:p.text,clientId:p.clientId};if(p.image)body.image=p.image;
  await call('/api/chat-v2',body);
  try{if(window.AudioSys)AudioSys.beep(520,.05,.12);}catch(e){}
  if(st.key===p.key){var g=st.gen;var data=await call('/api/chat?conversation='+encodeURIComponent(p.key)).catch(function(){return null;});if(data&&g===st.gen){(data.messages||[]).forEach(function(m){st.rows.set(Number(m.id),m);});}p.done=true;st.pending=st.pending.filter(function(x){return !x.done;});draw(true);markRead();}
  else p.done=true;
 }catch(e){p.fail=true;draw(true);toast2((e&&e.message)||'Not sent. Tap it to try again.');}
}

/* ---------- + tray: photo and GIFs ---------- */
function toggleTray(){var t=root().querySelector('.om-tray');if(t.hidden)openTray();else closeTray();}
function closeTray(){var r=d.getElementById(ID);if(!r)return;var t=r.querySelector('.om-tray');t.hidden=true;r.querySelector('[data-om-plus]').setAttribute('aria-expanded','false');r.querySelector('[data-om-plus]').classList.remove('on');}
function openTray(){
 var r=root(),t=r.querySelector('.om-tray'),g=t.querySelector('.om-gifs');t.hidden=false;var pl=r.querySelector('[data-om-plus]');pl.setAttribute('aria-expanded','true');pl.classList.add('on');
 var sc=window.ohanaSlimChat;
 if(!g.firstChild){
  var n=sc&&sc.stickers?sc.stickers:0;
  for(var i=0;i<n;i++){(function(i){var b=d.createElement('button');b.type='button';b.className='om-gif';b.setAttribute('aria-label','Send '+(GIFS[i]||'GIF'));b.innerHTML='<span>'+esc2(GIFS[i]||'GIF')+'</span>';b.onclick=function(){var u=st.gifCache[i]||(st.gifCache[i]=sc.makeGif(i));send(u);};g.appendChild(b);})(i);}
  var i2=0;(function fill(){if(i2>=n||t.hidden)return;var k=i2++;var b=g.children[k];try{var u=st.gifCache[k]||(st.gifCache[k]=sc.makeGif(k));b.innerHTML='<img alt="'+esc2(GIFS[k]||'GIF')+'" src="'+u+'">';}catch(e){}setTimeout(fill,30);})();
 }
 bottom(true);
}
var input=null;
function pick(accept){if(!input){input=d.createElement('input');input.type='file';input.hidden=true;input.onchange=async function(){var f=input.files&&input.files[0];input.value='';if(!f)return;try{st.img=await prep(f);showPrev();closeTray();}catch(e){toast2(e.message||'That picture did not work.');}};d.body.appendChild(input);}input.accept=accept;input.click();}
function prep(f){var sc=window.ohanaSlimChat;if(sc&&sc.prepare)return sc.prepare(f);return Promise.reject(Error('Pictures are updating. Reopen the chat.'));}
function showPrev(){var r=d.getElementById(ID);if(!r)return;var p=r.querySelector('.om-prev');p.innerHTML='';if(!st.img){p.hidden=true;return;}var im=d.createElement('img');im.src=st.img;im.alt='Picture to send';var x=d.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label','Remove picture');x.onclick=function(){st.img=null;showPrev();};p.append(im,x);p.hidden=false;}

/* ---------- hooks into the app ---------- */
var orig={inbox:typeof window.openChatInbox==='function'?window.openChatInbox:null,dm:null,say:null};
var hooks={
 inbox:function(key,toolsOpen){
  if(toolsOpen){if(st.open)close();return orig.inbox?orig.inbox(key,toolsOpen):null;}
  if(key&&!scopeOf(key))return orig.inbox?orig.inbox(key,toolsOpen):null;
  if(key)return openTalk(key);return home();
 },
 dm:async function(id){
  id=Number(id);if(!(id>0)||id===me())return;
  try{var started=await call('/api/chat',{action:'start',memberId:id});var key=(started&&started.conversation)||('people:'+[me(),id].sort(function(a,b){return a-b;}).join(','));await openTalk(key);}
  catch(e){var k='people:'+[me(),id].sort(function(a,b){return a-b;}).join(',');if(!(await openTalk(k)))toast2((e&&e.message)||'Could not open chat.');}
 },
 say:function(){
  var s=sval(),inGame=!!(s&&s.game),pz=false,mo=false;
  try{pz=typeof PZ!=='undefined'&&PZ&&PZ.id;}catch(e){}
  try{mo=!!(d.getElementById('pp-frame')&&window.__ppHost&&window.__ppHost.snapshot()&&/^(classic|family)$/.test(window.__ppHost.snapshot().mode));}catch(e){}
  if(!inGame&&!pz&&!mo&&s&&s.room)return openTalk('room:'+Number(s.room));
  return orig.say?orig.say.apply(this,arguments):null;
 }
};
function claim(){
 try{if(typeof window.openChatInbox==='function'&&window.openChatInbox!==hooks.inbox){if(window.openChatInbox!==orig.inbox&&!window.openChatInbox.__om)orig.inbox=window.openChatInbox;window.openChatInbox=hooks.inbox;}}catch(e){}
 try{if(typeof window.openMemberDM==='function'&&window.openMemberDM!==hooks.dm){window.openMemberDM=hooks.dm;}}catch(e){}
 try{if(typeof window.openGameSay==='function'&&window.openGameSay!==hooks.say){orig.say=window.openGameSay;window.openGameSay=hooks.say;}}catch(e){}
}
/* ---------- chat bubble in games + top emblem ---------- */
var bub=null;
function unreadCount(){var h=d.getElementById('chat-head');var n=h?parseInt(h.dataset.unread||'0',10):0;return n>0?n:0;}
function inGameView(){var s=sval();var g=d.getElementById('game');return !!(s&&s.game&&g&&g.offsetHeight>0);}
function bubble(){
 if(!bub){bub=d.createElement('button');bub.type='button';bub.id='om-game-bubble';bub.hidden=true;bub.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.6 1.3 4.9 3.4 6.5L4.6 22l4.2-2.2c1 .3 2.1.4 3.2.4 5.5 0 10-3.9 10-8.6S17.5 3 12 3z"/></svg><b hidden></b>';bub.onclick=function(){var s=sval(),k=s&&s.gstate&&s.gstate.conversation;if(!unreadCount()&&scopeOf(k))openTalk(k);else home();};d.body.appendChild(bub);}
 var on=inGameView()&&!st.open;bub.hidden=!on;if(!on)return;
 var n=unreadCount(),b=bub.querySelector('b');b.hidden=!n;b.textContent=n>99?'99+':String(n);bub.classList.toggle('om-new',n>0);bub.setAttribute('aria-label',n?('Open chat, '+n+' new'):'Open chat');
 var dock=d.getElementById('game-controls-dock'),r=dock&&dock.offsetHeight>0?dock.getBoundingClientRect():null;
 bub.style.top=(r?Math.max(60,r.top-46):(innerHeight-130))+'px';bub.style.left=(r?Math.max(6,r.left+6):8)+'px';
}
function headClick(e){if(e){e.preventDefault();e.stopPropagation();}home();}
function claimHead(){var h=d.getElementById('chat-head');if(h&&h.onclick!==headClick)h.onclick=headClick;}
setInterval(function(){claimHead();bubble();},1000);
hooks.inbox.__om=hooks.dm.__om=hooks.say.__om=true;
claim();
setInterval(claim,1500);
d.addEventListener('visibilitychange',function(){if(!d.hidden&&st.open){if(st.view==='talk')pull(false);else loadList();}});
window.ohanaMessenger={open:function(key){return key?openTalk(key):home();},close:close,state:st,scopeOf:scopeOf};
})();
