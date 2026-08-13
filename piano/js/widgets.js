/*
 * widgets.js — hidratacao dos marcadores <div data-w="..."> das licoes.
 *
 * Cada widget e gerado a partir do motor teorico. Nenhuma tabela e escrita
 * a mao: se a teoria mudar, os diagramas mudam junto.
 */
(function (global) {
  "use strict";

  var T = global.PT.theory;
  var KB = global.PT.keyboard;
  var A = global.PT.audio;

  /* ------------------------------------------------------------------ *
   * Helpers de DOM
   * ------------------------------------------------------------------ */

  function h(tag, cls, html) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined && html !== null) el.innerHTML = html;
    return el;
  }

  function frag() { return document.createDocumentFragment(); }

  function tbl(headers, rows, cls) {
    var t = h("table", "tbl " + (cls || ""));
    if (headers) {
      var thead = h("thead");
      var tr = h("tr");
      headers.forEach(function (x) { tr.appendChild(h("th", null, x)); });
      thead.appendChild(tr);
      t.appendChild(thead);
    }
    var tb = h("tbody");
    rows.forEach(function (r) {
      var tr = h("tr");
      (r.cells || r).forEach(function (c) {
        var td = h("td", null, c);
        tr.appendChild(td);
      });
      if (r.cls) tr.className = r.cls;
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    return t;
  }

  function btn(label, fn, cls) {
    var b = h("button", "btn " + (cls || ""), label);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  }

  function caption(text) { return h("p", "fig-caption", text); }

  function chordMidis(rootName, chordId, base) {
    base = base === undefined ? 48 : base;
    var c = T.buildChord(rootName, chordId);
    if (!c) return [];
    var rootMidi = base + T.mod(c.root.pc - T.mod(base, 12), 12);
    return c.intervals.map(function (iv) { return rootMidi + iv; });
  }

  /** Bloco de progressao: chips clicaveis + botao "tocar tudo". */
  function progression(items, opts) {
    opts = opts || {};
    var wrap = h("div", "prog");
    if (opts.title) wrap.appendChild(h("h4", "prog-title", opts.title));
    var row = h("div", "prog-row");
    var all = [];
    items.forEach(function (it) {
      var midis = it.midis || chordMidis(it.root, it.type, opts.base);
      all.push(midis);
      var chip = h("button", "chip chip--chord");
      chip.type = "button";
      chip.innerHTML = '<span class="chip-sym">' + it.label + "</span>" +
        (it.roman ? '<span class="chip-roman">' + it.roman + "</span>" : "") +
        (it.notes ? '<span class="chip-notes">' + it.notes + "</span>" : "");
      chip.addEventListener("click", function () { A.playChord(midis, 1.6, 0.012); });
      row.appendChild(chip);
    });
    wrap.appendChild(row);
    var bar = h("div", "prog-bar");
    bar.appendChild(btn("▶ Tocar progressao", function () {
      all.forEach(function (m, i) {
        setTimeout(function () { A.playChord(m, 1.5, 0.012); }, i * 950);
      });
    }));
    if (opts.note) bar.appendChild(h("span", "prog-note", opts.note));
    wrap.appendChild(bar);
    return wrap;
  }

  /** Bloco padrao de escala: cabecalho + teclado + dados + audio. */
  function scaleBlock(tonic, scaleId, opts) {
    opts = opts || {};
    var built = T.buildScale(tonic, scaleId);
    if (!built) return h("div", "warn", "Escala desconhecida: " + scaleId);

    var wrap = h("div", "scale-block");
    var head = h("div", "scale-block-head");
    head.appendChild(h("h4", null, T.noteName(built.tonic) + " " + built.scale.name));
    var meta = h("div", "scale-meta");
    meta.appendChild(h("span", "tag tag--" + (built.scale.category || "base"), built.scale.category || ""));
    meta.appendChild(h("span", "mono", built.steps.join(" - ") + "  (Σ12)"));
    meta.appendChild(h("span", "mono", built.pcs.length + " notas"));
    head.appendChild(meta);
    wrap.appendChild(head);

    var kbBox = h("div", "kb-box");
    wrap.appendChild(kbBox);
    KB.renderScale(kbBox, built, {
      octaves: parseInt(opts.octaves, 10) || 2,
      labels: opts.labels || "highlighted",
      showOctaveNumbers: opts.octnum === "1"
    });

    var notes = h("div", "note-row");
    built.notes.forEach(function (n, i) {
      var c = h("span", "note-chip" + (i === 0 ? " is-root" : ""));
      c.innerHTML = '<b>' + T.noteName(n) + '</b><em>' + built.degrees[i] + "</em>";
      c.addEventListener("click", function () { A.play(60 + built.intervals[i]); });
      wrap.dataset.hasNotes = "1";
      notes.appendChild(c);
    });
    wrap.appendChild(notes);

    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Subindo", function () {
      A.playSequence(A.scaleToMidi(built, 60, false), 0.28);
    }));
    bar.appendChild(btn("▶ Subindo e descendo", function () {
      A.playSequence(A.scaleToMidi(built, 60, true), 0.24);
    }));
    bar.appendChild(h("span", "mono muted", "vetor ⟨" + built.vector.join(",") + "⟩"));
    wrap.appendChild(bar);

    if (opts.why !== false && built.scale.why) {
      wrap.appendChild(h("p", "scale-why", "<strong>Por que existe:</strong> " + built.scale.why));
    }
    if (opts.uses !== false && built.scale.uses) {
      wrap.appendChild(h("p", "scale-uses", "<strong>Onde se usa:</strong> " + built.scale.uses));
    }
    return wrap;
  }

  /* ------------------------------------------------------------------ *
   * Registro de widgets
   * ------------------------------------------------------------------ */

  var W = {};

  /* --- basico ------------------------------------------------------- */

  W.scale = function (node) {
    return scaleBlock(node.dataset.tonic || "C", node.dataset.scale || "jonio", {
      octaves: node.dataset.octaves,
      labels: node.dataset.labels,
      octnum: node.dataset.octnum
    });
  };

  W.harmonize = function (node) {
    var tonic = node.dataset.tonic || "C";
    var scaleId = node.dataset.scale || "jonio";
    var size = parseInt(node.dataset.size, 10) || 3;
    var built = T.buildScale(tonic, scaleId);
    var chords = T.harmonize(built, size);
    if (!chords.length) return h("div", "warn", "Campo harmonico so para escalas de 7 notas.");

    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Campo harmonico de " + T.noteName(built.tonic) + " " +
      built.scale.name + (size === 4 ? " — tetrades" : " — triades")));
    wrap.appendChild(tbl(
      ["Grau", "Cifra", "Notas", "Qualidade", "Funcao"],
      chords.map(function (c) {
        return ["<strong>" + c.roman + "</strong>", '<span class="mono">' + c.symbol + "</span>",
          c.names.join(" "), c.quality ? c.quality.name : "—", c.function];
      })
    ));
    wrap.appendChild(progression(chords.map(function (c) {
      return {
        label: c.symbol, roman: c.roman,
        midis: c.pcs.map(function (pc, i) {
          return 48 + T.mod(c.pcs[0] - 48 % 12, 12) + (built.intervals[(c.degree - 1 + 2 * i) % 7] || 0);
        })
      };
    }).map(function (x, i) {
      var c = chords[i];
      var rootMidi = 48 + T.mod(c.pcs[0] - T.mod(48, 12), 12);
      var ivs = [];
      var acc = 0;
      for (var k = 0; k < size; k++) {
        var idx = (c.degree - 1 + 2 * k) % 7;
        var octs = Math.floor((c.degree - 1 + 2 * k) / 7);
        ivs.push(built.intervals[idx] + 12 * octs - built.intervals[c.degree - 1]);
      }
      return { label: c.symbol, roman: c.roman, midis: ivs.map(function (v) { return rootMidi + v; }) };
    })));
    return wrap;
  };

  W.compare = function (node) {
    var cmp = T.compareScales(node.dataset.tonic || "C", node.dataset.a, node.dataset.b);
    if (!cmp) return h("div", "warn", "Comparacao invalida");
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Comparacao: " + cmp.a.scale.name + " × " + cmp.b.scale.name +
      " (tonica " + T.noteName(cmp.a.tonic) + ")"));

    var hl = [];
    cmp.common.forEach(function (pc) { hl.push({ pc: pc, role: "scale", label: T.pcName(pc) }); });
    cmp.onlyA.forEach(function (pc) { hl.push({ pc: pc, role: "only-a", label: T.pcName(pc) }); });
    cmp.onlyB.forEach(function (pc) { hl.push({ pc: pc, role: "only-b", label: T.pcName(pc) }); });
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, { highlights: hl, labels: "highlighted", octaves: 2, startMidi: 60 });

    var legend = h("div", "legend");
    legend.innerHTML =
      '<span><i class="sw sw--scale"></i> comuns (' + cmp.common.length + ")</span>" +
      '<span><i class="sw sw--a"></i> so em ' + cmp.a.scale.name + "</span>" +
      '<span><i class="sw sw--b"></i> so em ' + cmp.b.scale.name + "</span>";
    wrap.appendChild(legend);

    wrap.appendChild(tbl(["Escala", "Notas", "Graus", "Passos"], [
      [cmp.a.scale.name, cmp.a.names.join(" "), cmp.a.degrees.join(" "), cmp.a.steps.join("-")],
      [cmp.b.scale.name, cmp.b.names.join(" "), cmp.b.degrees.join(" "), cmp.b.steps.join("-")]
    ]));
    return wrap;
  };

  W.circle = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Circulo das quintas"));
    wrap.appendChild(buildCircle());
    return wrap;
  };

  function buildCircle(onPick) {
    var data = T.circleOfFifths();
    var size = 400, cx = size / 2, cy = size / 2;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("class", "circle-svg");

    function mk(tag, attrs) {
      var e = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }
    svg.appendChild(mk("circle", { cx: cx, cy: cy, r: 150, class: "circ-ring" }));
    svg.appendChild(mk("circle", { cx: cx, cy: cy, r: 104, class: "circ-ring" }));
    svg.appendChild(mk("circle", { cx: cx, cy: cy, r: 62, class: "circ-ring" }));

    data.forEach(function (d) {
      var xo = cx + Math.cos(d.angle) * 127;
      var yo = cy + Math.sin(d.angle) * 127;
      var xi = cx + Math.cos(d.angle) * 83;
      var yi = cy + Math.sin(d.angle) * 83;

      var g = mk("g", { class: "circ-node" });
      g.appendChild(mk("circle", { cx: xo, cy: yo, r: 24, class: "circ-major" }));
      var t1 = mk("text", { x: xo, y: yo + 5, class: "circ-label", "text-anchor": "middle" });
      t1.textContent = d.major;
      g.appendChild(t1);

      var t2 = mk("text", { x: xi, y: yi + 4, class: "circ-label circ-label--minor", "text-anchor": "middle" });
      t2.textContent = d.minor;
      g.appendChild(t2);

      var sigTxt = d.signature.count === 0 ? "—" :
        d.signature.count + (d.signature.type === "sustenidos" ? "♯" : "♭");
      var t3 = mk("text", {
        x: cx + Math.cos(d.angle) * 172, y: cy + Math.sin(d.angle) * 172 + 4,
        class: "circ-sig", "text-anchor": "middle"
      });
      t3.textContent = sigTxt;
      g.appendChild(t3);

      g.style.cursor = "pointer";
      g.addEventListener("click", function () {
        var b = T.buildScale(d.major, "jonio");
        A.playSequence(A.scaleToMidi(b, 60), 0.2);
        if (onPick) onPick(d);
      });
      svg.appendChild(g);
    });

    var wrap = h("div", "circle-wrap");
    wrap.appendChild(svg);
    wrap.appendChild(caption("Externo: tonalidades maiores. Interno: relativos menores. Fora: numero de acidentes. Clique para ouvir."));
    return wrap;
  }

  /* --- Modulo 1 ------------------------------------------------------ */

  W["freq-table"] = function () {
    var rows = [];
    [["Do", 0], ["Do♯/Re♭", 1], ["Re", 2], ["Re♯/Mi♭", 3], ["Mi", 4], ["Fa", 5],
     ["Fa♯/Sol♭", 6], ["Sol", 7], ["Sol♯/La♭", 8], ["La", 9], ["La♯/Si♭", 10], ["Si", 11], ["Do", 12]]
      .forEach(function (p) {
        var midi = 60 + p[1];
        var f = T.midiToFreq(midi);
        rows.push([p[0], midi, f.toFixed(2) + " Hz",
          (f / T.midiToFreq(60)).toFixed(6), (p[1] * 100) + " cents"]);
      });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Uma oitava a partir do Do central"));
    wrap.appendChild(tbl(["Nota", "MIDI", "Frequencia", "Razao com Do4", "Cents"], rows));
    wrap.appendChild(caption("A ultima linha e o dobro exato da primeira: 523,25 = 2 × 261,63."));
    return wrap;
  };

  W["semitone-map"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Onde estao os semitons entre teclas brancas"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 1, startMidi: 60, labels: "highlighted",
      highlights: [
        { pc: 4, label: "Mi", role: "semi" }, { pc: 5, label: "Fa", role: "semi" },
        { pc: 11, label: "Si", role: "semi" }, { pc: 0, label: "Do", role: "semi" }
      ]
    });
    wrap.appendChild(tbl(["Par de brancas", "Tem preta entre elas?", "Distancia"], [
      ["Do → Re", "sim (Do♯)", "tom"], ["Re → Mi", "sim (Re♯)", "tom"],
      ["<strong>Mi → Fa</strong>", "<strong>nao</strong>", "<strong>semitom</strong>"],
      ["Fa → Sol", "sim (Fa♯)", "tom"], ["Sol → La", "sim (Sol♯)", "tom"],
      ["La → Si", "sim (La♯)", "tom"],
      ["<strong>Si → Do</strong>", "<strong>nao</strong>", "<strong>semitom</strong>"]
    ]));
    return wrap;
  };

  W["edo-table"] = function () {
    var conv = [[1, 2, 5], [3, 5, 5], [7, 12, 12], [24, 41, 41], [31, 53, 53]];
    var rows = conv.map(function (c) {
      var approx = c[0] / c[1];
      var cents = approx * 1200;
      var err = cents - 701.955;
      return ["<span class='mono'>" + c[0] + "/" + c[1] + "</span>", "<strong>" + c[2] + "</strong>",
        cents.toFixed(2) + " cents", (err > 0 ? "+" : "") + err.toFixed(2) + " cents",
        Math.abs(err) < 3 ? "<span class='ok'>excelente</span>" :
          Math.abs(err) < 20 ? "aceitavel" : "<span class='bad'>ruim</span>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Convergentes de log₂(3/2) = 0,5849625"));
    wrap.appendChild(tbl(["Fracao", "Divisoes da oitava", "Quinta resultante", "Erro vs 3:2 pura", "Veredito"], rows));
    wrap.appendChild(caption("A quinta justa pura (3:2) vale 701,955 cents. 12 divisoes erram por menos de 2 cents."));
    return wrap;
  };

  W.landmarks = function () {
    var wrap = h("div", "widget-card");
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted",
      highlights: [
        { pc: 0, label: "Do", sub: "← 2 pretas", role: "tonic" },
        { pc: 5, label: "Fa", sub: "← 3 pretas", role: "landmark" }
      ]
    });
    wrap.appendChild(caption("Do fica a esquerda do grupo de 2 pretas; Fa a esquerda do grupo de 3."));
    return wrap;
  };

  W["geometry-table"] = function () {
    var b = 0.58;
    var centers = KB.blackCenters(b);
    var names = { 1: "Do♯", 3: "Re♯", 6: "Fa♯", 8: "Sol♯", 10: "La♯" };
    var boundary = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 };
    var rows = Object.keys(names).map(function (pc) {
      var c = centers[pc];
      var off = c - boundary[pc];
      return [names[pc], c.toFixed(4) + " W", boundary[pc] + " W",
        (off > 0 ? "+" : "") + off.toFixed(4) + " W",
        Math.abs(off) < 0.001 ? "centrada" : (off < 0 ? "a esquerda" : "a direita")];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Centros das teclas pretas (b = 0,58 W)"));
    wrap.appendChild(tbl(["Tecla", "Centro calculado", "Divisa entre brancas", "Deslocamento", "Posicao"], rows));
    wrap.appendChild(caption("W = largura da tecla branca. Valores gerados pela mesma funcao que desenha os diagramas."));
    return wrap;
  };

  W["geometry-demo"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "As posicoes aplicadas"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, { octaves: 1, startMidi: 60, labels: "all", whiteWidth: 46, whiteHeight: 180 });
    wrap.appendChild(caption("Compare Sol♯ (centrado) com Do♯ e Fa♯ (a esquerda) e Re♯ e La♯ (a direita)."));
    return wrap;
  };

  W["note-names"] = function () {
    var rows = T.LETTERS.map(function (L) {
      return [L, T.LETTER_PT[L], T.LETTER_PC[L], T.midiToFreq(60 + T.LETTER_PC[L]).toFixed(2) + " Hz"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Letra", "Silaba", "Semitons acima de Do", "Frequencia (4a oitava)"], rows));
    return wrap;
  };

  /* --- Modulo 2 ------------------------------------------------------ */

  W["interval-table"] = function () {
    var rows = T.INTERVALS.map(function (iv) {
      var b = T.buildScale("C", "cromatica");
      return ["<strong>" + iv.semitones + "</strong>", iv.short, iv.name,
        "Do → " + T.pcName(T.mod(iv.semitones, 12)) + (iv.semitones === 12 ? " (oitava acima)" : ""),
        (iv.semitones * 100) + " cents"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Semitons", "Cifra", "Nome", "Exemplo desde Do", "Cents"], rows));
    return wrap;
  };

  W["interval-explorer"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Explorador de intervalos"));
    var ctrl = h("div", "ctrl-row");
    var sel = h("select", "sel");
    T.INTERVALS.forEach(function (iv) {
      var o = h("option", null, iv.semitones + " semitons — " + iv.name);
      o.value = iv.semitones;
      sel.appendChild(o);
    });
    sel.value = 7;
    ctrl.appendChild(sel);
    ctrl.appendChild(btn("▶ Melodico", function () { A.playSequence([60, 60 + (+sel.value)], 0.45); }));
    ctrl.appendChild(btn("▶ Harmonico", function () { A.playChord([60, 60 + (+sel.value)], 1.8); }));
    wrap.appendChild(ctrl);
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    var info = h("div", "info-line");
    wrap.appendChild(info);

    function draw() {
      var s = +sel.value;
      KB.render(box, {
        octaves: 2, startMidi: 60, labels: "highlighted", matchOctaves: false,
        highlights: [
          { midi: 60, label: "Do", role: "tonic" },
          { midi: 60 + s, label: T.pcName(T.mod(60 + s, 12)), role: "scale" }
        ]
      });
      var iv = T.intervalOf(s);
      var inv = 12 - T.mod(s, 12);
      info.innerHTML = "<strong>" + iv.name + "</strong> · " + s + " semitons · " + (s * 100) +
        " cents · inversao: " + T.intervalOf(inv).name + " (" + inv + " semitons)";
    }
    sel.addEventListener("change", draw);
    draw();
    return wrap;
  };

  W["inversion-table"] = function () {
    var rows = [];
    for (var s = 0; s <= 12; s++) {
      var inv = 12 - s;
      rows.push([T.intervalOf(s).name + " (" + s + ")", "→", T.intervalOf(inv).name + " (" + inv + ")",
        "<span class='mono'>" + s + " + " + inv + " = 12</span>"]);
    }
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Intervalo", "", "Inversao", "Confere"], rows));
    return wrap;
  };

  W["consonance-table"] = function () {
    var rows = T.JUST_INTERVALS.map(function (j) {
      var ratio = j.ratio[0] / j.ratio[1];
      var cents = T.ratioToCents(ratio);
      var diff = j.et - cents;
      var complexity = j.ratio[0] + j.ratio[1];
      return ["<span class='mono'>" + j.ratio[0] + ":" + j.ratio[1] + "</span>", j.name,
        cents.toFixed(2), j.et, (diff > 0 ? "+" : "") + diff.toFixed(2),
        complexity <= 8 ? "<span class='ok'>consonante</span>" :
          complexity <= 16 ? "intermediario" : "<span class='bad'>dissonante</span>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Razoes puras × temperamento igual"));
    wrap.appendChild(tbl(["Razao", "Intervalo", "Cents puro", "Cents no piano", "Diferenca", "Classificacao"], rows));
    wrap.appendChild(caption("Quanto menor a soma dos termos da razao, mais harmonicos coincidem e mais consonante soa."));
    return wrap;
  };

  W["ear-table"] = function () {
    var refs = [
      [1, "2m", "Tubarao (tema) · Jingle Bells (descendo)"],
      [2, "2M", "Parabens pra voce · Frere Jacques"],
      [3, "3m", "Smoke on the Water · Asa Branca"],
      [4, "3M", "Oh When the Saints · Garota de Ipanema"],
      [5, "4J", "Hino do Brasil (inicio) · Casamento (Marcha nupcial)"],
      [6, "4A", "Os Simpsons (tema) · Maria (West Side Story)"],
      [7, "5J", "Guerra nas Estrelas · Parabens (Twinkle, 1-5)"],
      [8, "6m", "Tema de Love Story · The Entertainer"],
      [9, "6M", "My Way · NBC (vinheta)"],
      [10, "7m", "Somewhere (West Side Story) · Star Trek"],
      [11, "7M", "Take On Me (refrao) · Superman (tema)"],
      [12, "8J", "Somewhere Over the Rainbow"]
    ];
    var wrap = h("div", "widget-card");
    var t = tbl(["Semitons", "Intervalo", "Referencia auditiva", ""], refs.map(function (r) {
      return [r[0], r[1], r[2], ""];
    }));
    // Botao de audicao em cada linha
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      var cell = tr.lastElementChild;
      cell.appendChild(btn("▶", function () { A.playSequence([60, 60 + refs[i][0]], 0.45); }, "btn--mini"));
    });
    wrap.appendChild(t);
    return wrap;
  };

  /* --- Modulo 3 ------------------------------------------------------ */

  W["harmonic-series"] = function () {
    var rows = [];
    for (var n = 1; n <= 16; n++) {
      var hm = T.harmonic(n);
      var f = 65.41 * n;
      var nearest = T.pcName(T.mod(hm.nearestPc, 12));
      var dev = hm.deviation;
      rows.push([
        "<strong>" + n + "</strong>",
        f.toFixed(1) + " Hz",
        "<span class='mono'>" + n + ":1</span>",
        hm.cents.toFixed(1),
        nearest,
        (Math.abs(dev) < 1 ? "exato" : (dev > 0 ? "+" : "") + dev.toFixed(1) + " ¢"),
        intervalNameForHarmonic(n)
      ]);
    }
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Serie harmonica sobre Do2 (65,41 Hz)"));
    wrap.appendChild(tbl(["Harmonico", "Frequencia", "Razao", "Cents", "Nota mais proxima", "Desvio", "Significado"], rows));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Ouvir harmonicos 1 a 8", function () {
      for (var n = 1; n <= 8; n++) A.playFreq(65.41 * n, 0.7, (n - 1) * 0.75);
    }));
    bar.appendChild(btn("▶ Ouvir 4, 5 e 6 juntos (acorde maior)", function () {
      [4, 5, 6].forEach(function (n) { A.playFreq(65.41 * n, 2.2, 0); });
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  function intervalNameForHarmonic(n) {
    var map = {
      1: "fundamental", 2: "oitava (2:1)", 3: "quinta justa (3:2)", 4: "2 oitavas",
      5: "terca maior (5:4)", 6: "quinta (3:2) — com 4 e 5 forma o acorde maior",
      7: "setima 'harmonica' — 31¢ abaixo da ♭7 do piano", 8: "3 oitavas",
      9: "segunda maior (9:8)", 10: "terca maior", 11: "entre 4 e ♯4 — origem do ♯11 lidio",
      12: "quinta justa", 13: "entre ♭6 e 6 — origem do ♭13", 14: "setima harmonica",
      15: "setima maior (15:8)", 16: "4 oitavas"
    };
    return map[n] || "";
  }

  W["fifth-generation"] = function () {
    var names = ["Fa", "Do", "Sol", "Re", "La", "Mi", "Si"];
    var pcs = [5, 0, 7, 2, 9, 4, 11];
    var rows = names.map(function (nm, i) {
      return [i + 1, nm, "<span class='mono'>(3/2)^" + i + "</span>",
        T.pcName(pcs[i]), i === 6 ? "<span class='bad'>tritono com Fa aparece aqui</span>" : ""];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Empilhando quintas a partir de Fa"));
    wrap.appendChild(tbl(["Passo", "Nota", "Razao acumulada", "Classe", "Observacao"], rows));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted",
      highlights: pcs.map(function (pc, i) {
        return { pc: pc, label: names[i], sub: String(i + 1), role: i === 0 ? "tonic" : "scale" };
      })
    });
    wrap.appendChild(caption("As 7 notas geradas sao exatamente as teclas brancas."));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Ouvir em quintas", function () {
      A.playSequence([53, 60, 67, 74, 81, 88, 95], 0.4);
    }));
    bar.appendChild(btn("▶ Ouvir reordenado (Do maior)", function () {
      A.playSequence(A.scaleToMidi(T.buildScale("C", "jonio"), 60), 0.28);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["max-even"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Distribuicao dos dois semitons"));
    wrap.appendChild(tbl(["Configuracao", "Passos", "Distancia entre os semitons", "Uniforme?"], [
      ["<strong>Diatonica</strong>", "2 2 1 2 2 2 1", "3 passos e 4 passos", "<span class='ok'>maxima</span>"],
      ["Semitons juntos", "1 1 2 2 2 2 2", "adjacentes", "<span class='bad'>nao</span>"],
      ["Outra qualquer", "2 1 2 1 2 2 2", "2 passos e 5 passos", "<span class='bad'>desequilibrada</span>"]
    ]));
    wrap.appendChild(caption("So a diatonica espalha os dois semitons o mais longe possivel um do outro."));
    return wrap;
  };

  W["vector-compare"] = function () {
    var ids = ["jonio", "pentatonica-maior", "menor-harmonica", "tons-inteiros", "diminuta-tom-semitom", "cromatica"];
    var rows = ids.map(function (id) {
      var b = T.buildScale("C", id);
      var v = b.vector;
      var unique = new Set(v).size === v.length;
      return [b.scale.name, b.pcs.length, "<span class='mono'>⟨" + v.join(", ") + "⟩</span>",
        v[0] === 0 ? "<span class='ok'>nao</span>" : v[0],
        v[5] === 0 ? "<span class='ok'>nao</span>" : v[5],
        unique ? "<span class='ok'>sim</span>" : "nao"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Vetores intervalares"));
    wrap.appendChild(tbl(["Escala", "Notas", "Vetor ⟨1,2,3,4,5,6⟩", "Tem semitom?", "Tem tritono?", "Todos diferentes?"], rows));
    wrap.appendChild(caption("Cada posicao do vetor conta quantos pares formam aquela distancia (1 = semitom … 6 = tritono)."));
    return wrap;
  };

  W["tritone-resolution"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "O unico tritono de Do maior e sua resolucao"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted", matchOctaves: false,
      highlights: [
        { midi: 65, label: "Fa", role: "tension" }, { midi: 71, label: "Si", role: "tension" },
        { midi: 64, label: "Mi", role: "scale" }, { midi: 72, label: "Do", role: "tonic" }
      ]
    });
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Tritono", function () { A.playChord([65, 71], 1.4); }));
    bar.appendChild(btn("▶ Resolucao", function () {
      A.playChord([65, 71], 1.0);
      setTimeout(function () { A.playChord([64, 72], 1.8); }, 900);
    }));
    wrap.appendChild(bar);
    wrap.appendChild(caption("Si sobe para Do, Fa desce para Mi. Movimento contrario por semitom."));
    return wrap;
  };

  W["tuning-compare"] = function () {
    var rows = T.JUST_INTERVALS.slice(1).map(function (j) {
      var ratio = j.ratio[0] / j.ratio[1];
      var pure = T.ratioToCents(ratio);
      var diff = j.et - pure;
      var f = 261.63 * ratio;
      var fEt = T.midiToFreq(60 + Math.round(j.et / 100));
      return [j.name, "<span class='mono'>" + j.ratio[0] + ":" + j.ratio[1] + "</span>",
        f.toFixed(2), fEt.toFixed(2), pure.toFixed(2), j.et,
        "<span class='" + (Math.abs(diff) > 10 ? "bad" : Math.abs(diff) > 4 ? "" : "ok") + "'>" +
        (diff > 0 ? "+" : "") + diff.toFixed(2) + "</span>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "O que o piano perde (base Do4 = 261,63 Hz)"));
    wrap.appendChild(tbl(["Intervalo", "Razao pura", "Hz puro", "Hz no piano", "Cents puro", "Cents piano", "Erro"], rows));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Terca maior pura (5:4)", function () {
      A.playFreq(261.63, 2); A.playFreq(261.63 * 1.25, 2);
    }));
    bar.appendChild(btn("▶ Terca maior do piano", function () { A.playChord([60, 64], 2); }));
    bar.appendChild(btn("▶ Quinta pura (3:2)", function () {
      A.playFreq(261.63, 2); A.playFreq(261.63 * 1.5, 2);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  /* --- Modulo 4 ------------------------------------------------------ */

  W["sharp-order"] = function () {
    var keys = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
    var rows = keys.map(function (k) {
      var sig = T.keySignature(k);
      var b = T.buildScale(k, "jonio");
      return [T.noteName(sig.tonic) + " maior", sig.count + (sig.count ? "♯" : ""),
        sig.accidentals.join(" ") || "—", b.names.join(" "),
        sig.count ? "novo: " + sig.accidentals[sig.accidentals.length - 1] : "—"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Cada quinta acima acrescenta um sustenido"));
    wrap.appendChild(tbl(["Tonalidade", "Armadura", "Acidentes", "Escala", "Sustenido acrescentado"], rows));
    wrap.appendChild(caption("O sustenido novo e sempre a sensivel (7o grau) da nova tonalidade."));
    return wrap;
  };

  W["key-table"] = function () {
    var order = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
    var rows = order.map(function (k) {
      var sig = T.keySignature(k);
      var b = T.buildScale(k, "jonio");
      return [T.noteName(sig.tonic), sig.count === 0 ? "—" : sig.count + (sig.type === "sustenidos" ? "♯" : "♭"),
        sig.accidentals.join(" ") || "—", T.noteName(sig.relativeMinor) + " menor", b.names.join(" ")];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "As 12 tonalidades maiores"));
    wrap.appendChild(tbl(["Tonalidade", "Armadura", "Acidentes", "Relativo menor", "Notas"], rows));
    return wrap;
  };

  W["relative-demo"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Do maior e La menor: as mesmas 7 teclas"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted",
      highlights: [
        { pc: 0, label: "Do", sub: "I", role: "tonic" }, { pc: 2, label: "Re" }, { pc: 4, label: "Mi" },
        { pc: 5, label: "Fa" }, { pc: 7, label: "Sol" },
        { pc: 9, label: "La", sub: "vi", role: "tension" }, { pc: 11, label: "Si" }
      ]
    });
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Do maior", function () { A.playSequence(A.scaleToMidi(T.buildScale("C", "jonio"), 60), 0.26); }));
    bar.appendChild(btn("▶ La menor", function () { A.playSequence(A.scaleToMidi(T.buildScale("A", "eolio"), 57), 0.26); }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["parallel-demo"] = function () {
    var node = { dataset: { tonic: "C", a: "jonio", b: "eolio" } };
    return W.compare(node);
  };

  /* --- Modulo 5 ------------------------------------------------------ */

  W["degree-table"] = function () {
    var b = T.buildScale("C", "jonio");
    var info = [
      ["Tonica", "Centro de gravidade. Ponto de repouso absoluto."],
      ["Supertonica", "Um grau acima da tonica. Base do acorde ii."],
      ["Mediante", "No meio entre tonica e dominante. Define maior/menor."],
      ["Subdominante", "Uma quinta <em>abaixo</em> da tonica. Afastamento."],
      ["Dominante", "Uma quinta acima. O polo de tensao."],
      ["Superdominante", "Um grau acima da dominante. Base do vi, relativo menor."],
      ["Sensivel", "A meio tom da tonica. Puxa para ela com forca."]
    ];
    var rows = b.notes.map(function (n, i) {
      return [i + 1, "<strong>" + T.noteName(n) + "</strong>", info[i][0], b.intervals[i] + " semitons", info[i][1]];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Grau", "Nota (Do maior)", "Nome funcional", "Distancia da tonica", "Papel"], rows));
    return wrap;
  };

  W["all-majors"] = function () {
    var order = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "As 12 escalas maiores"));
    var rows = order.map(function (k) {
      var b = T.buildScale(k, "jonio");
      var sig = T.keySignature(k);
      return { cells: [T.noteName(b.tonic), b.names.join(" "),
        sig.count === 0 ? "—" : sig.count + (sig.type === "sustenidos" ? "♯" : "♭"), ""] };
    });
    var t = tbl(["Tonica", "Notas", "Armadura", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale(order[i], "jonio"), 60), 0.24);
      }, "btn--mini"));
    });
    wrap.appendChild(t);
    return wrap;
  };

  W.fingering = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Dedilhados padrao (1 = polegar)"));
    wrap.appendChild(tbl(["Tonalidade", "Mao direita (subindo)", "Mao esquerda (subindo)", "Observacao"], [
      ["Do, Sol, Re, La, Mi", "1 2 3 1 2 3 4 5", "5 4 3 2 1 3 2 1", "padrao 3+4"],
      ["Fa", "1 2 3 4 1 2 3 4", "5 4 3 2 1 3 2 1", "MD usa 4+4 por causa do Si♭"],
      ["Si♭", "2 1 2 3 1 2 3 4", "3 2 1 4 3 2 1 2", "comeca no dedo 2"],
      ["Mi♭", "3 1 2 3 4 1 2 3", "3 2 1 4 3 2 1 2", "comeca no dedo 3"],
      ["La♭", "3 4 1 2 3 1 2 3", "3 2 1 4 3 2 1 2", "3 e 4 nas pretas"],
      ["Si", "1 2 3 1 2 3 4 5", "4 3 2 1 4 3 2 1", "polegar so em Si e Mi"],
      ["Fa♯", "2 3 4 1 2 3 1 2", "4 3 2 1 3 2 1 4", "polegar so nas brancas"]
    ]));
    wrap.appendChild(caption("Regra geral: polegar nunca em tecla preta. Isso determina onde a passagem acontece."));
    return wrap;
  };

  W["build-example"] = function () {
    var b = T.buildScale("Eb", "jonio");
    var letters = ["E", "F", "G", "A", "B", "C", "D"];
    var rows = b.notes.map(function (n, i) {
      return [i + 1, letters[i], b.intervals[i], "<strong>" + T.noteName(n) + "</strong>",
        n.acc === 0 ? "natural" : n.acc < 0 ? "bemol" : "sustenido",
        i < 6 ? (b.steps[i] === 2 ? "T" : "S") : "S (volta a tonica)"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Construindo Mi♭ maior passo a passo"));
    wrap.appendChild(tbl(["Grau", "Letra obrigatoria", "Semitons da tonica", "Nota final", "Alteracao", "Passo seguinte"], rows));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.renderScale(box, b);
    return wrap;
  };

  W.tetrachord = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Dois tetracordes identicos"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted", matchOctaves: false,
      highlights: [
        { midi: 60, label: "Do", role: "tonic" }, { midi: 62, label: "Re", role: "tonic" },
        { midi: 64, label: "Mi", role: "tonic" }, { midi: 65, label: "Fa", role: "tonic" },
        { midi: 67, label: "Sol", role: "tension" }, { midi: 69, label: "La", role: "tension" },
        { midi: 71, label: "Si", role: "tension" }, { midi: 72, label: "Do", role: "tension" }
      ]
    });
    wrap.appendChild(tbl(["Tetracorde", "Notas", "Padrao"], [
      ["Inferior", "Do Re Mi Fa", "T T S"], ["<em>ligacao</em>", "Fa → Sol", "T"],
      ["Superior", "Sol La Si Do", "T T S"]
    ]));
    return wrap;
  };

  /* --- Modulo 6 ------------------------------------------------------ */

  W["melodic-directions"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "La menor melodica: uso classico"));
    var up = A.scaleToMidi(T.buildScale("A", "menor-melodica"), 57, false);
    var natural = A.scaleToMidi(T.buildScale("A", "eolio"), 57, false);
    var down = natural.slice(0, -1).reverse();
    down.unshift(69);
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Subindo (melodica)", function () { A.playSequence(up, 0.28); }));
    bar.appendChild(btn("▶ Descendo (natural)", function () { A.playSequence(down, 0.28); }));
    bar.appendChild(btn("▶ Ciclo completo classico", function () { A.playSequence(up.concat(down.slice(1)), 0.26); }));
    wrap.appendChild(bar);
    wrap.appendChild(tbl(["Direcao", "Notas", "6o e 7o graus"], [
      ["Subindo", T.buildScale("A", "menor-melodica").names.join(" "), "Fa♯ e Sol♯ (naturais elevados)"],
      ["Descendo", T.buildScale("A", "eolio").names.slice().reverse().join(" "), "Sol e Fa (abaixados)"]
    ]));
    return wrap;
  };

  W["minors-compare"] = function () {
    var ids = ["eolio", "menor-harmonica", "menor-melodica"];
    var rows = ids.map(function (id) {
      var b = T.buildScale("A", id);
      return [b.scale.name, b.names.join(" "), b.degrees.join(" "), b.steps.join("-"),
        id === "eolio" ? "<span class='bad'>nao</span>" : "<span class='ok'>sim</span>",
        b.steps.indexOf(3) >= 0 ? "<span class='bad'>sim</span>" : "<span class='ok'>nao</span>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "As tres menores de La, lado a lado"));
    wrap.appendChild(tbl(["Escala", "Notas", "Graus", "Passos", "Tem sensivel?", "Tem 2a aumentada?"], rows));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 57, labels: "highlighted",
      highlights: [
        { pc: 9, label: "La", role: "tonic" }, { pc: 11, label: "Si" }, { pc: 0, label: "Do" },
        { pc: 2, label: "Re" }, { pc: 4, label: "Mi" },
        { pc: 5, label: "Fa", sub: "♭6", role: "only-a" }, { pc: 6, label: "Fa♯", sub: "6", role: "only-b" },
        { pc: 7, label: "Sol", sub: "♭7", role: "only-a" }, { pc: 8, label: "Sol♯", sub: "7", role: "only-b" }
      ]
    });
    wrap.appendChild(caption("Notas fixas em destaque neutro. Em vermelho os graus abaixados (natural), em azul os elevados (harmonica/melodica)."));
    return wrap;
  };

  /* --- Modulo 7 ------------------------------------------------------ */

  var MODE_IDS = ["jonio", "dorico", "frigio", "lidio", "mixolidio", "eolio", "locrio"];
  var MODE_ROOTS = ["C", "D", "E", "F", "G", "A", "B"];

  W["modes-rotation"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Os 7 modos como rotacoes das teclas brancas"));
    var rows = MODE_IDS.map(function (id, i) {
      var b = T.buildScale(MODE_ROOTS[i], id);
      return { cells: [i + 1, "<strong>" + b.scale.name + "</strong>", T.noteName(b.tonic),
        b.names.join(" "), "<span class='mono'>" + b.steps.join("-") + "</span>", ""] };
    });
    var t = tbl(["#", "Modo", "Tonica", "Notas (so brancas)", "Passos", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        var b = T.buildScale(MODE_ROOTS[i], MODE_IDS[i]);
        A.playSequence(A.scaleToMidi(b, 60), 0.26);
      }, "btn--mini"));
    });
    wrap.appendChild(t);
    return wrap;
  };

  W.brightness = function () {
    var order = ["lidio", "jonio", "mixolidio", "dorico", "eolio", "frigio", "locrio"];
    var changed = ["—", "♯4 → 4", "7 → ♭7", "3 → ♭3", "6 → ♭6", "2 → ♭2", "5 → ♭5"];
    var rows = order.map(function (id, i) {
      var b = T.buildScale("C", id);
      return { cells: ["<strong>" + (i + 1) + "</strong>", b.scale.name, b.degrees.join(" "),
        b.names.join(" "), changed[i], ""] };
    });
    var t = tbl(["Ordem", "Modo", "Graus", "Notas em Do", "Nota que desceu", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale("C", order[i]), 60), 0.26);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Do mais brilhante ao mais escuro (todos na tonica Do)"));
    wrap.appendChild(t);
    wrap.appendChild(caption("A cada linha, exatamente uma nota desce meio tom. Essa ordem e o circulo de quintas ao contrario."));
    return wrap;
  };

  W["modes-table"] = function () {
    var info = {
      jonio: ["Maior", "—", "nenhuma (e a referencia)", "Imaj7", "pop, classico"],
      dorico: ["Menor", "6a maior", "a 6 natural (Si em Re dorico)", "im7", "funk, jazz modal, MPB"],
      frigio: ["Menor", "2a menor", "a ♭2 (Fa em Mi frigio)", "im7", "flamenco, metal"],
      lidio: ["Maior", "4a aumentada", "o ♯4 (Si em Fa lidio)", "maj7♯11", "trilhas, jazz"],
      mixolidio: ["Maior", "7a menor", "a ♭7 (Fa em Sol mixolidio)", "7", "blues, rock, funk"],
      eolio: ["Menor", "—", "a ♭6 (Fa em La eolio)", "im7", "rock, pop, baladas"],
      locrio: ["Diminuto", "5a diminuta", "a ♭5 (Fa em Si locrio)", "m7♭5", "jazz, passagem"]
    };
    var rows = MODE_IDS.map(function (id, i) {
      var b = T.buildScale(MODE_ROOTS[i], id);
      var f = info[id];
      return [b.scale.name, f[0], f[1], "<strong>" + f[2] + "</strong>", f[3], f[4]];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Modo", "Familia", "Diferenca", "Nota caracteristica", "Acorde", "Onde aparece"], rows));
    return wrap;
  };

  W["parallel-modes"] = function () {
    var rows = MODE_IDS.map(function (id) {
      var b = T.buildScale("D", id);
      var ref = id === "jonio" || id === "lidio" || id === "mixolidio" ? "Re maior" : "Re menor";
      return { cells: [b.scale.name, b.names.join(" "), b.degrees.join(" "), "vs " + ref, ""] };
    });
    var t = tbl(["Modo", "Notas em Re", "Graus", "Comparado a", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale("D", MODE_IDS[i]), 62), 0.26);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Todos os 7 modos com a MESMA tonica (Re)"));
    wrap.appendChild(t);
    wrap.appendChild(caption("Aqui a diferenca entre os modos fica evidente — e assim que se deve pensar ao tocar."));
    return wrap;
  };

  W["modal-vamps"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Vamps que estabelecem cada modo"));
    var vamps = [
      { name: "Dorico (Re)", items: [{ label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" }] },
      { name: "Frigio (Mi)", items: [{ label: "Em", root: "E", type: "min" }, { label: "F", root: "F", type: "maj" }] },
      { name: "Lidio (Fa)", items: [{ label: "Fmaj7", root: "F", type: "maj7" }, { label: "G", root: "G", type: "maj" }] },
      { name: "Mixolidio (Sol)", items: [{ label: "G7", root: "G", type: "7" }, { label: "F", root: "F", type: "maj" }] },
      { name: "Eolio (La)", items: [{ label: "Am", root: "A", type: "min" }, { label: "G", root: "G", type: "maj" }, { label: "F", root: "F", type: "maj" }] }
    ];
    vamps.forEach(function (v) { wrap.appendChild(progression(v.items, { title: v.name })); });
    return wrap;
  };

  W["mode-detail"] = function (node) {
    var id = node.dataset.mode;
    var i = MODE_IDS.indexOf(id);
    var root = i >= 0 ? MODE_ROOTS[i] : "C";
    var wrap = h("div", "widget-card widget-card--mode");
    wrap.appendChild(scaleBlock(root, id, {}));
    var built = T.buildScale(root, id);
    var chords = T.harmonize(built, 4);
    if (chords.length) {
      wrap.appendChild(h("p", "mono muted", "Campo harmonico: " +
        chords.map(function (c) { return c.symbol; }).join(" · ")));
    }
    return wrap;
  };

  /* --- Modulo 8 ------------------------------------------------------ */

  W.triads = function () {
    var types = ["maj", "min", "dim", "aug"];
    var wrap = h("div", "widget-card");
    var grid = h("div", "chord-grid");
    types.forEach(function (t2) {
      var c = T.buildChord("C", t2);
      var card = h("div", "chord-card");
      card.appendChild(h("h5", null, c.symbol + " — " + c.chord.name));
      var box = h("div", "kb-box kb-box--small");
      card.appendChild(box);
      KB.renderChord(box, c, { octaves: 1, whiteWidth: 30, whiteHeight: 110 });
      card.appendChild(h("p", "mono", c.names.join(" ") + "  ·  " + c.chord.formula + "  ·  " + c.chord.intervals.join("-")));
      card.appendChild(btn("▶", function () { A.playChord(chordMidis("C", t2, 60), 1.8, 0.01); }, "btn--mini"));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  W["why-qualities"] = function () {
    var b = T.buildScale("C", "jonio");
    var chords = T.harmonize(b, 3);
    var rows = chords.map(function (c) {
      var i1 = T.mod(c.pcs[1] - c.pcs[0], 12);
      var i2 = T.mod(c.pcs[2] - c.pcs[1], 12);
      return [c.roman, c.names.join("-"), i1 + " semitons (" + (i1 === 4 ? "3M" : "3m") + ")",
        i2 + " semitons (" + (i2 === 4 ? "3M" : "3m") + ")",
        (i1 + i2) + " semitons", "<strong>" + (c.quality ? c.quality.name : "?") + "</strong>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "A qualidade sai das duas tercas empilhadas"));
    wrap.appendChild(tbl(["Grau", "Notas", "1a terca", "2a terca", "Quinta", "Resultado"], rows));
    return wrap;
  };

  W.functions = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Funcao", "Acordes", "Grau em comum", "Sensacao", "Vai para"], [
      ["<strong>Tonica</strong>", "I, vi, iii", "1o grau", "repouso", "qualquer lugar"],
      ["<strong>Subdominante</strong>", "IV, ii", "4o grau", "afastamento", "dominante ou tonica"],
      ["<strong>Dominante</strong>", "V, vii°", "7o grau + tritono", "tensao", "tonica (quase sempre)"]
    ]));
    wrap.appendChild(progression([
      { label: "C", roman: "I — T", root: "C", type: "maj" },
      { label: "F", roman: "IV — S", root: "F", type: "maj" },
      { label: "G7", roman: "V7 — D", root: "G", type: "7" },
      { label: "C", roman: "I — T", root: "C", type: "maj" }
    ], { title: "O ciclo funcional completo" }));
    return wrap;
  };

  W.inversions = function () {
    var wrap = h("div", "widget-card");
    var grid = h("div", "chord-grid");
    [0, 1, 2].forEach(function (inv) {
      var c = T.buildChord("C", "maj", inv);
      var card = h("div", "chord-card");
      card.appendChild(h("h5", null, ["Fundamental (C)", "1a inversao (C/E)", "2a inversao (C/G)"][inv]));
      var box = h("div", "kb-box kb-box--small");
      card.appendChild(box);
      KB.renderChord(box, c, { octaves: 2, whiteWidth: 26, whiteHeight: 100 });
      card.appendChild(h("p", "mono", c.names.join(" ")));
      card.appendChild(btn("▶", function () { A.playChord(chordMidis("C", "maj", 60).map(function (m, k) {
        var arr = chordMidis("C", "maj", 60);
        for (var z = 0; z < inv; z++) arr.push(arr.shift() + 12);
        return arr[k];
      }), 1.8, 0.01); }, "btn--mini"));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  W["voice-leading"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Movimento", "Exemplo (G7 → C)", "Regra"], [
      ["Nota comum", "Sol fica Sol", "nao mova o que pode ficar parado"],
      ["Sensivel sobe", "Si → Do", "meio tom para cima, sempre"],
      ["Setima desce", "Fa → Mi", "meio tom para baixo, sempre"],
      ["Baixo salta", "Sol → Do", "so o baixo tem licenca para saltar"]
    ]));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ G7 → C (boa conducao)", function () {
      A.playChord([55, 65, 71, 74], 1.2);
      setTimeout(function () { A.playChord([48, 64, 72, 76], 2); }, 1000);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["smooth-progression"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "C", roman: "I", midis: [48, 64, 67, 72] },
      { label: "F/C", roman: "IV⁶⁴", midis: [48, 65, 69, 72] },
      { label: "G/B", roman: "V⁶", midis: [47, 62, 67, 71] },
      { label: "C", roman: "I", midis: [48, 64, 67, 72] }
    ], { title: "I – IV – V – I com movimento minimo", note: "nenhuma voz anda mais que um tom" }));
    return wrap;
  };

  /* --- Modulo 9 ------------------------------------------------------ */

  W.sevenths = function () {
    var types = ["maj7", "7", "m7", "mMaj7", "m7b5", "dim7", "aug7"];
    var wrap = h("div", "widget-card");
    var grid = h("div", "chord-grid");
    types.forEach(function (t2) {
      var c = T.buildChord("C", t2);
      var card = h("div", "chord-card");
      card.appendChild(h("h5", null, c.symbol));
      var box = h("div", "kb-box kb-box--small");
      card.appendChild(box);
      KB.renderChord(box, c, { octaves: 1, whiteWidth: 30, whiteHeight: 110 });
      card.appendChild(h("p", "mono", c.names.join(" ") + " · " + c.chord.formula));
      card.appendChild(btn("▶", function () { A.playChord(chordMidis("C", t2, 60), 2, 0.01); }, "btn--mini"));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  W["tritone-engine"] = function () {
    var b = T.buildScale("C", "jonio");
    var chords = T.harmonize(b, 4);
    var rows = chords.map(function (c) {
      var hasTritone = false;
      for (var i = 0; i < c.pcs.length; i++)
        for (var j = i + 1; j < c.pcs.length; j++)
          if (T.mod(c.pcs[j] - c.pcs[i], 12) === 6) hasTritone = true;
      return [c.roman, c.symbol, c.names.join(" "),
        hasTritone ? "<span class='bad'><strong>SIM</strong></span>" : "nao",
        c.quality && c.quality.id === "7" ? "<span class='ok'>dominante</span>" : "—"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Quais acordes de Do maior contem o tritono Fa–Si"));
    wrap.appendChild(tbl(["Grau", "Cifra", "Notas", "Contem tritono?", "Funcao dominante?"], rows));
    wrap.appendChild(caption("Apenas V7 e vii°7 contem o tritono — e por isso apenas eles funcionam como dominante."));
    return wrap;
  };

  W["two-five-one"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "Dm7", roman: "ii7 — Subdominante", root: "D", type: "m7" },
      { label: "G7", roman: "V7 — Dominante", root: "G", type: "7" },
      { label: "Cmaj7", roman: "Imaj7 — Tonica", root: "C", type: "maj7" }
    ], { title: "ii – V – I em Do maior" }));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 55, labels: "highlighted", matchOctaves: false,
      highlights: [
        { midi: 62, label: "Re", role: "scale" }, { midi: 65, label: "Fa", role: "scale" },
        { midi: 69, label: "La", role: "scale" }, { midi: 72, label: "Do", role: "scale" }
      ]
    });
    wrap.appendChild(caption("Dm7 em posicao fechada. Nas proximas trocas, apenas 1 ou 2 notas se movem."));
    return wrap;
  };

  W["two-five-voice-leading"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Voz", "Dm7", "G7", "Cmaj7", "Movimento total"], [
      ["superior", "Do", "Si", "Do", "1 semitom para baixo e volta"],
      ["", "La", "Sol", "Sol", "1 tom para baixo"],
      ["", "Fa", "Fa", "Mi", "parada, depois 1 semitom"],
      ["baixo", "Re", "Sol", "Do", "quintas descendentes"]
    ]));
    wrap.appendChild(progression([
      { label: "Dm7", midis: [50, 65, 69, 72] },
      { label: "G7", midis: [43, 65, 67, 71] },
      { label: "Cmaj7", midis: [48, 64, 67, 71] }
    ], { title: "Ouvir com conducao suave" }));
    return wrap;
  };

  W["minor-two-five"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "Bm7♭5", roman: "iiø7", root: "B", type: "m7b5" },
      { label: "E7♭9", roman: "V7♭9", root: "E", type: "7b9" },
      { label: "Am7", roman: "im7", root: "A", type: "m7" }
    ], { title: "ii-V-i em La menor" }));
    wrap.appendChild(caption("O ii vem da menor natural (quinta diminuta); o V vem da menor harmonica (sensivel Sol♯)."));
    return wrap;
  };

  W["two-five-cycle"] = function () {
    var keys = ["C", "F", "Bb", "Eb", "Ab", "Db", "F#", "B", "E", "A", "D", "G"];
    var rows = keys.map(function (k) {
      var b = T.buildScale(k, "jonio");
      return { cells: [T.noteName(b.tonic), T.noteName(b.notes[1]) + "m7",
        T.noteName(b.notes[4]) + "7", T.noteName(b.notes[0]) + "maj7", ""] };
    });
    var t = tbl(["Tonalidade", "ii7", "V7", "Imaj7", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        var b = T.buildScale(keys[i], "jonio");
        var seq = [
          chordMidis(T.noteName(b.notes[1]), "m7", 48),
          chordMidis(T.noteName(b.notes[4]), "7", 48),
          chordMidis(T.noteName(b.notes[0]), "maj7", 48)
        ];
        seq.forEach(function (m, k2) { setTimeout(function () { A.playChord(m, 1.4, 0.01); }, k2 * 800); });
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "ii-V-I nas 12 tonalidades (descendo por quintas)"));
    wrap.appendChild(t);
    return wrap;
  };

  /* --- Modulo 10 ----------------------------------------------------- */

  W["penta-generation"] = function () {
    var names = ["Do", "Sol", "Re", "La", "Mi"];
    var pcs = [0, 7, 2, 9, 4];
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Passo", "Nota", "Ordenada"], [
      ["1", "Do", "Do (1)"], ["2", "Sol", "Re (2)"], ["3", "Re", "Mi (3)"],
      ["4", "La", "Sol (5)"], ["5", "Mi", "La (6)"]
    ]));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 60, labels: "highlighted",
      highlights: pcs.map(function (pc, i) {
        return { pc: pc, label: names[i], sub: String(i + 1), role: i === 0 ? "tonic" : "scale" };
      })
    });
    return wrap;
  };

  W["penta-vector"] = function () {
    var rows = [["pentatonica-maior"], ["jonio"], ["blues-menor"]].map(function (x) {
      var b = T.buildScale("C", x[0]);
      return [b.scale.name, "<span class='mono'>⟨" + b.vector.join(", ") + "⟩</span>",
        b.vector[0] === 0 ? "<span class='ok'>0 — nenhum</span>" : "<span class='bad'>" + b.vector[0] + "</span>",
        b.vector[5] === 0 ? "<span class='ok'>0 — nenhum</span>" : "<span class='bad'>" + b.vector[5] + "</span>"];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Escala", "Vetor intervalar", "Semitons (2m)", "Tritonos"], rows));
    return wrap;
  };

  W["penta-modes"] = function () {
    var ids = ["pentatonica-maior", "pentatonica-suspensa", "man-gong", "ritusen", "pentatonica-menor"];
    var roots = ["C", "D", "E", "G", "A"];
    var rows = ids.map(function (id, i) {
      var b = T.buildScale(roots[i], id);
      return { cells: [i + 1, b.scale.name, T.noteName(b.tonic), b.names.join(" "), b.degrees.join(" "), ""] };
    });
    var t = tbl(["#", "Modo", "Tonica", "Notas", "Graus", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale(roots[i], ids[i]), 60), 0.26);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Os 5 modos pentatonicos (mesmas teclas)"));
    wrap.appendChild(t);
    return wrap;
  };

  W["penta-fingering"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Tonalidade", "Mao direita", "Mao esquerda"], [
      ["Do pentatonica maior", "1 2 3 1 2 (Do Re Mi Sol La)", "5 4 3 2 1"],
      ["La pentatonica menor", "1 2 3 1 2 (La Do Re Mi Sol)", "5 4 3 2 1"],
      ["Fa♯ pentatonica maior (pretas)", "2 3 4 2 3", "4 3 2 4 3"]
    ]));
    return wrap;
  };

  W["penta-patterns"] = function () {
    var base = [60, 62, 64, 67, 69, 72];
    var pats = [
      { name: "Direto", seq: [0, 1, 2, 3, 4, 5] },
      { name: "Terceiras", seq: [0, 2, 1, 3, 2, 4, 3, 5] },
      { name: "Grupos de 4", seq: [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5] },
      { name: "Descendente", seq: [5, 4, 3, 2, 1, 0] },
      { name: "Saltos", seq: [0, 3, 1, 4, 2, 5] }
    ];
    var wrap = h("div", "widget-card");
    var row = h("div", "prog-row");
    pats.forEach(function (p) {
      var b = h("button", "chip", p.name);
      b.type = "button";
      b.addEventListener("click", function () {
        A.playSequence(p.seq.map(function (i) { return base[i]; }), 0.2);
      });
      row.appendChild(b);
    });
    wrap.appendChild(h("h4", null, "Padroes de improviso (Do pentatonica maior)"));
    wrap.appendChild(row);
    return wrap;
  };

  /* --- Modulo 11 ----------------------------------------------------- */

  W["blue-notes"] = function () {
    var rows = [
      ["7o harmonico", "7:4", T.ratioToCents(7 / 4).toFixed(1), "1000 (♭7)", (T.ratioToCents(7 / 4) - 1000).toFixed(1), "o piano esta 31¢ acima"],
      ["Terca neutra", "11:9", T.ratioToCents(11 / 9).toFixed(1), "300 (♭3) / 400 (3)", "—", "fica no meio das duas teclas"],
      ["11o harmonico", "11:8", T.ratioToCents(11 / 8).toFixed(1), "500 (4) / 600 (♭5)", "—", "origem da ♭5 de blues"]
    ];
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "As alturas que o piano nao alcanca"));
    wrap.appendChild(tbl(["Altura", "Razao", "Cents", "Tecla mais proxima (cents)", "Erro", "Consequencia"], rows));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ ♭7 do piano", function () { A.playFreq(261.63, 1.5); A.playFreq(261.63 * Math.pow(2, 10 / 12), 1.5); }));
    bar.appendChild(btn("▶ 7o harmonico puro", function () { A.playFreq(261.63, 1.5); A.playFreq(261.63 * 7 / 4, 1.5); }));
    wrap.appendChild(bar);
    wrap.appendChild(caption("Alterne os dois botoes: a versao pura soa mais 'doce e triste'. E o som que o blues persegue."));
    return wrap;
  };

  W["blues-form"] = function () {
    var bars = ["I7", "I7", "I7", "I7", "IV7", "IV7", "I7", "I7", "V7", "IV7", "I7", "V7"];
    var inC = ["C7", "C7", "C7", "C7", "F7", "F7", "C7", "C7", "G7", "F7", "C7", "G7"];
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Blues de 12 compassos em Do"));
    var grid = h("div", "bars-grid");
    bars.forEach(function (b, i) {
      var cell = h("button", "bar-cell");
      cell.type = "button";
      cell.innerHTML = '<span class="bar-num">' + (i + 1) + '</span><span class="bar-rom">' + b +
        '</span><span class="bar-chord">' + inC[i] + "</span>";
      cell.addEventListener("click", function () {
        A.playChord(chordMidis(inC[i].replace("7", ""), "7", 48), 1.6, 0.01);
      });
      grid.appendChild(cell);
    });
    wrap.appendChild(grid);
    wrap.appendChild(btn("▶ Tocar os 12 compassos", function () {
      inC.forEach(function (c, i) {
        setTimeout(function () { A.playChord(chordMidis(c.replace("7", ""), "7", 48), 1.5, 0.01); }, i * 900);
      });
    }));
    wrap.appendChild(caption("Estrutura AAB: 4 compassos de I, 2 de IV, 2 de I, e o turnaround nos ultimos 4."));
    return wrap;
  };

  W["blues-variants"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Variacao", "Mudanca", "Onde se usa"], [
      ["Quick change", "compasso 2 vira IV7", "blues tradicional, Chicago"],
      ["Jazz blues", "compassos 8-10 viram ii-V", "bebop"],
      ["Blues menor", "i, iv menores e V7", "blues lento, soul"],
      ["Bird blues", "reharmonizacao com ii-V encadeados", "Charlie Parker (Blues for Alice)"],
      ["Turnaround", "compasso 12 = V7 (volta ao inicio)", "sempre, quando repete"]
    ]));
    return wrap;
  };

  W["blues-bass"] = function () {
    var wrap = h("div", "widget-card");
    var pats = [
      { name: "Shuffle (1-3-5-6)", seq: [48, 52, 55, 57, 55, 52], gap: 0.22 },
      { name: "Walking bass", seq: [48, 50, 52, 53, 55, 53, 52, 50], gap: 0.28 },
      { name: "Oitavas", seq: [48, 60, 48, 60, 48, 60], gap: 0.24 }
    ];
    var row = h("div", "prog-row");
    pats.forEach(function (p) {
      var b = h("button", "chip", p.name);
      b.type = "button";
      b.addEventListener("click", function () { A.playSequence(p.seq, p.gap); });
      row.appendChild(b);
    });
    wrap.appendChild(h("h4", null, "Levadas de mao esquerda em Do"));
    wrap.appendChild(row);
    return wrap;
  };

  /* --- Modulo 12 ----------------------------------------------------- */

  W["rock-scales"] = function () {
    var list = [
      ["pentatonica-menor", "★★★★★", "riffs e solos, base absoluta"],
      ["blues-menor", "★★★★★", "solos com ♭5 de passagem"],
      ["mixolidio", "★★★★☆", "riffs maiores com ♭7"],
      ["eolio", "★★★★☆", "baladas e rock menor"],
      ["dorico", "★★★☆☆", "rock com cor mais aberta"],
      ["jonio", "★★★☆☆", "pop-rock, refroes"],
      ["frigio", "★★☆☆☆", "metal, tensao"],
      ["menor-harmonica", "★★☆☆☆", "metal neoclassico"],
      ["frigio-dominante", "★☆☆☆☆", "metal exotico"]
    ];
    var rows = list.map(function (x) {
      var b = T.buildScale("E", x[0]);
      return { cells: [b.scale.name, x[1], b.names.join(" "), x[2], ""] };
    });
    var t = tbl(["Escala", "Uso no rock", "Notas em Mi", "Contexto", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale("E", list[i][0]), 52), 0.24);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(t);
    return wrap;
  };

  W["rock-friction"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Harmonia maior + melodia menor"));
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 52, labels: "highlighted",
      highlights: [
        { pc: 4, label: "Mi", role: "tonic" },
        { pc: 8, label: "Sol♯", sub: "3 (harmonia)", role: "only-b" },
        { pc: 7, label: "Sol", sub: "♭3 (melodia)", role: "only-a" },
        { pc: 11, label: "Si", role: "scale" }, { pc: 2, label: "Re", sub: "♭7", role: "scale" },
        { pc: 9, label: "La", role: "scale" }
      ]
    });
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ E maior + solo com Sol natural", function () {
      A.playChord([40, 52, 56, 59], 2.2);
      setTimeout(function () { A.playSequence([64, 67, 69, 71, 67], 0.2); }, 300);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["power-chords"] = function () {
    var wrap = h("div", "widget-card");
    var grid = h("div", "chord-grid");
    [["5", "E5 — sem terca"], ["maj", "E — com terca maior"], ["min", "Em — com terca menor"]]
      .forEach(function (x) {
        var c = T.buildChord("E", x[0]);
        var card = h("div", "chord-card");
        card.appendChild(h("h5", null, x[1]));
        var box = h("div", "kb-box kb-box--small");
        card.appendChild(box);
        KB.renderChord(box, c, { octaves: 1, startMidi: 52, whiteWidth: 30, whiteHeight: 110 });
        card.appendChild(h("p", "mono", c.names.join(" ")));
        card.appendChild(btn("▶", function () { A.playChord(chordMidis("E", x[0], 40), 2, 0.01); }, "btn--mini"));
        grid.appendChild(card);
      });
    wrap.appendChild(grid);
    wrap.appendChild(caption("O power chord (1-5) e ambiguo: serve tanto para harmonia maior quanto menor."));
    return wrap;
  };

  W["rock-progressions"] = function () {
    var wrap = h("div", "widget-card");
    [
      { name: "i – ♭VII – ♭VI – ♭VII (menor natural)", items: [
        { label: "Am", root: "A", type: "min" }, { label: "G", root: "G", type: "maj" },
        { label: "F", root: "F", type: "maj" }, { label: "G", root: "G", type: "maj" }] },
      { name: "I – ♭VII – IV (mixolidio)", items: [
        { label: "D", root: "D", type: "maj" }, { label: "C", root: "C", type: "maj" },
        { label: "G", root: "G", type: "maj" }] },
      { name: "I – IV – V (blues-rock)", items: [
        { label: "A", root: "A", type: "maj" }, { label: "D", root: "D", type: "maj" },
        { label: "E", root: "E", type: "maj" }] },
      { name: "i – ♭III – ♭VII – iv", items: [
        { label: "Em", root: "E", type: "min" }, { label: "G", root: "G", type: "maj" },
        { label: "D", root: "D", type: "maj" }, { label: "Am", root: "A", type: "min" }] }
    ].forEach(function (p) { wrap.appendChild(progression(p.items, { title: p.name })); });
    return wrap;
  };

  W["flat-seven"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Cadencia", "Exemplo em La menor", "Movimento do baixo", "Sensacao"], [
      ["V7 → i (tonal)", "E7 → Am", "quinta descendente, com sensivel Sol♯", "resolucao forte, conclusiva"],
      ["♭VII → i (modal)", "G → Am", "tom ascendente, sem sensivel", "aberta, sem submissao"]
    ]));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ E7 → Am", function () {
      A.playChord(chordMidis("E", "7", 40), 1.3);
      setTimeout(function () { A.playChord(chordMidis("A", "min", 45), 2); }, 1100);
    }));
    bar.appendChild(btn("▶ G → Am", function () {
      A.playChord(chordMidis("G", "maj", 43), 1.3);
      setTimeout(function () { A.playChord(chordMidis("A", "min", 45), 2); }, 1100);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  /* --- Modulo 13 ----------------------------------------------------- */

  W["pop-progressions"] = function () {
    var wrap = h("div", "widget-card");
    [
      { name: "I – V – vi – IV", items: [
        { label: "C", roman: "I", root: "C", type: "maj" }, { label: "G", roman: "V", root: "G", type: "maj" },
        { label: "Am", roman: "vi", root: "A", type: "min" }, { label: "F", roman: "IV", root: "F", type: "maj" }] },
      { name: "vi – IV – I – V", items: [
        { label: "Am", roman: "vi", root: "A", type: "min" }, { label: "F", roman: "IV", root: "F", type: "maj" },
        { label: "C", roman: "I", root: "C", type: "maj" }, { label: "G", roman: "V", root: "G", type: "maj" }] },
      { name: "I – vi – IV – V (anos 50)", items: [
        { label: "C", roman: "I", root: "C", type: "maj" }, { label: "Am", roman: "vi", root: "A", type: "min" },
        { label: "F", roman: "IV", root: "F", type: "maj" }, { label: "G", roman: "V", root: "G", type: "maj" }] },
      { name: "ii – V – I (jazz/pop)", items: [
        { label: "Dm7", roman: "ii", root: "D", type: "m7" }, { label: "G7", roman: "V", root: "G", type: "7" },
        { label: "Cmaj7", roman: "I", root: "C", type: "maj7" }] },
      { name: "I – IV – vi – V", items: [
        { label: "C", roman: "I", root: "C", type: "maj" }, { label: "F", roman: "IV", root: "F", type: "maj" },
        { label: "Am", roman: "vi", root: "A", type: "min" }, { label: "G", roman: "V", root: "G", type: "maj" }] },
      { name: "vi – V – IV – V", items: [
        { label: "Am", roman: "vi", root: "A", type: "min" }, { label: "G", roman: "V", root: "G", type: "maj" },
        { label: "F", roman: "IV", root: "F", type: "maj" }, { label: "G", roman: "V", root: "G", type: "maj" }] }
    ].forEach(function (p) { wrap.appendChild(progression(p.items, { title: p.name })); });
    return wrap;
  };

  W["four-chords"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Rotacao", "Acordes em Do", "Primeiro acorde", "Humor"], [
      ["I – V – vi – IV", "C G Am F", "maior", "otimista, expansivo"],
      ["V – vi – IV – I", "G Am F C", "maior", "suspenso, chega no fim"],
      ["vi – IV – I – V", "Am F C G", "menor", "melancolico, nostalgico"],
      ["IV – I – V – vi", "F C G Am", "maior", "flutuante"]
    ]));
    wrap.appendChild(caption("Os mesmos 4 acordes. So a ordem muda — e com ela, o humor inteiro."));
    return wrap;
  };

  W["descending-bass"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "C", roman: "I", midis: [48, 64, 67, 72] },
      { label: "G/B", roman: "V⁶", midis: [47, 62, 67, 71] },
      { label: "Am", roman: "vi", midis: [45, 64, 69, 72] },
      { label: "Am/G", roman: "vi⁶⁴", midis: [43, 64, 69, 72] },
      { label: "F", roman: "IV", midis: [41, 65, 69, 72] }
    ], { title: "Linha de baixo descendente: Do–Si–La–Sol–Fa" }));
    return wrap;
  };

  W["modal-borrow"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "C", roman: "I", root: "C", type: "maj" },
      { label: "F", roman: "IV", root: "F", type: "maj" },
      { label: "Fm", roman: "iv (emprestado)", root: "F", type: "min" },
      { label: "C", roman: "I", root: "C", type: "maj" }
    ], { title: "IV → iv menor: o efeito agridoce", note: "La♭ desce para Sol" }));
    wrap.appendChild(progression([
      { label: "C", roman: "I", root: "C", type: "maj" },
      { label: "A♭", roman: "♭VI", root: "Ab", type: "maj" },
      { label: "B♭", roman: "♭VII", root: "Bb", type: "maj" },
      { label: "C", roman: "I", root: "C", type: "maj" }
    ], { title: "♭VI – ♭VII – I: o som epico" }));
    return wrap;
  };

  W["pop-voicings"] = function () {
    var wrap = h("div", "widget-card");
    var voicings = [
      { name: "C — fechado (datado)", midis: [48, 60, 64, 67] },
      { name: "C — aberto (moderno)", midis: [36, 55, 64, 72] },
      { name: "Cadd9", midis: [36, 55, 62, 64, 67] },
      { name: "Cmaj7 sem fundamental", midis: [36, 64, 67, 71] },
      { name: "Fmaj7/C — quartas", midis: [36, 60, 65, 69, 72] }
    ];
    var row = h("div", "prog-row");
    voicings.forEach(function (v) {
      var b = h("button", "chip", v.name);
      b.type = "button";
      b.addEventListener("click", function () { A.playChord(v.midis, 2.2, 0.012); });
      row.appendChild(b);
    });
    wrap.appendChild(h("h4", null, "Compare os voicings"));
    wrap.appendChild(row);
    return wrap;
  };

  W["sus-chords"] = function () {
    var wrap = h("div", "widget-card");
    var grid = h("div", "chord-grid");
    ["maj", "sus2", "sus4", "add9"].forEach(function (t2) {
      var c = T.buildChord("C", t2);
      var card = h("div", "chord-card");
      card.appendChild(h("h5", null, c.symbol || "C"));
      var box = h("div", "kb-box kb-box--small");
      card.appendChild(box);
      KB.renderChord(box, c, { octaves: 2, whiteWidth: 26, whiteHeight: 100 });
      card.appendChild(h("p", "mono", c.names.join(" ") + " · " + c.chord.formula));
      card.appendChild(btn("▶", function () { A.playChord(chordMidis("C", t2, 48), 2, 0.01); }, "btn--mini"));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  };

  W["slash-chords"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "C", midis: [48, 64, 67, 72] },
      { label: "G/B", midis: [47, 62, 67, 71] },
      { label: "Am", midis: [45, 64, 69, 72] },
      { label: "F", midis: [41, 65, 69, 72] }
    ], { title: "Baixo por grau conjunto" }));
    wrap.appendChild(progression([
      { label: "C", midis: [43, 60, 64, 67] },
      { label: "F/G", midis: [43, 60, 65, 69] },
      { label: "G", midis: [43, 62, 67, 71] },
      { label: "C/G", midis: [43, 60, 64, 67] }
    ], { title: "Pedal de Sol no baixo", note: "o baixo nao se move; a harmonia muda por cima" }));
    return wrap;
  };

  W["pop-patterns"] = function () {
    var wrap = h("div", "widget-card");
    var pats = [
      { name: "Blocos (semibreves)", seq: null, chords: [[48, 60, 64, 67]], gap: 0 },
      { name: "Arpejo ascendente", seq: [48, 60, 64, 67, 72, 67, 64, 60], gap: 0.22 },
      { name: "Baixo + acorde", seq: [36, 60, 64, 67, 43, 60, 64, 67], gap: 0.26 },
      { name: "Colcheias sincopadas", seq: [48, 64, 67, 64, 72, 64, 67, 64], gap: 0.18 }
    ];
    var row = h("div", "prog-row");
    pats.forEach(function (p) {
      var b = h("button", "chip", p.name);
      b.type = "button";
      b.addEventListener("click", function () {
        if (p.seq) A.playSequence(p.seq, p.gap);
        else A.playChord(p.chords[0], 2.4, 0.01);
      });
      row.appendChild(b);
    });
    wrap.appendChild(h("h4", null, "Padroes de acompanhamento (acorde de Do)"));
    wrap.appendChild(row);
    return wrap;
  };

  /* --- Modulo 14 ----------------------------------------------------- */

  W["symmetric-divisions"] = function () {
    var rows = [
      ["2", "6", "tons inteiros", "2", "6 notas"],
      ["3", "4", "diminuta", "3", "8 notas"],
      ["4", "3", "aumentada", "4", "6 notas"],
      ["6", "2", "tritono", "6", "2 notas"]
    ];
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Passo (semitons)", "Divisoes de 12", "Escala resultante", "Versoes distintas", "Tamanho"], rows));
    wrap.appendChild(caption("O numero de versoes distintas e igual ao passo: se repete a cada N semitons, ha N transposicoes possiveis."));
    return wrap;
  };

  W["dim-vs-alt"] = function () {
    var d = T.buildScale("C", "diminuta-semitom-tom");
    var a = T.buildScale("C", "alterada");
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Diminuta (♭9) × Alterada — as duas escalas de dominante"));
    wrap.appendChild(tbl(["Escala", "Notas", "Tensoes", "Quinta", "Usar sobre"], [
      [d.scale.name, d.names.join(" "), "♭9 ♯9 ♯11 13", "<span class='ok'>justa</span>", "7♭9, 7♯9, 7♯11"],
      [a.scale.name, a.names.join(" "), "♭9 ♯9 ♯11 ♭13", "<span class='bad'>ausente</span>", "7alt"]
    ]));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ C7♭9 + diminuta", function () {
      A.playChord(chordMidis("C", "7b9", 48), 2.5);
      setTimeout(function () { A.playSequence(A.scaleToMidi(d, 60), 0.2); }, 400);
    }));
    bar.appendChild(btn("▶ C7alt + alterada", function () {
      A.playChord(chordMidis("C", "7alt", 48), 2.5);
      setTimeout(function () { A.playSequence(A.scaleToMidi(a, 60), 0.2); }, 400);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["dim-modulation"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Um dim7, quatro resolucoes"));
    wrap.appendChild(tbl(["Acorde", "Interpretado como", "Resolve em"], [
      ["B°7 (Si Re Fa La♭)", "vii°7 de Do", "Do maior"],
      ["D°7 (mesmas notas)", "vii°7 de Mi♭", "Mi♭ maior"],
      ["F°7 (mesmas notas)", "vii°7 de Sol♭", "Sol♭ maior"],
      ["A♭°7 (mesmas notas)", "vii°7 de La", "La maior"]
    ]));
    var row = h("div", "prog-row");
    [["C", 48], ["Eb", 51], ["Gb", 54], ["A", 57]].forEach(function (x) {
      var b = h("button", "chip", "→ " + x[0] + " maior");
      b.type = "button";
      b.addEventListener("click", function () {
        A.playChord([47, 50, 53, 56], 1.2);
        setTimeout(function () { A.playChord(chordMidis(x[0], "maj", x[1]), 2); }, 1000);
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    wrap.appendChild(caption("O mesmo acorde diminuto leva a quatro tonalidades diferentes — a modulacao mais economica que existe."));
    return wrap;
  };

  /* --- Modulo 15 ----------------------------------------------------- */

  W["melodic-modes"] = function () {
    var ids = ["menor-melodica", "dorico-b2", "lidio-aumentado", "lidio-dominante",
      "mixolidio-b6", "locrio-2", "alterada"];
    var rows = ids.map(function (id, i) {
      var b = T.buildScale("C", id);
      return { cells: [i + 1, b.scale.name, b.degrees.join(" "), b.names.join(" "),
        b.scale.chordQuality || "—", ""] };
    });
    var t = tbl(["#", "Modo", "Graus", "Notas em Do", "Acorde", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale("C", ids[i]), 60), 0.24);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Os 7 modos da menor melodica (todos com tonica Do)"));
    wrap.appendChild(t);
    return wrap;
  };

  W["acoustic-scale"] = function () {
    var rows = [];
    [8, 9, 10, 11, 12, 13, 14].forEach(function (n) {
      var hm = T.harmonic(n);
      var deg = { 8: "1", 9: "2", 10: "3", 11: "♯4", 12: "5", 13: "6", 14: "♭7" }[n];
      var etCents = { 8: 0, 9: 200, 10: 400, 11: 600, 12: 700, 13: 900, 14: 1000 }[n];
      rows.push([n, "<span class='mono'>" + n + ":8</span>", hm.centsInOctave.toFixed(1),
        deg, etCents, (hm.centsInOctave - etCents).toFixed(1)]);
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Harmonicos 8 a 14 = escala lidio dominante"));
    wrap.appendChild(tbl(["Harmonico", "Razao", "Cents (na oitava)", "Grau", "Cents no piano", "Erro"], rows));
    wrap.appendChild(caption("O ♯4 (11o harmonico) erra 49 cents e o ♭7 (14o) erra 31 — mas sao as teclas mais proximas."));
    return wrap;
  };

  W["altered-shortcut"] = function () {
    var pairs = [["C", "Db"], ["F", "Gb"], ["Bb", "B"], ["Eb", "E"], ["G", "Ab"], ["D", "Eb"]];
    var rows = pairs.map(function (p) {
      var alt = T.buildScale(p[0], "alterada");
      var mel = T.buildScale(p[1], "menor-melodica");
      return [p[0] + "7alt", T.noteName(T.parseNote(p[1])) + " menor melodica",
        alt.names.join(" "), mel.names.join(" ")];
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Alterada de X = menor melodica de X+1 semitom"));
    wrap.appendChild(tbl(["Acorde", "Toque esta escala", "Notas da alterada", "Notas da melodica"], rows));
    wrap.appendChild(caption("As duas colunas de notas contem as mesmas classes — so muda o ponto de partida."));
    return wrap;
  };

  W["tritone-sub"] = function () {
    var wrap = h("div", "widget-card");
    var box = h("div", "kb-box");
    wrap.appendChild(box);
    KB.render(box, {
      octaves: 2, startMidi: 55, labels: "highlighted", matchOctaves: false,
      highlights: [
        { midi: 59, label: "Si", sub: "3 de G7 / ♭7 de D♭7", role: "tension" },
        { midi: 65, label: "Fa", sub: "♭7 de G7 / 3 de D♭7", role: "tension" },
        { midi: 55, label: "Sol", role: "scale" }, { midi: 61, label: "Re♭", role: "only-b" }
      ]
    });
    wrap.appendChild(caption("G7 e D♭7 compartilham o tritono Si–Fa. Por isso um substitui o outro."));
    return wrap;
  };

  W["tritone-sub-demo"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" },
      { label: "Cmaj7", root: "C", type: "maj7" }
    ], { title: "Original: baixo Re – Sol – Do" }));
    wrap.appendChild(progression([
      { label: "Dm7", root: "D", type: "m7" }, { label: "D♭7", root: "Db", type: "7" },
      { label: "Cmaj7", root: "C", type: "maj7" }
    ], { title: "Com substituicao: baixo Re – Re♭ – Do (cromatico)" }));
    return wrap;
  };

  W["bebop-demo"] = function () {
    var mixo = T.buildScale("G", "mixolidio");
    var bebop = T.buildScale("G", "bebop-dominante");
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Escala", "Notas", "Notas do acorde caem em", "Resultado"], [
      ["Mixolidio (7 notas)", mixo.names.join(" "), "tempos alternados", "<span class='bad'>desalinha</span>"],
      ["Bebop dominante (8)", bebop.names.join(" "), "sempre nos tempos fortes", "<span class='ok'>alinha</span>"]
    ]));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Mixolidio em colcheias", function () {
      A.playSequence(A.scaleToMidi(mixo, 55).concat(A.scaleToMidi(mixo, 55).slice(1)), 0.17);
    }));
    bar.appendChild(btn("▶ Bebop em colcheias", function () {
      A.playSequence(A.scaleToMidi(bebop, 55), 0.17);
    }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["bebop-scales"] = function () {
    var ids = ["bebop-dominante", "bebop-maior", "bebop-dorico", "bebop-melodica"];
    var over = ["G7", "Cmaj7 / C6", "Dm7", "CmMaj7 / Cm6"];
    var rows = ids.map(function (id, i) {
      var b = T.buildScale("C", id);
      return { cells: [b.scale.name, b.degrees.join(" "), b.names.join(" "), over[i], ""] };
    });
    var t = tbl(["Escala", "Graus", "Notas em Do", "Usar sobre", ""], rows);
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playSequence(A.scaleToMidi(T.buildScale("C", ids[i]), 60), 0.18);
      }, "btn--mini"));
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(t);
    return wrap;
  };

  /* --- Modulo 16 ----------------------------------------------------- */

  W.andaluza = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "Am", roman: "iv", root: "A", type: "min" },
      { label: "G", roman: "♭III", root: "G", type: "maj" },
      { label: "F", roman: "♭II", root: "F", type: "maj" },
      { label: "E", roman: "I (frigio)", root: "E", type: "maj" }
    ], { title: "Cadencia andaluza — resolve em Mi, nao em La", note: "o centro e o Mi frigio dominante" }));
    return wrap;
  };

  /* --- Modulo 17 ----------------------------------------------------- */

  W.extensions = function () {
    var b = T.buildScale("C", "jonio");
    var rows = [
      ["1", "Do", "0", "fundamental", "estrutura"],
      ["3", "Mi", "4", "terca", "estrutura — define maior/menor"],
      ["5", "Sol", "7", "quinta", "estrutura — estabilidade"],
      ["7", "Si", "11", "setima", "estrutura — define o tipo"],
      ["9", "Re", "14", "nona (2a + oitava)", "tensao"],
      ["11", "Fa", "17", "decima primeira (4a + oitava)", "tensao"],
      ["13", "La", "21", "decima terceira (6a + oitava)", "tensao"]
    ];
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Sete tercas empilhadas sobre Do"));
    wrap.appendChild(tbl(["Grau", "Nota", "Semitons", "Nome", "Papel"], rows));
    wrap.appendChild(btn("▶ Ouvir a pilha completa (C13)", function () {
      A.playChord([48, 52, 55, 59, 62, 65, 69], 3, 0.05);
    }));
    return wrap;
  };

  W["avoid-notes"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Acorde", "Nota a evitar", "Por que", "Solucao"], [
      ["Cmaj7", "11 (Fa)", "meio tom acima da 3a (Mi)", "usar ♯11 (Fa♯) → som lidio"],
      ["C7", "11 (Fa)", "meio tom acima da 3a (Mi)", "usar ♯11, ou tocar C7sus4"],
      ["Cm7", "13 (La)", "sugere dorico; conflita se o contexto for eolio", "usar ♭13 se a tonalidade pedir"],
      ["Cm7♭5", "9 (Re)", "meio tom acima da ♭9 esperada em contexto menor", "usar locrio natural 2 quando couber"]
    ]));
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Cmaj7 com 11", function () { A.playChord([48, 52, 59, 65], 2.4); }));
    bar.appendChild(btn("▶ Cmaj7 com ♯11", function () { A.playChord([48, 52, 59, 66], 2.4); }));
    wrap.appendChild(bar);
    return wrap;
  };

  W["tension-table"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Tipo", "Tensoes disponiveis", "Evitar", "Escala correspondente"], [
      ["maj7", "9, ♯11, 13", "11 natural", "jonio ou lidio"],
      ["m7", "9, 11, 13", "♭13 (se dorico)", "dorico"],
      ["7 (dominante)", "9, ♭9, ♯9, ♯11, 13, ♭13", "11 natural", "mixolidio / alterada / diminuta"],
      ["m7♭5", "9, 11, ♭13", "—", "locrio natural 2"],
      ["dim7", "9, 11, ♭13, 7", "—", "diminuta tom-semitom"],
      ["mMaj7", "9, 11, 13", "—", "menor melodica"]
    ]));
    return wrap;
  };

  W["rootless-voicings"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Voicings sem fundamental para ii-V-I em Do"));
    wrap.appendChild(tbl(["Acorde", "Notas tocadas", "Graus", "Observacao"], [
      ["Dm9", "Fa La Do Mi", "♭3 5 ♭7 9", "sem Re — o baixo faz"],
      ["G13", "Fa La Si Mi", "♭7 9 3 13", "so uma voz se move de Dm9"],
      ["Cmaj9", "Mi Sol Si Re", "3 5 7 9", "resolucao suave"]
    ]));
    wrap.appendChild(progression([
      { label: "Dm9", midis: [38, 65, 69, 72, 76] },
      { label: "G13", midis: [43, 65, 69, 71, 76] },
      { label: "Cmaj9", midis: [36, 64, 67, 71, 74] }
    ], { title: "Ouvir" }));
    return wrap;
  };

  W["secondary-dominants"] = function () {
    var b = T.buildScale("C", "jonio");
    var chords = T.harmonize(b, 4);
    var rows = [];
    [1, 2, 3, 4, 5].forEach(function (i) {
      var target = chords[i];
      var domRootPc = T.mod(target.pcs[0] + 7, 12);
      rows.push(["V7/" + target.roman.replace(/[°ø7maj]/g, ""),
        T.pcName(domRootPc) + "7", "→ " + target.symbol,
        "introduz " + T.pcName(T.mod(domRootPc + 4, 12))]);
    });
    var wrap = h("div", "widget-card");
    wrap.appendChild(h("h4", null, "Dominantes secundarios em Do maior"));
    wrap.appendChild(tbl(["Notacao", "Acorde", "Resolve em", "Nota de fora"], rows));
    wrap.appendChild(progression([
      { label: "C", root: "C", type: "maj" }, { label: "A7", root: "A", type: "7" },
      { label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" },
      { label: "C", root: "C", type: "maj" }
    ], { title: "Exemplo: C – A7 – Dm7 – G7 – C" }));
    return wrap;
  };

  W["reharm-tritone"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "Cmaj7", root: "C", type: "maj7" }, { label: "A7", root: "A", type: "7" },
      { label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" }
    ], { title: "Original" }));
    wrap.appendChild(progression([
      { label: "Cmaj7", root: "C", type: "maj7" }, { label: "E♭7", root: "Eb", type: "7" },
      { label: "Dm7", root: "D", type: "m7" }, { label: "D♭7", root: "Db", type: "7" }
    ], { title: "Com substituicoes por tritono", note: "baixo: Do – Mi♭ – Re – Re♭" }));
    return wrap;
  };

  W["borrowed-chords"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Acorde", "Em Do maior", "Vem de", "Efeito"], [
      ["iv menor", "Fm", "Do menor", "agridoce, muito usado em refroes"],
      ["♭VI", "A♭", "Do menor", "epico, expansivo"],
      ["♭VII", "B♭", "Do mixolidio", "rock, modal"],
      ["♭III", "E♭", "Do menor", "surpresa, cor"],
      ["ii°", "D°", "Do menor", "tensao no ii"],
      ["♭II (napolitano)", "D♭", "Do frigio", "dramatico, classico"]
    ]));
    return wrap;
  };

  W["reharm-levels"] = function () {
    var wrap = h("div", "widget-card");
    wrap.appendChild(progression([
      { label: "C", root: "C", type: "maj" }, { label: "Am", root: "A", type: "min" },
      { label: "F", root: "F", type: "maj" }, { label: "G", root: "G", type: "maj" }
    ], { title: "Nivel 0 — triades" }));
    wrap.appendChild(progression([
      { label: "Cmaj7", root: "C", type: "maj7" }, { label: "Am7", root: "A", type: "m7" },
      { label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" }
    ], { title: "Nivel 1 — tetrades e IV → ii" }));
    wrap.appendChild(progression([
      { label: "Cmaj7", root: "C", type: "maj7" }, { label: "A7", root: "A", type: "7" },
      { label: "Dm7", root: "D", type: "m7" }, { label: "G7", root: "G", type: "7" }
    ], { title: "Nivel 2 — vi vira dominante secundario" }));
    wrap.appendChild(progression([
      { label: "Cmaj9", root: "C", type: "maj9" }, { label: "A7♭9", root: "A", type: "7b9" },
      { label: "Dm9", root: "D", type: "m9" }, { label: "D♭7♯11", root: "Db", type: "7#11" }
    ], { title: "Nivel 3 — tensoes e substituicao por tritono" }));
    return wrap;
  };

  /* --- Modulo 18 ----------------------------------------------------- */

  W["rhythm-grid"] = function () {
    var wrap = h("div", "widget-card");
    var pats = [
      { name: "Seminimas", n: 4, gap: 0.5 },
      { name: "Colcheias", n: 8, gap: 0.25 },
      { name: "Trecinas", n: 12, gap: 0.1667 },
      { name: "Semicolcheias", n: 16, gap: 0.125 }
    ];
    var row = h("div", "prog-row");
    pats.forEach(function (p) {
      var b = h("button", "chip", p.name + " (" + p.n + " por compasso)");
      b.type = "button";
      b.addEventListener("click", function () {
        var seq = [];
        for (var i = 0; i < p.n; i++) seq.push(i % (p.n / 4) === 0 ? 72 : 60);
        A.playSequence(seq, p.gap);
      });
      row.appendChild(b);
    });
    wrap.appendChild(h("h4", null, "Subdivisoes de um compasso 4/4 a 120 bpm"));
    wrap.appendChild(row);
    return wrap;
  };

  W.polyrhythm = function () {
    var wrap = h("div", "widget-card");
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ 3 contra 2", function () {
      for (var i = 0; i < 6; i++) A.play(72, 0.3, i * 0.25);
      for (var j = 0; j < 4; j++) A.play(48, 0.4, j * 0.375);
    }));
    bar.appendChild(btn("▶ 4 contra 3", function () {
      for (var i = 0; i < 8; i++) A.play(72, 0.25, i * 0.1875);
      for (var j = 0; j < 6; j++) A.play(48, 0.35, j * 0.25);
    }));
    wrap.appendChild(h("h4", null, "Polirritmia"));
    wrap.appendChild(bar);
    wrap.appendChild(caption("Em 3 contra 2, os dois so coincidem no tempo 1. Conte 'nao-vai-dar-cer-to' para sentir."));
    return wrap;
  };

  W.swing = function () {
    var wrap = h("div", "widget-card");
    var bar = h("div", "scale-bar");
    bar.appendChild(btn("▶ Colcheias retas", function () {
      var seq = [60, 62, 64, 65, 67, 65, 64, 62];
      A.playSequence(seq, 0.24);
    }));
    bar.appendChild(btn("▶ Colcheias em swing (2:1)", function () {
      var notes = [60, 62, 64, 65, 67, 65, 64, 62];
      notes.forEach(function (n, i) {
        var t = Math.floor(i / 2) * 0.48 + (i % 2 ? 0.32 : 0);
        A.play(n, 0.3, t);
      });
    }));
    wrap.appendChild(h("h4", null, "Reto x swing"));
    wrap.appendChild(bar);
    wrap.appendChild(tbl(["Estilo", "Proporcao", "Sensacao"], [
      ["Reto (even)", "1:1", "rock, pop, classico"],
      ["Swing (triplet)", "2:1", "jazz medio, blues"],
      ["Swing leve", "~1,5:1", "jazz rapido, bebop"]
    ]));
    return wrap;
  };

  W["study-plan"] = function () {
    var plan = [
      [1, "m0, m1", "Teclado, oitava, semitons", "Cromatica lenta; localizar Do e Fa de olhos fechados"],
      [2, "m2", "Intervalos", "Intervalos a partir de Do, Fa e Si; treino auditivo 5 min"],
      [3, "m3", "Serie harmonica", "Escala maior em Do, Sol, Fa; ouvir harmonicos"],
      [4, "m4", "Circulo de quintas", "Desenhar o circulo diariamente; armaduras"],
      [5, "m5", "Escala maior completa", "Si e Fa♯ maior (dedilhado); depois Do e Sol"],
      [6, "m6", "As tres menores", "La menor nas 3 formas; Re e Mi menor"],
      [7, "m7", "Modos", "Um modo por dia, com pedal e vamp"],
      [8, "m8", "Triades e campo harmonico", "Campo harmonico em 4 tonalidades; inversoes"],
      [9, "m9", "Tetrades e ii-V-I", "ii-V-I em 6 tonalidades, com conducao"],
      [10, "m10, m11", "Pentatonicas e blues", "Blues de 12 compassos em Do e Fa; improviso"],
      [11, "m12, m13", "Rock e pop", "4 progressoes pop; voicings abertos"],
      [12, "m14–m18", "Avancado e revisao", "Escolher 2 topicos avancados; gravar e comparar"]
    ];
    var wrap = h("div", "widget-card");
    wrap.appendChild(tbl(["Semana", "Modulos", "Foco teorico", "Foco pratico"],
      plan.map(function (p) { return ["<strong>" + p[0] + "</strong>", p[1], p[2], p[3]]; })));
    return wrap;
  };

  /* ------------------------------------------------------------------ *
   * Hidratacao
   * ------------------------------------------------------------------ */

  function hydrate(root) {
    var nodes = root.querySelectorAll("[data-w]");
    Array.prototype.forEach.call(nodes, function (node) {
      var name = node.dataset.w;
      var fn = W[name];
      if (!fn) {
        node.appendChild(h("div", "warn", "Widget nao encontrado: " + name));
        return;
      }
      try {
        var out = fn(node);
        if (out) node.appendChild(out);
      } catch (err) {
        node.appendChild(h("div", "warn", "Erro ao montar '" + name + "': " + err.message));
        if (global.console) console.error(name, err);
      }
    });
  }

  global.PT = global.PT || {};
  global.PT.widgets = {
    hydrate: hydrate, registry: W,
    helpers: { h: h, tbl: tbl, btn: btn, progression: progression, scaleBlock: scaleBlock, buildCircle: buildCircle, chordMidis: chordMidis }
  };
})(typeof window !== "undefined" ? window : globalThis);
