const state = {
  sources: null,
  world: null,
  selected: {
    symbol: "IBOV",
    chartSymbol: "^BVSP",
    source: "b3",
    name: "Ibovespa"
  },
  asset: null,
  components: [],
  componentsOfficial: true,
  sortComponentsByChange: false,
  chart: null,
  chartResizeObserver: null,
  portfolio: loadStoredPortfolio()
};

const els = {
  assetForm: document.querySelector("#asset-form"),
  sourceSelect: document.querySelector("#source-select"),
  assetInput: document.querySelector("#asset-input"),
  loadState: document.querySelector("#load-state"),
  sourceState: document.querySelector("#source-state"),
  refreshWorld: document.querySelector("#refresh-world"),
  worldGrid: document.querySelector("#world-grid"),
  assetTitle: document.querySelector("#asset-title"),
  assetSubtitle: document.querySelector("#asset-subtitle"),
  yahooLink: document.querySelector("#yahoo-link"),
  assetPrice: document.querySelector("#asset-price"),
  assetMarket: document.querySelector("#asset-market"),
  assetChange: document.querySelector("#asset-change"),
  assetUpdated: document.querySelector("#asset-updated"),
  assetVolume: document.querySelector("#asset-volume"),
  assetCurrency: document.querySelector("#asset-currency"),
  assetDescription: document.querySelector("#asset-description"),
  assetNews: document.querySelector("#asset-news"),
  chartType: document.querySelector("#chart-type"),
  chartRange: document.querySelector("#chart-range"),
  chartInterval: document.querySelector("#chart-interval"),
  chartEl: document.querySelector("#trade-chart"),
  chartMessage: document.querySelector("#chart-message"),
  componentsCount: document.querySelector("#components-count"),
  componentsMessage: document.querySelector("#components-message"),
  componentsBody: document.querySelector("#components-body"),
  toggleComponentsSort: document.querySelector("#toggle-components-sort"),
  portfolioFile: document.querySelector("#portfolio-file"),
  portfolioText: document.querySelector("#portfolio-text"),
  importPortfolio: document.querySelector("#import-portfolio"),
  clearPortfolio: document.querySelector("#clear-portfolio"),
  portfolioStatus: document.querySelector("#portfolio-status"),
  portfolioList: document.querySelector("#portfolio-list")
};

const formatters = {
  brl: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }),
  usd: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
  number: new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }),
  integer: new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 })
};

function setStatus(message, isError = false) {
  els.loadState.textContent = message;
  els.loadState.className = isError ? "negative" : "";
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || data.error || "Falha na consulta.");
  return data;
}

function loadStoredPortfolio() {
  try {
    return JSON.parse(localStorage.getItem("b3-global-portfolio") || "[]");
  } catch {
    return [];
  }
}

function savePortfolio() {
  localStorage.setItem("b3-global-portfolio", JSON.stringify(state.portfolio));
}

function formatPrice(value, currency = "BRL") {
  if (typeof value !== "number") return "--";
  if (currency === "USD") return formatters.usd.format(value);
  if (currency === "BRL") return formatters.brl.format(value);
  return `${formatters.number.format(value)} ${currency || ""}`.trim();
}

function formatPercent(value) {
  if (typeof value !== "number") return "--";
  return `${value > 0 ? "+" : ""}${formatters.number.format(value)}%`;
}

function formatInteger(value) {
  return typeof value === "number" ? formatters.integer.format(value) : "--";
}

