 async function compose(scope,label){
  const identity=currentIdentity();if(!identity||identity!==session)return;composer?.remove();document.querySelector('#ohana-chat-dialog[open]')?.close();
  const target=JSON.parse(JSON.stringify(scope)),actor=Number(S.me.id);let key;
  if(target.kind==='direct'){const members=target.members;if(!Array.isArray(members)||members.length!==2||new Set(members).size!==2||!members.includes(actor)||members.some(n=>!Number.isSafeInteger(n)||n<1))return;key='direct:'+members.slice().sort((a,b)=>a-b).join(',');}
  else if(['room','game','puzzle','classic','journey'].includes(target.kind)&&Number.isSafeInteger(target.id)&&target.id>0)key=target.kind+':'+target.id;else return;
  const launcher=document.activeElement,panel=document.createElement('div');panel.id='ohana-chat-compose-host';document.body.append(panel);host.hidden=true;let alive=true,editor,delivered=false;
  const handle={remove(){if(!alive)return;if(identity===currentIdentity()&&!delivered&&editor)composeDrafts.set(key,editor.draft());alive=false;editor?.destroy();panel.remove();host.hidden=false;if(composer===handle)composer=null;if(identity===currentIdentity()&&launcher?.isConnected)launcher.focus?.({preventScroll:true});}};composer=handle;
  const mode={label:target.kind==='direct'?label:'Group · '+label+' #'+target.id,private:target.kind==='direct',cancel:()=>handle.remove(),sent:()=>{delivered=true;composeDrafts.delete(key);handle.remove();if(typeof accessibleAnnounce==='function')accessibleAnnounce('Message sent.');}};
  editor=mountBubbleView({document,host:panel,composeMode:mode,onOkay:()=>{},avatarUrl:avatar=>{const value=typeof CHARACTERS!=='undefined'?CHARACTERS[avatar]?.file:null;return typeof value==='string'&&value.startsWith('/')&&!value.startsWith('//')?value:null;},onReply:async request=>{
   if(!alive||identity!==currentIdentity()||identity!==session){const error=Error('Your session changed. Reopen the message.');error.status=403;throw error;}
   if(request.kind==='suggestions'){try{const info=await api('/api/chat-v2?scope='+encodeURIComponent(key));if(alive&&identity===currentIdentity()&&request.isCurrent?.()&&request.input.isConnected&&info.thread?.key===key&&typeof bindMentions==='function')bindMentions(request.input,info.thread.people);}catch{}return;}
   await api('/api/chat-v2',{action:'send',scope:target,text:request.text,clientId:request.clientId});if(!alive||identity!==currentIdentity())throw Error('Session changed.');
  }});
  editor.render({message:{id:'compose:'+crypto.randomUUID(),scope:key,private:target.kind==='direct',label,sender:{id:actor,name:S.me.name||'You',avatar:S.me.avatar},text:''},count:1,busy:false});editor.startCompose(composeDrafts.get(key));
 }
