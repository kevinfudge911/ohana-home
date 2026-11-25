# Ohana Home fixes, Nov 25 2026 (live on Worker ohana-home)

Built on live version c392bd94. Only the main module worker.js changed; every other module is the same as c392bd94.

- Hall light: home hall pictures no longer get the night tint, so the hall is evenly lit (LIVE SKY v2).
- Wind: everything that moves follows the real wind at home base, Billings, MO (windApi uses WIND_HOME). A ?member= look-up still reads that person's place.
- Chimes: hang still in dead calm (CHIMES ALL AROUND v3.1).
- Back: goes back one step at a time (BACK ONE STEP v1, around ohana-screen-history).

How: worker.js adds ohanaAddFix1125 to the ohanaAddJoke chain. It swaps the LIVE SKY and CHIMES blocks in app.html.gz for the new ones and adds the back-one-step parts. app.html.gz is untouched.
Rollback: deploy version c392bd94 at 100%.
