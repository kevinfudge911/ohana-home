/** Authenticated parent owns this channel; only booleans cross, never credentials.
 * Opaque iframe requires targetOrigin '*' only for port transfer to its exact window.
 * Initial ready validates source, opaque origin, unpredictable channel nonce. */
export const blockedHostState=()=>({masterMuted:true,busy:true,visible:false,reduced:true,paused:true});
export function parentHostChannel({root,frame,nonce,readState=blockedHostState,isCurrent=()=>false,intervalMs=200}){
 let port=null,timer=null,sequence=0,closed=false;
 const safe=()=>{try{const s=readState();if(!isCurrent()||!s||!['masterMuted','busy','visible','reduced','paused'].every(k=>typeof s[k]==='boolean'))return blockedHostState();const out=Object.fromEntries(['masterMuted','busy','visible','reduced','paused'].map(k=>[k,s[k]]));/* Which illustrated viewpoint the Bridge chose; a fixed word, never free text. */if(s.view==='inside'||s.view==='outside')out.view=s.view;return out}catch{return blockedHostState()}};
 const send=()=>{if(closed||!port)return;port.postMessage({type:'ohana-private-host-state',sequence:++sequence,state:safe()})};
 function ready(e){if(closed||port||e.source!==frame.contentWindow||e.origin!=='null'||e.data?.type!=='ohana-private-ready'||e.data?.nonce!==nonce||!isCurrent())return;
  const channel=new root.MessageChannel();port=channel.port1;
  frame.contentWindow.postMessage({type:'ohana-private-port',nonce},'*',[channel.port2]);send();timer=root.setInterval(send,intervalMs);
 }
 root.addEventListener('message',ready);
 return {refresh:send,dispose(){if(closed)return;if(port)port.postMessage({type:'ohana-private-host-state',sequence:++sequence,state:blockedHostState()});closed=true;root.removeEventListener('message',ready);if(timer!==null)root.clearInterval(timer);port?.close();port=null}};
}
/** Self-contained function serialized into private runtime; no module captures. */
export function childHostChannel(api,{root,parentOrigin,nonce,onState=()=>{}}){
 let port=null,last=0,sequence=-1,closed=false;const applied={};
 const apply=state=>{let changed=false;for(const [key,method] of [['masterMuted','setMasterMuted'],['busy','setBusy'],['visible','setVisible'],['reduced','setReduced'],['paused','setPaused']]){if(Object.hasOwn(state,key)&&applied[key]!==state[key]){applied[key]=state[key];api[method](state[key]);changed=true}}if((state.view==='inside'||state.view==='outside')&&applied.view!==state.view){applied.view=state.view;changed=true}if(changed)onState({...applied})};
 const block=()=>apply({masterMuted:true,busy:true,visible:false,reduced:true,paused:true});
 block();
 function message(e){if(closed||port||e.source!==root.parent||e.origin!==parentOrigin||e.data?.type!=='ohana-private-port'||e.data?.nonce!==nonce||e.ports?.length!==1)return;
  port=e.ports[0];port.onmessage=({data})=>{if(closed||data?.type!=='ohana-private-host-state'||!Number.isSafeInteger(data.sequence)||data.sequence<=sequence)return;
   const s=data.state;if(!s||!['masterMuted','busy','visible','reduced','paused'].every(k=>typeof s[k]==='boolean')){block();return}
   sequence=data.sequence;last=Date.now();apply(s);
  };port.start?.();
 }
 root.addEventListener('message',message);root.parent.postMessage({type:'ohana-private-ready',nonce},parentOrigin);
 const watch=root.setInterval(()=>{if(!last||Date.now()-last>1000)block()},250);
 function dispose(){if(closed)return;closed=true;block();root.clearInterval(watch);root.removeEventListener('message',message);port?.close();port=null}
 root.addEventListener('pagehide',dispose,{once:true});return{dispose};
}
