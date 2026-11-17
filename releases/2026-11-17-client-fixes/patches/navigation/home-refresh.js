// Refresh only live porch controls. Keep the mounted scene, header, scroll and unrelated activity intact.
function refreshOhanaHomeInPlace(){
 if(!S.token||!S.me||S.tab!=='games'||!['mine',undefined,null,''].includes(S.gameShelf)||S.game||S.granny||S.colorBook||PZ.id||PZ.lobby||document.querySelector('#pp-frame'))return false;
 const main=document.getElementById('main'),section=document.getElementById('ohana-home-games');if(!main||!section||!main.contains(section))return false;
 // Do not remove a focused game link while a keyboard/touch action is in progress.
 const focused=document.activeElement;if(section.contains(focused)||focused?.closest?.('.ohana-home-actions')||typeof OhanaFresh!=='undefined'&&Date.now()-(OhanaFresh.interaction||0)<750){S.homeRefreshPending=true;return true;}
 const scrollX=window.scrollX,scrollY=window.scrollY;
 mountOhanaHomeGames(main,section.parentElement,null);S.homeRefreshPending=false;
 if(window.scrollX!==scrollX||window.scrollY!==scrollY)window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});
 const count=(S.sync?.allGames||S.sync?.games||[]).filter(g=>g.my_turn).length;document.title=(count?'('+count+') ':'')+'Ohana Home';
 return true;
}
