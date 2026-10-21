// Ohana's shared standard-card table. Only registered rules can create a game.
// Card identities are stable across drawing, arranging and reconnects.
export const SHUFFLE_RULES = Object.freeze({
  rummy: { name: 'Regular Rummy', min: 2, max: 6, family: 'meld', target: 100 },
  gin: { name: 'Gin Rummy', min: 2, max: 2, family: 'knock', target: 100 }
});
function secureRandom() { return crypto.getRandomValues(new Uint32Array(1))[0]/4294967296; }
export function shuffleMode(mode) {
  if (!Object.hasOwn(SHUFFLE_RULES, mode)) throw Error('Choose an implemented card-table game: Regular Rummy or Gin Rummy.');
  return mode;
}
export function cardRank(card) { return Number(card.slice(1)); }
export function cardPoints(card) { return Math.min(10, cardRank(card)); }
const points = cards => cards.reduce((sum, card) => sum + cardPoints(card), 0);
export function standardDeck() { return ['C','D','H','S'].flatMap(suit => Array.from({length:13}, (_, i) => suit+(i+1))); }
function shuffledDeck(random) {
  const deck = standardDeck();
  for (let i=deck.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; }
  return deck;
}
export function isCardMeld(cards) {
  if (!Array.isArray(cards) || cards.length<3 || new Set(cards).size!==cards.length || !cards.every(c=>/^[CDHS](?:[1-9]|1[0-3])$/.test(c))) return false;
  if (cards.length<=4 && cards.every(c=>cardRank(c)===cardRank(cards[0]))) return true;
  const sorted=[...cards].sort((a,b)=>cardRank(a)-cardRank(b));
  return sorted.every((c,i)=>c[0]===sorted[0][0] && (!i || cardRank(c)===cardRank(sorted[i-1])+1));
}
// Enumerate every disjoint arrangement: a greedy meld choice can overcount deadwood.
export function cardPartitions(hand) {
  const melds=[];
  const add=cards=>melds.push({cards,mask:cards.reduce((mask,c)=>mask|(1<<hand.indexOf(c)),0)});
  for(let rank=1;rank<=13;rank++) {
    const cards=hand.filter(c=>cardRank(c)===rank);
    if(cards.length>=3) {
      add(cards);
      if(cards.length===4)for(let i=0;i<4;i++)add(cards.filter((_,j)=>j!==i));
    }
  }
  for(const suit of ['C','D','H','S']) {
    const cards=hand.filter(c=>c[0]===suit).sort((a,b)=>cardRank(a)-cardRank(b));
    for(let start=0;start<cards.length;start++)for(let end=start+1;end<cards.length;end++) {
      if(cardRank(cards[end])!==cardRank(cards[end-1])+1)break;
      if(end-start>=2)add(cards.slice(start,end+1));
    }
  }
  const partitions=[];
  function visit(start,mask,groups) {
    const deadwood=hand.filter((_,i)=>!(mask&(1<<i)));
    partitions.push({melds:groups,deadwood,points:points(deadwood)});
    for(let i=start;i<melds.length;i++) if(!(mask&melds[i].mask)) visit(i+1,mask|melds[i].mask,[...groups,melds[i].cards]);
  }
  visit(0,0,[]);
  return partitions.sort((a,b)=>a.points-b.points || JSON.stringify(a.melds).localeCompare(JSON.stringify(b.melds)));
}
export function bestCardHand(hand) { return cardPartitions(hand)[0]; }
// Try both ends of runs, all targets and all own partitions, including chained layoffs.
function layoffBest(cards,melds,memo=new Map()) {
  const key=JSON.stringify([cards,melds]);if(memo.has(key))return memo.get(key);
  let best={points:points(cards),deadwood:cards,melds,laid:[]};
  cards.forEach((card,i)=>melds.forEach((meld,j)=>{
    if(!isCardMeld([...meld,card]))return;
    const nextMelds=melds.map((m,k)=>k===j?[...m,card]:m);
    const next=layoffBest(cards.filter((_,k)=>k!==i),nextMelds,memo);
    if(next.points<best.points)best={...next,laid:[{card,target:j},...next.laid]};
  }));memo.set(key,best);return best;
}
export function ginDefense(hand,knockerMelds,gin=false) {
  let best=null;
  for(const partition of cardPartitions(hand)) {
    const lay=gin?{points:partition.points,deadwood:partition.deadwood,laid:[],melds:knockerMelds}:layoffBest(partition.deadwood,knockerMelds);
    if(!best || lay.points<best.points)best={...lay,ownMelds:partition.melds};
  }
  return best;
}
function deal(st,players,random) {
  st.stock=shuffledDeck(random);st.hands=Object.fromEntries(players.map(p=>[p,[]]));
  const count=st.mode==='gin'||players.length===2?10:players.length<=4?7:6;
  for(let i=0;i<count;i++) for(let n=1;n<=players.length;n++)st.hands[players[(st.dealer+n)%players.length]].push(st.stock.pop());
  st.discard=[st.stock.pop()];st.melds=[];st.everPlayed={};st.turnPlayed=false;st.rummyEligible=true;
  st.drawnDiscard=null;st.openingPasses=0;st.forceStock=false;
  st.phase=st.mode==='gin'?'opening':'draw';st.nextTurn=(st.dealer+1)%players.length;
  delete st.result;
}
export function shuffleInit(players,random=secureRandom,mode='rummy') {
  shuffleMode(mode);const rules=SHUFFLE_RULES[mode];
  if(new Set(players).size!==players.length || players.some(p=>!Number.isInteger(p)||p<=0) || players.length<rules.min || players.length>rules.max)throw Error(`${rules.name} needs ${rules.min===rules.max?rules.min:rules.min+'–'+rules.max} family players.`);
  const st={version:1,mode,round:1,dealer:Math.floor(random()*players.length),scores:Object.fromEntries(players.map(p=>[p,0])),target:rules.target,revision:0};
  deal(st,players,random);return st;
}
function finishRound(st,players,winner,score,detail) {
  if(winner!==null)st.scores[winner]+=score;
  st.result={round:st.round,winner,score,...detail};st.phase='round-end';st.drawnDiscard=null;
  st.nextTurn=winner===null?(st.dealer+1)%players.length:players.indexOf(winner);
  const over=winner!==null && st.scores[winner]>=st.target;
  return {next:st.nextTurn,over,winner:over?winner:null};
}
function regularOut(st,players,p) {
  const remaining=Object.fromEntries(players.map(id=>[id,points(st.hands[id])]));
  const multiplier=st.rummyEligible?2:1;
  return finishRound(st,players,p,Object.values(remaining).reduce((a,b)=>a+b,0)*multiplier,{kind:multiplier===2?'rummy':'out',remaining,multiplier});
}
function ownCards(hand,cards) {
  if(!Array.isArray(cards)||!cards.length||new Set(cards).size!==cards.length||!cards.every(c=>hand.includes(c)))throw Error('Choose cards from your own hand, once each.');
}
function takeOut(hand,cards) { return hand.filter(c=>!cards.includes(c)); }
function engineMove(st,players,turn,move,random) {
  if(!Number.isInteger(turn)||!players[turn])throw Error('Invalid table turn.');
  if(move.revision!==st.revision)throw Error('The table changed. Refresh before playing again.');
  const p=players[turn],hand=st.hands[p],action=move.action;
  if(st.phase==='round-end') {
    if(action!=='next')throw Error('Review this round, then deal the next hand.');
    if(st.scores[p]>=st.target)throw Error('This match is finished.');
    st.dealer=st.result.winner===null?st.dealer:st.mode==='gin'||players.length===2?players.indexOf(st.result.winner):(st.dealer+1)%players.length;
    st.round++;deal(st,players,random);return {next:st.nextTurn};
  }
  if(action==='pass' && st.mode==='gin' && st.phase==='opening') {
    st.openingPasses++;st.nextTurn=(turn+1)%players.length;
    if(st.openingPasses===2){st.phase='draw';st.forceStock=true;}
    return {next:st.nextTurn};
  }
  if(action==='draw') {
    if(!['draw','opening'].includes(st.phase))throw Error('You have already drawn.');
    if(!['stock','discard'].includes(move.source))throw Error('Choose the stock or top discard.');
    if(st.phase==='opening' && move.source!=='discard')throw Error('Take the opening upcard or pass.');
    if(st.forceStock && move.source!=='stock')throw Error('Both players passed. Draw from the stock.');
    if(move.source==='discard'&&!st.discard.length)throw Error('The discard pile is empty.');
    if(move.source==='stock'&&!st.stock.length) {
      if(st.mode==='gin')throw Error('The Gin stock is exhausted.');
      if(!st.discard.length)throw Error('There are no cards to draw.');
      st.stock=[...st.discard].reverse();st.discard=[];
    }
    const card=move.source==='stock'?st.stock.pop():st.discard.pop();hand.push(card);
    st.drawnDiscard=move.source==='discard'?card:null;st.phase='play';st.forceStock=false;
    st.turnPlayed=false;st.rummyEligible=!st.everPlayed[p];return {next:turn};
  }
  if(st.phase!=='play')throw Error('Draw one card first.');
  if(action==='meld'||action==='layoff') {
    if(st.mode!=='rummy')throw Error('Gin melds stay private until you knock.');
    ownCards(hand,move.cards);
    if(action==='meld') {
      if(!isCardMeld(move.cards))throw Error('Use three or four equal ranks, or a same-suit run of at least three. Aces are low.');
      st.melds.push({owner:p,cards:[...move.cards]});
    } else {
      if(!Number.isInteger(move.target)||!st.melds[move.target]||!isCardMeld([...st.melds[move.target].cards,...move.cards]))throw Error('Those cards do not extend this meld.');
      st.melds[move.target].cards.push(...move.cards);
    }
    st.hands[p]=takeOut(hand,move.cards);st.turnPlayed=true;
    return st.hands[p].length?{next:turn}:regularOut(st,players,p);
  }
  if(action==='discard'||action==='knock') {
    ownCards(hand,[move.card]);
    if(move.card===st.drawnDiscard)throw Error('Keep the discard you just picked up; discard a different card.');
    const after=takeOut(hand,[move.card]);
    let partition;
    if(action==='knock') {
      if(st.mode!=='gin')throw Error('Knocking is only for Gin Rummy.');
      if(move.groups!==undefined) {
        if(!Array.isArray(move.groups)||move.groups.length>3)throw Error('Choose disjoint valid Gin melds.');
        const used=move.groups.flat();
        if(!move.groups.every(isCardMeld)||new Set(used).size!==used.length||!used.every(c=>after.includes(c)))throw Error('Choose disjoint valid Gin melds from your remaining cards.');
        const deadwood=takeOut(after,used);partition={melds:move.groups,deadwood,points:points(deadwood)};
      } else partition=bestCardHand(after);
      if(partition.points>10)throw Error('Knock with 10 or fewer deadwood points after discarding.');
    }
    st.hands[p]=after;st.discard.push(move.card);st.drawnDiscard=null;
    if(action==='knock') {
      const opponent=players[(turn+1)%2],gin=partition.points===0,defense=ginDefense(st.hands[opponent],partition.melds,gin);
      const undercut=!gin && defense.points<=partition.points;
      const winner=undercut?opponent:p;
      // Explicit Ohana defaults: traditional 20 gin / 10 undercut, no settlement bonuses.
      const score=gin?20+defense.points:undercut?10+partition.points-defense.points:defense.points-partition.points;
      return finishRound(st,players,winner,score,{kind:gin?'gin':undercut?'undercut':'knock',knocker:p,knockerHand:partition,defender:opponent,defense});
    }
    if(st.mode==='rummy'&&!after.length)return regularOut(st,players,p);
    if(st.mode==='gin'&&st.stock.length<=2)return finishRound(st,players,null,0,{kind:'stock',note:'Two cards remain in the stock. No points; same dealer.'});
    if(st.turnPlayed)st.everPlayed[p]=true;
    st.phase='draw';st.nextTurn=(turn+1)%players.length;return {next:st.nextTurn};
  }
  throw Error('That action is not available in this card game.');
}
// Validate on a copy: rejected combinations never partially change a table.
export function shuffleMove(st,players,turn,move,random=secureRandom) {
  const next=structuredClone(st);const result=engineMove(next,players,turn,move,random);
  next.revision++;Object.assign(st,next);if(!next.result)delete st.result;return result;
}
export function shuffleView(st,viewer) {
  // An allowlist protects stock order, other hands and the identity of a private draw.
  const reveal=st.phase==='round-end';
  return {version:st.version,mode:st.mode,round:st.round,dealer:st.dealer,phase:st.phase,revision:st.revision,target:st.target,
    scores:st.scores,melds:st.melds,stock:st.stock.length,discard:st.discard.length?st.discard.at(-1):null,discardCount:st.discard.length,
    hands:Object.fromEntries(Object.entries(st.hands).map(([p,hand])=>[p,reveal||String(viewer)===p?[...hand]:hand.length])),
    drawnDiscard:String(viewer)===String(st.lastPlay?.p)?st.drawnDiscard:null,
    openingPasses:st.openingPasses,forceStock:st.forceStock,result:st.result||null,
    lastPlay:st.lastPlay?{p:st.lastPlay.p,at:st.lastPlay.at}:null};
}
