# Voice variety repair

The previous 8,000-combination generator used 20 endings and a stride of 7,919 modulo 8,000. Its high-order ending index often stayed unchanged across successive calls. Separate per-event counters also repeated endings across games.

The new device-wide v2 sequence cycles all 99 endings before reusing one, with 39,600 unique positive scoring combinations and 1,980 greeting combinations. Counts persist in localStorage and continue in memory if storage is unavailable. All event types share the sequence. The repeated “We make a pretty good team” phrase is explicitly excluded. These counts describe combinations, not individually authored stories; lines eventually repeat after their cycle and separate devices maintain separate histories.

Verification: tests/dialogue-variety.cjs exhausts all 39,600 scoring combinations, checks mixed-event ending variety, reload continuity, storage failure fallback and the retired line. tests/dialogue-mute.cjs verifies spoken scores, animation, pronunciation and mute behavior. No authentication, boards, scores or stored game state changed.
