const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),file='live/'+fs.readdirSync(root+'/live').find(f=>f.endsWith('-app.html')),app=fs.readFileSync(path.join(root,file),'utf8');
let checks=0;const ok=(v,m)=>{assert(v,m);checks++};
const block=(s,a,b)=>s.slice(s.indexOf(a),s.indexOf(b,s.indexOf(a))).replace(/\r\n/g,'\n');
const baseline=cp.execFileSync(process.env.OHANA_TEST_GIT||'git',['show','7625f38c:'+file],{cwd:root,maxBuffer:20e6}).toString();
for(const [a,b] of [['function pzSnugTrayHeight(','function pzPaintStrip('],['function pzResize(','function pzPaintPeople(']])ok(block(app,a,b)===block(baseline,a,b),'accepted tray height/resize remains byte-identical: '+a);
const strip=s=>block(s,'function pzBindStrip(','function pzRaise(');
for(const [a,b] of [['if(pinch&&ptrs.size>=2){','if(!st||st.returning)'],["cv.addEventListener('wheel',",'\n}']])ok(block(strip(app),a,b)===block(strip(baseline),a,b),'accepted tray zoom handler remains byte-identical: '+a);

// Equal 50x30 puzzle-coordinate bodies; only the surrounding tabs vary.
function sprite(id){
 const width=140,height=100,data=new Uint8ClampedArray(width*height*4),v=id%4;
 const x0=[20,8,4,16][v],x1=[120,132,136,124][v],y0=[20,10,2,8][v],y1=[80,86,98,92][v];
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)data[(y*width+x)*4+3]=255;
 return {id,width,height,getContext:()=>({getImageData:()=>({data})})};
}
function realm(pieces,list,dpr,zoom,width,height,stage){
 const sprites=pieces.map(q=>sprite(q.i)),draws=[],PZ={geo:{pw:50,ph:30,off:10},data:{pieces},sprites,strip:{},trayZoom:zoom,dpr,trayHidden:false};let canvas;
 const paint={setTransform(){},clearRect(){draws.length=0},fillRect(){},fillText(){},drawImage(sprite,x,y,w,h){draws.push({sprite,x,y,w,h})}};
 const c=vm.createContext({PZ,innerWidth:width,innerHeight:height,pzStripCell:()=>76*zoom,pzSprite:i=>sprites[i],pzStripPieces:()=>list,pzTrayHex:()=> '#986b43',pzBoardHex:()=> '#986b43',$:()=>canvas});
 vm.runInContext(app.slice(app.indexOf('const PZ_STRIP_ALPHA='),app.indexOf('function pzCanvasPoint(',app.indexOf('const PZ_STRIP_ALPHA='))),c);
 const cssH=c.pzSnugTrayHeight(stage);canvas={width:width*dpr,height:Math.round(cssH*dpr),getBoundingClientRect:()=>({left:0,top:0,width,height:cssH}),getContext:()=>paint};
 vm.runInContext(app.slice(app.indexOf('function pzCanvasPoint('),app.indexOf('function pzBoardPoint(')),c);c.pzPaintStrip();return {c,PZ,canvas,cssH,draws};
}
const cases=[],previous=new Map();
for(const dpr of [1,2])for(const zoom of [1,1.5,2.2])for(const [width,height,stage] of [[390,844,557],[768,1024,737],[1280,720,433],[844,390,170]]){
 const pieces=Array.from({length:122},(_,i)=>({i,g:i===2?1:i,x:i===2?50:0,y:0})),list=pieces.filter(q=>q.i!==2);
 const {c,PZ,canvas,cssH,draws}=realm(pieces,list,dpr,zoom,width,height,stage),plans=PZ.strip.renderPlans,common=plans[0].scale,bodies=plans.map(p=>PZ.geo.pw*p.scale/dpr);
 ok(plans.length===121&&plans[1].members.length===2,'joined group remains one complete entry');
 ok(new Set(plans.map(p=>p.b.y1-p.b.y0)).size>1,'fixture has different alpha heights');
 ok(Math.max(...bodies)-Math.min(...bodies)<1e-10,'same-size bodies measure equally despite their tabs');
 for(const plan of plans){
  ok(plan.scale===common,'all entries share one puzzle-coordinate scale');
  ok(plan.width===Math.ceil((plan.b.x1-plan.b.x0)*common+4*dpr),'variable hit width follows scaled alpha bounds');
  ok(plan.top>=2*dpr-.001&&plan.top+plan.height<=canvas.height-2*dpr+.001,'painted entry fits accepted tray height');
  ok(Math.abs(plan.top-(canvas.height-plan.height)/2)<=.51,'shorter natural shapes are centered');
  for(const m of plan.members){const a=c.pzStripOpaqueBounds(m.sprite),top=plan.top+(m.y-plan.b.y0+a.y0*plan.sh/m.sprite.height)*common,bottom=plan.top+(m.y-plan.b.y0+a.y1*plan.sh/m.sprite.height)*common;ok(top>=2*dpr-.001&&bottom<=canvas.height-2*dpr+.001,'no alpha clipping');}
 }
 ok(Math.abs(Math.max(...plans.map(p=>p.height))-(canvas.height-4*dpr))<=1,'tallest entry retains snug two-pixel padding');
 for(const draw of draws){ok(Math.abs(draw.w/(PZ.geo.pw+2*PZ.geo.off)-common)<1e-10,'actual horizontal draw uses common scale');ok(Math.abs(draw.h/(PZ.geo.ph+2*PZ.geo.off)-common)<1e-10,'actual vertical draw uses same scale without stretching');}
 const reached=[];for(const plan of plans){PZ.strip.scroll=plan.start;const q=c.pzStripAt(Math.min(plan.width/2,canvas.width/2)/dpr,cssH/2);ok(q?.i===plan.pc.i,'horizontal scrolling reaches correct variable-width identity');reached.push(...plan.members.map(m=>m.q.i));}
 ok(new Set(reached).size===122,'all unique piece IDs remain reachable');
 const key=[dpr,width,height].join(':');if(previous.has(key)&&height>500)ok(common>previous.get(key),'zoom enlarges tray and all pieces together');previous.set(key,common);
 cases.push({dpr,zoom,width,height,trayHeight:cssH,commonScale:common,bodyWidthCSS:bodies[0],entries:plans.length,uniqueIds:122});
}
// Vertical groups obey the same fit cap as singles, never a private scale.
const vertical=[{i:0,g:0,x:0,y:0},{i:1,g:1,x:0,y:0},{i:2,g:1,x:0,y:30}],v=realm(vertical,[vertical[0],vertical[1]],2,2.2,390,844,557);
ok(v.PZ.strip.renderPlans[0].scale===v.PZ.strip.renderPlans[1].scale,'vertical group and single share the common fit cap');
ok(v.PZ.strip.renderPlans[1].members[1].q.y===30,'preview never changes joined offsets');
const result={date:new Date().toISOString(),status:'PASS',checks,cases,verticalGroupCommonScale:true};
fs.writeFileSync(root+'/artifacts/PUZZLE-COMMON-SCALE-RECEIPT.json',JSON.stringify(result,null,2));console.log({status:'PASS',checks,cases:cases.length,coverage:'heterogeneous alpha/body equality, actual aspect, IDs/hits, unchanged height/zoom, horizontal and vertical groups'});
