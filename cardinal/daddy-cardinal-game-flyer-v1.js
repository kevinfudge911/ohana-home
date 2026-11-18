/* Daddy's Cardinal in games: light flyer. One shadow-DOM layer, compositor-only motion
   (Web Animations on transform/opacity), no per-frame JavaScript, no screen-wide observers,
   pointer-events none so it never blocks a card or button. 100 flight patterns, perches anywhere safe.
   v2 (Nov 18 2026): flies on the home screen too (the old visits flyer rests while this runs), leaves the sign
   often, takes long roaming flights across the whole screen, perches briefly, sings more. */
(function(){
'use strict';
if(window.ohanaCardinalFlyer)return;
const BASE=.25,K=.6,BX=175,BY=200,FW=350,FH=292,COLS=9,PERCH=8,FLAPMS=138;
const fw=FW*BASE,fh=FH*BASE;
const img=new Image(),rev=new Image();img.src='/ohana-cardinal-daddy-cap-v1.png';rev.src='/ohana-cardinal-daddy-cap-reverse-v1.png';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),rnd=(a,b)=>a+Math.random()*(b-a),pickOne=a=>a[Math.floor(Math.random()*a.length)];
function birdClip(c){c.beginPath();c.rect(171,20,114,54);c.moveTo(184,5);for(const a of [[206,24],[229,37],[246,59],[250,79],[267,87],[283,96],[279,108],[251,112],[247,143],[233,158],[237,161],[228,164],[203,164],[195,163],[167,163],[144,156],[115,142],[82,145],[89,126],[70,111],[88,103],[120,105],[144,114],[152,93],[176,84],[169,64],[179,46]])c.lineTo(...a);c.closePath();c.clip();}
function drawWing(c,w,far){const amp=1,shoulder={x:-7,y:-48},tip={x:-92-Math.max(0,-w)*24,y:-45-w*117*amp};
 c.save();c.translate(far?10:-3,far?-10:2);c.globalAlpha=far?.78:1;
 const grad=c.createLinearGradient(shoulder.x,shoulder.y,tip.x,tip.y);grad.addColorStop(0,far?'#ad2515':'#ee3825');grad.addColorStop(.56,far?'#b32c1e':'#c72c1f');grad.addColorStop(1,'#8c211a');
 c.fillStyle=grad;c.strokeStyle='#752219';c.lineWidth=1.3;
 c.beginPath();c.moveTo(shoulder.x,shoulder.y);c.bezierCurveTo(-47,-73,tip.x-8,tip.y-17,tip.x,tip.y);c.quadraticCurveTo(tip.x+14,tip.y+24,-45,-22);c.quadraticCurveTo(-23,-20,shoulder.x,shoulder.y);c.fill();c.stroke();
 for(let i=0;i<8;i++){const f=i/7,tx=tip.x+f*58,ty=tip.y+f*(42+w*43*amp);c.fillStyle=i%2?'#c53222':'#d13a27';c.beginPath();c.moveTo(-35+f*12,-46+f*10);c.quadraticCurveTo(tx+11,ty-12,tx,ty);c.quadraticCurveTo(tx-6,ty+4,-44+f*20,-27+f*4);c.closePath();c.fill();c.stroke();}
 c.restore();}
function sheet(){const cv=document.createElement('canvas');cv.width=Math.round(COLS*FW*K);cv.height=Math.round(2*FH*K);const c=cv.getContext('2d');
 for(let row=0;row<2;row++)for(let col=0;col<COLS;col++){const w=col<PERCH?Math.sin(col/PERCH*Math.PI*2):0;c.save();c.beginPath();c.rect(col*FW*K,row*FH*K,FW*K,FH*K);c.clip();c.translate(col*FW*K+BX*K,row*FH*K+BY*K);c.scale(K,K);if(row)c.scale(-1,1);
  if(col<PERCH)drawWing(c,w,true);c.save();c.translate(-220,-174);birdClip(c);c.drawImage(row&&rev.naturalWidth?rev:img,0,0);c.restore();if(col<PERCH)drawWing(c,w,false);c.restore();}
 cv.style.cssText=`position:absolute;left:0;top:0;width:${COLS*fw}px;height:${2*fh}px;will-change:transform`;return cv;}
// ---------- 100 flight patterns: 10 families x 10 variants ----------
function seeded(n){let x=(n*2654435761>>>0)||1;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
const FAM=['Arc glide','Bounding flight','Swoop','Loop-de-loop','Figure eight','Spiral in','Zigzag','Wild sweep','Hover and hop','Overshoot and turn back'];
const PATTERNS=[];for(let f=0;f<10;f++)for(let v=0;v<10;v++){const r=seeded(f*131+v*17+5);PATTERNS.push({id:f*10+v,family:f,name:FAM[f]+' '+(v+1),p:[r(),r(),r(),r(),r(),r()],speed:150+r()*110,depth:-.12+r()*.45});}
function lineSeg(A,B,arc=0){return{kind:'path',f:u=>({x:A.x+(B.x-A.x)*u,y:A.y+(B.y-A.y)*u-arc*Math.sin(Math.PI*u)})};}
function buildSegments(pat,A,B,V){const [p0,p1,p2,p3,p4,p5]=pat.p,dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1,sx=dx>=0?1:-1,v=pat.id%10;
 const base=u=>({x:A.x+dx*u,y:A.y+dy*u});
 switch(pat.family){
 case 0:{const h=(18+p0*.45*L+p1*40)*(v%4===3?-.35:1),k=.7+p2*.7;return[{kind:'path',f:u=>{const b=base(u);return{x:b.x,y:b.y-h*Math.sin(Math.PI*Math.pow(u,k))};}}];}
 case 1:{const h0=.12*L+p0*20,amp=6+p1*14,fq=Math.max(2,Math.round(L/(70+p2*60)));return[{kind:'path',f:u=>{const b=base(u);return{x:b.x,y:b.y-h0*Math.sin(Math.PI*u)+amp*Math.sin(2*Math.PI*fq*u)*Math.sqrt(Math.sin(Math.PI*u))};}}];}
 case 2:{const h=40+p0*110,e=1.2+p1;return[{kind:'path',f:u=>{const b=base(u);return{x:b.x,y:b.y+h*Math.pow(Math.sin(Math.PI*u),e)*(1-.35*u)};}}];}
 case 3:{const u0=.3+p0*.35,R=24+p1*34,M=base(u0),dir=v%2?-1:1,turns=v>=7?2:1;return[lineSeg(A,M,8),{kind:'path',f:u=>{const t=u*2*Math.PI*turns;return{x:M.x+sx*dir*R*Math.sin(t),y:M.y-R*(1-Math.cos(t))};}},lineSeg(M,B,10)];}
 case 4:{const u0=.35+p0*.3,a=28+p1*30,b=a*(.6+p2*.4),M=base(u0);return[lineSeg(A,M,6),{kind:'path',f:u=>{const t=u*2*Math.PI;return{x:M.x+sx*a*Math.sin(t),y:M.y+b*Math.sin(t)*Math.cos(t)*(v%2?-1:1)};}},lineSeg(M,B,6)];}
 case 5:{const R=40+p0*50,turns=1+p1*.9,phi0=-Math.PI/2-sx*(.6+p2),S={x:B.x+R*Math.cos(phi0),y:B.y-12+R*.6*Math.sin(phi0)},cw=v%2?-1:1;return[lineSeg(A,S,20+p3*30),{kind:'path',f:u=>{const t=phi0+cw*turns*2*Math.PI*u,r=R*(1-u);return{x:B.x+r*Math.cos(t),y:B.y-12*(1-u)+r*.6*Math.sin(t)};}}];}
 case 6:{const amp=16+p0*34,fq=2+Math.floor(p1*3),nx=-dy/L,ny=dx/L;return[{kind:'path',f:u=>{const b=base(u),s=Math.sin(2*Math.PI*fq*u),z=Math.sign(s)*Math.sqrt(Math.abs(s))*amp*Math.sin(Math.PI*u);return{x:b.x+nx*z,y:b.y+ny*z-.1*L*Math.sin(Math.PI*u)};}}];}
 case 7:{const m=30,C1={x:m+p0*(V.w-2*m),y:m+p1*(V.h*.6)},C2={x:m+p2*(V.w-2*m),y:m+p3*(V.h*.7)};return[{kind:'path',f:u=>{const a=1-u;return{x:a*a*a*A.x+3*a*a*u*C1.x+3*a*u*u*C2.x+u*u*u*B.x,y:a*a*a*A.y+3*a*a*u*C1.y+3*a*u*u*C2.y+u*u*u*B.y};}}];}
 case 8:{const W={x:clamp(A.x+dx*.5+(p0-.5)*120,30,V.w-30),y:clamp(Math.min(A.y,B.y)-40-p1*70,40,V.h-40)},hold=.6+p2*.8,bob=4+p3*4;return[lineSeg(A,W,10+p4*20),{kind:'time',time:hold,f:u=>({x:W.x+Math.sin(u*Math.PI*2)*3,y:W.y+bob*Math.sin(u*Math.PI*2*(2+Math.round(p5*2)))})},lineSeg(W,B,10)];}
 default:{const O={x:clamp(B.x+sx*(70+p0*110),20,V.w-20),y:clamp(B.y-50-p1*70,30,V.h-30)};return[lineSeg(A,O,20+p2*40),{kind:'path',f:u=>{const a=1-u,C={x:O.x+sx*30,y:O.y-25};return{x:a*a*O.x+2*a*u*C.x+u*u*B.x,y:a*a*O.y+2*a*u*C.y+u*u*B.y};}}];}
 }}
function plan(pat,A,B,V,s0,s1,opts={}){const segs=buildSegments(pat,A,B,V),speed=pat.speed*(opts.speedMul||1);
 for(const s of segs){if(s.kind==='time'){s.dur=s.time;continue;}let len=0,prev=s.f(0);for(let i=1;i<=40;i++){const q=s.f(i/40);len+=Math.hypot(q.x-prev.x,q.y-prev.y);prev=q;}s.dur=Math.max(.25,len/speed);}
 let total=segs.reduce((a,s)=>a+s.dur,0);total=clamp(total,1.4,9);const scaleT=total/segs.reduce((a,s)=>a+s.dur,0);segs.forEach(s=>s.dur*=scaleT);
 const N=clamp(Math.round(total*26),28,220),pts=[];
 for(let i=0;i<=N;i++){const tau=i/N,g=tau-.62*Math.sin(2*Math.PI*tau)/(2*Math.PI);let tt=g*total,seg=segs[0],u=0;for(const s of segs){seg=s;if(tt<=s.dur){u=s.dur?tt/s.dur:1;break;}tt-=s.dur;u=1;}
  const q=seg.f(clamp(u,0,1)),sm=tau*tau*(3-2*tau),sc=(s0+(s1-s0)*sm)*(1+(opts.noDepth?0:pat.depth)*Math.sin(Math.PI*tau));
  pts.push({x:opts.free?q.x:clamp(q.x,6,V.w-6),y:opts.free?q.y:clamp(q.y,18,V.h-6),sc,t:tau*total});}
 // facing with hysteresis, pitch from velocity, smoothed
 let facing=opts.facing||(B.x>=A.x?1:-1);for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dt=Math.max(1e-3,b.t-a.t),vx=(b.x-a.x)/dt,vy=(b.y-a.y)/dt;if(vx*facing<-70)facing=-facing;pts[i].f=facing;pts[i].vy=vy;pts[i].pitch=clamp(facing>0?Math.atan2(vy,Math.max(30,Math.abs(vx)))*57.3:-Math.atan2(vy,Math.max(30,Math.abs(vx)))*57.3,-34,34);}
 for(let k=0;k<2;k++)for(let i=1;i<pts.length-1;i++)pts[i].pitch=(pts[i-1].pitch+2*pts[i].pitch+pts[i+1].pitch)/4;
 pts[pts.length-1].pitch=0;return{pts,total};}
// ---------- the bird ----------
const host=document.createElement('div');host.setAttribute('aria-hidden','true');host.style.cssText='position:fixed;left:0;top:0;width:0;height:0;z-index:2147482000;pointer-events:none;contain:layout style';
const root=host.attachShadow({mode:'open'});root.innerHTML=`<style>*{pointer-events:none!important}.o{position:fixed;left:0;top:0;width:0;height:0;will-change:transform,opacity;transform-origin:0 0;opacity:0}.m{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0}.v{position:absolute;left:${-BX*BASE}px;top:${-BY*BASE}px;width:${fw}px;height:${fh}px;overflow:hidden}</style><div class="o"><div class="m"><div class="v"></div></div></div>`;
const outer=root.querySelector('.o'),mid=root.querySelector('.m'),view=root.querySelector('.v');let cv=null;
let roams=0,aways=0,state='off',row=0,facing=1,cur=null,timers=[],flapAnim=null,moveAnim=null,idleAnim=null,showAnim=null,archAnim=null,archEl=null,perch=null,recent=[],flights=0,songs=0,lastSong=0,lastPattern=null,scrollFlag=false,installed=false,tickId=0,awayUntil=0;
const T=(f,ms)=>{const id=setTimeout(()=>{timers=timers.filter(x=>x!==id);f();},ms);timers.push(id);return id;};
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function frameTransform(col,r){return`translate(${-col*fw}px,${-r*fh}px)`;}
function setFrame(col){if(!cv)return;flapAnim?.cancel();flapAnim=cv.animate([{transform:frameTransform(col,row)},{transform:frameTransform(col,row)}],{duration:1,fill:'forwards'});}
function flap(fast){if(!cv)return;flapAnim?.cancel();flapAnim=cv.animate([{transform:frameTransform(0,row)},{transform:frameTransform(PERCH,row)}],{duration:fast?FLAPMS*.8:FLAPMS,iterations:Infinity,easing:`steps(${PERCH})`});}
function poseTransform(x,y,sc,pitch){return`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(pitch||0).toFixed(1)}deg) scale(${(sc/BASE).toFixed(4)})`;}
function place(p){cur={x:p.x,y:p.y,sc:p.sc};moveAnim?.cancel();moveAnim=outer.animate([{transform:poseTransform(p.x,p.y,p.sc,0)},{transform:poseTransform(p.x,p.y,p.sc,0)}],{duration:1,fill:'forwards'});}
function show(on){showAnim?.cancel();showAnim=outer.animate([{opacity:on?1:0},{opacity:on?1:0}],{duration:1,fill:'forwards'});}
// ---------- the game world ----------
function screenRoot(){if(inGame())return document.getElementById('game');for(const sel of ['#pz-board','#gr-main','#faith','#ohana-journey-room','#app']){const e=document.querySelector(sel);if(e&&(e.offsetWidth||e.offsetHeight)&&e.getClientRects().length)return e;}return null;}
function modalOpen(){try{const st=document.getElementById('ohana-settings-dialog');if(st?.open)return true;return[...document.querySelectorAll('dialog[open],[aria-modal="true"]')].some(e=>e.offsetWidth||e.offsetHeight);}catch{return true;}}
let oldPaused=false;function pauseOld(on){if(on===oldPaused)return;oldPaused=on;try{window.ohanaCardinalVisits?.setPaused?.('flyer-active',on);}catch{}}
function inGame(){try{return!!(typeof S!=='undefined'&&S&&S.game)&&!!document.getElementById('game');}catch{return false;}}
function allowed(){if(document.hidden)return false;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return false;const v=window.ohanaCardinalVisits?.snapshot;if(!v||!v.eligible||!v.enabled||v.reduced)return false;if((v.paused||[]).some(r=>r!=='game-board-speed'&&r!=='flyer-active'))return false;if(window.ohanaDaddySounds?.getKeepPerched?.())return false;if(inGame())return true;if(modalOpen())return false;return!!screenRoot()&&!!archBird();}catch{return false;}}
function archBird(){for(const im of document.querySelectorAll('svg image, img[src*="daddy-cap-v1"]')){const h=im.getAttribute('href')||im.getAttribute('xlink:href')||im.getAttribute('src')||'';if(!/ohana-cardinal-daddy-cap-v1/.test(h))continue;const el=im.closest('svg')||im,r=el.getBoundingClientRect();if(r.width>10&&r.width<220&&r.top>-20&&r.top<200)return el;}return null;}
function hideArch(on){const el=on?archBird():null;if(el===archEl&&on)return;archAnim?.cancel();archAnim=null;archEl=el;if(el)archAnim=el.animate([{opacity:0},{opacity:0}],{duration:1,fill:'forwards'});}
function viewport(){return{w:innerWidth,h:innerHeight};}
function home(){const el=archBird()||archEl;if(el){const r=el.getBoundingClientRect();if(r.width>10){const s=r.width/384;return{x:r.left+220*s,y:r.top+174*s,sc:s,label:'home',el:null};}}const V=viewport();return{x:V.w/2,y:72,sc:.22,label:'home',el:null};}
const CLEAR='button,a[href],input,select,textarea,[role=button],[onclick],[tabindex],.card,.tile,.domino,.cell,.chip,.btn,label,video,iframe,dialog[open],[class*="card"],[class*="tile"],[class*="btn"],[class*="button"],[class*="domino"],[class*="piece"],[class*="chip"]';
function spots(){const g=screenRoot();if(!g)return[];const V=viewport(),out=[],keep=[];
 for(const el of g.querySelectorAll(CLEAR)){const r=el.getBoundingClientRect();if(r.width&&r.height&&r.bottom>0&&r.top<V.h&&r.width*r.height<V.w*V.h*.3)keep.push(r);if(keep.length>600)break;}
 const cands=new Set([...g.querySelectorAll('#board,[id$="board"],.game-head,h1,h2,h3,header,section,:scope > *,:scope > * > *,:scope > * > * > *')]);
 for(const el of cands){if(el.closest('dialog'))continue;const r=el.getBoundingClientRect();if(r.width<70||r.height<18||r.top<46||r.top>V.h-24||r.left<-2||r.right>V.w+2)continue;const sc=rnd(.21,.27);
  for(const fx of [.18,.5,.82]){const x=r.left+r.width*fx,y=r.top+1,box={l:x-152*sc,r:x+152*sc,t:y-172*sc,b:y-2};if(box.l<4||box.r>V.w-4||box.t<4)continue;if(keep.some(k=>k.left<box.r-2&&k.right>box.l+2&&k.top<box.b-2&&k.bottom>box.t+2))continue;out.push({x,y,sc,el,top:r.top,label:(el.id||String(el.className||'').split(' ')[0]||el.tagName).slice(0,30)});}}
 return out;}
