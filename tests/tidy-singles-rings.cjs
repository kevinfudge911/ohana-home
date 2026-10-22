const fs=require('fs'),path=require('path'),vm=require('vm'),Module=require('module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);const pre=fs.readFileSync('tests/puzzle-workstation.cjs','utf8').split('\n(async()=>{')[0]+'\nmodule.exports={c,Room,room,pieces,invoke,box,conflict,clone};';const mod=new Module(path.join(__dirname,'tidy-harness.cjs'));mod.filename=path.join(__dirname,'tidy-harness.cjs');mod.paths=module.paths;mod._compile(pre,mod.filename);const {c,room,pieces,invoke,box,conflict,clone}=mod.exports;let checks=0;const ok=(v,m)=>{assert(v,m);checks++};
(async()=>{
 // Independent ring oracle: an empty perimeter must be filled completely before
 // any target is placed farther out. All four corners belong to each ring.
 for(const [w,h,cols,rows] of [[600,400,12,8],[1400,300,28,6],[300,1400,6,28]]){
  const meta={w,h,cols,rows},P=pieces(meta),pw=w/cols,ph=h/rows,tab=Math.min(pw,ph)*.36,sx=pw+2*tab+2,sy=ph+2*tab+2,nx=Math.max(1,Math.floor(w/sx)),ny=Math.max(1,Math.floor(h/sy));
  invoke('puzzleTidyAround',meta,P,P);let previous=-1;const rings=new Map();
  function axisIndex(v,span,step,n){let best=Infinity,index;for(let i=-50;i<n+50;i++){const ideal=i<0?-2+i*step:i>=n?span+2+(i-n)*step:i*step,delta=Math.abs(v-ideal);if(delta<best){best=delta;index=i;}}assert(best<1.01,'slot aligned to perimeter lattice');return index;}
  for(const p of P){const b=box(meta,p),x=axisIndex(b[0],w,w/nx,nx),y=axisIndex(b[1],h,h/ny,ny),ring=Math.max(-x-1,x-nx,-y-1,y-ny);ok(ring>=previous,'complete inner ring precedes outer ring');previous=ring;if(!rings.has(ring))rings.set(ring,new Set());rings.get(ring).add(x+','+y);}
  for(const [r,slots] of rings){const last=r===previous;if(!last)ok(slots.size===2*nx+2*ny+4+8*r,'complete ring capacity before moving outward');for(const [x,y] of [[-r-1,-r-1],[nx+r,-r-1],[nx+r,ny+r],[-r-1,ny+r]])if(!last)ok(slots.has(x+','+y),'completed ring includes corner');}
 }
 for(const [w,h,cols,rows] of [[600,400,12,8],[1400,300,28,6],[300,1400,6,28]]){
  const meta={w,h,cols,rows},P=pieces(meta);P[0].g=P[1].g=0;P[0].x=w*.3;P[1].x=P[0].x+w/cols;P[0].y=P[1].y=h*.3;P[0].onTable=P[1].onTable=true;
  P[2].g=P[3].g=2;P[2].l=P[3].l=true;P[2].x=0;P[3].x=w/cols;P[2].y=P[3].y=0;P[4].h=2;P[4].ht=Date.now();P[5].tray=3;
  P[6].g=P[7].g=6;P[6].x=w+200;P[7].x=w+200+w/cols;P[6].y=P[7].y=200;
  const initial=clone(P),r=await room(meta,P);for(let n=0;n<2;n++){
   r.r.handle({id:1,name:'Fixture'},{t:'tidy'});for(const i of [0,1,2,3,4,5,6,7])ok(JSON.stringify(r.r.pieces[i])===JSON.stringify(initial[i]),'Tidy preserves complete protected state '+i);
   const event=r.messages.at(-1);ok(event.pieces.every(([i])=>i>=8),'broadcast contains unconnected loose singles only');ok(r.r.pieces.slice(8).every(q=>q.onTable&&q.catalogReady),'all eligible singles included');
   for(let i=8;i<P.length;i++)for(let j=0;j<i;j++)if(!r.r.pieces[j].tray)assert(!conflict(meta,r.r.pieces[i],r.r.pieces[j]),'outside overlap');checks++;
  }
  const corners=[0,0,0,0];for(const p of r.r.pieces.slice(8)){const b=box(meta,p);if(b[2]<0&&b[3]<0)corners[0]++;if(b[0]>w&&b[3]<0)corners[1]++;if(b[0]>w&&b[1]>h)corners[2]++;if(b[2]<0&&b[1]>h)corners[3]++;}ok(corners.every(n=>n>0),'all four corner quadrants used');
  const direct=clone(initial);invoke('puzzleTidyAround',clone(meta),direct,direct);ok([0,1,2,3,4,5,6,7].every(i=>JSON.stringify(direct[i])===JSON.stringify(initial[i])),'planner independently rejects every joined group');
 }
 const meta={w:600,h:400,cols:6,rows:4},P=pieces(meta,5);P[0].g=P[1].g=0;P[0].x=200;P[1].x=300;P[0].y=P[1].y=100;P[2].l=true;const before=clone(P),app=fs.readFileSync('live/'+fs.readdirSync('live').find(x=>x.endsWith('app.html')),'utf8');const client=vm.createContext({PZ:{data:{meta,pieces:P},drag:null,carry:null,strip:{lift:null}},S:{me:{id:1}},puzzleWorkspace:c.puzzleWorkspace,pzPaintStrip:()=>{}});vm.runInContext(app.slice(app.indexOf('function pzHandle('),app.indexOf('function pzStatus(')),client);client.message={t:'tidy',tabled:true,catalogReady:true,pieces:P.map(q=>[q.i,9999,9999])};vm.runInContext('pzHandle(message)',client);ok([0,1,2].every(i=>JSON.stringify(P[i])===JSON.stringify(before[i])),'actual client rejects connected/locked coordinates in incoming Tidy');ok(P[3].x===9999&&P[4].x===9999,'eligible singles reconcile');
 const result={date:new Date().toISOString(),status:'PASS',checks,scope:'actual server handler and client handler; joined unlocked interior/exterior and locked groups exact; rings include corners; no family writes'};fs.writeFileSync('artifacts/TIDY-SINGLES-RINGS-RECEIPT.json',JSON.stringify(result,null,2));console.log(result);
})().catch(e=>{console.error(e.stack);process.exitCode=1});
