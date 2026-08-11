import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
function loadEnvFile(path) {
  try {
    return readFileSync(path, "utf8").split(/\r?\n/).reduce((env, line) => {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || line.trimStart().startsWith("#")) return env;
      env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
      return env;
    }, {});
  } catch {
    return {};
  }
}

// Local credentials belong in .env. Environment variables take precedence in deployments.
const ENV = { ...loadEnvFile(join(__dirname, ".env")), ...(globalThis.process?.env || {}) };
const PORT = Number(globalThis.__B3_MONITOR_PORT || ENV.PORT || 4173);
const B3_LISTED = "https://sistemaswebb3-listados.b3.com.br";
const B3_QUOTES = "https://cotacao.b3.com.br/mds/api/v1";
const RAPIDAPI_KEY = ENV.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = ENV.RAPIDAPI_HOST || "apidojo-yahoo-finance-v1.p.rapidapi.com";
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

const WORLD_INDICES = [
  { country: "Brasil", region: "Americas", symbol: "IBOV", yahooSymbol: "^BVSP", name: "Ibovespa", source: "b3" },
  { country: "EUA", region: "Americas", symbol: "^GSPC", name: "S&P 500", source: "yahoo" },
  { country: "EUA", region: "Americas", symbol: "^IXIC", name: "Nasdaq Composite", source: "yahoo" },
  { country: "EUA", region: "Americas", symbol: "^DJI", name: "Dow Jones", source: "yahoo" },
  { country: "Japao", region: "Asia", symbol: "^N225", name: "Nikkei 225", source: "yahoo" },
  { country: "Reino Unido", region: "Europa", symbol: "^FTSE", name: "FTSE 100", source: "yahoo" },
  { country: "Alemanha", region: "Europa", symbol: "^GDAXI", name: "DAX", source: "yahoo" },
  { country: "Franca", region: "Europa", symbol: "^FCHI", name: "CAC 40", source: "yahoo" },
  { country: "China", region: "Asia", symbol: "000001.SS", name: "Shanghai Composite", source: "yahoo" },
  { country: "Hong Kong", region: "Asia", symbol: "^HSI", name: "Hang Seng", source: "yahoo" },
  { country: "India", region: "Asia", symbol: "^BSESN", name: "BSE Sensex", source: "yahoo" },
  { country: "Canada", region: "Americas", symbol: "^GSPTSE", name: "S&P/TSX", source: "yahoo" }
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store"
  });
  res.end(body);
}

function sendJson(res, status, data) {
  send(res, status, JSON.stringify(data), "application/json; charset=utf-8");
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function encodeB3Payload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function parsePtNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || !value.trim()) return null;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function cleanB3Symbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function cleanMarketSymbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.^=-]/g, "");
}

function yahooSymbolFor(symbol) {
  const clean = cleanMarketSymbol(symbol);
  if (/^[A-Z]{4}[0-9]{1,2}$/.test(clean)) return `${clean}.SA`;
  return clean;
}

function toRaw(value) {
  if (value == null) return null;
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && "raw" in value) return value.raw;
  if (typeof value === "object" && "fmt" in value) return value.fmt;
  return null;
}

