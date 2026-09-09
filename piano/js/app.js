/*
 * app.js — shell da aplicacao: roteamento, views e estado.
 */
(function (global) {
  "use strict";

  var T = global.PT.theory;
  var KB = global.PT.keyboard;
  var A = global.PT.audio;
  var WG = global.PT.widgets;
  var HP = WG.helpers;
  var h = HP.h, tbl = HP.tbl, btn = HP.btn;

  var MODULES = global.PT.CURRICULUM;
  var STORE_KEY = "pt.progress.v1";

  var state = {
    progress: load(),
    explorer: { tonic: "C", scale: "jonio", octaves: 2 },
    chords: { root: "C", type: "maj7", inversion: 0 }
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || { done: {}, last: null };
    } catch (e) {
      return { done: {}, last: null };
    }
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.progress)); } catch (e) { /* ignora */ }
  }

  function allLessons() {
    var out = [];
    MODULES.forEach(function (m) {
      m.lessons.forEach(function (l) { out.push({ module: m, lesson: l }); });
    });
    return out;
  }

  function progressStats() {
    var all = allLessons();
    var done = all.filter(function (x) { return state.progress.done[x.lesson.id]; }).length;
    return { done: done, total: all.length, pct: all.length ? Math.round(done / all.length * 100) : 0 };
  }

  /* ------------------------------------------------------------------ *
   * Roteamento
   * ------------------------------------------------------------------ */

  var ROUTES = [
    { id: "curso", label: "Curso", icon: "▤" },
    { id: "escalas", label: "Escalas", icon: "▦" },
    { id: "acordes", label: "Acordes", icon: "◫" },
    { id: "circulo", label: "Circulo", icon: "◎" },
    { id: "pecas", label: "Pecas", icon: "♪" },
    { id: "lab", label: "Laboratorio", icon: "∿" },
    { id: "ref", label: "Referencia", icon: "☰" }
  ];

  function parseHash() {
    var hash = (location.hash || "#/curso").replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    return { view: parts[0] || "curso", arg: parts[1] || null };
  }

  function go(path) {
    location.hash = "#/" + path;
  }

  function render() {
    var r = parseHash();
    var main = document.querySelector("#view");
    main.innerHTML = "";
    A.stopSequence();

    var view = {
      curso: viewCurso, licao: viewLicao, escalas: viewEscalas,
      acordes: viewAcordes, circulo: viewCirculo, pecas: viewPecas, lab: viewLab, ref: viewRef
    }[r.view] || viewCurso;

    main.appendChild(view(r.arg));
    updateNav(r.view);
    updateProgressBar();
    window.scrollTo(0, 0);
  }

  function updateNav(active) {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (el) {
      el.classList.toggle("is-active", el.dataset.route === active ||
        (active === "licao" && el.dataset.route === "curso"));
    });
  }

  function updateProgressBar() {
    var s = progressStats();
    var fill = document.querySelector("#progress-fill");
    var label = document.querySelector("#progress-label");
    if (fill) fill.style.width = s.pct + "%";
    if (label) label.textContent = s.done + " / " + s.total + " licoes (" + s.pct + "%)";
  }

  /* ------------------------------------------------------------------ *
   * View: Curso
   * ------------------------------------------------------------------ */

  function viewCurso() {
    var wrap = h("div", "view");
    var hero = h("section", "hero");
    hero.innerHTML =
      "<span class=\"hero-badge\">\u266a " + MODULES.length + " modulos \u00b7 " + allLessons().length + " licoes</span>" +
      "<h1>Piano do zero ao <span class=\"hero-accent\">avancado</span></h1>" +
      "<p class=\"hero-sub\">Um curso linear de teoria e pratica, em que cada escala e deduzida da fisica do som " +
      "e da matematica dos 12 semitons — nunca apresentada como regra a decorar. " +
      "Diagramas gerados a partir da propria teoria.</p>";
    var heroBar = h("div", "hero-bar");
    var next = nextLesson();
    if (next) {
      heroBar.appendChild(btn(state.progress.last ? "▶ Continuar: " + next.lesson.title : "▶ Comecar pelo inicio",
        function () { go("licao/" + next.lesson.id); }, "btn--primary"));
    }
    heroBar.appendChild(btn("Explorar escalas", function () { go("escalas"); }));
    hero.appendChild(heroBar);
    wrap.appendChild(hero);

    orderedLevels().forEach(function (lv) {
      var mods = modulesOfLevel(lv);
      if (!mods.length) return;
      var sec = h("section", "level-section");
      sec.appendChild(h("h2", "level-title",
        '<span class="pill pill--' + levelIdx(lv) + '">' + lv + "</span>"));
      var grid = h("div", "module-grid");
      mods.forEach(function (m) { grid.appendChild(moduleCard(m)); });
      sec.appendChild(grid);
      wrap.appendChild(sec);
    });
    return wrap;
  }

  function nextLesson() {
    var all = allLessons();
    if (state.progress.last) {
      var idx = all.findIndex(function (x) { return x.lesson.id === state.progress.last; });
      if (idx >= 0) return all[idx];
    }
    var pending = all.find(function (x) { return !state.progress.done[x.lesson.id]; });
    return pending || all[0];
  }

  function moduleCard(m) {
    var doneCount = m.lessons.filter(function (l) { return state.progress.done[l.id]; }).length;
    var card = h("article", "module-card");
    card.innerHTML =
      '<div class="module-head">' +
      '<span class="module-tag">' + m.tag + "</span>" +
      '<span class="module-count">' + doneCount + "/" + m.lessons.length + "</span>" +
      "</div>" +
      "<h3>" + m.title + "</h3>" +
      '<p class="module-summary">' + m.summary + "</p>";

    if (m.goals && m.goals.length) {
      var goals = h("ul", "module-goals");
      m.goals.forEach(function (g) { goals.appendChild(h("li", null, g)); });
      card.appendChild(goals);
    }

    var list = h("ol", "lesson-list");
    m.lessons.forEach(function (l) {
      var li = h("li", "lesson-item" + (state.progress.done[l.id] ? " is-done" : ""));
      var a = h("button", "lesson-link", l.title);
      a.type = "button";
      a.addEventListener("click", function () { go("licao/" + l.id); });
      li.appendChild(a);
      list.appendChild(li);
    });
    card.appendChild(list);
    if (doneCount === m.lessons.length) card.classList.add("is-complete");
    return card;
  }

  /* ------------------------------------------------------------------ *
   * View: Licao
   * ------------------------------------------------------------------ */

  function viewLicao(id) {
    var all = allLessons();
    var idx = all.findIndex(function (x) { return x.lesson.id === id; });
    if (idx < 0) return viewCurso();
    var cur = all[idx];
    state.progress.last = id;
    save();

    var wrap = h("article", "view lesson");
    var crumb = h("nav", "crumb");
    var back = h("button", "crumb-link", "← Curso");
    back.type = "button";
    back.addEventListener("click", function () { go("curso"); });
    crumb.appendChild(back);
    crumb.appendChild(h("span", "crumb-sep", "·"));
    crumb.appendChild(h("span", "crumb-mod", cur.module.title));
    wrap.appendChild(crumb);

    wrap.appendChild(h("h1", "lesson-title", cur.lesson.title));
    var meta = h("div", "lesson-meta");
    meta.appendChild(h("span", "pill pill--" + levelIdx(cur.module.level), cur.module.level));
    meta.appendChild(h("span", "muted", "Licao " + (idx + 1) + " de " + all.length));
    wrap.appendChild(meta);

    var body = h("div", "lesson-body");
    body.innerHTML = cur.lesson.html;
    wrap.appendChild(body);
    WG.hydrate(body);

    if (cur.lesson.practice && cur.lesson.practice.length) {
      var pr = h("section", "practice");
      pr.appendChild(h("h3", null, "Pratique agora"));
      var ul = h("ul");
      cur.lesson.practice.forEach(function (p) { ul.appendChild(h("li", null, p)); });
      pr.appendChild(ul);
      wrap.appendChild(pr);
    }

    var footer = h("div", "lesson-footer");
    var doneBtn = btn(state.progress.done[id] ? "✓ Concluida" : "Marcar como concluida", function () {
      state.progress.done[id] = !state.progress.done[id];
      save();
      render();
    }, state.progress.done[id] ? "btn--done" : "btn--primary");
    footer.appendChild(doneBtn);

    var navRow = h("div", "lesson-nav");
    if (idx > 0) {
      navRow.appendChild(btn("← " + all[idx - 1].lesson.title, function () {
        go("licao/" + all[idx - 1].lesson.id);
      }));
    }
    if (idx < all.length - 1) {
      navRow.appendChild(btn(all[idx + 1].lesson.title + " →", function () {
        go("licao/" + all[idx + 1].lesson.id);
      }, "btn--primary"));
    }
    footer.appendChild(navRow);
    wrap.appendChild(footer);
    return wrap;
  }

  /*
   * Niveis: os tres canonicos vem primeiro, na ordem pedagogica. Qualquer nivel
   * novo trazido por um content pack e descoberto a partir dos dados e entra
   * depois deles — antes esta lista era fixa, e um pack com nivel desconhecido
   * simplesmente nao aparecia na tela, sem erro nenhum.
   */
  var KNOWN_LEVELS = ["Iniciante", "Intermediario", "Avancado"];

  function orderedLevels() {
    var seen = [];
    MODULES.forEach(function (m) {
      if (m.level && seen.indexOf(m.level) < 0) seen.push(m.level);
    });
    var known = KNOWN_LEVELS.filter(function (l) { return seen.indexOf(l) >= 0; });
    var extra = seen.filter(function (l) { return KNOWN_LEVELS.indexOf(l) < 0; });
    return known.concat(extra);
  }

  /** Modulos de um nivel, ordenados por `order` (packs) e depois pela ordem de carga. */
  function modulesOfLevel(level) {
    return MODULES
      .map(function (m, i) { return { m: m, i: i }; })
      .filter(function (x) { return x.m.level === level; })
      .sort(function (a, b) {
        var d = (a.m.order || 0) - (b.m.order || 0);
        return d !== 0 ? d : a.i - b.i;
      })
      .map(function (x) { return x.m; });
  }

  /** Classe da pilha de cor. Niveis desconhecidos caem numa 4a cor neutra. */
  function levelIdx(level) {
    var i = KNOWN_LEVELS.indexOf(level);
    return i >= 0 ? i + 1 : 4;
  }

  /* ------------------------------------------------------------------ *
   * View: Explorador de escalas
   * ------------------------------------------------------------------ */

  var CATEGORIES = [
    { id: "all", label: "Todas" },
    { id: "maior", label: "Maior e modos" },
    { id: "menor", label: "Menores e modos" },
    { id: "pentatonica", label: "Pentatonicas" },
    { id: "blues", label: "Blues" },
    { id: "simetrica", label: "Simetricas" },
    { id: "bebop", label: "Bebop" },
    { id: "exotica", label: "Exoticas" },
    { id: "base", label: "Base" }
  ];

  function viewEscalas() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Explorador de escalas"));
    wrap.appendChild(h("p", "view-sub",
      "Todas as " + T.SCALES.length + " escalas do sistema, com formula, diagrama, campo harmonico e a razao de existirem."));

    var panel = h("div", "explorer");
    var controls = h("div", "controls");

    var tonicSel = h("select", "sel");
    ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"].forEach(function (n) {
      var o = h("option", null, T.noteName(T.parseNote(n)));
      o.value = n;
      tonicSel.appendChild(o);
    });
    tonicSel.value = state.explorer.tonic;

    var catSel = h("select", "sel");
    CATEGORIES.forEach(function (c) {
      var o = h("option", null, c.label);
      o.value = c.id;
      catSel.appendChild(o);
    });

    var scaleSel = h("select", "sel sel--wide");

    function fillScales() {
      scaleSel.innerHTML = "";
      T.SCALES.filter(function (s) {
        return catSel.value === "all" || s.category === catSel.value;
      }).forEach(function (s) {
        var o = h("option", null, s.name);
        o.value = s.id;
        scaleSel.appendChild(o);
      });
      if (Array.prototype.some.call(scaleSel.options, function (o) { return o.value === state.explorer.scale; })) {
        scaleSel.value = state.explorer.scale;
      } else if (scaleSel.options.length) {
        state.explorer.scale = scaleSel.options[0].value;
      }
    }
    fillScales();

    controls.appendChild(labelled("Tonica", tonicSel));
    controls.appendChild(labelled("Categoria", catSel));
    controls.appendChild(labelled("Escala", scaleSel));
    panel.appendChild(controls);

    var out = h("div", "explorer-out");
    panel.appendChild(out);

    function draw() {
      state.explorer.tonic = tonicSel.value;
      state.explorer.scale = scaleSel.value;
      out.innerHTML = "";
      var built = T.buildScale(state.explorer.tonic, state.explorer.scale);
      if (!built) return;

      out.appendChild(HP.scaleBlock(state.explorer.tonic, state.explorer.scale, { octaves: 2 }));

      /* Analise numerica */
      var an = h("div", "widget-card");
      an.appendChild(h("h4", null, "Analise"));
      var iv = built.intervals.map(function (i2, k) {
        return T.noteName(built.notes[k]) + " = " + i2 + " st (" + (i2 * 100) + "¢)";
      });
      an.appendChild(tbl(["Propriedade", "Valor"], [
        ["Notas", built.names.join(" ")],
        ["Graus", built.degrees.join(" ")],
        ["Passos (semitons)", built.steps.join(" - ") + " → Σ = " + built.steps.reduce(function (a, b) { return a + b; }, 0)],
        ["Intervalos desde a tonica", iv.join(" · ")],
        ["Vetor intervalar", "⟨" + built.vector.join(", ") + "⟩"],
        ["Contem semitom?", built.vector[0] ? "sim (" + built.vector[0] + " pares)" : "<span class='ok'>nao</span>"],
        ["Contem tritono?", built.vector[5] ? "sim (" + built.vector[5] + " pares)" : "<span class='ok'>nao</span>"],
        ["Frequencias (4a oitava)", built.intervals.map(function (i2) {
          return T.midiToFreq(60 + T.mod(built.tonic.pc, 12) + i2).toFixed(1);
        }).join(" · ") + " Hz"]
      ]));
      out.appendChild(an);

      /* Campo harmonico */
      if (built.pcs.length === 7) {
        var node3 = h("div");
        node3.dataset.w = "harmonize";
        node3.dataset.tonic = state.explorer.tonic;
        node3.dataset.scale = state.explorer.scale;
        node3.dataset.size = "4";
        out.appendChild(node3);
        WG.hydrate(out);
      }

      /* Escalas relacionadas */
      var rel = T.SCALES.filter(function (s) {
        if (s.id === built.scale.id) return false;
        var other = T.buildScale(state.explorer.tonic, s.id);
        var common = other.pcs.filter(function (p) { return built.pcs.indexOf(p) >= 0; }).length;
        return common >= Math.min(built.pcs.length, other.pcs.length) - 1 &&
          Math.abs(other.pcs.length - built.pcs.length) <= 1;
      }).slice(0, 8);
      if (rel.length) {
        var rc = h("div", "widget-card");
        rc.appendChild(h("h4", null, "Escalas vizinhas (1 nota de diferenca)"));
        var row = h("div", "prog-row");
        rel.forEach(function (s) {
          var b = h("button", "chip", s.name);
          b.type = "button";
          b.addEventListener("click", function () {
            catSel.value = "all"; fillScales();
            scaleSel.value = s.id; draw();
          });
          row.appendChild(b);
        });
        rc.appendChild(row);
        out.appendChild(rc);
      }

      /* Modos irmaos */
      if (built.scale.parent) {
        var siblings = T.SCALES.filter(function (s) { return s.parent === built.scale.parent; });
        if (siblings.length > 1) {
          var mc = h("div", "widget-card");
          mc.appendChild(h("h4", null, "Modos da mesma escala-mae"));
          var mrow = h("div", "prog-row");
          siblings.forEach(function (s) {
            var b = h("button", "chip" + (s.id === built.scale.id ? " is-on" : ""), s.mode + ". " + s.name);
            b.type = "button";
            b.addEventListener("click", function () {
              catSel.value = "all"; fillScales();
              scaleSel.value = s.id; draw();
            });
            mrow.appendChild(b);
          });
          mc.appendChild(mrow);
          out.appendChild(mc);
        }
      }
    }

    tonicSel.addEventListener("change", draw);
    scaleSel.addEventListener("change", draw);
    catSel.addEventListener("change", function () { fillScales(); draw(); });
    draw();

    wrap.appendChild(panel);
    return wrap;
  }

  function labelled(text, el) {
    var l = h("label", "field");
    l.appendChild(h("span", "field-label", text));
    l.appendChild(el);
    return l;
  }

  /* ------------------------------------------------------------------ *
   * View: Acordes
   * ------------------------------------------------------------------ */

  function viewAcordes() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Construtor de acordes"));
    wrap.appendChild(h("p", "view-sub", "Monte qualquer acorde, veja as inversoes no teclado e descubra quais escalas o contem."));

    var controls = h("div", "controls");
    var rootSel = h("select", "sel");
    ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"].forEach(function (n) {
      var o = h("option", null, T.noteName(T.parseNote(n)));
      o.value = n;
      rootSel.appendChild(o);
    });
    rootSel.value = state.chords.root;

    var typeSel = h("select", "sel sel--wide");
    ["triade", "tetrade", "extensao", "alterado"].forEach(function (fam) {
      var grp = document.createElement("optgroup");
      grp.label = fam;
      T.CHORDS.filter(function (c) { return c.family === fam; }).forEach(function (c) {
        var o = h("option", null, (c.symbol || "maior") + " — " + c.name);
        o.value = c.id;
        grp.appendChild(o);
      });
      typeSel.appendChild(grp);
    });
    typeSel.value = state.chords.type;

    var invSel = h("select", "sel");
    [0, 1, 2, 3].forEach(function (i) {
      var o = h("option", null, i === 0 ? "Fundamental" : i + "a inversao");
      o.value = i;
      invSel.appendChild(o);
    });

    controls.appendChild(labelled("Fundamental", rootSel));
    controls.appendChild(labelled("Tipo", typeSel));
    controls.appendChild(labelled("Inversao", invSel));
    wrap.appendChild(controls);

    var out = h("div", "explorer-out");
    wrap.appendChild(out);

    function draw() {
      state.chords.root = rootSel.value;
      state.chords.type = typeSel.value;
      state.chords.inversion = parseInt(invSel.value, 10);
      out.innerHTML = "";

      var c = T.buildChord(state.chords.root, state.chords.type, state.chords.inversion);
      if (!c) return;

      var card = h("div", "widget-card");
      card.appendChild(h("h4", null, c.symbol + " — " + c.chord.name));
      var box = h("div", "kb-box");
      card.appendChild(box);
      KB.renderChord(box, c, { octaves: 3, startMidi: 48 });

      card.appendChild(tbl(["Propriedade", "Valor"], [
        ["Notas", c.names.join(" ")],
        ["Formula", c.chord.formula],
        ["Intervalos (semitons)", c.intervals.join(" - ")],
        ["Classes de altura", c.pcs.join(" ")],
        ["Vetor intervalar", "⟨" + T.intervalVector(c.pcs).join(", ") + "⟩"]
      ]));

      var bar = h("div", "scale-bar");
      bar.appendChild(btn("▶ Bloco", function () {
        A.playChord(HP.chordMidis(state.chords.root, state.chords.type, 48).map(function (m, i) {
          var arr = HP.chordMidis(state.chords.root, state.chords.type, 48);
          for (var z = 0; z < state.chords.inversion; z++) arr.push(arr.shift() + 12);
          return arr[i];
        }), 2.4, 0.012);
      }));
      bar.appendChild(btn("▶ Arpejo", function () {
        var arr = HP.chordMidis(state.chords.root, state.chords.type, 48);
        for (var z = 0; z < state.chords.inversion; z++) arr.push(arr.shift() + 12);
        A.playSequence(arr, 0.3);
      }));
      card.appendChild(bar);
      out.appendChild(card);

      /* Escalas que contem o acorde */
      var scales = T.scalesForChord(c.root.pc, c.chord.intervals);
      var sc = h("div", "widget-card");
      sc.appendChild(h("h4", null, "Escalas que contem este acorde (" + scales.length + ")"));
      if (!scales.length) {
        sc.appendChild(h("p", "muted", "Nenhuma escala do catalogo contem todas as notas deste acorde."));
      } else {
        var row = h("div", "prog-row");
        scales.forEach(function (s) {
          var b = h("button", "chip", s.name);
          b.type = "button";
          b.addEventListener("click", function () {
            state.explorer.tonic = state.chords.root;
            state.explorer.scale = s.id;
            go("escalas");
          });
          row.appendChild(b);
        });
        sc.appendChild(row);
      }
      out.appendChild(sc);

      /* Inversoes lado a lado */
      var invCard = h("div", "widget-card");
      invCard.appendChild(h("h4", null, "Todas as inversoes"));
      var grid = h("div", "chord-grid");
      for (var i = 0; i < c.chord.intervals.length && i < 4; i++) {
        (function (inv) {
          var ci = T.buildChord(state.chords.root, state.chords.type, inv);
          var cc = h("div", "chord-card");
          cc.appendChild(h("h5", null, inv === 0 ? "Fundamental" : inv + "a inversao"));
          var b2 = h("div", "kb-box kb-box--small");
          cc.appendChild(b2);
          KB.renderChord(b2, ci, { octaves: 2, startMidi: 48, whiteWidth: 26, whiteHeight: 100 });
          cc.appendChild(h("p", "mono", ci.names.join(" ")));
          grid.appendChild(cc);
        })(i);
      }
      invCard.appendChild(grid);
      out.appendChild(invCard);
    }

    rootSel.addEventListener("change", draw);
    typeSel.addEventListener("change", draw);
    invSel.addEventListener("change", draw);
    draw();
    return wrap;
  }

  /* ------------------------------------------------------------------ *
   * View: Circulo
   * ------------------------------------------------------------------ */

  function viewCirculo() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Circulo das quintas"));
    wrap.appendChild(h("p", "view-sub",
      "Andando de quinta em quinta, cada passo troca exatamente uma nota da escala. Doze passos fecham o circulo."));

    var out = h("div", "explorer-out");
    var detail = h("div", "widget-card");

    function showKey(d) {
      detail.innerHTML = "";
      var b = T.buildScale(d.major, "jonio");
      var sig = d.signature;
      detail.appendChild(h("h4", null, d.major + " maior · " + d.minor));
      detail.appendChild(tbl(["Propriedade", "Valor"], [
        ["Armadura", sig.count === 0 ? "nenhum acidente" : sig.count + " " + sig.type],
        ["Acidentes", sig.accidentals.join(" ") || "—"],
        ["Escala maior", b.names.join(" ")],
        ["Relativo menor", T.noteName(sig.relativeMinor) + " menor: " +
          T.buildScale(T.noteName(sig.relativeMinor), "eolio").names.join(" ")],
        ["Campo harmonico", T.harmonize(b, 4).map(function (c) { return c.symbol; }).join(" · ")]
      ]));
      var bar = h("div", "scale-bar");
      bar.appendChild(btn("▶ Escala", function () { A.playSequence(A.scaleToMidi(b, 60), 0.26); }));
      bar.appendChild(btn("▶ ii-V-I", function () {
        [[T.noteName(b.notes[1]), "m7"], [T.noteName(b.notes[4]), "7"], [T.noteName(b.notes[0]), "maj7"]]
          .forEach(function (x, i) {
            setTimeout(function () { A.playChord(HP.chordMidis(x[0], x[1], 48), 1.5, 0.012); }, i * 850);
          });
      }));
      detail.appendChild(bar);
    }

    out.appendChild(HP.buildCircle(showKey));
    out.appendChild(detail);
    showKey(T.circleOfFifths()[0]);
    wrap.appendChild(out);

    var node = h("div");
    node.dataset.w = "key-table";
    wrap.appendChild(node);
    WG.hydrate(wrap);
    return wrap;
  }

  /* ------------------------------------------------------------------ *
   * View: Laboratorio
   * ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ *
   * View: Minhas pecas
   *
   * O app sabia tocar so o que ele mesmo gerava. Esta pagina e a porta de
   * entrada para musica de verdade: voce digita a peca a partir da cifra ou
   * da partitura que tem, e o app a trata como trata os exercicios — pauta,
   * teclado acendendo, maos separadas, tempo reduzido, trecho em loop.
   *
   * As pecas ficam no localStorage DESTE navegador. Nada e enviado a lugar
   * nenhum, e nada entra no repositorio — o que voce digita e seu, e musica
   * sob direito autoral nao deve ser publicada de qualquer forma.
   * ------------------------------------------------------------------ */

  var PECAS_KEY = "pt.pecas.v1";

  /* O que esta no editor sobrevive ao re-render da view. Sem isso, salvar
   * limpava o formulario de volta ao exemplo e a peca sumia da tela — logo
   * depois de a pessoa clicar em Salvar, que e o pior momento possivel. */
  var rascunho = null;

  function lerPecas() {
    try {
      var cru = localStorage.getItem(PECAS_KEY);
      var lista = cru ? JSON.parse(cru) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      // Navegador anonimo ou armazenamento bloqueado: segue sem persistir.
      return [];
    }
  }

  function salvarPecas(lista) {
    try {
      localStorage.setItem(PECAS_KEY, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }

  var EXEMPLO = [
    "// Uma linha por mao. Duracao em tempos apos os dois pontos.",
    "// Sem duracao = 1 tempo. r = pausa. [ ] = acorde. | = compasso.",
    "RH: E4 F#4 G4 A4 | B4:2 A4:2",
    "LH: [E3 B3]:4 | [C3 G3]:4"
  ].join("\n");

  function viewPecas() {
    var N = global.PT.notation;
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Minhas pecas"));
    wrap.appendChild(h("p", "view-sub",
      "Digite a musica que voce quer estudar e o app a ensina como ensina os exercicios: " +
      "pauta, teclado acendendo, maos separadas e tempo reduzido. Fica salva neste navegador."));

    if (!N) {
      wrap.appendChild(h("p", "warn", "Modulo de notacao ausente."));
      return wrap;
    }

    var lista = lerPecas();

    /* --- formulario --- */
    var card = h("div", "widget-card");
    card.appendChild(h("h4", null, "Nova peca"));

    var tituloIn = h("input", "sel");
    tituloIn.type = "text";
    tituloIn.placeholder = "ex.: trecho da melodia que estou estudando";
    tituloIn.value = rascunho ? rascunho.titulo : "";

    var bpmIn = h("input", "sel");
    bpmIn.type = "number";
    bpmIn.value = rascunho ? rascunho.bpm : 90;
    bpmIn.min = 40; bpmIn.max = 200;

    var linha = h("div", "controls");
    linha.appendChild(labelled("Titulo", tituloIn));
    linha.appendChild(labelled("Andamento (bpm)", bpmIn));
    card.appendChild(linha);

    var area = h("textarea", "sel pecas-area");
    area.rows = 8;
    area.spellcheck = false;
    area.value = rascunho ? rascunho.texto : EXEMPLO;
    card.appendChild(labelled("Notas", area));

    function lembrar() {
      rascunho = { titulo: tituloIn.value, bpm: parseInt(bpmIn.value, 10) || 90, texto: area.value };
    }
    area.addEventListener("input", lembrar);
    tituloIn.addEventListener("input", lembrar);
    bpmIn.addEventListener("input", lembrar);

    var saida = h("div", "pecas-saida");
    var barra = h("div", "controls");

    function montar(texto, titulo, bpm) {
      var r = N.parse(texto);
      saida.innerHTML = "";
      if (r.erros.length) {
        var box = h("div", "warn");
        box.appendChild(h("p", null, "Nao consegui ler " + r.erros.length +
          (r.erros.length === 1 ? " trecho:" : " trechos:")));
        var ul = h("ul");
        r.erros.slice(0, 6).forEach(function (e) { ul.appendChild(h("li", null, e)); });
        box.appendChild(ul);
        saida.appendChild(box);
      }
      if (!r.notes.length) {
        saida.appendChild(h("p", "warn", "Nenhuma nota reconhecida."));
        return null;
      }
      var piece = {
        title: titulo || "Sem titulo",
        notes: r.notes,
        beats: r.beats,
        bpm: bpm || 90
      };
      saida.appendChild(HP.playerBlock(piece));
      return piece;
    }

    barra.appendChild(btn("Tocar", function () {
      montar(area.value, tituloIn.value, parseInt(bpmIn.value, 10));
    }, "btn--primary"));

    barra.appendChild(btn("Salvar", function () {
      var r = N.parse(area.value);
      if (!r.notes.length) { montar(area.value, tituloIn.value, parseInt(bpmIn.value, 10)); return; }
      lista.push({
        titulo: tituloIn.value || "Sem titulo",
        bpm: parseInt(bpmIn.value, 10) || 90,
        texto: area.value,
        em: Date.now()
      });
      lembrar();
      if (salvarPecas(lista)) render();
      else saida.appendChild(h("p", "warn",
        "Nao consegui salvar. O navegador pode estar bloqueando armazenamento (janela anonima)."));
    }));

    card.appendChild(barra);
    card.appendChild(saida);
    wrap.appendChild(card);

    /* Volta com o player montado se havia algo em edicao. */
    if (rascunho && rascunho.texto) {
      setTimeout(function () { montar(rascunho.texto, rascunho.titulo, rascunho.bpm); }, 0);
    }

    /* --- pecas salvas --- */
    var salvas = h("div", "widget-card");
    salvas.appendChild(h("h4", null, "Salvas neste navegador (" + lista.length + ")"));
    if (!lista.length) {
      salvas.appendChild(h("p", "muted",
        "Nenhuma ainda. Escreva acima e clique em Salvar."));
    } else {
      lista.slice().reverse().forEach(function (p) {
        var item = h("div", "peca-item");
        var cab = h("div", "peca-cab");
        cab.appendChild(h("strong", null, p.titulo));
        cab.appendChild(h("span", "mono", p.bpm + " bpm"));
        item.appendChild(cab);

        var acoes = h("div", "controls");
        acoes.appendChild(btn("Abrir", function () {
          tituloIn.value = p.titulo;
          bpmIn.value = p.bpm;
          area.value = p.texto;
          lembrar();
          montar(p.texto, p.titulo, p.bpm);
          area.scrollIntoView({ behavior: "smooth", block: "center" });
        }));
        acoes.appendChild(btn("Apagar", function () {
          var i = lista.indexOf(p);
          if (i >= 0) { lista.splice(i, 1); salvarPecas(lista); render(); }
        }));
        item.appendChild(acoes);
        salvas.appendChild(item);
      });
    }
    /* Exportar e importar: localStorage some com limpeza de dados ou janela
     * anonima, e quem digitou uma peca inteira a mao nao pode depender so
     * dele. O arquivo e um JSON simples, legivel. */
    var backup = h("div", "controls");
    backup.appendChild(btn("Exportar (baixar)", function () {
      var blob = new Blob([JSON.stringify(lista, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "minhas-pecas.json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }));

    var arquivoIn = h("input", "sel");
    arquivoIn.type = "file";
    arquivoIn.accept = "application/json,.json";
    arquivoIn.addEventListener("change", function () {
      var f = arquivoIn.files && arquivoIn.files[0];
      if (!f) return;
      var leitor = new FileReader();
      leitor.onload = function () {
        try {
          var vindas = JSON.parse(leitor.result);
          if (!Array.isArray(vindas)) throw new Error("formato inesperado");
          // Acrescenta em vez de substituir: importar nao deve apagar nada.
          vindas.forEach(function (p) {
            if (p && typeof p.texto === "string") lista.push(p);
          });
          salvarPecas(lista);
          render();
        } catch (e) {
          salvas.appendChild(h("p", "warn", "Nao consegui ler o arquivo: " + e.message));
        }
      };
      leitor.readAsText(f);
    });
    backup.appendChild(labelled("Importar", arquivoIn));
    salvas.appendChild(backup);

    wrap.appendChild(salvas);

    /* --- ajuda do formato --- */
    var ajuda = h("div", "widget-card");
    ajuda.appendChild(h("h4", null, "Como escrever"));
    ajuda.appendChild(tbl(["Voce escreve", "Significa"], [
      ["E4 F#4 G4", "tres notas, um tempo cada"],
      ["E4:2", "dois tempos"],
      ["G4:.5", "meio tempo"],
      ["r  ou  -", "pausa (aceita r:2)"],
      ["Em  C  F#m7", "CIFRA: o acorde e montado sozinho"],
      ["Em:4", "cifra segurada por quatro tempos"],
      ["[E4 G4 B4]", "acorde escrito nota a nota"],
      ["|", "barra de compasso (so organiza)"],
      ["RH: / LH:", "mao direita / mao esquerda"],
      ["// texto", "comentario, ignorado"]
    ]));
    ajuda.appendChild(h("p", "muted",
      "Nota e cifra se distinguem pela oitava: \"E4\" e uma nota, \"Em\" e um acorde. " +
      "Por isso a oitava e obrigatoria quando voce escreve uma nota solta."));
    ajuda.appendChild(h("p", "muted",
      "As duas maos correm em paralelo: cada uma tem seu proprio relogio, " +
      "entao a esquerda pode segurar um acorde longo enquanto a direita corre."));
    wrap.appendChild(ajuda);

    return wrap;
  }

  function viewLab() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Laboratorio"));
    wrap.appendChild(h("p", "view-sub", "A matematica crua por tras do instrumento. Todos os valores sao calculados, nao tabelados."));

    /* Calculadora de frequencia */
    var calc = h("div", "widget-card");
    calc.appendChild(h("h4", null, "Calculadora de altura"));
    var cRow = h("div", "controls");
    var noteInput = h("input", "sel");
    noteInput.type = "text";
    noteInput.value = "A4";
    noteInput.placeholder = "ex.: A4, C#5, Eb3";
    var a4Input = h("input", "sel");
    a4Input.type = "number";
    a4Input.value = 440;
    a4Input.min = 380; a4Input.max = 480;
    cRow.appendChild(labelled("Nota", noteInput));
    cRow.appendChild(labelled("Afinacao de La4 (Hz)", a4Input));
    calc.appendChild(cRow);
    var calcOut = h("div", "calc-out");
    calc.appendChild(calcOut);

    function doCalc() {
      var midi = T.nameToMidi(noteInput.value);
      var a4 = parseFloat(a4Input.value) || 440;
      A.setA4(a4);
      if (midi === null) {
        calcOut.innerHTML = "<p class='warn'>Nao entendi essa nota. Use o formato C4, F#3, Bb5.</p>";
        return;
      }
      var f = T.midiToFreq(midi, a4);
      calcOut.innerHTML = "";
      calcOut.appendChild(tbl(["Propriedade", "Valor"], [
        ["Nota", T.midiToName(midi)],
        ["Numero MIDI", midi],
        ["Frequencia", f.toFixed(3) + " Hz"],
        ["Periodo", (1000 / f).toFixed(4) + " ms"],
        ["Comprimento de onda (343 m/s)", (343 / f * 100).toFixed(1) + " cm"],
        ["Semitons acima do La4", (midi - 69) + " (" + ((midi - 69) * 100) + " cents)"],
        ["Razao com o La4", (f / a4).toFixed(6)],
        ["Oitava acima", (f * 2).toFixed(2) + " Hz"],
        ["Quinta justa pura acima (3:2)", (f * 1.5).toFixed(2) + " Hz"],
        ["Quinta do piano acima", T.midiToFreq(midi + 7, a4).toFixed(2) + " Hz"]
      ]));
      var bar = h("div", "scale-bar");
      bar.appendChild(btn("▶ Tocar", function () { A.play(midi, 1.6); }));
      bar.appendChild(btn("▶ Com a quinta pura", function () { A.playFreq(f, 2); A.playFreq(f * 1.5, 2); }));
      bar.appendChild(btn("▶ Com a quinta do piano", function () { A.playChord([midi, midi + 7], 2); }));
      calcOut.appendChild(bar);
    }
    noteInput.addEventListener("input", doCalc);
    a4Input.addEventListener("input", doCalc);
    doCalc();
    wrap.appendChild(calc);

    /* Widgets teoricos ja prontos */
    ["harmonic-series", "consonance-table", "tuning-compare", "edo-table", "geometry-table"].forEach(function (name) {
      var n = h("div");
      n.dataset.w = name;
      wrap.appendChild(n);
    });

    /* Commas */
    var commas = h("div", "widget-card");
    commas.appendChild(h("h4", null, "Commas: os erros que sobram"));
    commas.appendChild(tbl(["Comma", "Razao", "Cents", "O que causa"], [
      [T.COMMAS.pitagorico.label, T.COMMAS.pitagorico.ratio.toFixed(9),
        T.ratioToCents(T.COMMAS.pitagorico.ratio).toFixed(3),
        "12 quintas puras nao fecham 7 oitavas"],
      [T.COMMAS.sintonico.label, T.COMMAS.sintonico.ratio.toFixed(9),
        T.ratioToCents(T.COMMAS.sintonico.ratio).toFixed(3),
        "4 quintas puras nao dao uma terca maior pura"],
      [T.COMMAS.diesis.label, T.COMMAS.diesis.ratio.toFixed(9),
        T.ratioToCents(T.COMMAS.diesis.ratio).toFixed(3),
        "3 tercas maiores puras nao fecham uma oitava"]
    ]));
    commas.appendChild(h("p", "fig-caption",
      "O temperamento igual existe para diluir esses erros: distribui o comma pitagorico igualmente pelas 12 quintas (1,955 cents cada)."));
    wrap.appendChild(commas);

    /* Teclado livre */
    var free = h("div", "widget-card");
    free.appendChild(h("h4", null, "Teclado livre — 3 oitavas"));
    var fbox = h("div", "kb-box");
    free.appendChild(fbox);
    var info = h("p", "info-line", "Clique em uma tecla.");
    KB.render(fbox, {
      octaves: 3, startMidi: 48, labels: "auto", showOctaveNumbers: true,
      onKey: function (midi) {
        info.innerHTML = "<strong>" + T.midiToName(midi) + "</strong> · MIDI " + midi +
          " · " + T.midiToFreq(midi).toFixed(2) + " Hz";
      }
    });
    free.appendChild(info);
    wrap.appendChild(free);

    WG.hydrate(wrap);
    return wrap;
  }

  /* ------------------------------------------------------------------ *
   * View: Referencia
   * ------------------------------------------------------------------ */

  function viewRef() {
    var wrap = h("div", "view");
    wrap.appendChild(h("h1", null, "Referencia rapida"));
    wrap.appendChild(h("p", "view-sub", "Todas as escalas e acordes do catalogo, em forma de tabela."));

    var search = h("input", "sel sel--wide");
    search.type = "search";
    search.placeholder = "Filtrar por nome...";
    wrap.appendChild(labelled("Buscar", search));

    var scalesCard = h("div", "widget-card");
    scalesCard.appendChild(h("h4", null, "Escalas (" + T.SCALES.length + ")"));
    var scalesBox = h("div");
    scalesCard.appendChild(scalesBox);
    wrap.appendChild(scalesCard);

    function drawScales() {
      var q = search.value.trim().toLowerCase();
      var list = T.SCALES.filter(function (s) {
        return !q || s.name.toLowerCase().indexOf(q) >= 0 ||
          (s.aliases || []).join(" ").toLowerCase().indexOf(q) >= 0 ||
          (s.category || "").indexOf(q) >= 0;
      });
      scalesBox.innerHTML = "";
      var rows = list.map(function (s) {
        var b = T.buildScale("C", s.id);
        return { cells: ["<strong>" + s.name + "</strong>", s.category,
          b.pcs.length, "<span class='mono'>" + s.steps.join("-") + "</span>",
          "<span class='mono'>" + s.degrees.join(" ") + "</span>", b.names.join(" "), ""] };
      });
      var t = tbl(["Escala", "Categoria", "Notas", "Passos", "Graus", "Em Do", ""], rows);
      Array.prototype.forEach.call(t.querySelectorAll("tbody tr"), function (tr, i) {
        tr.lastElementChild.appendChild(btn("▶", function () {
          A.playSequence(A.scaleToMidi(T.buildScale("C", list[i].id), 60), 0.22);
        }, "btn--mini"));
        tr.style.cursor = "pointer";
        tr.addEventListener("click", function (ev) {
          if (ev.target.tagName === "BUTTON") return;
          state.explorer.tonic = "C";
          state.explorer.scale = list[i].id;
          go("escalas");
        });
      });
      scalesBox.appendChild(t);
    }
    search.addEventListener("input", drawScales);
    drawScales();

    var chordsCard = h("div", "widget-card");
    chordsCard.appendChild(h("h4", null, "Acordes (" + T.CHORDS.length + ")"));
    var crows = T.CHORDS.map(function (c) {
      var b = T.buildChord("C", c.id);
      return { cells: ["<strong>C" + c.symbol + "</strong>", c.name, c.family,
        "<span class='mono'>" + c.formula + "</span>",
        "<span class='mono'>" + c.intervals.join("-") + "</span>", b.names.join(" "), ""] };
    });
    var ct = tbl(["Cifra", "Nome", "Familia", "Formula", "Semitons", "Notas", ""], crows);
    Array.prototype.forEach.call(ct.querySelectorAll("tbody tr"), function (tr, i) {
      tr.lastElementChild.appendChild(btn("▶", function () {
        A.playChord(HP.chordMidis("C", T.CHORDS[i].id, 48), 2, 0.012);
      }, "btn--mini"));
    });
    chordsCard.appendChild(ct);
    wrap.appendChild(chordsCard);

    return wrap;
  }

  /* ------------------------------------------------------------------ *
   * Barra inferior: metronomo e audio
   * ------------------------------------------------------------------ */

  function buildDock() {
    var dock = document.querySelector("#dock");
    var bpm = h("input", "dock-range");
    bpm.type = "range"; bpm.min = 40; bpm.max = 208; bpm.value = 90;
    var bpmLabel = h("span", "dock-value", "90 bpm");
    bpm.addEventListener("input", function () {
      bpmLabel.textContent = bpm.value + " bpm";
      if (A.metronomeRunning()) {
        A.stopMetronome();
        A.startMetronome(+bpm.value, +beats.value, flashBeat);
      }
    });

    var beats = h("select", "sel sel--mini");
    [2, 3, 4, 6].forEach(function (b) {
      var o = h("option", null, b + "/4");
      o.value = b;
      beats.appendChild(o);
    });
    beats.value = 4;

    var dots = h("div", "dock-dots");
    function renderDots() {
      dots.innerHTML = "";
      for (var i = 0; i < +beats.value; i++) dots.appendChild(h("i", "dot"));
    }
    renderDots();
    beats.addEventListener("change", function () {
      renderDots();
      if (A.metronomeRunning()) {
        A.stopMetronome();
        A.startMetronome(+bpm.value, +beats.value, flashBeat);
      }
    });

    function flashBeat(i) {
      var all = dots.querySelectorAll(".dot");
      Array.prototype.forEach.call(all, function (d, k) { d.classList.toggle("is-on", k === i); });
    }

    var toggle = btn("▶ Metronomo", function () {
      if (A.metronomeRunning()) {
        A.stopMetronome();
        toggle.textContent = "▶ Metronomo";
        toggle.classList.remove("btn--done");
        Array.prototype.forEach.call(dots.querySelectorAll(".dot"), function (d) { d.classList.remove("is-on"); });
      } else {
        A.startMetronome(+bpm.value, +beats.value, flashBeat);
        toggle.textContent = "■ Parar";
        toggle.classList.add("btn--done");
      }
    });

    var vol = h("input", "dock-range dock-range--short");
    vol.type = "range"; vol.min = 0; vol.max = 100; vol.value = 28;
    vol.addEventListener("input", function () { A.setVolume(vol.value / 100); });

    dock.appendChild(toggle);
    dock.appendChild(bpm);
    dock.appendChild(bpmLabel);
    dock.appendChild(beats);
    dock.appendChild(dots);
    dock.appendChild(h("span", "dock-sep", ""));
    dock.appendChild(h("span", "dock-label", "Volume"));
    dock.appendChild(vol);
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */

  function buildNav() {
    var nav = document.querySelector("#nav");
    ROUTES.forEach(function (r) {
      var b = h("button", "nav-item", '<span class="nav-icon">' + r.icon + "</span>" + r.label);
      b.type = "button";
      b.dataset.route = r.id;
      b.addEventListener("click", function () { go(r.id); });
      nav.appendChild(b);
    });
  }

  function init() {
    buildNav();
    buildDock();
    window.addEventListener("hashchange", render);
    render();

    // Desbloqueia o audio no primeiro gesto do usuario (exigencia dos navegadores).
    var unlock = function () {
      A.ensure();
      document.removeEventListener("pointerdown", unlock);
    };
    document.addEventListener("pointerdown", unlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.PT.app = { go: go, state: state, render: render };
})(typeof window !== "undefined" ? window : globalThis);
