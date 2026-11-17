(()=>{
 const host=document.createElement('div');host.id='ohana-chat-v2-host';document.body.append(host);
 let session='',composer=null;
 const view=mountBubbleView({document,host,onOkay:()=>controller.okay(),avatarUrl:avatar=>{const value=typeof CHARACTERS!=='undefined'?CHARACTERS[avatar]?.file:null;return typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')?value:null;}});
 const controller=new BubbleController({render:state=>view.render(state),announce:text=>{if(typeof accessibleAnnounce==='function')accessibleAnnounce(text);}});
 function currentIdentity(){return S.me?.id&&S.token?S.me.id+':'+S.token:'';}
 function client(){const identity=currentIdentity();return {pending:async({after}={})=>{if(identity!==currentIdentity())throw Error();return api('/api/chat-v2'+(after?'?after='+encodeURIComponent(after):''));},acknowledge:async id=>{if(identity!==currentIdentity())throw Error();return api('/api/chat-v2',{action:'ack',id});}};}
 function refresh(){const identity=currentIdentity();if(identity!==session){session=identity;composer?.remove();composer=null;controller.session(identity,client());}if(identity&&!document.hidden)void controller.refresh();}
 async function compose(scope,label){
  if(!currentIdentity())return;composer?.remove();const identity=currentIdentity(),d=document.createElement('dialog');composer=d;d.setAttribute('aria-label',label);d.style.cssText='width:min(440px,calc(100vw - 24px));background:#fff6df;color:#173c40;padding:20px;border:2px solid #39767b;border-radius:20px';
  const title=document.createElement('h2');title.textContent=label;const input=document.createElement('textarea');input.maxLength=2000;input.rows=5;input.style.cssText='width:100%;box-sizing:border-box;font:18px system-ui';input.setAttribute('aria-label','Message');const hint=document.createElement('p');hint.textContent=scope.kind==='direct'?'Only you and this person can read this message.':'Everyone in this group can read this message. @name gets their attention, not a private message.';
  const inputWrap=document.createElement('div');inputWrap.append(input);const status=document.createElement('p');status.setAttribute('role','status');const send=document.createElement('button'),close=document.createElement('button');send.textContent='Send';close.textContent='Cancel';for(const b of [send,close]){b.type='button';b.style.cssText='min-height:44px;min-width:70px;font:18px system-ui;margin-right:10px';}let pending=null;
  send.onclick=async()=>{const text=input.value.trim();if(!text)return;if(identity!==currentIdentity()){d.remove();return;}send.disabled=true;pending=pending?.text===text?pending:{text,id:crypto.randomUUID()};try{await api('/api/chat-v2',{action:'send',scope,text,clientId:pending.id});if(identity===currentIdentity()&&d.isConnected){d.close();d.remove();}}catch{if(d.isConnected)status.textContent='Could not send. Your message is still here; try again.';}finally{if(d.isConnected)send.disabled=false;}};
  close.onclick=()=>{d.close();d.remove();};d.append(title,hint,inputWrap,status,send,close);if(scope.kind==='direct'){const profile=document.createElement('button');profile.type='button';profile.textContent='View profile';profile.style.minHeight='44px';profile.onclick=()=>{d.close();d.remove();openMemberProfile(scope.members.find(id=>id!==S.me.id));};d.append(profile);}d.addEventListener('close',()=>{if(composer===d)composer=null;d.remove();});document.body.append(d);d.showModal();input.focus();
  const key=scope.kind==='direct'?'direct:'+scope.members.slice().sort((a,b)=>a-b).join(','):scope.kind+':'+scope.id;
  try{const info=await api('/api/chat-v2?scope='+encodeURIComponent(key));if(identity===currentIdentity()&&d.isConnected&&info.thread&&typeof bindMentions==='function')bindMentions(input,info.thread.people);}catch{if(identity===currentIdentity()&&d.isConnected)status.textContent='Could not load name suggestions. You can still type your message.';}
 }
 // Patched workstation data-dm handlers invoke openMemberDM; other profiles remain unchanged.
 // Retain those targets/keyboard behavior, replace only their message destination.
 openMemberDM=async id=>{id=Number(id);if(Number.isSafeInteger(id)&&id>0&&id!==S.me?.id){const p=S.sync?.members?.find(p=>p.id===id);await compose({kind:'direct',members:[S.me.id,id]},'Private message to '+(p?.name||'this person'));}};
 openGameSay=()=>typeof PZ!=='undefined'&&PZ.id?compose({kind:'puzzle',id:Number(PZ.id)},'Puzzle message'):document.getElementById('pp-frame')&&window.__ppHost?.snapshot()?.mode==='classic'?compose({kind:'classic',id:1},'MOMopoly Classic message'):document.getElementById('pp-frame')&&window.__ppHost?.snapshot()?.mode==='family'?compose({kind:'journey',id:1},'MOMopoly family message'):S.game?compose({kind:'game',id:Number(S.game)},'Game message'):compose({kind:'room',id:Number(S.room)},'Room message');
 function mountActions(){
  const identity=currentIdentity();const dock=document.querySelector('#pz-workstation,#game-controls-dock,.ohana-workstation')||document.querySelector('#pp-frame');
  let action=document.getElementById('ohana-chat-v2-compose');
  if(!identity||!dock){action?.remove();}else if(!action||action.parentElement!==dock){action?.remove();action=document.createElement('button');action.id='ohana-chat-v2-compose';action.type='button';action.textContent='Message';action.setAttribute('aria-label','Message this game or room');action.style.cssText='min-height:44px;min-width:70px;font:700 16px system-ui';action.onclick=()=>openGameSay();dock.append(action);}
  const top=[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;
  if(host.parentElement!==top)top.append(host);
 }
 new MutationObserver(()=>{if(currentIdentity()!==session)refresh();mountActions();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
 mountActions();
 const originalRender=render;render=function(...args){if(currentIdentity()!==session)refresh();return originalRender.apply(this,args);};
 window.OhanaChatV2={compose,refresh};
 setInterval(refresh,3000);document.addEventListener('visibilitychange',refresh);refresh();
})();
