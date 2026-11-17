/** DOM-free state machine. API methods must be bound to captured authenticated session. */
export class BubbleController {
 constructor({render,announce=()=>{}}){this.render=render;this.announce=announce;this.generation=0;this.revision=0;this.items=[];this.noticed=new Set();}
 session(identity,api){if(identity===this.identity)return;this.identity=identity;this.api=api;this.generation++;this.items=[];this.noticed.clear();this.busy=false;this.acking=false;this.paint();}
 paint(error=''){this.render({message:this.items.find(m=>!m.muted)||null,count:this.items.filter(m=>!m.muted).length,busy:this.acking,error});}
 async refresh(){
  if(!this.identity||this.busy)return;
  this.busy=true;const generation=this.generation,revision=this.revision,api=this.api,found=[];
  try{
   let after=null;
   do {const page=await api.pending({after});if(generation!==this.generation)return;found.push(...page.messages);after=page.next;}while(after);
   if(revision!==this.revision)return;
   this.items=[...new Map(found.map(m=>[m.id,m])).values()];
   for(const m of this.items)if(!m.muted&&!this.noticed.has(m.id)){this.noticed.add(m.id);this.announce((m.private?'Private message':'Message')+' from '+m.sender.name);}
   this.paint();
  }catch{if(generation===this.generation)this.paint('Messages are reconnecting.');}
  finally{if(generation===this.generation)this.busy=false;}
 }
 async okay(){
  const m=this.items.find(m=>!m.muted);if(!m||this.acking)return;
  const generation=this.generation,api=this.api;this.acking=true;this.paint();
  try{await api.acknowledge(m.id);if(generation!==this.generation)return;this.revision++;this.items=this.items.filter(item=>item.id!==m.id);this.acking=false;this.paint();}
  catch{if(generation===this.generation){this.acking=false;this.paint('Could not save OK. Please try again.');}}
 }
}