function toNumber(value) {
  const raw = toRaw(value);
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/[%,$]/g, "").replace(/\s/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function toText(value) {
  const raw = toRaw(value);
  if (raw == null) return "";
  return String(raw).replace(/\s+/g, " ").trim();
}

function sourceStatus() {
  return {
    b3: {
      id: "b3",
      label: "B3 oficial",
      available: true
    },
    yahoo: {
      id: "yahoo",
      label: "Yahoo Finance API Data via RapidAPI",
      available: Boolean(RAPIDAPI_KEY),
      host: RAPIDAPI_HOST,
      message: RAPIDAPI_KEY ? "Configurado (Yahoo Finance via RapidAPI)" : "Defina RAPIDAPI_KEY no .env para habilitar Yahoo/RapidAPI."
    }
  };
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json,text/plain,*/*",
      "user-agent": "Mozilla/5.0 B3BolsaMonitor/2.0",
      ...headers
    }
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 180)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Resposta nao veio em JSON: ${text.slice(0, 180)}`);
  }
}

async function fetchB3Json(url) {
  return fetchJson(url, { referer: "https://www.b3.com.br/" });
}

async function fetchRapidApi(path, params = {}) {
  if (!RAPIDAPI_KEY) {
    throw new Error("RapidAPI nao configurado. Defina RAPIDAPI_KEY no ambiente do servidor.");
  }
  const url = new URL(path, RAPIDAPI_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") url.searchParams.set(key, value);
  }
  return fetchJson(url, {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST
  });
}

function normalizeB3Quote(raw, requestedSymbol) {
  const trade = raw?.Trad?.[0] || {};
  const security = trade.scty || {};
  const quote = security.SctyQtn || {};

  return {
    source: "b3",
    symbol: security.symb || requestedSymbol,
    name: String(security.desc || requestedSymbol).replace(/\s+/g, " ").trim(),
    market: security.mkt?.nm || "",
    currency: "BRL",
    price: quote.curPrc ?? null,
    change: null,
    changePercent: quote.prcFlcn ?? null,
    open: quote.opngPric ?? null,
    low: quote.minPric ?? null,
    high: quote.maxPric ?? null,
    average: quote.avrgPric ?? null,
    volume: trade.ttlQty ?? null,
    updatedAt: raw?.Msg?.dtTm || null,
    ok: raw?.BizSts?.cd === "OK"
  };
}

async function getB3IndexPortfolio(index = "IBOV", pageSize = 160) {
  const payload = {
    language: "pt-br",
    pageNumber: 1,
    pageSize,
    index: cleanB3Symbol(index),
    segment: "1"
  };
  const encoded = encodeB3Payload(payload);
  const url = `${B3_LISTED}/indexProxy/indexCall/GetPortfolioDay/${encoded}`;
  const data = await fetchB3Json(url);
  const rows = Array.isArray(data.results) ? data.results : [];

  return {
    source: "b3",
    index: payload.index,
    page: data.page || {},
    header: data.header || {},
    components: rows.map((item) => ({
      symbol: cleanB3Symbol(item.cod),
      yahooSymbol: `${cleanB3Symbol(item.cod)}.SA`,
      asset: String(item.asset || "").trim(),
      name: String(item.asset || "").trim(),
      type: String(item.type || "").replace(/\s+/g, " ").trim(),
      share: parsePtNumber(item.part),
      theoreticalQty: parsePtNumber(item.theoricalQty)
    })).filter((item) => item.symbol)
  };
}

async function getB3Quote(symbol) {
  const clean = cleanB3Symbol(symbol);
  if (!clean) throw new Error("Codigo de ativo invalido.");
  const url = `${B3_QUOTES}/instrumentQuotation/${encodeURIComponent(clean)}`;
  return normalizeB3Quote(await fetchB3Json(url), clean);
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function getB3Index(symbol = "IBOV") {
  const index = cleanB3Symbol(symbol) || "IBOV";
  const portfolio = await getB3IndexPortfolio(index, 160);
  const quote = await getB3Quote(index);

  return {
    source: "b3",
    symbol: index,
    yahooSymbol: index === "IBOV" ? "^BVSP" : index,
    name: index === "IBOV" ? "Ibovespa" : index,
    portfolioDate: portfolio.header.date || null,
    totalComponents: portfolio.page.totalRecords || portfolio.components.length,
    theoreticalQty: portfolio.header.theoricalQty || null,
    quote,
    components: portfolio.components
  };
}

function visitObjects(value, callback, seen = new Set()) {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  if (!Array.isArray(value)) callback(value);
  const next = Array.isArray(value) ? value : Object.values(value);
  for (const item of next) visitObjects(item, callback, seen);
}

function firstObjectWith(data, keys) {
  let found = null;
  visitObjects(data, (obj) => {
    if (found) return;
    if (keys.some((key) => Object.prototype.hasOwnProperty.call(obj, key))) found = obj;
  });
  return found;
}

function firstString(data, keys) {
  let found = "";
  visitObjects(data, (obj) => {
    if (found) return;
    for (const key of keys) {
      const value = toText(obj[key]);
      if (value) {
        found = value;
        return;
      }
    }
  });
  return found;
}

function normalizeYahooQuote(data, requestedSymbol) {
  const obj = firstObjectWith(data, [
    "regularMarketPrice",
    "regularMarketChangePercent",
    "currentPrice",
    "price",
    "symbol"
  ]) || {};

  return {
    source: "yahoo",
    symbol: toText(obj.symbol) || requestedSymbol,
    name: toText(obj.longName) || toText(obj.shortName) || toText(obj.displayName) || requestedSymbol,
    market: toText(obj.fullExchangeName) || toText(obj.exchangeName) || toText(obj.exchange) || "",
    currency: toText(obj.currency) || "",
    price: toNumber(obj.regularMarketPrice) ?? toNumber(obj.currentPrice) ?? toNumber(obj.price),
    change: toNumber(obj.regularMarketChange) ?? toNumber(obj.change),
    changePercent: toNumber(obj.regularMarketChangePercent) ?? toNumber(obj.changePercent),
    open: toNumber(obj.regularMarketOpen) ?? toNumber(obj.open),
    low: toNumber(obj.regularMarketDayLow) ?? toNumber(obj.dayLow),
    high: toNumber(obj.regularMarketDayHigh) ?? toNumber(obj.dayHigh),
    volume: toNumber(obj.regularMarketVolume) ?? toNumber(obj.volume),
    marketState: toText(obj.marketState),
    updatedAt: toText(obj.regularMarketTime),
    ok: true
  };
}

function quoteFromChart(chart, name = "") {
  const latest = chart.candles.at(-1);
  const previous = chart.candles.at(-2);
  const change = latest && previous ? latest.close - previous.close : null;
  return {
    source: "yahoo-public",
    symbol: chart.symbol,
    name: name || chart.symbol,
    market: toText(chart.meta.exchangeName),
    currency: toText(chart.meta.currency),
    price: latest?.close ?? null,
    change,
    changePercent: change != null && previous?.close ? (change / previous.close) * 100 : null,
    open: latest?.open ?? null,
    low: latest?.low ?? null,
    high: latest?.high ?? null,
    volume: latest?.volume ?? null,
    updatedAt: latest?.time ? new Date(latest.time * 1000).toISOString() : null,
    ok: Boolean(latest)
  };
}

function normalizeYahooNews(data) {
  const items = [];
  visitObjects(data, (obj) => {
    const title = toText(obj.title) || toText(obj.headline);
    const link = toText(obj.link) || toText(obj.url);
    if (title && !items.some((item) => item.title === title)) {
      items.push({
        title,
        publisher: toText(obj.publisher) || toText(obj.source),
        link,
        publishedAt: toText(obj.providerPublishTime) || toText(obj.pubDate) || toText(obj.publishedAt)
      });
    }
  });
  return items.slice(0, 5);
}

async function getYahooAsset(symbol) {
  const clean = yahooSymbolFor(symbol);
  if (!clean) throw new Error("Simbolo invalido.");

  // Start with one request. The previous parallel request fan-out quickly exhausted free RapidAPI limits.
  const summary = await Promise.allSettled([
    fetchRapidApi("/stock/v2/get-summary", { symbol: clean })
  ]).then(([result]) => result);

  const dataBlocks = summary.status === "fulfilled" ? [summary.value] : [];
  if (!dataBlocks.length) {
    const reason = summary.reason;
    const chart = await getPublicYahooChart(clean, "5d", "1d");
    return {
      source: "yahoo-public",
      symbol: clean,
      yahooSymbol: clean,
      yahooUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(clean)}`,
      quote: quoteFromChart(chart, clean),
      description: "Cotacao obtida pelo grafico publico do Yahoo. Resumo e noticias dependem da assinatura RapidAPI.",
      news: [],
      warning: `RapidAPI indisponivel: ${reason?.message || "consulte a assinatura e os limites da conta."}`
    };
  }

  let quote = normalizeYahooQuote(dataBlocks, clean);
  let marketQuotes = { status: "skipped" };
  if (quote.price == null) {
    marketQuotes = await Promise.allSettled([
      fetchRapidApi("/market/v2/get-quotes", { region: "US", symbols: clean })
    ]).then(([result]) => result);
    if (marketQuotes.status === "fulfilled") quote = normalizeYahooQuote([summary.value, marketQuotes.value], clean);
  }

  const description = firstString(dataBlocks, [
    "longBusinessSummary",
    "description",
    "summary",
    "profile",
    "businessSummary"
  ]);

  const news = await Promise.allSettled([
    fetchRapidApi("/stock/get-news", { category: clean, region: "US" })
  ]).then(([result]) => result);

  return {
    source: "yahoo",
    symbol: clean,
    yahooUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(clean)}`,
    quote,
    description,
    news: news.status === "fulfilled" ? normalizeYahooNews(news.value) : [],
    rawAvailable: {
      summary: summary.status === "fulfilled",
      marketQuotes: marketQuotes.status === "fulfilled",
      news: news.status === "fulfilled"
    }
  };
}

function extractChartArrays(data) {
  let candidate = null;
  visitObjects(data, (obj) => {
    if (candidate) return;
    const timestamp = obj.timestamp;
    const quote = Array.isArray(obj.indicators?.quote) ? obj.indicators.quote[0] : null;
    if (Array.isArray(timestamp) && quote) {
      candidate = {
        timestamp,
        open: quote.open || [],
        high: quote.high || [],
        low: quote.low || [],
        close: quote.close || [],
        volume: quote.volume || []
      };
      return;
    }
    if (Array.isArray(obj.time) && (Array.isArray(obj.open) || Array.isArray(obj.close))) {
      candidate = {
        timestamp: obj.time,
        open: obj.open || [],
        high: obj.high || [],
        low: obj.low || [],
        close: obj.close || [],
        volume: obj.volume || []
      };
    }
  });
  return candidate;
}

function normalizeChartData(data, symbol) {
  const arrays = extractChartArrays(data);
  if (!arrays) {
    return {
      symbol,
      candles: [],
      meta: {}
    };
  }

  const candles = arrays.timestamp.map((time, index) => ({
    time: Number(time),
    open: toNumber(arrays.open[index]),
    high: toNumber(arrays.high[index]),
    low: toNumber(arrays.low[index]),
    close: toNumber(arrays.close[index]),
    volume: toNumber(arrays.volume[index])
  })).filter((item) => item.time && item.open != null && item.high != null && item.low != null && item.close != null);

  return {
    symbol,
    candles,
    meta: firstObjectWith(data, ["currency", "exchangeName", "regularMarketPrice"]) || {}
  };
}

async function getYahooChart(symbol, range = "1mo", interval = "1d") {
  const clean = yahooSymbolFor(symbol);
  const data = await fetchRapidApi("/stock/v3/get-chart", {
    symbol: clean,
    region: "US",
    range,
    interval,
    includePrePost: "false",
    includeAdjustedClose: "true"
  });
  const normalized = normalizeChartData(data, clean);
  if (!normalized.candles.length) {
    throw new Error("A fonte Yahoo/RapidAPI nao retornou serie OHLC para este simbolo.");
  }
  return normalized;
}

async function getPublicYahooChart(symbol, range = "1mo", interval = "1d") {
  const clean = yahooSymbolFor(symbol);
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(clean)}`);
  url.searchParams.set("range", range);
  url.searchParams.set("interval", interval);
  const data = await fetchJson(url, { referer: "https://finance.yahoo.com/" });
  const normalized = normalizeChartData(data, clean);
  if (!normalized.candles.length) {
    throw new Error("Yahoo publico nao retornou serie OHLC para este simbolo.");
  }
  return normalized;
}

async function getWorldDashboard() {
  const statuses = sourceStatus();
  const items = await mapLimit(WORLD_INDICES, 2, async (item) => {
    try {
      if (item.source === "b3") {
        return { ...item, quote: await getB3Quote(item.symbol), status: "ok" };
      }

      const chart = await getPublicYahooChart(item.symbol, "5d", "1d");
      return {
        ...item,
        quote: quoteFromChart(chart, item.name),
        status: "fallback",
        yahooUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(yahooSymbolFor(item.symbol))}`
      };
    } catch (error) {
      return { ...item, quote: null, status: "error", message: error.message };
    }
  });

  if (RAPIDAPI_KEY) {
    statuses.yahoo.message = "RapidAPI configurada; painel mundial usa uma cotacao por grafico para preservar o limite de requisicoes.";
  } else {
    statuses.yahoo.message = "Cotacoes mundiais usam o grafico publico do Yahoo; configure RapidAPI para resumos e noticias.";
  }

  return {
    fetchedAt: new Date().toISOString(),
    sources: statuses,
    indices: items
  };
}

async function parsePortfolio(body) {
  const payload = body.trim().startsWith("{") ? JSON.parse(body) : { text: body };
  const text = String(payload.text || "");
  const rows = text.split(/\r?\n/);
  const positions = [];
  const errors = [];

  rows.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (/^symbol\s*[,;\t]/i.test(trimmed)) return;
    const parts = trimmed.split(/[,;\t]/).map((part) => part.trim()).filter(Boolean);
    const symbol = cleanMarketSymbol(parts[0]);
    const quantity = Number(String(parts[1] || "").replace(",", "."));
    if (!symbol || !Number.isFinite(quantity) || quantity <= 0) {
      errors.push({ line: index + 1, value: line });
      return;
    }
    positions.push({
      symbol,
      yahooSymbol: yahooSymbolFor(symbol),
      quantity
    });
  });

  return {
    positions,
    errors,
    imported: positions.length,
    rejected: errors.length
  };
}

async function handleApi(req, res, url) {
  try {
    if (url.pathname === "/api/sources") {
      return sendJson(res, 200, sourceStatus());
    }

    if (url.pathname === "/api/world") {
      return sendJson(res, 200, await getWorldDashboard());
    }

    if (url.pathname === "/api/dashboard") {
      const index = cleanB3Symbol(url.searchParams.get("index") || "IBOV") || "IBOV";
      const b3Index = await getB3Index(index);
      const quotes = await mapLimit(b3Index.components, 8, async (component) => {
        try {
          return { ...component, quote: await getB3Quote(component.symbol), quoteError: null };
        } catch (error) {
          return { ...component, quote: null, quoteError: error.message };
        }
      });
      const quoted = quotes.filter((item) => item.quote?.ok && typeof item.quote.price === "number");
      const weightedVariation = quoted.reduce((sum, item) => sum + (item.share || 0) * (item.quote.changePercent || 0), 0) /
        Math.max(1, quoted.reduce((sum, item) => sum + (item.share || 0), 0));
      return sendJson(res, 200, { ...b3Index, weightedVariation, components: quotes });
    }

    if (url.pathname === "/api/portfolio/parse" && req.method === "POST") {
      return sendJson(res, 200, await parsePortfolio(await readRequestBody(req)));
    }

    const indexComponentsMatch = url.pathname.match(/^\/api\/index\/(.+)\/components$/);
    if (indexComponentsMatch) {
      const symbol = decodeURIComponent(indexComponentsMatch[1]);
      if (/^[A-Z0-9]+$/.test(cleanB3Symbol(symbol)) && !String(symbol).includes("^") && !String(symbol).includes(".")) {
        const portfolio = await getB3IndexPortfolio(symbol, 160);
        return sendJson(res, 200, {
          source: "b3",
          symbol: cleanB3Symbol(symbol),
          official: true,
          components: portfolio.components
        });
      }
      return sendJson(res, 200, {
        source: "yahoo",
        symbol: cleanMarketSymbol(symbol),
        official: false,
        components: [],
        message: "Componentes oficiais deste indice nao estao disponiveis na fonte configurada."
      });
    }

    const indexMatch = url.pathname.match(/^\/api\/index\/(.+)$/);
    if (indexMatch) {
      const symbol = decodeURIComponent(indexMatch[1]);
      if (/^[A-Z0-9]+$/.test(cleanB3Symbol(symbol)) && !String(symbol).includes("^") && !String(symbol).includes(".")) {
        return sendJson(res, 200, await getB3Index(symbol));
      }
      return sendJson(res, 200, await getYahooAsset(symbol));
    }

    const assetMatch = url.pathname.match(/^\/api\/asset\/(.+)$/);
    if (assetMatch) {
      const symbol = decodeURIComponent(assetMatch[1]);
      const source = url.searchParams.get("source") || "auto";
      if (source === "b3" || (source === "auto" && /^[A-Z]{4}[0-9]{1,2}$/.test(cleanMarketSymbol(symbol)))) {
        const quote = await getB3Quote(symbol);
        return sendJson(res, 200, {
          source: "b3",
          symbol: cleanB3Symbol(symbol),
          yahooSymbol: yahooSymbolFor(symbol),
          yahooUrl: `https://finance.yahoo.com/quote/${encodeURIComponent(yahooSymbolFor(symbol))}`,
          quote,
          description: "Ativo negociado na B3. Para resumo setorial e dados globais, habilite a fonte Yahoo/RapidAPI.",
          news: []
        });
      }
      return sendJson(res, 200, await getYahooAsset(symbol));
    }

    const chartMatch = url.pathname.match(/^\/api\/chart\/(.+)$/);
    if (chartMatch) {
      const symbol = decodeURIComponent(chartMatch[1]);
      const range = url.searchParams.get("range") || "1mo";
      const interval = url.searchParams.get("interval") || "1d";
      try {
        if (RAPIDAPI_KEY) return sendJson(res, 200, await getYahooChart(symbol, range, interval));
        throw new Error("RapidAPI nao configurada.");
      } catch (error) {
        const warning = RAPIDAPI_KEY
          ? "RapidAPI nao respondeu para este grafico; usando o grafico publico do Yahoo."
          : "Usando endpoint publico do Yahoo para grafico porque RAPIDAPI_KEY nao esta configurada.";
        try {
          return sendJson(res, 200, {
            ...(await getPublicYahooChart(symbol, range, interval)),
            source: "yahoo-public",
            warning
          });
        } catch {
          // Some B3 symbols need the .SA suffix on Yahoo.
        }
        if (/^[A-Z]{4}[0-9]{1,2}$/.test(cleanMarketSymbol(symbol))) {
          return sendJson(res, 200, {
            ...(await getPublicYahooChart(`${cleanMarketSymbol(symbol)}.SA`, range, interval)),
            source: "yahoo-public",
            warning: "Grafico consultado com sufixo .SA no Yahoo publico."
          });
        }
        throw error;
      }
    }

    const quoteMatch = url.pathname.match(/^\/api\/quote\/([A-Za-z0-9]+)$/);
    if (quoteMatch) {
      return sendJson(res, 200, await getB3Quote(quoteMatch[1]));
    }

    return sendJson(res, 404, { error: "Endpoint nao encontrado." });
  } catch (error) {
    return sendJson(res, 502, {
      error: "Nao foi possivel concluir a consulta.",
      detail: error.message
    });
  }
}

async function serveStatic(req, res, url) {
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const normalized = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(__dirname, normalized);

  if (!filePath.startsWith(__dirname)) {
    return send(res, 403, "Acesso negado.", "text/plain; charset=utf-8");
  }

  try {
    const content = await readFile(filePath);
    send(res, 200, content, MIME[extname(filePath)] || "application/octet-stream");
  } catch {
    send(res, 404, "Arquivo nao encontrado.", "text/plain; charset=utf-8");
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    return handleApi(req, res, url);
  }
  return serveStatic(req, res, url);
}).listen(PORT, () => {
  console.log(`Monitor Global Multi-Fonte rodando em http://localhost:${PORT}`);
});
