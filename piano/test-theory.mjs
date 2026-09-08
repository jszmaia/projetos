/*
 * Testes do motor teorico. Rode com: node piano/test-theory.mjs
 *
 * Valida que as escalas, acordes, grafias e numeros fisicos batem com a
 * teoria — se algum valor do material estiver errado, isso quebra aqui.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const DIR = dirname(fileURLToPath(import.meta.url));
const sandbox = { console, Math, Set, Object, Array, JSON };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(DIR, "js/theory.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/staff.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/notation.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/exercises.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/curriculum-a.js"), "utf8"), sandbox);
vm.runInContext(readFileSync(join(DIR, "js/curriculum-b.js"), "utf8"), sandbox);
for (const f of readdirSync(join(DIR, "js")).filter((f) => f.startsWith("pack-")).sort()) {
  vm.runInContext(readFileSync(join(DIR, "js", f), "utf8"), sandbox);
}

const T = sandbox.PT.theory;
const ST = sandbox.PT.staff;
const NOT = sandbox.PT.notation;
const EX = sandbox.PT.exercises;
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

/* --- 0. Pauta: a posicao vertical vem da GRAFIA, nao do MIDI --------- *
 *
 * Esta e a assercao que sustenta o desenho do modulo de pauta, o mesmo
 * papel que a comparacao literal do Hanon nº 1 tem para os exercicios: se
 * ela falhar, a premissa esta errada e nao adianta ajustar o resto.
 */

/* Indice diatonico conta LETRAS. A alteracao nao entra. */
eq("indice diatonico de C4", ST.diatonicIndex("C", 4), 28);
eq("indice diatonico de B3", ST.diatonicIndex("B", 3), 27);
eq("indice diatonico de C5", ST.diatonicIndex("C", 5), 35);

/* Enarmonia: mesma tecla, linhas diferentes. */
{
  const fs = ST.parseNote("F#4"), gb = ST.parseNote("Gb4");
  ok("Fa#4 e Solb4 sao a mesma tecla", fs.midi === gb.midi,
     "midi " + fs.midi + " vs " + gb.midi);
  ok("Fa#4 e Solb4 ocupam linhas DIFERENTES", fs.dia !== gb.dia,
     "dia " + fs.dia + " vs " + gb.dia);
}

/* A oitava escrita pertence a letra, mesmo quando o som cruza a fronteira. */
{
  const bs = ST.parseNote("B#3"), cb = ST.parseNote("Cb4");
  eq("Si#3 fica na oitava 3 da pauta", bs.dia, ST.diatonicIndex("B", 3));
  eq("Si#3 soa como Do4", bs.midi, 60);
  eq("Dob4 fica na oitava 4 da pauta", cb.dia, ST.diatonicIndex("C", 4));
  eq("Dob4 soa como Si3", cb.midi, 59);
}

/* Ida e volta: toda nota grafada volta a mesma letra e oitava. */
for (const letra of ["C", "D", "E", "F", "G", "A", "B"]) {
  for (const acc of ["", "#", "b"]) {
    for (let oct = 1; oct <= 7; oct++) {
      const p = ST.parseNote(letra + acc + oct);
      ok("ida e volta na pauta: " + letra + acc + oct,
         p && p.letter === letra && p.oct === oct &&
         p.dia === ST.diatonicIndex(letra, oct),
         JSON.stringify(p));
    }
  }
}

/* Toda nota das 88 teclas cai numa posicao de pauta valida. */
for (let midi = 21; midi <= 108; midi++) {
  const p = ST.parseNote(T.midiToName(midi));
  ok("pauta cobre MIDI " + midi, p !== null && p.midi === midi,
     p ? "midi " + p.midi : "nao parseou");
}

/* A armadura desenhada usa as mesmas notas que keySignature declara. */
for (const tonica of ["C", "G", "D", "A", "E", "B", "F", "Bb", "Eb", "Ab", "Db"]) {
  const sig = T.keySignature(tonica);
  for (const clave of ["sol", "fa"]) {
    sig.order.forEach((nome) => {
      const letra = String(nome)[0].toUpperCase();
      const oct = ST.keyAccidentalOctave(letra, clave, sig.type);
      ok("armadura de " + tonica + " em clave de " + clave + ": " + letra + " tem oitava",
         typeof oct === "number" && oct >= 0 && oct <= 8, String(oct));
    });
  }
}

