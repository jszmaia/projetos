/*
 * exercises.js — exercicios de tecnica gerados por regra, nao digitados.
 *
 * Um exercicio de tecnica quase nunca e um corpus de notas: e um padrao curto
 * transposto por uma regra. Guardar a regra em vez das notas significa zero
 * erro de digitacao, e permite gerar o mesmo exercicio em qualquer tonalidade —
 * coisa que o livro impresso nao faz.
 *
 * PROVENIENCIA — importa para nao apresentar invencao como fonte historica:
 *   source: "hanon"    padrao conferido nota a nota contra o texto impresso
 *   source: "derivado" construido a partir de js/theory.js; correto por
 *                      construcao, mas nao e transcricao de nenhuma edicao
 */
(function (global) {
  "use strict";

  var T = global.PT.theory;

  /* ------------------------------------------------------------------ *
   * Graus diatonicos -> MIDI
   *
   * O grau e um inteiro sem limite: 0 = tonica, 7 = tonica uma oitava acima,
   * -1 = grau imediatamente abaixo. E o que permite transpor "um grau da
   * escala" sem se preocupar com onde caem os semitons.
   * ------------------------------------------------------------------ */

  function degreeToMidi(degree, rootMidi, intervals) {
    var n = intervals.length;
    var oct = Math.floor(degree / n);
    var idx = ((degree % n) + n) % n;
    return rootMidi + intervals[idx] + 12 * oct;
  }

  /** Alinha a tonica pedida na oitava de `startMidi` (ou acima dela). */
  function rootAt(tonicPc, startMidi) {
    return startMidi + T.mod(tonicPc - T.mod(startMidi, 12), 12);
  }

  /* ------------------------------------------------------------------ *
   * Catalogo
   * ------------------------------------------------------------------ */

  var EXERCISES = [
    {
      id: "hanon-1",
      title: "Hanon nº 1",
      source: "hanon",
      kind: "figure",
      /*
       * Verificado contra o texto impresso: a figura ascendente e
       * Do Mi Fa Sol La Sol Fa Mi, que em graus da escala e exatamente isto.
       * Cada repeticao sobe um grau; a descida usa a figura espelhada.
       */
      pattern: [0, 2, 3, 4, 5, 4, 3, 2],
      mirror: [0, -2, -3, -4, -5, -4, -3, -2],
      figures: 14,
      handsApart: 12,           // mao esquerda uma oitava abaixo (paralelo)
      bpm: 72,
      noteDur: 0.5,
      fingering: [1, 2, 3, 4, 5, 4, 3, 2],
      why: "Independencia e igualdade dos dedos 3, 4 e 5. A figura evita o polegar " +
           "no meio, entao o peso fica nos dedos fracos — que e todo o ponto.",
      focus: "Som parelho. Se uma nota sai mais forte, esta rapido demais."
    },

    {
      id: "escala-2-oitavas",
      title: "Escala em duas oitavas",
      source: "derivado",
      kind: "scale",
      octaves: 2,
      bpm: 80,
      noteDur: 0.5,
      handsApart: 12,
      why: "O exercicio base de todo metodo. Trabalha a passagem do polegar, " +
           "que e o unico movimento verdadeiramente dificil da escala.",
      focus: "Nenhum acento na nota do polegar. Se voce ouve um 'bump' a cada " +
             "3 ou 4 notas, a passagem esta tardia."
    },

    {
      id: "arpejo-triade",
      title: "Arpejo da triade",
      source: "derivado",
      kind: "arpeggio",
      octaves: 2,
      bpm: 76,
      noteDur: 0.5,
      handsApart: 12,
      why: "Abre a mao e ensina a distancia da terca e da quinta sem olhar. " +
           "E a base de todo acompanhamento.",
      focus: "Pulso solto. O braco acompanha lateralmente, os dedos nao esticam."
    },

    {
      id: "tercas-diatonicas",
      title: "Tercas diatonicas",
      source: "derivado",
      kind: "interval",
      step: 2,
      span: 8,
      bpm: 66,
      noteDur: 1,
      handsApart: 12,
      why: "Duas vozes simultaneas na mesma mao. Revela imediatamente qual dedo " +
           "esta atrasado, porque o atraso vira um intervalo quebrado.",
      focus: "As duas notas devem soar exatamente juntas."
    },

    {
      id: "movimento-contrario",
      title: "Movimento contrario",
      source: "derivado",
      kind: "contrary",
      span: 15,
      bpm: 72,
      noteDur: 0.5,
      why: "As maos espelhadas usam os mesmos dedos ao mesmo tempo, o que torna " +
           "a coordenacao mais facil que o movimento paralelo — bom ponto de partida.",
      focus: "Comece pelo centro do teclado e deixe os bracos abrirem."
    },

    {
      id: "cadencia-i-iv-v-i",
      title: "Cadencia I – IV – I – V – I",
      source: "derivado",
      kind: "cadence",
      bpm: 60,
      noteDur: 2,
      why: "Fixa o campo harmonico na mao. Tocada em todas as tonalidades, " +
           "ensina o teclado melhor que qualquer tabela.",
      focus: "Conducao minima: mova so o que precisa mudar."
    }
  ];

  var BY_ID = {};
  EXERCISES.forEach(function (e) { BY_ID[e.id] = e; });

  /* ------------------------------------------------------------------ *
   * Geradores por tipo
   * ------------------------------------------------------------------ */

  function pushNote(out, midi, start, dur, hand, finger) {
    out.push({ midi: midi, start: start, dur: dur, hand: hand, finger: finger });
  }

  /** Figura transposta grau a grau (Hanon). */
  function genFigure(ex, ctx) {
    var out = [];
    var t = 0;
    var iv = ctx.intervals;

    function figure(pattern, startDegree) {
      pattern.forEach(function (d, i) {
        var deg = startDegree + d;
        pushNote(out, degreeToMidi(deg, ctx.root, iv), t, ex.noteDur, "right",
          ex.fingering && ex.fingering[i]);
        if (ex.handsApart) {
          pushNote(out, degreeToMidi(deg, ctx.root - ex.handsApart, iv), t,
            ex.noteDur, "left", ex.fingering && ex.fingering[i]);
        }
        t += ex.noteDur;
      });
    }

    for (var a = 0; a < ex.figures; a++) figure(ex.pattern, a);
    var top = ex.figures - 1;
    for (var d2 = 0; d2 < ex.figures; d2++) figure(ex.mirror, top - d2 + 5);
    return out;
  }

  function genScale(ex, ctx) {
    var out = [];
    var t = 0;
    var n = ctx.intervals.length;
    var last = n * ex.octaves;
    var degs = [];
    for (var i = 0; i <= last; i++) degs.push(i);
    for (var j = last - 1; j >= 0; j--) degs.push(j);
    degs.forEach(function (deg) {
      pushNote(out, degreeToMidi(deg, ctx.root, ctx.intervals), t, ex.noteDur, "right");
      if (ex.handsApart) {
        pushNote(out, degreeToMidi(deg, ctx.root - ex.handsApart, ctx.intervals),
          t, ex.noteDur, "left");
      }
      t += ex.noteDur;
    });
    return out;
  }

  function genArpeggio(ex, ctx) {
    var out = [];
    var t = 0;
    /* Graus da triade dentro da escala: 1, 3 e 5 = indices 0, 2 e 4. */
    var shape = [0, 2, 4];
    var degs = [];
    for (var o = 0; o < ex.octaves; o++) {
      shape.forEach(function (s) { degs.push(s + o * ctx.intervals.length); });
    }
    degs.push(ctx.intervals.length * ex.octaves);
    var down = degs.slice(0, -1).reverse();
    degs.concat(down).forEach(function (deg) {
      pushNote(out, degreeToMidi(deg, ctx.root, ctx.intervals), t, ex.noteDur, "right");
      if (ex.handsApart) {
        pushNote(out, degreeToMidi(deg, ctx.root - ex.handsApart, ctx.intervals),
          t, ex.noteDur, "left");
      }
      t += ex.noteDur;
    });
    return out;
  }

  /** Duas vozes paralelas separadas por N graus (tercas = 2 graus). */
  function genInterval(ex, ctx) {
    var out = [];
    var t = 0;
    var degs = [];
    for (var i = 0; i <= ex.span; i++) degs.push(i);
    for (var j = ex.span - 1; j >= 0; j--) degs.push(j);
    degs.forEach(function (deg) {
      pushNote(out, degreeToMidi(deg, ctx.root, ctx.intervals), t, ex.noteDur, "right");
      pushNote(out, degreeToMidi(deg + ex.step, ctx.root, ctx.intervals), t,
        ex.noteDur, "right");
      if (ex.handsApart) {
        pushNote(out, degreeToMidi(deg, ctx.root - ex.handsApart, ctx.intervals),
          t, ex.noteDur, "left");
      }
      t += ex.noteDur;
    });
    return out;
  }

  /** Maos em espelho a partir da mesma nota. */
  function genContrary(ex, ctx) {
    var out = [];
    var t = 0;
    var degs = [];
    for (var i = 0; i <= ex.span; i++) degs.push(i);
    for (var j = ex.span - 1; j >= 0; j--) degs.push(j);
    degs.forEach(function (deg) {
      pushNote(out, degreeToMidi(deg, ctx.root, ctx.intervals), t, ex.noteDur, "right");
      pushNote(out, degreeToMidi(-deg, ctx.root, ctx.intervals), t, ex.noteDur, "left");
      t += ex.noteDur;
    });
    return out;
  }

  /** I – IV – I – V – I com as triades do proprio campo harmonico. */
  function genCadence(ex, ctx) {
    var out = [];
    var t = 0;
    var field = T.harmonize(ctx.built, 3);
    if (!field.length) return out;
    [0, 3, 0, 4, 0].forEach(function (degIdx) {
      var ch = field[degIdx];
      var rootMidi = rootAt(ch.pcs[0], ctx.root);
      ch.pcs.forEach(function (pc, i) {
        var m = rootMidi + T.mod(pc - ch.pcs[0], 12);
        pushNote(out, m, t, ex.noteDur, "right");
      });
      pushNote(out, rootAt(ch.pcs[0], ctx.root - 24), t, ex.noteDur, "left");
      t += ex.noteDur;
    });
    return out;
  }

  var GENERATORS = {
    figure: genFigure, scale: genScale, arpeggio: genArpeggio,
    interval: genInterval, contrary: genContrary, cadence: genCadence
  };

  /* ------------------------------------------------------------------ *
   * API
   * ------------------------------------------------------------------ */

  function get(id) { return BY_ID[id] || null; }

  /**
   * Gera o exercicio em uma tonalidade.
   * @returns {{id,title,bpm,notes:[{midi,start,dur,hand,finger}]}}
   */
  function generate(id, opts) {
    opts = opts || {};
    var ex = typeof id === "string" ? get(id) : id;
    if (!ex) return null;

    var tonic = opts.tonic || "C";
    var scaleId = opts.scale || "jonio";
    var built = T.buildScale(tonic, scaleId);
    if (!built) return null;

    var startMidi = opts.startMidi === undefined ? 60 : opts.startMidi;
    var ctx = {
      built: built,
      intervals: built.intervals,
      root: rootAt(built.tonic.pc, startMidi)
    };

    var gen = GENERATORS[ex.kind];
    if (!gen) return null;
    var notes = gen(ex, ctx).filter(function (n) {
      return n.midi >= 21 && n.midi <= 108;   // faixa fisica de um piano de 88 teclas
    });

    return {
      id: ex.id,
      title: ex.title + " — " + T.noteName(built.tonic) + " " + built.scale.name,
      exercise: ex,
      tonic: built.tonic,
      scale: built.scale,
      bpm: opts.bpm || ex.bpm,
      notes: notes,
      beats: notes.reduce(function (m, n) { return Math.max(m, n.start + n.dur); }, 0)
    };
  }

  global.PT = global.PT || {};
  global.PT.exercises = {
    EXERCISES: EXERCISES,
    get: get,
    generate: generate,
    degreeToMidi: degreeToMidi,
    rootAt: rootAt
  };
})(typeof window !== "undefined" ? window : globalThis);
