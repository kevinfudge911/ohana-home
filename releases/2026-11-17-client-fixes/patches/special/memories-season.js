(()=>{
 const sync=()=>{let season='normal';try{if(typeof M!=='undefined'&&M.me?.id&&M.token){season=localStorage.getItem('ohana_seasonal_appearance_v1_'+M.me.id)==='normal'?'normal':'thanksgiving';}}catch{}if(document.documentElement.dataset.ohanaSeason!==season)document.documentElement.dataset.ohanaSeason=season;};
 let pending=0;const queue=()=>{if(!pending)pending=requestAnimationFrame(()=>{pending=0;sync();});};
 const observer=new MutationObserver(queue);observer.observe(document.body,{childList:true,subtree:true});
 window.addEventListener('storage',queue);window.addEventListener('pageshow',()=>{observer.observe(document.body,{childList:true,subtree:true});queue();});window.addEventListener('pagehide',()=>{observer.disconnect();cancelAnimationFrame(pending);pending=0;});sync();
})();