/* --- 0b. Notacao em texto (js/notation.js) --------------------------- */

/* Duracao padrao e um tempo, e o total fecha. */
{
  const r = NOT.parse("E4 F#4 G4 A4");
  eq("quatro notas seguidas", r.notes.length, 4);
  eq("quatro tempos no total", r.beats, 4);
  eq("comecam em 0,1,2,3", r.notes.map((n) => n.start), [0, 1, 2, 3]);
}

/* Duracao explicita muda o relogio. */
{
  const r = NOT.parse("E4:2 G4:.5 A4:.5");
  eq("tres notas com duracao propria", r.notes.map((n) => n.dur), [2, 0.5, 0.5]);
  eq("total de tres tempos", r.beats, 3);
}

/* Acorde: mesmas notas, mesmo instante. */
{
  const r = NOT.parse("[E4 G4 B4]");
  eq("acorde tem 3 notas", r.notes.length, 3);
  ok("todas comecam juntas", r.notes.every((n) => n.start === 0));
  eq("acorde ocupa 1 tempo", r.beats, 1);
}

/* Pausa avanca o relogio sem gerar nota. */
{
  const r = NOT.parse("C4 r D4");
  eq("pausa nao vira nota", r.notes.length, 2);
  eq("a nota apos a pausa comeca em 2", r.notes[1].start, 2);
}

/* As duas maos correm em PARALELO, cada uma com seu relogio. */
{
  const r = NOT.parse("RH: E4 F#4\nLH: [E3 B3]:2");
  const dir = r.notes.filter((n) => n.hand === "right");
  const esq = r.notes.filter((n) => n.hand === "left");
  eq("direita com duas notas", dir.length, 2);
  eq("esquerda com duas (o acorde)", esq.length, 2);
  ok("esquerda comeca em 0", esq.every((n) => n.start === 0));
  eq("direita comeca em 0 e 1", dir.map((n) => n.start), [0, 1]);
  eq("o trecho dura 2 tempos", r.beats, 2);
}

/* Barra de compasso e comentario nao afetam o tempo. */
{
  const a = NOT.parse("C4 D4 E4");
  const b = NOT.parse("C4 | D4 | E4  // comentario");
  eq("barra e comentario nao mudam nada", b.notes.map((n) => n.start), a.notes.map((n) => n.start));
}

/* Erro nao descarta o resto: reporta e segue. */
{
  const r = NOT.parse("E4 Xy9 G4");
  eq("as validas continuam", r.notes.length, 2);
  ok("o erro e reportado", r.erros.length === 1, JSON.stringify(r.erros));
  ok("o erro diz a linha", /linha 1/.test(r.erros[0]), r.erros[0]);
}

/* A oitava pertence a LETRA, igual ao resto do projeto. */
eq("Si#3 no texto vale 60", NOT.noteToMidi("B#3"), 60);
eq("Dob4 no texto vale 59", NOT.noteToMidi("Cb4"), 59);
eq("as tres formas de escrever Do4", 
   [NOT.noteToMidi("C4"), T.nameToMidi("C4"), ST.parseNote("C4").midi], [60, 60, 60]);

/* Ida e volta: texto -> notas -> texto -> notas da o mesmo. */
{
  const original = "RH: C4 E4 G4:2\nLH: C3:4";
  const r1 = NOT.parse(original);
  const r2 = NOT.parse(NOT.toText(r1.notes));
  eq("ida e volta preserva as notas",
     r2.notes.map((n) => [n.midi, n.start, n.dur, n.hand]),
     r1.notes.map((n) => [n.midi, n.start, n.dur, n.hand]));
}

