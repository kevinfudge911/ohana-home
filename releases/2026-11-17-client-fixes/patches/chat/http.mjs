import {ChatError} from './service.mjs';
/** Called only AFTER existing worker authentication. Never obtains identity from body. */
export async function handleChatV2({request,actor,service}){
 const url=new URL(request.url);if(url.pathname!=='/api/chat-v2')return null;
 const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 try{
  if(!Number.isSafeInteger(actor?.id)||actor.id<1)throw new ChatError(401,'Sign in again.');
  if(request.method==='GET'&&url.searchParams.has('scope'))return json(await service.describe(actor,url.searchParams.get('scope')));
  if(request.method==='GET')return json(await service.pending(actor,{after:url.searchParams.get('after'),limit:30}));
  if(request.method!=='POST')return json({error:'Method not supported.'},405);
  const bodyText=await request.text();if(bodyText.length>910000)return json({error:'Message too large.'},413);
  let body;try{body=JSON.parse(bodyText);}catch{return json({error:'Invalid message.'},400);}
  if(body.action==='ack')return json(await service.acknowledge(actor,body.id));
  if(body.action!=='send')return json({error:'Choose an action.'},400);
  return json(await service.send(actor,body));
 }catch(e){return json({error:e instanceof ChatError?e.message:'Messages are temporarily unavailable.'},e instanceof ChatError?e.status:503);}
}
