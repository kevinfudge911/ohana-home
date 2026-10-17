# Licensed first batch — unpublished

Seven public-domain hymn recordings from St. Peter Lutheran Church's Hymns For Life. Source explicitly releases both hymns and recordings: https://www.fulllifeinchrist.org/hymns . Checked 2026-10-16. Preserve the unmodified originals and their source credits. Two also appear in Family & Kids. All seven appear in Sunday Best and Traditional Hymns through the existing playlist selector; Radio and the original 907 records are unchanged.

Build: `node build.cjs CURRENT_APP CURRENT_WORKER`. Guarded append to serialized `jb-tracks` only, plus existing backend built-in-ID allowlist. No user submission URL validator, ownership/ACL, audio, queue, filters, or UI styles change.

**Not release-ready until ordinary browser audio loads are verified.** Web fetch reports audio/mpeg, shell fetch is blocked, direct Chrome MP3 navigation is blocked by client. These are not full playback evidence. `availability.json` records failed shell checks honestly.

Next modern-worship candidates: Open Skies Praise's I Will Rejoice, Know You More, The Word Of God (kids VBS); recording-specific CC BY-NC 4.0, requiring attribution and noncommercial use. Kept out of this PD-first patch pending applicability and media checks. These are contemporary-style 2017 songs, not current chart hits. Country Christian recordings still need verified recording permission.

Comedy candidates: official https://tomlehrersongs.com/ releases composition AND recording rights. Only consider educational The Elements/New Math after full selected recording/spoken-intro suitability review; do not import his whole catalog or call it all clean. No Comedy tracks included yet.

Build syntax checks passed; output app6090780 bytes using current final-current-release baseline, total914. Generated output remains PRIVATE and is not a substitute for applying guarded builder to root newest combined app. New Kids collection contains two devotional children’s songs, not yet a broad fun nursery catalog. Country/new-chart worship and clean comedy remain incomplete.
