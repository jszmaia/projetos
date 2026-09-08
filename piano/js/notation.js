/*
 * notation.js — le musica escrita em texto simples.
 *
 * POR QUE ISTO EXISTE
 * O app sabe tocar, desenhar pauta e animar teclado, mas so para o que ele
 * mesmo gera. Para estudar uma musica de verdade falta a porta de entrada:
 * um jeito de a pessoa DIGITAR a peca a partir da cifra ou da partitura que
 * ela tem, sem editor de partitura e sem MusicXML.
 *
 * FORMATO
 *   E4 F#4 G4 A4          quatro notas, um tempo cada
 *   E4:2                  dois tempos
 *   G4:.5                 meio tempo
 *   r  ou  -              pausa (aceita r:2)
 *   [E4 G4 B4]            acorde: tudo junto, mesma duracao
 *   [E3 B3]:2             acorde de dois tempos
 *   |                     barra de compasso (so organiza a leitura)
 *   // comentario         ignorado ate o fim da linha
 *
 *   RH: ...               daqui em diante e mao direita (padrao)
 *   LH: ...               daqui em diante e mao esquerda
 *
 * As duas maos correm em paralelo: cada uma tem seu proprio relogio, entao
 * a esquerda pode ter figuras longas enquanto a direita corre. E por isso
 * que o tempo e contado por mao, e nao um so para o texto inteiro.
 */
(function (global) {
  "use strict";

  var T = global.PT && global.PT.theory;

  /* Nome grafado -> MIDI. A oitava pertence a LETRA, entao Si#3 e 60 e nao
   * 48 — a mesma regra de theory.nameToMidi e staff.js. */
  var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  function noteToMidi(txt) {
    var m = String(txt).trim().match(/^([A-Ga-g])([#b♯♭xX]*)(-?\d+)$/);
    if (!m) return null;
    var letra = m[1].toUpperCase();
    var acc = 0;
    for (var i = 0; i < m[2].length; i++) {
      var c = m[2][i];
      if (c === "#" || c === "♯") acc += 1;
      else if (c === "b" || c === "♭") acc -= 1;
      else if (c === "x" || c === "X") acc += 2;
    }
    var midi = (parseInt(m[3], 10) + 1) * 12 + LETTER_PC[letra] + acc;
    return midi >= 0 && midi <= 127 ? midi : null;
  }

  /* Separa "coisa:duracao" respeitando os colchetes do acorde. */
  function splitDur(tok) {
    var i = tok.lastIndexOf(":");
    if (i < 0 || i < tok.lastIndexOf("]")) return { corpo: tok, dur: null };
    var d = parseFloat(tok.slice(i + 1));
    return { corpo: tok.slice(0, i), dur: isNaN(d) || d <= 0 ? null : d };
  }

  /**
   * Le o texto e devolve { notes, beats, erros[] }.
   * `notes` sai no formato que audio.playTimeline ja consome:
   * { midi, start, dur, hand }.
   */
  function parse(texto, opts) {
    opts = opts || {};
    var padraoDur = opts.defaultDur || 1;
    var notes = [];
    var erros = [];
    var relogio = { right: 0, left: 0 };
    var mao = "right";

    String(texto || "").split(/\r?\n/).forEach(function (linhaCrua, nLinha) {
      var linha = linhaCrua.replace(/\/\/.*$/, "").trim();
      if (!linha) return;

      var mMao = linha.match(/^(RH|LH|MD|ME)\s*:\s*(.*)$/i);
      if (mMao) {
        mao = /^(LH|ME)$/i.test(mMao[1]) ? "left" : "right";
        linha = mMao[2].trim();
        if (!linha) return;
      }

      /* Tokeniza mantendo [ ... ] inteiro. */
      var tokens = linha.match(/\[[^\]]*\](?::[0-9.]+)?|[^\s]+/g) || [];

      tokens.forEach(function (tok) {
        if (tok === "|") return;

        var parte = splitDur(tok);
        var dur = parte.dur === null ? padraoDur : parte.dur;
        var corpo = parte.corpo;

        if (corpo === "r" || corpo === "R" || corpo === "-") {
          relogio[mao] += dur;
          return;
        }

        if (corpo[0] === "[") {
          var dentro = corpo.slice(1, corpo.indexOf("]"));
          var membros = dentro.split(/\s+/).filter(Boolean);
          var algum = false;
          membros.forEach(function (nm) {
            var midi = noteToMidi(nm);
            if (midi === null) {
              erros.push("linha " + (nLinha + 1) + ": nota desconhecida no acorde: " + nm);
              return;
            }
            notes.push({ midi: midi, start: relogio[mao], dur: dur, hand: mao });
            algum = true;
          });
          if (algum) relogio[mao] += dur;
          return;
        }

        var m1 = noteToMidi(corpo);
        if (m1 === null) {
          erros.push("linha " + (nLinha + 1) + ": nao entendi \"" + tok + "\"");
          return;
        }
        notes.push({ midi: m1, start: relogio[mao], dur: dur, hand: mao });
        relogio[mao] += dur;
      });
    });

    notes.sort(function (a, b) { return a.start - b.start || a.midi - b.midi; });
    var beats = notes.reduce(function (m, n) { return Math.max(m, n.start + n.dur); }, 0);
    return { notes: notes, beats: beats, erros: erros };
  }

  /* Volta de notas para texto — util para editar uma peca ja salva. */
  function toText(notes) {
    var porMao = { right: [], left: [] };
    (notes || []).forEach(function (n) { (porMao[n.hand || "right"]).push(n); });
    var saida = [];
    ["right", "left"].forEach(function (mao) {
      var lista = porMao[mao];
      if (!lista.length) return;
      lista.sort(function (a, b) { return a.start - b.start; });
      var pedacos = lista.map(function (n) {
        var nome = T ? T.midiToName(n.midi) : String(n.midi);
        return nome + (n.dur === 1 ? "" : ":" + n.dur);
      });
      saida.push((mao === "left" ? "LH: " : "RH: ") + pedacos.join(" "));
    });
    return saida.join("\n");
  }

  global.PT = global.PT || {};
  global.PT.notation = { parse: parse, toText: toText, noteToMidi: noteToMidi };
})(typeof window !== "undefined" ? window : globalThis);
