/*
 * Servidor estatico minimo para o app de piano.
 * Uso: npm run piano   (ou: node piano/serve.mjs)
 *
 * O app tambem funciona abrindo piano/index.html direto no navegador,
 * porque os scripts sao classicos (nao modulos ES).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const PORT = Number(process.env.PIANO_PORT || 4180);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path === "/") path = "/index.html";

    const target = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ""));
    if (!target.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const info = await stat(target).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Nao encontrado");
      return;
    }

    const body = await readFile(target);
    res.writeHead(200, {
      "content-type": TYPES[extname(target)] || "application/octet-stream",
      "cache-control": "no-cache"
    }).end(body);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end("Erro: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`Piano Teoria em http://localhost:${PORT}`);
});
