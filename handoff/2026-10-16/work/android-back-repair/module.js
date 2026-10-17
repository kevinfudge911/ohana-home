(()=>{'use strict';
if(window.__ohanaOverlayNavigation)return;window.__ohanaOverlayNavigation=true;
const nativeShow=HTMLDialogElement.prototype.showModal,nativePlainShow=HTMLDialogElement.prototype.show,nativeClose=HTMLDialogElement.prototype.close;const entries=new Map(),guardedHomes=new WeakSet(),homeObservers=new WeakMap();let serial=0,handling=false;
const marker=state=>state&&typeof state==='object'?state.ohanaOverlayNav:null;
function homeButtons(d){return [...d.querySelectorAll('button,a')].filter(e=>/^(?:←\s*)?(?:(?:back|return)\s+to\s+)?(?:Ohana\s*)?Home$/i.test((e.getAttribute('aria-label')||e.textContent||'').trim()));}
function hasHome(d){return homeButtons(d).length>0;}
function homeHistory(){if(typeof closeOhanaMemoriesShell==='function')closeOhanaMemoriesShell();const target=new URL('/',location.href);if(new URL(location.href).searchParams.get('ohana-nav-preview')==='1')target.searchParams.set('ohana-nav-preview','1');history.replaceState({ohanaScreen:true,game:null,granny:false,record:null,tab:'games'},'',target.pathname+target.search);}
function guardExistingHome(d){for(const button of homeButtons(d)){if(button.hasAttribute('data-global-overlay-home')||guardedHomes.has(button))continue;guardedHomes.add(button);button.addEventListener('click',()=>{const prior=handling;handling=true;queueMicrotask(()=>{homeHistory();handling=prior;});},true);}}
function refreshHome(d){if(!d.open)return;const added=d.querySelector('[data-global-overlay-home]');if(added&&homeButtons(d).some(b=>!b.hasAttribute('data-global-overlay-home')))added.closest('.ohana-overlay-home-row')?.remove();addHome(d);guardExistingHome(d);}
function addHome(d){
 if(hasHome(d)||d.querySelector('[data-global-overlay-home]'))return;
 const root=d.getRootNode(),roomHome=root.host?root.querySelector('button.room-home[aria-label="Back to Ohana Home"]:not([data-global-overlay-home])'):null;
 const host=document.createElement('div');host.className='ohana-overlay-home-row';host.style.cssText='display:flex;align-items:center;position:sticky;top:0;z-index:20;width:100%;min-height:44px;margin-bottom:8px;pointer-events:auto';
 let button;if(roomHome){button=roomHome.cloneNode(true);button.setAttribute('data-global-overlay-home','');host.append(button);}else{host.innerHTML=roomHomeControl('data-global-overlay-home');button=host.querySelector('button');}
 for(const [k,v] of Object.entries({position:'relative',inset:'auto',transform:'none','min-height':'44px',height:'44px','max-width':'min(220px,100%)'}))button.style.setProperty(k,v,'important');
 button.addEventListener('click',()=>{handling=true;try{d.close();for(const open of [...entries.values()].filter(x=>x.open).reverse())open.close();if(roomHome)roomHome.click();else goHomePorch();homeHistory();}finally{handling=false;}});
 d.prepend(host);
}
function finishClose(d,token){if(d.dataset.ohanaNavigationToken!==token)return;d.dataset.ohanaNavigationOpen='false';entries.delete(token);homeObservers.get(d)?.disconnect();homeObservers.delete(d);if(token&&!handling&&marker(history.state)===token)queueMicrotask(()=>{if(marker(history.state)===token)history.back();});}
function register(d){if(!d.open)return;if(d.dataset.ohanaNavigationOpen==='true'){refreshHome(d);return;}refreshHome(d);const localObserver=new MutationObserver(()=>refreshHome(d));localObserver.observe(d,{childList:true,subtree:true});homeObservers.set(d,localObserver);const token='overlay-'+Date.now().toString(36)+'-'+(++serial);d.dataset.ohanaNavigationOpen='true';d.dataset.ohanaNavigationToken=token;entries.set(token,d);if(!d.dataset.ohanaNavigationCancelBound){d.dataset.ohanaNavigationCancelBound='true';d.addEventListener('close',()=>{if(!d.open)finishClose(d,d.dataset.ohanaNavigationToken);});d.addEventListener('cancel',event=>{if(!d.open||d.dataset.ohanaNavigationOpen!=='true')return;event.preventDefault();d.close();});}const prior=history.state&&typeof history.state==='object'?history.state:{};history.pushState({...prior,ohanaOverlayNav:token},'',location.href);}
HTMLDialogElement.prototype.showModal=function(...args){const wasOpen=this.open,result=nativeShow.apply(this,args);if(!wasOpen)register(this);return result;};
if(nativePlainShow)HTMLDialogElement.prototype.show=function(...args){const wasOpen=this.open,result=nativePlainShow.apply(this,args);if(!wasOpen)register(this);return result;};
HTMLDialogElement.prototype.close=function(...args){const token=this.dataset.ohanaNavigationToken,result=nativeClose.apply(this,args);finishClose(this,token);return result;};
window.addEventListener('popstate',event=>{const wanted=marker(event.state);const open=[...entries.values()].filter(d=>d.open&&d.isConnected);const top=open.at(-1);if(top&&top.dataset.ohanaNavigationToken!==wanted){event.stopImmediatePropagation();handling=true;try{top.close();}finally{handling=false;}return;}if(wanted){const target=entries.get(wanted);if(!target?.open||!target.isConnected){event.stopImmediatePropagation();history.back();}}},true);
const observer=new MutationObserver(()=>{for(const d of document.querySelectorAll('dialog[open]'))register(d);});observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open']});for(const d of document.querySelectorAll('dialog[open]'))register(d);
})();


