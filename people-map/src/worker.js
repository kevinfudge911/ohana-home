// ohana-wheres-my-people: "Where's My People?" map for Ohana Home (ohanahome.app/people).
// Kevin only (Ohana admin). One map of everyone who shares location with him:
//  - Unique Rides Transportation limo app drivers on the clock (D1 limo-for-you) -> shown as the vehicle they're in
//  - JJ Friends drivers (D1 jj_friends_db) -> vehicle picked for today's run, else their Ohana character
//  - Life360 (polled here with Kevin's own Life360 key, or pushed in) and Google sharing (pushed in) -> feed_positions
// Everyone else shows as their Ohana character when they have one.
import PAGE from "./page.html";
import ROOM from "./room.html";
import CHARS from "./chars.json";
import SCHEMA from "./schema.sql";
import ART_PINKEY from "./art/pinkey.webp";
import ART_EXECUTIVE from "./art/executive.webp";
import ART_PEARL from "./art/majestic-pearl.webp";
import ART_H2 from "./art/h2-thunder.webp";
import ART_VAN from "./art/grand-van.webp";
import ART_FIRETRUCK from "./art/fire-truck.svg";
import ART_HOUSE from "./art/house.svg";
import ART_CAR from "./art/car.svg";
import ART_SIGN from "./art/waldo-sign.webp";
import ART_TOWN from "./art/waldo-town.webp";
import ART_PERSON from "./art/person.svg";

const VERSION = "people-v5"; // schema version; per-person Life360 added Nov 24
const ART = {
  "pinkey.webp": [ART_PINKEY, "image/webp"], "executive.webp": [ART_EXECUTIVE, "image/webp"],
  "majestic-pearl.webp": [ART_PEARL, "image/webp"], "h2-thunder.webp": [ART_H2, "image/webp"],
  "grand-van.webp": [ART_VAN, "image/webp"],
  "fire-truck.svg": [ART_FIRETRUCK, "image/svg+xml"], "house.svg": [ART_HOUSE, "image/svg+xml"], "car.svg": [ART_CAR, "image/svg+xml"], "waldo-sign.webp": [ART_SIGN, "image/webp"], "waldo-town.webp": [ART_TOWN, "image/webp"], "person.svg": [ART_PERSON, "image/svg+xml"],
};
const LIMO_FRESH_MS = 30 * 60e3, JJ_FRESH_MS = 30 * 60e3, FEED_KEEP_MS = 3 * 864e5;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function vehicleArt(name) {
  const n = String(name || "").toLowerCase();
  if (/pink/.test(n)) return { art: "pinkey.webp", label: "Pinkey" };
  if (/exec|chrysler|300/.test(n)) return { art: "executive.webp", label: "The Executive" };
  if (/pearl|majestic|cadillac|dts/.test(n)) return { art: "majestic-pearl.webp", label: "Majestic Pearl" };
  if (/h2|hummer|thunder/.test(n)) return { art: "h2-thunder.webp", label: "H2 Thunder" };
  if (/grand van|caravan|\bvan\b/.test(n)) return { art: "grand-van.webp", label: "Grand Van" };
  if (/beauty|excursion/.test(n)) return { art: "car.svg", label: "Black Beauty" };
  return { art: "car.svg", label: name ? String(name).replace(/\s*\(.*\)\s*$/, "") : "On a run" };
}
function meters(aLat, aLng, bLat, bLng) {
  const R = 6371000, r = Math.PI / 180, dLat = (bLat - aLat) * r, dLng = (bLng - aLng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function ctMinutes(d = new Date()) { const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d).split(":"); return +h * 60 + +m; }
function ctDate(d = new Date()) { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d); }
const ms = (s) => { const t = Date.parse(s); return Number.isFinite(t) ? t : 0; };

