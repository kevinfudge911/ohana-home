from pathlib import Path
import sys
root=Path(sys.argv[1]);worker=root/'worker.js';app=next(root.glob('*app.html'))
s=worker.read_text()
needle='    const same = extra.filter((m) => m.rank === topRank).flatMap((m) => m.cardIds || []);'
assert s.count(needle)==1
s=s.replace(needle,'''    // The opening must be funded by cards already held, never by the pile.
    const ownIds = new Set(matching.map((c) => c.id));
    for (const group of extra) {
      if (!Array.isArray(group.cardIds) || !group.cardIds.length) throw new Error("Choose cards for each meld.");
      for (const id of group.cardIds) {
        if (!hand.some((c) => c.id === id)) throw new Error("Only cards already in your hand can open from the discard pile.");
        ownIds.add(id);
      }
    }
    const ownPoints = hand.filter((c) => ownIds.has(c.id)).reduce((sum, c) => sum + hfCardVal(c), 0);
    const openingMinimum = hfOpening(st, p);
    if (!st.melds[p].length && ownPoints < openingMinimum) throw new Error("To open from the discard pile, meld " + openingMinimum + " points from your hand; your selected hand cards total " + ownPoints + ". Discard-pile cards do not count toward opening.");
'''+needle)
worker.write_text(s)
s=app.read_text()
needle='function hfCardShape(foot){'
assert s.count(needle)==1
s=s.replace(needle,'''function handFootPickupMelds(hand,selectedIds,melds,top,target=null){
 if(!top)throw Error('The discard pile is empty. Draw 2 instead.');
 if(['2','Joker','3'].includes(top.rank))throw Error('The pile is blocked. Draw 2 instead.');
 const matching=hand.filter(c=>c.rank===top.rank&&!['2','Joker'].includes(c.rank));
 if(matching.length<2)throw Error('Hold two natural cards matching the top discard to take the pile.');
 const chosen=new Set([...selectedIds,...matching.slice(0,2).map(c=>c.id)]);
 // Include the visible top card only to validate its immediate meld shape.
 // The server adds it; send only IDs that were already held.
 const groups=autoHandFootMelds([...hand.filter(c=>chosen.has(c.id)),top],melds,target);
 return groups.map(group=>({...group,cardIds:group.cardIds.filter(id=>id!==top.id)})).filter(group=>group.cardIds.length);
}
'''+needle)
s=s.replace("!st.hasDrawn?'Draw two cards to begin your turn.'", "!st.hasDrawn?'Draw 2, or select your melds and take the discard pile.'")
s=s.replace("!st.hasDrawn?'Draw 2 first.'", "!st.hasDrawn?(melds.length?'Select cards, then Meld & take pile—or Draw 2.':'Select opening melds worth '+opening+' points from your hand, then Meld & take pile—or Draw 2. Discard-pile cards do not count.')")
s=s.replace("${!myTurn||!st.hasDrawn||(!S.hfQueue.length&&!S.hfSel.length)?'disabled':''}>Meld${queuePoints", "${!myTurn||(!S.hfQueue.length&&!S.hfSel.length)?'disabled':''}>${st.hasDrawn?'Meld':'Meld & take pile'}${queuePoints")
needle=" root.querySelector('#hf-pickup-btn').onclick=()=>move({action:'pickup',melds:S.hfQueue},clear);"
assert s.count(needle)==1
s=s.replace(needle,""" const pickup=()=>{try{const groups=handFootPickupMelds(hand,S.hfSel,melds,top,melds[S.hfMeldTarget]?.rank);move({action:'pickup',melds:groups},clear);}catch(e){showPlayError(e.message);}};
 root.querySelector('#hf-pickup-btn').onclick=pickup;""")
s=s.replace(" root.querySelector('#hf-submit').onclick=()=>{\n try{", " root.querySelector('#hf-submit').onclick=()=>{\n if(!st.hasDrawn){pickup();return;}\n try{")
s=s.replace('Draw two, then build groups of matching ranks.', 'Begin by drawing two or by taking the discard pile with an immediate valid meld. To open from the pile, the cards you lay from your hand must meet the opening points; cards from the pile do not count. Each joker is worth 50 points.')
s=s.replace('Select all the cards you want to meld and press Meld once.', 'Select all the cards you want to meld. Before drawing, press Meld &amp; take pile to open and collect the pile together; after drawing, press Meld.')
s=s.replace('Discard-pile pickup requires two matching natural cards and an immediate valid meld; take the entire discard pile (our Ohana house rule).', 'Discard-pile pickup requires two natural cards in your hand matching the top discard and an immediate valid meld. Select any additional opening groups from your hand, then press Meld &amp; take pile or tap the discard pile. Take the entire pile (our Ohana house rule).')
# The How to Play dialog uses the table-specific guide above.
app.write_text(s)
print('Patched selected-card pickup, own-hand opening validation, and instructions.')
