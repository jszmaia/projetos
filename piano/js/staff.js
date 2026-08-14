/*
 * staff.js — pauta tradicional em SVG.
 *
 * Espelha js/keyboard.js: monta SVG com createElementNS, devolve o no com
 * metodos anexados (.flash, .noteNodes), sem dependencia externa.
 *
 * PRINCIPIO CENTRAL: a posicao vertical sai da GRAFIA, nunca do MIDI.
 *
 * Fa♯ e Sol♭ sao a mesma tecla (mesmo MIDI) e ocupam linhas DIFERENTES da
 * pauta. Uma pauta que posicionasse por MIDI colocaria as duas no mesmo
 * lugar e estaria errada. Por isso a altura vertical vem de (letra, oitava)
 * — o indice diatonico — e a alteracao vira so um simbolo a esquerda.
 *
 * Isso tambem e o motivo de a oitava pertencer a LETRA: Si♯3 soa como Do4
 * mas se escreve na linha do Si da oitava 3.
 *
 * Sem fonte musical externa (SMuFL/Bravura): cabecas sao elipses, hastes e
 * barras sao retas, pontos sao circulos. As duas claves sao os unicos
 * desenhos do projeto — path SVG autoral, declarado como tal.
 */
(function (global) {
  "use strict";

  var T = global.PT && global.PT.theory;
  var NS = "http://www.w3.org/2000/svg";

  var LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

  /* Geometria base. Tudo em unidades de viewBox; o CSS escala. */
  var DEFAULTS = {
    space: 10,          // distancia entre duas linhas da pauta
    clef: "sol",        // "sol" | "fa"
    key: null,          // tonica para desenhar a armadura (ex.: "D")
    noteSpacing: 34,    // avanco horizontal por nota
    leftPad: 10,
    rightPad: 16,
    showNames: false,
    ariaLabel: null
  };

  /*
   * Linha de referencia de cada clave: qual nota diatonica cai na PRIMEIRA
   * linha (a de baixo) da pauta.
   *   clave de sol: Mi4 na linha de baixo
   *   clave de fa:  Sol2 na linha de baixo
   * Nao e tabela arbitraria — e a definicao de cada clave.
   */
  var CLEFS = {
    sol: { bottomLetter: "E", bottomOct: 4, glyphY: 0, name: "clave de sol" },
    fa: { bottomLetter: "F", bottomOct: 2, glyphY: 0, name: "clave de fa" }
  };

  /* Indice diatonico absoluto: conta letras, ignorando alteracoes.
   * C4 -> 4*7+0 = 28, D4 -> 29, B3 -> 3*7+6 = 27.
   * A alteracao NAO entra: e ela que faz Fa♯ e Sol♭ diferirem na pauta. */
  function diatonicIndex(letter, oct) {
    var li = LETTERS.indexOf(String(letter).toUpperCase());
    if (li < 0) return null;
    return oct * 7 + li;
  }

  /* "C#4" / "Bb3" / "B##3" -> {letter, acc, oct, midi}
   * Aceita tambem {letter, acc} + oitava separada. */
  function parseStaffNote(input, defaultOct) {
    if (input === null || input === undefined) return null;

    if (typeof input === "object" && input.letter) {
      var oc = input.oct !== undefined ? input.oct : defaultOct;
      if (oc === undefined) return null;
      return finish(input.letter, input.acc || 0, oc);
    }

    var s = String(input).trim();
    var m = s.match(/^([A-Ga-g])([#b♯♭xX]*)(-?\d+)?$/);
    if (!m) return null;

    var letter = m[1].toUpperCase();
    var acc = 0;
    for (var i = 0; i < m[2].length; i++) {
      var ch = m[2][i];
      if (ch === "#" || ch === "♯") acc += 1;
      else if (ch === "b" || ch === "♭") acc -= 1;
      else if (ch === "x" || ch === "X") acc += 2;
    }
    var oct = m[3] !== undefined ? parseInt(m[3], 10) : defaultOct;
    if (oct === undefined || oct === null || isNaN(oct)) return null;
    return finish(letter, acc, oct);
  }

  function finish(letter, acc, oct) {
    letter = String(letter).toUpperCase();
    var pcBase = T ? T.LETTER_PC[letter] : { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[letter];
    if (pcBase === undefined) return null;
    return {
      letter: letter,
      acc: acc,
      oct: oct,
      // A altura sai da letra + alteracao, sem reduzir modulo 12 — mesma
      // razao de nameToMidi: a oitava escrita pertence a letra.
      midi: (oct + 1) * 12 + pcBase + acc,
      dia: diatonicIndex(letter, oct)
    };
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  /*
   * Claves: os unicos desenhos a mao do projeto.
   * Paths autorais, simplificados, desenhados para caber em 4 espacos de
   * pauta. Nao sao tipograficamente exatos — sao legiveis e reconheciveis.
   */
  /*
   * Claves.
   *
   * A clave de sol e uma espiral, entao ela e GERADA como espiral —
   * logaritmica, r = a·e^(b·t) — e nao chutada em curvas de Bezier. O olho
   * reconhece a proporcao de uma espiral real; um desenho a mao livre erra
   * justamente nisso. A curva inteira sai de tres trechos ligados:
   *
   *   1. a espiral que enrola em torno da 2a linha (Sol4) — dai o nome
   *   2. a haste que sobe e desce cruzando a pauta
   *   3. o gancho inferior
   *
   * A clave de fa e simples o bastante para sair em duas curvas mais os
   * dois pontos que cercam a 4a linha (Fa3), que e o que a define.
   */
  function spiralPoints(cx, cy, rStart, rEnd, tStart, tEnd, steps) {
    // r = rStart * (rEnd/rStart)^((t-tStart)/(tEnd-tStart))  => log-espiral
    var pts = [];
    var k = Math.log(rEnd / rStart) / (tEnd - tStart);
    for (var s = 0; s <= steps; s++) {
      var t = tStart + (tEnd - tStart) * (s / steps);
      var r = rStart * Math.exp(k * (t - tStart));
      pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    return pts;
  }

  function polyPath(pts) {
    return pts.map(function (p, i) {
      return (i ? "L " : "M ") + p[0].toFixed(2) + " " + p[1].toFixed(2);
    }).join(" ");
  }

  function clefPath(kind, x, yBottomLine, space) {
    var g = svgEl("g", { class: "st-clef st-clef--" + kind });

    if (kind === "sol") {
      /* O centro da espiral E a 2a linha de baixo (Sol4). Essa e a
       * definicao da clave: ela aponta onde fica o Sol. */
      var yG = yBottomLine - space;
      var cx = x + space * 0.95;

      /* Espiral de fora para dentro, ~2,2 voltas. */
      var esp = spiralPoints(cx, yG, space * 1.05, space * 0.12,
                             Math.PI * 0.5, Math.PI * 0.5 + Math.PI * 4.4, 90);
      g.appendChild(svgEl("path", { d: polyPath(esp), class: "st-clef-shape" }));

      /* Haste: do ponto externo da espiral sobe cruzando a pauta e volta,
       * fechando no gancho embaixo. */
      var topo = yBottomLine - space * 4.6;
      var base = yBottomLine + space * 1.5;
      var p0 = esp[0];
      var haste =
        "M " + p0[0].toFixed(2) + " " + p0[1].toFixed(2) +
        " C " + (cx - space * 1.5) + " " + (yG - space * 1.2) +
        " "   + (cx - space * 0.9) + " " + topo +
        " "   + (cx + space * 0.30) + " " + topo +
        " C "  + (cx + space * 1.55) + " " + topo +
        " "   + (cx + space * 1.35) + " " + (yG + space * 0.6) +
        " "   + (cx + space * 0.10) + " " + (yG + space * 1.9) +
        " C "  + (cx - space * 1.0) + " " + (yG + space * 3.0) +
        " "   + (cx - space * 1.1) + " " + base +
        " "   + (cx - space * 0.1) + " " + base;
      g.appendChild(svgEl("path", { d: haste, class: "st-clef-shape st-clef-stroke" }));

      /* Gancho final. */
      g.appendChild(svgEl("path", {
        d: "M " + (cx - space * 0.1) + " " + base +
           " c " + (space * 0.75) + " 0 " + (space * 0.95) + " " + (-space * 0.75) +
           " " + (space * 0.1) + " " + (-space * 1.05),
        class: "st-clef-shape st-clef-stroke"
      }));
    } else {
      /* Clave de fa: a cabeca e o arco que desce, e os dois pontos cercam
       * a 4a linha de baixo (Fa3) — e isso que a clave declara. */
      var yF = yBottomLine - 3 * space;
      var bx = x + space * 0.5;

      g.appendChild(svgEl("circle", {
        cx: bx + space * 0.35, cy: yF, r: space * 0.42, class: "st-clef-fill"
      }));
      g.appendChild(svgEl("path", {
        d: "M " + (bx + space * 0.7) + " " + (yF - space * 0.35) +
           " C " + (bx + space * 2.2) + " " + (yF - space * 0.5) +
           " "   + (bx + space * 2.3) + " " + (yF + space * 1.6) +
           " "   + (bx + space * 0.2) + " " + (yF + space * 2.6),
        class: "st-clef-shape st-clef-stroke"
      }));
      g.appendChild(svgEl("circle", { cx: bx + space * 2.75, cy: yF - space * 0.5, r: space * 0.16, class: "st-clef-fill" }));
      g.appendChild(svgEl("circle", { cx: bx + space * 2.75, cy: yF + space * 0.5, r: space * 0.16, class: "st-clef-fill" }));
    }
    return g;
  }

  /* Simbolo de alteracao. Tambem geometria: nada de fonte. */
  function accidentalGlyph(acc, x, y, space) {
    if (!acc) return null;
    var g = svgEl("g", { class: "st-acc" });
    var u = space / 10;

    function line(x1, y1, x2, y2, w) {
      return svgEl("line", {
        x1: x1, y1: y1, x2: x2, y2: y2,
        class: "st-acc-stroke", "stroke-width": w || 1.2 * u
      });
    }

    if (acc > 0) {
      // Sustenido: duas verticais e duas horizontais levemente inclinadas.
      for (var s = 0; s < acc; s++) {
        var ox = x + s * 7 * u;
        g.appendChild(line(ox + 2 * u, y - 6 * u, ox + 2 * u, y + 7 * u));
        g.appendChild(line(ox + 6 * u, y - 7 * u, ox + 6 * u, y + 6 * u));
        g.appendChild(line(ox, y - 1.5 * u, ox + 8 * u, y - 3 * u, 1.6 * u));
        g.appendChild(line(ox, y + 3 * u, ox + 8 * u, y + 1.5 * u, 1.6 * u));
      }
    } else {
      // Bemol: haste vertical e uma barriga a direita.
      for (var f = 0; f < -acc; f++) {
        var fx = x + f * 6 * u;
        g.appendChild(line(fx + 1.5 * u, y - 10 * u, fx + 1.5 * u, y + 4 * u));
        g.appendChild(svgEl("path", {
          d: "M " + (fx + 1.5 * u) + " " + (y + 4 * u) +
             " c " + (5 * u) + " " + (-4 * u) + " " + (7 * u) + " " + (-9 * u) + " " + (1 * u) + " " + (-9 * u) +
             " c " + (-2 * u) + " 0 " + (-3 * u) + " " + (1 * u) + " " + (-1 * u) + " " + (2 * u),
          class: "st-acc-bowl"
        }));
      }
    }
    return g;
  }

  /**
   * Desenha uma pauta.
   *
   * @param {Element} container
   * @param {Array} notes  lista de "C4" | {letter,acc,oct,dur} | {midi}
   * @param {Object} options
   * @returns {SVGElement} com .noteNodes (array) e .flash(i)
   */
  function render(container, notes, options) {
    var o = Object.assign({}, DEFAULTS, options || {});
    var space = o.space;
    var clef = CLEFS[o.clef] ? o.clef : "sol";
    var C = CLEFS[clef];

    var list = (notes || []).map(function (n) {
      if (typeof n === "object" && n && n.midi !== undefined && !n.letter) {
        // Entrada so por MIDI: grafa na forma natural. Perde a distincao
        // enarmonica, entao so serve quando quem chama nao se importa.
        var nm = T ? T.midiToName(n.midi) : null;
        var p = nm ? parseStaffNote(nm) : null;
        if (p) p.dur = n.dur;
        return p;
      }
      var parsed = parseStaffNote(typeof n === "object" ? n : n, o.defaultOct);
      if (parsed && typeof n === "object" && n.dur !== undefined) parsed.dur = n.dur;
      return parsed;
    }).filter(Boolean);

    // Linha de baixo da pauta como referencia diatonica.
    var bottomDia = diatonicIndex(C.bottomLetter, C.bottomOct);

    /* y de uma nota: cada passo diatonico vale meio espaco, e a pauta
     * cresce para CIMA, entao o sinal e negativo. */
    var staffHeight = 4 * space;

    /* A folga sai das notas que existem, nao de um valor fixo. Reservar
     * sempre 5 espacos de cada lado deixava a pauta minuscula dentro de um
     * SVG quase todo vazio. Aqui: o quanto as notas passam da pauta, mais
     * a haste e um respiro. A clave de sol e o piso, porque ela desce
     * abaixo da pauta mesmo quando nenhuma nota desce. */
    var topDia = bottomDia + 8;
    var maxAcima = 0, maxAbaixo = 0;
    list.forEach(function (n) {
      maxAcima = Math.max(maxAcima, n.dia - topDia);
      maxAbaixo = Math.max(maxAbaixo, bottomDia - n.dia);
    });
    var respiroHaste = 3.6;      // a haste sobe ~3,3 espacos a partir da cabeca
    var topPad = Math.max(1.2, maxAcima * 0.5 + respiroHaste * 0.55) * space;
    var bottomPad = Math.max(clef === "sol" ? 2.0 : 1.2,
                             maxAbaixo * 0.5 + respiroHaste * 0.55) * space;
    if (o.showNames) bottomPad += space * 1.6;
    var yBottomLine = topPad + staffHeight;

    function yOf(dia) {
      return yBottomLine - (dia - bottomDia) * (space / 2);
    }

    // Armadura: reusa keySignature, nao redecide nada.
    var sig = null;
    if (o.key && T && T.keySignature) sig = T.keySignature(o.key);
    var sigCount = sig && sig.count ? sig.count : 0;

    var clefWidth = 4.2 * space;
    var sigWidth = sigCount * (space * 0.75);
    var x0 = o.leftPad + clefWidth + sigWidth + space * 0.6;
    var width = x0 + Math.max(list.length, 1) * o.noteSpacing + o.rightPad;
    var height = topPad + staffHeight + bottomPad;

    var svg = svgEl("svg", {
      viewBox: "0 0 " + width + " " + height,
      class: "st",
      role: "img",
      preserveAspectRatio: "xMidYMid meet"
    });
    svg.setAttribute("aria-label", o.ariaLabel ||
      ("Pauta em " + C.name + (list.length ? " com " + list.length + " notas" : "")));

    /* As cinco linhas. */
    var staffG = svgEl("g", { class: "st-lines" });
    for (var i = 0; i < 5; i++) {
      var y = yBottomLine - i * space;
      staffG.appendChild(svgEl("line", { x1: o.leftPad, y1: y, x2: width - 4, y2: y, class: "st-line" }));
    }
    svg.appendChild(staffG);

    svg.appendChild(clefPath(clef, o.leftPad + space * 0.3, yBottomLine, space));

    /* Armadura: os acidentes nas alturas corretas, na ordem de keySignature. */
    if (sigCount) {
      var sigG = svgEl("g", { class: "st-key" });
      var sx = o.leftPad + clefWidth;
      sig.order.forEach(function (letterName, k) {
        var letter = String(letterName)[0].toUpperCase();
        var oct = keyAccidentalOctave(letter, clef, sig.type);
        var dia = diatonicIndex(letter, oct);
        var gl = accidentalGlyph(sig.type === "bemois" ? -1 : 1, sx + k * (space * 0.75), yOf(dia), space);
        if (gl) sigG.appendChild(gl);
      });
      svg.appendChild(sigG);
    }

    /* Notas. */
    var noteNodes = [];
    var notesG = svgEl("g", { class: "st-notes" });

    list.forEach(function (n, idx) {
      var x = x0 + idx * o.noteSpacing;
      var y = yOf(n.dia);
      var g = svgEl("g", { class: "st-note" });

      /* Linhas suplementares: uma a cada passo INTEIRO fora da pauta.
       * Saem da mesma conta das linhas normais — nada tabelado. */
      var stepsAbove = n.dia - (bottomDia + 8);   // 8 = 4 espacos * 2
      var stepsBelow = bottomDia - n.dia;
      var led;
      for (led = 2; led <= stepsAbove; led += 2) {
        var ya = yOf(bottomDia + 8 + led);
        g.appendChild(svgEl("line", {
          x1: x - space * 0.8, y1: ya, x2: x + space * 0.8, y2: ya, class: "st-ledger"
        }));
      }
      for (led = 2; led <= stepsBelow; led += 2) {
        var yb = yOf(bottomDia - led);
        g.appendChild(svgEl("line", {
          x1: x - space * 0.8, y1: yb, x2: x + space * 0.8, y2: yb, class: "st-ledger"
        }));
      }

      if (n.acc) {
        var accG = accidentalGlyph(n.acc, x - space * 1.5, y, space);
        if (accG) g.appendChild(accG);
      }

      /* Cabeca: elipse levemente inclinada, como na tipografia real. */
      var dur = n.dur === undefined ? 1 : n.dur;
      var oca = dur >= 2;   // minima e semibreve sao vazadas
      var head = svgEl("ellipse", {
        cx: x, cy: y, rx: space * 0.62, ry: space * 0.46,
        transform: "rotate(-20 " + x + " " + y + ")",
        class: "st-head" + (oca ? " st-head--open" : "")
      });
      g.appendChild(head);

      /* Haste: para cima abaixo da linha do meio, para baixo acima dela.
       * A linha do meio e a 3a: bottomDia + 4 passos. */
      if (dur < 4) {
        var meio = bottomDia + 4;
        var paraCima = n.dia < meio;
        var hx = paraCima ? x + space * 0.58 : x - space * 0.58;
        var hy2 = paraCima ? y - space * 3.3 : y + space * 3.3;
        g.appendChild(svgEl("line", {
          x1: hx, y1: y, x2: hx, y2: hy2, class: "st-stem"
        }));

        /* Colchetes: uma bandeira por divisao abaixo da seminima. */
        var flags = dur <= 0.5 ? Math.round(Math.log2(1 / dur)) : 0;
        for (var fl = 0; fl < flags; fl++) {
          var fy = hy2 + (paraCima ? 1 : -1) * fl * space * 0.62;
          g.appendChild(svgEl("path", {
            d: "M " + hx + " " + fy +
               " q " + (space * 0.9) + " " + (paraCima ? space * 0.7 : -space * 0.7) + " " +
               (space * 0.5) + " " + (paraCima ? space * 1.6 : -space * 1.6),
            class: "st-flag"
          }));
        }
      }

      /* Ponto de aumento. */
      if (n.dotted) {
        g.appendChild(svgEl("circle", {
          cx: x + space * 1.05, cy: y - (isOnLine(n.dia, bottomDia) ? space * 0.5 : 0),
          r: space * 0.14, class: "st-dot"
        }));
      }

      if (o.showNames) {
        var label = svgEl("text", {
          x: x, y: yBottomLine + space * 2.4, class: "st-name", "text-anchor": "middle"
        });
        label.textContent = (T ? T.noteName({ letter: n.letter, acc: n.acc, pc: 0 }) : n.letter) + n.oct;
        g.appendChild(label);
      }

      notesG.appendChild(g);
      noteNodes.push(g);
    });

    svg.appendChild(notesG);

    if (container) {
      container.innerHTML = "";
      container.appendChild(svg);
    }

    svg.noteNodes = noteNodes;
    svg.notes = list;
    svg.flash = function (idx) {
      var node = noteNodes[idx];
      if (!node) return;
      node.classList.add("st-note--on");
      setTimeout(function () { node.classList.remove("st-note--on"); }, 260);
    };
    svg.setActive = function (idx) {
      noteNodes.forEach(function (nd, i) {
        nd.classList.toggle("st-note--active", i === idx);
      });
    };

    return svg;
  }

  function isOnLine(dia, bottomDia) {
    return (dia - bottomDia) % 2 === 0;
  }

  /*
   * Oitava em que cada acidente da armadura e escrito.
   * Tambem nao e tabela arbitraria: os acidentes ficam dentro da pauta, e a
   * ordem tradicional alterna descendo uma quarta / subindo uma quinta. A
   * escolha aqui e a convencao de gravacao, por clave.
   */
  function keyAccidentalOctave(letter, clef, type) {
    var sharpOct = clef === "sol"
      ? { F: 5, C: 5, G: 5, D: 5, A: 4, E: 5, B: 4 }
      : { F: 3, C: 3, G: 3, D: 3, A: 2, E: 3, B: 2 };
    var flatOct = clef === "sol"
      ? { B: 4, E: 5, A: 4, D: 5, G: 4, C: 5, F: 4 }
      : { B: 2, E: 3, A: 2, D: 3, G: 2, C: 3, F: 2 };
    var table = type === "bemois" ? flatOct : sharpOct;
    return table[letter] !== undefined ? table[letter] : (clef === "sol" ? 4 : 2);
  }

  global.PT = global.PT || {};
  global.PT.staff = {
    render: render,
    parseNote: parseStaffNote,
    diatonicIndex: diatonicIndex,
    CLEFS: CLEFS,
    keyAccidentalOctave: keyAccidentalOctave
  };
})(typeof window !== "undefined" ? window : globalThis);
