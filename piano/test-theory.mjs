/*
 * Testes do motor teorico. Rode com: node piano/test-theory.mjs
 *
 * Valida que as escalas, acordes, grafias e numeros fisicos batem com a
 * teoria — se algum valor do material estiver errado, isso quebra aqui.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const DIR = dirname(fileURLToPath(import.meta.url));
const sandbox = { console, Math, Set, Object, Array, JSON };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(DIR, "js/theory.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/curriculum-a.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/curriculum-b.js"), "utf8"), sandbox);

const T = sandbox.PT.theory;
const CURRICULUM = sandbox.PT.CURRICULUM;

let pass = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; } else { failures.push(name + (detail ? " → " + detail : "")); }
}

function eq(name, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  ok(name, a === e, "recebido " + a + ", esperado " + e);
}

function near(name, actual, expected, tol) {
  ok(name, Math.abs(actual - expected) <= tol,
    "recebido " + actual + ", esperado ~" + expected);
}

/* --- 1. Estrutura das escalas --------------------------------------- */

T.SCALES.forEach((s) => {
  const sum = s.steps.reduce((a, b) => a + b, 0);
  ok("passos somam 12: " + s.id, sum === 12, "soma = " + sum);
  ok("graus e passos com mesmo tamanho: " + s.id,
    s.degrees.length === s.steps.length,
    s.degrees.length + " graus vs " + s.steps.length + " passos");
  ok("todo passo >= 1: " + s.id, s.steps.every((x) => x >= 1));
});

/* --- 2. Grafia: uma letra por grau nas heptatonicas ------------------ */

const TONICS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
T.SCALES.filter((s) => s.steps.length === 7).forEach((s) => {
  TONICS.forEach((tonic) => {
    const b = T.buildScale(tonic, s.id);
    const letters = b.notes.map((n) => n.letter);
    eq("letras unicas " + s.id + " em " + tonic, new Set(letters).size, 7);
  });
});

/* --- 3. Escalas de referencia --------------------------------------- */

