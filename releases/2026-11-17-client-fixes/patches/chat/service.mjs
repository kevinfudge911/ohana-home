/** Isolated v2 delivery service. resolveScope is the application's security boundary:
 * it must query current server membership and child policy, never trust request recipients.
 * repo.commit performs one atomic, idempotent message + recipient transaction. */
export class ChatError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,message)=>{throw new ChatError(status,message)};
export function scopeKey(scope){
 if(scope?.kind==='people'){const ids=[...new Set(scope.members||[])].sort((a,b)=>a-b);if(ids.length<2||ids.some(id=>!Number.isSafeInteger(id)||id<1))fail(400,'Choose a group.');return 'people:'+ids.join(',');}
 if(!scope||!['direct','room','game','puzzle','classic','journey'].includes(scope.kind))fail(400,'Choose a conversation.');
 if(scope.kind==='direct'){
  const ids=[...new Set(scope.members||[])].sort((a,b)=>a-b);
  if(ids.length!==2||ids.some(id=>!Number.isSafeInteger(id)||id<1))fail(400,'Choose a recipient.');
  return 'direct:'+ids.join(',');
 }
 if(!Number.isSafeInteger(scope.id)||scope.id<1)fail(400,'Choose a conversation.');
 return scope.kind+':'+scope.id;
}
export function mentionIds(text,people){
 return people.filter(p=>/(^|\s)@everybody(?=$|[\s.,!?;:])/iu.test(text)||new RegExp('(^|\\s)@'+p.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[\\s.,!?;:])','iu').test(text)).map(p=>p.id);
}
export function createChatService({repo,resolveScope,now=Date.now,uuid=()=>crypto.randomUUID(),onCreated}){
 async function authorize(actor,key){
  if(!Number.isSafeInteger(actor?.id)||actor.id<1)fail(401,'Sign in again.');
  const scope=await resolveScope(actor,key);
  if(!scope||scope.key!==key||!scope.people?.some(p=>p.id===actor.id))fail(403,'This conversation is not available.');
  return scope;
 }
 return {
  async describe(actor,key){const scope=await authorize(actor,key);return {thread:{key:scope.key,label:scope.label,people:scope.people.map(p=>({id:p.id,name:p.name,avatar:p.avatar}))}};},
  async send(actor,input){
   const key=scopeKey(input.scope),scope=await authorize(actor,key);
   if(!/^[\w-]{8,100}$/.test(input.clientId||''))fail(400,'Message identifier missing.');
   const text=String(input.text||'').trim(),image=input.image?String(input.image):null;
   if(image&&(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)||image.length>9e5))fail(400,'Choose a smaller photo.');
   if((!text&&!image)||text.length>2000)fail(400,'Write a message up to 2,000 characters.');
   // Retrying the same client ID must never reroute or alter an already delivered message.
   const prior=await repo.byClient(actor.id,input.clientId);
   if(prior){if(prior.scope!==key||prior.text!==text||(prior.image||null)!==image)fail(409,'Message identifier already used.');return {id:prior.id};}
   const people=[...new Map(scope.people.map(p=>[p.id,p])).values()];
   const message={id:uuid(),scope:key,legacyScope:key.replace(/^direct:/,'people:'),roomId:scope.roomId,memberIds:scope.people.map(p=>p.id),sender:actor.id,text,image,createdAt:now(),clientId:input.clientId,mentions:mentionIds(text,people)};
   const saved=await repo.commit(message,people.filter(p=>p.id!==actor.id).map(p=>p.id));
   if(saved.scope!==key||saved.text!==text||(saved.image||null)!==image)fail(409,'Message identifier already used.');
   if(saved.created&&onCreated)await onCreated(actor,scope,saved);
   return {id:saved.id};
  },
  async pending(actor,{after=null,limit=30}={}){
   if(!actor?.id)fail(401,'Sign in again.');
   limit=Math.max(1,Math.min(50,Number(limit)||30));
   // Repository cursor is opaque and ordered by (created_at,id), never a global read watermark.
   const page=await repo.pending(actor.id,{after,limit}),messages=[];
   const scopes=new Map(),mutes=new Map();
   for(const m of page.messages){
    if(!scopes.has(m.scope))scopes.set(m.scope,await resolveScope(actor,m.scope));
    const s=scopes.get(m.scope);
    if(!s||s.key!==m.scope||!s.people.some(p=>p.id===actor.id))continue;
    const sender=s.people.find(p=>p.id===m.sender);
    // Removed senders may retain historical attribution supplied by the repository,
    // but never use a client-provided avatar/name.
    if(!mutes.has(m.scope))mutes.set(m.scope,!!await repo.muted(actor.id,m.scope));
    messages.push({id:m.id,text:m.text,image:m.image||null,createdAt:m.createdAt,scope:m.scope,label:s.label,private:m.scope.startsWith('direct:'),sender:sender?{id:sender.id,name:sender.name,avatar:sender.avatar}:{id:m.sender,name:'Ohana',avatar:null},mentioned:m.mentions.includes(actor.id),muted:mutes.get(m.scope)});
   }
   return {messages,next:page.next};
  },
  async acknowledge(actor,id){
   if(typeof id!=='string'||id.length>100)fail(400,'Choose a message.');
   const message=await repo.forRecipient(actor.id,id);
   if(!message)fail(404,'Message not available.');
   await authorize(actor,message.scope);
   await repo.acknowledge(actor.id,id,now());
   return {ok:true};
  }
 };
}
