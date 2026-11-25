// ohana-wheres-my-people: "Where's My People?" map for Ohana Home (ohanahome.app/people).
// Kevin only (Ohana admin). One map of everyone who shares location with him:
//  - Unique Rides Transportation limo app drivers on the clock (D1 limo-for-you) -> shown as the vehicle they're in
//  - JJ Friends drivers (D1 jj_friends_db) -> vehicle picked for today's run, else their Ohana character
//  - Life360 (polled here with Kevin's own Life360 key, or pushed in) and Google sharing (pushed in) -> feed_positions
// Everyone else shows as their Ohana character when they have one.
import PAGE from "./page.html";
import ROOM from "./room.html";
import ROOM_NEXT from "./room-next.html";
import HOOK from "./hook.js.txt";
const HOOK_V = (() => { let h = 0; for (let i = 0; i < HOOK.length; i++) h = (h * 31 + HOOK.charCodeAt(i)) | 0; return (h >>> 0).toString(36); })();
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
import ART_TOWN2X from "./art/waldo-town-2x.webp";
import ART_PERSON from "./art/person.svg";

const VERSION = "people-v6"; // schema version; places (geo, nights) added Nov 24
const ART = {
  "pinkey.webp": [ART_PINKEY, "image/webp"], "executive.webp": [ART_EXECUTIVE, "image/webp"],
  "majestic-pearl.webp": [ART_PEARL, "image/webp"], "h2-thunder.webp": [ART_H2, "image/webp"],
  "grand-van.webp": [ART_VAN, "image/webp"],
  "fire-truck.svg": [ART_FIRETRUCK, "image/svg+xml"], "house.svg": [ART_HOUSE, "image/svg+xml"], "car.svg": [ART_CAR, "image/svg+xml"], "waldo-sign.webp": [ART_SIGN, "image/webp"], "waldo-town.webp": [ART_TOWN, "image/webp"], "waldo-town-2x.webp": [ART_TOWN2X, "image/webp"], "person.svg": [ART_PERSON, "image/svg+xml"],
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
  const all = (await env.PEOPLE.prepare("SELECT * FROM people ORDER BY sort").all()).results || [];
  const people = all.filter((p) => !p.hidden);
  // A hidden row with a Life360/Google name keeps that account off the map (e.g. an old business account).
  const skip = new Set(all.filter((p) => p.hidden).flatMap((p) => [p.life360_name && "life360:" + String(p.life360_name).trim().toLowerCase(), p.google_name && "google:" + String(p.google_name).trim().toLowerCase()]).filter(Boolean));
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
  const nameOk1 = (src, f, n) => lc(f.who) === lc(n) || (!feed.some((g) => g.source === src && lc(g.who) === lc(n)) && first(src, n) === lc(f.who));
  // A person's feed name can list a few names, like "Suzanne|Sue|KangaSue", since a Google or Life360 account may use any of them.
  const nameOk = (src, f, n) => String(n || "").split("|").some((x) => x.trim() && nameOk1(src, f, x.trim()));
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
    if (used.has(f.source + ":" + lc(f.who)) || skip.has(f.source + ":" + lc(f.who)) || Date.now() - ms(f.at) > FEED_KEEP_MS || /@/.test(f.who)) continue; // an email name is the sharing account itself
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


// ---- Where each person really is, in plain words, and which spot of the Where's Waldo picture that is.
const HOME_BASE = { lat: 36.99082, lng: -93.5744, r: 250 }; // home base (Kevin, Mike): State Highway 413, Billings
const UA = { "user-agent": "OhanaHome-people-map/1.0 (family location room)", "accept-language": "en" };
async function geoInfo(env, lat, lng, budget) {
  const k = lat.toFixed(4) + "," + lng.toFixed(4);
  const hit = await env.PEOPLE.prepare("SELECT * FROM geo WHERE k=?").bind(k).first();
  if (hit || budget.n <= 0) return hit || null;
  budget.n--;
  let addr = "", street = "", town = "", cls = "", typ = "", fire = 0;
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, { headers: UA });
    if (r.ok) {
      const j = await r.json(), a = j.address || {};
      street = a.road || a.pedestrian || a.footway || "";
      town = a.city || a.town || a.village || a.hamlet || a.suburb || a.county || "";
      addr = [[a.house_number, street].filter(Boolean).join(" "), town].filter(Boolean).join(", ");
      cls = j.category || j.class || ""; typ = j.type || "";
      if (j.name && cls !== "highway" && cls !== "place" && cls !== "building") addr = j.name + (addr ? ", " + addr : "");
    }
  } catch {}
  try {
    const q = `[out:json][timeout:8];nwr(around:220,${lat},${lng})["amenity"="fire_station"];out ids 1;`;
    const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { ...UA, "content-type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(q) });
    if (r.ok) fire = ((await r.json()).elements || []).length ? 1 : 0;
  } catch {}
  await env.PEOPLE.prepare("INSERT INTO geo(k,addr,street,town,cls,typ,fire,at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(k) DO UPDATE SET addr=excluded.addr,street=excluded.street,town=excluded.town,cls=excluded.cls,typ=excluded.typ,fire=excluded.fire,at=excluded.at")
    .bind(k, addr, street, town, cls, typ, fire, new Date().toISOString()).run();
  return { addr, street, town, cls, typ, fire };
}
function zoneOf(g) {
  const c = (g && g.cls) || "", t = (g && g.typ) || "";
  if (g && g.fire) return "fire";
  if (t === "place_of_worship") return "church";
  if (c === "shop" || t === "marketplace" || t === "mall") return "shop";
  if (/restaurant|fast_food|cafe|bar|pub|ice_cream/.test(t)) return "food";
  if (t === "marina" || c === "waterway" || t === "water" || t === "beach") return "water";
  if (/school|college|university|kindergarten/.test(t)) return "school";
  if (c === "leisure" || t === "park") return "park";
  return "town";
}
// A spot someone sleeps at on 2 different nights becomes their house ("Ashley's house") and gets its own little house in the picture.
async function learnHome(env, p) {
  const min = ctMinutes(new Date(p.at || Date.now()));
  if (!(min >= 22 * 60 || min < 6 * 60) || Date.now() - ms(p.at) > 2 * 3600e3) return;
  if (meters(p.lat, p.lng, HOME_BASE.lat, HOME_BASE.lng) <= HOME_BASE.r) return;
  const night = ctDate(new Date(ms(p.at) - 6 * 3600e3)), who = String(p.key);
  const cell = (Math.round(p.lat * 500) / 500).toFixed(3) + "," + (Math.round(p.lng * 500) / 500).toFixed(3);
  const row = await env.PEOPLE.prepare("SELECT * FROM nights WHERE who=? AND cell=?").bind(who, cell).first();
  if (row && row.last_night === night) return;
  const n = (row ? row.nights : 0) + 1;
  await env.PEOPLE.prepare("INSERT INTO nights(who,cell,lat,lng,nights,last_night) VALUES(?,?,?,?,?,?) ON CONFLICT(who,cell) DO UPDATE SET nights=excluded.nights,last_night=excluded.last_night,lat=excluded.lat,lng=excluded.lng").bind(who, cell, p.lat, p.lng, n, night).run();
  if (n >= 2) {
    const first = String(p.name || "").split(" ")[0] || "Their";
    await env.PEOPLE.prepare("INSERT INTO places(name,kind,lat,lng,radius_m,source,ext_id) VALUES(?,?,?,?,?,'learned',?) ON CONFLICT(ext_id) DO NOTHING")
      .bind(first + "'s house", "house", p.lat, p.lng, 150, "house:" + who).run();
  }
}
async function placePeople(env, list) {
  const places = (await env.PEOPLE.prepare("SELECT id,name,kind,lat,lng,radius_m,ext_id FROM places").all()).results || [];
  const budget = { n: 3 }, keys = new Set(list.map((p) => "house:" + p.key));
  for (const p of list) {
    if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;
    await learnHome(env, p).catch(() => null);
    p.maps = `https://www.google.com/maps/search/?api=1&query=${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
    p.dir = `https://www.google.com/maps/dir/?api=1&destination=${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
    const g = await geoInfo(env, p.lat, p.lng, budget).catch(() => null);
    if (g) { p.addr = String(g.addr || "").split(";")[0]; p.street = String(g.street || "").split(";")[0]; p.town = g.town || ""; }
    const lab = String(p.label || "").replace(/,\s*USA$/, "").replace(/,\s*[A-Z]{2} \d{5}/, "");
    if (/^\d+\s+\S/.test(lab) || (!p.addr && /road|rd\b|st\b|hwy|ave|ln\b|dr\b/i.test(lab))) p.addr = lab;
    const near = places.filter((x) => meters(p.lat, p.lng, x.lat, x.lng) <= (x.radius_m || 150)).sort((a, b) => meters(p.lat, p.lng, a.lat, a.lng) - meters(p.lat, p.lng, b.lat, b.lng))[0];
    if (p.kind === "vehicle" && !/fire-truck/.test(p.art || "")) p.zone = "road";
    else if (meters(p.lat, p.lng, HOME_BASE.lat, HOME_BASE.lng) <= HOME_BASE.r) { p.zone = "home"; p.place = "Home"; p.addr = "46331 State Hwy 413, Billings"; }
    else if (near && near.kind === "fire") { p.zone = "fire"; p.place = near.name || "Fire station"; }
    else if (near && (near.kind === "house" || near.kind === "home")) { p.zone = "house"; p.place = near.name; p.house = near.id; }
    else { p.zone = (p.art && /fire-truck/.test(p.art)) ? "fire" : zoneOf(g); if (p.zone === "fire") p.place = p.place || "Fire station"; }
  }
  // Only houses that belong to, or hold, someone this person can already see.
  const here = new Set(list.map((p) => p.house).filter(Boolean));
  const houses = places.filter((x) => x.kind === "house" && (keys.has(x.ext_id) || here.has(x.id))).map((x) => ({ id: x.id, name: x.name }));
  return { people: list, houses };
}

