# Ohana Wake Word (Okay Duet) download

Android app `com.ohana.wakeword`, version 1.1 (versionCode 2), Nov 25 evening update with new listening. Installs over 1.0 and 1.1 (same signer).
Listens on the phone, offline, for "Okay Duet", "Hey Duet" or "Hey, do it", says "I'm here.", opens Claude Duet and presses Duet's call button so you land in a voice call.

- File: `Ohana-Wake-Word.apk`
- sha256: `041fb4515100af25ce38e0d09321731a41dbb0fc2900d820538ee3dfeef20dcb`
- Signer cert sha256: `35e8228518ece89bcfd61f32f6c4e1215ce95cd465314a609a93cdb65549c334` (same Ohana phone key as Ohana Command and Heartville Next)
- Source: private repo kevinfudge911/ohana-brain, branch `ohana-wake-word`, commit 95089a4 app code; the wake model file assets/okay_duet.bin was swapped for the new one and the APK re-signed with the same key (GitHub build minutes are out until Dec 1). Signed 1.1 build + test pictures on branch `ohana-wake-word-out-95089a4`.
- Holds no keys or passwords.

New in the Nov 25 evening update:
- Also wakes on "Hey Duet" and "Hey, do it" (before, "Hey, do it" only caught about half the time). Taught to ignore "Hey dude", "Hey, did it" and similar.
- App code is the same as 1.1; only the listening model changed.

New in 1.1:
- Says "I'm here." out loud (or "I'm here. Unlock your phone." when the PIN is needed).
- "Call button" helper (Android accessibility, Claude Duet only) presses Duet's call button right after the wake word. If it can't tell which button that is, it asks you to tap it once and remembers it.
- Lets go of the mic while you talk to Duet and listens again after.
- "Car unlock" steps for Samsung Extend Unlock (stays unlocked while connected to the car, up to 4 hours).

Version 1.0 (sha256 59567e71...b26a8b) is in this branch's history, commit 111eef2. The first 1.1 (sha256 70a2213c...8c69a9) is commit 227c222.

Posted Nov 25 2026 by Do It so it can be installed on the phone from one link.
