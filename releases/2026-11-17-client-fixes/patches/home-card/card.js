function mountHomeProfileCard(shelf){
 if(!S.me?.id)return null;
 let card=shelf.querySelector(':scope > #ohana-home-profile-card');
 if(!card){card=document.createElement('article');card.id='ohana-home-profile-card';card.className='ohana-home-profile-card';shelf.prepend(card);}
 const identity=String(S.token)+'|'+String(S.me.id)+'|'+String(S.room),signature=JSON.stringify([S.me.id,S.me.name,S.me.avatar]);
 if(card._profileIdentity===identity&&card.dataset.profileSignature===signature)return card;
 card._profileIdentity=identity;card.dataset.profileSignature=signature;
 const owner=S.me.id,token=S.token,room=S.room;card.replaceChildren();
 const button=document.createElement('button');button.type='button';button.className='home-profile-card-open';button.setAttribute('aria-label','Open your profile, character and outfits');
 const art=document.createElement('div');art.className='home-profile-card-art';art.setAttribute('aria-hidden','true');art.innerHTML=worldPortrait(owner);
 art.querySelectorAll('[data-dm]').forEach(el=>{el.removeAttribute('data-dm');el.removeAttribute('role');el.removeAttribute('tabindex');el.removeAttribute('title');});art.querySelector('.world-nameplate')?.remove();art.querySelectorAll('.world-seat > small').forEach(el=>el.remove());
 const foot=document.createElement('div');foot.className='home-profile-card-foot';const title=document.createElement('h2');title.textContent='Profile';const name=document.createElement('p');name.textContent=S.me.name||'Your character';const cue=document.createElement('span');cue.textContent='Your character, outfits & about you';foot.append(title,name,cue);button.append(art,foot);
 button.onclick=()=>{if(card.isConnected&&S.token===token&&S.me?.id===owner&&S.room===room)openMemberProfile(owner);};card.append(button);return card;
}