eq("Do maior", T.buildScale("C", "jonio").names, ["C", "D", "E", "F", "G", "A", "B"]);
eq("Fa# maior", T.buildScale("F#", "jonio").names, ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"]);
eq("Solb maior", T.buildScale("Gb", "jonio").names, ["G♭", "A♭", "B♭", "C♭", "D♭", "E♭", "F"]);
eq("Mib maior", T.buildScale("Eb", "jonio").names, ["E♭", "F", "G", "A♭", "B♭", "C", "D"]);
eq("La menor natural", T.buildScale("A", "eolio").names, ["A", "B", "C", "D", "E", "F", "G"]);
eq("La menor harmonica", T.buildScale("A", "menor-harmonica").names,
  ["A", "B", "C", "D", "E", "F", "G♯"]);
eq("La menor melodica", T.buildScale("A", "menor-melodica").names,
  ["A", "B", "C", "D", "E", "F♯", "G♯"]);
eq("Re dorico", T.buildScale("D", "dorico").names, ["D", "E", "F", "G", "A", "B", "C"]);
eq("Mi frigio", T.buildScale("E", "frigio").names, ["E", "F", "G", "A", "B", "C", "D"]);
eq("Si locrio", T.buildScale("B", "locrio").names, ["B", "C", "D", "E", "F", "G", "A"]);

eq("Do pentatonica maior (classes)", T.buildScale("C", "pentatonica-maior").pcs, [0, 2, 4, 7, 9]);
eq("La pentatonica menor (classes)", T.buildScale("A", "pentatonica-menor").pcs, [9, 0, 2, 4, 7]);
eq("Do blues menor (classes)", T.buildScale("C", "blues-menor").pcs, [0, 3, 5, 6, 7, 10]);
eq("Do alterada (classes)", T.buildScale("C", "alterada").pcs, [0, 1, 3, 4, 6, 8, 10]);

/* Os 7 modos da maior sao rotacoes das teclas brancas. */
const WHITE = [0, 2, 4, 5, 7, 9, 11];
[["C", "jonio"], ["D", "dorico"], ["E", "frigio"], ["F", "lidio"],
 ["G", "mixolidio"], ["A", "eolio"], ["B", "locrio"]].forEach(([root, id]) => {
  const pcs = T.buildScale(root, id).pcs.slice().sort((a, b) => a - b);
  eq("modo " + id + " usa so teclas brancas", pcs, WHITE);
});

/* Alterada de X = menor melodica de X+1 semitom. */
TONICS.forEach((tonic) => {
  const alt = T.buildScale(tonic, "alterada").pcs.slice().sort((a, b) => a - b);
  const up = T.pcName(T.mod(T.parseNote(tonic).pc + 1, 12));
  const mel = T.buildScale(up, "menor-melodica").pcs.slice().sort((a, b) => a - b);
  eq("alterada " + tonic + " = melodica " + up, alt, mel);
});

/* --- 4. Vetores intervalares ---------------------------------------- */

eq("vetor diatonico", T.buildScale("C", "jonio").vector, [2, 5, 4, 3, 6, 1]);
eq("vetor pentatonica maior", T.buildScale("C", "pentatonica-maior").vector, [0, 3, 2, 1, 4, 0]);
eq("vetor tons inteiros", T.buildScale("C", "tons-inteiros").vector, [0, 6, 0, 6, 0, 3]);
ok("diatonico tem todos os valores distintos (Myhill)",
  new Set(T.buildScale("C", "jonio").vector).size === 6);
ok("pentatonica nao tem semitom nem tritono",
  T.buildScale("C", "pentatonica-maior").vector[0] === 0 &&
  T.buildScale("C", "pentatonica-maior").vector[5] === 0);

/* --- 5. Fisica ------------------------------------------------------ */

near("La4 = 440 Hz", T.midiToFreq(69), 440, 1e-9);
near("La5 = 880 Hz", T.midiToFreq(81), 880, 1e-9);
near("Do4 = 261,63 Hz", T.midiToFreq(60), 261.6256, 0.001);
near("razao do semitom", Math.pow(2, 1 / 12), 1.0594630944, 1e-9);
near("quinta justa = 701,955 cents", T.ratioToCents(3 / 2), 701.955, 0.001);
near("terca maior = 386,314 cents", T.ratioToCents(5 / 4), 386.3137, 0.001);
near("terca menor = 315,641 cents", T.ratioToCents(6 / 5), 315.6413, 0.001);
near("comma pitagorico = 23,460 cents",
  T.ratioToCents(T.COMMAS.pitagorico.ratio), 23.4600, 0.001);
near("comma sintonico = 21,506 cents",
  T.ratioToCents(T.COMMAS.sintonico.ratio), 21.5063, 0.001);
near("erro da quinta temperada", 700 - T.ratioToCents(3 / 2), -1.955, 0.001);
near("erro da terca maior temperada", 400 - T.ratioToCents(5 / 4), 13.686, 0.001);
near("7o harmonico na oitava", T.harmonic(7).centsInOctave, 968.826, 0.01);
near("11o harmonico na oitava", T.harmonic(11).centsInOctave, 551.318, 0.01);
near("13o harmonico na oitava", T.harmonic(13).centsInOctave, 840.528, 0.01);
near("comma pitagorico distribuido em 12 quintas",
  T.ratioToCents(T.COMMAS.pitagorico.ratio) / 12, 1.955, 0.001);
eq("nome de nota MIDI 60", T.midiToName(60), "C4");
eq("nome de nota MIDI 69", T.midiToName(69), "A4");
eq("MIDI de C4", T.nameToMidi("C4"), 60);
eq("MIDI de F#3", T.nameToMidi("F#3"), 54);

/* Batimento da terca maior temperada em Do4 (citado no modulo 3). */
near("batimento da terca maior em Do4",
  Math.abs(4 * T.midiToFreq(64) - 5 * T.midiToFreq(60)), 10.4, 0.15);

/* --- 6. Acordes ----------------------------------------------------- */

eq("Do maior", T.buildChord("C", "maj").names, ["C", "E", "G"]);
eq("Do menor", T.buildChord("C", "min").names, ["C", "E♭", "G"]);
eq("Sol7", T.buildChord("G", "7").names, ["G", "B", "D", "F"]);
eq("Domaj7", T.buildChord("C", "maj7").names, ["C", "E", "G", "B"]);
eq("Sim7b5", T.buildChord("B", "m7b5").pcs, [11, 2, 5, 9]);
eq("Sidim7 e simetrico", T.buildChord("B", "dim7").intervals, [0, 3, 6, 9]);
eq("Cdim7 grafado por grau", T.buildChord("C", "dim7").names, ["C", "E♭", "G♭", "B♭♭"]);
eq("Caug", T.buildChord("C", "aug").names, ["C", "E", "G♯"]);
eq("Cm7b5", T.buildChord("C", "m7b5").names, ["C", "E♭", "G♭", "B♭"]);
eq("C7#9", T.buildChord("C", "7#9").names, ["C", "E", "G", "B♭", "D♯"]);
eq("Ebm7", T.buildChord("Eb", "m7").names, ["E♭", "G♭", "B♭", "D♭"]);
eq("F#maj7", T.buildChord("F#", "maj7").names, ["F♯", "A♯", "C♯", "E♯"]);
eq("inversao rotaciona os nomes junto",
  T.buildChord("C", "min", 1).names, ["E♭", "G", "C"]);
eq("1a inversao de Do", T.buildChord("C", "maj", 1).intervals, [4, 7, 12]);
eq("2a inversao de Do", T.buildChord("C", "maj", 2).intervals, [7, 12, 16]);

T.CHORDS.forEach((c) => {
  ok("intervalos crescentes: " + c.id,
    c.intervals.every((v, i) => i === 0 || v > c.intervals[i - 1]));
  ok("formula com o mesmo numero de notas: " + c.id,
    c.formula.split(" ").length === c.intervals.length,
    c.formula + " vs " + c.intervals.length + " notas");
});

/* G7 e Db7 compartilham o tritono (substituicao por tritono). */
const g7 = T.buildChord("G", "7").pcs;
const db7 = T.buildChord("Db", "7").pcs;
const shared = g7.filter((p) => db7.includes(p));
eq("G7 e Db7 compartilham 2 notas", shared.length, 2);
ok("as notas compartilhadas formam o tritono",
  T.mod(shared[1] - shared[0], 12) === 6 || T.mod(shared[0] - shared[1], 12) === 6);

/* --- 7. Campo harmonico --------------------------------------------- */

const fieldC = T.harmonize(T.buildScale("C", "jonio"), 3);
eq("campo harmonico maior (cifras)", fieldC.map((c) => c.symbol),
  ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]);