async function ensureSchema(env) {
  const r = await env.PEOPLE.prepare("SELECT value FROM settings WHERE key='schema'").first().catch(() => null);
  if (r && r.value === VERSION) return;
  for (const stmt of SCHEMA.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean)) await env.PEOPLE.prepare(stmt).run();
  await env.PEOPLE.prepare("INSERT INTO settings(key,value) VALUES('schema',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(VERSION).run();
}
async function getSetting(env, k) { const r = await env.PEOPLE.prepare("SELECT value FROM settings WHERE key=?").bind(k).first(); return r ? r.value : null; }
async function setSetting(env, k, v) { await env.PEOPLE.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k, v).run(); }

// Ohana Home sign-in: same token the Ohana app keeps on the phone. Only Ohana admins (Kevin) may see the map.
async function ohanaAdmin(req, env) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!t || t.length < 8) return null;
  const m = await env.OHANA.prepare("SELECT id,name,avatar,is_admin FROM members WHERE token=?").bind(t).first();
  if (!m) return null;
  const allow = String(env.ALLOWED_MEMBER_IDS || "5").split(",").map((s) => +s.trim());
  return m.is_admin || allow.includes(m.id) ? m : null;
}

// Any signed-in Ohana member (for the family map).
async function ohanaMember(req, env) {
  const t = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!t || t.length < 8) return null;
  return await env.OHANA.prepare("SELECT id,name,avatar,is_admin FROM members WHERE token=?").bind(t).first();
}

// Family map: only people who turned sharing on, and only family who share an Ohana room with the viewer.
async function familyPeople(env, viewerId, all) {
  const rows = (await env.PEOPLE.prepare("SELECT * FROM family_share WHERE sharing=1 AND lat IS NOT NULL").all()).results || [];
  if (!rows.length) return [];
  let allowed = null;
  if (!all) {
    const r = (await env.OHANA.prepare("SELECT DISTINCT b.member_id AS id FROM room_members a JOIN room_members b ON a.room_id=b.room_id WHERE a.member_id=?").bind(viewerId).all()).results || [];
    allowed = new Set(r.map((x) => Number(x.id))); allowed.add(viewerId);
  }
  const ids = rows.map((r) => r.member_id).filter((id) => !allowed || allowed.has(id));
  if (!ids.length) return [];
  const mem = (await env.OHANA.prepare("SELECT id,name,avatar FROM members WHERE id IN (" + ids.map(() => "?").join(",") + ")").bind(...ids).all()).results || [];
  const byId = Object.fromEntries(mem.map((m) => [m.id, m]));
  const out = [];
  for (const r of rows) {
    const m = byId[r.member_id]; if (!m) continue;
    const c = CHARS[m.avatar];
    out.push({ key: "ohana-" + m.id, memberId: m.id, name: m.name, lat: r.lat, lng: r.lng, at: r.at, src: "Ohana", kind: c ? "character" : "pin", art: c ? c.f : null, character: c ? c.n : null, label: "" });
  }
  return out;
}

async function limoDrivers(env) {
  const rows = (await env.LIMO.prepare(
    `SELECT ce.driver_id, ce.booking_id, ce.clock_in, d.first_name, d.last_name, v.name AS vname, v.make, v.model, b.booking_number,
       (SELECT lat||','||lng||','||recorded_at FROM driver_locations l WHERE l.booking_id=ce.booking_id AND l.driver_id=ce.driver_id ORDER BY recorded_at DESC LIMIT 1) AS lastpt
     FROM driver_clock_entries ce LEFT JOIN bookings b ON b.id=ce.booking_id
     LEFT JOIN vehicles v ON v.id=COALESCE(ce.vehicle_id,b.vehicle_id) LEFT JOIN drivers d ON d.id=ce.driver_id
     WHERE ce.status='clocked_in'`).all()).results || [];
  const out = [];
  for (const r of rows) {
    if (!r.lastpt) continue;
    const [lat, lng, at] = r.lastpt.split(",");
    if (Date.now() - ms(at) > LIMO_FRESH_MS) continue;
    out.push({ src: "limo", driverId: r.driver_id, name: [r.first_name, r.last_name].filter(Boolean).join(" "), first: r.first_name,
      lat: +lat, lng: +lng, at, vehicle: r.vname || [r.make, r.model].filter(Boolean).join(" "), run: r.booking_number || "" });
  }
  return out;
}

