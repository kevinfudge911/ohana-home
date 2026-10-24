/* Isolated rendering module. No application state, network, sound or profile access. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.OhanaMemorialStudy=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const W=1536,H=1024;
const maps={
 bridge:{home:{x:1410,y:930,z:1.55},rail:{x:1144,y:466,z:2.7},flower:{x:135,y:850,z:1.05},high:[{x:1330,y:330,z:2.7},{x:1040,y:250,z:3.45},{x:600,y:260,z:3.15},{x:180,y:360,z:2.35},{x:145,y:630,z:1.5}],exclusions:[{x:365,y:580,w:805,h:360}]},
 shuffle:{home:{x:1410,y:960,z:1.55},rail:{x:1370,y:527,z:2.65},flower:{x:150,y:890,z:1.05},high:[{x:1455,y:340,z:2.6},{x:1460,y:120,z:3.3},{x:1310,y:45,z:5},{x:900,y:45,z:5},{x:480,y:45,z:5},{x:140,y:110,z:3.5},{x:125,y:430,z:2.3},{x:135,y:670,z:1.45}],exclusions:[{x:355,y:75,w:820,h:155},{x:300,y:230,w:905,h:665}]}
};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
function distanceScale(z){return .72/z;}
function catmull(a,b,c,d,t){return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);}
function path(points,t){const u=clamp(t,0,1)*(points.length-1),i=Math.min(points.length-2,Math.floor(u)),f=u-i;return Object.fromEntries(['x','y','z'].map(k=>[k,catmull(points[Math.max(0,i-1)][k],points[i][k],points[i+1][k],points[Math.min(points.length-1,i+2)][k],f)]));}
function makeLeg(a,b,mid,duration,start,label){
 // A modest approach toward the viewer makes flight easier to read.
 // Fixed landing anchors retain their original distance and exact resting size.
 const flightPoints=mid.map(point=>({...point,z:point.z/1.22}));
 return {points:[a,...flightPoints,b],duration,start,end:start+duration,label};
}
function plan(room='bridge',tour=0){
 const m={...maps[room]};
 if(tour===2){m.rail=m.altRail||(room==='bridge'?{x:411,y:466,z:2.7}:{x:1350,y:490,z:2.85});m.flower=m.altFlower||(room==='bridge'?{x:188,y:940,z:1.05}:{x:190,y:950,z:1.05});}
 const first=m.first||(room==='bridge'?[{x:1400,y:760,z:1.85},{x:1350,y:550,z:2.3},{x:1200,y:400,z:2.85}]:[{x:1445,y:800,z:1.8},{x:1445,y:590,z:2.2},{x:1430,y:460,z:2.75}]);
 const back=m.back|| (room==='bridge'?[...m.high.slice().reverse(),{x:1380,y:620,z:2.1},{x:1420,y:790,z:1.8}]:[...m.high.slice().reverse(),{x:1445,y:590,z:2.2},{x:1445,y:810,z:1.8}]);
 const legs=[makeLeg(m.home,m.rail,first,5.5,1,'Toward the distant rail'),makeLeg(m.rail,m.flower,m.high,8.5,9.5,'Approaching the foreground flowers'),makeLeg(m.flower,m.home,back,8.5,21,'Returning to the original resting position')];
 if(tour===1){let start=1;return legs.slice().reverse().map(leg=>{const points=leg.points.slice().reverse(),end=points.at(-1),destination=end===m.home?'the original resting position':end===m.rail?'the distant rail':'the foreground flowers',next={points,duration:leg.duration,start,end:start+leg.duration,label:'Visiting '+destination,destination};start=next.end+3;return next;});}
 legs.forEach(leg=>{const end=leg.points.at(-1);leg.destination=end===m.home?'the original resting position':end===m.rail?'the distant rail':'the foreground flowers';});return legs;
}
// Arc-distance parameterization and monotone cubic components prevent the
// first short lift from dipping below its starting perch or overshooting depth.
const visiblePaths=new WeakMap();
function visiblePath(points,t){let data=visiblePaths.get(points);if(!data){let total=0;const lengths=[],ends=[];for(let i=1;i<points.length;i++){const n=Math.max(1,Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));lengths.push(n);total+=n;ends.push(total);}data={total,lengths,ends};visiblePaths.set(points,data);}const at=clamp(t,0,1)*data.total;let i=data.ends.findIndex(n=>n>=at);if(i<0)i=points.length-2;const length=data.lengths[i],u=(at-(i?data.ends[i-1]:0))/length;
 const harmonic=(a,b)=>a*b<=0?0:2*a*b/(a+b),result={};for(const key of ['x','y','z']){const a=points[i][key],b=points[i+1][key],s=(b-a)/length,left=i?(a-points[i-1][key])/data.lengths[i-1]:s,right=i+2<points.length?(points[i+2][key]-b)/data.lengths[i+1]:s,m0=harmonic(left,s)*length,m1=harmonic(s,right)*length;result[key]=(2*u*u*u-3*u*u+1)*a+(u*u*u-2*u*u+u)*m0+(-2*u*u*u+3*u*u)*b+(u*u*u-u*u)*m1;}return result;
}
function pose(time,room='bridge',tour=0,customPlan=null){
 const edge=customPlan?.[0]?.edgeVisit;if(edge){const h=edge.home,rest={...h,scale:distanceScale(h.z),phase:'rest',facing:1};if(time<edge.tuckStart)return rest;if(time<edge.tuckEnd)return{...rest,phase:'perch-tuck',maskedPerch:true,tuck:(time-edge.tuckStart)/(edge.tuckEnd-edge.tuckStart)};if(time<customPlan[0].start)return{...rest,phase:'hidden',visible:false};const last=customPlan.at(-1);if(time>=last.end){if(time<edge.revealStart)return{...rest,phase:'hidden',visible:false};if(time<edge.end)return{...rest,phase:'landing',maskedPerch:true,tuck:1-(time-edge.revealStart)/(edge.end-edge.revealStart)};return{...rest,complete:true};}}
 const legs=customPlan||plan(room,tour),m=maps[room];let perch=legs[0]?.points[0]||m.home,last=null;
 for(const leg of legs){if(time<leg.start)return {...perch,scale:distanceScale(perch.z),phase:'rest',label:last?'Settled on '+last.destination:'Resting on the original Ohana perch',facing:last===legs[0]?-1:1};if(time<=leg.end){let u=(time-leg.start)/leg.duration;
 // Acceleration after push-off, long middle flight, deceleration into contact.
 let q=customPlan?(u<.04?u*u/.08/.96:u>.96?1-(1-u)*(1-u)/.08/.96:(u-.02)/.96):u*u*(3-2*u),p=(customPlan?.visibleTour?visiblePath:path)(leg.points,q),n=(customPlan?.visibleTour?visiblePath:path)(leg.points,clamp(q+.001,0,1)),prev=(customPlan?.visibleTour?visiblePath:path)(leg.points,clamp(q-.001,0,1));let dx=n.x-prev.x,dy=n.y-prev.y;
 const envelope=Math.sin(Math.PI*clamp(u*4,0,1))*.5+.5;
 const landing=clamp((u-.86)/.14,0,1),launch=clamp(u/.12,0,1);
 const bound=0.5+0.5*Math.sin((u*leg.duration)*Math.PI*2*1.5);
 const glideWeight=leg.flightStyle==='glide'?1:u>.25&&u<.78?clamp((bound-.6)/.4,0,1):0,glide=glideWeight>.5; const yaw=dx/(Math.abs(dy)*.7+Math.abs(dx)+.000001);const facing=yaw===0?1:Math.sign(yaw)*(.32+.68*Math.abs(yaw));
 return {...p,foregroundTransit:!!customPlan?.visibleTour,foregroundPass:!!leg.foregroundPass&&u>.04&&u<.96,scale:distanceScale(p.z),phase:landing>0?'landing':launch<1?'launch':'flight',label:leg.label,u,flightTime:time-leg.start,facing,pitch:clamp(Math.atan2(dy,Math.abs(dx))*.28,-.28,.28)+.16*(1-landing),wing:lerp(Math.sin((time-leg.start)*Math.PI*2*7.2),.12,glideWeight),glide,landing,launch,envelope};}
 perch=leg.points.at(-1);last=leg;
 }
 const home=legs.at(-1)?.points.at(-1)||m.home;return {...home,scale:distanceScale(home.z),phase:'rest',label:'Resting on the original Ohana perch',facing:1,complete:true};
}
function bounds(p){if(p.visible===false)return{x:p.x,y:p.y,w:0,h:0};if(p.maskedPerch)return bounds({...p,maskedPerch:false,phase:'rest'});
 // Same Bezier-control and stroke hull as the reviewed renderer, streamed into
 // extrema without allocating hundreds of corner arrays on every sample.
 const bob=p.phase==='rest'?0:Math.sin((p.flightTime||0)*Math.PI*2*7.2)*1.4*(1-(p.landing||0)),angle=p.pitch||0,cos=Math.cos(angle),sin=Math.sin(angle),facing=p.facing===undefined?1:p.facing,scale=p.scale;
 let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
 const add=(x,y,pad=0)=>{const px=p.x+scale*facing*(x*cos-(y+bob)*sin),py=p.y+scale*(x*sin+(y+bob)*cos),radius=pad*(Math.abs(cos)+Math.abs(sin)),rx=scale*Math.abs(facing)*radius,ry=scale*radius;left=Math.min(left,px-rx);right=Math.max(right,px+rx);top=Math.min(top,py-ry);bottom=Math.max(bottom,py+ry);};
 add(-151,-170);add(64,-170);add(-151,-9);add(64,-9);
 if(p.phase!=='rest'){
  const w=p.wing||0,land=p.landing||0,amp=(1-land*.68)*(p.launch===undefined?1:Math.max(.3,p.launch)),tx=-92-Math.max(0,-w)*24,ty=-45-w*117*amp;
  for(const [ox,oy]of [[10,-10],[-3,2]]){
   const wing=(x,y)=>add(x+ox,y+oy,7);
   wing(-7,-48);wing(-47,-73);wing(tx-8,ty-17);wing(tx,ty);wing(tx+14,ty+24);wing(-45,-22);wing(-23,-20);
   for(let i=0;i<8;i++){const f=i/7,x=tx+f*58,y=ty+f*(42+w*43*amp);wing(-35+f*12,-46+f*10);wing(x+11,y-12);wing(x,y);wing(x-6,y+4);wing(-44+f*20,-27+f*4);}
  }
 }
 if(p.phase==='rest'||p.landing>.55){add(-36,-23);add(21,-23);add(-36,14);add(21,14);}
 return{x:left-2,y:top-2,w:right-left+4,h:bottom-top+4};
}

function intersects(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function birdClip(c){c.beginPath();c.moveTo(184,5);for(const a of [[206,24],[229,37],[246,59],[250,79],[267,87],[283,96],[279,108],[251,112],[247,143],[233,158],[237,161],[228,164],[203,164],[195,163],[167,163],[144,156],[115,142],[82,145],[89,126],[70,111],[88,103],[120,105],[144,114],[152,93],[176,84],[169,64],[179,46]])c.lineTo(...a);c.closePath();c.clip();}
function drawWing(c,p,far){
 const w=p.wing||0,land=p.landing||0,amp=(1-land*.68)*(p.launch===undefined?1:Math.max(.3,p.launch));
 const shoulder={x:-7,y:-48},tip={x:-92-Math.max(0,-w)*24,y:-45-w*117*amp};
 c.save();c.translate(far?10:-3,far?-10:2);c.globalAlpha=far?.78:1;
 const grad=c.createLinearGradient(shoulder.x,shoulder.y,tip.x,tip.y);grad.addColorStop(0,far?'#ad2515':'#ee3825');grad.addColorStop(.56,far?'#b32c1e':'#c72c1f');grad.addColorStop(1,'#8c211a');
 c.fillStyle=grad;c.strokeStyle='#752219';c.lineWidth=1.3;
 c.beginPath();c.moveTo(shoulder.x,shoulder.y);c.bezierCurveTo(-47,-73,tip.x-8,tip.y-17,tip.x,tip.y);c.quadraticCurveTo(tip.x+14,tip.y+24,-45,-22);c.quadraticCurveTo(-23,-20,shoulder.x,shoulder.y);c.fill();c.stroke();
 // Eight overlapping primaries, each swept from an elbow to an individual tip.
 for(let i=0;i<8;i++){const f=i/7,tx=tip.x+f*58,ty=tip.y+f*(42+w*43*amp);c.fillStyle=i%2?'#c53222':'#d13a27';c.beginPath();c.moveTo(-35+f*12,-46+f*10);c.quadraticCurveTo(tx+11,ty-12,tx,ty);c.quadraticCurveTo(tx-6,ty+4,-44+f*20,-27+f*4);c.closePath();c.fill();c.stroke();}
 c.restore();
}
function createPerchTuck(image){const w=image.naturalWidth,h=image.naturalHeight,make=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;},original=make(),mask=make(),body=make(),perch=make(),moving=make(),output=make();original.getContext('2d').drawImage(image,0,0);const source=original.getContext('2d').getImageData(0,0,w,h),mc=mask.getContext('2d');mc.fillStyle='#fff';mc.fillRect(164,0,130,126);mc.fillRect(164,0,102,145);mc.beginPath();for(const[i,p]of [[184,5],[206,24],[229,37],[246,59],[250,79],[267,87],[283,96],[279,108],[251,112],[247,143],[233,158],[237,161],[228,164],[203,164],[195,163],[167,163],[144,156],[115,142],[82,145],[89,126],[70,111],[88,103],[120,105],[144,114],[152,93],[176,84],[169,64],[179,46]].entries())i?mc.lineTo(...p):mc.moveTo(...p);mc.closePath();mc.fill();mc.strokeStyle='#fff';mc.lineWidth=12;mc.lineJoin='round';mc.stroke();mc.beginPath();for(const[i,p]of [[139,77],[155,71],[181,78],[181,96],[151,101]].entries())i?mc.lineTo(...p):mc.moveTo(...p);mc.closePath();mc.fill();
 // Claws are isolated with their own small silhouettes; source colors are copied.
 for(const ps of [[[183,158],[190,154],[202,155],[211,164],[209,172],[203,177],[195,177],[188,175],[182,168]],[[225,157],[233,152],[245,154],[254,163],[253,170],[246,175],[240,173],[235,175],[228,171]]]){mc.beginPath();ps.forEach((p,i)=>i?mc.lineTo(...p):mc.moveTo(...p));mc.closePath();mc.fill();}
 const alpha=mask.getContext('2d').getImageData(0,0,w,h).data,partition=Array.from({length:w*h},(_,i)=>alpha[i*4+3]>0),bi=body.getContext('2d').createImageData(w,h),pi=perch.getContext('2d').createImageData(w,h);for(let i=0;i<partition.length;i++)for(let k=0;k<4;k++)(partition[i]?bi:pi).data[i*4+k]=source.data[i*4+k];body.getContext('2d').putImageData(bi,0,0);perch.getContext('2d').drawImage(original,0,0);for(let y=0;y<h;y++){let start=-1;for(let x=0;x<=w;x++){const on=x<w&&partition[y*w+x];if(on&&start<0)start=x;if(!on&&start>=0){perch.getContext('2d').clearRect(start,y,x-start,1);start=-1;}}}
 const sharedResult=output.getContext('2d').createImageData(w,h);
 function frame(progress){const q=Math.max(0,Math.min(1,progress)),ease=q*q*(3-2*q),c=moving.getContext('2d');c.clearRect(0,0,w,h);c.save();c.translate(220,174+190*ease);c.scale(1-.05*ease,1-.05*ease);c.translate(-220,-174);c.drawImage(body,0,0);c.restore();const pixels=c.getImageData(0,0,w,h),result=sharedResult;result.data.fill(0);for(let i=0;i<partition.length;i++){const n=i*4;if(partition[i]){result.data[n]=pixels.data[n];result.data[n+1]=pixels.data[n+1];result.data[n+2]=pixels.data[n+2];result.data[n+3]=Math.min(pixels.data[n+3],source.data[n+3]);}else for(let k=0;k<4;k++)result.data[n+k]=source.data[n+k];}for(let i=0;i<partition.length;i++)if(!partition[i])result.data.fill(0,i*4,i*4+4);const dc=output.getContext('2d');dc.clearRect(0,0,w,h);if(q===0)dc.drawImage(original,0,0);else{moving.getContext('2d').putImageData(result,0,0);dc.drawImage(perch,0,0);dc.drawImage(moving,0,0);}return output;}
 function prove(){let introducedAlpha=0,changedPerchPixels=0,changedPerchAlpha=0,maxPerchPremultipliedError=0,visibleAtHidden=0,checkedPixels=0;for(let t=0;t<=100;t++){const q=t/100,d=frame(q).getContext('2d').getImageData(0,0,w,h).data;for(let i=0;i<partition.length;i++){const n=i*4;checkedPixels++;if(d[n+3]>source.data[n+3])introducedAlpha++;if(!partition[i]){if([0,1,2,3].some(k=>d[n+k]!==source.data[n+k]))changedPerchPixels++;if(d[n+3]!==source.data[n+3])changedPerchAlpha++;for(let k=0;k<3;k++)maxPerchPremultipliedError=Math.max(maxPerchPremultipliedError,Math.abs(Math.round(d[n+k]*d[n+3]/255)-Math.round(source.data[n+k]*source.data[n+3]/255)));}if(q===1&&partition[i]&&d[n+3])visibleAtHidden++;}}return{frames:101,checkedPixels,introducedAlpha,changedPerchPixels,changedPerchAlpha,maxPerchPremultipliedError,visibleAtHidden,pass:!introducedAlpha&&!changedPerchAlpha&&maxPerchPremultipliedError===0&&!visibleAtHidden};}
 return{frame,prove,body,perch,partition};
}
class Study{
 constructor(canvas,image,{room='bridge',getExclusions=()=>[],getPlan=()=>null,home=null}={}){this.getPlan=getPlan;this.home=home;this.canvas=canvas;this.c=canvas.getContext('2d');this.image=image;this.room=room;this.tour=-1;this.getExclusions=getExclusions;this.time=0;this.paused=false;this.reduced=false;this.active=false;this.safe=true;this.draw();}
 edgeStudy(){return this.perchTuck||(this.perchTuck=createPerchTuck(this.image));}
 drawPerchTuck(q){const c=this.c,h=this.home;c.save();c.translate(h.x,h.y);c.scale(distanceScale(h.z),distanceScale(h.z));c.translate(-220,-174);c.drawImage(q>=1?this.edgeStudy().perch:q<=0?this.image:this.edgeStudy().frame(q),0,0);c.restore();}
 getMouthAnchor(){const p=this.snapshot,a=p.pitch||0;return{x:p.x+p.scale*p.facing*(61*Math.cos(a)+77*Math.sin(a)),y:p.y+p.scale*(61*Math.sin(a)-77*Math.cos(a)),scale:p.scale,visible:this.safe&&p.visible!==false&&!p.maskedPerch};}
 setRoom(room){if(!maps[room])throw Error('Unknown room');this.room=room;this.reset();}
 reset(){this.time=0;this.active=false;this.draw();}
 preview(){if(this.reduced||this.paused)return false;this.tour=this.tour<0?0:(this.tour+1+Math.floor(Math.random()*2))%3;this.time=0;this.active=true;this.safe=true;this.draw();return true;}
 setReduced(value){this.reduced=!!value;if(value)this.reset();}
 setPaused(value){this.paused=!!value;}
 update(dt){if(!this.paused&&!this.reduced&&this.active){this.time+=Math.min(dt,.05);if(this.time>30.5)this.active=false;}return this.draw();}
 draw(at=this.time){const c=this.c,m={...maps[this.room],home:this.home||maps[this.room].home},customPlan=this.getPlan(),p=pose(this.reduced?0:at,this.room,Math.max(0,this.tour),customPlan);c.clearRect(0,0,this.canvas.width,this.canvas.height);this.snapshot=p;if(customPlan?.[0]?.edgeVisit&&(p.visible===false||p.maskedPerch)){this.safe=true;this.drawPerchTuck(p.visible===false?1:p.tuck);return p;}
 const exclusions=[...(customPlan?[]:m.exclusions),...this.getExclusions()],unchangedHome=p.phase==='rest'&&p.x===m.home.x&&p.y===m.home.y&&Math.abs(p.scale-distanceScale(m.home.z))<1e-9&&(p.facing===undefined||p.facing===1)&&!p.pitch;
 const unsafe=!unchangedHome&&!p.foregroundPass&&!p.foregroundTransit&&exclusions.some(b=>intersects(bounds(p),b));this.safe=!unsafe;
 // Keep the original stationary perch. Only hide its bird pixels during a visit.
 c.save();c.translate(m.home.x,m.home.y);c.scale(distanceScale(m.home.z),distanceScale(m.home.z));c.translate(-220,-174);
 if(unsafe||(p.phase==='rest'&&p.x===m.home.x&&p.y===m.home.y)){c.drawImage(this.image,0,0);c.restore();return p;}
 if(customPlan?.[0]?.edgeVisit)c.drawImage(this.edgeStudy().perch,0,0);else{c.save();c.beginPath();c.moveTo(0,177);c.lineTo(105,177);c.lineTo(108,160);c.lineTo(147,174);c.lineTo(253,174);c.lineTo(264,145);c.lineTo(384,128);c.lineTo(384,256);c.lineTo(0,256);c.closePath();c.clip();c.drawImage(this.image,0,0);c.restore();}c.restore();
 // Fail closed if a newly placed dialog/input intersects a pre-authored route.
 if(unsafe){return p;}
 c.save();c.translate(p.x,p.y);c.scale(p.scale*p.facing,p.scale);c.rotate(p.pitch||0);
 if(p.phase!=='rest'){c.translate(0,Math.sin((p.flightTime||0)*Math.PI*2*7.2)*1.4*(1-(p.landing||0)));drawWing(c,p,true);}
 // Body, crest, scarf and beak are sampled directly from the original asset.
 c.save();c.translate(-220,-174);birdClip(c);c.drawImage(this.image,0,0);c.restore();
 if(p.phase!=='rest')drawWing(c,p,false);if(p.phase==='rest'||p.landing>.55){c.strokeStyle='#b76b17';c.lineWidth=2.6;c.beginPath();c.moveTo(-18,-10);c.lineTo(-13,0);c.lineTo(-23,1);c.moveTo(4,-10);c.lineTo(8,0);c.lineTo(-2,1);c.stroke();}
 c.restore();return p;
 }
}
return {W,H,maps,plan,pose,bounds,intersects,distanceScale,createPerchTuck,Study};
});
