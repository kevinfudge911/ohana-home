'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const{JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),live=path.join(root,'live'),main='live/'+fs.readdirSync(live).find(x=>x.endsWith('-app.html'));
const html=fs.readFileSync(path.join(root,main),'utf8'),moduleSource=fs.readFileSync(path.join(root,'mango/announcement.js'),'utf8');
const begin=html.indexOf('function announcementContext()'),end=html.indexOf('async function showPrivateAnnouncementResponses',begin),helpers=html.slice(begin,end);
let checks=0;function check(v,why){assert.ok(v,why);checks++;}
function fixture({activated=false,preview=false,supported=true,local=true,hidden=false,failAck=false}={}){
 const dom=new JSDOM('<body><article id="ordinary">Ordinary update</article></body>',{url:'https://synthetic.invalid/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){if(!this.open)return;this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.HTMLMediaElement.prototype.pause=function(){this.pausedByFixture=true;};w.HTMLMediaElement.prototype.load=function(){};
 w.URL.createObjectURL=()=> 'blob:synthetic';w.URL.revokeObjectURL=()=>{};
 Object.defineProperty(w.navigator,'userActivation',{value:{hasBeenActive:activated,isActive:activated}});
 Object.defineProperty(w.document,'hidden',{get:()=>hidden,configurable:true});
 const handlers=new WeakMap(),add=w.EventTarget.prototype.addEventListener;
 w.EventTarget.prototype.addEventListener=function(n,f,...args){if(n==='click'){const x=handlers.get(this)||[];x.push(f);handlers.set(this,x);}return add.call(this,n,f,...args);};
 const speeches=[],calls=[];let cancels=0,shouldFail=failAck;
 const voice={name:'Synthetic local voice',voiceURI:'fixture-local',lang:'en-US',localService:local};
 const events=new w.EventTarget(),synth={speaking:false,pending:false,getVoices:()=>[voice],speak:u=>speeches.push(u),cancel:()=>cancels++,addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events)};
 class U{constructor(text){this.text=text;}}
 Object.defineProperty(w,'speechSynthesis',{value:supported?synth:undefined});Object.defineProperty(w,'SpeechSynthesisUtterance',{value:supported?U:undefined});
 w.localStorage.setItem('ohana_token','synthetic');w.S={token:'synthetic',me:{id:2},room:1};w.esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));w.AudioSys={beep(){throw Error('Legacy beep should be replaced')}};
 w.api=async(url,body,method,room)=>{calls.push({url,body,method,room});if(shouldFail&&url==='/api/announce/ack')throw Error('Synthetic ack offline');return{ok:true}};
 w.eval(helpers);w.eval(moduleSource);
 const text=('Saved synthetic announcement. '+ 'A'.repeat(300)).slice(0,300),a={id:71,member_id:5,name:'Synthetic sender',text,preview,responses_enabled:true,can_respond:true,images:[{src:'blob:fixture-photo',mime:'image/jpeg',local_preview:true,alt:'Synthetic image'},{src:'blob:fixture-video',mime:'video/mp4',local_preview:true,alt:'Synthetic video'}]};
 // Production media URLs stay authorized by unchanged renderer; fixture uses public built-in for live path.
 if(!preview)a.images=[{src:'/ohana-announcement-menu-hide-v1.jpg',alt:'Synthetic existing Menu attachment'}];
 w.showAnnouncement(a);const d=w.document.getElementById('ohana-announce');
 const click=selector=>{const panel=d.querySelector('.mango-announcement-voice'),target=d.querySelector(selector);for(const fn of handlers.get(panel)||[])fn({isTrusted:true,target});};
 return{w,dom,d,a,speeches,calls,synth,events,click,get cancels(){return cancels},setAckFailure:v=>{shouldFail=v}};
}
const tick=()=>new Promise(r=>setTimeout(r,0));
(async()=>{
 let f=fixture();check(!!f.d.querySelector('.mango-announcement-portrait'),'real incoming announcement mounts without owner/query/loopback gate');check(f.d.querySelector('.announce-message').textContent===f.a.text,'all 300 saved characters preserved');check(f.d.querySelector('.announce-pictures img').getAttribute('src')===f.a.images[0].src,'original media renderer retains attachment');check(f.d.querySelector('.announce-ok').textContent==='OK','real incoming OK label');check(f.calls.length===0&&f.speeches.length===0,'fresh unactivated arrival has no speech or acknowledgment');check(!f.d.querySelector('.announce-ok').disabled,'OK available before hearing');check(f.w.document.getElementById('ordinary').textContent==='Ordinary update','normal card unaffected');
 f.d.querySelector('[data-mango-play]').click();check(f.speeches.length===0,'synthetic click does not bypass trusted Play');f.click('[data-mango-play]');check(f.speeches.length===1&&f.speeches[0].text===f.a.text&&f.speeches[0].voice.localService,'trusted control reaches exact text/local voice');f.speeches[0].onstart();check(f.d.querySelector('.mango-announcement-voice').classList.contains('is-speaking'),'speech drives mouth frames');f.speeches[0].onend();check(f.calls.length===0,'speech completion never acknowledges');check(f.d.querySelector('[data-mango-play]').textContent==='Replay Mango','Replay follows completion');f.click('[data-mango-play]');
 Object.defineProperty(f.d.querySelector('.announce-pictures img'),'complete',{value:true});Object.defineProperty(f.d.querySelector('.announce-pictures img'),'naturalWidth',{value:640});
 f.d.querySelector('.announce-ok').click();check(f.cancels===1,'OK intent stops speech before asynchronous ack returns');await tick();check(f.calls.length===1&&f.calls[0].url==='/api/announce/ack'&&f.calls[0].body.id===71&&f.calls[0].method==='POST'&&f.calls[0].room===1,'OK preserves existing ack API/id/method/room');check(f.calls[0].body.images_seen===true,'existing image-seen receipt retained');check(!f.d.isConnected,'successful ack closes');f.dom.window.close();
 f=fixture({activated:true});check(f.speeches.length===1&&f.calls.length===0,'prior interaction permits exactly one incoming speech attempt without ack');f.speeches[0].onerror({error:'not-allowed'});check(f.d.querySelector('[data-mango-status]').textContent.includes('browser blocked'),'blocked arrival exposes Play/text fallback');check(!f.d.querySelector('.announce-ok').disabled,'blocked arrival keeps OK');f.events.dispatchEvent(new f.w.Event('voiceschanged'));check(f.speeches.length===1,'voice-change never retries automatic speech');f.dom.window.close();
 for(const settings of [{activated:true,preview:true},{activated:true,local:false},{activated:true,supported:false},{activated:true,hidden:true}]){f=fixture(settings);check(f.speeches.length===0,'no automatic speech for preview/remote/API-absent/hidden');check(f.calls.length===0&&!f.d.querySelector('.announce-ok').disabled,'fallback retains text/OK without ack');f.dom.window.close();}
 f=fixture({preview:true});check(f.d.querySelectorAll('.announce-pictures video').length===1&&f.d.querySelectorAll('.announce-pictures img').length===1,'composer preview retains image and native video');f.d.querySelector('.announce-ok').click();await tick();check(f.calls.length===0&&!f.d.isConnected,'preview OK still never acknowledges');f.dom.window.close();
 f=fixture({activated:true});f.click('[data-mango-mute]');check(f.cancels===1&&f.d.querySelector('[data-mango-mute]').getAttribute('aria-pressed')==='true','mute cancels current speech');f.d.close();f.w.showAnnouncement({...f.a,id:72});const next=f.w.document.getElementById('ohana-announce');check(f.speeches.length===1&&next.querySelector('[data-mango-mute]').getAttribute('aria-pressed')==='true','page mute respected by next incoming announcement');check(f.calls.length===0,'closing/muting never acknowledges');f.dom.window.close();
 f=fixture({activated:true,failAck:true});f.d.querySelector('.announce-ok').click();await tick();check(f.d.open&&f.calls.length===1&&f.d.textContent.includes('Synthetic ack offline'),'failed ack leaves announcement available for retry');check(f.cancels===1,'failed ack does not continue forced listening');f.setAckFailure(false);f.d.querySelector('.announce-ok').click();await tick();check(f.calls.length===2&&!f.d.isConnected,'existing retry closes only after successful ack');f.dom.window.close();
 f=fixture({activated:true});const stale=f.speeches[0];f.w.dispatchEvent(new f.w.StorageEvent('storage',{key:'ohana_token'}));check(!f.d.isConnected&&f.cancels===1&&f.calls.length===0,'signout closes/cancels without ack');stale.onstart();check(!f.d.isConnected,'late speech event cannot revive private announcement');f.dom.window.close();
 f=fixture({activated:true});f.w.localStorage.setItem('ohana_token','new-account');await new Promise(r=>setTimeout(r,280));check(!f.d.isConnected&&f.cancels===1&&f.calls.length===0,'same-document token change tears down without ack');f.dom.window.close();
 const marker='<!-- OHANA MANGO ANNOUNCEMENT ROLLOUT START -->',boundary=html.indexOf(marker);check(boundary>0,'one bounded appended module');
 check(html.slice(boundary).includes('<script>'+moduleSource+'</script>'),'inline runtime code equals tested module bytes');
 const finish=html.indexOf('<!-- OHANA MANGO ANNOUNCEMENT ROLLOUT END -->',boundary)+'<!-- OHANA MANGO ANNOUNCEMENT ROLLOUT END -->'.length+1;
 check(finish>boundary,'bounded module ends before preserved cardinal');
 const restored=(html.slice(0,boundary)+html.slice(finish)).replace("try{dialog.showModal();}catch{dialog.setAttribute('open','');}window.OhanaMangoAnnouncement?.mount(dialog,a,context);","try{dialog.showModal();}catch{dialog.setAttribute('open','');}if(!preview)try{AudioSys?.beep?.(880,.15,.3);}catch{}");
 check(Buffer.from(restored).equals(cp.execFileSync('git',['cat-file','blob','32327d93e34e8c600dc3415b30033b48edd4eb54'],{cwd:root,maxBuffer:20*1024*1024})),'exact inverse preserves current live TEN/cardinal and all unrelated app bytes');
 for(const p of ['live/worker.js','live/ohana-announcement-media.js','live/ohana-memories-media.js','wrangler.toml','talk-mango.webp']){if(!fs.existsSync(path.join(root,p)))continue;check(fs.readFileSync(path.join(root,p)).equals(cp.execFileSync('git',['show','HEAD:'+p],{cwd:root,maxBuffer:10*1024*1024})),'unchanged '+p);}
 check(!/fetch\(|\/api\/|getUserMedia|MediaRecorder|SpeechRecognition|localStorage\.setItem|ownerMemberId|mangoAnnouncementPreview/.test(moduleSource),'presentation module has no transport/ack/capture/persistence/preview gate');
 let scripts=0;for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)){if(m[1].trim()){new vm.Script(m[1]);scripts++;}}
 console.log(JSON.stringify({passed:true,checks,parsedScripts:scripts,base:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),syntheticOnly:true,persistedAcknowledgments:0,realSends:0,realMicrophoneRequests:0,nativeAudibilityVerified:false},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