async function jjDrivers(env) {
  const pts = (await env.JJ.prepare(
    `SELECT p.member, p.lat, p.lng, p.accuracy, p.recordedAt FROM driver_positions p
     JOIN (SELECT member, max(recordedAt) m FROM driver_positions GROUP BY member) x ON x.member=p.member AND x.m=p.recordedAt`).all()).results || [];
  const today = ctDate();
  const runs = (await env.JJ.prepare("SELECT driver, coDriver, vehicle, time, endTime, title FROM entries WHERE date=? AND status='new' AND kind='limo' ORDER BY time").bind(today).all().catch(() => ({ results: [] }))).results || [];
  const nowMin = ctMinutes();
  const toMin = (t) => { const m = /^(\d{1,2}):(\d{2})/.exec(String(t || "")); return m ? +m[1] * 60 + +m[2] : null; };
  const out = [];
  for (const p of pts) {
    if (Date.now() - ms(p.recordedAt) > JJ_FRESH_MS) continue;
    const who = p.member; // 'Kevin' | 'Mike'
    const names = who === "Mike" ? ["Mike", "Mike Hamm"] : [who];
    const mine = runs.filter((e) => names.includes(e.driver) || names.includes(e.coDriver));
    let trip = null;
    try { const t = await env.JJ.prepare("SELECT value FROM meta WHERE key=?").bind("gps-trip:" + who).first(); trip = t && t.value ? JSON.parse(t.value) : null; } catch {}
    const tripOn = !!(trip && trip.active && ms(trip.expiresAt) > Date.now());
    // A run counts as "now" from 30 min before its start until its end (or 3 h after start when no end is set).
    const live = mine.find((e) => { const a = toMin(e.time); if (a == null) return false; const b = toMin(e.endTime) ?? a + 180; return nowMin >= a - 30 && nowMin <= b + 15; });
    const run = live || (tripOn ? mine.find((e) => e.vehicle) || mine[0] : null) || null;
    out.push({ src: "jj", member: who, lat: p.lat, lng: p.lng, acc: p.accuracy, at: p.recordedAt,
      vehicle: run && run.vehicle ? run.vehicle : null, onRun: !!(tripOn || live), runTitle: run ? run.title : "" });
  }
  return out;
}

function placeKind(name) {
  const n = String(name || "").toLowerCase();
  if (/fire|station|firehouse|ssc|work/.test(n)) return "fire";
  if (/home|house/.test(n)) return "home";
  return null;
}