// ---------- songs ----------
function muted(){try{if(typeof AudioSys==='undefined'||AudioSys.muted||localStorage.getItem('ohana_muted')==='true')return true;const m=window.ohanaDaddySounds?.getSettings?.();if(m&&(m.muted===true||m.volume===0))return true;return!!window.speechSynthesis?.speaking;}catch{return true;}}
function level(){try{const m=window.ohanaDaddySounds?.getSettings?.();return typeof m?.volume==='number'?clamp(m.volume,0,1):1;}catch{return 1;}}
function ctx(){try{return typeof AudioSys!=='undefined'&&AudioSys.getCtx?AudioSys.getCtx():null;}catch{return null;}}
function sing(chance){if(Math.random()>chance||Date.now()-lastSong<3500||muted()||document.hidden)return;const c=ctx();if(!c||c.state!=='running'||!window.ohanaCardinalSongs)return;if(window.ohanaCardinalSongs.sing({ctx:c,volume:.12*level(),owner:'game'})){songs++;lastSong=Date.now();}else window.ohanaCardinalSongs.prepare(c);}
function gesture(e){if(!e.isTrusted||state==='off'||muted())return;const c=ctx();if(!c)return;if(c.state==='suspended'){try{c.resume();}catch{}}window.ohanaCardinalSongs?.prepare(c);}
// ---------- behaviour ----------
function choosePattern(){let p,t=0;do{p=pickOne(PATTERNS);t++;}while(t<30&&recent.includes(p.id));recent.push(p.id);if(recent.length>40)recent.shift();return p;}
function fly(to,opts={}){if(!cur)return;clearTimers();idleAnim?.cancel();idleAnim=null;const V=viewport(),pat=opts.pattern||choosePattern(),A={x:cur.x,y:cur.y},B={x:to.x,y:to.y};
 const {pts,total}=plan(pat,A,B,V,cur.sc,to.sc,opts);lastPattern=pat.name;flights++;state='flight';perch=null;
 const frames=pts.map((p,i)=>({offset:i/(pts.length-1),transform:poseTransform(p.x,p.y,p.sc,p.pitch)}));
 moveAnim?.cancel();moveAnim=outer.animate(frames,{duration:total*1000,fill:'forwards',easing:'linear'});
 // wing schedule: launch flapping, flap-bounding cruise, glides on descents, landing flare
 const events=[];let mode='',lastFace=0;const push=(t,m,f)=>{if(m!==mode||f!==lastFace){events.push({t,m,f});mode=m;lastFace=f;}};
 let burstEnd=0,foldEnd=-1;for(const p of pts){let m;if(p.t<.35&&!opts.cruise)m='flap';else if(p.t>total-.42)m=(opts.away||opts.then)?'flap':'fast';else if(p.vy>110)m='glide';else{if(p.t>=burstEnd&&p.t>=foldEnd){foldEnd=p.t+rnd(.1,.18);burstEnd=foldEnd+rnd(.35,.8);}m=p.t<foldEnd?'fold':'flap';}push(p.t,m,p.f);}
 for(const e of events)T(()=>{row=e.f>0?0:1;facing=e.f;if(e.m==='flap')flap(false);else if(e.m==='fast')flap(true);else setFrame(e.m==='glide'?0:PERCH);},e.t*1000);
 const last=pts[pts.length-1];T(()=>{cur={x:last.x,y:last.y,sc:last.sc};if(opts.away){state='away';show(false);awayUntil=Date.now();aways++;T(comeBack,rnd(1200,3500));return;}if(opts.then){opts.then();return;}land(to);},total*1000+20);
 if(opts.song!==false)T(()=>sing(.55),rnd(150,900));}
