/** Must pass before publishing any worker referencing chat_v2 tables.
 * Run schema.sql additively first while old worker remains live. Never drop/recreate tables. */
export async function verifyChatV2Schema(db){
 const expected={chat_v2_messages:['id','scope','sender','text','image','created_at','client_id','mentions'],chat_v2_deliveries:['message_id','recipient','acknowledged_at']};
 for(const[table,columns]of Object.entries(expected)){
  const rows=(await db.prepare('PRAGMA table_info('+table+')').all()).results;if(!rows.length||columns.some(c=>!rows.some(r=>r.name===c)))throw Error('Chat v2 migration is incomplete: '+table);
  const primary=rows.filter(r=>r.pk>0).sort((a,b)=>a.pk-b.pk).map(r=>r.name).join(',');
  const required=table==='chat_v2_messages'?'id':'message_id,recipient';
  if(primary!==required)throw Error('Chat v2 primary key is incompatible: '+table);
  const shapes=table==='chat_v2_messages'?{id:['TEXT',0,null],scope:['TEXT',1,null],sender:['INTEGER',1,null],text:['TEXT',1,null],image:['TEXT',0,null],created_at:['INTEGER',1,null],client_id:['TEXT',1,null],mentions:['TEXT',1,"'[]'"]}:{message_id:['TEXT',1,null],recipient:['INTEGER',1,null],acknowledged_at:['INTEGER',0,null]};
  if(rows.length!==columns.length)throw Error('Chat v2 has unexpected columns: '+table);
  for(const row of rows){const[type,notnull,defaultValue]=shapes[row.name];if(String(row.type).toUpperCase()!==type||row.notnull!==notnull||row.dflt_value!==defaultValue)throw Error('Chat v2 column definition is incompatible: '+table+'.'+row.name);}

 }
 const indexes=(await db.prepare("PRAGMA index_list(chat_v2_messages)").all()).results;
 let idempotent=false;for(const index of indexes.filter(i=>i.unique&&i.partial===0)){if(!/^[A-Za-z0-9_]+$/.test(index.name))continue;const cols=(await db.prepare('PRAGMA index_info('+index.name+')').all()).results.map(c=>c.name);if(cols.join(',')==='sender,client_id')idempotent=true;}
 if(!idempotent)throw Error('Chat v2 sender/client idempotency constraint is missing.');
 return {ready:true};
}
