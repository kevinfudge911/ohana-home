// A rank shortcut, not a second rules engine. The normal server move validates play.
function hfQuickMeldPlan(hand,selectedIds,rank,melds,opening,choices={}){
 if(['2','Joker'].includes(rank))return null; // Wilds still need an explicit destination.
 const ids=new Set(selectedIds);
 for(const c of hand)if(c.rank===rank&&!(c.rank==='3'&&['♥','♦'].includes(c.suit)))ids.add(c.id);
 const cards=hand.filter(c=>ids.has(c.id)),selected=cards.map(c=>c.id);
 if(rank==='3')return {selected,ready:false,message:'Matching black threes selected. Use Meld when your final-foot requirements are met.'};
 let groups;try{groups=autoHandFootMelds(cards,melds,null,choices);}catch(e){return {selected,ready:false,message:e.message};}
 const value=c=>c.rank==='Joker'?50:['A','2'].includes(c.rank)?20:['8','9','10','J','Q','K'].includes(c.rank)?10:5;
 const points=cards.reduce((n,c)=>n+value(c),0);
 if(!melds.length&&points<opening)return {selected,ready:false,message:'Matching cards selected: '+points+' of '+opening+' opening points. Add another set, then Meld.'};
 return {selected,ready:groups.length>0};
}
function hfQuickTap(previous,rank,key,now,pointerClick){
 if(!pointerClick||['2','Joker'].includes(rank))return {double:false,next:null};
 const double=!!previous&&previous.rank===rank&&previous.key===key&&now>=previous.time&&now-previous.time<=450;
 return {double,next:double?null:{rank,key,time:now}};
}