function variationClass(value) {
  if (typeof value !== "number") return "neutral";
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function marketTone(value) {
  if (typeof value !== "number" || value === 0) return "is-neutral";
  return value > 0 ? "is-positive" : "is-negative";
}

function yahooSymbolFor(symbol) {
  const clean = String(symbol || "").trim().toUpperCase();
  if (/^[A-Z]{4}[0-9]{1,2}$/.test(clean)) return `${clean}.SA`;
  if (clean === "IBOV") return "^BVSP";
  return clean;
}

function isBrazilianTicker(symbol) {
  return /^[A-Z]{4}[0-9]{1,2}$/.test(String(symbol || "").trim().toUpperCase());
}

function yahooUrl(symbol) {
  return `https://finance.yahoo.com/quote/${encodeURIComponent(yahooSymbolFor(symbol))}`;
}

function renderSourceState() {
  const sources = state.sources;
  if (!sources) {
    els.sourceState.textContent = "";
    return;
  }
  const yahoo = sources.yahoo;
  els.sourceState.innerHTML = yahoo.available
    ? `${yahoo.message || "Yahoo/RapidAPI conectado"} <code>${yahoo.host}</code>`
    : `Yahoo/RapidAPI indisponivel: ${yahoo.message || "defina RAPIDAPI_KEY"}`;
  els.sourceSelect.querySelector('option[value="yahoo"]').disabled = !yahoo.available;
}

function renderWorld() {
  if (!state.world) {
    els.worldGrid.innerHTML = `<p class="empty-state">Sem dados globais.</p>`;
    return;
  }

  els.worldGrid.innerHTML = state.world.indices.map((item) => {
    const quote = item.quote || {};
    const selected = state.selected.symbol === item.symbol;
    const price = quote.price != null ? formatPrice(quote.price, quote.currency) : "--";
    const change = quote.changePercent != null ? formatPercent(quote.changePercent) : item.status === "disabled" ? "Yahoo off" : "--";
    return `
      <button class="index-card ${marketTone(quote.changePercent)}" type="button" data-symbol="${item.symbol}" data-source="${item.source}" data-chart-symbol="${item.yahooSymbol || item.symbol}" aria-pressed="${selected}">
        <span>${item.country} · ${item.region}</span>
        <b>${item.name}</b>
        <strong class="market-price ${variationClass(quote.changePercent)}">${price}</strong>
        <small class="${variationClass(quote.changePercent)}">${change}</small>
      </button>
    `;
  }).join("");
}

function renderAsset() {
  const asset = state.asset;
  const quote = asset?.quote || {};
  const symbol = asset?.symbol || state.selected.symbol;
  const chartSymbol = asset?.yahooSymbol || state.selected.chartSymbol || yahooSymbolFor(symbol);
  const link = asset?.yahooUrl || yahooUrl(chartSymbol);

  els.assetTitle.textContent = quote.name || state.selected.name || symbol;
  els.assetSubtitle.textContent = `${symbol} · ${asset?.source || state.selected.source}`;
  els.yahooLink.href = link;
  els.assetPrice.textContent = formatPrice(quote.price, quote.currency);
  els.assetPrice.className = `market-price ${variationClass(quote.changePercent)}`;
  els.assetMarket.textContent = quote.market || quote.marketState || "--";
  els.assetChange.textContent = formatPercent(quote.changePercent);
  els.assetChange.className = variationClass(quote.changePercent);
  els.assetUpdated.textContent = quote.updatedAt ? `Atualizado: ${quote.updatedAt}` : "--";
  els.assetVolume.textContent = formatInteger(quote.volume);
  els.assetCurrency.textContent = quote.currency || "--";
  els.assetDescription.textContent = asset?.description || "Resumo factual indisponivel para este ativo na fonte atual.";

  const news = Array.isArray(asset?.news) ? asset.news : [];
  els.assetNews.innerHTML = news.length
    ? news.map((item) => `
        <article class="news-item">
          <a href="${item.link || link}" target="_blank" rel="noreferrer">${item.title}</a>
          <div class="company">${item.publisher || ""}</div>
        </article>
      `).join("")
    : "";
}

function sortedComponents() {
  const rows = state.components.slice();
  if (state.sortComponentsByChange) {
    rows.sort((a, b) => (b.quote?.changePercent ?? -Infinity) - (a.quote?.changePercent ?? -Infinity));
  } else {
    rows.sort((a, b) => (b.share || 0) - (a.share || 0));
  }
  return rows;
}

function renderComponents() {
  const rows = sortedComponents();
  els.componentsCount.textContent = state.componentsOfficial
    ? `${formatInteger(rows.length)} componentes oficiais`
    : "Componentes oficiais indisponiveis";
  els.toggleComponentsSort.textContent = state.sortComponentsByChange ? "Ordenar por peso" : "Ordenar por variacao";

  if (!state.componentsOfficial) {
    els.componentsMessage.innerHTML = `A fonte configurada nao retornou componentes oficiais para este indice. <a href="${yahooUrl(state.selected.chartSymbol || state.selected.symbol)}" target="_blank" rel="noreferrer">Abrir no Yahoo</a>.`;
  } else {
    els.componentsMessage.textContent = "";
  }

  if (!rows.length) {
    els.componentsBody.innerHTML = `<tr><td colspan="7" class="empty-state">Nenhum componente para exibir.</td></tr>`;
    return;
  }

  els.componentsBody.innerHTML = rows.map((item) => {
    const quote = item.quote || {};
    const linkSymbol = item.yahooSymbol || item.symbol;
    return `
      <tr>
        <td class="symbol">${item.symbol}</td>
        <td><span>${item.asset || item.name || quote.name || "--"}</span><br><small class="company">${item.type || quote.market || ""}</small></td>
        <td class="numeric">${typeof item.share === "number" ? `${formatters.number.format(item.share)}%` : "--"}</td>
        <td class="numeric">${formatPrice(quote.price, quote.currency)}</td>
        <td class="numeric ${variationClass(quote.changePercent)}">${formatPercent(quote.changePercent)}</td>
        <td class="numeric">${formatInteger(quote.volume)}</td>
        <td class="numeric"><a href="${yahooUrl(linkSymbol)}" target="_blank" rel="noreferrer">Yahoo</a></td>
      </tr>
    `;
  }).join("");
}

async function ensureChartLibrary() {
  if (window.LightweightCharts) return true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  return Boolean(window.LightweightCharts);
}

function chartColors() {
  const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return dark
    ? {
        text: "#edf4f1",
        line: "#2d3a36",
        surface: "#18211f",
        blue: "#79a7ff",
        green: "#63d28e",
        red: "#ff8177"
      }
    : {
        text: "#16211e",
        line: "#d8e2de",
        surface: "#ffffff",
        blue: "#245ee8",
        green: "#147447",
        red: "#b42318"
      };
}

function clearChart() {
  if (state.chartResizeObserver) {
    state.chartResizeObserver.disconnect();
    state.chartResizeObserver = null;
  }
  if (state.chart) {
    state.chart.remove();
    state.chart = null;
  }
  els.chartEl.innerHTML = "";
}

async function loadChart() {
  const hasCharts = await ensureChartLibrary();
  if (!hasCharts) {
    els.chartMessage.textContent = "Biblioteca de graficos nao carregou. Verifique a conexao com o CDN.";
    return;
  }

  const chartSymbol = state.selected.chartSymbol || yahooSymbolFor(state.selected.symbol);
  const range = els.chartRange.value;
  const interval = els.chartInterval.value;
  const type = els.chartType.value;
  els.chartMessage.textContent = `Carregando grafico de ${chartSymbol}...`;

  try {
    const data = await api(`/api/chart/${encodeURIComponent(chartSymbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&type=${encodeURIComponent(type)}`);
    renderTradeChart(data.candles || [], type);
    els.chartMessage.textContent = data.warning || `${data.candles.length} pontos carregados.`;
  } catch (error) {
    clearChart();
    els.chartMessage.textContent = error.message;
  }
}

function renderTradeChart(candles, type) {
  clearChart();
  if (!candles.length) {
    els.chartMessage.textContent = "Sem dados para o grafico.";
    return;
  }

  const colors = chartColors();
  const chart = LightweightCharts.createChart(els.chartEl, {
    width: els.chartEl.clientWidth,
    height: els.chartEl.clientHeight,
    layout: {
      background: { color: colors.surface },
      textColor: colors.text
    },
    grid: {
      vertLines: { color: colors.line },
      horzLines: { color: colors.line }
    },
    rightPriceScale: { borderColor: colors.line },
    timeScale: {
      borderColor: colors.line,
      timeVisible: true,
      secondsVisible: false
    },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal }
  });

  if (type === "line") {
    const series = chart.addLineSeries({ color: colors.blue, lineWidth: 2 });
    series.setData(candles.map((item) => ({ time: item.time, value: item.close })));
  } else if (type === "volume") {
    const series = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: ""
    });
    series.setData(candles.map((item) => ({
      time: item.time,
      value: item.volume || 0,
      color: item.close >= item.open ? colors.green : colors.red
    })));
  } else {
    const candleSeries = chart.addCandlestickSeries({
      upColor: colors.green,
      downColor: colors.red,
      borderUpColor: colors.green,
      borderDownColor: colors.red,
      wickUpColor: colors.green,
      wickDownColor: colors.red
    });
    candleSeries.setData(candles.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close
    })));

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
      scaleMargins: { top: 0.78, bottom: 0 }
    });
    volumeSeries.setData(candles.map((item) => ({
      time: item.time,
      value: item.volume || 0,
      color: item.close >= item.open ? `${colors.green}80` : `${colors.red}80`
    })));
  }

  chart.timeScale().fitContent();
  state.chart = chart;
  state.chartResizeObserver = new ResizeObserver(() => {
    if (state.chart) state.chart.applyOptions({ width: els.chartEl.clientWidth, height: els.chartEl.clientHeight });
  });
  state.chartResizeObserver.observe(els.chartEl);
}