async function buildWhere(env) {
  await ensureSchema(env);
  const people = (await env.PEOPLE.prepare("SELECT * FROM people WHERE hidden=0 ORDER BY sort").all()).results || [];
  const members = (await env.OHANA.prepare("SELECT id,name,avatar FROM members").all()).results || [];
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const feed = (await env.PEOPLE.prepare("SELECT * FROM feed_positions").all()).results || [];
  const places = (await env.PEOPLE.prepare("SELECT * FROM places").all()).results || [];
  const [limo, jj, fam] = await Promise.all([limoDrivers(env).catch(() => []), jjDrivers(env).catch(() => []), familyPeople(env, 0, true).catch(() => [])]);
  const lc = (s) => String(s || "").trim().toLowerCase();
  const charFor = (memberId) => {
    const m = memberById[memberId]; if (!m) return null;
    const c = CHARS[m.avatar]; return c ? { art: c.f, character: c.n } : null;
  };
  const used = new Set();
  const result = [];
  const emit = (o) => result.push(o);
  const first = (src, n) => { n = lc(n); if (!n || / /.test(n)) return null; const hits = feed.filter((f) => f.source === src && lc(f.who).split(" ")[0] === n); return hits.length === 1 ? lc(hits[0].who) : null; };
  const nameOk = (src, f, n) => lc(f.who) === lc(n) || (!feed.some((g) => g.source === src && lc(g.who) === lc(n)) && first(src, n) === lc(f.who));
  const pickFeed = (p) => feed.filter((f) => (f.source === "life360" && nameOk("life360", f, p.life360_name)) || (f.source === "google" && nameOk("google", f, p.google_name)))
    .sort((a, b) => ms(b.at) - ms(a.at))[0];

  for (const p of people) {
    const ch = charFor(p.ohana_member_id);
    const l = limo.find((d) => d.driverId === p.limo_driver_id);
    const j = jj.find((d) => d.member === p.jj_member);
    const f = pickFeed(p);
    if (l) { used.add("limo:" + l.driverId); const v = vehicleArt(l.vehicle);
      emit({ key: p.key, name: p.name, lat: l.lat, lng: l.lng, at: l.at, src: "Limo app", kind: "vehicle", art: v.art, label: v.label + " · on the clock" + (l.run ? " · run " + l.run : "") }); }
    else if (j && j.onRun) { const v = vehicleArt(j.vehicle);
      emit({ key: p.key, name: p.name, lat: j.lat, lng: j.lng, at: j.at, src: "JJ Friends", kind: "vehicle", art: v.art, label: (j.vehicle ? v.label : "Driving") + " · JJ run" }); }
    else {
      const cands = [];
      if (j) cands.push({ lat: j.lat, lng: j.lng, at: j.at, src: "JJ Friends", place: null });
      const o = fam.find((x) => x.memberId === p.ohana_member_id);
      if (o) { cands.push({ lat: o.lat, lng: o.lng, at: o.at, src: "Ohana", place: null }); used.add("ohana:" + o.memberId); }
      if (f) cands.push({ lat: f.lat, lng: f.lng, at: f.at, src: f.source === "life360" ? "Life360" : "Google", place: f.place, since: f.since });
      if (!cands.length) continue;
      const c = cands.sort((a, b) => ms(b.at) - ms(a.at))[0];
      let kind = ch ? "character" : "pin", art = ch ? ch.art : null, label = c.place || "";
      if (p.rule === "firefighter") {
        let k = placeKind(c.place);
        if (!k) { const near = places.find((pl) => meters(c.lat, c.lng, pl.lat, pl.lng) <= (pl.radius_m || 200)); if (near) { k = near.kind; label = near.name; } }
        if (k === "fire") { kind = "vehicle"; art = "fire-truck.svg"; label = (label || "Fire station") + " · on shift"; }
        else if (k === "home") { kind = "place"; art = "house.svg"; label = label || "Home"; }
      }
      emit({ key: p.key, name: p.name, lat: c.lat, lng: c.lng, at: c.at, src: c.src, kind, art, label, character: ch ? ch.character : null });
    }
    if (f) used.add(f.source + ":" + lc(f.who));
  }
  // Drivers on the clock who aren't in the people list yet still show (as their vehicle).
  for (const l of limo) {
    if (used.has("limo:" + l.driverId) || people.some((p) => p.limo_driver_id === l.driverId)) continue;
    const v = vehicleArt(l.vehicle);
    emit({ key: "limo-" + l.driverId, name: l.first || l.name, lat: l.lat, lng: l.lng, at: l.at, src: "Limo app", kind: "vehicle", art: v.art, label: v.label + " · on the clock" });
  }
  // Family sharing in Ohana who aren't in the people list show as their character.
  for (const o of fam) if (!used.has("ohana:" + o.memberId) && !people.some((p) => p.ohana_member_id === o.memberId)) emit(o);
  // Anyone else sharing on Life360/Google shows by their own name.
  for (const f of feed) {
    if (used.has(f.source + ":" + lc(f.who)) || Date.now() - ms(f.at) > FEED_KEEP_MS || /@/.test(f.who)) continue; // an email name is the sharing account itself
    emit({ key: f.source + "-" + lc(f.who), name: f.who, lat: f.lat, lng: f.lng, at: f.at, src: f.source === "life360" ? "Life360" : "Google", kind: "pin", art: null, label: f.place || "" });
  }
  const l360 = await getSetting(env, "life360_status");
  return { ok: true, version: VERSION, now: new Date().toISOString(), people: result,
    sources: { limo: limo.length, jj: jj.length, life360: l360 ? JSON.parse(l360) : { connected: false }, google: feed.some((f) => f.source === "google") } };
}