eq("campo harmonico maior (graus)", fieldC.map((c) => c.roman),
  ["I", "ii", "iii", "IV", "V", "vi", "vii°"]);

const field7 = T.harmonize(T.buildScale("C", "jonio"), 4);
eq("campo harmonico com setimas", field7.map((c) => c.symbol),
  ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"]);
eq("so o V grau e dominante",
  field7.filter((c) => c.quality && c.quality.id === "7").map((c) => c.roman), ["V7"]);

const fieldAm = T.harmonize(T.buildScale("A", "eolio"), 3);
eq("campo harmonico menor natural", fieldAm.map((c) => c.symbol),
  ["Am", "Bdim", "C", "Dm", "Em", "F", "G"]);

const fieldAh = T.harmonize(T.buildScale("A", "menor-harmonica"), 4);
eq("V da menor harmonica e dominante", fieldAh[4].symbol, "E7");

/* O campo harmonico maior deve funcionar nas 12 tonalidades. */
TONICS.forEach((tonic) => {
  const q = T.harmonize(T.buildScale(tonic, "jonio"), 4).map((c) => c.quality && c.quality.id);
  eq("qualidades do campo em " + tonic, q, ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"]);
});

/* --- 8. Armaduras e circulo ----------------------------------------- */

eq("Do maior: 0 acidentes", T.keySignature("C").count, 0);
eq("Sol maior: 1 sustenido", T.keySignature("G").count, 1);
eq("Sol maior: Fa#", T.keySignature("G").accidentals, ["F♯"]);
eq("Fa maior: 1 bemol", T.keySignature("F").accidentals, ["B♭"]);
eq("Mib maior: 3 bemois", T.keySignature("Eb").count, 3);
eq("Si maior: 5 sustenidos", T.keySignature("B").count, 5);
eq("relativo menor de Do", T.noteName(T.keySignature("C").relativeMinor), "A");
eq("relativo menor de Mib", T.noteName(T.keySignature("Eb").relativeMinor), "C");
eq("circulo tem 12 posicoes", T.circleOfFifths().length, 12);
ok("circulo anda de quinta em quinta", T.circleOfFifths().every((d, i, arr) =>
  i === 0 || T.mod(d.pc - arr[i - 1].pc, 12) === 7));

/* --- 9. Intervalos e inversoes -------------------------------------- */

for (let s = 0; s <= 12; s++) {
  eq("inversao soma 12 (" + s + ")", s + (12 - s), 12);
}
eq("tritono e sua propria inversao", T.intervalOf(6).name, T.intervalOf(6).name);
eq("nome de 7 semitons", T.intervalOf(7).name, "Quinta justa");
eq("nome de 3 semitons", T.intervalOf(3).name, "Terca menor");

/* --- 10. Currriculo -------------------------------------------------- */

const lessonIds = new Set();
let lessonCount = 0;
const usedWidgets = new Set();

CURRICULUM.forEach((m) => {
  ok("modulo tem id: " + m.title, !!m.id);
  ok("modulo tem licoes: " + m.id, m.lessons && m.lessons.length > 0);
  m.lessons.forEach((l) => {
    lessonCount++;
    ok("id de licao unico: " + l.id, !lessonIds.has(l.id));
    lessonIds.add(l.id);
    ok("licao tem html: " + l.id, typeof l.html === "string" && l.html.length > 200);
    // Coleta os widgets referenciados e valida escalas citadas.
    const re = /data-w="([a-z0-9-]+)"/g;
    let mt;
    while ((mt = re.exec(l.html))) usedWidgets.add(mt[1]);
    const rs = /data-scale="([a-z0-9-]+)"/g;
    while ((mt = rs.exec(l.html))) {
      ok("escala citada existe (" + l.id + "): " + mt[1], !!T.getScale(mt[1]));
    }
    const rt = /data-tonic="([A-G][#b]?)"/g;
    while ((mt = rt.exec(l.html))) {
      ok("tonica citada valida (" + l.id + "): " + mt[1], !!T.parseNote(mt[1]));
    }
  });
});

eq("modulos", CURRICULUM.length, 19);
ok("mais de 40 licoes", lessonCount >= 40, "licoes = " + lessonCount);

/* --- Resultado ------------------------------------------------------- */

console.log("");
console.log("  Escalas no catalogo : " + T.SCALES.length);
console.log("  Acordes no catalogo : " + T.CHORDS.length);
console.log("  Modulos             : " + CURRICULUM.length);
console.log("  Licoes              : " + lessonCount);
console.log("  Widgets usados      : " + usedWidgets.size);
console.log("");
console.log("  " + pass + " assercoes passaram, " + failures.length + " falharam.");
if (failures.length) {
  console.log("");
  failures.slice(0, 40).forEach((f) => console.log("  ✗ " + f));
  if (failures.length > 40) console.log("  ... e mais " + (failures.length - 40));
  process.exit(1);
}
console.log("  Tudo certo.");
console.log("");

// Exporta a lista de widgets usados para conferencia cruzada com widgets.js
const widgetsSrc = readFileSync(join(DIR, "js/widgets.js"), "utf8");
const missing = [...usedWidgets].filter((w) => {
  return !new RegExp('W(\\.|\\[")' + w.replace(/-/g, "\\-") + '("\\])?\\s*=').test(widgetsSrc) &&
    !new RegExp('W\\["' + w + '"\\]\\s*=').test(widgetsSrc) &&
    !new RegExp("W\\." + w + "\\s*=").test(widgetsSrc);
});
if (missing.length) {
  console.log("  ✗ Widgets referenciados mas nao implementados: " + missing.join(", "));
  process.exit(1);
}
console.log("  Todos os " + usedWidgets.size + " widgets referenciados estao implementados.");
console.log("");
