function apply(worker){
 const start=worker.indexOf('if(m.t==="chat"){const text=String(m.text||"")'),end=worker.indexOf('if(m.t==="ping")',start);if(start<0||end<0)throw Error('Puzzle chat anchor drift');
 const body=`if(m.t==="chat"){const text=String(m.text||"").trim().slice(0,240);if(!text||!this.meta?.puzzleId)return null;const local=this;const env={...this.env,ctx:this.ctx,PUZZLE:{idFromName:name=>name,get:id=>({fetch:async()=>Response.json(local.summary())})}};const response=await chatV2Route(new Request("https://puzzle/api/chat-v2",{method:"POST",body:JSON.stringify({action:"send",scope:{kind:"puzzle",id:Number(this.meta.puzzleId)},text,clientId:typeof m.clientId==="string"?m.clientId:crypto.randomUUID()})}),env,me,childPolicy,chatCatalog,notifyMembers);const result=await response.json();return response.ok?{t:"chat-sent",messageId:result.id}:{t:"error",error:result.error||"Message not sent"};}`;
 worker=worker.slice(0,start)+body+worker.slice(end);
 const old='handle(me,m,ws){const P=this.pieces;';if(worker.split(old).length!==2)throw Error('Puzzle handler drift');worker=worker.replace(old,'async handle(me,m,ws){const P=this.pieces;');
 for(const old of ['const r=this.handle(me,a,null);','const r=this.handle(me,m,ws);']){if(worker.split(old).length!==2)throw Error('Puzzle caller drift');worker=worker.replace(old,old.replace('=this.handle','=await this.handle'));}
 return worker;
}module.exports={apply};