// ---- Life360 (unofficial API, same calls the Home Assistant Life360 integration makes). Key is Kevin's own, typed by him on the map page.
const L360 = "https://api-cloudfront.life360.com";
const L360_HEADERS = (tok) => ({ authorization: "Bearer " + tok, accept: "application/json", "cache-control": "no-cache", "user-agent": "com.life360.android.safetymapd/KOKO/23.50.0 android/13" });
export async function pollLife360(env) {
  await ensureSchema(env);
  const tok = await getSetting(env, "life360_key");
  if (!tok) return { connected: false };
  const status = { connected: true, at: new Date().toISOString(), members: 0, error: null };
  try {
    const cr = await fetch(L360 + "/v4/circles", { headers: L360_HEADERS(tok) });
    if (!cr.ok) throw new Error("circles " + cr.status);
    const circles = ((await cr.json()).circles) || [];
    const lastPlaces = +(await getSetting(env, "life360_places_at") || 0);
    for (const c of circles) {
      const mr = await fetch(L360 + "/v3/circles/" + c.id + "/members", { headers: L360_HEADERS(tok) });
      if (!mr.ok) throw new Error("members " + mr.status);
      for (const m of ((await mr.json()).members) || []) {
        const loc = m.location; if (!loc || loc.latitude == null) continue;
        const at = new Date(1000 * +(loc.timestamp || 0) || Date.now()).toISOString();
        const since = loc.since ? new Date(1000 * +loc.since).toISOString() : null;
        await env.PEOPLE.prepare("INSERT INTO feed_positions(source,who,lat,lng,acc,place,since,at) VALUES('life360',?,?,?,?,?,?,?) ON CONFLICT(source,who) DO UPDATE SET lat=excluded.lat,lng=excluded.lng,acc=excluded.acc,place=excluded.place,since=excluded.since,at=excluded.at")
          .bind(String(m.firstName || "").trim(), +loc.latitude, +loc.longitude, +loc.accuracy || null, loc.name || null, since, at).run();
        status.members++;
      }
      if (Date.now() - lastPlaces > 6 * 3600e3) {
        const pr = await fetch(L360 + "/v3/circles/" + c.id + "/places", { headers: L360_HEADERS(tok) });
        if (pr.ok) for (const pl of ((await pr.json()).places) || []) {
          const k = placeKind(pl.name); if (!k) continue;
          await env.PEOPLE.prepare("INSERT INTO places(name,kind,lat,lng,radius_m,source,ext_id) VALUES(?,?,?,?,?,'life360',?) ON CONFLICT(ext_id) DO UPDATE SET name=excluded.name,kind=excluded.kind,lat=excluded.lat,lng=excluded.lng,radius_m=excluded.radius_m")
            .bind(pl.name, k, +pl.latitude, +pl.longitude, Math.max(+pl.radius || 150, 120), "l360:" + pl.id).run();
        }
      }
    }
    await setSetting(env, "life360_places_at", String(Date.now()));
  } catch (e) { status.error = String(e.message || e); }
  await setSetting(env, "life360_status", JSON.stringify(status));
  return status;
}

