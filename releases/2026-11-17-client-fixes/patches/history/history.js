 function privateHistory({pair,identity,currentIdentity,api,changed}){
  const ids=pair.slice().sort((a,b)=>a-b),key='people:'+ids.join(','),rows=new Map();let alive=true,request=0,loading=false,more=false,cursor=null,lastError='',pageDepth=1;
  const current=stamp=>alive&&identity===currentIdentity()&&stamp===request;
  function validate(thread){return thread?.key===key&&Array.isArray(thread.people)&&thread.people.length===2&&thread.people.map(p=>Number(p.id)).sort((a,b)=>a-b).every((id,i)=>id===ids[i]);}
  function emit(){if(alive&&identity===currentIdentity())changed({messages:[...rows.values()].sort((a,b)=>a.id-b.id),more,loading,error:lastError});}
  async function load(older=false){if(!alive||loading||identity!==currentIdentity())return;if(older&&(!more||!cursor))return;const stamp=++request;loading=true;lastError='';emit();try{
   if(!older){const catalog=await api('/api/chat');if(!current(stamp))return;const found=(catalog.conversations||[]).find(t=>t.key===key);if(!found){rows.clear();more=false;cursor=null;pageDepth=1;return;}if(!validate(found))throw Error('Conversation identity mismatch.');}
   // Refresh the same number of pages the person already loaded; replace atomically.
   // Never retain a row merely because it appeared in an earlier authorized response.
   const next=older?new Map(rows):new Map();let before=older?cursor:null,nextMore=false,pages=0;
   for(let n=0;n<(older?1:pageDepth);n++){
    const data=await api('/api/chat?conversation='+encodeURIComponent(key)+(before?'&before='+before:''));if(!current(stamp))return;if(!validate(data.thread)||!Array.isArray(data.messages))throw Error('Conversation identity mismatch.');
    const incoming=data.messages.map(m=>{if(!Number.isSafeInteger(m.id)||m.id<1||!ids.includes(Number(m.sender))||before&&m.id>=before)throw Error('Invalid conversation page.');return {...m,senderName:data.thread.people.find(p=>Number(p.id)===Number(m.sender))?.name||'Ohana'};});
    for(const m of incoming)next.set(m.id,m);pages++;nextMore=!!data.more&&incoming.length>0;if(incoming.length)before=Math.min(...incoming.map(m=>m.id));if(!nextMore)break;
   }
   rows.clear();for(const [id,m]of next)rows.set(id,m);more=nextMore;cursor=rows.size?Math.min(...rows.keys()):null;pageDepth=older?pageDepth+pages:Math.max(1,pages);
  }catch(e){if(current(stamp)){if(e?.status===403||e?.status===401||/identity|Invalid conversation/.test(e.message)){rows.clear();more=false;cursor=null;pageDepth=1;}lastError='Could not load this chat. Try again.';emit();return;}}finally{if(current(stamp)){loading=false;emit();}}
  }
  return {load,destroy(){alive=false;request++;rows.clear();}};
 }
