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
function pose(time,room='bridge',tour=0){
 const legs=plan(room,tour),m=maps[room];let perch=m.home,last=null;
 for(const leg of legs){if(time<leg.start)return {...perch,scale:distanceScale(perch.z),phase:'rest',label:last?'Settled on '+last.destination:'Resting on the original Ohana perch',facing:last===legs[0]?-1:1};if(time<=leg.end){let u=(time-leg.start)/leg.duration;
 // Acceleration after push-off, long middle flight, deceleration into contact.
 let q=u*u*(3-2*u),p=path(leg.points,q),n=path(leg.points,clamp(q+.001,0,1)),prev=path(leg.points,clamp(q-.001,0,1));let dx=n.x-prev.x,dy=n.y-prev.y;
 const envelope=Math.sin(Math.PI*clamp(u*4,0,1))*.5+.5;
 const landing=clamp((u-.86)/.14,0,1),launch=clamp(u/.12,0,1);
 const bound=0.5+0.5*Math.sin((u*leg.duration)*Math.PI*2*1.5);
 const glideWeight=u>.25&&u<.78?clamp((bound-.6)/.4,0,1):0,glide=glideWeight>.5; const yaw=dx/(Math.abs(dy)*.7+Math.abs(dx)+.000001);const facing=yaw===0?1:Math.sign(yaw)*(.32+.68*Math.abs(yaw));
 return {...p,scale:distanceScale(p.z),phase:landing>0?'landing':launch<1?'launch':'flight',label:leg.label,u,flightTime:time-leg.start,facing,pitch:clamp(Math.atan2(dy,Math.abs(dx))*.28,-.28,.28)+.16*(1-landing),wing:lerp(Math.sin((time-leg.start)*Math.PI*2*7.2),.12,glideWeight),glide,landing,launch,envelope};}
 perch=leg.points.at(-1);last=leg;
 }
 return {...m.home,scale:distanceScale(m.home.z),phase:'rest',label:'Resting on the original Ohana perch',facing:1,complete:true};
}
function bounds(p){
 // Bezier curves stay inside their control-point hull. Bound both wings and
 // every primary at this pose, including stroke, body clip, bob and draw transform.
 const points=[[-151,-170],[64,-170],[-151,-9],[64,-9]];
 if(p.phase!=='rest'){
  const w=p.wing||0,land=p.landing||0,amp=(1-land*.68)*(p.launch===undefined?1:Math.max(.3,p.launch)),tx=-92-Math.max(0,-w)*24,ty=-45-w*117*amp;
  for(const [ox,oy]of [[10,-10],[-3,2]]){
   const wing=[[-7,-48],[-47,-73],[tx-8,ty-17],[tx,ty],[tx+14,ty+24],[-45,-22],[-23,-20]];
   for(let i=0;i<8;i++){const f=i/7,x=tx+f*58,y=ty+f*(42+w*43*amp);wing.push([-35+f*12,-46+f*10],[x+11,y-12],[x,y],[x-6,y+4],[-44+f*20,-27+f*4]);}
   // Default miter limit 10 with a 1.3 stroke can reach 6.5 local units.
   for(const [x,y]of wing)for(const [dx,dy]of [[-7,-7],[7,-7],[-7,7],[7,7]])points.push([x+ox+dx,y+oy+dy]);
  }
 }
 // Feet use a 2.6 stroke: include its full 13-unit miter envelope.
 if(p.phase==='rest'||p.landing>.55)points.push([-36,-23],[21,-23],[-36,14],[21,14]);
 const bob=p.phase==='rest'?0:Math.sin((p.flightTime||0)*Math.PI*2*7.2)*1.4*(1-(p.landing||0));
 const angle=p.pitch||0,cos=Math.cos(angle),sin=Math.sin(angle),facing=p.facing===undefined?1:p.facing;
 const corners=points.map(([x,y])=>({x:p.x+p.scale*facing*(x*cos-(y+bob)*sin),y:p.y+p.scale*(x*sin+(y+bob)*cos)}));
 const left=Math.min(...corners.map(q=>q.x))-2,top=Math.min(...corners.map(q=>q.y))-2;
 return{x:left,y:top,w:Math.max(...corners.map(q=>q.x))+2-left,h:Math.max(...corners.map(q=>q.y))+2-top};
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
class Study{
 constructor(canvas,image,{room='bridge',getExclusions=()=>[]}={}){this.canvas=canvas;this.c=canvas.getContext('2d');this.image=image;this.room=room;this.tour=-1;this.getExclusions=getExclusions;this.time=0;this.paused=false;this.reduced=false;this.active=false;this.safe=true;this.draw();}
 getMouthAnchor(){const p=this.snapshot,a=p.pitch||0;return{x:p.x+p.scale*p.facing*(61*Math.cos(a)+77*Math.sin(a)),y:p.y+p.scale*(61*Math.sin(a)-77*Math.cos(a)),scale:p.scale,visible:this.safe};}
 setRoom(room){if(!maps[room])throw Error('Unknown room');this.room=room;this.reset();}
 reset(){this.time=0;this.active=false;this.draw();}
 preview(){if(this.reduced||this.paused)return false;this.tour=this.tour<0?0:(this.tour+1+Math.floor(Math.random()*2))%3;this.time=0;this.active=true;this.safe=true;this.draw();return true;}
 setReduced(value){this.reduced=!!value;if(value)this.reset();}
 setPaused(value){this.paused=!!value;}
 update(dt){if(!this.paused&&!this.reduced&&this.active){this.time+=Math.min(dt,.05);if(this.time>30.5)this.active=false;}return this.draw();}
 draw(at=this.time){const c=this.c,m=maps[this.room],p=pose(this.reduced?0:at,this.room,Math.max(0,this.tour));c.clearRect(0,0,this.canvas.width,this.canvas.height);this.snapshot=p;
 const exclusions=[...m.exclusions,...this.getExclusions()];const unsafe=exclusions.some(b=>intersects(bounds(p),b));this.safe=!unsafe;
 // Keep the original stationary perch. Only hide its bird pixels during a visit.
 c.save();c.translate(m.home.x,m.home.y);c.scale(distanceScale(m.home.z),distanceScale(m.home.z));c.translate(-220,-174);
 if(unsafe||(p.phase==='rest'&&p.x===m.home.x&&p.y===m.home.y)){c.drawImage(this.image,0,0);c.restore();return p;}
 c.save();c.beginPath();c.moveTo(0,177);c.lineTo(105,177);c.lineTo(108,160);c.lineTo(147,174);c.lineTo(253,174);c.lineTo(264,145);c.lineTo(384,128);c.lineTo(384,256);c.lineTo(0,256);c.closePath();c.clip();c.drawImage(this.image,0,0);c.restore();c.restore();
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
return {W,H,maps,plan,pose,bounds,intersects,distanceScale,Study};
});
