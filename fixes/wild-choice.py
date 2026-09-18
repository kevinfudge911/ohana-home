from pathlib import Path
import sys
root=Path(sys.argv[1]);p=next(root.glob('*-app.html'));s=p.read_text()
def rep(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b)
helper='''
function chooseWildValue(kind,current={}){
 return new Promise(resolve=>{
  const d=document.createElement('dialog');d.className='wild-choice';
  const ranks=kind==='hf'?['A','4','5','6','7','8','9','10','J','Q','K']:Array.from({length:12},(_,i)=>String(i+1));
  d.innerHTML=`<form method="dialog"><h2>Use this wild as…</h2><p>Choose the card it represents.</p><label>Number or rank<select name="rank">${ranks.map(r=>`<option ${String(current.rank||current.n)===r?'selected':''}>${r}</option>`).join('')}</select></label>${kind==='o10'?`<label>Color<select name="color">${['coral','ocean','sun','leaf'].map(c=>`<option ${current.color===c?'selected':''}>${c}</option>`).join('')}</select></label>`:''}<div><button value="cancel">Cancel</button><button value="choose">Use this card</button></div></form>`;
  document.body.append(d);d.addEventListener('close',()=>{const f=d.querySelector('form'),result=d.returnValue==='choose'?(kind==='hf'?{rank:f.elements.rank.value}:{n:+f.elements.rank.value,color:f.elements.color.value}):null;d.remove();resolve(result);},{once:true});d.showModal();
 });
}
function wildChoiceTray(cards,choices,kind){return cards.filter(c=>kind==='hf'?['2','Joker'].includes(c.rank):c.wild).map(c=>{const a=choices[c.id];return `<button type="button" data-wild-edit="${c.id}">Wild → ${a?(kind==='hf'?esc(a):a.n+' '+esc(a.color)):'Choose value'}</button>`;}).join('');}
'''
rep('function autoHandFootMelds(cards,melds,target=null){',helper+'\nfunction autoHandFootMelds(cards,melds,target=null,choices={}){')
rep("wilds=cards.filter(wild),natural=cards.filter(c=>!wild(c));","wilds=cards.filter(c=>wild(c)&&!choices[c.id]),natural=cards.filter(c=>!wild(c));")
rep("let ranks=[...new Set(natural.map(c=>c.rank))];","let ranks=[...new Set([...natural.map(c=>c.rank),...cards.filter(c=>wild(c)&&choices[c.id]).map(c=>choices[c.id])])];")
rep("selected=natural.filter(c=>c.rank===rank),all=", "selected=cards.filter(c=>wild(c)?choices[c.id]===rank:c.rank===rank),all=")
rep('function handFootPickupMelds(hand,selectedIds,melds,top,target=null){','function handFootPickupMelds(hand,selectedIds,melds,top,target=null,choices={}){')
rep('],melds,target);','],melds,target,choices);')
rep(' const me=S.me.id,inFoot=', ' S.hfWild=S.hfWild||{};\n const me=S.me.id,inFoot=')
rep('S.hfMeldTarget=null;};','S.hfMeldTarget=null;S.hfWild={};};')
rep("root.querySelectorAll('[data-cid]').forEach(b=>b.onclick=()=>{const id=+b.dataset.cid;S.hfSel=S.hfSel.includes(id)?S.hfSel.filter(x=>x!==id):[...S.hfSel,id];renderHandFoot(st,g,myTurn);});", """root.querySelectorAll('[data-cid]').forEach(b=>b.onclick=async()=>{const id=+b.dataset.cid;if(S.hfSel.includes(id)){S.hfSel=S.hfSel.filter(x=>x!==id);delete S.hfWild[id];}else{const c=hand.find(c=>c.id===id);if(wild(c)){const a=await chooseWildValue('hf',{rank:S.hfWild[id]||melds[S.hfMeldTarget]?.rank});if(!a)return;S.hfWild[id]=a.rank;}S.hfSel.push(id);}renderHandFoot(st,g,myTurn);});
 root.querySelectorAll('[data-wild-edit]').forEach(b=>b.onclick=async()=>{const id=+b.dataset.wildEdit,a=await chooseWildValue('hf',{rank:S.hfWild[id]});if(a){S.hfWild[id]=a.rank;renderHandFoot(st,g,myTurn);}});""")
