/*
 * build-content.mjs — compila piano/content/<pack>/ em piano/js/pack-<id>.js
 *
 * Uso: node piano/tools/build-content.mjs [pack]      (sem argumento: todos)
 *
 * POR QUE ISTO EXISTE
 * O runtime nao pode ganhar um passo de build — piano/index.html tem de
 * continuar abrindo direto no navegador. Mas escrever conteudo dentro de
 * template literals em JS e insuportavel: aspas escapadas, diff ilegivel.
 * Entao a FONTE e Markdown e a SAIDA em JS e commitada. O usuario final
 * segue sem build; quem escreve conteudo revisa texto como texto.
 *
 * FORMATO
 *   content/<pack>/pack.json   { id, title, level, tag, order, summary, goals[] }
 *   content/<pack>/NN-nome.md  frontmatter (id, title, practice[]) + corpo
 *
 * O corpo aceita um subconjunto de Markdown mais HTML cru (qualquer linha que
 * comece com '<' passa intacta) e diretivas de widget:
 *   ::scale tonic=C scale=jonio
 *   ::exercise ex=hanon-1 tonic=C
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(DIR, "content");
const JS = join(DIR, "js");

/* ------------------------------------------------------------------ *
 * Frontmatter
 * ------------------------------------------------------------------ */

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(stripQuotes(item[1].trim()));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const val = kv[2].trim();
      data[key] = val === "" ? [] : stripQuotes(val);
    }
  }
  return { data, body: m[2] };
}

function stripQuotes(s) {
  return s.replace(/^["'](.*)["']$/, "$1");
}

/* ------------------------------------------------------------------ *
 * Markdown -> HTML (subconjunto deliberado)
 * ------------------------------------------------------------------ */

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => "<code>" + c.replace(/</g, "&lt;") + "</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

/** Diretiva ::widget k=v k="v com espacos"  ->  <div class="w" data-w=...> */
function directive(line) {
  const m = line.match(/^::([a-z0-9-]+)\s*(.*)$/i);
  if (!m) return null;
  const name = m[1];
  let attrs = ' class="w" data-w="' + escAttr(name) + '"';

  /* Valores entre aspas podem conter espacos — necessario para listas de
   * notas (notes="C4 D4 E4"). Sem isso o split por espaco quebraria a lista
   * em pedacos sem "=", que eram descartados em silencio. */
  const re = /([a-zA-Z0-9_-]+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let kv;
  while ((kv = re.exec(m[2])) !== null) {
    const valor = kv[2] !== undefined ? kv[2] : kv[3] !== undefined ? kv[3] : kv[4];
    attrs += " data-" + escAttr(kv[1]) + '="' + escAttr(valor) + '"';
  }
  return "<div" + attrs + "></div>";
}

export function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  const flushList = (tag, items) =>
    out.push("<" + tag + ">" + items.map((x) => "<li>" + inline(x) + "</li>").join("") + "</" + tag + ">");

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // Bloco de codigo cercado: conteudo literal, sem markdown por dentro.
    if (/^```/.test(line)) {
      i++;
      const block = [];
      while (i < lines.length && !/^```/.test(lines[i])) block.push(lines[i++]);
      i++;                                  // consome a cerca de fechamento
      out.push('<div class="math-box"><pre class="mono">' +
        block.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;") +
        "</pre></div>");
      continue;
    }

    // HTML cru: passa intacto ate a linha em branco seguinte.
    if (line.startsWith("<")) {
      const block = [];
      while (i < lines.length && lines[i].trim()) block.push(lines[i++]);
      out.push(block.join("\n"));
      continue;
    }

    const dir = directive(line);
    if (dir) { out.push(dir); i++; continue; }

    const head = line.match(/^(#{1,4})\s+(.*)$/);
    if (head) {
      const lvl = head[1].length + 1;      // '#' vira <h2>: <h1> e do titulo da licao
      out.push("<h" + lvl + ">" + inline(head[2]) + "</h" + lvl + ">");
      i++;
      continue;
    }

    // Tabela: | a | b |  seguida de linha de separacao
    if (line.startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[i + 1] || "")) {
      const cells = (r) => r.split("|").slice(1, -1).map((c) => c.trim());
      const head2 = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        '<table class="tbl"><thead><tr>' +
        head2.map((c) => "<th>" + inline(c) + "</th>").join("") +
        "</tr></thead><tbody>" +
        rows.map((r) => "<tr>" + r.map((c) => "<td>" + inline(c) + "</td>").join("") + "</tr>").join("") +
        "</tbody></table>"
      );
      continue;
    }

    // Citacao > vira callout
    if (line.startsWith(">")) {
      const block = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        block.push(lines[i++].replace(/^>\s?/, ""));
      }
      out.push('<div class="callout">' + inline(block.join(" ")) + "</div>");
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
      }
      flushList("ul", items);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      }
      flushList("ol", items);
      continue;
    }

    // Paragrafo: junta ate a linha em branco.
    const para = [];
    while (i < lines.length && lines[i].trim() &&
           !lines[i].startsWith("<") && !lines[i].startsWith("|") &&
           !lines[i].startsWith(">") && !lines[i].startsWith("::") &&
           !/^(#{1,4})\s/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
      para.push(lines[i++]);
    }
    if (para.length) out.push("<p>" + inline(para.join(" ")) + "</p>");
    else i++;                              // salvaguarda: nunca trava o laco
  }
  return out.join("\n");
}