function land(to){state='perch';perch=to;setFrame(PERCH);const stay=to.label==='home'?rnd(700,1800):rnd(1000,2800);
 // idle life on the perch: turn around, hop, tail flick, song
 const acts=Math.floor(rnd(1,2.6));for(let i=0;i<acts;i++)T(()=>{if(state!=='perch')return;const a=Math.random();if(a<.38){row=row?0:1;facing=-facing;setFrame(PERCH);}else if(a<.7){idleAnim?.cancel();idleAnim=mid.animate([{transform:'translateY(0)'},{transform:'translateY(-7px)'},{transform:'translateY(0)'}],{duration:280,easing:'ease-out'});}else{idleAnim?.cancel();idleAnim=mid.animate([{transform:'rotate(0deg)'},{transform:`rotate(${facing>0?-6:6}deg)`},{transform:'rotate(0deg)'}],{duration:320,easing:'ease-in-out'});}},rnd(250,Math.max(300,stay-300)));
 T(()=>sing(.5),rnd(200,Math.max(300,stay-300)));T(next,stay);}
function edgePoint(){const V=viewport(),side=Math.floor(Math.random()*4),m=70;return side===0?{x:-m,y:rnd(40,V.h*.6)}:side===1?{x:V.w+m,y:rnd(40,V.h*.6)}:side===2?{x:rnd(0,V.w),y:-m}:{x:Math.random()<.5?-m:V.w+m,y:rnd(V.h*.2,V.h*.5)};}
// long roaming flight: 2 to 4 legs through open air all over the screen, no landing in between
function airPoint(){const V=viewport(),p=cur||{x:V.w/2,y:V.h/2};let best=null;for(let i=0;i<6;i++){const q={x:rnd(34,V.w-34),y:rnd(70,V.h*.86),sc:rnd(.22,.33)};const d=Math.hypot(q.x-p.x,q.y-p.y);if(!best||d>best.d)best={...q,d};if(d>V.w*.55)break;}return best;}
function roam(legs,finish){roams++;const step=n=>{if(state==='off')return;if(n<=0){finish();return;}fly(airPoint(),{cruise:n<legs,then:()=>step(n-1),song:n===legs,speedMul:rnd(.9,1.15)});};step(legs);}
function landSomewhere(){if(state==='off')return;const list=spots().filter(s=>!perch||Math.hypot(s.x-perch.x,s.y-perch.y)>70);if(!list.length||Math.random()<.18){fly(home());return;}fly(pickOne(list));}
function next(){if(state==='off')return;const r=Math.random();
 if(r<.2){const e=edgePoint();hideArch(true);fly({x:e.x,y:e.y,sc:cur.sc*1.1},{away:true,free:true});return;}
 if(r<.62){roam(Math.floor(rnd(2,4.99)),landSomewhere);return;}
 if(r<.72&&perch?.label!=='home'){fly(home());return;}
 landSomewhere();}