rep('S.hfMeldTarget=S.hfMeldTarget===+b.dataset.mi?null:+b.dataset.mi;renderHandFoot',"S.hfMeldTarget=+b.dataset.mi;for(const c of hand.filter(c=>S.hfSel.includes(c.id)&&wild(c)))S.hfWild[c.id]=melds[S.hfMeldTarget].rank;renderHandFoot")
rep('melds[S.hfMeldTarget]?.rank);','melds[S.hfMeldTarget]?.rank,S.hfWild);')
rep('<div class="hf-staged" aria-live="polite">','<div class="wild-assignments">${wildChoiceTray(hand.filter(c=>S.hfSel.includes(c.id)),S.hfWild,\'hf\')}</div><div class="hf-staged" aria-live="polite">')
rep('Wild cards fit automatically.','Choose each wild’s rank. Tap a pile to assign selected wilds to that pile.')
rep('To add only wild cards to a particular existing meld, select that meld first.','Tap a wild and choose its rank. Tap a meld to assign selected wilds to that pile, then press Meld. Wild assignments can be changed before playing. Keep your final foot card to discard.')
# Ohana 10: explicit assignments travel in move payloads.
rep('function renderOhana10(st,g,myTurn){','function renderOhana10(st,g,myTurn){\n S.o10Wild=S.o10Wild||{};')
rep("b.onclick=()=>{if(!myTurn||Date.now()<(S.o10IgnoreClickUntil||0))return;S.o10Sel=S.o10Sel.includes(id)?S.o10Sel.filter(x=>x!==id):[...S.o10Sel,id];rerender();};", """b.onclick=async()=>{if(!myTurn||Date.now()<(S.o10IgnoreClickUntil||0))return;if(S.o10Sel.includes(id)){S.o10Sel=S.o10Sel.filter(x=>x!==id);delete S.o10Wild[id];}else{const c=hand.find(c=>c.id===id);if(c.wild){const a=await chooseWildValue('o10',S.o10Wild[id]);if(!a)return;S.o10Wild[id]=a;}S.o10Sel.push(id);}rerender();};""")
rep("cardIds:[...S.o10Sel],...(st.completed", "cardIds:[...S.o10Sel],wildAssignments:S.o10Wild,...(st.completed")
rep('S.o10Sel=[];S.o10Target=null;', 'S.o10Sel=[];S.o10Target=null;S.o10Wild={};')
rep('<div class="o10-hand"','<div class="wild-assignments">${wildChoiceTray(hand.filter(c=>S.o10Sel.includes(c.id)),S.o10Wild,\'o10\')}</div><div class="o10-hand"')
rep("$('#board').querySelectorAll('[data-o10-target]').forEach", "$('#board').querySelectorAll('[data-wild-edit]').forEach(b=>b.onclick=async()=>{const id=+b.dataset.wildEdit,a=await chooseWildValue('o10',S.o10Wild[id]);if(a){S.o10Wild[id]=a;rerender();}});\n $('#board').querySelectorAll('[data-o10-target]').forEach")
# Persisted wilds show chosen identity, while retaining star character artwork.
rep("${c.wild?'★':c.n}</span>","${c.wild?(c.wildAs?'★ '+c.wildAs.n:'★'):c.n}</span>${c.wildAs?'<span class=\"wild-played-label\">'+esc(c.wildAs.color)+'</span>':''}")
rep('</head>','''<style>
.wild-choice{max-width:min(420px,94vw);padding:22px;border-radius:22px}.wild-choice h2{font-size:25px}.wild-choice label{display:block;margin:14px 0;font-weight:800}.wild-choice select{display:block;width:100%;min-height:48px;font-size:20px}.wild-choice form>div{display:flex;gap:12px;justify-content:flex-end}.wild-assignments{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.wild-assignments button{font-size:15px;padding:8px 12px;background:#fff4c9;color:#163d4b;border:2px solid #bf8734}.wild-played-label{position:absolute;top:6%;left:10%;right:10%;font:bold 11px Arial;color:white;text-shadow:0 1px #123}
</style></head>''')
rep('Ohana Stars are wild.','Ohana Stars are wild. Tap a Star to choose its number and color. You can edit that choice before playing. After completing your journey, tap a played group to choose where the selected cards go, then tap Meld.')
p.write_text(s)
# Server keeps physical wild status/score and validates represented number/color.
p=root/'worker.js';s=p.read_text()
rep('function o10PartValid(cards, part) {','''function o10Effective(c){return c.wild && c.wildAs ? {...c,n:c.wildAs.n,color:c.wildAs.color,wild:false}:c;}
function o10AssignCards(cards, assignments={}){
 return cards.map(c=>{if(!c)return c;const a=assignments[c.id];if(!a)return {...c};if(!c.wild||!Number.isInteger(a.n)||a.n<1||a.n>12||!O10_COLORS.includes(a.color))throw Error("Choose a valid number and color for each wild.");return {...c,wildAs:{n:a.n,color:a.color}};});
}
function o10PartValid(cards, part) {''')
rep('  const naturals = cards.filter((c) => !o10Wild(c));\n  if (!naturals.length) return false;', '  if (!cards.some(c=>!o10Wild(c))) return false;\n  const naturals = cards.map(o10Effective).filter((c) => !o10Wild(c));\n  if (!naturals.length) return false;')
rep('const trial = [...meld.cards, card], naturals = meld.cards.filter((c) => !o10Wild(c));','const trial = [...meld.cards, card], naturals = meld.cards.map(o10Effective).filter((c) => !o10Wild(c));\n  card=o10Effective(card);')
rep('const cards = ids.map((id) => st.hands[p].find((c) => c.id === id));','const cards = o10AssignCards(ids.map((id) => st.hands[p].find((c) => c.id === id)),move.wildAssignments);')
rep('cards = ids.map((id) => hand.find((c) => c.id === id));','cards = o10AssignCards(ids.map((id) => hand.find((c) => c.id === id)),move.wildAssignments);')
rep('(card.wild || rest[j].wild || card.n === rest[j].n)', '(o10Wild(o10Effective(card)) || o10Wild(o10Effective(rest[j])) || o10Effective(card).n === o10Effective(rest[j]).n)')
p.write_text(s)
print('Applied explicit wild choices')
