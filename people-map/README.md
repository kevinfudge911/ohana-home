# Where's My People? (ohanahome.app/people)

One map of everyone who shares their location with Pe-paw, inside Ohana Home.

- Worker: `ohana-wheres-my-people`, route `ohanahome.app/people*` (same site as Ohana Home, so the Ohana sign-in works).
- Deploys from this folder on branch `people-map` (Cloudflare Workers Builds, worker ohana-wheres-my-people, preview builds off). Never from `main`; ohana-home itself deploys from main.
- Only Ohana admins (member 5) can see the map.
- Sources: limo app (D1 limo-for-you, drivers on the clock show as their vehicle), JJ Friends (D1 jj_friends_db), Life360 (polled every 2 min with the key Pe-paw pastes himself on the map), Google/Home Assistant (POST /people/api/feed with x-feed-key).
- Ethan: fire truck when Life360 shows him at a fire station place, house when home.
- Vehicle art: cutouts of the real Unique Rides Transportation photos. Black Beauty uses the plain car until its photo is added.
- Family map: `ohanahome.app/people/family`. Any signed-in Ohana member. Sharing is OFF until the person turns it on ("Share" button). Turning it off deletes their spot. They only see family who share an Ohana room with them. A web page can only send location while it is open on the phone.
- Map tiles: OpenStreetMap (CARTO now needs a key).
- Where's Waldo straight from Ohana Town: `ohanahome.app/people/room` (or `/people/waldo`) opened by itself shows the whole room right away, with Ohana Home's own Bridge (Home / Ohana / Where's Waldo) and the Gathering's painted world, both copied live from Ohana Home's page (kept 10 min). Inside Ohana Home's Gathering (an iframe) it shows the room only. Not signed in on that phone: it goes to Ohana Home first so the sign-in shows.
- Names shown: a person's row in `people` sets the name on the map (Ashley Forrester's Google account shows as "Ash"; her Google/Life360 names still match through `google_name`/`life360_name`, "a|b|c").
