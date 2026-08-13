/*
 * build-single.mjs — empacota o app inteiro em um unico arquivo HTML.
 *
 * Uso: node piano/build-single.mjs [saida.html]
 *
 * O app ja e autocontido (sem CDN, sem fetch, sem build), entao "empacotar"
 * aqui significa apenas embutir o CSS e os scripts na ordem correta. Serve
 * para abrir o curso em um aparelho que nao roda o servidor local, ou para
 * enviar o app como anexo unico.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const out = resolve(process.argv[2] || join(DIR, "dist", "piano-teoria.html"));

const SCRIPTS = [
  "js/theory.js",
  "js/keyboard.js",
  "js/audio.js",
  "js/curriculum-a.js",
  "js/curriculum-b.js",
  "js/widgets.js",
  "js/app.js"
];

const read = (p) => readFileSync(join(DIR, p), "utf8");

/*
 * O visualizador de artefatos expressa o tema de tres formas: sem marca
 * (segue o sistema), data-theme="dark" e data-theme="light". A folha de
 * estilo usa light-dark(), que resolve pelo `color-scheme` em uso — entao
 * basta amarrar o color-scheme ao atributo para cobrir os tres estados
 * sem duplicar uma unica cor.
 */
const THEME_BRIDGE = `
/* ---- ponte de tema: faz light-dark() responder ao seletor do visualizador --- */
:root[data-theme="dark"]  { color-scheme: dark; }
:root[data-theme="light"] { color-scheme: light; }
`;

/* Marcacao identica a do index.html, sem as tags de documento (o artefato
   fornece doctype/html/head/body) e sem as tags <script src>. */
const BODY = `
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <strong>Piano Teoria</strong>
          <span class="brand-sub">teoria deduzida, nao decorada</span>
        </div>
      </div>
      <nav id="nav" class="nav" aria-label="Secoes"></nav>
      <div class="progress">
        <div class="progress-track"><div id="progress-fill" class="progress-fill"></div></div>
        <span id="progress-label" class="progress-label">0 / 0</span>
      </div>
    </header>

    <main id="view" class="main"></main>

    <footer class="footer">
      <p>Todos os diagramas, tabelas e frequencias sao gerados em tempo real pelo motor
      teorico — nada e tabelado a mao. Som sintetizado via Web Audio API.
      Toque em qualquer tecla para ouvir.</p>
    </footer>

    <div id="dock" class="dock" aria-label="Metronomo e audio"></div>
`;

const parts = [
  "<title>Piano Teoria</title>",
  "<style>",
  read("styles.css").trimEnd(),
  THEME_BRIDGE,
  "</style>",
  BODY,
  ...SCRIPTS.map((f) => "<script>\n" + read(f).trimEnd() + "\n<\/script>")
];

const html = parts.join("\n");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, "utf8");

const kb = (n) => (n / 1024).toFixed(0) + " KB";
console.log("Gerado: " + out);
console.log("Tamanho: " + kb(Buffer.byteLength(html)) +
  "  (" + SCRIPTS.length + " scripts + css embutidos)");
