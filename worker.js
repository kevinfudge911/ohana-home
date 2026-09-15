import EDDIE_PORTRAIT from "./buddy-eddie.webp";
import EDDIE_TALK from "./talk-eddie.webp";
import ISLAND_IMAGE from "./assets/ohana-island.webp";
import ISLAND_ICONS from "./island-icons.js.txt";
import SETUP_PREVIEW_HTML from "./setup-preview.html";
import OHANA_PREVIEW_HTML from "./ohana-preview.html";
import NOOK_PREVIEW_HTML from "./nook-preview.html";
import ROOMS_PREVIEW_HTML from "./rooms-preview.html";
import MORE_OTTO_PORTRAIT from "./buddy-otto.webp";
import MORE_OTTO_TALK from "./talk-otto.webp";
import MORE_PIPPA_PORTRAIT from "./buddy-pippa.webp";
import MORE_PIPPA_TALK from "./talk-pippa.webp";
import MORE_LULU_PORTRAIT from "./buddy-lulu.webp";
import MORE_LULU_TALK from "./talk-lulu.webp";
import MORE_HOOT_PORTRAIT from "./buddy-hoot.webp";
import MORE_HOOT_TALK from "./talk-hoot.webp";
import MORE_FLUTTER_PORTRAIT from "./buddy-flutter.webp";
import MORE_FLUTTER_TALK from "./talk-flutter.webp";
import MORE_ROSIE_PORTRAIT from "./buddy-rosie.webp";
import MORE_ROSIE_TALK from "./talk-rosie.webp";
import MORE_KOA_PORTRAIT from "./buddy-koa.webp";
import MORE_KOA_TALK from "./talk-koa.webp";
import MORE_MILO_PORTRAIT from "./buddy-milo.webp";
import MORE_MILO_TALK from "./talk-milo.webp";
import MORE_BAMBOO_PORTRAIT from "./buddy-bamboo.webp";
import MORE_BAMBOO_TALK from "./talk-bamboo.webp";
import MORE_COCO_PORTRAIT from "./buddy-coco.webp";
import MORE_COCO_TALK from "./talk-coco.webp";
import MORE_FINN_PORTRAIT from "./buddy-finn.webp";
import MORE_FINN_TALK from "./talk-finn.webp";
import MORE_INKY_PORTRAIT from "./buddy-inky.webp";
import MORE_INKY_TALK from "./talk-inky.webp";
import MORE_KAI_PORTRAIT from "./buddy-kai.webp";
import MORE_KAI_TALK from "./talk-kai.webp";
import MORE_FLORA_PORTRAIT from "./buddy-flora.webp";
import MORE_FLORA_TALK from "./talk-flora.webp";
import MORE_REEF_PORTRAIT from "./buddy-reef.webp";
import MORE_REEF_TALK from "./talk-reef.webp";
import BUDDIES_PREVIEW_HTML from "./buddies-preview.html";
import TALK_HONU from "./talk-honu.webp";
import TALK_SPLASH from "./talk-splash.webp";
import TALK_KIKO from "./talk-kiko.webp";
import TALK_PEBBLE from "./talk-pebble.webp";
import TALK_MANGO from "./talk-mango.webp";
import TALK_SUNNY from "./talk-sunny.webp";
import BUDDY_KIKO from "./buddy-kiko.webp";
import BUDDY_PEBBLE from "./buddy-pebble.webp";
import BUDDY_MANGO from "./buddy-mango.webp";
import BUDDY_SUNNY from "./buddy-sunny.webp";
import BUDDY_SPLASH from "./buddy-splash.webp";
import MAHJONG_PREVIEW_HTML from "./mahjong-preview.html";
import { mahjongInit, mahjongMove, mahjongFree } from "./mahjong.js";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.js
import APP_HTML from "./app.html";
import HONU_IMAGE from "./honu.webp";
import GAME_PREVIEW_HTML from "./game-preview.html";
import SCENE_JS from "./ohana-scene.js.txt";
import PORCH_DAWN from "./porch-dawn.webp";
import PORCH_DAY from "./porch-day.webp";
import PORCH_NIGHT from "./porch-night.webp";
import PORCH_PLAYED from "./porch-played.webp";
const WELCOME_IMAGE = PORCH_DAWN;

