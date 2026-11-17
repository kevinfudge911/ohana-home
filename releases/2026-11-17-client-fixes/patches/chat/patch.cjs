const fs=require('fs'),path=require('path');function one(s,a,b){if(s.split(a).length!==2)throw Error('Chat patch anchor mismatch: '+a.slice(0,70));return s.replace(a,b);}
function patch(s){const a=s.indexOf('/** Placement uses live control bounds'),b=s.indexOf('\n(()=>{\n const host=document.createElement',a);if(a<0||b<a)throw Error('Chat view boundary');s=one(s,s.slice(a,b),fs.readFileSync(path.join(__dirname,'view.js'),'utf8'));
s=one(s,'onOkay:()=>controller.okay(),avatarUrl:', 'onOkay:()=>controller.okay(),onReply:replyToMessage,avatarUrl:');
s=one(s,' function client(){const identity=currentIdentity();',` async function replyToMessage(request){
  const identity=currentIdentity(),message=request.message;if(!identity||identity!==session){const error=Error('Your session changed. Reopen this message.');error.status=403;throw error;}let scope;try{scope=chatReplyScope(message,S.me.id);}catch(error){error.status=403;throw error;}
  if(request.kind==='suggestions'){const key=String(message.scope);try{const info=await api('/api/chat-v2?scope='+encodeURIComponent(key));if(identity===currentIdentity()&&request.isCurrent?.()&&request.input.isConnected&&info.thread?.key===key&&typeof bindMentions==='function')bindMentions(request.input,info.thread.people);}catch{}return;}
  await api('/api/chat-v2',{action:'send',scope,text:request.text,clientId:request.clientId});if(identity!==currentIdentity())throw Error('Session changed.');
 }
 function client(){const identity=currentIdentity();`);
s=one(s,"n.className='pp-player'+(p.active?' active':'');","n.className='pp-player'+(p.active?' active':'');if(Number.isSafeInteger(Number(p.memberId))&&Number(p.memberId)>0)n.dataset.chatMemberId=String(p.memberId);");
return s;}
module.exports={patch};if(require.main===module)fs.writeFileSync(process.argv[3],patch(fs.readFileSync(process.argv[2],'utf8')));
