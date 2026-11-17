import {momoAllowed} from '../momo/server.mjs';
import {createChatService} from './service.mjs';
import {createD1Repository} from './d1-repository.mjs';
import {createScopeResolver} from './authorization.mjs';
import {handleChatV2} from './http.mjs';
function services(env,childPolicy,legacyCatalog,notifyMembers){const repo=createD1Repository(env.DB),resolveScope=createScopeResolver({db:env.DB,puzzleNamespace:env.PUZZLE,childPolicy,momoAllowed,env,legacyCatalog});return{repo,resolveScope,service:createChatService({repo,resolveScope,onCreated:notifyMembers?async(actor,scope,message)=>{const recipients=[];for(const p of scope.people)if(p.id!==actor.id&&!await repo.muted(p.id,message.scope))recipients.push(p.id);env.ctx?.waitUntil?.(notifyMembers(env.DB,recipients,{type:'chat',title:actor.name||'Ohana',body:message.text||'Shared a photo',conversation:message.legacyScope||message.scope.replace(/^direct:/,'people:'),roomId:scope.roomId,tag:'ohana-conversation-'+message.scope}).catch(()=>{}));}:null})};}
export async function chatV2Route(request,env,actor,childPolicy,legacyCatalog,notifyMembers){return handleChatV2({request,actor,service:services(env,childPolicy,legacyCatalog,notifyMembers).service});}
export async function extendChatV2Catalog(env,actor,catalog,childPolicy,legacyCatalog){
 const {resolveScope}=services(env,childPolicy,legacyCatalog);
 const rows=(await env.DB.prepare('SELECT DISTINCT m.scope FROM chat_v2_messages m LEFT JOIN chat_v2_deliveries d ON d.message_id=m.id WHERE m.sender=? OR d.recipient=?').bind(actor.id,actor.id).all()).results;
 for(const {scope} of rows){if(!/^(direct|game|puzzle|classic|journey):/.test(scope))continue;const s=await resolveScope(actor,scope),key=scope.replace(/^direct:/,'people:');if(s&&!catalog.threads.has(key))catalog.threads.set(key,{key,kind:scope.startsWith('direct:')?'person':'group',name:scope.startsWith('direct:')?s.people.filter(p=>p.id!==actor.id).map(p=>p.name).join(', '):s.label,people:s.people,roomId:s.roomId||null,games:[],v2:true});}
}
export async function chatV2LegacySend(request,env,actor,body,thread,childPolicy,legacyCatalog,notifyMembers){
 let scope;
 if(thread.key.startsWith('people:')){const members=thread.key.slice(7).split(',').map(Number);scope={kind:members.length===2?'direct':'people',members};}
 else {const[kind,id]=thread.key.split(':');scope={kind,id:Number(id)};}
 const outgoing=new Request(new URL('/api/chat-v2',request.url),{method:'POST',headers:request.headers,body:JSON.stringify({...body,action:'send',scope})});
 return chatV2Route(outgoing,env,actor,childPolicy,legacyCatalog,notifyMembers);
}
