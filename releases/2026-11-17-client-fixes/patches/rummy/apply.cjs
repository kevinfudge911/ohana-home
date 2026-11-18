const fs=require('fs');let s=fs.readFileSync(process.argv[2],'utf8');
const start=s.indexOf('  const layout=()=>',s.indexOf("/* Rummy's actual #gb")),end=s.indexOf('\n  layout();',start);
if(start<0||end<0)throw Error('Adapter layout missing');
s=s.slice(0,start)+`  const layout=()=>{frame=0;if(stopped||!gb.contains(plane))return;const c=getComputedStyle(gb),height=Math.max(1,gb.clientHeight-(parseFloat(c.paddingTop)||0)-(parseFloat(c.paddingBottom)||0)),key=[innerWidth,innerHeight,gb.clientWidth,gb.clientHeight,header.getBoundingClientRect().height,dock.getBoundingClientRect().height].join(':');if(key===last)return;last=key;
   // Measure the original stack first. Use the spare landscape width only when that stack will not fit.
   plane.dataset.rummyCompact='false';put(plane,{display:'flex','grid-template-columns':'none','align-items':css.alignItems,height:'auto','min-height':'0',width:gb.clientWidth+'px','min-width':'0'});put(play,{flex:'0 0 auto',height:'auto','min-height':'0',overflow:'visible'});
   const stackedHeight=Math.max(1,plane.scrollHeight,plane.offsetHeight),compact=innerWidth>innerHeight&&gb.clientWidth>=480&&stackedHeight>height;
   plane.dataset.rummyCompact=String(compact);put(plane,{display:compact?'grid':'flex','grid-template-columns':compact?'minmax(0,1.2fr) minmax(0,1fr)':'none','align-items':compact?'start':css.alignItems});
   const rack=plane.querySelector('.shuffle-rack');if(rack&&!compact){const width=Math.max(gb.clientWidth,rack.scrollWidth);put(plane,{width:width+'px','min-width':width+'px'});}
   const naturalPlay=Math.max(minPlay,play.scrollHeight,play.offsetHeight);put(play,{'min-height':naturalPlay+'px'});const naturalPlane=Math.max(1,plane.scrollHeight,plane.offsetHeight);
   put(plane,{'min-height':naturalPlane+'px',height:height+'px'});put(play,{flex:'1 1 auto',height:'auto'});api?.refresh();revealFocused();
  };`+s.slice(end);