// ---- Where's Waldo opened by itself (the town's shop): one step, no trip through Ohana Home's screens.
// The room page gets Ohana Home's own Bridge (copied live from Ohana Home's page, so it always matches
// every other room) and the Gathering's painted world behind it. Nothing in ohana-home is changed.
const BRIDGE_STYLE_ID = "ohana-arched-bridge-header-style-v1", BRIDGE_SCRIPT_ID = "ohana-arched-bridge-header-v1";
const LIVE_KEEP_MS = 10 * 60e3, LIVE_CACHE_URL = "https://ohanahome.app/people/_live-bridge-v4";
let liveMemo = null; // parts copied from Ohana Home's page
// Keep only the CSS rules (with their @media) whose body matches re.
function pickRules(css, re) {
  const out = []; let i = 0;
  while (i < css.length) {
    const b = css.indexOf("{", i); if (b < 0) break;
    let d = 1, j = b + 1;
    while (j < css.length && d) { const c = css[j]; if (c === "{") d++; else if (c === "}") d--; j++; }
    const sel = css.slice(i, b).replace(/\/\*[\s\S]*?\*\//g, "").trim(), body = css.slice(b + 1, j - 1);
    if (/^@(media|supports)/.test(sel)) { const inner = pickRules(body, re); if (inner.length) out.push(sel + "{" + inner.join("") + "}"); }
    else if (/^@layer/.test(sel)) out.push(...pickRules(body, re)); // this page has no layers of its own, so the rules go in plain
    else if (sel && !sel.startsWith("@") && re.test(body)) out.push(sel + "{" + body + "}");
    i = j;
  }
  return out;
}
async function readLive(env) {
  const res = await env.OHANA_HOME.fetch(new Request("https://ohanahome.app/", { headers: { "user-agent": "OhanaHome-people-map/1.0 (bridge copy)" } }));
  if (!res.ok) throw new Error("ohana-home " + res.status);
  const got = { bridgeCss: "", bridgeJs: "", worldCss: [] };
  let css = null, js = null;
  const rw = new HTMLRewriter()
    .on("style", { element(e) { css = { id: e.getAttribute("id") || "", t: "" }; }, text(t) { if (!css) return; css.t += t.text; if (t.lastInTextNode) {
      if (css.id === BRIDGE_STYLE_ID) got.bridgeCss = css.t;
      else if (/-gathering-(wide|portrait)/.test(css.t)) got.worldCss.push(...pickRules(css.t, /-gathering-(wide|portrait)/));
      css = null; } } })
    .on("script", { element(e) { js = (e.getAttribute("id") || "") === BRIDGE_SCRIPT_ID ? { t: "" } : null; },
      text(t) { if (!js) return; js.t += t.text; if (t.lastInTextNode) { got.bridgeJs = js.t; js = null; } } });
  await rw.transform(res).arrayBuffer();
  // A bare file name in the copied CSS means the site root, not /people/.
  got.worldCss = got.worldCss.map((r) => r.replace(/url\(\s*(['"]?)([^'")]*)/gi, (m, q, u) => /^([a-z][a-z0-9+.-]*:|\/)/i.test(u) ? m : "url(" + q + "/" + u));
  if (!got.bridgeCss || !got.bridgeJs) throw new Error("bridge not found");
  return got;
}
async function liveParts(env, ctx) {
  if (liveMemo && Date.now() - liveMemo.at < LIVE_KEEP_MS) return liveMemo.parts;
  const cache = caches.default, key = new Request(LIVE_CACHE_URL);
  const hit = await cache.match(key).catch(() => null);
  if (hit) { const parts = await hit.json().catch(() => null); if (parts) { liveMemo = { at: Date.now(), parts }; return parts; } }
  try {
    const parts = await readLive(env);
    liveMemo = { at: Date.now(), parts };
    const put = cache.put(key, new Response(JSON.stringify(parts), { headers: { "content-type": "application/json", "cache-control": "max-age=600" } })).catch(() => null);
    if (ctx) ctx.waitUntil(put);
    return parts;
  } catch (e) { console.error("bridge copy: " + e); return liveMemo ? liveMemo.parts : null; }
}
const scriptSafe = (t) => String(t).replace(/<\/script/gi, "<\\/script");
const styleSafe = (t) => String(t).replace(/<\/style/gi, "<\\/style");
async function roomPage(req, env, ctx, ROOM_HTML = ROOM) {
  // Inside Ohana Home's Gathering the hook asks for ?framed=1 (Ohana Home's own service worker can hide the iframe header).
  const framed = new URL(req.url).searchParams.has("framed") || /^(iframe|frame|embed|object)$/.test(req.headers.get("sec-fetch-dest") || "");
  if (framed) return ROOM_HTML.replace("<!--SOLO_HEAD-->", "").replace("<!--SOLO_BODY-->", "");
  const live = await liveParts(env, ctx);
  const head = live ? "<style>" + styleSafe(live.bridgeCss) + "</style>\n<style>html{background-color:#6b4a2b}" + styleSafe(live.worldCss.join("\n")) +
    "\n:root[data-ohana-season]{background-color:#173c36;background-image:var(--harvest-scene,none);background-position:50% 0;background-size:cover;background-attachment:fixed}</style>" : "<style>html{background-color:#6b4a2b}</style>";
  // The Gathering's painted world follows the season Ohana Home is showing (its art rules name the season).
  const seasons = live ? [...new Set(live.worldCss.join(" ").match(/data-ohana-season="?([a-z-]+)/g) || [])].map((x) => x.replace(/.*=\"?/, "")) : [];
  const season = seasons.length === 1 ? seasons[0] : "";
  const body = '<div id="app"><header id="soloHead" class="ohana-entrance-heading ohana-gathering-heading"><button type="button" class="soft room-home-control" data-close>Back</button>' +
    '<h1 data-unified-title-source>Where’s Waldo</h1></header></div>\n' +
    "<script>(function(){var r=document.documentElement;if(!r.dataset.ohanaSeason&&" + JSON.stringify(season) + ")r.dataset.ohanaSeason=" + JSON.stringify(season) + ";" +
    "try{var tk=localStorage.getItem('ohana_token');if(tk&&r.dataset.ohanaSeason)fetch('/people/api/family',{headers:{authorization:'Bearer '+tk}}).then(function(x){return x.ok?x.json():null}).then(function(f){" +
    "if(f&&f.me&&localStorage.getItem('ohana_seasonal_appearance_v1_'+f.me.id)==='normal')delete r.dataset.ohanaSeason;}).catch(function(){});}catch(e){}" +
    "function home(){location.href='/';}window.ohanaOpenBridge=home;" +
    "document.addEventListener('click',function(e){var t=e.target&&e.target.closest&&e.target.closest('[data-ohana-home],#soloHead [data-close]');if(!t)return;e.preventDefault();e.stopPropagation();" +
    "if(t.hasAttribute('data-close')&&document.referrer&&new URL(document.referrer).origin===location.origin&&history.length>1)history.back();else home();},true);})();</script>\n" +
    (live ? "<script>" + scriptSafe(live.bridgeJs) + "</script>" : "");
  return ROOM_HTML.replace("<!--SOLO_HEAD-->", () => head).replace("<!--SOLO_BODY-->", () => body);
}

async function readJson(req) { try { return await req.json(); } catch { return null; } }

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(Promise.all([pollLife360(env).catch((e) => console.error(String(e))), pollAllMembers(env).catch((e) => console.error(String(e)))])); },
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname.replace(/\/+$/, "") || "/";
    // Ohana Home's main page: pass it through from the ohana-home worker untouched, then add the
    // Where's Waldo hook script at the end of <body>. Nothing in ohana-home itself is changed.
    if ((url.pathname === "/" || url.pathname === "/index.html") && env.OHANA_HOME) {
      const res = await env.OHANA_HOME.fetch(req);
      if (req.method !== "GET" || !res.ok || !(res.headers.get("content-type") || "").includes("text/html")) return res;
      return new HTMLRewriter().on("body", { element(e) { e.append('<script src="/people/hook.js?v=' + HOOK_V + '" defer></script>', { html: true }); } }).transform(res);
    }
    if (p === "/people/hook.js") return new Response(HOOK, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" } });
    if (p === "/people/api/hooktest" && env.OHANA_HOME) {
      const r = await env.OHANA_HOME.fetch(new Request("https://ohanahome.app/", { headers: { "user-agent": "OhanaHome-people-map/1.0 (hook test)" } }));
      const t = await r.text();
      return json({ ok: r.ok, status: r.status, type: r.headers.get("content-type"), bytes: t.length, hasBody: t.includes("</body>") });
    }
    if (p.startsWith("/people/api/family")) {
      const me = await ohanaMember(req, env);
      if (!me) return json({ ok: false, error: "sign in" }, 401);
      await ensureSchema(env);
      if (p === "/people/api/family" && req.method === "GET") {
        const mine = await env.PEOPLE.prepare("SELECT sharing FROM family_share WHERE member_id=?").bind(me.id).first();
        const l = await env.PEOPLE.prepare("SELECT status FROM member_life360 WHERE member_id=?").bind(me.id).first();
        const fp = await familyPeople(env, me.id, false), mp = await myPeople(env, me), pl = await placePeople(env, fp.concat(mp));
        return json({ ok: true, me: { id: me.id, name: me.name, sharing: !!(mine && mine.sharing) }, people: fp,
          mine: mp, houses: pl.houses, life360: l ? JSON.parse(l.status || '{"connected":true}') : { connected: false } });
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
    if (req.method === "GET" && (p === "/people/room" || p === "/people/waldo")) // Where's Waldo room: inside Ohana Gathering, or opened straight from the town
      return new Response(await roomPage(req, env, ctx), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", vary: "sec-fetch-dest", "x-frame-options": "SAMEORIGIN", "referrer-policy": "strict-origin-when-cross-origin" } });
    if (req.method === "GET" && p === "/people/room-next") // preview of the next Where's Waldo room (Game + Real Life), not linked anywhere
      return new Response(await roomPage(req, env, ctx, ROOM_NEXT), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", vary: "sec-fetch-dest", "x-frame-options": "SAMEORIGIN", "referrer-policy": "strict-origin-when-cross-origin" } });
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
      if (p === "/people/api/where" && req.method === "GET") { const w = await buildWhere(env); const pl = await placePeople(env, w.people); w.houses = pl.houses; return json(w); }
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
