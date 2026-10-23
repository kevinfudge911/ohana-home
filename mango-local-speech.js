/* Local Mango speech. No profile writes, transport, recognition or autoplay. */
(()=>{'use strict';
const mounts=new WeakMap();
function mount(root,{synth=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance,timeoutMs=25000,initialMuted=false}={}){
 if(mounts.has(root))return mounts.get(root);
 const $=s=>root.querySelector(s),message=$('[data-message]'),caption=$('[data-caption]'),status=$('[data-status]'),voices=$('[data-voices]'),hear=$('[data-hear]'),mute=$('[data-mute]'),stop=$('[data-stop]');
 let muted=!!initialMuted,active=null,timer=0,destroyed=false,local=[],generation=0;
 const supported=!!(synth&&Utterance&&typeof synth.getVoices==='function');
 const publish=(state,text)=>{root.dataset.voiceState=state;status.textContent=text;stop.disabled=!active;hear.disabled=muted||!supported||!local.length;mute.setAttribute('aria-pressed',String(muted));mute.textContent=muted?'Unmute Mango':'Mute Mango';root.dispatchEvent(new CustomEvent('mango-voice-state',{detail:{state,active:!!active,muted}}));};
 const idle=()=>publish(muted?'muted':local.length?'ready':'unavailable',muted?'Mango is muted. Captions stay on.':local.length?'Ready when you are.':'No local English voice is available. You can still read Mango’s words.');
 function cancel(text){generation++;clearTimeout(timer);const owned=active;active=null;root.classList.remove('is-speaking');if(owned)try{synth.cancel();}catch{}idle();if(text)status.textContent=text;}
 function refresh(){if(destroyed)return;const chosen=voices.value;try{local=supported?synth.getVoices().filter(v=>v.localService===true&&/^en(?:-|_|$)/i.test(v.lang)):[];}catch{local=[];}
  voices.replaceChildren();for(const v of local){const option=document.createElement('option');option.value=v.voiceURI;option.textContent=v.name+' ('+v.lang+')';voices.append(option);}if(local.some(v=>v.voiceURI===chosen))voices.value=chosen;else{const preferred=local.find(v=>/Sonia|Tessa/i.test(v.name))||local.find(v=>v.default)||local[0];if(preferred)voices.value=preferred.voiceURI;}
  if(!local.length){const option=document.createElement('option');option.value='';option.textContent='No local voice available';voices.append(option);}voices.disabled=!local.length;if(active&&!local.some(v=>v.voiceURI===active.voice.voiceURI))cancel('The local voice changed. Press Hear Mango to try again.');else if(!active)idle();
 }
 function speak(){
  if(destroyed||muted||!supported)return;cancel();refresh();
  // Re-resolve the explicit local voice immediately before speaking. Never use the platform default.
  const voice=local.find(v=>v.voiceURI===voices.value&&v.localService===true);if(!voice){idle();return;}
  const text=message.value.trim().slice(0,240);caption.textContent=text||'Write a message for Mango first.';if(!text){status.textContent='Write a message before speaking.';return;}
  if(synth.speaking||synth.pending){publish('busy','Another voice is speaking. Try again when it finishes.');return;}
  const id=++generation;let utterance;
  try{utterance=new Utterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=1.05;utterance.pitch=1.22;utterance.volume=.85;active=utterance;
   const current=()=>!destroyed&&generation===id&&active===utterance;
   utterance.onstart=()=>{if(!current())return;root.classList.add('is-speaking');publish('speaking','Mango is speaking.');};
   utterance.onend=()=>{if(!current())return;active=null;clearTimeout(timer);root.classList.remove('is-speaking');idle();status.textContent='Finished. Mango’s words stay here.';};
   utterance.onerror=()=>{if(!current())return;active=null;clearTimeout(timer);root.classList.remove('is-speaking');publish('error','The local voice could not speak. Mango’s words stay here.');};
   publish('starting','Starting Mango’s local voice…');synth.speak(utterance);timer=setTimeout(()=>{if(current())cancel('The local voice stopped. Press Hear Mango to try again.');},timeoutMs);
  }catch{cancel('The local voice could not start. Mango’s words stay here.');}
 }
 const click=e=>{if(!e.isTrusted)return;const b=e.target.closest('button');if(!b||!root.contains(b))return;if(b===hear)speak();else if(b===stop)cancel('Stopped. Mango’s words stay here.');else if(b===mute){muted=!muted;cancel();}else if(b.dataset.line){cancel();message.value=b.dataset.line;caption.textContent=message.value;}};
 const edit=()=>{cancel();caption.textContent=message.value.trim().slice(0,240)||'Write something for Mango to say.';},changeVoice=()=>cancel('Voice selected. Press Hear Mango when you are ready.'),hidden=()=>{if(document.hidden)cancel();},leaving=()=>cancel();
 root.addEventListener('click',click);message.addEventListener('input',edit);voices.addEventListener('change',changeVoice);synth?.addEventListener?.('voiceschanged',refresh);document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',leaving);refresh();
 const api={stop:()=>cancel(),get state(){return{muted,status:root.dataset.voiceState,localVoices:local.map(v=>({name:v.name,lang:v.lang,voiceURI:v.voiceURI,localService:v.localService})),active:!!active};},destroy(){cancel();destroyed=true;root.removeEventListener('click',click);message.removeEventListener('input',edit);voices.removeEventListener('change',changeVoice);synth?.removeEventListener?.('voiceschanged',refresh);document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',leaving);mounts.delete(root);}};
 mounts.set(root,api);return api;
}
window.OhanaMangoLocalSpeech={mount};
})();