// src/games.js
function rng(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
__name(rng, "rng");
function shuffle(arr, r) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
__name(shuffle, "shuffle");
var GAME_TYPES = {
  mahjong: { name: "Ohana Mahjong", min: 1, max: 2, tag: "Everybody", desc: "Match sea turtles, flowers and island treasures. Relax solo or take turns together. 10 points per pair." },
  words: { name: "Ohana Words", min: 2, max: 4, tag: "Grown-ups & big kids", desc: "Our own Wordfeud. Random boards, hidden surprise squares (good & bad!), plus the Ohana Star." },
  tictac: { name: "Tic-Tac-Toe", min: 2, max: 2, tag: "Little ones", desc: "Three in a row wins. Quick and easy." },
  memory: { name: "Memory Match", min: 2, max: 2, tag: "Little ones", desc: "Flip two cards. Find the pairs. Most pairs wins." },
  checkers: { name: "Checkers", min: 2, max: 2, tag: "Everybody", desc: "Jump your way across the board. Kings move both ways." }
};
var DIST = { A: [9, 1], B: [2, 3], C: [2, 3], D: [4, 2], E: [12, 1], F: [2, 4], G: [3, 2], H: [2, 4], I: [9, 1], J: [1, 8], K: [1, 5], L: [4, 1], M: [2, 3], N: [6, 1], O: [8, 1], P: [2, 3], Q: [1, 10], R: [6, 1], S: [4, 1], T: [6, 1], U: [4, 1], V: [2, 4], W: [2, 4], X: [1, 8], Y: [2, 4], Z: [1, 10], "?": [2, 0] };
var LETTER_VALUES = Object.fromEntries(Object.entries(DIST).map(([k, v]) => [k, v[1]]));
var SURPRISE_POOL = [
  { type: "gift", emoji: "\u{1F381}", label: "Gift! +20" },
  { type: "gift", emoji: "\u{1F381}", label: "Gift! +20" },
  { type: "jackpot", emoji: "\u{1F48E}", label: "Jackpot! Word doubled!" },
  { type: "jackpot", emoji: "\u{1F48E}", label: "Jackpot! Word doubled!" },
  { type: "extra", emoji: "\u{1F504}", label: "Extra Turn!" },
  { type: "oops", emoji: "\u{1F480}", label: "Oops! –15" },
  { type: "oops", emoji: "\u{1F480}", label: "Oops! –15" },
  { type: "robin", emoji: "\u{1F3AF}", label: "Robin Hood! Others +10 each" },
  { type: "robin", emoji: "\u{1F3AF}", label: "Robin Hood! Others +10 each" },
  { type: "freeze", emoji: "\u{1F9CA}", label: "Freeze! Lose a tile" }
];
var N = 15;
var CENTER = 112;
function wordsInit(players, seed, mode) {
  const r = rng(seed);
  const bonus = new Array(225).fill("");
  const open = [...Array(225).keys()].filter((i) => i !== CENTER);
  shuffle(open, r);
  const plan = [["TW", 8], ["DW", 16], ["TL", 12], ["DL", 24]];
  let k = 0;
  for (const [b, n] of plan) for (let j = 0; j < n; j++) bonus[open[k++]] = b;
  const star = open[k++];
  const surpriseList = shuffle([...SURPRISE_POOL], r);
  const surprises = {};
  for (let s = 0; s < surpriseList.length && k < open.length; s++) {
    surprises[open[k++]] = { ...surpriseList[s] };
  }
  let bag = [];
  for (const [l, [n]] of Object.entries(DIST)) for (let j = 0; j < n; j++) bag.push(l);
  shuffle(bag, r);
  const racks = {}, scores = {};
  for (const p of players) {
    racks[p] = bag.splice(0, 7);
    scores[p] = 0;
  }
  return { board: new Array(225).fill(null), bonus, star, starFound: false, surprises, foundSurprises: {}, bag, racks, scores, passes: 0, history: [], lastMove: [], mode: mode || 'classic' };
}
__name(wordsInit, "wordsInit");
function wordsRefill(st, p) {
  while (st.racks[p].length < 7 && st.bag.length) st.racks[p].push(st.bag.shift());
}
__name(wordsRefill, "wordsRefill");
function collect(board, placed, i, dir) {
  const row = Math.floor(i / N), col = i % N;
  const inLine = __name((j2) => dir === 1 ? Math.floor(j2 / N) === row : true, "inLine");
  let start = i;
  while (true) {
    const prev = start - dir;
    if (prev < 0 || !inLine(prev) || !board[prev]) break;
    start = prev;
  }
  const idx = [];
  let j = start;
  while (j < 225 && inLine(j) && board[j]) {
    idx.push(j);
    j += dir;
    if (dir === 1 && j % N === 0) break;
  }
  return idx;
}
__name(collect, "collect");
async function wordsMove(st, players, turnIdx, move, db) {
  const p = players[turnIdx];
  if (move.action === "pass") {
    st.passes++;
    st.lastMove = [];
    st.history.push({ p, words: [], score: 0, note: "passed" });
    return endCheck(st, players, turnIdx);
  }
  if (move.action === "resign") {
    st.resigned = p;
    return { over: true, winner: null, next: turnIdx };
  }
  if (move.action === "swap") {
    const letters = (move.letters || []).map((l) => String(l).toUpperCase());
    if (!letters.length || st.bag.length < 7) throw new Error("You can only swap when the bag has 7 or more tiles.");
    const rack2 = [...st.racks[p]];
    for (const l of letters) {
      const k = rack2.indexOf(l);
      if (k < 0) throw new Error("That tile isn't on your rack.");
      rack2.splice(k, 1);
    }
    st.racks[p] = rack2;
    wordsRefill(st, p);
    st.bag.push(...letters);
    shuffle(st.bag, Math.random);
    st.passes++;
    st.lastMove = [];
    st.history.push({ p, words: [], score: 0, note: `swapped ${letters.length}` });
    return endCheck(st, players, turnIdx);
  }
  const pl = (move.placements || []).map((x) => ({ i: +x.i, l: String(x.l || "").toUpperCase(), blank: !!x.blank }));
  if (!pl.length) throw new Error("Place at least one tile.");
  for (const t of pl) {
    if (t.i < 0 || t.i > 224 || st.board[t.i]) throw new Error("Bad square.");
    if (!/^[A-Z]$/.test(t.l)) throw new Error("Bad letter.");
  }
  const rack = [...st.racks[p]];
  for (const t of pl) {
    const need = t.blank ? "?" : t.l;
    const k = rack.indexOf(need);
    if (k < 0) throw new Error("You don't have those tiles.");
    rack.splice(k, 1);
  }
  const rows = new Set(pl.map((t) => Math.floor(t.i / N))), cols = new Set(pl.map((t) => t.i % N));
  if (rows.size > 1 && cols.size > 1) throw new Error("Tiles must be in one straight line.");
  const board = st.board.slice();
  for (const t of pl) board[t.i] = { l: t.l, v: t.blank ? 0 : LETTER_VALUES[t.l], blank: t.blank };
  const firstMove = st.board.every((x) => !x);
  let dir;
  if (pl.length > 1) dir = rows.size === 1 ? 1 : N;
  else dir = collect(board, pl, pl[0].i, 1).length > 1 ? 1 : N;
  const main = collect(board, pl, pl[0].i, dir);
  const placedSet = new Set(pl.map((t) => t.i));
  for (const t of pl) if (!main.includes(t.i)) throw new Error("Tiles must be connected in one word, no gaps.");
  if (firstMove) {
    if (!placedSet.has(CENTER)) throw new Error("First word must cover the center star.");
    if (pl.length < 2) throw new Error("First word needs at least 2 letters.");
  } else {
    if (!main.some((i) => !placedSet.has(i)) && !pl.some((t) => {
      const cross = collect(board, pl, t.i, dir === 1 ? N : 1);
      return cross.length > 1;
    })) throw new Error("Your word must connect to a tile already on the board.");
  }
  const wordsFormed = [];
  if (main.length > 1) wordsFormed.push(main);
  for (const t of pl) {
    const cross = collect(board, pl, t.i, dir === 1 ? N : 1);
    if (cross.length > 1) wordsFormed.push(cross);
  }
  const uniq = [];
  const seen = new Set();
  for (const w of wordsFormed) {
    const key = w.join(",");
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(w);
    }
  }
  if (!uniq.length) throw new Error("That does not make a word.");
  const strs = uniq.map((w) => w.map((i) => board[i].l).join(""));
  const bad = [];
  for (const s of strs) {
    const row = await db.prepare("SELECT 1 FROM words WHERE w=?").bind(s).first();
    if (!row) bad.push(s);
  }
  if (bad.length) throw new Error(`Not in our dictionary: ${bad.join(", ")}`);
  let total = 0;
  const detail = [];
  for (const w of uniq) {
    let sum = 0, mult = 1;
    const letters = [];
    for (const i of w) {
      let v = board[i].v;
      if (placedSet.has(i)) {
        const b = st.bonus[i];
        if (b === "DL") v *= 2;
        if (b === "TL") v *= 3;
        if (b === "DW") mult *= 2;
        if (b === "TW") mult *= 3;
      }
      letters.push({letter:board[i].l,base:board[i].v,points:v,bonus:placedSet.has(i)?(st.bonus[i]||""):""});
      sum += v;
    }
    const sc = sum * mult;
    total += sc;
    detail.push({ word: w.map((i) => board[i].l).join(""), score: sc, letters, letterTotal:sum, wordMultiplier:mult });
  }
  let note = "";
  const adjustments = [];
  if (pl.length === 7) {
    total += 50;
    note = "All 7 tiles! +50";
    adjustments.push({label:note,delta:50,total});
  }
  if (!st.starFound && placedSet.has(st.star)) {
    st.starFound = true;
    total += 20;
    adjustments.push({label:"Found the Ohana Star!",delta:20,total});
    note += (note ? " \xB7 " : "") + "Found the Ohana Star! +20";
  }
  let extraTurn = false;
  for (const t of pl) {
    const surp = st.surprises[t.i];
    if (surp && !st.foundSurprises[t.i]) {
      const before=total, oldNote=note;
      st.foundSurprises[t.i] = surp;
      switch (surp.type) {
        case "gift": total += 20; note += (note ? " \xB7 " : "") + "\u{1F381} Gift! +20"; break;
        case "jackpot": total *= 2; note += (note ? " \xB7 " : "") + "\u{1F48E} Jackpot! Word doubled!"; break;
        case "extra": extraTurn = true; note += (note ? " \xB7 " : "") + "\u{1F504} Extra Turn!"; break;
        case "oops": total = Math.max(0, total - 15); note += (note ? " \xB7 " : "") + "\u{1F480} Oops! –15"; break;
        case "robin":
          for (const q of players) if (q !== p) st.scores[q] += 10;
          note += (note ? " \xB7 " : "") + "\u{1F3AF} Robin Hood! Others +10 each";
          break;
        case "freeze":
          if (rack.length > 0) {
            let maxV = -1, maxIdx = 0;
            for (let ri = 0; ri < rack.length; ri++) {
              const v = LETTER_VALUES[rack[ri]] || 0;
              if (v > maxV) { maxV = v; maxIdx = ri; }
            }
            const lost = rack.splice(maxIdx, 1)[0];
            st.bag.push(lost);
            note += (note ? " \xB7 " : "") + "\u{1F9CA} Freeze! Lost " + (lost === "?" ? "blank" : lost);
          }
          break;
      }
      adjustments.push({type:surp.type,square:t.i,label:note.slice(oldNote.length).replace(/^ · /,""),delta:total-before,total,...(surp.type==="robin"?{awards:players.filter(q=>q!==p).map(q=>({player:q,points:10}))}:{})});
    }
  }
  st.board = board;
  st.racks[p] = rack;
  wordsRefill(st, p);
  st.scores[p] += total;
  st.passes = 0;
  st.lastMove = [...placedSet];
  st.history.push({ p, words: detail, score: total, note, adjustments });

  // Random Random mode: shuffle unplayed bonus squares to new empty spots
  if (st.mode === 'random') {
    const empties = [];
    const bonusPool = [];
    for (let i = 0; i < 225; i++) {
      if (!st.board[i]) {
        if (st.bonus[i]) bonusPool.push(st.bonus[i]);
        empties.push(i);
      }
    }
    // Clear all bonuses on empty squares
    for (let i = 0; i < 225; i++) {
      if (!st.board[i]) st.bonus[i] = '';
    }
    // Redistribute bonuses randomly among empty squares
    shuffle(empties, Math.random);
    for (let b = 0; b < bonusPool.length && b < empties.length; b++) {
      st.bonus[empties[b]] = bonusPool[b];
    }
  }

  const result = endCheck(st, players, turnIdx);
  if (extraTurn && !result.over) result.next = turnIdx;
  return result;
}
__name(wordsMove, "wordsMove");
function endCheck(st, players, turnIdx) {
  const p = players[turnIdx];
  const out = st.racks[p].length === 0 && st.bag.length === 0;
  if (out || st.passes >= players.length * 3) {
    if (out) {
      let bonus = 0;
      for (const q of players) if (q !== p) {
        const rem = st.racks[q].reduce((a, l) => a + LETTER_VALUES[l], 0);
        st.scores[q] -= rem;
        bonus += rem;
      }
      st.scores[p] += bonus;
    } else for (const q of players) st.scores[q] -= st.racks[q].reduce((a, l) => a + LETTER_VALUES[l], 0);
    let best = null, tie = false;
    for (const q of players) {
      if (best === null || st.scores[q] > st.scores[best]) {
        best = q;
        tie = false;
      } else if (st.scores[q] === st.scores[best]) tie = true;
    }
    return { over: true, winner: tie ? "tie" : best, next: turnIdx };
  }
  return { over: false, next: (turnIdx + 1) % players.length };
}
__name(endCheck, "endCheck");
function wordsView(st, viewer) {
  const racks = {};
  for (const p in st.racks) racks[p] = String(p) === String(viewer) ? st.racks[p] : st.racks[p].length;
  const surpriseSquares = Object.keys(st.surprises).map(Number);
  return { ...st, racks, bag: st.bag.length, star: st.starFound ? st.star : null, surprises: surpriseSquares, foundSurprises: st.foundSurprises, mode: st.mode || 'classic' };
}
__name(wordsView, "wordsView");
function tttInit() {
  return { board: new Array(9).fill(null) };
}
__name(tttInit, "tttInit");
function tttMove(st, players, turnIdx, move) {
  const i = +move.i;
  if (!(i >= 0 && i < 9) || st.board[i]) throw new Error("Pick an empty square.");
  st.board[i] = turnIdx === 0 ? "X" : "O";
  st.last = i;
  const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, b, c] of L) if (st.board[a] && st.board[a] === st.board[b] && st.board[a] === st.board[c]) {
    st.line = [a, b, c];
    return { over: true, winner: players[turnIdx], next: turnIdx };
  }
  if (st.board.every(Boolean)) return { over: true, winner: "tie", next: turnIdx };
  return { over: false, next: 1 - turnIdx };
}
__name(tttMove, "tttMove");
var EMOJI = ["\u{1F436}", "\u{1F431}", "\u{1F438}", "\u{1F98A}", "\u{1F422}", "\u{1F419}", "\u{1F98B}", "\u{1F308}", "\u{1F355}", "\u{1F366}", "\u{1F680}", "⭐", "\u{1F33A}", "\u{1F42C}", "\u{1F984}", "\u{1F349}"];
function memInit(players, seed) {
  const r = rng(seed);
  const pick = shuffle([...EMOJI], r).slice(0, 10);
  const cards = shuffle([...pick, ...pick], r);
  const scores = {};
  for (const p of players) scores[p] = 0;
  return { cards, matched: new Array(20).fill(false), open: [], pending: [], scores };
}
__name(memInit, "memInit");
function memMove(st, players, turnIdx, move) {
  const i = +move.i;
  if (!(i >= 0 && i < 20) || st.matched[i] || st.open.includes(i)) throw new Error("Pick a face-down card.");
  st.pending = [];
  st.open.push(i);
  if (st.open.length < 2) return { over: false, next: turnIdx };
  const [a, b] = st.open;
  st.open = [];
  if (st.cards[a] === st.cards[b]) {
    st.matched[a] = st.matched[b] = true;
    st.scores[players[turnIdx]]++;
    if (st.matched.every(Boolean)) {
      const [p0, p1] = players;
      const w = st.scores[p0] === st.scores[p1] ? "tie" : st.scores[p0] > st.scores[p1] ? p0 : p1;
      return { over: true, winner: w, next: turnIdx };
    }
    return { over: false, next: turnIdx };
  }
  st.pending = [a, b];
  return { over: false, next: 1 - turnIdx };
}
__name(memMove, "memMove");
function chkInit() {
  const b = new Array(64).fill(null);
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8), c = i % 8;
    if ((r + c) % 2 === 1) {
      if (r < 3) b[i] = "b";
      else if (r > 4) b[i] = "r";
    }
  }
  return { board: b, mustContinue: null, counts: { r: 12, b: 12 } };
}
__name(chkInit, "chkInit");
function chkOwner(pc) {
  return pc ? pc.toLowerCase() : null;
}
__name(chkOwner, "chkOwner");
function chkJumps(b, i) {
  const pc = b[i];
  if (!pc) return [];
  const own = chkOwner(pc);
  const r = Math.floor(i / 8), c = i % 8;
  const out = [];
  const dirs = pc === "R" || pc === "B" ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : own === "r" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  for (const [dr, dc] of dirs) {
    const mr = r + dr, mc = c + dc, tr = r + 2 * dr, tc = c + 2 * dc;
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
    const mid = b[mr * 8 + mc];
    if (mid && chkOwner(mid) !== own && !b[tr * 8 + tc]) out.push({ to: tr * 8 + tc, over: mr * 8 + mc });
  }
  return out;
}
__name(chkJumps, "chkJumps");
function chkSteps(b, i) {
  const pc = b[i];
  const own = chkOwner(pc);
  const r = Math.floor(i / 8), c = i % 8;
  const out = [];
  const dirs = pc === "R" || pc === "B" ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : own === "r" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  for (const [dr, dc] of dirs) {
    const tr = r + dr, tc = c + dc;
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
    if (!b[tr * 8 + tc]) out.push({ to: tr * 8 + tc });
  }
  return out;
}
__name(chkSteps, "chkSteps");
function chkHasMoves(b, own) {
  for (let i = 0; i < 64; i++) if (b[i] && chkOwner(b[i]) === own && (chkJumps(b, i).length || chkSteps(b, i).length)) return true;
  return false;
}
__name(chkHasMoves, "chkHasMoves");
function chkMove(st, players, turnIdx, move) {
  const own = turnIdx === 0 ? "r" : "b";
  const b = st.board;
  const from = +move.from, to = +move.to;
  if (!b[from] || chkOwner(b[from]) !== own) throw new Error("That is not your piece.");
  if (st.mustContinue !== null && st.mustContinue !== from) throw new Error("You must keep jumping with the same piece.");
  const jumps = chkJumps(b, from);
  const j = jumps.find((x) => x.to === to);
  let jumped = false;
  if (j) {
    b[to] = b[from];
    b[from] = null;
    const cap = b[j.over];
    b[j.over] = null;
    st.counts[chkOwner(cap)]--;
    jumped = true;
  } else {
    if (st.mustContinue !== null) throw new Error("You must keep jumping.");
    const s = chkSteps(b, from).find((x) => x.to === to);
    if (!s) throw new Error("That piece cannot move there.");
    b[to] = b[from];
    b[from] = null;
  }
  const row = Math.floor(to / 8);
  let crowned = false;
  if (b[to] === "r" && row === 0) {
    b[to] = "R";
    crowned = true;
  }
  if (b[to] === "b" && row === 7) {
    b[to] = "B";
    crowned = true;
  }
  st.last = [from, to];
  if (jumped && !crowned && chkJumps(b, to).length) {
    st.mustContinue = to;
    return { over: false, next: turnIdx };
  }
  st.mustContinue = null;
  const opp = own === "r" ? "b" : "r";
  if (st.counts[opp] === 0 || !chkHasMoves(b, opp)) return { over: true, winner: players[turnIdx], next: turnIdx };
  return { over: false, next: 1 - turnIdx };
}
__name(chkMove, "chkMove");
const BOT_ID=-1;
function rememberBotCards(st){
  if(!st.bot||!st.cards)return;
  const seen=[...new Set([...(st.open||[]),...(st.pending||[])])];
  st.bot.memory=st.bot.memory||{};
  for(const i of seen)st.bot.memory[i]=st.cards[i];
  for(const i of Object.keys(st.bot.memory))if(st.matched[i])delete st.bot.memory[i];
  const keys=Object.keys(st.bot.memory),limit=st.bot.difficulty==='hard'?48:st.bot.difficulty==='medium'?10:4;
  while(keys.length>limit)delete st.bot.memory[keys.shift()];
}
const BOT_WORDS='AT TO IN IT IS AS AN ON NO SO GO DO UP US WE HE ME BE BY OR IF OF AM MY HI OH OX AX EX CAT DOG SUN SEA SKY BAY DAY WAY SAY MAY PAY RAY HAY JOY TOY BOY KEY TRY DRY FLY CRY SHY WHY YES YET SET GET LET MET NET PET WET BET SIT SAT RAT HAT BAT MAT FAT EAT ATE TEA EAR ARE ART TAR CAR FAR BAR WAR RED BED FED LED HEN PEN TEN DEN MEN MAN CAN FAN PAN RAN TAN VAN WIN WON ONE TWO SIX TEN TOP HOP POP POT HOT NOT COT DOT GOT LOT LOG LEG EGG BIG DIG PIG FIG JIG RIG BAG BUG HUG MUG RUG TUG NAP LAP MAP CAP TAP GAP ZIP ZAP ZOO BOX FOX FIX MIX TAX WAX HOME LOVE KIND PLAY GAME GOOD NICE WAVE SAND PALM FISH BIRD DUCK SEAL BOAT COAT GOAT STAR MOON BLUE PINK GOLD WARM COOL RAIN WIND SNOW SNUG SOFT HELP HOPE HUGS FUNNY HAPPY SMILE WATER SHELL BEACH HEART HOUSE CHAIR TABLE FAMILY FLOWER FRIEND TURTLE'.split(' ');
function hardTicTac(board,mark){
 const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],other=m=>m==='X'?'O':'X';
 function search(b,m,depth){for(const l of lines)if(b[l[0]]&&l.every(i=>b[i]===b[l[0]]))return b[l[0]]===mark?10-depth:depth-10;
 const empty=b.flatMap((v,i)=>v?[]:[i]);if(!empty.length)return 0;
 const scores=empty.map(i=>{const next=[...b];next[i]=m;return search(next,other(m),depth+1)});return m===mark?Math.max(...scores):Math.min(...scores);}
 return [4,0,2,6,8,1,3,5,7].filter(i=>!board[i]).map(i=>{const b=[...board];b[i]=mark;return {i,score:search(b,other(mark),0)}}).sort((a,b)=>b.score-a.score)[0].i;
}
function hardCheckers(st,players,turn,moves){
 const own=turn===0?'r':'b';
 function legal(s,t){const out=[];s.board.forEach((p,i)=>{if(p&&chkOwner(p)===(t===0?'r':'b')&&(s.mustContinue===null||s.mustContinue===i)){out.push(...chkJumps(s.board,i).map(m=>({from:i,to:m.to})));if(s.mustContinue===null)out.push(...chkSteps(s.board,i).map(m=>({from:i,to:m.to})));}});return out;}
 function evaluate(s){return s.board.reduce((v,p,i)=>!p?v:v+(chkOwner(p)===own?1:-1)*((p===p.toUpperCase()?175:100)+(chkOwner(p)==='r'?7-Math.floor(i/8):Math.floor(i/8))*3),0);}
 function search(s,t,depth){if(!depth)return evaluate(s);const options=legal(s,t);if(!options.length)return t===turn?-10000:10000;const values=options.map(m=>{const next=structuredClone(s),r=chkMove(next,players,t,m);return r.over?(r.winner===players[turn]?10000:-10000):search(next,r.next,depth-1)});return t===turn?Math.max(...values):Math.min(...values);}
 return moves.map(move=>{const next=structuredClone(st),r=chkMove(next,players,turn,move);return {move,score:r.over?10000:search(next,r.next,2)}}).sort((a,b)=>b.score-a.score)[0].move;
}
async function chooseBotMove(type,st,players,turn,db,random=Math.random){
  const pick=a=>a[Math.floor(random()*a.length)],hard=st.bot.difficulty==='hard',medium=st.bot.difficulty==='medium';
  if(type==='tictac'){
    const empty=st.board.flatMap((v,i)=>v?[]:[i]);
    if(hard)return {i:hardTicTac(st.board,turn===0?'X':'O')};
    if(medium&&random()<.75){for(const mark of ['O','X'])for(const i of empty){const b=[...st.board];b[i]=mark;if([[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(l=>l.every(j=>b[j]===mark)))return {i};}}
    return {i:pick(empty)};
  }
  if(type==='memory'){
    const available=st.cards.flatMap((_,i)=>st.matched[i]||st.open.includes(i)?[]:[i]);
    const memory=st.bot.memory||{},useMemory=hard||random()<(medium?.85:.5);
    if(useMemory&&st.open.length){const known=available.filter(i=>memory[i]===memory[st.open[0]]);if(known.length)return {i:pick(known)};}
    if(useMemory&&!st.open.length){const known=available.filter(i=>Object.hasOwn(memory,i)&&available.some(j=>j!==i&&memory[j]===memory[i]));if(known.length)return {i:pick(known)};}
    return {i:pick(available)};
  }
  if(type==='checkers'){
    const own=turn===0?'r':'b',jumps=[],steps=[];
    st.board.forEach((p,i)=>{if(p&&chkOwner(p)===own&&(st.mustContinue===null||st.mustContinue===i)){for(const m of chkJumps(st.board,i))jumps.push({from:i,to:m.to});if(st.mustContinue===null)for(const m of chkSteps(st.board,i))steps.push({from:i,to:m.to});}});
    if(hard)return hardCheckers(st,players,turn,[...steps,...jumps]);
    return pick(st.mustContinue!==null||!steps.length||(medium&&jumps.length&&random()<.7)?jumps:[...steps,...jumps]);
  }
  if(type==='mahjong'){
    const free=st.tiles.filter(t=>mahjongFree(st.tiles,t)),pairs=[];
    free.forEach((a,i)=>free.slice(i+1).forEach(b=>{if(a.face===b.face)pairs.push([a.id,b.id]);}));
    if((hard||medium)&&pairs.length){const scored=pairs.map(ids=>{const tiles=st.tiles.map(t=>ids.includes(t.id)?{...t,removed:true}:t);return {ids,score:tiles.filter(t=>mahjongFree(tiles,t)).length};}).sort((a,b)=>b.score-a.score);if(hard||random()<.7)return {action:'match',ids:scored[0].ids,revision:st.revision};}
    return pairs.length?{action:'match',ids:pick(pairs),revision:st.revision}:{action:'shuffle',revision:st.revision};
  }
  if(type==='words'){
    const rack=st.racks[BOT_ID],board=st.board,empty=!board.some(Boolean),known=new Set(BOT_WORDS),candidates=[];
    const words=shuffle(BOT_WORDS.filter(w=>w.length<=(hard?7:medium?6:4)),random);
    wordSearch: for(const word of words)for(const dir of [1,15])for(let start=0;start<225;start++){
      const end=start+(word.length-1)*dir;
      if(end>=225||(dir===1&&start%15+word.length>15))continue;
      if(start-dir>=0&&(dir===15||start%15>0)&&board[start-dir])continue;
      if(end+dir<225&&(dir===15||end%15<14)&&board[end+dir])continue;
      const remaining=[...rack],placements=[];let okay=true,connected=empty&&start<=112&&end>=112&&(dir===15?start%15===7:Math.floor(start/15)===7);
      for(let k=0;k<word.length;k++){
        const i=start+k*dir,l=word[k];if(board[i]){if(board[i].l!==l){okay=false;break;}connected=true;continue;}
        let ri=remaining.indexOf(l),blank=false;if(ri<0){ri=remaining.indexOf('?');blank=true;}if(ri<0){okay=false;break;}remaining.splice(ri,1);placements.push({i,l,blank});
        if([i-15,i+15,...(i%15>0?[i-1]:[]),...(i%15<14?[i+1]:[])].some(j=>board[j]))connected=true;
      }
      if(!okay||!connected||!placements.length)continue;
      const test=[...board];for(const p of placements)test[p.i]={l:p.l,v:0};
      for(const p of placements){const cross=collect(test,p.i,dir===1?15:1);if(cross.length>1&&!known.has(cross.map(i=>test[i].l).join(''))){okay=false;break;}}
      if(okay)candidates.push({action:'play',placements});
      if(candidates.length>=(hard?160:60))break wordSearch;
    }
    // Use ordinary words and stop at the first valid move, without optimizing bonuses or peeking at surprises.
    let best=null,bestScore=-1;
    for(const move of shuffle(candidates,random).slice(0,hard?80:8)){
      try{const trial=structuredClone(st);if(hard){trial.surprises={};trial.starFound=true;}await wordsMove(trial,players,turn,move,db);if(!hard)return move;const score=trial.history.at(-1).score;if(score>bestScore){bestScore=score;best=move;}}catch(e){if(!/dictionary|tile|word|connect|line|center|gap/i.test(e.message))throw e;}
    }
    return best||{action:'pass'};
  }
  throw new Error('No computer player for this game.');
}
async function advanceBot(env,id){
  const db=env.DB;
  for(let step=0;step<50;step++){
    const g=await db.prepare('SELECT * FROM games WHERE id=?').bind(id).first();
    if(!g||g.status!=='playing')return;
    const players=JSON.parse(g.players);if(players[g.turn]!==BOT_ID)return;
    const st=JSON.parse(g.state);if(!st.bot)return;
    const move=await chooseBotMove(g.type,st,players,g.turn,db);
    if(!move)throw new Error('Computer player has no legal move.');
    const res=await applyMove(g.type,st,players,g.turn,move,db);rememberBotCards(st);
    st.bot.moves=(st.bot.moves||0)+1;
    const saved=await db.prepare('UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=? AND state=?').bind(JSON.stringify(st),res.next,res.over?'finished':'playing',res.over?String(res.winner):null,now(),id,g.state).run();
    if(!saved.meta.changes)return;
    if(res.over||players[res.next]!==BOT_ID){
      await notifyMembers(db,players.filter(p=>p>0),{type:'turn',title:res.over?'Game complete!':'Your turn!',body:res.over?'Your game with Honu is finished.':'Honu has played. Your move!',tag:'ohana-game-'+id}).catch(()=>{});return;
    }
  }
}

function initState(type, players, seed, mode) {
  if (type === "mahjong") return mahjongInit(players, rng(seed));
  if (type === "words") return wordsInit(players, seed, mode);
  if (type === "tictac") return tttInit();
  if (type === "memory") return memInit(players, seed);
  if (type === "checkers") return chkInit();
  throw new Error("Unknown game");
}
__name(initState, "initState");
async function applyMove(type, st, players, turnIdx, move, db) {
  if (type === "mahjong") return mahjongMove(st, players, turnIdx, move);
  if (type === "words") return wordsMove(st, players, turnIdx, move, db);
  if (type === "tictac") return tttMove(st, players, turnIdx, move);
  if (type === "memory") return memMove(st, players, turnIdx, move);
  if (type === "checkers") return chkMove(st, players, turnIdx, move);
  throw new Error("Unknown game");
}
__name(applyMove, "applyMove");
function viewState(type, st, viewer) {
  if (type === "words") return wordsView(st, viewer);
  return st;
}
__name(viewState, "viewState");

// src/worker.js
var json = __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } }), "json");
var err = __name((msg, status = 400) => json({ error: msg }, status), "err");
var now = __name(() => Date.now(), "now");
function rid(n = 24) {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(rid, "rid");
async function hash(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ohana:" + s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
__name(hash, "hash");
var ONLINE_MS = 4 * 60 * 1e3;
async function getSetting(db, k) {
  const r = await db.prepare("SELECT value FROM settings WHERE key=?").bind(k).first();
  return r ? r.value : null;
}
__name(getSetting, "getSetting");
async function auth(req, env) {
  const t = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!t) return null;
  const m = await env.DB.prepare("SELECT id,name,avatar,is_admin,last_seen FROM members WHERE token=?").bind(t).first();
  if (m && (env.ADMIN_NAME || "").toLowerCase() === m.name.toLowerCase()) m.is_admin = 1;
  if (m && now() - m.last_seen > 12e4) await env.DB.prepare("UPDATE members SET last_seen=? WHERE id=?").bind(now(), m.id).run();
  return m;
}
__name(auth, "auth");
function gameRow(g, me) {
  const players = JSON.parse(g.players);
  return {
    id: g.id,
    room_id: g.room_id || 1,
    room_name: g.room_name || null,
    type: g.type,
    name: GAME_TYPES[g.type]?.name || g.type,
    players,
    max_players: g.max_players,
    status: g.status,
    turn: g.turn,
    winner: g.winner,
    created_by: g.created_by,
    updated_at: g.updated_at,
    my_turn: g.status === "playing" && players[g.turn] === me,
    in_game: players.includes(me),
    bot: g.state ? JSON.parse(g.state).bot || null : null,
    mode: g.mode || 'classic',
    score_review: players.includes(me) && g.score_review ? JSON.parse(g.score_review) : null,
    invite_code: g.invite_code || null
  };
}
__name(gameRow, "gameRow");

// ========== WEB PUSH ==========
const VAPID_PUBLIC_KEY = 'BD0GDGi2zMk91cWmhOB9CK9bLx8t53cJhTiLLm8TDSHycDV6b5ndcTUwRrzK5VstUuBkX34fSfYeT61r047zuwc';
const VAPID_PRIVATE_KEY = 'B5fR7FoT4AW0ZlOBVfKcKRt6BBhna-YXcNID4H2_Eqc';
const VAPID_SUBJECT = 'mailto:kevin.fudge911@gmail.com';

function b64urlDecode(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}
__name(b64urlDecode, "b64urlDecode");

function b64urlEncode(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
__name(b64urlEncode, "b64urlEncode");

async function createVapidJwt(audience) {
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 3600,
    sub: VAPID_SUBJECT
  };
  const encHeader = b64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encPayload = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsigned = `${encHeader}.${encPayload}`;

  // Import the private key
  const rawKey = b64urlDecode(VAPID_PRIVATE_KEY);
  const pubKey = b64urlDecode(VAPID_PUBLIC_KEY);

  // Build the JWK for ECDSA P-256
  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: b64urlEncode(pubKey.slice(1, 33)),
    y: b64urlEncode(pubKey.slice(33, 65)),
    d: b64urlEncode(rawKey),
  };

  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(unsigned));

  // Convert DER signature to raw r||s (64 bytes)
  const sigBytes = new Uint8Array(sig);
  let rawSig;
  if (sigBytes.length === 64) {
    rawSig = sigBytes;
  } else {
    rawSig = sigBytes;
  }

  return `${unsigned}.${b64urlEncode(rawSig)}`;
}
__name(createVapidJwt, "createVapidJwt");

