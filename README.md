# Ohana Wake Word (Okay Duet) download

Android app `com.ohana.wakeword`, version 1.1 (versionCode 2). Installs over 1.0 (same signer).
Listens on the phone, offline, for "Okay Duet", says "I'm here.", opens Claude Duet and presses Duet's call button so you land in a voice call.

- File: `Ohana-Wake-Word.apk`
- sha256: `70a2213ca70fae248e57bc6dafcea834890f04c92977da878a6756061e8c69a9`
- Signer cert sha256: `35e8228518ece89bcfd61f32f6c4e1215ce95cd465314a609a93cdb65549c334` (same Ohana phone key as Ohana Command and Heartville Next)
- Source: private repo kevinfudge911/ohana-brain, branch `ohana-wake-word`, commit 95089a4. Signed build + test pictures on branch `ohana-wake-word-out-95089a4`.
- Holds no keys or passwords.

New in 1.1:
- Says "I'm here." out loud (or "I'm here. Unlock your phone." when the PIN is needed).
- "Call button" helper (Android accessibility, Claude Duet only) presses Duet's call button right after the wake word. If it can't tell which button that is, it asks you to tap it once and remembers it.
- Lets go of the mic while you talk to Duet and listens again after.
- "Car unlock" steps for Samsung Extend Unlock (stays unlocked while connected to the car, up to 4 hours).

Version 1.0 (sha256 59567e71...b26a8b) is in this branch's history, commit 111eef2.

Posted Nov 25 2026 by Do It so it can be installed on the phone from one link.
