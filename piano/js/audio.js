/*
 * audio.js — sintetizador simples via Web Audio API.
 *
 * O timbre e construido somando parciais da serie harmonica (1, 2, 3, 4, 5, 6)
 * com amplitudes 1/n^1.4, que e uma aproximacao grosseira do espectro de uma
 * corda percutida. Isso amarra o som ao mesmo conteudo teorico do app.
 */
(function (global) {
  "use strict";

  var T = global.PT.theory;
  var ctx = null;
  var master = null;
  var enabled = true;
  var a4 = 440;

  var PARTIALS = [1, 2, 3, 4, 5, 6];
  var PARTIAL_GAIN = PARTIALS.map(function (n) { return 1 / Math.pow(n, 1.4); });
  var PARTIAL_SUM = PARTIAL_GAIN.reduce(function (a, b) { return a + b; }, 0);

  function ensure() {
    if (!ctx) {
      var Ctor = global.AudioContext || global.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.28;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /** Toca uma nota MIDI. dur em segundos. */
  function play(midi, dur, when, velocity) {
    if (!enabled) return;
    var c = ensure();
    if (!c) return;
    dur = dur || 0.9;
    velocity = velocity === undefined ? 1 : velocity;
    var t0 = c.currentTime + (when || 0);
    var freq = T.midiToFreq(midi, a4);

    var env = c.createGain();
    env.connect(master);

    // Envelope percussivo: ataque curto, decaimento exponencial.
    var peak = 0.9 * velocity;
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
    env.gain.exponentialRampToValueAtTime(peak * 0.35, t0 + 0.16);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    PARTIALS.forEach(function (n, i) {
      var osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * n, t0);
      var g = c.createGain();
      // Parciais agudos decaem mais rapido, como numa corda real.
      g.gain.setValueAtTime((PARTIAL_GAIN[i] / PARTIAL_SUM) * 0.9, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * (1 - i * 0.1));
      osc.connect(g);
      g.connect(env);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    });
  }

  /** Toca uma frequencia arbitraria — usado nas demonstracoes de afinacao. */
  function playFreq(freq, dur, when) {
    if (!enabled) return;
    var c = ensure();
    if (!c) return;
    dur = dur || 1.2;
    var t0 = c.currentTime + (when || 0);
    var osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t0);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
    g.gain.setValueAtTime(0.35, t0 + dur - 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** Toca varias notas juntas. */
  function playChord(midis, dur, spread) {
    midis.forEach(function (m, i) {
      play(m, dur || 1.6, (spread || 0) * i, 0.9);
    });
  }

  var seqTimers = [];

  /** Toca uma sequencia de MIDIs. gap em segundos entre ataques. */
  function playSequence(midis, gap, onNote, done) {
    stopSequence();
    gap = gap || 0.32;
    midis.forEach(function (m, i) {
      play(m, gap * 1.7, gap * i);
      if (onNote) {
        seqTimers.push(setTimeout(function () { onNote(m, i); }, gap * i * 1000));
      }
    });
    if (done) seqTimers.push(setTimeout(done, gap * midis.length * 1000));
  }

  function stopSequence() {
    seqTimers.forEach(clearTimeout);
    seqTimers = [];
  }

  /**
   * Converte uma escala construida em MIDIs subindo a partir de uma oitava,
   * fechando com a oitava da tonica.
   */
  function scaleToMidi(built, startMidi, descending) {
    startMidi = startMidi === undefined ? 60 : startMidi;
    var root = startMidi + T.mod(built.tonic.pc - T.mod(startMidi, 12), 12);
    var up = built.intervals.map(function (iv) { return root + iv; });
    up.push(root + 12);
    if (!descending) return up;
    var down = up.slice(0, -1).reverse();
    return up.concat(down);
  }

  function setVolume(v) {
    ensure();
    if (master) master.gain.value = v;
  }

  function setEnabled(v) { enabled = !!v; }
  function isEnabled() { return enabled; }
  function setA4(v) { a4 = v; }
  function getA4() { return a4; }

  /* --- Metronomo -------------------------------------------------------- */
  var metro = { timer: null, bpm: 90, beats: 4, count: 0, onBeat: null };

  function startMetronome(bpm, beats, onBeat) {
    stopMetronome();
    metro.bpm = bpm || 90;
    metro.beats = beats || 4;
    metro.count = 0;
    metro.onBeat = onBeat;
    var interval = 60000 / metro.bpm;
    tick();
    metro.timer = setInterval(tick, interval);
  }

  function tick() {
    var c = ensure();
    if (!c) return;
    var strong = metro.count % metro.beats === 0;
    var t0 = c.currentTime;
    var osc = c.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(strong ? 1600 : 1000, t0);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(strong ? 0.3 : 0.16, t0 + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.08);
    if (metro.onBeat) metro.onBeat(metro.count % metro.beats, strong);
    metro.count++;
  }

  function stopMetronome() {
    if (metro.timer) clearInterval(metro.timer);
    metro.timer = null;
  }

  function metronomeRunning() { return !!metro.timer; }

  global.PT = global.PT || {};
  global.PT.audio = {
    play: play, playFreq: playFreq, playChord: playChord,
    playSequence: playSequence, stopSequence: stopSequence,
    scaleToMidi: scaleToMidi,
    setVolume: setVolume, setEnabled: setEnabled, isEnabled: isEnabled,
    setA4: setA4, getA4: getA4,
    startMetronome: startMetronome, stopMetronome: stopMetronome,
    metronomeRunning: metronomeRunning,
    ensure: ensure
  };
})(typeof window !== "undefined" ? window : globalThis);