/* ------------------------------------------------------------------ *
 * Compilacao de um pack
 * ------------------------------------------------------------------ */

export function compilePack(dir) {
  const metaPath = join(dir, "pack.json");
  if (!existsSync(metaPath)) throw new Error("pack.json ausente em " + dir);
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));

  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  const lessons = files.map((f) => {
    const { data, body } = parseFrontmatter(readFileSync(join(dir, f), "utf8"));
    if (!data.id) throw new Error(f + ": frontmatter sem `id`");
    if (!data.title) throw new Error(f + ": frontmatter sem `title`");
    return {
      id: data.id,
      title: data.title,
      html: mdToHtml(body),
      practice: Array.isArray(data.practice) ? data.practice : []
    };
  });

  if (!lessons.length) throw new Error("nenhuma licao .md em " + dir);

  const modulo = {
    id: meta.id,
    title: meta.title,
    level: meta.level,
    tag: meta.tag || "Conteudo",
    order: meta.order || 0,
    summary: meta.summary || "",
    goals: meta.goals || [],
    lessons
  };

  const banner =
    "/*\n * pack-" + meta.id + ".js — GERADO por tools/build-content.mjs\n" +
    " * NAO EDITE A MAO. Edite content/" + basename(dir) + "/ e recompile.\n" +
    (meta.source ? " *\n * Fonte: " + meta.source + "\n" : "") +
    (meta.license ? " * Licenca: " + meta.license + "\n" : "") +
    " */\n";

  const js =
    banner +
    "(function (global) {\n" +
    '  "use strict";\n' +
    "  global.PT = global.PT || {};\n" +
    "  global.PT.CURRICULUM = global.PT.CURRICULUM || [];\n" +
    "  global.PT.CURRICULUM.push(\n" +
    JSON.stringify(modulo, null, 2).split("\n").map((l) => "    " + l).join("\n") +
    "\n  );\n" +
    '})(typeof window !== "undefined" ? window : globalThis);\n';

  return { meta, modulo, js, lessons: lessons.length };
}

/* ------------------------------------------------------------------ *
 * CLI
 * ------------------------------------------------------------------ */

function main() {
  if (!existsSync(CONTENT)) {
    console.log("Nenhum diretorio content/ — nada a compilar.");
    return;
  }
  const only = process.argv[2];
  const packs = readdirSync(CONTENT)
    .filter((d) => statSync(join(CONTENT, d)).isDirectory())
    .filter((d) => !only || d === only);

  if (!packs.length) {
    console.error("Nenhum pack encontrado" + (only ? " com o nome " + only : "") + ".");
    process.exit(1);
  }

  for (const p of packs) {
    const { meta, js, lessons } = compilePack(join(CONTENT, p));
    const outPath = join(JS, "pack-" + meta.id + ".js");
    writeFileSync(outPath, js, "utf8");
    console.log("✓ " + p + " → js/pack-" + meta.id + ".js  (" + lessons +
      " licoes, nivel \"" + meta.level + "\")");
  }
  console.log("\nLembre de incluir o <script src> no index.html se for um pack novo.");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