async function encryptPayload(p256dhB64, authB64, payloadText) {
  const clientPublicKey = b64urlDecode(p256dhB64);
  const clientAuth = b64urlDecode(authB64);
  const payload = new TextEncoder().encode(payloadText);

  // Generate an ephemeral ECDH key pair
  const ephemeral = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const ephemeralPublicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', ephemeral.publicKey));

  // Import client public key
  const clientKey = await crypto.subtle.importKey('raw', clientPublicKey, { name: 'ECDH', namedCurve: 'P-256' }, false, []);

  // Derive shared secret
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: clientKey }, ephemeral.privateKey, 256));

  // RFC 8291: bind both public keys to the authentication secret.
  const enc=new TextEncoder();
  const prk=await hkdfExtract(clientAuth,sharedSecret);
  const ikm=await hkdfExpand(prk,new Uint8Array([...enc.encode('WebPush: info\0'),...clientPublicKey,...ephemeralPublicRaw]),32);
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const prk2=await hkdfExtract(salt,ikm);
  const contentKey=await hkdfExpand(prk2,enc.encode('Content-Encoding: aes128gcm\0'),16);
  const nonce=await hkdfExpand(prk2,enc.encode('Content-Encoding: nonce\0'),12);
  const padded=new Uint8Array([...payload,2]);

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey('raw', contentKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, padded));

  const header=new Uint8Array(86);header.set(salt);new DataView(header.buffer).setUint32(16,4096);header[20]=65;header.set(ephemeralPublicRaw,21);
  return { encrypted:new Uint8Array([...header,...encrypted]), salt, ephemeralPublicRaw };
}
__name(encryptPayload, "encryptPayload");

