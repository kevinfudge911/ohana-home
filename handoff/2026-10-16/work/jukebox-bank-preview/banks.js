let titleBank=0,titleBankKey='',titleBankSize=6;
const bankNav=document.createElement('nav');bankNav.className='tunes-bank-nav';bankNav.setAttribute('aria-label','Song title banks');
const bankPrevious=document.createElement('button'),bankNext=document.createElement('button'),bankStatus=document.createElement('span');
bankPrevious.type=bankNext.type='button';bankPrevious.textContent='◀ Titles';bankNext.textContent='Titles ▶';bankPrevious.setAttribute('aria-label','Previous title bank');bankNext.setAttribute('aria-label','Next title bank');bankStatus.setAttribute('role','status');bankNav.append(bankPrevious,bankStatus,bankNext);songs.after(bankNav);
const flipBank=direction=>{titleBank=Math.max(0,titleBank+direction);renderReader();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)songs.animate([{opacity:.2,transform:'translateX('+direction*10+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:180,easing:'ease-out'})};bankPrevious.onclick=()=>flipBank(-1);bankNext.onclick=()=>flipBank(1);
const cabinetRail=document.createElement('div');cabinetRail.className='tunes-cabinet-rail';cabinetRail.append(existingTransport,choices,vol);reader.append(cabinetRail);
const libraryDrawer=document.createElement('details');libraryDrawer.className='tunes-library-drawer';const libraryLabel=document.createElement('summary');libraryLabel.textContent='Library';libraryDrawer.append(libraryLabel,addSong,addList,mineToggle);bar.append(libraryDrawer);
addEventListener('resize',()=>{if(!full.hidden)renderReader()});