async function loadWorld() {
  setStatus("Atualizando mundo agora...");
  els.refreshWorld.disabled = true;
  try {
    state.world = await api("/api/world");
    state.sources = state.world.sources;
    renderSourceState();
    renderWorld();
    setStatus(`Mundo atualizado em ${new Date(state.world.fetchedAt).toLocaleString("pt-BR")}.`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.refreshWorld.disabled = false;
  }
}

async function loadAsset(symbol, source = "auto", chartSymbol = null, name = null) {
  const clean = String(symbol || "").trim().toUpperCase();
  if (!clean) return;
  state.selected = {
    symbol: clean,
    chartSymbol: chartSymbol || yahooSymbolFor(clean),
    source,
    name: name || clean
  };
  els.assetInput.value = clean;
  renderWorld();
  setStatus(`Abrindo ${clean}...`);

  try {
    const path = source === "b3"
      ? `/api/asset/${encodeURIComponent(clean)}?source=b3`
      : `/api/asset/${encodeURIComponent(source === "yahoo" ? yahooSymbolFor(clean) : clean)}?source=${encodeURIComponent(source)}`;
    state.asset = await api(path);
  } catch (error) {
    state.asset = {
      source,
      symbol: clean,
      yahooSymbol: yahooSymbolFor(clean),
      yahooUrl: yahooUrl(clean),
      quote: { name: name || clean, currency: isBrazilianTicker(clean) ? "BRL" : "" },
      description: error.message,
      news: []
    };
  }

  state.selected.chartSymbol = state.asset.yahooSymbol || state.asset.symbol || state.selected.chartSymbol;
  renderAsset();
  await Promise.allSettled([loadComponents(clean, source), loadChart()]);
  setStatus(`${clean} carregado.`);
}

async function loadIndex(symbol, source, chartSymbol, name) {
  const clean = String(symbol || "").trim().toUpperCase();
  state.selected = {
    symbol: clean,
    chartSymbol: chartSymbol || yahooSymbolFor(clean),
    source,
    name: name || clean
  };
  renderWorld();

  try {
    if (source === "b3") {
      const data = await api(`/api/index/${encodeURIComponent(clean)}`);
      state.asset = {
        source: "b3",
        symbol: data.symbol,
        yahooSymbol: data.yahooSymbol,
        yahooUrl: yahooUrl(data.yahooSymbol),
        quote: data.quote,
        description: `${data.name || data.symbol}: indice da B3 com ${data.totalComponents || 0} componentes oficiais.`,
        news: []
      };
      state.selected.chartSymbol = data.yahooSymbol || state.selected.chartSymbol;
    } else {
      state.asset = await api(`/api/index/${encodeURIComponent(clean)}`);
      state.selected.chartSymbol = state.asset.symbol || clean;
    }
  } catch (error) {
    state.asset = {
      source,
      symbol: clean,
      yahooSymbol: chartSymbol || clean,
      yahooUrl: yahooUrl(chartSymbol || clean),
      quote: { name: name || clean },
      description: error.message,
      news: []
    };
  }

  renderAsset();
  await Promise.allSettled([loadComponents(clean, source), loadChart()]);
  setStatus(`${clean} carregado.`);
}

async function loadComponents(symbol, source) {
  try {
    if (source === "b3") {
      const data = await api(`/api/dashboard?index=${encodeURIComponent(symbol)}`);
      state.componentsOfficial = true;
      state.components = data.components || [];
    } else {
      const data = await api(`/api/index/${encodeURIComponent(symbol)}/components`);
      state.componentsOfficial = Boolean(data.official);
      state.components = data.components || [];
    }
  } catch (error) {
    state.componentsOfficial = false;
    state.components = [];
    els.componentsMessage.textContent = error.message;
  }
  renderComponents();
}

async function importPortfolioText(text) {
  const parsed = await api("/api/portfolio/parse", {
    method: "POST",
    body: JSON.stringify({ text })
  });
  state.portfolio = parsed.positions.map((position) => ({ ...position, quote: null, error: null }));
  savePortfolio();
  els.portfolioStatus.textContent = `${parsed.imported} posicoes importadas; ${parsed.rejected} linhas ignoradas.`;
  renderPortfolio();
  enrichPortfolio();
}

function renderPortfolio() {
  if (!state.portfolio.length) {
    els.portfolioList.innerHTML = `<p class="empty-state">Nenhuma posicao importada.</p>`;
    return;
  }
  els.portfolioList.innerHTML = state.portfolio.map((item) => {
    const quote = item.quote || {};
    const value = typeof quote.price === "number" ? quote.price * item.quantity : null;
    return `
      <article class="portfolio-item">
        <b>${item.symbol}</b>
        <div class="company">Qtd. ${formatters.number.format(item.quantity)} · ${item.yahooSymbol}</div>
        <div>${formatPrice(quote.price, quote.currency)} <span class="${variationClass(quote.changePercent)}">${formatPercent(quote.changePercent)}</span></div>
        <div class="company">Valor estimado: ${formatPrice(value, quote.currency)} ${item.error ? `· ${item.error}` : ""}</div>
      </article>
    `;
  }).join("");
}

async function enrichPortfolio() {
  const enriched = await Promise.all(state.portfolio.map(async (item) => {
    try {
      const source = isBrazilianTicker(item.symbol) ? "b3" : "auto";
      const data = await api(`/api/asset/${encodeURIComponent(item.symbol)}?source=${source}`);
      return { ...item, quote: data.quote || null, error: null };
    } catch (error) {
      return { ...item, quote: null, error: error.message };
    }
  }));
  state.portfolio = enriched;
  savePortfolio();
  renderPortfolio();
}

els.assetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const source = els.sourceSelect.value;
  const symbol = els.assetInput.value.trim();
  loadAsset(symbol, source);
});