const observeOld="for(const e of[gb,header,dock])observer.observe(e);";
if(s.split(observeOld).length!==2)throw Error('Resize observer anchor not unique');s=s.replace(observeOld,observeOld+"window.addEventListener('resize',queue);");
const cleanupOld="observer.disconnect();gb.removeEventListener('wheel',wheel,true);";
if(s.split(cleanupOld).length!==2)throw Error('Resize cleanup anchor not unique');s=s.replace(cleanupOld,"observer.disconnect();window.removeEventListener('resize',queue);gb.removeEventListener('wheel',wheel,true);");
const captureAnchor=" const handAnchor=shuffleHandAnchor(prior,sameTable);";
if(s.split(captureAnchor).length!==2)throw Error('Render anchor missing');
s=s.replace(captureAnchor,captureAnchor+`\n const compactAnchor=sameTable&&prior?.querySelector('[data-rummy-compact="true"]')&&prior.ohanaRummyViewContext===[S.me?.id,S.room,S.gameEntryVisit||0].join(':')&&prior.ohanaRummySessionContext===shuffleCompactContext()?{scroll:rackScroll,card:focused||null,outsideFocus:document.activeElement&&document.activeElement!==document.body&&!prior.contains(document.activeElement)?document.activeElement:null,context:shuffleCompactContext(),cancelled:false}:null;`);
const rootAnchor="const root=document.getElementById('game');root.ohanaRummyViewContext=";
if(s.split(rootAnchor).length!==2)throw Error('Root context anchor missing');
s=s.replace(rootAnchor,`const root=document.getElementById('game');root.ohanaRummySessionContext=shuffleCompactContext();if(compactAnchor){root.ohanaRummyCompactAnchor=compactAnchor;for(const event of ['pointerdown','touchstart','wheel','keydown'])root.addEventListener(event,()=>{compactAnchor.cancelled=true;},{capture:true,once:true,passive:true});}root.ohanaRummyViewContext=`);
const helper=`function shuffleCompactContext(){return [S.token,S.me?.id,S.room,S.roomEpoch,S.game,S.gameEntryVisit||0].join(':');}
function restoreShuffleCompactHand(anchor,camera,rack,valid,epoch){
 if(!anchor||anchor.cancelled||!camera||!rack?.isConnected||!valid()||shuffleCompactContext()!==anchor.context||camera.pointerActive||camera.interaction!==epoch)return false;
 const target=anchor.card?[...rack.querySelectorAll('[data-card]')].find(c=>c.dataset.card===anchor.card):null,active=document.activeElement;
 // Do not move the hand or focus after the person has moved on to another control.
 const stableOutside=!!anchor.outsideFocus&&anchor.outsideFocus.isConnected&&active===anchor.outsideFocus;
 if(active&&active!==document.body&&active!==target&&!stableOutside)return false;
 rack.scrollLeft=anchor.scroll;
 if(target&&!stableOutside)target.focus({preventScroll:true});
 return true;
}
`;
if(s.split('function shuffleHandAnchor(').length!==2)throw Error('Hand helper missing');s=s.replace('function shuffleHandAnchor(',helper+'function shuffleHandAnchor(');
const frameAnchor="let last='',api=null,stopped=false,frame=0,focusFrame=0,anchorFrame=0;";
if(s.split(frameAnchor).length!==2)throw Error('Adapter lifecycle missing');s=s.replace(frameAnchor,"let last='',api=null,stopped=false,frame=0,focusFrame=0,anchorFrame=0,compactFrame=0;");
const afterMount="  const handAnchor=game.ohanaRummyHandAnchor;";
if(s.split(afterMount).length!==2)throw Error('Adapter anchor missing');s=s.replace(afterMount,`  const compactAnchor=game.ohanaRummyCompactAnchor;if(compactAnchor){const epoch=api.interaction;compactFrame=requestAnimationFrame(()=>{compactFrame=requestAnimationFrame(()=>{compactFrame=0;if(!stopped)restoreShuffleCompactHand(compactAnchor,api,plane.querySelector('.shuffle-rack'),()=>game.isConnected&&gb.contains(plane)&&game.ohanaRummyCompactAnchor===compactAnchor&&plane.dataset.rummyCompact==='true',epoch);});});}
`+afterMount);
const destroyAnchor="cancelAnimationFrame(anchorFrame);observer.disconnect();window.removeEventListener('resize',queue);";
if(s.split(destroyAnchor).length!==2)throw Error('Adapter teardown missing');s=s.replace(destroyAnchor,"cancelAnimationFrame(anchorFrame);cancelAnimationFrame(compactFrame);observer.disconnect();window.removeEventListener('resize',queue);");
const css=`<style id="ohana-rummy-compact-table-v1">@layer ohanaApproved{
@media (orientation:landscape){
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .rd-play{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-content:start!important;align-items:start!important;gap:4px 8px!important;padding:4px!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .rd-opponent{grid-column:1/-1!important;min-height:38px!important;height:38px!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .rd-opponent .rd-card{height:36px!important;min-height:36px!important;width:25px!important;min-width:25px!important;flex-basis:25px!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .rd-own-area{grid-column:1!important;grid-row:2!important;margin-top:0!important;min-width:0!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .shuffle-melds{gap:8px!important;min-width:0!important;padding:0!important;align-self:start!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .shuffle-piles{gap:16px!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .shuffle-hand{min-width:0!important;padding-top:12px!important;align-self:end!important}
:root.ohana-world body #app #game#game#game#game#game#game#game.rd-game [data-rummy-compact=true] .shuffle-round{grid-column:1/-1!important}
}
}</style>`;
if(s.includes('id="ohana-rummy-compact-table-v1"'))throw Error('Already applied');s=s.replace('</head>',css+'\n</head>');fs.writeFileSync(process.argv[3]||__dirname+'/candidate.html',s);
