/* Daddy's Cardinal songs: phrases cut from the cleared real recording (XC75501). No synthesis. */
(function(){
'use strict';
if(window.ohanaCardinalSongs)return;
// Units from the 2 s excerpt: A and B rising whistles, C short falling note. r = reversed copy.
const U={A:[.34,.86],B:[1.0,1.58],C:[1.6,1.86],a:[.5,.78],b:[1.06,1.36],k:[1.62,1.71]};
const R=(u,rate,gap,rev)=>({u,rate,gap,rev:!!rev});
function seeded(n){let x=n*2654435761>>>0;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
const families=[
 ['What cheer',r=>{const n=2+Math.floor(r()*3),s=[R('A',.92+r()*.2,.08)];for(let i=0;i<n;i++)s.push(R('A',.95+r()*.2,.06+r()*.05,true));return s;}],
 ['Birdy birdy',r=>{const n=4+Math.floor(r()*5),rate=1.05+r()*.25,s=[];for(let i=0;i<n;i++)s.push(R('C',rate,.05+r()*.04));return s;}],
 ['Cheer cheer',r=>{const n=2+Math.floor(r()*3),rate=.9+r()*.25,s=[];for(let i=0;i<n;i++)s.push(R('B',rate,.1+r()*.08,true));return s;}],
 ['Purty purty',r=>{const n=2+Math.floor(r()*2),s=[];for(let i=0;i<n;i++){s.push(R('b',1+r()*.15,.02));s.push(R('C',1.05+r()*.15,.12));}return s;}],
 ['Chip',r=>{const n=1+Math.floor(r()*3),rate=1.3+r()*.4,s=[];for(let i=0;i<n;i++)s.push(R('k',rate,.18+r()*.4));return s;}],
 ['Whoit whoit',r=>{const n=2+Math.floor(r()*3),rate=.88+r()*.2,s=[];for(let i=0;i<n;i++)s.push(R('a',rate,.09+r()*.06));return s;}],
 ['Full song',r=>[R('A',.94+r()*.14,.14),R('B',.94+r()*.14,.04),R('C',.94+r()*.14,0)]],
 ['Wheet tew',r=>{const n=1+Math.floor(r()*3),s=[];for(let i=0;i<n;i++){s.push(R('B',.95+r()*.15,.03));s.push(R('C',.9+r()*.2,.16,r()<.5));}return s;}],
 ['Sweet sweet',r=>{const n=3+Math.floor(r()*4),rate=1.1+r()*.25,s=[];for(let i=0;i<n;i++)s.push(R('b',rate,.05+r()*.05,r()<.3));return s;}],
 ['Mixed',r=>{const pool=['A','B','C','a','b','k'],n=3+Math.floor(r()*4),s=[];for(let i=0;i<n;i++)s.push(R(pool[Math.floor(r()*pool.length)],.88+r()*.35,.06+r()*.14,r()<.35));return s;}]
];
const SONGS=[];
families.forEach(([name,make],f)=>{for(let v=0;v<6;v++)SONGS.push({name:name+' '+(v+1),notes:make(seeded(f*100+v+7))});});
const cache=new WeakMap();let decoding=null,last=-1,recent=[];const live=new Map();
function reversed(ctx,buf){const out=ctx.createBuffer(buf.numberOfChannels,buf.length,buf.sampleRate);for(let c=0;c<buf.numberOfChannels;c++){const s=buf.getChannelData(c),d=out.getChannelData(c);for(let i=0,n=s.length;i<n;i++)d[i]=s[n-1-i];}return out;}
function ensure(ctx,given){let e=cache.get(ctx);if(e)return e.buf?e:null;if(given){e={buf:given,rev:reversed(ctx,given)};cache.set(ctx,e);return e;}
 if(decoding)return null;const rec=window.ohanaCardinalRecording;if(!rec||typeof rec.base64!=='string')return null;
 try{const bin=atob(rec.base64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);decoding=Promise.resolve(ctx.decodeAudioData(bytes.buffer)).then(b=>{if(!cache.get(ctx))cache.set(ctx,{buf:b,rev:reversed(ctx,b)});}).catch(()=>{}).finally(()=>{decoding=null;});}catch{}
 return null;}
function pick(){let i,t=0;do{i=Math.floor(Math.random()*SONGS.length);t++;}while(t<12&&(recent.includes(i)));recent.push(i);if(recent.length>20)recent.shift();return i;}
function hush(owner){for(const [src,o]of live){if(owner&&o!==owner)continue;try{src.stop();}catch{}live.delete(src);}}
function sing({ctx,buffer=null,volume=.12,owner='game',index=null}={}){
 try{if(!ctx||ctx.state!=='running'||!(volume>0))return false;const e=ensure(ctx,buffer);if(!e)return false;hush(owner);
  const song=SONGS[index==null?pick():index%SONGS.length];last=SONGS.indexOf(song);let t=ctx.currentTime+.03;const end=t+3.6,dur=e.buf.duration;
  const master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);let count=0;
  for(const n of song.notes){const [s0,s1]=U[n.u];const len=(s1-s0);const play=len/n.rate;if(t+play>end)break;const src=ctx.createBufferSource(),g=ctx.createGain();src.buffer=n.rev?e.rev:e.buf;src.playbackRate.value=n.rate;const off=n.rev?dur-s1:s0;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+.006);g.gain.setValueAtTime(1,t+play-.012);g.gain.linearRampToValueAtTime(0,t+play);src.connect(g);g.connect(master);src.start(t,off,len);live.set(src,owner);src.onended=()=>{live.delete(src);try{g.disconnect();}catch{}};t+=play+n.gap;count++;}
  setTimeout(()=>{try{master.disconnect();}catch{}},Math.ceil((t-ctx.currentTime+.5)*1000));return count>0;
 }catch{return false;}}
window.ohanaCardinalSongs={count:SONGS.length,names:SONGS.map(s=>s.name),sing,hush,prepare(ctx){try{if(ctx)ensure(ctx,null);}catch{}},ready(ctx){return!!(ctx&&cache.get(ctx));},get last(){return last<0?null:SONGS[last].name;}};
})();