els.refreshWorld.addEventListener("click", loadWorld);

els.worldGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".index-card");
  if (!card) return;
  const symbol = card.dataset.symbol;
  const source = card.dataset.source;
  const chartSymbol = card.dataset.chartSymbol;
  const item = state.world?.indices.find((entry) => entry.symbol === symbol);
  loadIndex(symbol, source, chartSymbol, item?.name);
});

[els.chartType, els.chartRange, els.chartInterval].forEach((control) => {
  control.addEventListener("change", loadChart);
});

els.toggleComponentsSort.addEventListener("click", () => {
  state.sortComponentsByChange = !state.sortComponentsByChange;
  renderComponents();
});

els.portfolioFile.addEventListener("change", async () => {
  const file = els.portfolioFile.files?.[0];
  if (!file) return;
  els.portfolioText.value = await file.text();
});

els.importPortfolio.addEventListener("click", () => {
  importPortfolioText(els.portfolioText.value).catch((error) => {
    els.portfolioStatus.textContent = error.message;
  });
});

els.clearPortfolio.addEventListener("click", () => {
  state.portfolio = [];
  savePortfolio();
  els.portfolioText.value = "";
  els.portfolioStatus.textContent = "Carteira limpa.";
  renderPortfolio();
});

async function boot() {
  renderPortfolio();
  await loadWorld();
  await loadIndex("IBOV", "b3", "^BVSP", "Ibovespa");
  if (state.portfolio.length) enrichPortfolio();
}

boot();
