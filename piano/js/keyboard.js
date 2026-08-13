/*
 * keyboard.js — desenho do teclado em SVG.
 *
 * A geometria nao e "chutada". Ela sai de uma restricao real do piano:
 * dentro de cada grupo de teclas brancas (Do-Re-Mi e Fa-Sol-La-Si), as
 * partes visiveis das brancas entre as pretas tem todas a mesma largura.
 *
 *   grupo com n brancas e k pretas, preta de largura b:
 *   sobra = (n*W - k*b) / n           <- largura de cada "haste" branca
 *   centro da preta i = sobra + b/2 + i*(sobra + b)
 *
 * Para b = 0.58*W isso da os deslocamentos reais: Do# e Fa# ficam a
 * esquerda da divisa, Sol# fica centrado, Re# e La# ficam a direita.
 */
(function (global) {
  "use strict";

  var T = global.PT.theory;

  var WHITE_PC = [0, 2, 4, 5, 7, 9, 11];        // C D E F G A B
  var BLACK_PC = [1, 3, 6, 8, 10];              // C# D# F# G# A#
  var PC_TO_WHITE_INDEX = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };

  var DEFAULTS = {
    whiteWidth: 34,
    whiteHeight: 150,
    blackRatio: 0.58,
    blackHeightRatio: 0.62,
    octaves: 2,
    startMidi: 60,            // C4
    labels: "auto",           // "auto" | "all" | "none" | "highlighted"
    showOctaveNumbers: false,
    interactive: true
  };

  /**
   * Calcula os centros das teclas pretas de uma oitava, em unidades de
   * largura de tecla branca, a partir da restricao de hastes iguais.
   */
  function blackCenters(blackRatio) {
    var b = blackRatio;
    var centers = {};

    // Grupo Do-Re-Mi: 3 brancas, 2 pretas (Do#, Re#), comeca em x = 0.
    var stem3 = (3 - 2 * b) / 3;
    centers[1] = stem3 + b / 2;
    centers[3] = 2 * stem3 + b + b / 2;

    // Grupo Fa-Sol-La-Si: 4 brancas, 3 pretas, comeca em x = 3.
    var stem4 = (4 - 3 * b) / 4;
    centers[6] = 3 + stem4 + b / 2;
    centers[8] = 3 + 2 * stem4 + b + b / 2;
    centers[10] = 3 + 3 * stem4 + 2 * b + b / 2;

    return centers;
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  /**
   * Normaliza a lista de destaques.
   * Aceita: [0,4,7] (classes), ["C","E","G"], ou
   * [{pc:0, label:"1", role:"tonic"}, ...], ou {midi: 60, ...}
   */
  function normalizeHighlights(highlights) {
    var byPc = {};
    var byMidi = {};
    (highlights || []).forEach(function (h, i) {
      var item;
      if (typeof h === "number") item = { pc: T.mod(h, 12) };
      else if (typeof h === "string") {
        var n = T.parseNote(h);
        item = n ? { pc: n.pc, label: T.noteName(n) } : null;
      } else item = Object.assign({}, h);
      if (!item) return;
      if (item.midi !== undefined && item.midi !== null) {
        byMidi[item.midi] = item;
        if (item.pc === undefined) item.pc = T.mod(item.midi, 12);
      }
      if (item.pc !== undefined && byPc[item.pc] === undefined) {
        item.order = i;
        byPc[item.pc] = item;
      }
    });
    return { byPc: byPc, byMidi: byMidi };
  }

  /**
   * Desenha um teclado.
   * @returns {SVGElement} com metodos .setHighlights() e .flash(midi)
   */
  function render(container, options) {
    var o = Object.assign({}, DEFAULTS, options || {});
    var W = o.whiteWidth;
    var H = o.whiteHeight;
    var b = o.blackRatio * W;
    var bh = o.blackHeightRatio * H;
    var centers = blackCenters(o.blackRatio);

    var startMidi = o.startMidi;
    // Garante que o teclado comece numa tecla branca (Do por padrao).
    var totalOctaves = o.octaves;
    var whiteCount = 7 * totalOctaves + 1;      // + Do final
    var width = whiteCount * W;
    var height = H + 4;

    var svg = svgEl("svg", {
      viewBox: "0 0 " + width + " " + height,
      class: "kb",
      role: "img",
      preserveAspectRatio: "xMidYMid meet"
    });
    svg.setAttribute("aria-label", o.ariaLabel || "Diagrama de teclado");

    var hl = normalizeHighlights(o.highlights);
    var whiteLayer = svgEl("g", { class: "kb-white-layer" });
    var blackLayer = svgEl("g", { class: "kb-black-layer" });
    var keyNodes = {};

    function keyInfo(midi) {
      var pc = T.mod(midi, 12);
      var isBlack = BLACK_PC.indexOf(pc) >= 0;
      var direct = hl.byMidi[midi];
      var byClass = o.matchOctaves === false ? null : hl.byPc[pc];
      var mark = direct || byClass || null;
      return { pc: pc, isBlack: isBlack, mark: mark };
    }

    // --- teclas brancas ---
    for (var w = 0; w < whiteCount; w++) {
      var oct = Math.floor(w / 7);
      var idx = w % 7;
      var midi = startMidi + oct * 12 + WHITE_PC[idx];
      var info = keyInfo(midi);
      var x = w * W;

      var g = svgEl("g", { class: "kb-key kb-key--white" + (info.mark ? " is-on" : "") });
      g.dataset.midi = midi;
      g.dataset.pc = info.pc;
      if (info.mark && info.mark.role) g.dataset.role = info.mark.role;

      var rect = svgEl("rect", {
        x: x + 0.5, y: 0.5, width: W - 1, height: H,
        rx: 3, ry: 3, class: "kb-shape"
      });
      g.appendChild(rect);

      var label = labelFor(info, midi, o);
      if (label) {
        var text = svgEl("text", {
          x: x + W / 2, y: H - 14, class: "kb-label", "text-anchor": "middle"
        });
        text.textContent = label;
        g.appendChild(text);
      }
      if (info.mark && info.mark.sub) {
        var sub = svgEl("text", {
          x: x + W / 2, y: H - 30, class: "kb-sub", "text-anchor": "middle"
        });
        sub.textContent = info.mark.sub;
        g.appendChild(sub);
      }

      whiteLayer.appendChild(g);
      keyNodes[midi] = g;
    }

    // --- teclas pretas ---
    for (var ob = 0; ob < totalOctaves; ob++) {
      for (var k = 0; k < BLACK_PC.length; k++) {
        var pcb = BLACK_PC[k];
        var midiB = startMidi + ob * 12 + pcb;
        var infoB = keyInfo(midiB);
        var cx = (ob * 7 + centers[pcb]) * W;

        var gb = svgEl("g", { class: "kb-key kb-key--black" + (infoB.mark ? " is-on" : "") });
        gb.dataset.midi = midiB;
        gb.dataset.pc = infoB.pc;
        if (infoB.mark && infoB.mark.role) gb.dataset.role = infoB.mark.role;

        gb.appendChild(svgEl("rect", {
          x: cx - b / 2, y: 0, width: b, height: bh, rx: 3, ry: 3, class: "kb-shape"
        }));

        var labelB = labelFor(infoB, midiB, o);
        if (labelB) {
          var tb = svgEl("text", {
            x: cx, y: bh - 10, class: "kb-label kb-label--black", "text-anchor": "middle"
          });
          tb.textContent = labelB;
          gb.appendChild(tb);
        }

        blackLayer.appendChild(gb);
        keyNodes[midiB] = gb;
      }
    }

    svg.appendChild(whiteLayer);
    svg.appendChild(blackLayer);

    if (o.interactive) {
      svg.classList.add("kb--interactive");
      svg.addEventListener("pointerdown", function (ev) {
        var g = ev.target.closest(".kb-key");
        if (!g) return;
        var midi = parseInt(g.dataset.midi, 10);
        flash(midi);
        if (global.PT.audio) global.PT.audio.play(midi);
        if (o.onKey) o.onKey(midi, g);
      });
    }

    function flash(midi) {
      var g = keyNodes[midi];
      if (!g) return;
      g.classList.add("is-playing");
      setTimeout(function () { g.classList.remove("is-playing"); }, 260);
    }

    svg.flash = flash;
    svg.keyNodes = keyNodes;
    svg.setHighlights = function (next) {
      var re = render(container, Object.assign({}, o, { highlights: next }));
      return re;
    };

    if (container) {
      container.innerHTML = "";
      container.appendChild(svg);
    }
    return svg;
  }

  function labelFor(info, midi, o) {
    if (o.labels === "none") return null;
    var mark = info.mark;
    if (o.labels === "highlighted" && !mark) return null;
    if (mark && mark.label) return mark.label;
    if (o.labels === "all" || (o.labels === "auto" && !info.isBlack)) {
      var name = T.pcName(info.pc, o.preferFlats);
      if (o.labels === "auto" && info.isBlack) return null;
      return o.showOctaveNumbers ? name + (Math.floor(midi / 12) - 1) : name;
    }
    return null;
  }

  /**
   * Atalho: desenha uma escala ja construida, rotulando os graus.
   */
  function renderScale(container, built, options) {
    if (!built) return null;
    var highlights = built.pcs.map(function (pc, i) {
      return {
        pc: pc,
        label: T.noteName(built.notes[i]),
        sub: built.degrees[i],
        role: i === 0 ? "tonic" : "scale"
      };
    });
    return render(container, Object.assign({
      highlights: highlights,
      labels: "highlighted",
      octaves: 2,
      startMidi: 60
    }, options || {}));
  }

  /**
   * Atalho: desenha um acorde com as notas reais (respeitando inversao e
   * extensoes acima da oitava).
   */
  function renderChord(container, chordObj, options) {
    if (!chordObj) return null;
    var base = (options && options.startMidi) || 60;
    var rootMidi = base + T.mod(chordObj.root.pc - T.mod(base, 12), 12);
    var span = Math.max.apply(null, chordObj.intervals);
    var highlights = chordObj.intervals.map(function (iv, i) {
      return {
        midi: rootMidi + iv,
        pc: T.mod(rootMidi + iv, 12),
        label: chordObj.names[i],
        sub: chordObj.chord.formula.split(" ")[i],
        role: i === 0 ? "tonic" : "chord"
      };
    });
    return render(container, Object.assign({
      highlights: highlights,
      labels: "highlighted",
      matchOctaves: false,
      octaves: span > 12 ? 3 : 2,
      startMidi: base
    }, options || {}));
  }

  global.PT = global.PT || {};
  global.PT.keyboard = {
    render: render,
    renderScale: renderScale,
    renderChord: renderChord,
    blackCenters: blackCenters,
    WHITE_PC: WHITE_PC,
    BLACK_PC: BLACK_PC,
    PC_TO_WHITE_INDEX: PC_TO_WHITE_INDEX
  };
})(typeof window !== "undefined" ? window : globalThis);
