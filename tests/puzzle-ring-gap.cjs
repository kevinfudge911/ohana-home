const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),Module=require('node:module'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);
const prefix=fs.readFileSync('tests/puzzle-workstation.cjs','utf8').split('\n(async()=>{')[0]+'\nmodule.exports={room,pieces,box,clone,conflict};';
const mod=new Module(path.join(__dirname,'ring-gap-harness.cjs'));mod.filename=path.join(__dirname,'ring-gap-harness.cjs');mod.paths=module.paths;mod._compile(prefix,mod.filename);
const {room,pieces,box,clone,conflict}=mod.exports;let checks=0;const ok=(v,m)=>{assert(v,m);checks++};
(async()=>{
 const cases=[];
 for(const [w,h,cols,rows] of [[1200,800,39,26],[1400,2800/3,39,26],[800,1200,26,39]]){
  // Screenshot-proportioned 1,014-piece puzzle with 320 placed pieces. Add
  // a protected joined pair, active hold and sorting-tray piece to the fixture.
  const meta={w,h,cols,rows},pw=w/cols,ph=h/rows,tab=Math.min(pw,ph)*.36;
  const P=pieces(meta);for(let i=0;i<320;i++){P[i].l=true;P[i].x=P[i].c*pw;P[i].y=P[i].r*ph;}
  P[320].g=P[321].g=320;P[320].x=305.25;P[320].y=330.125;P[321].x=305.25+pw;P[321].y=330.125;
  P[322].h=2;P[322].ht=Date.now();P[323].tray=7;
  const fixed=clone(P.slice(0,324)),r=await room(meta,P),stats=JSON.stringify(r.r.stats);
  r.r.handle({id:1,name:'Synthetic fixture'},{t:'tidy'});
  ok(JSON.stringify(r.r.pieces.slice(0,324))===JSON.stringify(fixed),'placed/joined/held/trayed pieces retain exact complete state');
  ok(JSON.stringify(r.r.stats)===stats,'Tidy never changes progress/scoring');
  ok(r.r.pieces.length===1014&&r.r.pieces.every((q,i)=>q.i===i),'all 1,014 IDs remain intact');
  const event=r.messages.at(-1);ok(event.pieces.length===690&&event.pieces.every(([i])=>i>=324),'only all eligible unconnected singles move');
  const bounds=r.r.pieces.slice(324).map(q=>box(meta,q));
  const nx=Math.max(1,Math.floor(w/(pw+2*tab+2))),ny=Math.max(1,Math.floor(h/(ph+2*tab+2))),pitchX=w/nx,pitchY=h/ny;
  const sides=[];
  for(const [name,axis,span,pitch,n] of [['left',0,h,pitchY,ny],['right',0,h,pitchY,ny],['top',1,w,pitchX,nx],['bottom',1,w,pitchX,nx]]){
   // Discover the nearest occupied side from the output, not from the
   // implementation's lattice formula. The old layout must expose its gap.
   const candidates=bounds.filter(b=>name==='left'?b[2]<0:name==='right'?b[0]>w:name==='top'?b[3]<0:b[1]>h);
   const anchor=(name==='left'||name==='top'?Math.max:Math.min)(...candidates.map(b=>b[axis]));
   const cross=1-axis,points=bounds.filter(b=>Math.abs(b[axis]-anchor)<1.01).map(b=>b[cross]).filter(v=>v>=-pitch-3&&v<=span+3).sort((a,b)=>a-b);
   ok(points.length===n+2,name+' inner ring includes every slot and both corners');
   const gaps=points.slice(1).map((v,i)=>v-points[i]);
   for(const delta of gaps){ok(delta>=pitch-1.01,name+' spacing does not bunch cells');ok(delta<=pitch+3.01,name+' has no accumulated leftover seam / missing row');}
   sides.push({name,slotCount:points.length,normalPitch:pitch,minGap:Math.min(...gaps),maxGap:Math.max(...gaps),lastAnchors:points.slice(-4)});
  }
  for(let i=324;i<P.length;i++)for(let j=0;j<i;j++)if(!r.r.pieces[j].tray&&r.r.pieces[j].g!==r.r.pieces[i].g)assert(!conflict(meta,r.r.pieces[i],r.r.pieces[j]),'no exterior collisions');checks++;
  cases.push({w,h,cols,rows,total:1014,placed:320,movedSingles:690,sides});
 }
 const result={status:'PASS',checks,cases};fs.writeFileSync('artifacts/PUZZLE-RING-GAP-RECEIPT.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e.stack);process.exitCode=1});
