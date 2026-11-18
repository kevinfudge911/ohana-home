(function(){
'use strict';
if(window.ohanaThreeGames)return;
const out={chicken:false,spades2:false};
// Chicken Foot: label legs and toes, start each line at its own number, hide toes nobody can use yet
try{if(typeof dominoTrainLayout==='function'&&typeof dominoBoardLayout==='function'&&typeof dominoTileFace==='function'){
 const orig=dominoTrainLayout;
 dominoTrainLayout=function(st,g,rowLimit=1100){
  if(!st||!st.chicken||!st.trains)return orig.apply(this,arguments);
  const engine=st.board[0]?.tile,targets=new Set((st.playable||[]).map(x=>String(x).split(':')[1]));
  const needFoot=(st.pendingFoot||[]).filter(id=>st.trains[id]&&!st.trains[id].tiles.length);
  let html=engine?dominoTileFace(engine,'tabindex="-1" style="--dx:20px;--dy:16px;--dw:72px;--dh:144px"','board-piece vertical'):'';
  html+='<span class="domino-train-label dmx-cf-title" style="position:absolute;left:108px;top:58px;color:#fff6df;font:600 22px Fredoka">Chicken Foot · '+(needFoot.length?'finish the chicken foot':'12|12 engine')+'</span>';
  const layout={w:Math.max(240,rowLimit),h:180,html:'',pieces:[]};let y=200;
  for(const [id,line] of Object.entries(st.trains)){
   const show=line.tiles.length||line.leg||needFoot.includes(id)||targets.has('train-'+id);
   if(!show){layout['train-'+id]={x:-4000,y:-4000};continue;}
   const packed=dominoBoardLayout(line.tiles,{left:line.start??engine?.a},st.lastPlay?.tile?.id,rowLimit);
   const tag=line.open===false?' · Closed by double':needFoot.includes(id)?' · Chicken foot':'';
   const top=y-50;html+=`<span class="domino-train-label" style="position:absolute;left:20px;top:${y-28}px;color:#fff6df;font:600 18px Fredoka">${esc(line.label||id)} · ${Number(line.end)}${tag}</span><div class="domino-train-path" style="position:absolute;left:0;top:${top}px;width:${packed.w}px;height:${packed.h}px">${packed.html}</div>`;
   const end=packed.pieces.length?packed.right:{x:100,y:100};layout['train-'+id]={x:end.x,y:top+end.y};
   layout.pieces.push(...packed.pieces.map(p=>({...p,y:p.y+top})));layout.w=Math.max(layout.w,packed.w);y+=packed.h-128+96;
  }
  layout.h=y;layout.html=html;return layout;
 };
 out.chicken=true;}}catch(e){}
// Spades: you + one person + two Ohana Robots
try{if(typeof ohanaStartPlan==='function'&&typeof ohanaStartSubmit==='function'){
 const plan0=ohanaStartPlan,sub0=ohanaStartSubmit;
 ohanaStartPlan=function(state,sy){
  if(state&&state.opponent==='bot2'){
   if(state.game!=='spades')throw new Error('Two robots is for Spades.');
   const members=ohanaStartPeople(sy),ids=[...new Set(state.people||[])];
   if(ids.length!==1)throw new Error('Choose 1 person to be your partner.');
   if(!members.some(p=>p.id===ids[0]))throw new Error('Please choose someone from this room.');
   return {type:'spades',opponent:'bot2',difficulty:'easy',max_players:2,mode:'robots2'};
  }
  return plan0.apply(this,arguments);
 };
 ohanaStartSubmit=async function(state,sy,request){
  if(!(state&&state.opponent==='bot2'))return sub0.apply(this,arguments);
  request=request||api;
  if(state.uncertain)throw new Error('We could not confirm the game. Check Your games before starting another.');
  const plan=ohanaStartPlan(state,sy);
  if(!state.table){let result;try{result=await request('/api/game/create',plan,'POST',state.room);}catch(error){state.uncertain=true;throw error;}if(!Number.isInteger(result?.id)||result.id<1){state.uncertain=true;throw new Error('We could not confirm the game. Check Your games before starting another.');}state.table=result.id;}
  state.sent||=[];
  for(const id of state.people)if(!state.sent.includes(id)){await request('/api/game/'+state.table+'/invite',{member_id:id},'POST',state.room);state.sent.push(id);}
  return state.table;
 };
 out.spades2=true;}}catch(e){}
out.ok=out.chicken&&out.spades2;
window.ohanaThreeGames=out;
})();
