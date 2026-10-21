// Research import only. Supply the downloaded public Pagat alphabetical index.
// Names/player/deck facts and direct rules URLs; never copy rules prose or game code.
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require(process.env.OHANA_JSDOM_PATH||'jsdom');
const doc=new JSDOM(fs.readFileSync(process.argv[2],'utf8')).window.document;
const families={
 'Meld & draw':['Canasta','Burraco Italian','Contract Rummy','Crazy Rummy','Rummy Indian','Rummy 500','Samba','Tonk','Conquian','Seven Bridge','Scala Quaranta','Three-Thirteen Rummy','Manipulation Rummy','Arlington','Tong Its','Hoola'],
 'Trick taking':['Bridge','Contract Bridge','Chicago Bridge','Rubber Bridge','Bid Whist','Whist classic','Whist two-player','Whist Minnesota','Whist Israeli','Solo Whist','German Whist','Knock-Out Whist','Hearts','Cancellation Hearts','Spot Hearts','Turbo Hearts','Spades','Euchre','Bid Euchre','Skat','Piquet','Oh Hell!','Ninety-Nine','Pitch','Court Piece','Call Bridge','Auction Forty-Fives','Five Hundred','Nap'],
 'Shedding & matching':['Crazy Eights','Crazy Eights Countdown','Big Two','President','Spit','Speed','California Speed','Fan Tan','Kings Corners','Durak Podkidnoy','Durak Perevodnoy','Switch','Tiến Lên'],
 'Collecting & comparing':['Go Fish','Old Maid','War','War Syrian','Golf','Scat','Cribbage five-card','Cribbage six-card','Cribbage partnership','Spoons Pig','Kemps','Cheat see Bullshit','Snap','Slapjack','Beggar My Neighbour','Egyptian Ratscrew','Stealing Bundles'],
 'Capture & layout':['Casino','Casino Dominican','Royal Casino','Escoba','Scopa','Scopa d\'Assi','Scopa di Quindici','Scopa Bazzica','Russian Bank','Double Solitaire','Spite and Malice','Seep']
};
const notes={
 'Meld & draw':'Distinct opening, pickup and scoring rules; requires a dedicated rules adapter.',
 'Trick taking':'Needs its own bidding/trump, follow-suit and trick-scoring rules.',
 'Shedding & matching':'Needs game-specific matching, passing and finish conditions.',
 'Collecting & comparing':'Needs its own requests, captures, comparison or counting rules.',
 'Capture & layout':'Needs game-specific capture or layout validation and scoring.'
};
const wanted=new Map(Object.entries(families).flatMap(([family,names])=>names.map(name=>[name,family]))),records=[];
for(const tr of doc.querySelectorAll('tr')){
 const cells=[...tr.querySelectorAll('td')];if(cells.length<4)continue;
 const vals=cells.map(c=>c.textContent.trim().replace(/\s+/g,' ')),family=wanted.get(vals[0]);
 if(!family||!vals[1]||!vals[3])continue;
 const anchor=cells[0].querySelector('a[href]');if(!anchor)continue;
 const source=new URL(anchor.getAttribute('href'),'https://www.pagat.com/alpha/').href;
 records.push({id:vals[0].toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:vals[0]==='Cheat see Bullshit'?'Cheat':vals[0],family,players:vals[1],deck:vals[3],status:'rules-only',source,note:vals[0]==='Canasta'?'Classic Canasta is a future adapter. Existing Ohanda & Foot remains separate.':vals[0]==='Spades'?'Ohana Mike’s is already playable on its existing table. Shared-table Spades is not implemented.':vals[0]==='Rummy 500'?'Meld-value scoring and discard pickup differ from basic Rummy.':vals[0]==='Escoba'||vals[0].startsWith('Scopa')?'Traditionally a 40-card Latin pack; adapting standard cards needs explicit suit/rank mapping.':notes[family]});
 wanted.delete(vals[0]);
}
records.sort((a,b)=>a.name.localeCompare(b.name));
fs.writeFileSync(path.join('live','shuffle-catalog.json'),JSON.stringify({researched:'2026-10-19',source:'https://www.pagat.com/alpha/',deckNotation:'52 means one full standard deck; 2x52 means two decks; +J means jokers; smaller counts require removed ranks. Comma-separated options belong to different variants.',records},null,2)+'\n');
console.log(JSON.stringify({records:records.length,unmatched:[...wanted.keys()]}));
