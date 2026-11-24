# Heartville Next update spot

Heartville Next (app.ohanahome.heartville.next) reads `update.json` on this branch every time it opens.
When `versionCode` here is higher than the one on the phone, the app shows a small gold "Update" button;
one tap downloads the APK named here, checks its sha256, and installs it.

To ship a new version:
1. Build it from the newest Heartville Next branch in kevinfudge911/ohana-brain with a higher versionCode,
   signed with the Ohana phone key (cert SHA-256 35e82285...c334). Android refuses any other signer.
2. Add the APK here as `heartville-next-vN.apk`.
3. Update `update.json`: versionCode, versionName, apk address, sha256 of the APK.
Never point `apk` anywhere but this branch.
