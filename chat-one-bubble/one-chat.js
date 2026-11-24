(function(){
if(window.ohanaOneChat)return;
var d=document,KEY='ohana_chat_bubble_v1',SIZE=42,st={unread:0,list:[],last:0,place:null,drag:null,shown:false,acked:{}};
function sval(){try{return typeof S!=='undefined'?S:null;}catch(e){return null;}}
function tok(){var s=sval();if(s&&s.token)return s.token;try{return localStorage.getItem('ohana_token')||'';}catch(e){return '';}}
function call(path,body){if(typeof window.api==='function')return window.api(path,body);return fetch(path,{method:body?'POST':'GET',headers:Object.assign({'content-type':'application/json'},tok()?{authorization:'Bearer '+tok()}:{}),body:body?JSON.stringify(body):undefined}).then(function(r){return r.json();});}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){return null;}}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){}}
function visible(e){if(!e)return false;var r=e.getBoundingClientRect();if(r.width<8||r.height<8)return false;if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)return false;var cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.display!=='none'&&cs.opacity!=='0';}
/* the player's own character: game dock, puzzle dock, then the home workstation */
function avatar(){var q=['#pz-workstation img.character-avatar','#game-controls-dock img.character-avatar','.ohana-workstation img.character-avatar','#pz-workstation canvas','#game-controls-dock canvas','.ohana-workstation canvas'];for(var i=0;i<q.length;i++){var l=d.querySelectorAll(q[i]);for(var j=0;j<l.length;j++)if(visible(l[j]))return l[j];}return null;}
function clamp(x,y){var w=innerWidth,h=(window.visualViewport?visualViewport.height:innerHeight);return {x:Math.max(4,Math.min(w-SIZE-4,x)),y:Math.max(4,Math.min(h-SIZE-4,y))};}
function ctx(a){return a&&a.closest('.ohana-workstation')?'home':'room';}
function spot(){
 var a=avatar(),all=load()||{},p=all[ctx(a)]||{};
 if(a){var r=a.getBoundingClientRect(),ox=typeof p.dx==='number'?p.dx:r.width*0.68,oy=typeof p.dy==='number'?p.dy:(r.height<100?-SIZE+2:-SIZE*0.45);return clamp(r.left+ox,r.top+oy);}
 if(typeof p.fx==='number')return clamp(p.fx*innerWidth,p.fy*innerHeight);
 return clamp(innerWidth-SIZE-12,innerHeight-SIZE-90);
}
function messengerOpen(){var r=d.getElementById('om-chat');return !!(r&&!r.hidden);}
function loggedIn(){var s=sval();return !!(s&&s.me&&s.me.id&&tok());}
function icon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.9 2 11.7c0 2.6 1.3 4.9 3.4 6.5L4.6 22l4.2-2.2c1 .3 2.1.4 3.2.4 5.5 0 10-3.9 10-8.6S17.5 3 12 3z"/></svg><b hidden></b>';}
function bubble(){
 var b=d.getElementById('oc1-bubble');if(b)return b;
 b=d.createElement('button');b.type='button';b.id='oc1-bubble';b.innerHTML=icon();b.setAttribute('aria-label','Open chats');b.hidden=true;d.body.appendChild(b);
 b.addEventListener('pointerdown',down);b.addEventListener('click',function(e){e.preventDefault();if(st.dragged){st.dragged=false;return;}openChats();});
 return b;
}
function down(e){if(e.button>0)return;var b=bubble(),r=b.getBoundingClientRect();st.drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,bx:r.left,by:r.top,moved:false};st.dragged=false;try{b.setPointerCapture(e.pointerId);}catch(x){}b.addEventListener('pointermove',move);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);}
function move(e){var g=st.drag;if(!g||e.pointerId!==g.id)return;var dx=e.clientX-g.sx,dy=e.clientY-g.sy;if(!g.moved&&Math.abs(dx)+Math.abs(dy)<8)return;g.moved=true;var b=bubble();b.classList.add('oc1-drag');var p=clamp(g.bx+dx,g.by+dy);b.style.left=p.x+'px';b.style.top=p.y+'px';e.preventDefault();}
function up(e){var g=st.drag,b=bubble();b.removeEventListener('pointermove',move);b.removeEventListener('pointerup',up);b.removeEventListener('pointercancel',up);st.drag=null;b.classList.remove('oc1-drag');if(!g||!g.moved)return;st.dragged=true;
 var r=b.getBoundingClientRect(),a=avatar(),all=load()||{},k=ctx(a),p={fx:r.left/innerWidth,fy:r.top/innerHeight};if(a){var ar=a.getBoundingClientRect();p.dx=r.left-ar.left;p.dy=r.top-ar.top;}all[k]=p;save(all);}