async function hkdfExtract(salt, ikm) {
  const key = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, ikm));
}
__name(hkdfExtract, "hkdfExtract");

async function hkdfExpand(prk, info, length) {
  const key = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const input = new Uint8Array([...info, 1]);
  const output = new Uint8Array(await crypto.subtle.sign('HMAC', key, input));
  return output.slice(0, length);
}
__name(hkdfExpand, "hkdfExpand");

async function sendPush(subscription, payloadObj) {
  try {
    const payloadText = JSON.stringify(payloadObj);
    const { encrypted, salt, ephemeralPublicRaw } = await encryptPayload(subscription.p256dh, subscription.auth, payloadText);

    const endpoint = subscription.endpoint;
    const url = new URL(endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const jwt = await createVapidJwt(audience);

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'Authorization': `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
        'Urgency':'high',
        'TTL': '86400',
      },
      body: encrypted,
    });

    return resp.status;
  } catch (e) {
    return 0;
  }
}
__name(sendPush, "sendPush");

async function notifyMembers(db, memberIds, payload) {
  // Get all push subscriptions for the given member IDs
  if (!memberIds.length) return;
  const placeholders = memberIds.map(() => '?').join(',');
  const subs = (await db.prepare(`SELECT * FROM push_subscriptions WHERE member_id IN (${placeholders})`).bind(...memberIds).all()).results;
  const toDelete = [];
  for (const sub of subs) {
    let status = await sendPush(sub, payload);
    if(status===0||status===429||status>=500)status=await sendPush(sub,payload);
    if(status<200||status>=300)console.warn("Push delivery failed",sub.member_id,status);
    if (status === 404 || status === 410) {
      toDelete.push(sub.id);
    }
  }
  // Clean up expired subscriptions
  for (const id of toDelete) {
    await db.prepare("DELETE FROM push_subscriptions WHERE id=?").bind(id).run();
  }
}
__name(notifyMembers, "notifyMembers");

// ========== END WEB PUSH ==========

var worker_default = {
  async scheduled(event, env, ctx) {
    // Daily turn reminder: nudge players who haven't moved in 24h+
    const db = env.DB;
    try {
      const games = (await db.prepare("SELECT * FROM games WHERE status='playing'").all()).results;
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;
      for (const g of games) {
        // Skip if last update was less than 24h ago or more than 5 days ago
        if (g.updated_at > oneDayAgo) continue;
        if (g.updated_at < fiveDaysAgo) continue;
        const players = JSON.parse(g.players);
        const currentPlayer = players[g.turn];
        const st = JSON.parse(g.state);
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        // Send one reminder per day
        ctx.waitUntil(notifyMembers(db, [currentPlayer], {
          type: 'reminder',
          title: "It's still your turn!",
          body: `Don't forget your ${gameName} game! Your family is waiting.`,
          tag: `ohana-reminder-${g.id}`,
        }).catch(() => {}));
      }
    } catch (e) { /* quiet */ }
  },
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const p = url.pathname;
    const buddyAssets={"/buddy-eddie.webp":EDDIE_PORTRAIT,"/talk-eddie.webp":EDDIE_TALK,"/buddy-otto.webp":MORE_OTTO_PORTRAIT,"/talk-otto.webp":MORE_OTTO_TALK,"/buddy-pippa.webp":MORE_PIPPA_PORTRAIT,"/talk-pippa.webp":MORE_PIPPA_TALK,"/buddy-lulu.webp":MORE_LULU_PORTRAIT,"/talk-lulu.webp":MORE_LULU_TALK,"/buddy-hoot.webp":MORE_HOOT_PORTRAIT,"/talk-hoot.webp":MORE_HOOT_TALK,"/buddy-flutter.webp":MORE_FLUTTER_PORTRAIT,"/talk-flutter.webp":MORE_FLUTTER_TALK,"/buddy-rosie.webp":MORE_ROSIE_PORTRAIT,"/talk-rosie.webp":MORE_ROSIE_TALK,"/buddy-koa.webp":MORE_KOA_PORTRAIT,"/talk-koa.webp":MORE_KOA_TALK,"/buddy-milo.webp":MORE_MILO_PORTRAIT,"/talk-milo.webp":MORE_MILO_TALK,"/buddy-bamboo.webp":MORE_BAMBOO_PORTRAIT,"/talk-bamboo.webp":MORE_BAMBOO_TALK,"/buddy-coco.webp":MORE_COCO_PORTRAIT,"/talk-coco.webp":MORE_COCO_TALK,"/buddy-finn.webp":MORE_FINN_PORTRAIT,"/talk-finn.webp":MORE_FINN_TALK,"/buddy-inky.webp":MORE_INKY_PORTRAIT,"/talk-inky.webp":MORE_INKY_TALK,"/buddy-kai.webp":MORE_KAI_PORTRAIT,"/talk-kai.webp":MORE_KAI_TALK,"/buddy-flora.webp":MORE_FLORA_PORTRAIT,"/talk-flora.webp":MORE_FLORA_TALK,"/buddy-reef.webp":MORE_REEF_PORTRAIT,"/talk-reef.webp":MORE_REEF_TALK,"/talk-honu.webp":TALK_HONU,"/talk-splash.webp":TALK_SPLASH,"/talk-kiko.webp":TALK_KIKO,"/talk-pebble.webp":TALK_PEBBLE,"/talk-mango.webp":TALK_MANGO,"/talk-sunny.webp":TALK_SUNNY,"/buddy-kiko.webp":BUDDY_KIKO,"/buddy-pebble.webp":BUDDY_PEBBLE,"/buddy-mango.webp":BUDDY_MANGO,"/buddy-sunny.webp":BUDDY_SUNNY,"/buddy-splash.webp":BUDDY_SPLASH};
    if(req.method==="GET" && buddyAssets[p])return new Response(buddyAssets[p],{headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if (req.method === "GET" && p === "/honu.webp") return new Response(HONU_IMAGE,{headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if(req.method==="GET" && p==="/ohana-preview")return new Response(OHANA_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if(req.method==="GET" && p==="/setup-preview")return new Response(SETUP_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if(req.method==="GET" && p==="/nook-preview")return new Response(NOOK_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if(req.method==="GET" && p==="/rooms-preview")return new Response(ROOMS_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if(req.method==="GET" && p==="/buddies")return new Response(BUDDIES_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if (req.method === "GET" && p === "/mahjong-preview") return new Response(MAHJONG_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if (req.method === "GET" && p === "/game-preview") return new Response(GAME_PREVIEW_HTML,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if (req.method === "GET" && p === "/porch") return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ohana Home · Living Porch</title><style>body{margin:0;min-height:100vh;background:#0b2e36;color:#f5e8cc;display:grid;place-content:center;font-family:Georgia,serif}main{width:min(96vw,620px)}a{display:block;text-align:center;color:#f5e8cc;margin:20px;text-decoration:none}</style></head><body><main><ohana-scene></ohana-scene><a href="/">Come on in · Ohana Home</a></main><script src="/ohana-scene.js"></script></body></html>`,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
    if(req.method==="GET"&&p==="/ohana-island.webp")return new Response(ISLAND_IMAGE,{headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if(req.method==="GET"&&p==="/island-icons.js")return new Response(ISLAND_ICONS,{headers:{"content-type":"application/javascript","cache-control":"no-cache"}});
    if (req.method === "GET" && p === "/ohana-scene.js") return new Response(SCENE_JS, {headers:{"content-type":"application/javascript; charset=utf-8","cache-control":"no-cache"}});
    const porchAssets = {"/porch-dawn.webp":PORCH_DAWN,"/porch-day.webp":PORCH_DAY,"/porch-night.webp":PORCH_NIGHT,"/porch-played.webp":PORCH_PLAYED};
    if (req.method === "GET" && porchAssets[p]) return new Response(porchAssets[p], {headers:{"content-type":"image/webp","cache-control":"public,max-age=3600"}});
    if (req.method === "GET" && p === "/ohana-welcome.png") return new Response(WELCOME_IMAGE, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=3600" } });
    if (req.method === "GET" && (p === "/" || p === "/index.html")) return new Response(APP_HTML, { headers: { "content-type": "text/html;charset=utf-8" } });
    // Invite links: /invite/{code} serves the app (it reads the code from URL)
    if (req.method === "GET" && p.match(/^\/(?:invite|room)\/[a-f0-9]+$/)) return new Response(APP_HTML, { headers: { "content-type": "text/html;charset=utf-8" } });
    if (p === "/manifest.json") return json({ name: "Ohana Home", short_name: "Ohana", start_url: "/", display: "standalone", background_color: "#0E3B47", theme_color: "#0E3B47", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] });
    if (p === "/icon.svg") return new Response(ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public,max-age=86400" } });
    if (p === "/sw.js") return new Response(SW, { headers: { "content-type": "application/javascript" } });
    if (!p.startsWith("/api/")) return new Response("Not found", { status: 404 });
    try {
      return await api2(req, { ...env, ctx }, url);
    } catch (e) {
      return err(e.message || "Something went wrong", 400);
    }
  }
};
async function api2(req, env, url) {
  const db = env.DB;
  const p = url.pathname;
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  if (p === "/api/join" && req.method === "POST") {
    const code = String(body.code || "").trim().toUpperCase();
    const name = String(body.name || "").trim().slice(0, 24);
    const pin = String(body.pin || "").trim();
    const avatar = String(body.avatar || "\u{1F642}").slice(0, 4);
    if (code !== (await getSetting(db, "family_code")).toUpperCase()) throw new Error("That family code is not right.");
    if (!name) throw new Error("Tell us your name.");
    if (!/^\d{4}$/.test(pin)) throw new Error("PIN needs to be 4 numbers.");
    const ph = await hash(pin);
    let m = await db.prepare("SELECT * FROM members WHERE name=?").bind(name).first();
    if (m) {
      if (m.pin !== ph) throw new Error("That PIN does not match this name. If this is you, try again. If not, pick a different name.");
    } else {
      const count = (await db.prepare("SELECT COUNT(*) c FROM members").first()).c;
      const r = await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,?,?,?)").bind(name, ph, avatar, rid(), count === 0 ? 1 : 0, now(), now()).run();
      m = await db.prepare("SELECT * FROM members WHERE id=?").bind(r.meta.last_row_id).first();
    }
    if (!m.token) {
      m.token = rid();
      await db.prepare("UPDATE members SET token=? WHERE id=?").bind(m.token, m.id).run();
    }
    if (avatar && avatar !== m.avatar) await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, m.id).run();
    await db.prepare("INSERT OR IGNORE INTO room_members(room_id,member_id) VALUES(1,?)").bind(m.id).run();
    return json({ token: m.token, room_id:1, me: { id: m.id, name: m.name, avatar, is_admin: m.is_admin || ((env.ADMIN_NAME || "").toLowerCase() === m.name.toLowerCase() ? 1 : 0) } });
  }
  // ---------- INVITE ENDPOINTS (no auth needed) ----------
  const invMatch = p.match(/^\/api\/invite\/([a-f0-9]+)(?:\/(\w+))?$/);
  if (invMatch) {
    const invCode = invMatch[1];
    const invAction = invMatch[2];
    const g = await db.prepare("SELECT * FROM games WHERE invite_code=?").bind(invCode).first();
    if (!g) throw new Error("This invite link isn't valid anymore.");
    const players = JSON.parse(g.players);
    const gt = GAME_TYPES[g.type];
    const creatorRow = await db.prepare("SELECT name,avatar FROM members WHERE id=?").bind(g.created_by).first();

    // GET /api/invite/{code} — get game info for the invite screen
    if (!invAction && req.method === "GET") {
      return json({
        game_id: g.id,
        type: g.type,
        game_name: gt?.name || g.type,
        bot: g.state ? JSON.parse(g.state).bot || null : null,
    mode: g.mode || 'classic',
        status: g.status,
        player_count: players.length,
        max_players: g.max_players,
        created_by: creatorRow ? creatorRow.name : 'Someone',
        created_by_avatar: creatorRow ? creatorRow.avatar : '🙂'
      });
    }

    // POST /api/invite/{code}/join — join via invite (creates member if needed, no family code)
    if (invAction === "join" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("This game already started. Ask for a new invite!");
      if (players.length >= g.max_players) throw new Error("This game is full.");
      const name = String(body.name || "").trim().slice(0, 24);
      const pin = String(body.pin || "").trim();
      const avatar = String(body.avatar || "🙂").slice(0, 4);
      if (!name) throw new Error("Tell us your name.");
      if (!/^\d{4}$/.test(pin)) throw new Error("PIN needs to be 4 numbers.");
      const ph = await hash(pin);

      // Find or create member
      const signedIn=await auth(req,env);
      let m = signedIn ? await db.prepare("SELECT * FROM members WHERE id=?").bind(signedIn.id).first() : await db.prepare("SELECT * FROM members WHERE name=?").bind(name).first();
      if (m) {
        if (!signedIn && m.pin !== ph) throw new Error("That name is taken. Use the same PIN, or pick a different name.");
      } else {
        const count = (await db.prepare("SELECT COUNT(*) c FROM members").first()).c;
        const r2 = await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,?,?,?)").bind(name, ph, avatar, rid(), 0, now(), now()).run();
        m = await db.prepare("SELECT * FROM members WHERE id=?").bind(r2.meta.last_row_id).first();
      }
      if (!m.token) { m.token = rid(); await db.prepare("UPDATE members SET token=? WHERE id=?").bind(m.token, m.id).run(); }
      if (avatar && avatar !== m.avatar) await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar, m.id).run();

      await db.prepare("INSERT OR IGNORE INTO room_members(room_id,member_id) VALUES(?,?)").bind(g.room_id,m.id).run();
      // Join the game
      if (!players.includes(m.id)) {
        if (players.length >= g.max_players) throw new Error("This game is full.");
        players.push(m.id);
      }
      let status = "waiting", state = null;
      if (players.length >= g.max_players) {
        status = "playing";
        state = JSON.stringify(initState(g.type, players, g.id * 7919 + now() % 1e5, g.mode || 'classic'));
      }
      await db.prepare("UPDATE games SET players=?,status=?,state=?,updated_at=? WHERE id=?").bind(JSON.stringify(players), status, state, now(), g.id).run();

      // Notify first player if game started
      if (status === "playing") {
        const firstPlayer = players[0];
        if (firstPlayer !== m.id) {
          const gameName = gt?.name || g.type;
          env.ctx?.waitUntil?.(notifyMembers(db, [firstPlayer], {
            type: 'turn', title: 'Game on!',
            body: `${m.name} joined your ${gameName} game. Your turn!`,
            tag: `ohana-game-${g.id}`,
          }).catch(() => {}));
        }
      }

      return json({ token: m.token, me: { id: m.id, name: m.name, avatar, is_admin: m.is_admin }, game_id: g.id, room_id:g.room_id, status });
    }
  }

  const roomInvite=p.match(/^\/api\/room-invite\/([a-f0-9]{32})(?:\/(join))?$/);
  if(roomInvite){
    const room=await db.prepare("SELECT id,name FROM rooms WHERE invite_code=?").bind(roomInvite[1]).first();
    if(!room)return err("This room invitation is no longer available.",404);
    if(req.method==='GET'&&!roomInvite[2])return json({name:room.name});
    if(req.method==='POST'&&roomInvite[2]==='join'){
      let member=await auth(req,env);
      if(!member){
        const name=String(body.name||'').trim().slice(0,24),pin=String(body.pin||'');
        if(!name||!/^\d{4}$/.test(pin))throw new Error("Enter your name and a four-number PIN.");
        const ph=await hash(pin);
        member=await db.prepare("SELECT * FROM members WHERE name=?").bind(name).first();
        if(member&&member.pin!==ph)throw new Error("That name and PIN do not match. Try again or choose a different name.");
        if(!member){
          const result=await db.prepare("INSERT INTO members(name,pin,avatar,token,is_admin,created_at,last_seen) VALUES(?,?,?,?,0,?,?)").bind(name,ph,String(body.avatar||'@hon').slice(0,4),rid(),now(),now()).run();
          member=await db.prepare("SELECT * FROM members WHERE id=?").bind(result.meta.last_row_id).first();
        }
      }
      const identity=await db.prepare("SELECT token FROM members WHERE id=?").bind(member.id).first();
      const token=identity.token||rid();
      if(!identity.token)await db.prepare("UPDATE members SET token=? WHERE id=?").bind(token,member.id).run();
      await db.prepare("INSERT OR IGNORE INTO room_members(room_id,member_id) VALUES(?,?)").bind(room.id,member.id).run();
      return json({token,room_id:room.id,me:{id:member.id,name:member.name,avatar:member.avatar,is_admin:member.is_admin}});
    }
    return err("Not found",404);
  }
  const me = await auth(req, env);
  if (!me) return err("Please sign in.", 401);

  if(p==='/api/rooms/create'&&req.method==='POST'){
    const name=String(body.name||'').trim().slice(0,48);
    if(!name)throw new Error("Give your room a name.");
    const invite=rid(16);
    // A batch makes the room and owner membership visible together.
    await db.batch([
      db.prepare("INSERT INTO rooms(name,owner_id,invite_code,created_at) VALUES(?,?,?,?)").bind(name,me.id,invite,now()),
      db.prepare("INSERT INTO room_members(room_id,member_id) SELECT id,? FROM rooms WHERE invite_code=?").bind(me.id,invite)
    ]);
    const room=await db.prepare("SELECT id,name,invite_code FROM rooms WHERE invite_code=?").bind(invite).first();
    return json(room);
  }
  const roomList=(await db.prepare("SELECT r.id,r.name,r.owner_id,r.invite_code FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE rm.member_id=? ORDER BY r.id").bind(me.id).all()).results;
  const requestedRoom=Number(req.headers.get('x-ohana-room'));
  const activeRoom=roomList.find(r=>r.id===requestedRoom)||(!requestedRoom?roomList[0]:null);
  if(!activeRoom)return err("You do not belong to this room. Open Rooms or use a room invitation.",403);
  const roomId=activeRoom.id;
  if(p==='/api/rooms/invite'&&req.method==='POST'){
    // Only members of the selected room reach this point. A single stable
    // invitation is shared by the room; concurrent first requests cannot rotate it.
    await db.prepare("UPDATE rooms SET invite_code=? WHERE id=? AND invite_code IS NULL").bind(rid(16),roomId).run();
    const invitation=await db.prepare("SELECT id,name,invite_code FROM rooms WHERE id=?").bind(roomId).first();
    return json(invitation);
  }
  if(p==='/api/rooms/rotate-invite'&&req.method==='POST'){
    if(roomId===1?!me.is_admin:activeRoom.owner_id!==me.id)return err("Only the room host can replace its invitation.",403);
    await db.prepare("UPDATE rooms SET invite_code=? WHERE id=?").bind(rid(16),roomId).run();
    return json({ok:true});
  }
  // ---------- PUSH SUBSCRIPTION ENDPOINTS ----------
  if (p === "/api/avatar" && req.method === "POST") {
    const avatar=String(body.avatar||'');
    const characters=['@eag','@hon','@spl','@kik','@peb','@man','@sun',"@ott","@pip","@lul","@hoo","@flu","@ros","@koa","@mil","@bam","@coc","@fin","@ink","@kai","@flo","@ree"];
    if(!characters.includes(avatar) && !(avatar.length<=4 && /\p{Extended_Pictographic}/u.test(avatar) && !/[<>@]/.test(avatar)))throw new Error("Choose a character from the picker.");
    await db.prepare("UPDATE members SET avatar=? WHERE id=?").bind(avatar,me.id).run();
    return json({ok:true,avatar});
  }
  if (p === "/api/push/subscribe" && req.method === "POST") {
    const endpoint = String(body.endpoint || "");
    const p256dh = String(body.p256dh || "");
    const authKey = String(body.auth || "");
    if (!endpoint || !p256dh || !authKey) throw new Error("Missing push subscription data.");
    const pushURL=new URL(endpoint);
    if(pushURL.protocol!=="https:"||!(/^(fcm\.googleapis\.com|(?:[a-z0-9-]+\.)*push\.services\.mozilla\.com|(?:[a-z0-9-]+\.)*notify\.windows\.com|web\.push\.apple\.com)$/.test(pushURL.hostname)))throw new Error("Unsupported notification service.");
    if(b64urlDecode(p256dh).length!==65||b64urlDecode(authKey).length!==16)throw new Error("Invalid notification keys. Try enabling again.");
    // Keep a shared browser endpoint attached only to its current account.
    await db.batch([db.prepare("DELETE FROM push_subscriptions WHERE endpoint=?").bind(endpoint),db.prepare("INSERT INTO push_subscriptions(member_id,endpoint,p256dh,auth,created_at) VALUES(?,?,?,?,?)").bind(me.id,endpoint,p256dh,authKey,now())]);
    return json({ ok: true });
  }
  if(p==='/api/push/test'&&req.method==='POST'){
    const sub=await db.prepare("SELECT * FROM push_subscriptions WHERE member_id=? AND endpoint=?").bind(me.id,String(body.endpoint||'')).first();
    if(!sub)return err("This device is not connected yet. Tap Enable notifications.",400);
    const status=await sendPush(sub,{type:'test',title:'Ohana notifications are ready',body:'Your turn alerts will arrive here—even when Ohana Home is closed.',tag:'ohana-test'});
    if(status===404||status===410)await db.prepare("DELETE FROM push_subscriptions WHERE id=?").bind(sub.id).run();
    if(status<200||status>=300)return err(status===404||status===410?'This device connection expired. Tap Enable notifications again.':'The notification service did not accept the test. Please try again.',502);
    return json({ok:true,accepted:true});
  }
  if (p === "/api/push/unsubscribe" && req.method === "POST") {
    const endpoint = String(body.endpoint || "");
    if (endpoint) {
      await db.prepare("DELETE FROM push_subscriptions WHERE member_id=? AND endpoint=?").bind(me.id, endpoint).run();
    } else {
      await db.prepare("DELETE FROM push_subscriptions WHERE member_id=?").bind(me.id).run();
    }
    return json({ ok: true });
  }

  if (p === "/api/rename" && req.method === "POST") {
    const newName = String(body.name || "").trim().slice(0, 20);
    if (!newName) throw new Error("Name can't be empty.");
    const existing = await db.prepare("SELECT id FROM members WHERE LOWER(name)=LOWER(?) AND id!=?").bind(newName, me.id).first();
    if (existing) throw new Error("Someone already has that name.");
    await db.prepare("UPDATE members SET name=? WHERE id=?").bind(newName, me.id).run();
    return json({ ok: true, name: newName });
  }

  if (p === "/api/sync") {
    const since = +url.searchParams.get("msgSince") || 0;
    const members=(await db.prepare("SELECT m.id,m.name,m.avatar,m.last_seen,m.is_admin FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=? ORDER BY m.name").bind(roomId).all()).results.map(m=>({...m,online:now()-m.last_seen<ONLINE_MS}));
    const msgs=(await db.prepare("SELECT id,member_id,text,image,created_at FROM messages WHERE room_id=? AND id>? ORDER BY id DESC LIMIT 60").bind(roomId,since).all()).results.reverse();
    const games=(await db.prepare("SELECT games.*,score_reviews.payload AS score_review FROM games LEFT JOIN score_reviews ON score_reviews.game_id=games.id WHERE games.room_id=? AND (status!='finished' OR updated_at>?) ORDER BY updated_at DESC LIMIT 80").bind(roomId,now()-3*864e5).all()).results.map(g=>gameRow(g,me.id));
    const allGames=(await db.prepare("SELECT g.*,r.name AS room_name FROM games g JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id WHERE rm.member_id=? AND (g.status!='finished' OR g.updated_at>?) ORDER BY g.updated_at DESC LIMIT 120").bind(me.id,now()-3*864e5).all()).results.map(g=>gameRow(g,me.id));
    const visiblePeople=(await db.prepare("SELECT DISTINCT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id IN (SELECT room_id FROM room_members WHERE member_id=?)").bind(me.id).all()).results;
    const peopleById=Object.fromEntries(visiblePeople.map(m=>[m.id,m]));
    for(const game of allGames)game.names=Object.fromEntries(game.players.filter(id=>peopleById[id]).map(id=>[id,peopleById[id]]));
    const familyName=await getSetting(db,'family_name');
    const invitations=(await db.prepare("SELECT i.game_id,i.sender_id,m.name AS sender_name,g.type,g.room_id,r.name AS room_name FROM game_invitations i JOIN games g ON g.id=i.game_id JOIN members m ON m.id=i.sender_id JOIN rooms r ON r.id=g.room_id JOIN room_members rm ON rm.room_id=g.room_id AND rm.member_id=i.member_id WHERE i.member_id=? AND i.status='pending' AND g.status='waiting' AND NOT EXISTS (SELECT 1 FROM json_each(g.players) WHERE value=i.member_id)").bind(me.id).all()).results;
    return json({invitations,me,familyName:roomId===1?familyName:activeRoom.name,roomId,rooms:roomList.map(r=>({...r,name:r.id===1?familyName:r.name})),members,messages:msgs,games,allGames,types:GAME_TYPES});
  }
  if (p === "/api/message" && req.method === "POST") {
    const text = String(body.text || "").trim().slice(0, 2e3);
    const image = body.image ? String(body.image) : null;
    if (!text && !image) throw new Error("Nothing to send.");
    if (image && image.length > 9e5) throw new Error("That picture is too big.");
    await db.prepare("INSERT INTO messages(member_id,text,image,created_at,room_id) VALUES(?,?,?,?,?)").bind(me.id, text, image, now(),roomId).run();

    // Notify all OTHER members about new chat message
    const allMembers = (await db.prepare("SELECT member_id AS id FROM room_members WHERE member_id!=? AND room_id=?").bind(me.id,roomId).all()).results;
    const otherIds = allMembers.map(m => m.id);
    env.ctx?.waitUntil?.(notifyMembers(db, otherIds, {
      type: 'chat',
      title: `${me.name} in ${roomId===1?"Ohana Family":activeRoom.name}`,
      body: text ? (text.length > 80 ? text.slice(0, 77) + '…' : text) : '📷 Sent a picture',
      tag: 'ohana-room-'+roomId,
    }).catch(() => {}));

    return json({ ok: true });
  }
  if (p === "/api/game/create" && req.method === "POST") {
    const type = body.type;
    const gt = GAME_TYPES[type];
    if (!gt) throw new Error("Unknown game.");
    const withBot=body.opponent==='bot';
    const max = withBot?2:Math.min(gt.max, Math.max(gt.min, +body.max_players || gt.min));
    const mode = type === 'words' && body.mode === 'random' ? 'random' : 'classic';
    const inviteCode = rid(6);
    const r = await db.prepare("INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at,mode,invite_code,room_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)").bind(type, JSON.stringify([me.id]), max, "waiting", 0, me.id, now(), now(), mode, inviteCode,roomId).run();
    if (max === 1 || withBot) {
      const players=withBot?[me.id,BOT_ID]:[me.id];
      const st=initState(type,players,now(),mode);
      if(withBot)st.bot={id:BOT_ID,name:'Honu',avatar:'@hon',difficulty:['easy','medium','hard'].includes(body.difficulty)?body.difficulty:'easy',memory:{},moves:0};
      if(withBot)await db.prepare('UPDATE games SET players=? WHERE id=?').bind(JSON.stringify(players),r.meta.last_row_id).run();
      const state=JSON.stringify(st);
      await db.prepare("UPDATE games SET state=?,status='playing' WHERE id=?").bind(state,r.meta.last_row_id).run();
    }
    return json({ id: r.meta.last_row_id, invite_code: inviteCode });
  }
  const gm = p.match(/^\/api\/game\/(\d+)(?:\/(\w+))?$/);
  if (gm) {
    const id = +gm[1];
    const action = gm[2];
    const g = await db.prepare("SELECT games.*, score_reviews.payload AS score_review FROM games LEFT JOIN score_reviews ON score_reviews.game_id=games.id WHERE games.id=?").bind(id).first();
    if (!g) throw new Error("Game not found.");
    if(!roomList.some(r=>r.id===g.room_id))return err("This game belongs to a private room.",403);
    const players = JSON.parse(g.players);
    const names = {};
    for (const m of (await db.prepare("SELECT m.id,m.name,m.avatar FROM members m JOIN room_members rm ON rm.member_id=m.id WHERE rm.room_id=?").bind(g.room_id).all()).results) names[m.id] = m;
    if(players.includes(BOT_ID))names[BOT_ID]={id:BOT_ID,name:'Honu · computer',avatar:'@hon'};
    if (!action) {
      if(players.includes(me.id)&&g.status==='playing'&&players[g.turn]===BOT_ID)env.ctx?.waitUntil?.(advanceBot(env,id).catch(e=>console.error('Computer move failed',e.message)));
      const st = g.state ? viewState(g.type, JSON.parse(g.state), me.id) : null;
      return json({ ...gameRow(g, me.id), state: st, names });
    }
    if(action==='invite' && req.method==='POST') {
      if(!players.includes(me.id))return err("Only a player at this table can invite Ohana.",403);
      if(g.status!=='waiting'||players.length>=g.max_players)throw new Error("Choose a table that is waiting for players.");
      const recipient=Number(body.member_id);
      if(!names[recipient]||recipient===me.id||players.includes(recipient))throw new Error("Choose another member of this room’s Ohana.");
      const sent=await db.prepare("INSERT INTO game_invitations(game_id,member_id,sender_id,status,created_at) VALUES(?,?,?,'pending',?) ON CONFLICT(game_id,member_id) DO UPDATE SET sender_id=excluded.sender_id,status='pending',created_at=excluded.created_at WHERE game_invitations.status!='pending'").bind(id,recipient,me.id,now()).run();
      if(sent.meta.changes)env.ctx?.waitUntil?.(notifyMembers(db,[recipient],{type:'invite',title:me.name+' saved you a seat',body:'Join '+(GAME_TYPES[g.type]?.name||g.type)+' — open your Game Nook to accept.',tag:'ohana-invite-'+id}).catch(()=>{}));
      return json({ok:true});
    }
    if(action==='decline' && req.method==='POST') {
      await db.prepare("UPDATE game_invitations SET status='declined' WHERE game_id=? AND member_id=?").bind(id,me.id).run();
      return json({ok:true});
    }
    if (action === "reviewack" && req.method === "POST") {
      if (!players.includes(me.id)) throw new Error("Only players in this game can acknowledge its score review.");
      const review = g.score_review ? JSON.parse(g.score_review) : null;
      if (!review || body.reviewId !== review.id) throw new Error("This score review changed. Please refresh and read it again.");
      const result = await db.prepare("UPDATE score_reviews SET payload=json_set(payload,?,COALESCE(json_extract(payload,?),?)) WHERE game_id=? AND json_extract(payload,'$.id')=?")
        .bind('$.acknowledged."'+me.id+'"','$.acknowledged."'+me.id+'"',now(),id,review.id).run();
      if (!result.meta.changes) throw new Error("This score review changed. Please refresh and read it again.");
      return json({ok:true});
    }
    if (action === "join" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("This game already started.");
      if (!players.includes(me.id)) {
        if (players.length >= g.max_players) throw new Error("This game is full.");
        players.push(me.id);
      }
      let status = "waiting", state = null;
      if (players.length >= g.max_players) {
        status = "playing";
        state = JSON.stringify(initState(g.type, players, id * 7919 + now() % 1e5, g.mode || 'classic'));
      }
      const joined=await db.prepare("UPDATE games SET players=?,status=?,state=?,updated_at=? WHERE id=? AND status='waiting' AND players=?").bind(JSON.stringify(players), status, state, now(), id,g.players).run();
      if(!joined.meta.changes)throw new Error("This table just changed. Please open it again.");
      await db.prepare("UPDATE game_invitations SET status='accepted' WHERE game_id=? AND member_id=?").bind(id,me.id).run();

      // If game just started, notify the first player it's their turn
      if (status === "playing") {
        const firstPlayer = players[0];
        if (firstPlayer !== me.id) {
          const gameName = GAME_TYPES[g.type]?.name || g.type;
          env.ctx?.waitUntil?.(notifyMembers(db, [firstPlayer], {
            type: 'turn',
            title: 'Your turn!',
            body: `It's your turn in ${gameName}`,
            tag: `ohana-game-${id}`,
          }).catch(() => {}));
        }
      }

      return json({ ok: true, status });
    }
    if (action === "start" && req.method === "POST") {
      if (g.status !== "waiting") throw new Error("Already started.");
      if (g.created_by !== me.id && !(me.is_admin&&g.room_id===1)) throw new Error("Only the person who made the game can start it.");
      if (players.length < GAME_TYPES[g.type].min) throw new Error("Need more players first.");
      const state = JSON.stringify(initState(g.type, players, id * 7919 + now() % 1e5, g.mode || 'classic'));
      await db.prepare("UPDATE games SET status='playing',state=?,max_players=?,updated_at=? WHERE id=?").bind(state, players.length, now(), id).run();

      // Notify first player
      const firstPlayer = players[0];
      if (firstPlayer !== me.id) {
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env.ctx?.waitUntil?.(notifyMembers(db, [firstPlayer], {
          type: 'turn',
          title: 'Your turn!',
          body: `It's your turn in ${gameName}`,
          tag: `ohana-game-${id}`,
        }).catch(() => {}));
      }

      return json({ ok: true });
    }
    if (action === "leave" && req.method === "POST") {
      if (g.status === "waiting") {
        if (g.created_by === me.id || (me.is_admin&&g.room_id===1)) await db.prepare("DELETE FROM games WHERE id=?").bind(id).run();
        else await db.prepare("UPDATE games SET players=? WHERE id=?").bind(JSON.stringify(players.filter((x) => x !== me.id)), id).run();
      } else if (g.status === "playing" && players.includes(me.id)) {
        await db.prepare("UPDATE games SET status='finished',winner=?,updated_at=? WHERE id=?").bind(players.length === 2 ? String(players.find((x) => x !== me.id)) : "resigned", now(), id).run();
      }
      return json({ ok: true });
    }
    if (action === "move" && req.method === "POST") {
      if (g.status !== "playing") throw new Error("This game is not in play.");
      if (players[g.turn] !== me.id) throw new Error("It's not your turn yet.");
      const st = JSON.parse(g.state);
      const res = await applyMove(g.type, st, players, g.turn, body, db);
      rememberBotCards(st);
      const status = res.over ? "finished" : "playing";
      if(g.type==='mahjong'||st.bot) {
        const saved=await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=? AND state=?").bind(JSON.stringify(st),res.next,status,res.over?String(res.winner):null,now(),id,g.state).run();
        if(!saved.meta.changes)throw new Error("The table changed. Please refresh and try again.");
      } else {
      await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=?").bind(JSON.stringify(st), res.next, status, res.over ? String(res.winner) : null, now(), id).run();
      }

      if(!res.over&&players[res.next]===BOT_ID)env.ctx?.waitUntil?.(advanceBot(env,id).catch(e=>console.error('Computer move failed',e.message)));
      // Send push notification to the next player (if game is still playing)
      if (!res.over && players[res.next] > 0 && players[res.next] !== me.id) {
        const nextPlayerId = players[res.next];
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env.ctx?.waitUntil?.(notifyMembers(db, [nextPlayerId], {
          type: 'turn',
          title: 'Your turn!',
          body: `${me.name} played in ${gameName}. Your move!`,
          tag: `ohana-game-${id}`,
        }).catch(() => {}));
      }
      // If game is over, notify the winner
      if (res.over && res.winner && res.winner !== 'tie' && res.winner !== 'resigned' && +res.winner > 0 && +res.winner !== me.id) {
        const gameName = GAME_TYPES[g.type]?.name || g.type;
        env.ctx?.waitUntil?.(notifyMembers(db, [+res.winner], {
          type: 'win',
          title: 'You won! 🎉',
          body: `You won ${gameName}!`,
          tag: `ohana-game-${id}`,
        }).catch(() => {}));
      }

      return json({ ok: true, over: res.over, winner: res.winner, last: st.history ? st.history[st.history.length - 1] : null });
    }
    if (action === "chat" && req.method === "POST") {
      if (!players.includes(me.id)) throw new Error("You're not in this game.");
      const text = String(body.text || "").trim().slice(0, 200);
      if (!text) throw new Error("Say something!");
      const st = JSON.parse(g.state);
      if (!st.chat) st.chat = [];
      const msg = { p: me.id, text, t: now() };
      st.chat.push(msg);
      // Keep last 50 messages
      if (st.chat.length > 50) st.chat = st.chat.slice(-50);
      await db.prepare("UPDATE games SET state=? WHERE id=?").bind(JSON.stringify(st), id).run();
      return json({ ok: true, msg });
    }
  }
  if (p.startsWith("/api/admin/")) {
    if (!me.is_admin || roomId!==1) return err("Family admins only.", 403);
    if (p === "/api/admin/settings" && req.method === "POST") {
      if (body.family_code) await db.prepare("UPDATE settings SET value=? WHERE key='family_code'").bind(String(body.family_code).trim().toUpperCase()).run();
      if (body.family_name) await db.prepare("UPDATE settings SET value=? WHERE key='family_name'").bind(String(body.family_name).trim()).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/info") return json({ family_code: await getSetting(db, "family_code"), family_name: await getSetting(db, "family_name") });
    if (p === "/api/admin/remove" && req.method === "POST") {
      await db.prepare("DELETE FROM room_members WHERE member_id=? AND room_id=1 AND member_id IN (SELECT id FROM members WHERE is_admin=0)").bind(+body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/reset_pin" && req.method === "POST") {
      await db.prepare("UPDATE members SET pin=?,token=NULL WHERE id=? AND id IN (SELECT member_id FROM room_members WHERE room_id=1)").bind(await hash(String(body.pin)), +body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/clear_chat" && req.method === "POST") {
      await db.prepare("DELETE FROM messages WHERE room_id=1").run();
      return json({ ok: true });
    }
  }
  return err("Not found", 404);
}
__name(api2, "api2");
var ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#0E3B47"/><path d="M64 24c-9 0-16 6-19 13-8-2-17 3-17 13 0 8 5 12 10 14-2 5-1 12 5 16 5 3 11 2 15-1 4 3 10 4 15 1 6-4 7-11 5-16 5-2 10-6 10-14 0-10-9-15-17-13-3-7-10-13-19-13z" fill="#FF8C69"/><circle cx="64" cy="60" r="12" fill="#FFD166"/><path d="M40 104c8-10 40-10 48 0" stroke="#F6E7C8" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`;
var SW = `
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', function(event) {
  let data = { title: 'Ohana Home', body: 'Something happened!', tag: 'ohana' };
  try { data = event.data.json(); } catch(e) {}
  const title = data.title || 'Ohana Home';
  const options = {
    body: data.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: data.tag || 'ohana',
    renotify: true,
    data: { type: data.type || 'general' },
    silent:false,
    requireInteraction:data.type==='turn',
    vibrate:[200,100,200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', e => {});
`;
export {
  worker_default as default
};