function comeBack(){if(state!=='away')return;if(!allowed()){stop();return;}const e=edgePoint(),V=viewport();place({x:e.x,y:e.y,sc:rnd(.24,.3)});row=e.x>V.w/2?1:0;show(true);if(Math.random()<.6){roam(Math.floor(rnd(1,3.99)),landSomewhere);return;}const list=spots(),to=list.length&&Math.random()<.8?pickOne(list):home();fly(to,{free:true});}
function start(){if(!img.complete||!img.naturalWidth){img.onload=()=>{};return;}if(!cv){cv=sheet();view.append(cv);}if(!host.isConnected)document.body.append(host);pauseOld(true);state='perch';row=0;facing=1;hideArch(true);const h=home();place(h);setFrame(PERCH);show(true);perch=h;T(next,rnd(500,1400));}
function stop(){pauseOld(false);clearTimers();state='off';moveAnim?.cancel();flapAnim?.cancel();idleAnim?.cancel();show(false);hideArch(false);perch=null;cur=null;window.ohanaCardinalSongs?.hush('game');}
function tick(){const ok=allowed();if(!ok){if(state!=='off')stop();return;}if(state==='off'){start();return;}hideArch(true);
 if(state==='perch'&&perch){if(perch.label==='home'){const h=home();if(Math.abs(h.x-perch.x)>3||Math.abs(h.y-perch.y)>3){perch=h;place(h);}}else if(scrollFlag||!perch.el?.isConnected||!perch.el.getClientRects().length||Math.abs(perch.el.getBoundingClientRect().top-perch.top)>4){scrollFlag=false;clearTimers();T(next,60);}}scrollFlag=false;}
function install(){if(installed)return;installed=true;tickId=setInterval(tick,700);document.addEventListener('pointerdown',gesture,{capture:true,passive:true});addEventListener('scroll',()=>{if(state==='perch')scrollFlag=true;},{capture:true,passive:true});addEventListener('resize',()=>{if(state==='perch'&&perch?.label!=='home')scrollFlag=true;},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state!=='off')stop();});tick();}
window.ohanaCardinalFlyer={patterns:PATTERNS.length,patternNames:PATTERNS.map(p=>p.name),get snapshot(){return{state,flights,songs,roams,aways,screen:inGame()?'game':(screenRoot()?.id||null),pattern:lastPattern,perch:perch?.label||null,row,x:cur?Math.round(cur.x):null,y:cur?Math.round(cur.y):null};},spots,stop,hold(){clearTimers();},fly:(i)=>{if(state==='perch'||state==='flight'){const l=spots();fly(l.length?pickOne(l):home(),{pattern:PATTERNS[i%100]});}},_plan:plan,_pattern:i=>PATTERNS[i]};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
