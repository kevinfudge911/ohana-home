const PATCHES=[
{name:"wsc-observer",old:"const observer=new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(refresh);});\n window.addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(refresh);});",neu:"const observer=new MutationObserver(rs=>{if(frame)return;if(!rs.some(r=>{for(const n of r.addedNodes)if(n.nodeType===1)return true;for(const n of r.removedNodes)if(n.nodeType===1)return true;return false;}))return;frame=requestAnimationFrame(refresh);});\n window.addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(refresh);});"},
{name:"cardinal-wake",old:"function wake(){if(!stopped&&!document.hidden&&!raf)raf=requestFrame(frame);}",neu:"function wake(){if(stopped||document.hidden||raf)return;if(!away&&!planning&&(wait>1||reasons.size)){raf=-1;setTimeout(()=>{if(raf!==-1)return;raf=0;if(stopped||document.hidden)return;if(!reasons.size)wait-=.5;last=0;raf=requestFrame(frame);},500);return;}if(planning&&!away){raf=-1;setTimeout(()=>{if(raf!==-1)return;raf=0;if(stopped||document.hidden)return;raf=requestFrame(frame);},60);return;}raf=requestFrame(frame);}"},
{name:"cardinal-observer",old:"const changes=records.filter(r=>!ownMutation(r));if(changes.length){dirty=true;for(const r of changes){",neu:"if(!away&&!planning){dirty=true;clearGeometryTracking();if(records.some(r=>r.attributeName==='world-theme'))layout();return;}const changes=records.filter(r=>!ownMutation(r));if(changes.length){dirty=true;for(const r of changes){"},
{name:"cardinal-game-rest",old:"window.ohanaCardinalVisits=OhanaCardinalVisits.install({getState:()=>typeof S==='undefined'?null:S,getPuzzleState:()=>typeof PZ==='undefined'?null:PZ});",neu:"window.ohanaCardinalVisits=OhanaCardinalVisits.install({getState:()=>typeof S==='undefined'?null:S,getPuzzleState:()=>typeof PZ==='undefined'?null:PZ});\n;(()=>{const v=window.ohanaCardinalVisits;if(!v||!v.setPaused)return;let on=false;const tick=()=>{let g=false;try{g=!!(typeof S!=='undefined'&&S&&S.game)&&!!document.getElementById('game');}catch(e){}if(g!==on){on=g;v.setPaused('game-board-speed',g);}};setInterval(tick,700);tick();window.ohanaCardinalGameRest=1;})();"},
{name:"cardinal-frame-rest",old:"controls();if(s&&reasons.has('manual')){if(study||layer||away||planning)cancel();fallback='paused';last=0;return;}",neu:"controls();if(s&&reasons.has('manual')){if(study||layer||away||planning)cancel();fallback='paused';last=0;return;}if(s&&reasons.has('game-board-speed')){fallback='paused';last=0;return;}"},
{name:"cardinal-rest-exclusions",old:"getExclusions:()=>{if(frameExclusions)return frameExclusions;const current=context();return (current&&!current.blocked?obstacles(current,0,away):[{x:0,y:0,w:innerWidth,h:innerHeight}]);}",neu:"getExclusions:()=>{if(frameExclusions)return frameExclusions;const current=context();return (current&&!current.blocked?obstacles(current,0,true):[{x:0,y:0,w:innerWidth,h:innerHeight}]);}"}
];

// Applied to the live APP_HTML_GZIP part (…-app.html.gz) on Nov 18 2026, 2:28 PM CT.
// Live version: 59437be4 (before: 420d7390). Smart Placement is on (worker runs near the D1 database in Atlanta).
// What each patch fixes:
//  wsc-observer: the menu/workstation script re-ran ~100 style writes every time any text on the page changed
//                (about once a second), which forced full-page style recalcs. Now it only refreshes when elements are added/removed.
//  cardinal-wake: Daddy's Cardinal ran every animation frame even while resting. Now it checks twice a second while resting,
//                 and plans in small slices with breathing room.
//  cardinal-observer: while resting, the cardinal no longer measures every new element on the page.
//  cardinal-game-rest + cardinal-frame-rest: while a game board is open the cardinal rests on its perch (it was freezing
//                 game screens 3 seconds at a time). It comes back when you leave the game.
//  cardinal-rest-exclusions: resting bird uses its saved map instead of re-measuring the whole screen (was 1.3-1.8 s each
//                 time you left a game).
