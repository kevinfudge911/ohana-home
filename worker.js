var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.js
import APP_HTML from "./app.html";

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
function wordsInit(players, seed) {
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
  return { board: new Array(225).fill(null), bonus, star, starFound: false, surprises, foundSurprises: {}, bag, racks, scores, passes: 0, history: [], lastMove: [] };
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
    for (const i of w) {
      let v = board[i].v;
      if (placedSet.has(i)) {
        const b = st.bonus[i];
        if (b === "DL") v *= 2;
        if (b === "TL") v *= 3;
        if (b === "DW") mult *= 2;
        if (b === "TW") mult *= 3;
      }
      sum += v;
    }
    const sc = sum * mult;
    total += sc;
    detail.push({ word: w.map((i) => board[i].l).join(""), score: sc });
  }
  let note = "";
  if (pl.length === 7) {
    total += 50;
    note = "All 7 tiles! +50";
  }
  if (!st.starFound && placedSet.has(st.star)) {
    st.starFound = true;
    total += 20;
    note += (note ? " \xB7 " : "") + "Found the Ohana Star! +20";
  }
  let extraTurn = false;
  for (const t of pl) {
    const surp = st.surprises[t.i];
    if (surp && !st.foundSurprises[t.i]) {
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
    }
  }
  st.board = board;
  st.racks[p] = rack;
  wordsRefill(st, p);
  st.scores[p] += total;
  st.passes = 0;
  st.lastMove = [...placedSet];
  st.history.push({ p, words: detail, score: total, note });
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
  return { ...st, racks, bag: st.bag.length, star: st.starFound ? st.star : null, surprises: surpriseSquares, foundSurprises: st.foundSurprises };
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
function initState(type, players, seed) {
  if (type === "words") return wordsInit(players, seed);
  if (type === "tictac") return tttInit();
  if (type === "memory") return memInit(players, seed);
  if (type === "checkers") return chkInit();
  throw new Error("Unknown game");
}
__name(initState, "initState");
async function applyMove(type, st, players, turnIdx, move, db) {
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
    in_game: players.includes(me)
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

  // HKDF for auth secret
  const authInfo = new TextEncoder().encode('Content-Encoding: auth\0');
  const prk = await hkdfExtract(clientAuth, sharedSecret);

  const ikm = await hkdfExpand(prk, authInfo, 32);

  // Context for key and nonce derivation
  const keyLabel = new TextEncoder().encode('Content-Encoding: aesgcm\0');
  const nonceLabel = new TextEncoder().encode('Content-Encoding: nonce\0');

  // Build context: "P-256\0" + len(client) + client + len(server) + server
  const context = new Uint8Array([
    ...new TextEncoder().encode('P-256\0'),
    0, 65, ...clientPublicKey,
    0, 65, ...ephemeralPublicRaw
  ]);

  const keyInfo = new Uint8Array([...keyLabel, ...context]);
  const nonceInfo = new Uint8Array([...nonceLabel, ...context]);

  // Salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const prk2 = await hkdfExtract(salt, ikm);
  const contentKey = await hkdfExpand(prk2, keyInfo, 16);
  const nonce = await hkdfExpand(prk2, nonceInfo, 12);

  // Pad payload (2 bytes padding length = 0)
  const padded = new Uint8Array(2 + payload.length);
  padded[0] = 0; padded[1] = 0;
  padded.set(payload, 2);

  // Encrypt with AES-128-GCM
  const aesKey = await crypto.subtle.importKey('raw', contentKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, padded));

  return { encrypted, salt, ephemeralPublicRaw };
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
        'Content-Encoding': 'aesgcm',
        'Encryption': `salt=${b64urlEncode(salt)}`,
        'Crypto-Key': `dh=${b64urlEncode(ephemeralPublicRaw)};p256ecdsa=${VAPID_PUBLIC_KEY}`,
        'Authorization': `WebPush ${jwt}`,
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
    const status = await sendPush(sub, payload);
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
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    if (req.method === "GET" && (p === "/" || p === "/index.html")) return new Response(APP_HTML, { headers: { "content-type": "text/html;charset=utf-8" } });
    if (p === "/manifest.json") return json({ name: "Ohana Home", short_name: "Ohana", start_url: "/", display: "standalone", background_color: "#0E3B47", theme_color: "#0E3B47", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] });
    if (p === "/icon.svg") return new Response(ICON, { headers: { "content-type": "image/svg+xml", "cache-control": "public,max-age=86400" } });
    if (p === "/sw.js") return new Response(SW, { headers: { "content-type": "application/javascript" } });
    if (!p.startsWith("/api/")) return new Response("Not found", { status: 404 });
    try {
      return await api2(req, env, url);
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
    return json({ token: m.token, me: { id: m.id, name: m.name, avatar, is_admin: m.is_admin || ((env.ADMIN_NAME || "").toLowerCase() === m.name.toLowerCase() ? 1 : 0) } });
  }
  const me = await auth(req, env);
  if (!me) return err("Please sign in.", 401);

  // ---------- PUSH SUBSCRIPTION ENDPOINTS ----------
  if (p === "/api/push/subscribe" && req.method === "POST") {
    const endpoint = String(body.endpoint || "");
    const p256dh = String(body.p256dh || "");
    const authKey = String(body.auth || "");
    if (!endpoint || !p256dh || !authKey) throw new Error("Missing push subscription data.");
    // Upsert: delete old then insert
    await db.prepare("DELETE FROM push_subscriptions WHERE member_id=? AND endpoint=?").bind(me.id, endpoint).run();
    await db.prepare("INSERT INTO push_subscriptions(member_id,endpoint,p256dh,auth,created_at) VALUES(?,?,?,?,?)").bind(me.id, endpoint, p256dh, authKey, now()).run();
    return json({ ok: true });
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
    const members = (await db.prepare("SELECT id,name,avatar,last_seen,is_admin FROM members ORDER BY name").all()).results.map((m) => ({ ...m, online: now() - m.last_seen < ONLINE_MS }));
    const msgs = (await db.prepare("SELECT m.id,m.member_id,m.text,m.image,m.created_at FROM messages m WHERE m.id>? ORDER BY m.id DESC LIMIT 60").bind(since).all()).results.reverse();
    const games = (await db.prepare("SELECT * FROM games WHERE status!='finished' OR updated_at>? ORDER BY updated_at DESC LIMIT 40").bind(now() - 3 * 864e5).all()).results.map((g) => gameRow(g, me.id));
    return json({ me, familyName: await getSetting(db, "family_name"), members, messages: msgs, games, types: GAME_TYPES });
  }
  if (p === "/api/message" && req.method === "POST") {
    const text = String(body.text || "").trim().slice(0, 2e3);
    const image = body.image ? String(body.image) : null;
    if (!text && !image) throw new Error("Nothing to send.");
    if (image && image.length > 9e5) throw new Error("That picture is too big.");
    await db.prepare("INSERT INTO messages(member_id,text,image,created_at) VALUES(?,?,?,?)").bind(me.id, text, image, now()).run();

    // Notify all OTHER members about new chat message
    const allMembers = (await db.prepare("SELECT id FROM members WHERE id!=?").bind(me.id).all()).results;
    const otherIds = allMembers.map(m => m.id);
    env.ctx?.waitUntil?.(notifyMembers(db, otherIds, {
      type: 'chat',
      title: `${me.name} in Ohana Home`,
      body: text ? (text.length > 80 ? text.slice(0, 77) + '…' : text) : '📷 Sent a picture',
      tag: 'ohana-chat',
    }).catch(() => {}));

    return json({ ok: true });
  }
  if (p === "/api/game/create" && req.method === "POST") {
    const type = body.type;
    const gt = GAME_TYPES[type];
    if (!gt) throw new Error("Unknown game.");
    const max = Math.min(gt.max, Math.max(gt.min, +body.max_players || gt.min));
    const r = await db.prepare("INSERT INTO games(type,players,max_players,status,turn,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)").bind(type, JSON.stringify([me.id]), max, "waiting", 0, me.id, now(), now()).run();
    return json({ id: r.meta.last_row_id });
  }
  const gm = p.match(/^\/api\/game\/(\d+)(?:\/(\w+))?$/);
  if (gm) {
    const id = +gm[1];
    const action = gm[2];
    const g = await db.prepare("SELECT * FROM games WHERE id=?").bind(id).first();
    if (!g) throw new Error("Game not found.");
    const players = JSON.parse(g.players);
    const names = {};
    for (const m of (await db.prepare("SELECT id,name,avatar FROM members").all()).results) names[m.id] = m;
    if (!action) {
      const st = g.state ? viewState(g.type, JSON.parse(g.state), me.id) : null;
      return json({ ...gameRow(g, me.id), state: st, names });
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
        state = JSON.stringify(initState(g.type, players, id * 7919 + now() % 1e5));
      }
      await db.prepare("UPDATE games SET players=?,status=?,state=?,updated_at=? WHERE id=?").bind(JSON.stringify(players), status, state, now(), id).run();

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
      if (g.created_by !== me.id && !me.is_admin) throw new Error("Only the person who made the game can start it.");
      if (players.length < GAME_TYPES[g.type].min) throw new Error("Need more players first.");
      const state = JSON.stringify(initState(g.type, players, id * 7919 + now() % 1e5));
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
        if (g.created_by === me.id || me.is_admin) await db.prepare("DELETE FROM games WHERE id=?").bind(id).run();
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
      const status = res.over ? "finished" : "playing";
      await db.prepare("UPDATE games SET state=?,turn=?,status=?,winner=?,updated_at=? WHERE id=?").bind(JSON.stringify(st), res.next, status, res.over ? String(res.winner) : null, now(), id).run();

      // Send push notification to the next player (if game is still playing)
      if (!res.over && players[res.next] !== me.id) {
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
      if (res.over && res.winner && res.winner !== 'tie' && res.winner !== 'resigned' && +res.winner !== me.id) {
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
  }
  if (p.startsWith("/api/admin/")) {
    if (!me.is_admin) return err("Admins only.", 403);
    if (p === "/api/admin/settings" && req.method === "POST") {
      if (body.family_code) await db.prepare("UPDATE settings SET value=? WHERE key='family_code'").bind(String(body.family_code).trim().toUpperCase()).run();
      if (body.family_name) await db.prepare("UPDATE settings SET value=? WHERE key='family_name'").bind(String(body.family_name).trim()).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/info") return json({ family_code: await getSetting(db, "family_code"), family_name: await getSetting(db, "family_name") });
    if (p === "/api/admin/remove" && req.method === "POST") {
      await db.prepare("DELETE FROM members WHERE id=? AND is_admin=0").bind(+body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/reset_pin" && req.method === "POST") {
      await db.prepare("UPDATE members SET pin=?,token=NULL WHERE id=?").bind(await hash(String(body.pin)), +body.id).run();
      return json({ ok: true });
    }
    if (p === "/api/admin/clear_chat" && req.method === "POST") {
      await db.prepare("DELETE FROM messages").run();
      return json({ ok: true });
    }
  }
  return err("Not found", 404);
}
__name(api2, "api2");
var ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#0E3B47"/><path d="M64 24c-9 0-16 6-19 13-8-2-17 3-17 13 0 8 5 12 10 14-2 5-1 12 5 16 5 3 11 2 15-1 4 3 10 4 15 1 6-4 7-11 5-16 5-2 10-6 10-14 0-10-9-15-17-13-3-7-10-13-19-13z" fill="#FF8C69"/><circle cx="64" cy="60" r="12" fill="#FFD166"/><path d="M40 104c8-10 40-10 48 0" stroke="#F6E7C8" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`;
var SW = `
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());

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
    data: { type: data.type || 'general' }
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
