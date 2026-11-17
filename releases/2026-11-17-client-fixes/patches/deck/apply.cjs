const fs=require('fs'),crypto=require('crypto');let s=fs.readFileSync(process.argv[2],'utf8');
function rep(a,b){if(s.split(a).length!==2)throw Error('Anchor mismatch '+a.slice(0,80));s=s.replace(a,b)}
rep('function o10Init(players,seed){',fs.readFileSync(__dirname+'/extra.js','utf8')+'\nfunction o10Init(players,seed){');
rep('const random=rng(seed),deck=o10Deck(random),hands={},journeys={},penalties={},completed={};for(const p of players)', 'const random=rng(seed),pack={deck:o10Deck(random),discard:[],hands:{},melds:{}};o10AddSupplement(pack,random);const deck=pack.deck,hands={},journeys={},penalties={},completed={};for(const p of players)');
rep('return{hands,deck,discard:[deck.shift()],journeys,penalties,completed,melds:', 'return{extraDeckVersion:1,hands,deck,discard:[deck.shift()],journeys,penalties,completed,melds:');
rep('const fresh=o10Init(players,seed);st.hands=fresh.hands;', 'const fresh=o10Init(players,seed);st.extraDeckVersion=1;st.hands=fresh.hands;');
rep('gameBotNames(g.type,players,names);if(!action){', 'gameBotNames(g.type,players,names);if(players.includes(me.id)&&g.type==="ohana10"&&g.status==="playing")await o10EnsureSupplement(db,g,me.id,req.headers.get(\"authorization\")?.replace(\"Bearer \",\"\")||url.searchParams.get(\"t\")||\"\");if(!action){');
fs.writeFileSync(process.argv[3],s);console.log(crypto.createHash('sha256').update(s).digest('hex'));
