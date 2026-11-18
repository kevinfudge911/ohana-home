(function(){
if(window.ohanaSlimChat)return;
var d=document,HOST='ohana-chat-compose-host',MAXLEN=880000;
var SVG_PIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
/* ---------- tiny GIF encoder ---------- */
var PAL=[];for(var r=0;r<6;r++)for(var g=0;g<7;g++)for(var b=0;b<6;b++)PAL.push([r*51,Math.round(g*42.5),b*51]);
var TI=252,BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function quant(px,w,h){var o=new Uint8Array(w*h);for(var y=0;y<h;y++)for(var x=0;x<w;x++){var i=y*w+x,p=i*4,a=px[p+3];if(a<110){o[i]=TI;continue;}var t=BAY[(y&3)*4+(x&3)]/16-.47,k=a/255,R=px[p]*k+255*(1-k),G=px[p+1]*k+255*(1-k),B=px[p+2]*k+255*(1-k);var rr=Math.min(5,Math.max(0,Math.round(R/51+t))),gg=Math.min(6,Math.max(0,Math.round(G/42.5+t))),bb=Math.min(5,Math.max(0,Math.round(B/51+t)));o[i]=rr*42+gg*6+bb;}return o;}
function lzw(px,out){var MIN=8,clear=256,eoi=257,size=9,next=258,dict=new Map(),cur=0,bits=0,buf=[];
 function emit(c){cur|=c<<bits;bits+=size;while(bits>=8){buf.push(cur&255);cur>>>=8;bits-=8;}}
 out.push(MIN);emit(clear);var pre=px[0];
 for(var i=1;i<px.length;i++){var k=px[i],key=pre*256+k,v=dict.get(key);if(v!==undefined){pre=v;continue;}
  emit(pre);
  if(next===4096){emit(clear);dict=new Map();size=9;next=258;}else{if(next>=(1<<size))size++;dict.set(key,next++);}
  pre=k;}
 emit(pre);emit(eoi);if(bits>0)buf.push(cur&255);
 for(var j=0;j<buf.length;j+=255){var n=Math.min(255,buf.length-j);out.push(n);for(var q=0;q<n;q++)out.push(buf[j+q]);}
 out.push(0);}
function gif(w,h,frames,delay){var o=[];function B(x){o.push(x&255)}function W(x){B(x);B(x>>8)}function S(t){for(var i=0;i<t.length;i++)B(t.charCodeAt(i))}
 S('GIF89a');W(w);W(h);B(0xF7);B(TI);B(0);for(var i=0;i<256;i++){var c=PAL[i]||[255,255,255];B(c[0]);B(c[1]);B(c[2]);}
 B(0x21);B(0xFF);B(11);S('NETSCAPE2.0');B(3);B(1);W(0);B(0);
 frames.forEach(function(f){B(0x21);B(0xF9);B(4);B(0x09);W(delay);B(TI);B(0);B(0x2C);W(0);W(0);W(w);W(h);B(0);lzw(f,o);});
 B(0x3B);return new Uint8Array(o);}
/* ---------- stickers ---------- */
var FONT='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',EMO='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
function words(c,t,x,y,size,color){c.font='900 '+size+'px '+FONT;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=Math.max(4,size/4);c.strokeStyle='#fff';c.strokeText(t,x,y);c.fillStyle=color;c.fillText(t,x,y);}
function emo(c,e,x,y,size,rot,sc){c.save();c.translate(x,y);if(rot)c.rotate(rot);if(sc)c.scale(sc,sc);c.font=size+'px '+EMO;c.textAlign='center';c.textBaseline='middle';c.fillText(e,0,2);c.restore();}
function dots(c,t,n,col,seed,fall){for(var i=0;i<n;i++){var s=(Math.sin(i*91.7+seed)*43758.5)%1;s=s<0?s+1:s;var x=10+s*130,y=fall?((s*120+t*120)%130)-5:60+Math.sin(t*6.283+i)*30;c.fillStyle=col[i%col.length];c.beginPath();c.arc(x,y,fall?2.5:2+(i%3),0,6.283);c.fill();}}
function domino(c,x,y,a){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='#fff';c.strokeStyle='#222';c.lineWidth=3;var w=30,h=58;c.beginPath();c.roundRect?c.roundRect(-w/2,-h/2,w,h,6):c.rect(-w/2,-h/2,w,h);c.fill();c.stroke();c.beginPath();c.moveTo(-w/2+4,0);c.lineTo(w/2-4,0);c.stroke();c.fillStyle='#222';[[-7,-20],[7,-8],[0,-14],[-7,8],[7,8],[-7,20],[7,20]].forEach(function(p){c.beginPath();c.arc(p[0],p[1],3,0,6.283);c.fill();});c.restore();}
var T=6.283;
var STICKERS=[
 {n:'LOL',f:function(c,t){emo(c,'\u{1F602}',75,44,52,Math.sin(t*T*2)*.25);words(c,'LOL',75,98,28,'#e0457b');}},
 {n:'Nice play',f:function(c,t){emo(c,'\u{1F44D}',75,44,50,0,1+Math.sin(t*T)*.12);dots(c,t,10,['#ffc400','#ff6f00','#29b6f6'],3);words(c,'Nice play!',75,98,22,'#1d7fe0');}},
 {n:'Domino',f:function(c,t){var u=Math.abs(Math.sin(t*T/2));domino(c,75,44-u*10,Math.sin(t*T)*.35);words(c,'Domino!',75,98,26,'#2e7d32');}},
 {n:'Your turn',f:function(c,t){emo(c,'\u{1F449}',48+Math.sin(t*T)*10,46,46);emo(c,'\u{1F3B2}',108,46,36,t*T);words(c,'Your turn',75,98,24,'#6a1b9a');}},
 {n:'Good game',f:function(c,t){emo(c,'\u{1F3C6}',75,44-Math.abs(Math.sin(t*T))*10,50);dots(c,t,12,['#ffd54f','#fff176','#ffb300'],7);words(c,'Good game',75,98,24,'#c77700');}},
 {n:'Oops',f:function(c,t){emo(c,'\u{1F648}',75,44,50,Math.sin(t*T*2)*.18);words(c,'Oops!',75,98,28,'#ef6c00');}},
 {n:'Woo hoo',f:function(c,t){emo(c,'\u{1F389}',75,46-Math.abs(Math.sin(t*T))*12,50);dots(c,t,24,['#e91e63','#ffc107','#4caf50','#2196f3'],11,true);words(c,'Woo hoo!',75,98,26,'#d81b60');}},
 {n:'Hurry up',f:function(c,t){emo(c,'\u{23F0}',75,44,48,Math.sin(t*T*4)*.2);words(c,'Hurry up!',75,98,24,'#c62828');}},
 {n:'Love you',f:function(c,t){var s=1+Math.max(0,Math.sin(t*T*2))*.18;emo(c,'\u{2764}\u{FE0F}',75,44,48,0,s);words(c,'Love you',75,98,24,'#d32f2f');}},
 {n:'No way',f:function(c,t){emo(c,'\u{1F62E}',75,44,48,0,.8+((t*2)%1)*.3);words(c,'No way!',75,98,26,'#5d4037');}},
 {n:'Hmm',f:function(c,t){emo(c,'\u{1F914}',75,44,50,Math.sin(t*T)*.08);words(c,'Hmm'+('...'.slice(0,Math.floor(t*4)%4)),75,98,26,'#455a64');}},
 {n:'Too easy',f:function(c,t){emo(c,'\u{1F60E}',75,44+Math.sin(t*T)*5,50);words(c,'Too easy',75,98,24,'#00838f');}},
 {n:'Hi',f:function(c,t){emo(c,'\u{1F44B}',75,44,52,Math.sin(t*T*2)*.4);words(c,'Hi!',75,98,30,'#1d7fe0');}},
 {n:'Zzz',f:function(c,t){emo(c,'\u{1F634}',62,52,48);c.globalAlpha=1-t;words(c,'Z',100+t*14,40-t*26,18+t*10,'#5c6bc0');c.globalAlpha=1;words(c,'Zzz...',75,98,24,'#5c6bc0');}},
 {n:'Merry CHRISTmas',f:function(c,t){emo(c,'\u{1F384}',75,42,50);dots(c,t,26,['#ffffff','#e3f2fd'],5,true);words(c,'Merry',75,86,18,'#c62828');words(c,'CHRISTmas',75,106,18,'#2e7d32');}},
 {n:'Happy Thanksgiving',f:function(c,t){emo(c,'\u{1F64F}',75,42,46);for(var i=0;i<6;i++){var x=15+i*24,y=((t*130+i*37)%130)-6;emo(c,'\u{1F342}',x,y,14,t*T+i);}words(c,'Happy',75,86,18,'#bf5b04');words(c,'Thanksgiving',75,106,18,'#8d4004');}}
];
var W=150,H=120,FR=12;
function makeGif(s){var cv=d.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d',{willReadFrequently:true}),fr=[];for(var i=0;i<FR;i++){c.clearRect(0,0,W,H);s.f(c,i/FR);fr.push(quant(c.getImageData(0,0,W,H).data,W,H));}var bytes=gif(W,H,fr,8),bin='';for(var j=0;j<bytes.length;j+=8192)bin+=String.fromCharCode.apply(null,bytes.subarray(j,j+8192));return 'data:image/gif;base64,'+btoa(bin);}
/* ---------- photos ---------- */
function readUrl(file){return new Promise(function(ok,no){var r=new FileReader();r.onload=function(){ok(r.result)};r.onerror=no;r.readAsDataURL(file);});}
function loadImg(src){return new Promise(function(ok,no){var i=new Image();i.onload=function(){ok(i)};i.onerror=no;i.src=src;});}
async function prepare(file){
 if(!file||!/^image\//.test(file.type||'image/'))throw Error('Pick a picture or GIF.');
 var url=await readUrl(file);
 if(/^data:image\/gif;base64,/.test(url)&&url.length<=MAXLEN)return url;
 var img=await loadImg(url),max=1280,q=.84;
 for(var k=0;k<8;k++){var s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),cv=d.createElement('canvas');cv.width=Math.max(1,Math.round(img.naturalWidth*s));cv.height=Math.max(1,Math.round(img.naturalHeight*s));var c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,cv.width,cv.height);c.drawImage(img,0,0,cv.width,cv.height);var out=cv.toDataURL('image/jpeg',q);if(out.length<=MAXLEN)return out;max=Math.round(max*.8);q=Math.max(.6,q-.06);}
 throw Error('That picture is too big.');
}
/* ---------- compose wiring ---------- */
var pending=null;
function host(){return d.getElementById(HOST);}
function art(){var h=host();return h&&h.querySelector('.ohana-speech > article');}
function note(msg,ok){var a=art();if(!a)return;var p=a.querySelector('.oc-prev');var n=a.querySelector('.oc-note');if(!msg){if(n)n.remove();return;}if(!n){n=d.createElement('div');n.className='oc-note';n.style.gridArea='prev';a.appendChild(n);}n.className='oc-note'+(ok?' ok':'');n.textContent=msg;if(p&&!p.hidden)p.appendChild(n);clearTimeout(note.t);note.t=setTimeout(function(){var m=art()&&art().querySelector('.oc-note');if(m)m.remove();},ok?1600:5000);}
function showPrev(){var a=art();if(!a)return;var p=a.querySelector('.oc-prev');if(!p)return;p.innerHTML='';if(!pending){p.hidden=true;return;}var im=d.createElement('img');im.src=pending;im.alt='Picture to send';var x=d.createElement('button');x.type='button';x.textContent='×';x.setAttribute('aria-label','Remove picture');x.onclick=function(){pending=null;showPrev();};p.append(im,x);p.hidden=false;}
async function send(image){
 var h=host(),a=art();if(!h||!a)return;var target=h.__ohanaTarget;
 if(!target||typeof window.api!=='function'){note('Picture sending is updating. Close and reopen the chat.');return;}
 var ta=a.querySelector('.speech-reply textarea'),text=ta?String(ta.value||'').trim():'';
 if(text.length>2000){note('Keep it under 2,000 letters.');return;}
 a.classList.add('oc-busy');
 try{await window.api('/api/chat-v2',{action:'send',scope:target,text:text,image:image,clientId:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2))});
  pending=null;showPrev();if(ta){ta.value='';ta.dispatchEvent(new Event('input',{bubbles:true}));}
  var tray=a.querySelector('.oc-tray');if(tray)closeTray(tray);
  if(target.kind!=='direct'){var x=a.querySelector('[data-speech-toggle]');if(x){x.click();return;}}
  note('Sent',true);
 }catch(e){note((e&&e.message)||'Not sent. Try again.');}
 finally{a.classList.remove('oc-busy');}
}
var anim=0;
function closeTray(tray){tray.hidden=true;cancelAnimationFrame(anim);var b=art()&&art().querySelector('.oc-gif');if(b)b.setAttribute('aria-pressed','false');}
function openTray(tray){
 if(!tray.firstChild){
  var mine=d.createElement('button');mine.type='button';mine.className='oc-mine';mine.innerHTML=SVG_PIC+'<span>My GIFs</span>';mine.setAttribute('aria-label','Send a GIF from your phone');mine.onclick=function(){pick('image/gif,image/*');};tray.appendChild(mine);
  STICKERS.forEach(function(s){var b=d.createElement('button');b.type='button';b.setAttribute('aria-label','Send '+s.n+' GIF');var cv=d.createElement('canvas');cv.width=W;cv.height=H;b.appendChild(cv);b.onclick=function(){try{send(makeGif(s));}catch(e){note('That GIF did not work. Try another.');}};tray.appendChild(b);});
 }
 tray.hidden=false;var b=art()&&art().querySelector('.oc-gif');if(b)b.setAttribute('aria-pressed','true');
 var start=performance.now();cancelAnimationFrame(anim);
 (function loop(now){if(tray.hidden||!tray.isConnected)return;var t=((now-start)/1000/.96)%1;var cs=tray.querySelectorAll('canvas');for(var i=0;i<cs.length;i++){var c=cs[i].getContext('2d');c.clearRect(0,0,W,H);STICKERS[i].f(c,t);}anim=requestAnimationFrame(loop);})(start);
}
var input=null;
function pick(accept){if(!input){input=d.createElement('input');input.type='file';input.style.display='none';input.onchange=async function(){var f=input.files&&input.files[0];input.value='';if(!f)return;try{pending=await prepare(f);showPrev();var t=art()&&art().querySelector('.oc-tray');if(t)closeTray(t);var ta=art()&&art().querySelector('.speech-reply textarea');if(ta)ta.focus({preventScroll:true});}catch(e){note(e.message||'That picture did not work.');}};d.body.appendChild(input);}input.accept=accept;input.click();}
function size(t){if(t.getAttribute('rows')!=='1')t.setAttribute('rows','1');t.style.setProperty('height','auto','important');var h=Math.min(96,Math.max(34,t.scrollHeight));t.style.setProperty('height',h+'px','important');}
function wire(){
 var a=art();if(!a)return;
 var rep=a.querySelector('.speech-reply'),ta=rep&&rep.querySelector('textarea');
 if(ta){size(ta);if(!rep.querySelector('.oc-pic')){var p=d.createElement('button');p.type='button';p.className='oc-tool oc-pic';p.innerHTML=SVG_PIC;p.setAttribute('aria-label','Send a picture');p.onclick=function(){pick('image/*');};var g=d.createElement('button');g.type='button';g.className='oc-tool oc-gif';g.innerHTML='<span>GIF</span>';g.setAttribute('aria-label','Send a GIF');g.setAttribute('aria-pressed','false');g.onclick=function(){var tr=a.querySelector('.oc-tray');if(!tr)return;if(tr.hidden)openTray(tr);else closeTray(tr);};rep.insertBefore(g,ta);rep.insertBefore(p,g);}}
 if(!a.querySelector(':scope > .oc-tray')){var tr=d.createElement('div');tr.className='oc-tray';tr.hidden=true;a.appendChild(tr);}
 if(!a.querySelector(':scope > .oc-prev')){var pv=d.createElement('div');pv.className='oc-prev';pv.hidden=true;a.appendChild(pv);if(pending)showPrev();}
}
d.addEventListener('input',function(e){var t=e.target;if(t&&t.matches&&t.matches('#'+HOST+' textarea'))size(t);},true);
d.addEventListener('focusin',function(e){var t=e.target;if(t&&t.matches&&t.matches('#'+HOST+' textarea'))size(t);},true);
d.addEventListener('paste',async function(e){var t=e.target;if(!t||!t.closest||!t.closest('#'+HOST))return;var items=(e.clipboardData&&e.clipboardData.files)||[];var f=items[0];if(!f||!/^image\//.test(f.type))return;e.preventDefault();try{pending=await prepare(f);showPrev();}catch(x){note(x.message||'That picture did not work.');}},true);
d.addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('#'+HOST+' [data-speech-send]');if(!b||!pending)return;e.preventDefault();e.stopImmediatePropagation();send(pending);},true);
d.addEventListener('keydown',function(e){if(e.key!=='Enter'||e.shiftKey||!pending)return;var t=e.target;if(t&&t.matches&&t.matches('#'+HOST+' textarea')){e.preventDefault();e.stopImmediatePropagation();send(pending);}},true);
var mo=new MutationObserver(function(){if(!host()){pending=null;return;}wire();});
mo.observe(d.body,{childList:true,subtree:false});
var hmo=null,last=null;
setInterval(function(){var h=host();if(h&&h!==last){last=h;if(hmo)hmo.disconnect();hmo=new MutationObserver(wire);hmo.observe(h,{childList:true,subtree:true});wire();}if(!h&&last){last=null;pending=null;if(hmo)hmo.disconnect();}},500);
window.ohanaSlimChat={wire:wire,makeGif:function(i){return makeGif(STICKERS[i||0]);},stickers:STICKERS.length,prepare:prepare};
})();