// ---- Each Ohana Home person can connect their OWN Life360. Their people go in member_feed under their id and only they see them.
export async function pollMemberLife360(env, row) {
  const status = { connected: true, at: new Date().toISOString(), members: 0, error: null };
  try {
    const cr = await fetch(L360 + "/v4/circles", { headers: L360_HEADERS(row.key) });
    if (!cr.ok) throw new Error("circles " + cr.status);
    for (const c of ((await cr.json()).circles) || []) {
      const mr = await fetch(L360 + "/v3/circles/" + c.id + "/members", { headers: L360_HEADERS(row.key) });
      if (!mr.ok) throw new Error("members " + mr.status);
      for (const m of ((await mr.json()).members) || []) {
        const loc = m.location; if (!loc || loc.latitude == null) continue;
        const who = [m.firstName, m.lastName].filter(Boolean).join(" ").trim().slice(0, 40); if (!who) continue;
        await env.PEOPLE.prepare("INSERT INTO member_feed(owner_id,source,who,lat,lng,acc,place,since,at) VALUES(?,'life360',?,?,?,?,?,?,?) ON CONFLICT(owner_id,source,who) DO UPDATE SET lat=excluded.lat,lng=excluded.lng,acc=excluded.acc,place=excluded.place,since=excluded.since,at=excluded.at")
          .bind(row.member_id, who, +loc.latitude, +loc.longitude, +loc.accuracy || null, loc.name || null, loc.since ? new Date(1000 * +loc.since).toISOString() : null, new Date(1000 * +(loc.timestamp || 0) || Date.now()).toISOString()).run();
        status.members++;
      }
    }
  } catch (e) { status.error = String(e.message || e); }
  await env.PEOPLE.prepare("UPDATE member_life360 SET status=?,at=? WHERE member_id=?").bind(JSON.stringify(status), status.at, row.member_id).run();
  return status;
}
async function pollAllMembers(env) {
  await ensureSchema(env);
  const rows = (await env.PEOPLE.prepare("SELECT member_id,key FROM member_life360 LIMIT 50").all()).results || [];
  for (const r of rows) await pollMemberLife360(env, r).catch(() => null);
}
// A person's own people (from their own Life360), shown by name. Never anyone else's.
async function myPeople(env, me) {
  const rows = (await env.PEOPLE.prepare("SELECT * FROM member_feed WHERE owner_id=?").bind(me.id).all()).results || [];
  return rows.filter((f) => Date.now() - ms(f.at) <= FEED_KEEP_MS)
    .map((f) => ({ key: "mine-" + f.source + "-" + f.who.toLowerCase(), name: f.who, lat: f.lat, lng: f.lng, at: f.at, src: "Life360", kind: "pin", art: null, label: f.place || "" }));
}

