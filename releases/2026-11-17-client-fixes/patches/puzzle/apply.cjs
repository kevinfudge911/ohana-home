const fs=require('node:fs'),crypto=require('node:crypto');
const expected='1a3d7f2b7021a00accd524d102d315ac4066d92cdf8311d65bd4feb5b4155521';
function patch(s){if(crypto.createHash('sha256').update(s).digest('hex')!==expected)throw Error('Baseline mismatch');const replace=(a,b)=>{if(s.split(a).length!==2)throw Error('Anchor mismatch: '+a.slice(0,80));s=s.replace(a,b)};
const start=s.indexOf('function pzFitView(picture){'),end=s.indexOf('function pzClampView(){',start);
replace(s.slice(start,end),`// Camera only: opening and Picture fit the puzzle, not distant loose pieces.
function pzFitView(picture){
 const cv=$('#pz-canvas'),d=PZ.data;if(!cv||!d||!PZ.geo||cv.width<=0||cv.height<=0)return;
 const b=picture?{x0:0,y0:0,x1:d.meta.w,y1:d.meta.h}:pzTableBounds(d.meta.table,d.pieces,PZ.geo.pw,PZ.geo.ph);
 const bw=b.x1-b.x0,bh=b.y1-b.y0;if(!(bw>0&&bh>0))return;
 const pad=picture?Math.min(10*(PZ.dpr||1),cv.width*.04,cv.height*.04):0;
 PZ.view.s=Math.min((cv.width-2*pad)/bw,(cv.height-2*pad)/bh);
 PZ.view.x=(cv.width-bw*PZ.view.s)/2-b.x0*PZ.view.s;
 PZ.view.y=(cv.height-bh*PZ.view.s)/2-b.y0*PZ.view.s;
 PZ.view.fitMode=picture?'picture':'table';
 pzClampView();PZ.needDraw=true;
}
function pzZoomView(factor){
 const cv=$('#pz-canvas'),v=PZ.view;if(!cv||!PZ.data||!(v.s>0)||!Number.isFinite(factor)||factor<=0)return;
 const x=cv.width/2,y=cv.height/2,s=Math.max(Math.min(.03,v.s),Math.min(Math.max(5,v.s),v.s*factor));
 v.fitMode=null;v.x=x-(x-v.x)*s/v.s;v.y=y-(y-v.y)*s/v.s;v.s=s;pzClampView();PZ.needDraw=true;
}
`);
replace("else{if(center){PZ.view.s=oldScale*dpr/oldDpr;", "else if(PZ.view.fitMode){pzFitView(PZ.view.fitMode==='picture');}else{if(center){PZ.view.s=oldScale*dpr/oldDpr;");
replace("PZ.view.ready=false;PZ.stats={};render();", "PZ.view.ready=false;PZ.view.fitMode=null;PZ.stats={};render();");
replace("function pzFitTidiedPieces(){\n", "function pzFitTidiedPieces(){\n PZ.view.fitMode=null;\n");
replace("if(PZ.pinch&&pts.size===2){const a=", "if(PZ.pinch&&pts.size===2){PZ.view.fitMode=null;const a=");
replace("PZ.pan.moved=true;}PZ.view.x=PZ.pan.vx", "PZ.pan.moved=true;}PZ.view.fitMode=null;PZ.view.x=PZ.pan.vx");
replace("cv.addEventListener('wheel',e=>{e.preventDefault();const [bx,by,sx,sy]=pzToBoard", "cv.addEventListener('wheel',e=>{e.preventDefault();PZ.view.fitMode=null;const [bx,by,sx,sy]=pzToBoard");
replace("pzHit(bx,by)!=null)return;const s=Math.min(5,PZ.view.s*1.8);", "pzHit(bx,by)!=null)return;PZ.view.fitMode=null;const s=Math.min(5,PZ.view.s*1.8);");
replace('<button id="pz-frame" data-pz-tone="reef">🖼 Picture</button>', '<button id="pz-frame" data-pz-tone="reef">Fit puzzle</button><button id="pz-zoom-out" data-pz-tone="reef" aria-label="Zoom puzzle out">− Zoom out</button><button id="pz-zoom-in" data-pz-tone="reef" aria-label="Zoom puzzle in">＋ Zoom in</button>');
replace("$('#pz-fit').onclick=()=>PZ.view.fit();$('#pz-frame').onclick=()=>PZ.view.frame();", "$('#pz-fit').onclick=()=>PZ.view.fit();$('#pz-frame').onclick=()=>PZ.view.frame();$('#pz-zoom-out').onclick=()=>pzZoomView(1/1.25);$('#pz-zoom-in').onclick=()=>pzZoomView(1.25);");
replace("const PZ_TOOLS=[", "const PZ_TOOLS=[['pz-frame','Fit whole puzzle'],['pz-zoom-in','＋ Zoom puzzle in'],['pz-zoom-out','− Zoom puzzle out'],['pz-fit','See all loose pieces'],");
replace("if(!PZ.view.ready&&PZ.view.frame&&PZ.data?.meta&&PZ.geo){", "if(!PZ.view.ready&&PZ.view.frame&&PZ.data?.meta&&PZ.geo&&cv.width>0&&cv.height>0){");
replace(" PZ.view.s=s;PZ.view.x=cv.width/2-(q.x+pw/2)*s;"," PZ.view.fitMode=null;PZ.view.s=s;PZ.view.x=cv.width/2-(q.x+pw/2)*s;");
replace("PZ.hintPulse={p:best.i,at:Date.now()};","PZ.view.fitMode=null;PZ.hintPulse={p:best.i,at:Date.now()};");
return s;}
module.exports={patch,expected};if(require.main===module){const [a,b]=process.argv.slice(2);fs.writeFileSync(b,patch(fs.readFileSync(a,'utf8')));}
