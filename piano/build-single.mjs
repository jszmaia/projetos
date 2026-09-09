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

const read = (p) => readFileSync(join(DIR, p), "utf8");

/*
 * A lista de scripts sai do proprio index.html, que e a fonte de verdade.
 * Antes havia duas listas em paralelo e acrescentar um arquivo em uma e
 * esquecer da outra quebrava so o bundle — em silencio.
 */
export function scriptsFromIndex(html) {
  const out = [];
  const re = /<script\s+src="\.\/([^"]+)"><\/script>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

export const SCRIPTS = scriptsFromIndex(read("index.html"));

/*
 * O app tem o visual "madrugada": fundo escuro fixo, de proposito, como um
 * banner de campanha que nao muda de cor com o tema de quem olha. Por isso
 * esta ponte IGNORA a escolha de tema do visualizador de artefatos em vez
 * de segui-la — sem isso, um data-theme="light" imposto pelo visualizador
 * tinha especificidade maior que o color-scheme:dark do styles.css e
 * reacendia o tema claro so nessa hospedagem, deixando o app com a cara
 * certa no arquivo baixado mas errada no link publicado.
 */
const THEME_BRIDGE = `
/* ---- ponte de tema: o app e propositalmente sempre escuro --- */
:root { color-scheme: dark; }
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

export function bundle() {
  if (!SCRIPTS.length) throw new Error("Nenhum <script src> encontrado em index.html.");
  return [
    "<title>Piano Teoria</title>",
    "<style>",
    read("styles.css").trimEnd(),
    THEME_BRIDGE,
    "</style>",
    BODY,
    ...SCRIPTS.map((f) => "<script>\n" + read(f).trimEnd() + "\n<\/script>")
  ].join("\n");
}

/* So constroi quando executado direto — importar este modulo nao gera arquivo,
   para que os testes possam reusar scriptsFromIndex() sem efeito colateral. */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = resolve(process.argv[2] || join(DIR, "dist", "piano-teoria.html"));
  const html = bundle();
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
  const kb = (n) => (n / 1024).toFixed(0) + " KB";
  console.log("Gerado: " + out);
  console.log("Tamanho: " + kb(Buffer.byteLength(html)) +
    "  (" + SCRIPTS.length + " scripts + css embutidos)");
}
