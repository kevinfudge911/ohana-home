// Keep presentation state across background sync renders, never across navigation or identity.
const OhanaHomeGamesView=(()=>{
 let owner=null,expanded=false;
 const context=()=>[S.token,S.me?.id,S.room,S.roomEpoch];
 const onPorch=()=>!!S.token&&!!S.me&&S.tab==='games'&&(!S.gameShelf||S.gameShelf==='mine')&&!S.game&&!S.granny&&!S.colorBook&&!PZ.id&&!PZ.lobby;
 const clear=()=>{owner=null;expanded=false;};
 function read(){const now=context();if(!onPorch()||!owner||!owner.every((v,i)=>Object.is(v,now[i]))){clear();return false;}return expanded;}
 function set(value){if(!onPorch()){clear();return;}owner=context();expanded=!!value;}
 return{read,set,clear};
})();
