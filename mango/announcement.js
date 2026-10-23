/* Existing saved announcement presentation. No send, ack, microphone or recording APIs. */
(() => {
  'use strict';
  const mounted = new WeakMap();
  let pageMuted = false;
  function mount(dialog, announcement, context, {
    synth = window.speechSynthesis,
    Utterance = window.SpeechSynthesisUtterance,
    timeoutMs = 35000
  } = {}) {
    if (mounted.has(dialog)) return mounted.get(dialog);
    const text = String(announcement.text || '');
    const message = dialog.querySelector('.announce-message');
    if (!message || !context.valid() || !text.trim() || text.length > 300) return null;
    // Leave the saved announcement and attachment nodes intact.
    const panel = document.createElement('section');
    panel.className = 'mango-announcement-voice';
    panel.setAttribute('aria-label', 'Mango announcement voice');
    panel.innerHTML = '<h3>Mango has an announcement</h3><p data-mango-context></p><div class="mango-announcement-intro"><span class="mango-announcement-portrait" role="img" aria-label="Mango, the Ohana parrot"><img src="/talk-mango.webp" alt="" aria-hidden="true" width="416" height="133.25"></span><div class="mango-announcement-bubble" data-mango-bubble></div></div><div class="mango-announcement-actions"><button type="button" data-mango-play>Play Mango</button><button type="button" data-mango-stop disabled>Stop</button><button type="button" data-mango-mute aria-pressed="false">Mute Mango</button></div><p data-mango-status role="status" aria-live="polite"></p><label>Local device voice <select data-mango-voices></select></label><p class="mango-announcement-hint">Read Mango’s speech bubble, or press Play Mango to hear it. You can choose OK at any time. Videos keep their own sound controls.</p>';
    panel.querySelector('[data-mango-context]').textContent = announcement.preview ? 'Announcement preview. Nothing is sent or acknowledged.' : 'You can listen or read, then choose OK whenever you are ready.';
    const heading = dialog.querySelector('h2');
    if (heading) heading.textContent = announcement.preview ? 'Announcement preview' : 'Announcement from ' + String(announcement.name || 'Ohana');
    message.before(panel);
    panel.querySelector('[data-mango-bubble]').append(message);
    const play = panel.querySelector('[data-mango-play]');
    const stop = panel.querySelector('[data-mango-stop]');
    const mute = panel.querySelector('[data-mango-mute]');
    const voices = panel.querySelector('[data-mango-voices]');
    const status = panel.querySelector('[data-mango-status]');
    const ok = dialog.querySelector('.announce-ok');
    if (ok) { ok.textContent = announcement.preview ? 'OK · Close preview' : 'OK'; ok.setAttribute('aria-label', announcement.preview ? 'OK, close announcement preview' : 'OK, acknowledge announcement'); }
    const supported = !!(synth && Utterance && typeof synth.getVoices === 'function');
    let local = [], active = null, timer = 0, generation = 0, disposed = false, muted = pageMuted;
    const valid = () => !disposed && dialog.isConnected && dialog.open && context.valid();
    function publish(state, words) {
      panel.dataset.voiceState = state;
      status.textContent = words;
      stop.disabled = !active;
      play.disabled = muted || !supported || !local.length;
      mute.setAttribute('aria-pressed', String(muted));
      mute.textContent = muted ? 'Unmute Mango' : 'Mute Mango';
      panel.classList.toggle('is-speaking', state === 'speaking');
    }
    function idle() {
      publish(muted ? 'muted' : local.length ? 'ready' : 'unavailable', muted ?
        'Mango is muted. You can read the announcement and choose OK.' : local.length ?
        'Press Play Mango to hear this announcement. OK is available now.' :
        'No local English voice is available. Read the announcement and choose OK.');
    }
    function cancel(words) {
      generation++;
      clearTimeout(timer);
      const owned = active;
      active = null;
      // Never cancel another character's speech when this announcement owns no utterance.
      if (owned) try { synth.cancel(); } catch {}
      idle();
      if (words) status.textContent = words;
    }
    function refresh() {
      if (disposed) return;
      const selected = voices.value;
      try { local = supported ? synth.getVoices().filter(v => v.localService === true && /^en(?:-|_|$)/i.test(v.lang)) : []; }
      catch { local = []; }
      voices.replaceChildren();
      for (const voice of local) {
        const option = document.createElement('option');
        option.value = voice.voiceURI;
        option.textContent = voice.name + ' (' + voice.lang + ')';
        voices.append(option);
      }
      if (local.some(v => v.voiceURI === selected)) voices.value = selected;
      else {
        const preferred = local.find(v => /Sonia|Tessa/i.test(v.name)) || local.find(v => v.default) || local[0];
        if (preferred) voices.value = preferred.voiceURI;
      }
      if (!local.length) {
        const option = document.createElement('option');
        option.textContent = 'No local voice available'; option.value = ''; voices.append(option);
      }
      voices.disabled = !local.length;
      if (active && !local.some(v => v.voiceURI === active.voice.voiceURI)) cancel('The local voice changed. Read the announcement, or press Play Mango again.');
      else if (!active) idle();
    }
    function speak(event, arrival = false) {
      const activatedArrival = arrival && !announcement.preview && navigator.userActivation?.hasBeenActive === true;
      if ((!activatedArrival && !event?.isTrusted) || !valid() || document.hidden || muted || !supported) return;
      cancel(); refresh();
      const voice = local.find(v => v.voiceURI === voices.value && v.localService === true);
      if (!voice) return;
      if (synth.speaking || synth.pending) { publish('busy', 'Another voice is speaking. Read this announcement, or try Play Mango later.'); return; }
      // Call speak synchronously inside the trusted Play/Replay click. No fetch/timer first.
      const id = ++generation;
      try {
        const utterance = new Utterance(text);
        utterance.voice = voice; utterance.lang = voice.lang;
        utterance.rate = 1.05; utterance.pitch = 1.22; utterance.volume = .85;
        active = utterance;
        const current = () => valid() && id === generation && active === utterance;
        utterance.onstart = () => { if (current()) publish('speaking', 'Mango is speaking. You may stop, mute or choose OK at any time.'); };
        utterance.onend = () => {
          if (!current()) return;
          active = null; clearTimeout(timer); play.textContent = 'Replay Mango';
          publish('finished', 'Finished. You can replay, read the announcement or choose OK.');
        };
        utterance.onerror = event => {
          if (!current()) return;
          active = null; clearTimeout(timer);
          publish('error', event.error === 'not-allowed' ?
            'The browser blocked the voice. Press Play Mango to retry, or read the announcement and choose OK.' :
            'The local voice could not speak. Read the announcement and choose OK, or try Play Mango again.');
        };
        // A video selected earlier must not compete with the announcement voice.
        for (const video of dialog.querySelectorAll('video')) if (!video.paused) video.pause();
        publish('starting', 'Starting Mango’s local device voice…');
        synth.speak(utterance);
        timer = setTimeout(() => { if (current()) cancel('The voice did not finish. Read the announcement and choose OK, or press Play Mango again.'); }, timeoutMs);
      } catch { cancel('The local voice could not start. Read the announcement and choose OK.'); }
    }
    function click(event) {
      if (!event.isTrusted) return;
      const button = event.target.closest('button');
      if (button === play) speak(event);
      else if (button === stop) cancel('Stopped. You can read the announcement and choose OK.');
      else if (button === mute) { muted = !muted; pageMuted = muted; cancel(); }
    }
    const changeVoice = () => cancel('Voice selected. Press Play Mango when you are ready.');
    const acknowledgeIntent = event => { if (ok && event.target.closest('button') === ok) cancel(); };
    const mediaPlay = event => { if (event.target.tagName === 'VIDEO') cancel('Mango stopped while the video plays. The announcement text stays visible.'); };
    const hidden = () => { if (document.hidden) cancel(); };
    const storage = event => { if (event.key === null || event.key === 'ohana_token') destroy(); };
    function sweep() { if (!valid()) destroy(); }
    function destroy() {
      if (disposed) return;
      cancel(); disposed = true;
      clearInterval(watcher); observer.disconnect();
      panel.removeEventListener('click', click); voices.removeEventListener('change', changeVoice);
      dialog.removeEventListener('play', mediaPlay, true); dialog.removeEventListener('close', destroy);
      dialog.removeEventListener('click', acknowledgeIntent, true);
      synth?.removeEventListener?.('voiceschanged', refresh);
      document.removeEventListener('visibilitychange', hidden); window.removeEventListener('storage', storage);
      window.removeEventListener('pagehide', destroy);
      // Private text and voice content must not survive a closed/account-changed announcement.
      panel.remove(); mounted.delete(dialog);
      if (dialog.isConnected) { if (dialog.open) dialog.close(); else dialog.remove(); }
    }
    panel.addEventListener('click', click); voices.addEventListener('change', changeVoice);
    dialog.addEventListener('play', mediaPlay, true); dialog.addEventListener('close', destroy, { once: true });
    dialog.addEventListener('click', acknowledgeIntent, true);
    synth?.addEventListener?.('voiceschanged', refresh);
    document.addEventListener('visibilitychange', hidden); window.addEventListener('storage', storage);
    window.addEventListener('pagehide', destroy);
    const observer = new MutationObserver(sweep); observer.observe(document.body, { childList: true, subtree: true });
    const watcher = setInterval(sweep, 250);
    const api = { destroy, get state() { return { state: panel.dataset.voiceState, active: !!active, muted, localVoices: local.length }; } };
    mounted.set(dialog, api); refresh();
    // One conservative arrival attempt after prior page interaction; never a timer/voice-change retry.
    if (!announcement.preview && navigator.userActivation?.hasBeenActive === true && !document.hidden) speak(null, true);
    return api;
  }
  window.OhanaMangoAnnouncement = { mount };
})();