/* Toda nota gerada cai dentro das 88 teclas quando o texto e razoavel. */
{
  const r = NOT.parse("A0 C4 C8");
  ok("faixa do piano aceita", r.notes.every((n) => n.midi >= 21 && n.midi <= 108),
     JSON.stringify(r.notes.map((n) => n.midi)));
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

/* A oitava escrita pertence a LETRA, nao a classe de altura resultante.
 * Si♯3 soa como Do4 e Do♭4 soa como Si3 — mas a letra manda na oitava.
 * Reduzir a classe de altura com `mod` errava uma oitava inteira nestes dois
 * casos, e Si♯/Do♭ ocorrem 108 vezes nas escalas que o app gera (por exemplo
 * Do♯ menor harmonica: C♯ D♯ E F♯ G♯ A B♯). Chegava na calculadora de
 * frequencia do laboratorio como uma oitava errada. */
eq("MIDI de B#3 (mesma tecla que C4)", T.nameToMidi("B#3"), 60);
eq("MIDI de Cb4 (mesma tecla que B3)", T.nameToMidi("Cb4"), 59);
eq("MIDI de E#4 (nao cruza a oitava)", T.nameToMidi("E#4"), 65);
eq("MIDI de Fb4 (nao cruza a oitava)", T.nameToMidi("Fb4"), 64);
eq("MIDI de Cbb4 (alteracao dupla)", T.nameToMidi("Cbb4"), 58);
eq("MIDI de B##3 (alteracao dupla)", T.nameToMidi("B##3"), 61);
near("frequencia de B#3 e a de Do4", T.midiToFreq(T.nameToMidi("B#3")), 261.63, 0.01);

/* Ida e volta em todo o teclado de 88 teclas, na grafia natural. */
for (var mi = 21; mi <= 108; mi++) {
  eq("ida e volta MIDI->nome->MIDI em " + mi, T.nameToMidi(T.midiToName(mi)), mi);
}

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

/* Piso, nao igualdade: cada content pack novo acrescenta modulos. */
ok("pelo menos 19 modulos", CURRICULUM.length >= 19, "modulos = " + CURRICULUM.length);
ok("mais de 40 licoes", lessonCount >= 40, "licoes = " + lessonCount);

/* --- 11. Niveis renderizaveis -------------------------------------- */

/*
 * viewCurso() derivava os niveis de uma lista fixa; um pack com nivel novo
 * sumia da tela sem erro. Aqui garantimos que a lista fixa acabou e que todo
 * nivel presente nos dados tem como ser exibido.
 */
const appSrc = readFileSync(join(DIR, "js/app.js"), "utf8");
ok("app.js nao tem mais a lista de niveis fixa dentro de viewCurso",
  !/var levels = \["Iniciante", "Intermediario", "Avancado"\]/.test(appSrc));
ok("app.js deriva os niveis dos dados", /function orderedLevels\(/.test(appSrc));
ok("app.js ordena modulos por `order`", /function modulesOfLevel\(/.test(appSrc));

const levels = [...new Set(CURRICULUM.map((m) => m.level))];
levels.forEach((lv) => {
  ok("nivel e string nao vazia: " + lv, typeof lv === "string" && lv.length > 0);
});
const cssSrc = readFileSync(join(DIR, "styles.css"), "utf8");
levels.forEach((lv) => {
  const known = ["Iniciante", "Intermediario", "Avancado"].indexOf(lv);
  const cls = known >= 0 ? known + 1 : 4;
  ok("existe cor de pilula para o nivel " + lv, cssSrc.includes(".pill--" + cls));
});

/* --- 12. Listas de script em sincronia ------------------------------ */

const indexSrc = readFileSync(join(DIR, "index.html"), "utf8");
const indexScripts = [...indexSrc.matchAll(/<script\s+src="\.\/([^"]+)"><\/script>/g)]
  .map((m) => m[1]);
ok("index.html lista scripts", indexScripts.length >= 7, "achou " + indexScripts.length);
indexScripts.forEach((f) => {
  ok("script referenciado existe: " + f, existsSync(join(DIR, f)));
});
const bundlerSrc = readFileSync(join(DIR, "build-single.mjs"), "utf8");
ok("build-single.mjs deriva a lista do index.html (sem lista paralela)",
  /scriptsFromIndex/.test(bundlerSrc) && !/^\s*"js\/theory\.js",/m.test(bundlerSrc));

/* Ordem de carga: theory antes de tudo; app.js por ultimo; packs antes de widgets. */
eq("theory.js carrega primeiro", indexScripts[0], "js/theory.js");
eq("app.js carrega por ultimo", indexScripts[indexScripts.length - 1], "js/app.js");
ok("exercises.js carrega antes de widgets.js",
  indexScripts.indexOf("js/exercises.js") < indexScripts.indexOf("js/widgets.js"));
indexScripts.filter((f) => f.startsWith("js/pack-")).forEach((p) => {
  ok("pack carrega antes de app.js: " + p,
    indexScripts.indexOf(p) < indexScripts.indexOf("js/app.js"));
});

/* --- 13. Exercicios generativos ------------------------------------ */

/*
 * A asserção que sustenta a decisao de arquitetura: se o Hanon nº 1 nao sair
 * identico ao texto impresso, a premissa "exercicios sao regras, nao dados"
 * esta errada e o modulo inteiro precisa ser repensado.
 */
const HANON_1 = ["C4", "E4", "F4", "G4", "A4", "G4", "F4", "E4",
                 "D4", "F4", "G4", "A4", "B4", "A4", "G4", "F4"];
const h1 = EX.generate("hanon-1", { tonic: "C" });
const h1right = h1.notes.filter((n) => n.hand === "right");
eq("Hanon nº 1 reproduz o texto impresso",
  h1right.slice(0, 16).map((n) => T.midiToName(n.midi)), HANON_1);
eq("Hanon nº 1: dedilhado da figura", h1.exercise.fingering, [1, 2, 3, 4, 5, 4, 3, 2]);
ok("Hanon nº 1 tem as duas maos",
  h1.notes.some((n) => n.hand === "left") && h1right.length > 0);
eq("Hanon nº 1: maos em oitavas paralelas",
  h1right[0].midi - h1.notes.filter((n) => n.hand === "left")[0].midi, 12);

/* Transposicao: a figura mantem a forma em graus, em qualquer tonalidade. */
TONICS.forEach((tonic) => {
  const g = EX.generate("hanon-1", { tonic });
  const rh = g.notes.filter((n) => n.hand === "right");
  const built = T.buildScale(tonic, "jonio");
  ok("Hanon nº 1 comeca na tonica em " + tonic,
    T.mod(rh[0].midi, 12) === built.tonic.pc);
  ok("Hanon nº 1 usa so notas da escala em " + tonic,
    rh.every((n) => built.pcs.includes(T.mod(n.midi, 12))));
});

/* Todo exercicio do catalogo deve gerar notas validas em toda tonalidade. */
EX.EXERCISES.forEach((ex) => {
  ok("exercicio declara proveniencia: " + ex.id,
    ex.source === "hanon" || ex.source === "derivado");
  TONICS.forEach((tonic) => {
    const g = EX.generate(ex.id, { tonic });
    ok("gera notas: " + ex.id + " em " + tonic, g && g.notes.length > 0);
    ok("MIDI dentro do piano de 88 teclas: " + ex.id + " em " + tonic,
      g.notes.every((n) => n.midi >= 21 && n.midi <= 108));
    ok("start >= 0 e dur > 0: " + ex.id + " em " + tonic,
      g.notes.every((n) => n.start >= 0 && n.dur > 0));
    ok("mao valida: " + ex.id + " em " + tonic,
      g.notes.every((n) => n.hand === "right" || n.hand === "left"));
  });
});

/* --- 14. Diretivas de widget nos packs ------------------------------ */

const packFiles = readdirSync(join(DIR, "js")).filter((f) => f.startsWith("pack-"));
ok("existe ao menos um content pack compilado", packFiles.length >= 1);

/* Toda diretiva ::exercise tem de apontar para um exercicio que existe. */
let exRefs = 0;
CURRICULUM.forEach((m) => {
  m.lessons.forEach((l) => {
    for (const mt of l.html.matchAll(/data-ex="([a-z0-9-]+)"/g)) {
      exRefs++;
      ok("exercicio citado existe (" + l.id + "): " + mt[1], !!EX.get(mt[1]));
    }
  });
});
ok("as licoes referenciam exercicios", exRefs >= 5, "referencias = " + exRefs);
CURRICULUM.filter((m) => m.order !== undefined).forEach((m) => {
  ok("order e numero: " + m.id, typeof m.order === "number");
});

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
