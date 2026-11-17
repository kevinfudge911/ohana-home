import {verifyChatV2Schema} from './patches/chat/schema-preflight.mjs';
// Only schema PRAGMAs are available to the read-only verifier. No user rows are read.
export function schemaGate({settings,account,token,migration,fetcher=fetch}){
 const matches=(settings.bindings||[]).filter(b=>b.name==='DB'&&b.type==='d1');
 if(matches.length!==1)throw Error('Expected unique existing DB binding');
 const id=matches[0].id||matches[0].database_id;if(!/^[0-9a-f-]{36}$/i.test(id||''))throw Error('Invalid existing DB binding');
 const endpoint=`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${id}/query`;
 const query=async sql=>{const r=await fetcher(endpoint,{method:'POST',headers:{Authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({sql})});if(!r.ok)throw Error('Schema request failed; details suppressed');const j=await r.json();if(!j.success||!Array.isArray(j.result)||!j.result.length||j.result.some(x=>!x.success))throw Error('Schema request failed; details suppressed');return j.result;};
 const db={prepare(sql){if(!/^PRAGMA (?:table_info|index_list|index_info)\([A-Za-z0-9_]+\)$/.test(sql))throw Error('Non-schema read rejected');return{all:async()=>({results:(await query(sql))[0].results})}}};
 const inspect=async()=>{const tables=await Promise.all(['chat_v2_messages','chat_v2_deliveries'].map(t=>db.prepare(`PRAGMA table_info(${t})`).all()));if(tables.every(x=>x.results.length===0))return'absent';if(tables.some(x=>x.results.length===0))throw Error('Partial chat schema requires review');await verifyChatV2Schema(db);return'ready';};
 return{inspect,async migrate(){if(await inspect()!=='absent')throw Error('Migration requires absent planned tables');await query(migration);if(await inspect()!=='ready')throw Error('Chat schema not ready');return true;}};
}
