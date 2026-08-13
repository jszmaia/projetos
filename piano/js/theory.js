/*
 * theory.js — motor teorico do Piano Teoria.
 *
 * Tudo aqui e derivado de aritmetica modular sobre 12 semitons e de razoes
 * de frequencia da serie harmonica. Nenhuma tabela e "decorada": as escalas
 * sao padroes de passos, os acordes sao conjuntos de intervalos e a grafia
 * das notas (sustenidos/bemois) e calculada a partir do ciclo de letras.
 */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------------- *
   * 1. Notas, letras e grafia (spelling)
   * ---------------------------------------------------------------- */

  var LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
  var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var LETTER_PT = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };
  var ACC_GLYPH = { "-3": "♭♭♭", "-2": "♭♭", "-1": "♭", "0": "", "1": "♯", "2": "♯♯", "3": "♯♯♯" };

  var SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  /** Cria uma nota "grafada": letra + alteracao. */
  function note(letter, acc) {
    letter = letter.toUpperCase();
    return { letter: letter, acc: acc || 0, pc: mod(LETTER_PC[letter] + (acc || 0), 12) };
  }

  /** Aceita "C", "C#", "Db", "F##", "Bbb", "Sol", "Sib". */
  function parseNote(text) {
    if (!text) return null;
    if (typeof text === "object" && text.letter) return text;
    var s = String(text).trim();
    var letter = null;
    var rest = "";

    var ptKeys = Object.keys(LETTER_PT);
    for (var i = 0; i < ptKeys.length; i++) {
      var pt = LETTER_PT[ptKeys[i]];
      if (s.toLowerCase().indexOf(pt.toLowerCase()) === 0) {
        letter = ptKeys[i];
        rest = s.slice(pt.length);
        break;
      }
    }
    if (!letter) {
      letter = s[0].toUpperCase();
      rest = s.slice(1);
      if (LETTER_PC[letter] === undefined) return null;
    }

    var acc = 0;
    for (var j = 0; j < rest.length; j++) {
      var ch = rest[j];
      if (ch === "#" || ch === "♯") acc += 1;
      else if (ch === "b" || ch === "B" || ch === "♭") acc -= 1;
      else if (ch === "x" || ch === "\u{1D12A}") acc += 2;
    }
    return note(letter, acc);
  }

  function noteName(n, opts) {
    opts = opts || {};
    var base = opts.solfege ? LETTER_PT[n.letter] : n.letter;
    return base + (ACC_GLYPH[String(n.acc)] || (n.acc > 0 ? repeat("#", n.acc) : repeat("b", -n.acc)));
  }

  function repeat(s, n) {
    var out = "";
    for (var i = 0; i < n; i++) out += s;
    return out;
  }

  /**
   * Grafa a classe de altura `pc` usando obrigatoriamente a letra `letter`.
   * E assim que se garante que uma escala de 7 notas use cada letra uma vez.
   */
  function spellWithLetter(pc, letter) {
    var diff = mod(pc - LETTER_PC[letter], 12);
    if (diff > 6) diff -= 12;
    return note(letter, diff);
  }

  function pcName(pc, preferFlats) {
    return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[mod(pc, 12)];
  }

  /* ---------------------------------------------------------------- *
   * 2. Fisica: MIDI, frequencia, cents, serie harmonica
   * ---------------------------------------------------------------- */

  var A4_MIDI = 69;

  function midiToFreq(midi, a4) {
    return (a4 || 440) * Math.pow(2, (midi - A4_MIDI) / 12);
  }

  function freqToMidi(freq, a4) {
    return 12 * Math.log2(freq / (a4 || 440)) + A4_MIDI;
  }

  function ratioToCents(ratio) {
    return 1200 * Math.log2(ratio);
  }

  function centsToRatio(cents) {
    return Math.pow(2, cents / 1200);
  }

  function midiToName(midi, preferFlats) {
    return pcName(mod(midi, 12), preferFlats) + (Math.floor(midi / 12) - 1);
  }

  function nameToMidi(text) {
    var m = String(text).trim().match(/^([A-Ga-g])([#b♯♭]*)(-?\d+)$/);
    if (!m) return null;
    var n = parseNote(m[1] + m[2]);
    return (parseInt(m[3], 10) + 1) * 12 + n.pc;
  }

  /** Harmonico n em relacao ao fundamental: razao n/1, reduzida a uma oitava. */
  function harmonic(n) {
    var cents = ratioToCents(n);
    var folded = mod(cents, 1200);
    var nearest = Math.round(folded / 100) % 12;
    return {
      n: n,
      ratio: n,
      cents: cents,
      centsInOctave: folded,
      octave: Math.floor(cents / 1200),
      nearestPc: nearest,
      deviation: folded - Math.round(folded / 100) * 100
    };
  }

  var JUST_INTERVALS = [
    { ratio: [1, 1], name: "Unissono", et: 0 },
    { ratio: [16, 15], name: "Segunda menor", et: 100 },
    { ratio: [9, 8], name: "Segunda maior", et: 200 },
    { ratio: [6, 5], name: "Terca menor", et: 300 },
    { ratio: [5, 4], name: "Terca maior", et: 400 },
    { ratio: [4, 3], name: "Quarta justa", et: 500 },
    { ratio: [45, 32], name: "Tritono", et: 600 },
    { ratio: [3, 2], name: "Quinta justa", et: 700 },
    { ratio: [8, 5], name: "Sexta menor", et: 800 },
    { ratio: [5, 3], name: "Sexta maior", et: 900 },
    { ratio: [16, 9], name: "Setima menor", et: 1000 },
    { ratio: [15, 8], name: "Setima maior", et: 1100 },
    { ratio: [2, 1], name: "Oitava", et: 1200 }
  ];

  var COMMAS = {
    pitagorico: { ratio: Math.pow(3, 12) / Math.pow(2, 19), label: "Comma pitagorico (3^12 / 2^19)" },
    sintonico: { ratio: 81 / 80, label: "Comma sintonico (81/80)" },
    diesis: { ratio: 128 / 125, label: "Diesis menor (128/125)" }
  };

  /* ---------------------------------------------------------------- *
   * 3. Intervalos
   * ---------------------------------------------------------------- */

  var INTERVALS = [
    { semitones: 0, short: "1J", name: "Unissono justo", degree: 1 },
    { semitones: 1, short: "2m", name: "Segunda menor", degree: 2 },
    { semitones: 2, short: "2M", name: "Segunda maior", degree: 2 },
    { semitones: 3, short: "3m", name: "Terca menor", degree: 3 },
    { semitones: 4, short: "3M", name: "Terca maior", degree: 3 },
    { semitones: 5, short: "4J", name: "Quarta justa", degree: 4 },
    { semitones: 6, short: "4A/5d", name: "Tritono", degree: 4 },
    { semitones: 7, short: "5J", name: "Quinta justa", degree: 5 },
    { semitones: 8, short: "6m", name: "Sexta menor", degree: 6 },
    { semitones: 9, short: "6M", name: "Sexta maior", degree: 6 },
    { semitones: 10, short: "7m", name: "Setima menor", degree: 7 },
    { semitones: 11, short: "7M", name: "Setima maior", degree: 7 },
    { semitones: 12, short: "8J", name: "Oitava justa", degree: 8 }
  ];

  function intervalOf(semitones) {
    return INTERVALS[mod(semitones, 12)];
  }

  /** Vetor intervalar de um conjunto de classes de altura (Forte). */
  function intervalVector(pcs) {
    var v = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < pcs.length; i++) {
      for (var j = i + 1; j < pcs.length; j++) {
        var d = mod(pcs[j] - pcs[i], 12);
        if (d > 6) d = 12 - d;
        v[d - 1]++;
      }
    }
    return v;
  }

  /* ---------------------------------------------------------------- *
   * 4. Catalogo de escalas
   *
   * `steps` = passos em semitons, sempre somando 12.
   * `degrees` = rotulos de grau relativos a escala maior.
   * `why` = por que a escala existe / de onde ela vem.
   * ---------------------------------------------------------------- */

  var SCALES = [
    /* --- Cromatica --------------------------------------------------- */
    {
      id: "cromatica", name: "Cromatica", category: "base",
      steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      degrees: ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"],
      why: "O universo inteiro do temperamento igual: os 12 semitons. Todas as outras escalas sao subconjuntos deste. Serve para conducao cromatica e notas de passagem, nao para definir tonalidade (nao tem centro: todos os passos sao iguais).",
      uses: "Passagens, aproximacoes cromaticas, glissandos."
    },

    /* --- Maior e seus modos ------------------------------------------ */
    {
      id: "jonio", name: "Maior (Jonio)", aliases: ["maior", "ionio", "ionian"], category: "maior",
      steps: [2, 2, 1, 2, 2, 2, 1],
      degrees: ["1", "2", "3", "4", "5", "6", "7"],
      mode: 1, parent: "jonio",
      why: "Sete quintas justas consecutivas (Fa Do Sol Re La Mi Si) reordenadas dentro de uma oitava. E a unica forma de distribuir 7 notas em 12 semitons de modo maximamente uniforme sem repetir letra.",
      uses: "Base da musica ocidental: pop, classico, gospel, MPB.",
      chordQuality: "Imaj7"
    },
    {
      id: "dorico", name: "Dorico", category: "maior",
      steps: [2, 1, 2, 2, 2, 1, 2],
      degrees: ["1", "2", "b3", "4", "5", "6", "b7"],
      mode: 2, parent: "jonio",
      why: "2o modo da maior. Menor com sexta maior: o unico modo menor simetrico (o padrao de passos e um palindromo), o que lhe da um som equilibrado, nem triste nem brilhante.",
      uses: "Funk, jazz modal, rock (So What, Oye Como Va), MPB.",
      chordQuality: "m7"
    },
    {
      id: "frigio", name: "Frigio", category: "maior",
      steps: [1, 2, 2, 2, 1, 2, 2],
      degrees: ["1", "b2", "b3", "4", "5", "b6", "b7"],
      mode: 3, parent: "jonio",
      why: "3o modo da maior. A segunda menor logo no inicio cria tensao imediata contra a tonica.",
      uses: "Flamenco, metal, trilhas de tensao.",
      chordQuality: "m7"
    },
    {
      id: "lidio", name: "Lidio", category: "maior",
      steps: [2, 2, 2, 1, 2, 2, 1],
      degrees: ["1", "2", "3", "#4", "5", "6", "7"],
      mode: 4, parent: "jonio",
      why: "4o modo da maior. E a maior com a 4a aumentada: elimina o unico intervalo instavel que a maior tem contra a tonica (a 4a justa, que 'puxa' para a 3a). Por isso soa mais aberto e flutuante.",
      uses: "Trilhas sonoras, jazz, rock progressivo.",
      chordQuality: "maj7#11"
    },
    {
      id: "mixolidio", name: "Mixolidio", category: "maior",
      steps: [2, 2, 1, 2, 2, 1, 2],
      degrees: ["1", "2", "3", "4", "5", "6", "b7"],
      mode: 5, parent: "jonio",
      why: "5o modo da maior. Maior com setima menor: e a escala do acorde dominante (V7). A 7a menor aproxima o 7o harmonico natural.",
      uses: "Blues, rock, funk, country, jazz.",
      chordQuality: "7"
    },
    {
      id: "eolio", name: "Menor natural (Eolio)", aliases: ["menor", "menor natural", "aeolian"], category: "maior",
      steps: [2, 1, 2, 2, 1, 2, 2],
      degrees: ["1", "2", "b3", "4", "5", "b6", "b7"],
      mode: 6, parent: "jonio",
      why: "6o modo da maior: as mesmas notas da maior, comecando na 6a. Isso e o relativo menor. A terca menor (3 semitons) e a marca do modo menor.",
      uses: "Rock, pop, baladas, musica classica.",
      chordQuality: "m7"
    },
    {
      id: "locrio", name: "Locrio", category: "maior",
      steps: [1, 2, 2, 1, 2, 2, 2],
      degrees: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
      mode: 7, parent: "jonio",
      why: "7o modo da maior. Unico modo sem quinta justa: sua triade e diminuta, entao nao ha um centro tonal estavel.",
      uses: "Acorde m7b5 (meio-diminuto), passagens em jazz.",
      chordQuality: "m7b5"
    },

    /* --- Menor harmonica e modos ------------------------------------- */
    {
      id: "menor-harmonica", name: "Menor harmonica", category: "menor",
      steps: [2, 1, 2, 2, 1, 3, 1],
      degrees: ["1", "2", "b3", "4", "5", "b6", "7"],
      mode: 1, parent: "menor-harmonica",
      why: "Correcao funcional da menor natural: sobe-se a 7a para criar a sensivel (meio tom abaixo da tonica). Isso transforma o v menor em V7 e devolve a cadencia forte V7-i. O custo e a segunda aumentada (3 semitons) entre b6 e 7.",
      uses: "Musica classica, tango, metal neoclassico, musica arabe.",
      chordQuality: "mMaj7"
    },
    {
      id: "locrio-6", name: "Locrio natural 6", category: "menor",
      steps: [1, 2, 2, 1, 3, 1, 2],
      degrees: ["1", "b2", "b3", "4", "b5", "6", "b7"],
      mode: 2, parent: "menor-harmonica", chordQuality: "m7b5",
      why: "2o modo da menor harmonica.", uses: "II meio-diminuto em tonalidade menor."
    },
    {
      id: "jonio-5aum", name: "Jonio #5", category: "menor",
      steps: [2, 2, 1, 3, 1, 2, 1],
      degrees: ["1", "2", "3", "4", "#5", "6", "7"],
      mode: 3, parent: "menor-harmonica", chordQuality: "maj7#5",
      why: "3o modo da menor harmonica.", uses: "Acorde maj7#5."
    },
    {
      id: "dorico-4aum", name: "Dorico #4 (Ucraniana)", aliases: ["ucraniana"], category: "menor",
      steps: [2, 1, 3, 1, 2, 1, 2],
      degrees: ["1", "2", "b3", "#4", "5", "6", "b7"],
      mode: 4, parent: "menor-harmonica", chordQuality: "m7",
      why: "4o modo da menor harmonica.", uses: "Musica do leste europeu, klezmer, blues modal."
    },
    {
      id: "frigio-dominante", name: "Frigio dominante (Espanhola)", aliases: ["espanhola", "andaluza", "hijaz"], category: "menor",
      steps: [1, 3, 1, 2, 1, 2, 2],
      degrees: ["1", "b2", "3", "4", "5", "b6", "b7"],
      mode: 5, parent: "menor-harmonica", chordQuality: "7b9",
      why: "5o modo da menor harmonica. E a escala do V7 em tonalidade menor: tem 3a maior (sensivel do acorde) e b9/b13 (tensoes da tonalidade menor).",
      uses: "Flamenco, metal, musica arabe (maqam Hijaz), rock espanhol."
    },
    {
      id: "lidio-2aum", name: "Lidio #2", category: "menor",
      steps: [3, 1, 2, 1, 2, 2, 1],
      degrees: ["1", "#2", "3", "#4", "5", "6", "7"],
      mode: 6, parent: "menor-harmonica", chordQuality: "maj7#11",
      why: "6o modo da menor harmonica.", uses: "Cor exotica sobre maj7."
    },
    {
      id: "superlocrio-bb7", name: "Superlocrio bb7 (Alterada diminuta)", category: "menor",
      steps: [1, 2, 1, 2, 2, 1, 3],
      degrees: ["1", "b2", "b3", "b4", "b5", "b6", "bb7"],
      mode: 7, parent: "menor-harmonica", chordQuality: "dim7",
      why: "7o modo da menor harmonica.", uses: "Acordes diminutos com tensoes."
    },

    /* --- Menor melodica e modos -------------------------------------- */
    {
      id: "menor-melodica", name: "Menor melodica (jazz)", category: "menor",
      steps: [2, 1, 2, 2, 2, 2, 1],
      degrees: ["1", "2", "b3", "4", "5", "6", "7"],
      mode: 1, parent: "menor-melodica",
      why: "Resolve o salto desconfortavel da menor harmonica: sobe tambem a 6a. Resultado: uma escala maior com a 3a menor. No jazz e usada subindo e descendo (na pratica classica, descia-se como menor natural).",
      uses: "Jazz, bossa, harmonia moderna.",
      chordQuality: "mMaj7"
    },
    {
      id: "dorico-b2", name: "Dorico b2 (Frigio natural 6)", category: "menor",
      steps: [1, 2, 2, 2, 2, 1, 2],
      degrees: ["1", "b2", "b3", "4", "5", "6", "b7"],
      mode: 2, parent: "menor-melodica", chordQuality: "m7",
      why: "2o modo da menor melodica.", uses: "Sussus b9, cor modal."
    },
    {
      id: "lidio-aumentado", name: "Lidio aumentado", category: "menor",
      steps: [2, 2, 2, 2, 1, 2, 1],
      degrees: ["1", "2", "3", "#4", "#5", "6", "7"],
      mode: 3, parent: "menor-melodica", chordQuality: "maj7#5",
      why: "3o modo da menor melodica.", uses: "maj7#5, trilhas, jazz moderno."
    },
    {
      id: "lidio-dominante", name: "Lidio dominante (Acustica)", aliases: ["overtone", "bartok"], category: "menor",
      steps: [2, 2, 2, 1, 2, 1, 2],
      degrees: ["1", "2", "3", "#4", "5", "6", "b7"],
      mode: 4, parent: "menor-melodica", chordQuality: "7#11",
      why: "4o modo da menor melodica. Chamada 'acustica' porque e a escala que mais se aproxima dos harmonicos 8 a 14 da serie natural (o #4 vem do 11o harmonico, o b7 do 7o).",
      uses: "Jazz, Bartok, trilhas, dominantes com #11."
    },
    {
      id: "mixolidio-b6", name: "Mixolidio b6 (Hindu)", category: "menor",
      steps: [2, 2, 1, 2, 1, 2, 2],
      degrees: ["1", "2", "3", "4", "5", "b6", "b7"],
      mode: 5, parent: "menor-melodica", chordQuality: "7b13",
      why: "5o modo da menor melodica.", uses: "V7 que resolve em menor."
    },
    {
      id: "locrio-2", name: "Locrio natural 2 (Semidiminuta)", category: "menor",
      steps: [2, 1, 2, 1, 2, 2, 2],
      degrees: ["1", "2", "b3", "4", "b5", "b6", "b7"],
      mode: 6, parent: "menor-melodica", chordQuality: "m7b5",
      why: "6o modo da menor melodica.", uses: "II meio-diminuto no jazz (melhor que o locrio puro, pois a 9a e natural)."
    },
    {
      id: "alterada", name: "Alterada (Superlocrio)", aliases: ["superlocrio", "diminuta-inteira"], category: "menor",
      steps: [1, 2, 1, 2, 2, 2, 2],
      degrees: ["1", "b9", "#9", "3", "#11", "b13", "b7"],
      mode: 7, parent: "menor-melodica", chordQuality: "7alt",
      why: "7o modo da menor melodica. Contem a 3a e a b7 do dominante mais TODAS as quatro tensoes alteradas (b9, #9, #11, b13). E o som padrao do V7 alterado.",
      uses: "Jazz: qualquer V7alt."
    },

    /* --- Outras heptatonicas ----------------------------------------- */
    {
      id: "maior-harmonica", name: "Maior harmonica", category: "exotica",
      steps: [2, 2, 1, 2, 1, 3, 1],
      degrees: ["1", "2", "3", "4", "5", "b6", "7"],
      why: "Escala maior com a 6a abaixada. E a maior 'emprestando' a b6 do modo menor paralelo.",
      uses: "Harmonia romantica, jazz (IV menor)."
    },
    {
      id: "dupla-harmonica", name: "Dupla harmonica (Bizantina/Arabe)", aliases: ["bizantina", "arabe", "gypsy major"], category: "exotica",
      steps: [1, 3, 1, 2, 1, 3, 1],
      degrees: ["1", "b2", "3", "4", "5", "b6", "7"],
      why: "Duas segundas aumentadas simetricas. E o maqam Hijaz Kar. Simetrica em espelho ao redor da 5a.",
      uses: "Musica do Oriente Medio, metal, trilhas."
    },
    {
      id: "hungara-menor", name: "Hungara menor", aliases: ["cigana menor"], category: "exotica",
      steps: [2, 1, 3, 1, 1, 3, 1],
      degrees: ["1", "2", "b3", "#4", "5", "b6", "7"],
      why: "Menor harmonica com a 4a aumentada: duas segundas aumentadas.",
      uses: "Musica cigana, klezmer, metal."
    },
    {
      id: "napolitana-menor", name: "Napolitana menor", category: "exotica",
      steps: [1, 2, 2, 2, 1, 3, 1],
      degrees: ["1", "b2", "b3", "4", "5", "b6", "7"],
      why: "Menor harmonica com b2 (a nota napolitana).", uses: "Classico, trilhas."
    },
    {
      id: "napolitana-maior", name: "Napolitana maior", category: "exotica",
      steps: [1, 2, 2, 2, 2, 2, 1],
      degrees: ["1", "b2", "b3", "4", "5", "6", "7"],
      why: "Menor melodica com b2.", uses: "Classico, jazz moderno."
    },
    {
      id: "enigmatica", name: "Enigmatica", category: "exotica",
      steps: [1, 3, 2, 2, 2, 1, 1],
      degrees: ["1", "b2", "3", "#4", "#5", "#6", "7"],
      why: "Criada por Verdi como enigma harmonico: mistura semitom inicial com tons inteiros no meio.",
      uses: "Experimental."
    },
    {
      id: "persa", name: "Persa", category: "exotica",
      steps: [1, 3, 1, 1, 2, 3, 1],
      degrees: ["1", "b2", "3", "4", "b5", "b6", "7"],
      why: "Duas segundas aumentadas com tritono: som do maqam persa.", uses: "Trilhas, musica modal oriental."
    },

    /* --- Pentatonicas ------------------------------------------------ */
    {
      id: "pentatonica-maior", name: "Pentatonica maior", category: "pentatonica",
      steps: [2, 2, 3, 2, 3],
      degrees: ["1", "2", "3", "5", "6"],
      why: "Cinco quintas justas consecutivas (Do Sol Re La Mi) reordenadas. Como nao contem semitons nem tritono, nenhuma nota soa errada sobre a harmonia maior: e a escala mais 'segura' que existe.",
      uses: "Pop, country, gospel, MPB, improviso inicial."
    },
    {
      id: "pentatonica-menor", name: "Pentatonica menor", category: "pentatonica",
      steps: [3, 2, 2, 3, 2],
      degrees: ["1", "b3", "4", "5", "b7"],
      why: "5o modo da pentatonica maior (relativa menor). Mesma logica: sem semitons, sem tritono.",
      uses: "Blues, rock, soul, funk. E a base de quase todo solo de rock."
    },
    {
      id: "pentatonica-suspensa", name: "Pentatonica suspensa (Egipcia)", category: "pentatonica",
      steps: [2, 3, 2, 3, 2],
      degrees: ["1", "2", "4", "5", "b7"],
      why: "2o modo da pentatonica maior.", uses: "Sons suspensos, modal."
    },
    {
      id: "man-gong", name: "Man Gong", category: "pentatonica",
      steps: [3, 2, 3, 2, 2],
      degrees: ["1", "b3", "4", "b6", "b7"],
      why: "3o modo da pentatonica maior.", uses: "Cor menor escura."
    },
    {
      id: "ritusen", name: "Ritusen", category: "pentatonica",
      steps: [2, 3, 2, 2, 3],
      degrees: ["1", "2", "4", "5", "6"],
      why: "4o modo da pentatonica maior.", uses: "Musica japonesa, folk."
    },
    {
      id: "hirajoshi", name: "Hirajoshi", category: "pentatonica",
      steps: [2, 1, 4, 1, 4],
      degrees: ["1", "2", "b3", "5", "b6"],
      why: "Pentatonica japonesa com semitons: usa saltos de 4 semitons para criar espaco.",
      uses: "Musica japonesa, trilhas."
    },
    {
      id: "in-sen", name: "In Sen", category: "pentatonica",
      steps: [1, 4, 2, 1, 4],
      degrees: ["1", "b2", "4", "5", "b7"],
      why: "Pentatonica japonesa.", uses: "Trilhas, cor oriental."
    },
    {
      id: "iwato", name: "Iwato", category: "pentatonica",
      steps: [1, 4, 1, 4, 2],
      degrees: ["1", "b2", "4", "b5", "b7"],
      why: "Pentatonica japonesa com tritono.", uses: "Tensao modal."
    },
    {
      id: "kumoi", name: "Kumoi", category: "pentatonica",
      steps: [2, 1, 4, 2, 3],
      degrees: ["1", "2", "b3", "5", "6"],
      why: "Pentatonica menor com 9a e 6a: pentatonica da menor melodica.",
      uses: "Jazz modal, musica japonesa."
    },

    /* --- Blues -------------------------------------------------------- */
    {
      id: "blues-menor", name: "Blues menor", aliases: ["blues"], category: "blues",
      steps: [3, 2, 1, 1, 3, 2],
      degrees: ["1", "b3", "4", "b5", "5", "b7"],
      why: "Pentatonica menor + a 'blue note' b5. Essa nota nao existe no sistema temperado africano original: ela e a aproximacao possivel de alturas entre 4 e 5 que o piano nao consegue tocar exatamente.",
      uses: "Blues, rock, jazz, funk."
    },
    {
      id: "blues-maior", name: "Blues maior", category: "blues",
      steps: [2, 1, 1, 3, 2, 3],
      degrees: ["1", "2", "b3", "3", "5", "6"],
      why: "Pentatonica maior + b3. O atrito b3/3 e o coracao do som de blues maior e do gospel.",
      uses: "Blues maior, country, gospel, rock and roll."
    },
    {
      id: "blues-completa", name: "Blues completa (9 notas)", category: "blues",
      steps: [2, 1, 1, 1, 1, 1, 2, 1, 2],
      degrees: ["1", "2", "b3", "3", "4", "b5", "5", "6", "b7"],
      why: "Uniao da blues maior com a blues menor: e o vocabulario real do pianista de blues, que alterna b3/3 e 4/b5/5 como notas de atrito.",
      uses: "Piano blues, boogie, rock and roll."
    },

    /* --- Simetricas ---------------------------------------------------- */
    {
      id: "tons-inteiros", name: "Tons inteiros", aliases: ["hexatonica"], category: "simetrica",
      steps: [2, 2, 2, 2, 2, 2],
      degrees: ["1", "2", "3", "#4", "#5", "b7"],
      why: "Divide a oitava em 6 partes iguais (12/6 = 2 semitons). So existem 2 escalas de tons inteiros diferentes. Sem quinta justa, sem semitom: nao ha gravidade tonal, tudo flutua.",
      uses: "Impressionismo (Debussy), acordes 7#5, trilhas oniricas."
    },
    {
      id: "diminuta-tom-semitom", name: "Diminuta (tom-semitom)", category: "simetrica",
      steps: [2, 1, 2, 1, 2, 1, 2, 1],
      degrees: ["1", "2", "b3", "4", "b5", "b6", "6", "7"],
      why: "Divide a oitava em 4 partes iguais de 3 semitons, e depois preenche cada uma. So existem 3 escalas diminutas distintas. Se repete a cada terca menor.",
      uses: "Sobre acordes diminutos, jazz, trilhas de suspense."
    },
    {
      id: "diminuta-semitom-tom", name: "Diminuta (semitom-tom)", category: "simetrica",
      steps: [1, 2, 1, 2, 1, 2, 1, 2],
      degrees: ["1", "b9", "#9", "3", "#11", "5", "13", "b7"],
      why: "Rotacao da anterior. Sobre um dominante fornece b9, #9, #11 e 13 (mas quinta justa), o oposto complementar da alterada.",
      uses: "V7b9 no jazz."
    },
    {
      id: "aumentada", name: "Aumentada", category: "simetrica",
      steps: [3, 1, 3, 1, 3, 1],
      degrees: ["1", "b3", "3", "5", "#5", "7"],
      why: "Divide a oitava em 3 partes iguais de 4 semitons e preenche. Se repete a cada terca maior.",
      uses: "Jazz moderno (Coltrane), trilhas."
    },

    /* --- Bebop --------------------------------------------------------- */
    {
      id: "bebop-dominante", name: "Bebop dominante", category: "bebop",
      steps: [2, 2, 1, 2, 2, 1, 1, 1],
      degrees: ["1", "2", "3", "4", "5", "6", "b7", "7"],
      why: "Mixolidio + 7a maior de passagem. Com 8 notas, as notas do acorde caem nos tempos fortes quando se toca em colcheias. E uma solucao ritmica, nao harmonica.",
      uses: "Linhas de bebop sobre V7."
    },
    {
      id: "bebop-maior", name: "Bebop maior", category: "bebop",
      steps: [2, 2, 1, 2, 1, 1, 2, 1],
      degrees: ["1", "2", "3", "4", "5", "#5", "6", "7"],
      why: "Maior + #5 de passagem, pela mesma razao ritmica.",
      uses: "Linhas sobre Imaj7 e I6."
    },
    {
      id: "bebop-dorico", name: "Bebop dorico (menor)", category: "bebop",
      steps: [2, 1, 1, 1, 2, 2, 1, 2],
      degrees: ["1", "2", "b3", "3", "4", "5", "6", "b7"],
      why: "Dorico + 3a maior de passagem.",
      uses: "Linhas sobre im7."
    },
    {
      id: "bebop-melodica", name: "Bebop menor melodica", category: "bebop",
      steps: [2, 1, 2, 2, 1, 1, 2, 1],
      degrees: ["1", "2", "b3", "4", "5", "#5", "6", "7"],
      why: "Menor melodica + #5 de passagem.",
      uses: "Linhas sobre mMaj7 e m6."
    },

    /* --- Outras ---------------------------------------------------------- */
    {
      id: "prometeu", name: "Prometeu (mistica)", category: "exotica",
      steps: [2, 2, 2, 3, 1, 2],
      degrees: ["1", "2", "3", "#4", "6", "b7"],
      why: "Escala de Scriabin, derivada do 'acorde mistico' empilhado em quartas.",
      uses: "Impressionismo, experimental."
    }
  ];

  var SCALE_BY_ID = {};
  SCALES.forEach(function (s) {
    SCALE_BY_ID[s.id] = s;
    (s.aliases || []).forEach(function (a) {
      if (!SCALE_BY_ID[a]) SCALE_BY_ID[a] = s;
    });
  });

  function getScale(id) {
    return SCALE_BY_ID[id] || SCALE_BY_ID[String(id).toLowerCase()] || null;
  }

  /** Passos -> intervalos acumulados a partir da tonica. */
  function stepsToIntervals(steps) {
    var out = [0];
    var acc = 0;
    for (var i = 0; i < steps.length - 1; i++) {
      acc += steps[i];
      out.push(acc);
    }
    return out;
  }

  /**
   * Constroi a escala em uma tonica.
   * Retorna notas grafadas quando possivel (7 notas -> uma letra por grau).
   */
  function buildScale(tonic, scaleId) {
    var scale = typeof scaleId === "string" ? getScale(scaleId) : scaleId;
    if (!scale) return null;
    var root = parseNote(tonic);
    if (!root) return null;

    var intervals = stepsToIntervals(scale.steps);
    var pcs = intervals.map(function (iv) { return mod(root.pc + iv, 12); });
    var notes;

    if (scale.steps.length === 7) {
      // Heptatonica: uma letra por grau, na ordem.
      var startIdx = LETTERS.indexOf(root.letter);
      notes = pcs.map(function (pc, i) {
        return spellWithLetter(pc, LETTERS[(startIdx + i) % 7]);
      });
    } else {
      var flats = preferFlats(root, scale);
      notes = pcs.map(function (pc, i) {
        var deg = scale.degrees[i] || "";
        // Tenta respeitar o rotulo do grau (ex.: "b3" prefere bemol).
        if (deg.indexOf("b") === 0) return spellPreferring(pc, -1);
        if (deg.indexOf("#") === 0) return spellPreferring(pc, 1);
        return spellPreferring(pc, flats ? -1 : 1);
      });
    }

    return {
      scale: scale,
      tonic: root,
      pcs: pcs,
      intervals: intervals,
      notes: notes,
      names: notes.map(function (n) { return noteName(n); }),
      degrees: scale.degrees,
      steps: scale.steps,
      vector: intervalVector(pcs)
    };
  }

  function spellPreferring(pc, direction) {
    // Escolhe a grafia com menos alteracoes na direcao pedida.
    var best = null;
    for (var i = 0; i < LETTERS.length; i++) {
      var cand = spellWithLetter(pc, LETTERS[i]);
      if (Math.abs(cand.acc) > 1) continue;
      if (!best) { best = cand; continue; }
      var candScore = (cand.acc === 0 ? -2 : 0) + (Math.sign(cand.acc) === direction ? -1 : 0);
      var bestScore = (best.acc === 0 ? -2 : 0) + (Math.sign(best.acc) === direction ? -1 : 0);
      if (candScore < bestScore) best = cand;
    }
    return best || note("C", 0);
  }

  function preferFlats(root, scale) {
    if (root.acc < 0) return true;
    if (root.acc > 0) return false;
    return ["F"].indexOf(root.letter) >= 0 || (scale && /menor|blues|frigio|locrio|eolio/.test(scale.id));
  }

  /* ---------------------------------------------------------------- *
   * 5. Acordes
   * ---------------------------------------------------------------- */

  var CHORDS = [
    { id: "maj", symbol: "", name: "Maior", intervals: [0, 4, 7], formula: "1 3 5", family: "triade" },
    { id: "min", symbol: "m", name: "Menor", intervals: [0, 3, 7], formula: "1 b3 5", family: "triade" },
    { id: "dim", symbol: "dim", name: "Diminuto", intervals: [0, 3, 6], formula: "1 b3 b5", family: "triade" },
    { id: "aug", symbol: "aug", name: "Aumentado", intervals: [0, 4, 8], formula: "1 3 #5", family: "triade" },
    { id: "sus2", symbol: "sus2", name: "Suspenso 2", intervals: [0, 2, 7], formula: "1 2 5", family: "triade" },
    { id: "sus4", symbol: "sus4", name: "Suspenso 4", intervals: [0, 5, 7], formula: "1 4 5", family: "triade" },
    { id: "5", symbol: "5", name: "Power chord", intervals: [0, 7], formula: "1 5", family: "triade" },

    { id: "6", symbol: "6", name: "Maior com sexta", intervals: [0, 4, 7, 9], formula: "1 3 5 6", family: "tetrade" },
    { id: "m6", symbol: "m6", name: "Menor com sexta", intervals: [0, 3, 7, 9], formula: "1 b3 5 6", family: "tetrade" },
    { id: "maj7", symbol: "maj7", name: "Maior com setima maior", intervals: [0, 4, 7, 11], formula: "1 3 5 7", family: "tetrade" },
    { id: "7", symbol: "7", name: "Dominante", intervals: [0, 4, 7, 10], formula: "1 3 5 b7", family: "tetrade" },
    { id: "m7", symbol: "m7", name: "Menor com setima", intervals: [0, 3, 7, 10], formula: "1 b3 5 b7", family: "tetrade" },
    { id: "mMaj7", symbol: "mMaj7", name: "Menor com setima maior", intervals: [0, 3, 7, 11], formula: "1 b3 5 7", family: "tetrade" },
    { id: "m7b5", symbol: "m7b5", name: "Meio-diminuto", intervals: [0, 3, 6, 10], formula: "1 b3 b5 b7", family: "tetrade" },
    { id: "dim7", symbol: "dim7", name: "Diminuto com setima", intervals: [0, 3, 6, 9], formula: "1 b3 b5 bb7", family: "tetrade" },
    { id: "7sus4", symbol: "7sus4", name: "Dominante suspenso", intervals: [0, 5, 7, 10], formula: "1 4 5 b7", family: "tetrade" },
    { id: "aug7", symbol: "7#5", name: "Dominante com quinta aumentada", intervals: [0, 4, 8, 10], formula: "1 3 #5 b7", family: "tetrade" },
    { id: "maj7#5", symbol: "maj7#5", name: "Maior setima com quinta aumentada", intervals: [0, 4, 8, 11], formula: "1 3 #5 7", family: "tetrade" },

    { id: "add9", symbol: "add9", name: "Com nona acrescentada", intervals: [0, 4, 7, 14], formula: "1 3 5 9", family: "extensao" },
    { id: "9", symbol: "9", name: "Dominante com nona", intervals: [0, 4, 7, 10, 14], formula: "1 3 5 b7 9", family: "extensao" },
    { id: "maj9", symbol: "maj9", name: "Maior com nona", intervals: [0, 4, 7, 11, 14], formula: "1 3 5 7 9", family: "extensao" },
    { id: "m9", symbol: "m9", name: "Menor com nona", intervals: [0, 3, 7, 10, 14], formula: "1 b3 5 b7 9", family: "extensao" },
    { id: "11", symbol: "11", name: "Dominante com onze", intervals: [0, 7, 10, 14, 17], formula: "1 5 b7 9 11", family: "extensao" },
    { id: "m11", symbol: "m11", name: "Menor com onze", intervals: [0, 3, 7, 10, 14, 17], formula: "1 b3 5 b7 9 11", family: "extensao" },
    { id: "13", symbol: "13", name: "Dominante com treze", intervals: [0, 4, 7, 10, 14, 21], formula: "1 3 5 b7 9 13", family: "extensao" },
    { id: "maj13", symbol: "maj13", name: "Maior com treze", intervals: [0, 4, 7, 11, 14, 21], formula: "1 3 5 7 9 13", family: "extensao" },
    { id: "7b9", symbol: "7b9", name: "Dominante com nona menor", intervals: [0, 4, 7, 10, 13], formula: "1 3 5 b7 b9", family: "alterado" },
    { id: "7#9", symbol: "7#9", name: "Dominante com nona aumentada", intervals: [0, 4, 7, 10, 15], formula: "1 3 5 b7 #9", family: "alterado" },
    { id: "7#11", symbol: "7#11", name: "Dominante com onze aumentada", intervals: [0, 4, 7, 10, 18], formula: "1 3 5 b7 #11", family: "alterado" },
    { id: "7b13", symbol: "7b13", name: "Dominante com treze menor", intervals: [0, 4, 7, 10, 20], formula: "1 3 5 b7 b13", family: "alterado" },
    { id: "7alt", symbol: "7alt", name: "Dominante alterado", intervals: [0, 4, 10, 13, 15, 18, 20], formula: "1 3 b7 b9 #9 #11 b13", family: "alterado" },
    { id: "maj7#11", symbol: "maj7#11", name: "Maior setima com onze aumentada", intervals: [0, 4, 7, 11, 18], formula: "1 3 5 7 #11", family: "alterado" },
    { id: "6/9", symbol: "6/9", name: "Sexta com nona", intervals: [0, 4, 7, 9, 14], formula: "1 3 5 6 9", family: "extensao" }
  ];

  var CHORD_BY_ID = {};
  CHORDS.forEach(function (c) { CHORD_BY_ID[c.id] = c; });

  function getChord(id) { return CHORD_BY_ID[id] || null; }

  /**
   * Numero do grau na formula ("b3" -> 3, "#11" -> 11) convertido em
   * deslocamento de letra: 1->0, 3->2, 7->6, 9->1, 11->3, 13->5.
   */
  function letterOffsetForDegree(token) {
    var m = String(token).match(/(\d+)/);
    if (!m) return null;
    return (parseInt(m[1], 10) - 1) % 7;
  }

  function buildChord(root, chordId, inversion) {
    var chord = typeof chordId === "string" ? getChord(chordId) : chordId;
    if (!chord) return null;
    var r = parseNote(root);
    var startIdx = LETTERS.indexOf(r.letter);
    var tokens = chord.formula.split(/\s+/);

    // Grafia por grau: cada nota recebe a letra que a formula exige, de modo
    // que Cm seja C E♭ G (e nao C D♯ G) e Cdim7 seja C E♭ G♭ B𝄫.
    var rootNotes = chord.intervals.map(function (iv, i) {
      var pc = mod(r.pc + iv, 12);
      var off = letterOffsetForDegree(tokens[i]);
      if (off === null) return spellPreferring(pc, r.acc < 0 ? -1 : 1);
      var cand = spellWithLetter(pc, LETTERS[(startIdx + off) % 7]);
      // Alteracoes triplas indicam grafia impraticavel: cai para a simples.
      return Math.abs(cand.acc) > 2 ? spellPreferring(pc, r.acc < 0 ? -1 : 1) : cand;
    });

    var intervals = chord.intervals.slice();
    var notes = rootNotes.slice();
    inversion = inversion || 0;
    for (var i = 0; i < inversion; i++) {
      intervals.push(intervals.shift() + 12);
      notes.push(notes.shift());
    }
    return {
      chord: chord,
      root: r,
      intervals: intervals,
      pcs: intervals.map(function (iv) { return mod(r.pc + iv, 12); }),
      notes: notes,
      names: notes.map(function (n) { return noteName(n); }),
      symbol: noteName(r) + chord.symbol,
      inversion: inversion
    };
  }

  /** Identifica acordes que contem exatamente esse conjunto de classes. */
  function identifyChord(pcs) {
    var set = uniq(pcs.map(function (p) { return mod(p, 12); })).sort(function (a, b) { return a - b; });
    var results = [];
    for (var root = 0; root < 12; root++) {
      for (var c = 0; c < CHORDS.length; c++) {
        var chordPcs = uniq(CHORDS[c].intervals.map(function (iv) { return mod(root + iv, 12); })).sort(function (a, b) { return a - b; });
        if (chordPcs.length === set.length && chordPcs.every(function (v, i) { return v === set[i]; })) {
          results.push({ root: root, chord: CHORDS[c], symbol: SHARP_NAMES[root] + CHORDS[c].symbol });
        }
      }
    }
    return results;
  }

  function uniq(arr) {
    var seen = {};
    return arr.filter(function (v) {
      if (seen[v]) return false;
      seen[v] = 1;
      return true;
    });
  }

  /* ---------------------------------------------------------------- *
   * 6. Harmonizacao (campo harmonico)
   * ---------------------------------------------------------------- */

  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

  /** Empilha tercas sobre cada grau da escala. size = 3 (triades) ou 4 (tetrades). */
  function harmonize(built, size) {
    size = size || 3;
    if (!built || built.pcs.length !== 7) return [];
    var out = [];
    for (var i = 0; i < 7; i++) {
      var tones = [];
      var iv = [];
      for (var k = 0; k < size; k++) {
        var idx = (i + 2 * k) % 7;
        var octaves = Math.floor((i + 2 * k) / 7);
        tones.push(built.notes[idx]);
        iv.push(built.intervals[idx] + 12 * octaves - built.intervals[i]);
      }
      var normalized = iv.map(function (v) { return mod(v, 12); });
      var quality = matchQuality(iv);
      out.push({
        degree: i + 1,
        roman: romanFor(ROMAN[i], quality),
        root: built.notes[i],
        notes: tones,
        names: tones.map(function (n) { return noteName(n); }),
        pcs: normalized.map(function (v) { return mod(built.pcs[i] + v, 12); }),
        quality: quality,
        symbol: noteName(built.notes[i]) + (quality ? quality.symbol : "?"),
        function: harmonicFunction(i + 1)
      });
    }
    return out;
  }

  function matchQuality(intervals) {
    var norm = uniq(intervals.map(function (v) { return mod(v, 12); })).sort(function (a, b) { return a - b; });
    for (var i = 0; i < CHORDS.length; i++) {
      var c = CHORDS[i];
      var ci = uniq(c.intervals.map(function (v) { return mod(v, 12); })).sort(function (a, b) { return a - b; });
      if (ci.length === norm.length && ci.every(function (v, k) { return v === norm[k]; })) return c;
    }
    return null;
  }

  function romanFor(numeral, quality) {
    if (!quality) return numeral;
    var minorish = ["min", "m7", "dim", "dim7", "m7b5", "m6", "mMaj7"].indexOf(quality.id) >= 0;
    var base = minorish ? numeral.toLowerCase() : numeral;
    var suffix = { dim: "°", dim7: "°7", m7b5: "ø7", aug: "+", "7": "7", maj7: "maj7", m7: "7", "6": "6", m6: "6", mMaj7: "maj7" }[quality.id] || "";
    return base + suffix;
  }

  function harmonicFunction(degree) {
    if (degree === 1 || degree === 6 || degree === 3) return "Tonica";
    if (degree === 2 || degree === 4) return "Subdominante";
    return "Dominante";
  }

  /* ---------------------------------------------------------------- *
   * 7. Ciclo de quintas e armaduras
   * ---------------------------------------------------------------- */

  var SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
  var FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

  /** Conta acidentes da armadura a partir da escala maior grafada. */
  function keySignature(tonic) {
    var built = buildScale(tonic, "jonio");
    if (!built) return null;
    var sharps = 0, flats = 0, list = [];
    built.notes.forEach(function (n) {
      if (n.acc > 0) { sharps += n.acc; list.push(noteName(n)); }
      if (n.acc < 0) { flats += -n.acc; list.push(noteName(n)); }
    });
    return {
      tonic: built.tonic,
      count: sharps || flats,
      type: sharps ? "sustenidos" : flats ? "bemois" : "nenhum",
      accidentals: list,
      relativeMinor: built.notes[5],
      order: sharps ? SHARP_ORDER.slice(0, sharps) : FLAT_ORDER.slice(0, flats)
    };
  }

  /** Circulo das quintas: 12 posicoes partindo de Do, andando de 7 semitons. */
  function circleOfFifths() {
    var majors = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
    return majors.map(function (name, i) {
      var sig = keySignature(name);
      return {
        index: i,
        major: name,
        minor: noteName(sig.relativeMinor) + "m",
        signature: sig,
        pc: parseNote(name).pc,
        angle: (i * 30 - 90) * Math.PI / 180
      };
    });
  }

  /* ---------------------------------------------------------------- *
   * 8. Utilidades de comparacao
   * ---------------------------------------------------------------- */

  /** Escalas que contem todas as notas do acorde dado. */
  function scalesForChord(rootPc, chordIntervals) {
    var target = uniq(chordIntervals.map(function (iv) { return mod(rootPc + iv, 12); }));
    return SCALES.filter(function (s) {
      var pcs = stepsToIntervals(s.steps).map(function (iv) { return mod(rootPc + iv, 12); });
      return target.every(function (t) { return pcs.indexOf(t) >= 0; });
    });
  }

  /** Diferenca entre duas escalas na mesma tonica. */
  function compareScales(tonic, idA, idB) {
    var a = buildScale(tonic, idA);
    var b = buildScale(tonic, idB);
    if (!a || !b) return null;
    return {
      a: a, b: b,
      onlyA: a.pcs.filter(function (p) { return b.pcs.indexOf(p) < 0; }),
      onlyB: b.pcs.filter(function (p) { return a.pcs.indexOf(p) < 0; }),
      common: a.pcs.filter(function (p) { return b.pcs.indexOf(p) >= 0; })
    };
  }

  global.PT = global.PT || {};
  global.PT.theory = {
    LETTERS: LETTERS, LETTER_PC: LETTER_PC, LETTER_PT: LETTER_PT,
    SHARP_NAMES: SHARP_NAMES, FLAT_NAMES: FLAT_NAMES,
    SCALES: SCALES, CHORDS: CHORDS, INTERVALS: INTERVALS,
    JUST_INTERVALS: JUST_INTERVALS, COMMAS: COMMAS,
    SHARP_ORDER: SHARP_ORDER, FLAT_ORDER: FLAT_ORDER,
    mod: mod, note: note, parseNote: parseNote, noteName: noteName, pcName: pcName,
    spellWithLetter: spellWithLetter,
    midiToFreq: midiToFreq, freqToMidi: freqToMidi, midiToName: midiToName, nameToMidi: nameToMidi,
    ratioToCents: ratioToCents, centsToRatio: centsToRatio, harmonic: harmonic,
    intervalOf: intervalOf, intervalVector: intervalVector,
    getScale: getScale, buildScale: buildScale, stepsToIntervals: stepsToIntervals,
    getChord: getChord, buildChord: buildChord, identifyChord: identifyChord,
    harmonize: harmonize, keySignature: keySignature, circleOfFifths: circleOfFifths,
    scalesForChord: scalesForChord, compareScales: compareScales
  };
})(typeof window !== "undefined" ? window : globalThis);