function paint(){
 var b=bubble(),on=loggedIn()&&!messengerOpen();b.hidden=!on;if(!on)return;
 if(!st.drag){var p=spot();b.style.left=p.x+'px';b.style.top=p.y+'px';}
 var n=st.unread,h=d.getElementById('chat-head');if(h&&h.dataset&&h.dataset.unread!=null){var hn=parseInt(h.dataset.unread,10);if(hn>=0&&hn!==n&&Date.now()-st.last>20000)n=hn;}
 var t=b.querySelector('b');t.hidden=!n;t.textContent=n>99?'99+':String(n);
 if(n>(st.shownN||0)){b.classList.remove('oc1-new');void b.offsetWidth;b.classList.add('oc1-new');}st.shownN=n;
 b.setAttribute('aria-label',n?('Open chats, '+n+' waiting'):'Open chats');
}
function refresh(){if(!loggedIn()||d.hidden)return;call('/api/chat').then(function(r){if(!r||!Array.isArray(r.conversations))return;st.list=r.conversations;st.unread=r.conversations.reduce(function(n,c){return n+(c.muted?0:(c.unread||0));},0);st.last=Date.now();paint();}).catch(function(){});}
function openChats(){
 var m=window.ohanaMessenger;if(!m)return;
 var waiting=st.list.filter(function(c){return c.unread&&!c.muted;});
 if(waiting.length===1&&m.scopeOf&&m.scopeOf(waiting[0].key))m.open(waiting[0].key);else m.open();
 setTimeout(paint,50);
}
/* The old OK pop-up keeps its own list of waiting messages. Clear it for the chat being read, so it never stacks up behind the scenes. */
function ackOpen(){
 var m=window.ohanaMessenger,s=m&&m.state;if(!s||!s.open||s.view!=='talk'||!s.key)return;var key=s.key;
 call('/api/chat-v2').then(function(r){(r&&r.messages||[]).forEach(function(x){var k=String(x.scope||'').replace(/^direct:/,'people:');if(k===key&&!st.acked[x.id]){st.acked[x.id]=1;call('/api/chat-v2',{action:'ack',id:x.id}).catch(function(){delete st.acked[x.id];});}});}).catch(function(){});
}
/* Camera: a small chip beside Photo in the + tray. */
var camNext=false,ic=HTMLInputElement.prototype.click;
HTMLInputElement.prototype.click=function(){if(this.type==='file'){if(camNext){this.setAttribute('capture','environment');this.accept='image/*';}else this.removeAttribute('capture');}camNext=false;return ic.apply(this,arguments);};
function camChip(){var top=d.querySelector('#om-chat .om-tray-top');if(!top||top.querySelector('[data-oc1-cam]'))return;var photo=top.querySelector('[data-om-photo]');if(!photo)return;var c=d.createElement('button');c.type='button';c.className='om-chip';c.setAttribute('data-oc1-cam','');c.textContent='Camera';c.onclick=function(){camNext=true;photo.click();camNext=false;};photo.insertAdjacentElement('afterend',c);}
/* GIF search (GIPHY), in the + tray above the Ohana GIFs. The key stays on the server. */
var gq={cache:{},t:0,busy:false};
function gifSearch(){var tray=d.querySelector('#om-chat .om-tray');if(!tray||tray.querySelector('.oc1-gs'))return;var g=tray.querySelector('.om-gifs');if(!g)return;
 var w=d.createElement('div');w.className='oc1-gs';w.innerHTML='<input type="search" enterkeyhint="search" placeholder="Search GIFs" aria-label="Search GIFs" maxlength="50"><div class="oc1-gr" role="list"></div><small>Powered by GIPHY</small>';
 g.parentNode.insertBefore(w,g);var inp=w.querySelector('input'),gr=w.querySelector('.oc1-gr');
 inp.addEventListener('input',function(){clearTimeout(gq.t);gq.t=setTimeout(function(){find(inp.value,gr);},600);});
 inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();clearTimeout(gq.t);find(inp.value,gr);}});
}
function note(gr,t){gr.innerHTML='<p class="oc1-gn">'+t+'</p>';}
function find(q,gr){q=String(q||'').trim().toLowerCase();if(q.length<2){gr.innerHTML='';return;}
 if(gq.cache[q])return show(gq.cache[q],gr);note(gr,'Looking…');
 call('/api/gif?q='+encodeURIComponent(q)).then(function(r){if(!r||r.ok===false){note(gr,(r&&r.error)||'GIF search is resting. Try again soon.');return;}gq.cache[q]=r.results||[];show(gq.cache[q],gr);}).catch(function(e){note(gr,(e&&e.message)||'GIF search is resting. Try again soon.');});}
function show(list,gr){if(!list.length){note(gr,'No GIFs for that. Try other words.');return;}gr.innerHTML='';
 list.forEach(function(x){var b=d.createElement('button');b.type='button';b.className='oc1-gi';b.setAttribute('role','listitem');b.setAttribute('aria-label','Send GIF '+(x.title||''));var im=d.createElement('img');im.alt=x.title||'GIF';im.loading='lazy';im.src=x.thumb;b.appendChild(im);b.onclick=function(){sendGif(x,b);};gr.appendChild(b);});}
function sendGif(x,b){var m=window.ohanaMessenger,s=m&&m.state;if(gq.busy||!s||!s.key)return;var sc=m.scopeOf&&m.scopeOf(s.key);if(!sc)return;gq.busy=true;b.classList.add('oc1-wait');
 call('/api/gif?id='+encodeURIComponent(x.id)).then(function(r){if(!r||!r.image)throw new Error((r&&r.error)||'That GIF would not load. Pick another.');
  return call('/api/chat-v2',{action:'send',scope:sc,text:'',image:r.image,clientId:'gif-'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)});})
 .then(function(){var p=d.querySelector('#om-chat [data-om-plus]');if(p&&p.getAttribute('aria-expanded')==='true')p.click();})
 .catch(function(e){var gr=b.parentNode;if(gr)note(gr,(e&&e.message)||'Not sent. Try again.');})
 .then(function(){gq.busy=false;b.classList.remove('oc1-wait');});}
var was=false;
function tick(){var o=messengerOpen();camChip();gifSearch();if(o)ackOpen();if(was&&!o)refresh();was=o;paint();}
addEventListener('resize',paint);if(window.visualViewport)visualViewport.addEventListener('resize',paint);addEventListener('scroll',paint,true);
d.addEventListener('visibilitychange',function(){if(!d.hidden)refresh();});
setInterval(paint,700);setInterval(tick,4000);setInterval(refresh,15000);
setTimeout(function(){bubble();refresh();tick();},400);
window.ohanaOneChat={refresh:refresh,paint:paint,reset:function(){try{localStorage.removeItem(KEY);}catch(e){}paint();}};
})();
