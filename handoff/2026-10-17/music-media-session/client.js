const OHANA_MEDIA_SESSION_INSTANCES=new WeakMap();
function installOhanaMediaSession(sys,env){
 let session;try{session=env?.navigator?.mediaSession;}catch{return null;}
 const audio=sys?.audio;if(!audio||typeof session?.setActionHandler!=='function'||typeof sys.renderNowPlaying!=='function')return null;
 if(OHANA_MEDIA_SESSION_INSTANCES.has(audio))return OHANA_MEDIA_SESSION_INSTANCES.get(audio);
 const allowed=()=>{try{return env.allowed()===true;}catch{return false;}};
 const hasSource=()=>allowed()&&!!audio.getAttribute('src');let metadataKey='',lastPosition=0;
 function position(force=false){try{if(typeof session.setPositionState!=='function')return;if(!hasSource()||!Number.isFinite(audio.duration)||audio.duration<=0||!Number.isFinite(audio.playbackRate)||audio.playbackRate<=0){session.setPositionState();return;}const now=Date.now();if(!force&&now-lastPosition<1000)return;lastPosition=now;session.setPositionState({duration:audio.duration,playbackRate:audio.playbackRate,position:Math.max(0,Math.min(audio.duration,Number(audio.currentTime)||0))});}catch{}}
 function refresh(){try{const t=hasSource()?sys.current():null;if(!t){metadataKey='';session.metadata=null;session.playbackState='none';position(true);return;}const key=JSON.stringify([t.id,t.stream,t.title,t.artist,t.handle]);if(key!==metadataKey&&typeof env.MediaMetadata==='function'){session.metadata=new env.MediaMetadata({title:String(t.title||'Untitled'),artist:String(t.artist||t.handle||''),album:'Ohana Music'});metadataKey=key;}session.playbackState=audio.paused?'paused':'playing';position(true);}catch{}}
 const oldRender=sys.renderNowPlaying;sys.renderNowPlaying=function(...args){const result=oldRender.apply(this,args);refresh();return result;};
 const action=fn=>()=>{if(hasSource())fn();refresh();};
 function seekTo(value){if(!hasSource()||!Number.isFinite(value)||!Number.isFinite(audio.duration)||audio.duration<=0)return;try{audio.currentTime=Math.max(0,Math.min(audio.duration,value));position(true);}catch{}}
 const handlers={play:action(()=>{if(audio.paused)sys.toggle();}),pause:()=>{audio.pause();refresh();},stop:()=>{audio.pause();seekTo(0);refresh();},previoustrack:action(()=>sys.prev()),nexttrack:action(()=>sys.next()),seekto:d=>seekTo(d?.seekTime),seekbackward:d=>{const n=d?.seekOffset??10;if(Number.isFinite(n)&&n>=0)seekTo(audio.currentTime-n);},seekforward:d=>{const n=d?.seekOffset??10;if(Number.isFinite(n)&&n>=0)seekTo(audio.currentTime+n);}};
 const registered=[];for(const [name,handler]of Object.entries(handlers))try{session.setActionHandler(name,handler);registered.push(name);}catch{}
 for(const event of ['play','pause','ended','loadedmetadata','emptied','seeked','ratechange'])audio.addEventListener(event,refresh);
 audio.addEventListener('timeupdate',()=>position());const result={refresh,registered};OHANA_MEDIA_SESSION_INSTANCES.set(audio,result);refresh();return result;
}

