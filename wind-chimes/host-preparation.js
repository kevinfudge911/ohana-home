import {ChimeController} from './core-layered.js';
import {audioHostContext,createHostAudioGuard} from './host-audio-contract.js';
import {installChimeSoundControls} from './chime-sound-controls.js';

// The renderer and target are supplied by the app; invalid scenes park the host.
export function createPreparedChimeHost({readState,readScene=()=>null,getContext,getGlobalMuted=()=>true,getBusy=()=>false,
 document:doc=globalThis.document,events=globalThis,storage=globalThis.localStorage,
 loadAudio=()=>Promise.all([import('./recorded-audio-layered.js'),import('./audio/catalog.js')]),
 loadRenderer=null,getRenderTarget=()=>null,
 requestFrame=callback=>globalThis.requestAnimationFrame(callback),cancelFrame=id=>globalThis.cancelAnimationFrame(id)}={}){
 if(typeof readState!=='function')throw Error('Sanitized host reader required');
 let destroyed=false,suspended=false,generation=0,frame=null,mounted=null,pendingMount=null,audio=null,controls=null;
 let audioModules=null,audioPromise=null,rendererPromise=null,previousRoute=null,previousSession=null,failedRoute=null;
 const stats={audioImports:0,rendererImports:0,mounts:0,staleMounts:0,paints:0,geometryUpdates:0};
 const state=()=>{try{return readState()||{};}catch{return{};}};
 const muted=()=>{try{return!!getGlobalMuted()||!!controls?.isMuted();}catch{return true;}};
 const busy=()=>{try{return!!getBusy();}catch{return true;}};
 const current=()=>{const value=state();return{value,context:audioHostContext(value)};};
 const controller=new ChimeController({storage,allowSharedWeather:false});
 const valid=(stamp,key)=>!destroyed&&!suspended&&generation===stamp&&current().context.routeKey===key&&current().context.visible;
 function cancelOwnedFrame(){if(frame!==null){cancelFrame(frame);frame=null;}}
 function releaseMounted(){cancelOwnedFrame();const old=mounted;mounted=null;if(old){try{old.instance?.destroy?.();}catch{}old.layer.remove();}controller.setScene('',[]);}
 function park(reason){generation++;pendingMount=null;controller.mute();controller.audio?.stop(reason);releaseMounted();}
 function audioEligible(){const {value,context}=current();return!destroyed&&!suspended&&context.visible&&context.routeKey===previousRoute&&context.sessionKey===controller.sessionKey&&value.paused!==true&&value.reducedMotion!==true&&controller.active;}
 const guard=createHostAudioGuard({controller,readState:()=>{const value=state();return suspended?{...value,visible:false}:value;}});
 function ensureAudio(){
  if(audio||destroyed||suspended)return;
  if(!audioPromise){stats.audioImports++;audioPromise=Promise.resolve().then(loadAudio).then(modules=>{audioModules=modules;return modules;});audioPromise.catch(()=>{});}
  const stamp=generation,key=current().context.routeKey;
  audioPromise.then(([engine,catalog])=>{
   if(audio||!valid(stamp,key))return;
   // The catalog remains unreviewed. The owner explicitly authorized live listening,
   // which is a separate eligibility flag and still needs an intentional trusted tap.
   audio=new engine.RecordedChimes({clips:catalog.clips,qualityReviewed:catalog.qualityReviewed,ownerLiveTestAllowed:true,
    getContext,isMuted:muted,isBusy:busy,isActive:audioEligible,document:doc,events});
   controller.audio=audio;controller.audioStatus=audio.available?'Sound off':'Recording awaiting listening review';
   audio.setVolume(controller.prefs.volume);controller.notify();controls?.refresh();
  }).catch(()=>{if(valid(stamp,key)){controller.audioStatus='Sound unavailable; remains silent';controller.notify();}});
 }
 function resolveTarget(value){try{return getRenderTarget(value)||null;}catch{return null;}}
 function safeScene(){try{return readScene()||null;}catch{return null;}}
 function validMountedSpecs(specs){
  if(!Array.isArray(specs)||specs.length===0)return false;
  const ids=new Set();
  for(const spec of specs){
   if(!spec||typeof spec!=='object'||Array.isArray(spec)||typeof spec.id!=='string'||!spec.id.trim()||
    /[\u0000-\u001f\u007f]/.test(spec.id)||!Number.isInteger(spec.count)||spec.count<1||spec.count>7||ids.has(spec.id))return false;
   ids.add(spec.id);
  }
  return true;
 }
 function safeRendererState(){const {value,context}=current();return{value,context,target:value.rendererEligible===true?resolveTarget(value):null};}
 function wantsRenderer(){const {value,context,target}=safeRendererState();return!destroyed&&!suspended&&context.visible&&value.activity!=='bridge'&&value.rendererEligible===true&&target?.isConnected===true;}
 function scheduleFrame(){if(frame===null&&mounted&&controller.needsFrame&&wantsRenderer())frame=requestFrame(paint);}
 function paint(time){
  frame=null;if(destroyed||suspended||!mounted)return;
  const {context,target}=safeRendererState();
  if(context.routeKey!==mounted.key||target!==mounted.target||!wantsRenderer()){refresh();return;}
  try{controller.step(time);const painted=mounted.instance.paint?.(controller.snapshot);if(painted===false||mounted.instance.active===false){failedRoute=context.routeKey;park('renderer-inactive');return;}stats.paints++;scheduleFrame();}
  catch{failedRoute=context.routeKey;park('renderer-paint-failed');}
 }
 function ensureRenderer(){
  if(typeof loadRenderer!=='function'||!wantsRenderer())return;
  const {context,target}=safeRendererState(),key=context.routeKey,stamp=generation;
  if(failedRoute===key)return;
  if(mounted&&mounted.key===key&&mounted.target===target){try{const updated=mounted.instance.updateGeometry?.();if(updated===false||mounted.instance.active===false){failedRoute=key;park('renderer-inactive');return;}stats.geometryUpdates++;if(mounted.reduced!==controller.reduced){mounted.reduced=controller.reduced;const painted=mounted.instance.paint?.(controller.snapshot);if(painted===false||mounted.instance.active===false){failedRoute=key;park('renderer-inactive');return;}stats.paints++;}}catch{failedRoute=key;park('renderer-geometry-failed');return;}if(!controller.needsFrame)cancelOwnedFrame();scheduleFrame();return;}
  if(pendingMount?.stamp===stamp&&pendingMount.target===target)return;
  if(!rendererPromise){stats.rendererImports++;rendererPromise=Promise.resolve().then(loadRenderer);rendererPromise.catch(()=>{});}
  const pending={stamp,target};pendingMount=pending;
  rendererPromise.then(async module=>{
   if(!valid(stamp,key)||!wantsRenderer()||resolveTarget(state())!==target)return;
   if(typeof module.mount!=='function')throw Error('Verified renderer adapter required');
   const layer=doc.createElement('div');layer.dataset.chimePreparation='';layer.setAttribute('aria-hidden','true');layer.inert=true;
   layer.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden';
   let instance;
   try{instance=await module.mount({layer,context:{...context,readScene:safeScene},mode:'simulated'});}
   catch(error){layer.remove();throw error;}
   if(!valid(stamp,key)||!wantsRenderer()||resolveTarget(state())!==target){stats.staleMounts++;try{instance?.destroy?.();}catch{}layer.remove();return;}
   // Only anchors accepted by this mounted adapter may become controller rigs.
   const specs=instance?.specs;
   if(instance?.active===false||!validMountedSpecs(specs)){failedRoute=key;try{instance?.destroy?.();}catch{}layer.remove();park('renderer-inactive');return;}
   releaseMounted();controller.setScene(key,specs);mounted={key,target,layer,instance:instance||{},reduced:controller.reduced};target.append(layer);stats.mounts++;
   try{const painted=mounted.instance.paint?.(controller.snapshot);if(painted===false||mounted.instance.active===false){failedRoute=key;park('renderer-inactive');return;}stats.paints++;}catch{failedRoute=key;park('renderer-paint-failed');return;}
   scheduleFrame();
  }).catch(()=>{if(valid(stamp,key)){failedRoute=key;park('renderer-load-failed');}}).finally(()=>{if(pendingMount===pending)pendingMount=null;});
 }
 function refresh(){
  if(destroyed)return;
  const {value,context}=current(),routeChanged=previousRoute!==null&&previousRoute!==context.routeKey;
  if(routeChanged)park('host-route-change');
  if(previousSession!==null&&previousSession!==context.sessionKey){audio?.destroy();audio=null;controller.audio=null;}
  previousSession=context.sessionKey;previousRoute=context.routeKey;
  guard.refresh();
  const paused=value.paused===true;if(controller.prefs.paused!==paused){controller.prefs.paused=paused;controller.mute();controller.reset('host-pause');}
  const controlsVisible=context.sessionKey&&value.visible===true&&value.eligible===true&&value.appInert!==true&&value.activity!=='music'&&!suspended;
  if(controlsVisible&&!controls)controls=installChimeSoundControls({controller,document:doc,events,storage,getGlobalMuted});
  if(!controlsVisible&&controls){controls.destroy();controls=null;}
  controller.globalMuteChanged();controls?.refresh();
  if(!context.visible||suspended){controller.mute();releaseMounted();return;}
  ensureAudio();
  if(!wantsRenderer()){if(mounted||pendingMount)park('renderer-target-unavailable');else releaseMounted();return;}
  ensureRenderer();
 }
 function suspend(reason='host-hidden'){if(destroyed)return;suspended=true;park(reason);guard.stop(reason);controls?.destroy();controls=null;}
 function resume(){if(destroyed)return;suspended=false;refresh();}
 function destroy(){if(destroyed)return;suspend('host-destroyed');destroyed=true;controls?.destroy();controls=null;guard.destroy();controller.destroy();audio=null;}
 return{refresh,resume,suspend,destroy,controller,get snapshot(){return{phase:'V6-INTEGRATION-CANDIDATE',rendererInstalled:typeof loadRenderer==='function',rendererStatus:mounted?'v6-mounted':typeof loadRenderer==='function'?'v6-pending':'v6-unavailable',audioLoaded:!!audio,audioAvailable:audio?.available===true,generation,framesPending:frame!==null,mounted:!!mounted,stats:{...stats},destroyed};}};
}
