// One-time, guarded source integration. Run on a fresh pre-Shuffle live checkout.
const fs=require('node:fs'),path=require('node:path');
let worker=fs.readFileSync('live/worker.js','utf8').replace(/\r\n/g,'\n');
const appPath=path.join('live',worker.match(/^import APP_HTML from "\.\/(.*?)";/m)[1]);
let app=fs.readFileSync(appPath,'utf8').replace(/\r\n/g,'\n');
function replace(source,from,to){if(source.split(from).length!==2)throw Error('Expected one anchor: '+from.slice(0,100));return source.replace(from,to);}
worker='import { shuffleMode, shuffleInit, shuffleMove, shuffleView } from "./shuffle-engine.js";\n'+worker;
worker=replace(worker,'var GAME_TYPES = {','var GAME_TYPES = {\n  shuffle: { name: "Ohana Shuffle · Card table", min: 2, max: 6, tag: "Everybody", desc: "One standard-card table. Choose Regular Rummy or Gin Rummy; browse future card-game rules." },');
worker=replace(worker,'function initState(type, players, seed, mode) {','function initState(type, players, seed, mode) {\n  if (type === "shuffle") return shuffleInit(players, undefined, mode);');
worker=replace(worker,'async function applyMove(type, st, players, turnIdx, move, db) {','async function applyMove(type, st, players, turnIdx, move, db) {\n  if (type === "shuffle") return shuffleMove(st, players, turnIdx, move);');
worker=replace(worker,'function viewState(type, st, viewer) {','function viewState(type, st, viewer) {\n  if (type === "shuffle") return shuffleView(st, viewer);');
worker=replace(worker,'    const withBot = body.opponent === "bot";\n    const max = withBot ? 2 : Math.min(gt.max, Math.max(gt.min, +body.max_players || gt.min));\n    const mode = type === "words"',`    const withBot = body.opponent === "bot";
    const cardMode = type === "shuffle" ? shuffleMode(body.mode || "rummy") : null;
    if (type === "shuffle" && body.opponent && body.opponent !== "family") throw Error("The shared card table needs family players.");
    const cardMax = cardMode === "gin" ? 2 : 6;
    if (type === "shuffle" && body.max_players !== undefined && (!Number.isInteger(body.max_players) || body.max_players < 2 || body.max_players > cardMax)) throw Error(cardMode === "gin" ? "Gin Rummy needs exactly two players." : "Regular Rummy needs two to six players.");
    const max = type === "shuffle" ? body.max_players || 2 : withBot ? 2 : Math.min(gt.max, Math.max(gt.min, +body.max_players || gt.min));
    const mode = type === "shuffle" ? cardMode : type === "words"`);
worker=replace(worker,'    if (action === "bot" && req.method === "POST") {','    if (action === "bot" && req.method === "POST") {\n      if (g.type === "shuffle") throw Error("The shared card table needs family players.");');
worker=replace(worker,'    name: GAME_TYPES[g.type]?.name || g.type,','    name: g.type === "shuffle" ? "Ohana Shuffle · " + (g.mode === "gin" ? "Gin Rummy" : "Regular Rummy") : GAME_TYPES[g.type]?.name || g.type,');
app=replace(app,'function gameSetupCard(id,sy,insideSetup=false){','function gameSetupCard(id,sy,insideSetup=false){\n if(id===\'shuffle\')return shuffleSetupCard(sy,insideSetup);');
app=replace(app,"['handfoot','Hand & Foot'],['ohana10','Ohana 10']","['shuffle','Card table'],['handfoot','Hand & Foot'],['ohana10','Ohana 10']");
app=replace(app,"['Card games',['handfoot','ohana10','spades']]","['Card games',['shuffle','handfoot','ohana10','spades']]");
app=replace(app,"['words', 'handfoot', 'spades']","['words', 'shuffle', 'handfoot', 'spades']");
app=replace(app,"shuffle:{name:'Ohana Shuffle',ids:['ohana10','handfoot','spades']","shuffle:{name:'Ohana Shuffle',ids:['shuffle','ohana10','handfoot','spades']");
app=replace(app,"function renderGame() {\n  const g = S.gstate;","function renderGame() {\n  const g = S.gstate;\n  if(g?.type==='shuffle' && g.status!=='waiting')return renderShuffleScreen(g);");
app=replace(app,"g.in_game && g.players.length === 1 && (g.created_by === meId || S.me.is_admin)","g.type !== 'shuffle' && g.in_game && g.players.length === 1 && (g.created_by === meId || S.me.is_admin)");
app=replace(app,"const EM = { mahjong:","const EM = { shuffle:'♣', mahjong:");
app=replace(app,"const mode=id==='words'?","const mode=id==='shuffle'?(cfg.mode==='gin'?'Gin Rummy':'Regular Rummy'):id==='words'?");
// Existing active-game card uses the original Shuffle entrance artwork.
app=replace(app,"({chess:'ohana-chess-beach-v3',tictac:","({shuffle:'ohana-shuffle-entrance-v1',chess:'ohana-chess-beach-v3',tictac:");
fs.writeFileSync('live/worker.js',worker);fs.writeFileSync(appPath,app);
console.log('Integrated shared card type and selector without replacing existing games.');