async function readJson(req) { try { return await req.json(); } catch { return null; } }

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(Promise.all([pollLife360(env).catch((e) => console.error(String(e))), pollAllMembers(env).catch((e) => console.error(String(e)))])); },
  async fetch(req, env) {
    const url = new URL(req.url), p = url.pathname.replace(/\/+$/, "") || "/";
    if (p.startsWith("/people/api/family")) {
      const me = await ohanaMember(req, env);
      if (!me) return json({ ok: false, error: "sign in" }, 401);
      await ensureSchema(env);
      if (p === "/people/api/family" && req.method === "GET") {
        const mine = await env.PEOPLE.prepare("SELECT sharing FROM family_share WHERE member_id=?").bind(me.id).first();
        const l = await env.PEOPLE.prepare("SELECT status FROM member_life360 WHERE member_id=?").bind(me.id).first();
        return json({ ok: true, me: { id: me.id, name: me.name, sharing: !!(mine && mine.sharing) }, people: await familyPeople(env, me.id, false),
          mine: await myPeople(env, me), life360: l ? JSON.parse(l.status || '{"connected":true}') : { connected: false } });
      }
      if (p === "/people/api/family/life360" && req.method === "POST") { // this person's OWN Life360 key
        const b = await readJson(req); const k = String((b && b.key) || "").trim().replace(/^Bearer\s+/i, "");
        if (b && b.off) {
          await env.PEOPLE.prepare("DELETE FROM member_life360 WHERE member_id=?").bind(me.id).run();
          await env.PEOPLE.prepare("DELETE FROM member_feed WHERE owner_id=?").bind(me.id).run();
          return json({ ok: true, connected: false });
        }
        if (k.length < 20 || k.length > 400 || /\s/.test(k)) return json({ ok: false, error: "That doesn't look like a Life360 key." }, 400);
        await env.PEOPLE.prepare("INSERT INTO member_life360(member_id,key,at) VALUES(?,?,?) ON CONFLICT(member_id) DO UPDATE SET key=excluded.key,at=excluded.at").bind(me.id, k, new Date().toISOString()).run();
        return json({ ok: true, status: await pollMemberLife360(env, { member_id: me.id, key: k }) });
      }
      if (p === "/people/api/family/share" && req.method === "POST") {
        const b = await readJson(req); const on = !!(b && b.on);
        if (on) await env.PEOPLE.prepare("INSERT INTO family_share(member_id,sharing,changed) VALUES(?,1,?) ON CONFLICT(member_id) DO UPDATE SET sharing=1,changed=excluded.changed").bind(me.id, new Date().toISOString()).run();
        else await env.PEOPLE.prepare("INSERT INTO family_share(member_id,sharing,changed) VALUES(?,0,?) ON CONFLICT(member_id) DO UPDATE SET sharing=0,lat=NULL,lng=NULL,acc=NULL,at=NULL,changed=excluded.changed").bind(me.id, new Date().toISOString()).run();
        return json({ ok: true, sharing: on });
      }
      if (p === "/people/api/family/spot" && req.method === "POST") {
        const b = await readJson(req); const lat = +(b && b.lat), lng = +(b && b.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return json({ ok: false }, 400);
        const r = await env.PEOPLE.prepare("UPDATE family_share SET lat=?,lng=?,acc=?,at=? WHERE member_id=? AND sharing=1").bind(lat, lng, Number.isFinite(+b.acc) ? +b.acc : null, new Date().toISOString(), me.id).run();
        return json({ ok: true, saved: !!(r.meta && r.meta.changes) });
      }
      return json({ ok: false, error: "not found" }, 404);
    }
    if (req.method === "GET" && (p === "/people" || p === "/people/index.html" || p === "/people/family"))
      return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-frame-options": "SAMEORIGIN", "referrer-policy": "strict-origin-when-cross-origin" } });
    if (req.method === "GET" && p === "/people/room") // Where's Waldo room, shown inside Ohana Gathering
      return new Response(ROOM, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-frame-options": "SAMEORIGIN", "referrer-policy": "strict-origin-when-cross-origin" } });
    if (req.method === "GET" && p.startsWith("/people/art/")) {
      const a = ART[p.slice(12)];
      if (!a) { // painted art kept in D1 (too big for the bundle), split into parts
        await ensureSchema(env);
        const rows = (await env.PEOPLE.prepare("SELECT type,data FROM art WHERE name=? ORDER BY part").bind(p.slice(12)).all()).results || [];
        if (!rows.length) return new Response("Not found", { status: 404 });
        const parts = rows.map((r) => new Uint8Array(r.data)), out = new Uint8Array(parts.reduce((n, x) => n + x.length, 0));
        let o = 0; for (const x of parts) { out.set(x, o); o += x.length; }
        return new Response(out, { headers: { "content-type": rows[0].type, "cache-control": "public, max-age=86400" } });
      }
      return new Response(a[0], { headers: { "content-type": a[1], "cache-control": "public, max-age=86400" } });
    }
    if (p === "/people/api/feed" && req.method === "POST") { // Home Assistant / other apps push positions here.
      await ensureSchema(env);
      const key = await getSetting(env, "feed_key");
      if (!key || req.headers.get("x-feed-key") !== key) return json({ ok: false, error: "not allowed" }, 403);
      const body = await readJson(req); const list = Array.isArray(body) ? body : body && Array.isArray(body.people) ? body.people : [];
      let n = 0;
      for (const x of list.slice(0, 50)) {
        const src = x.source === "google" ? "google" : x.source === "life360" ? "life360" : null;
        const lat = +x.lat, lng = +(x.lng ?? x.lon);
        if (!src || !x.name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
        await env.PEOPLE.prepare("INSERT INTO feed_positions(source,who,lat,lng,acc,place,since,at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(source,who) DO UPDATE SET lat=excluded.lat,lng=excluded.lng,acc=excluded.acc,place=excluded.place,since=excluded.since,at=excluded.at")
          .bind(src, String(x.name).slice(0, 40), lat, lng, +x.acc || null, x.place ? String(x.place).slice(0, 60) : null, x.since || null, x.at || new Date().toISOString()).run();
        n++;
      }
      return json({ ok: true, saved: n });
    }
    if (p.startsWith("/people/api/")) {
      const me = await ohanaAdmin(req, env);
      if (!me) return json({ ok: false, error: "sign in" }, 401);
      if (p === "/people/api/where" && req.method === "GET") return json(await buildWhere(env));
      if (p === "/people/api/art" && req.method === "POST") { // admin: save painted room art (from a Figma export link, or bytes sent from the page)
        await ensureSchema(env);
        const name = (url.searchParams.get("name") || "").replace(/[^a-z0-9.-]/gi, "");
        if (!/^[a-z0-9-]+\.(webp|jpe?g|png)$/i.test(name)) return json({ ok: false, error: "bad name" }, 400);
        let buf, type;
        const from = url.searchParams.get("from") || "";
        if (from) {
          const u = new URL(from);
          if (u.hostname !== "www.figma.com" || !u.pathname.startsWith("/api/mcp/asset/")) return json({ ok: false, error: "bad source" }, 400);
          const r = await fetch(u.toString()); if (!r.ok) return json({ ok: false, error: "fetch " + r.status }, 502);
          buf = new Uint8Array(await r.arrayBuffer()); type = r.headers.get("content-type") || "image/png";
        } else { buf = new Uint8Array(await req.arrayBuffer()); type = req.headers.get("content-type") || "image/webp"; }
        if (!buf.length || buf.length > 8e6) return json({ ok: false, error: "size" }, 400);
        await env.PEOPLE.prepare("DELETE FROM art WHERE name=?").bind(name).run();
        const CH = 900000;
        for (let i = 0, n = 0; i < buf.length; i += CH, n++)
          await env.PEOPLE.prepare("INSERT INTO art(name,part,type,data,at) VALUES(?,?,?,?,?)").bind(name, n, type, buf.slice(i, i + CH), new Date().toISOString()).run();
        return json({ ok: true, name, bytes: buf.length, type });
      }
      if (p === "/people/api/life360" && req.method === "POST") {
        await ensureSchema(env);
        const b = await readJson(req); const k = String((b && b.key) || "").trim();
        if (b && b.off) { await env.PEOPLE.prepare("DELETE FROM settings WHERE key IN ('life360_key','life360_status')").run(); return json({ ok: true, connected: false }); }
        if (k.length < 20 || k.length > 400 || /\s/.test(k)) return json({ ok: false, error: "That doesn't look like a Life360 key." }, 400);
        await setSetting(env, "life360_key", k.replace(/^Bearer\s+/i, ""));
        return json({ ok: true, status: await pollLife360(env) });
      }
      return json({ ok: false, error: "not found" }, 404);
    }
    return new Response("Not found", { status: 404 });
  },
};
