#!/usr/bin/env bash
#
# Lancador local dos apps deste repositorio.
#
#   ./rodar.sh          curso de piano (padrao)
#   ./rodar.sh piano    idem
#   ./rodar.sh b3       painel de mercado
#
# Sobe o servidor, espera ele responder e abre o navegador sozinho.
# Ctrl+C encerra o servidor.
#
# A porta pode ser trocada pelo ambiente:  PIANO_PORT=8080 ./rodar.sh
# Se a porta escolhida estiver ocupada, o script procura a proxima livre.

set -euo pipefail

cd "$(dirname "$0")"

app="${1:-piano}"

case "$app" in
  piano)
    entrada="piano/serve.mjs"; porta_padrao=4180; var_porta="PIANO_PORT"; nome="Piano Teoria" ;;
  b3)
    entrada="b3/server.mjs";   porta_padrao=4173; var_porta="PORT";       nome="Monitor B3" ;;
  -h|--help|ajuda)
    sed -n '3,13p' "$0" | sed 's/^# \{0,1\}//'
    exit 0 ;;
  *)
    echo "App desconhecido: '$app'." >&2
    echo "Use: ./rodar.sh [piano|b3]" >&2
    exit 1 ;;
esac

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nao encontrado." >&2
  echo "Instale em https://nodejs.org (versao 18 ou superior) e rode de novo." >&2
  echo >&2
  echo "Sem Node, o piano ainda abre direto: piano/index.html no navegador." >&2
  exit 1
fi

# Porta livre? Testa abrindo um socket — nao depende de lsof/ss/netstat.
porta_livre() {
  node -e '
    const net = require("net");
    const s = net.createServer();
    s.once("error", () => process.exit(1));
    s.once("listening", () => s.close(() => process.exit(0)));
    s.listen(Number(process.argv[1]), "127.0.0.1");
  ' "$1" 2>/dev/null
}

porta="${!var_porta:-$porta_padrao}"
inicial="$porta"
tentativas=0
while ! porta_livre "$porta"; do
  tentativas=$((tentativas + 1))
  if [ "$tentativas" -gt 20 ]; then
    echo "Nao achei porta livre entre $inicial e $porta." >&2
    exit 1
  fi
  porta=$((porta + 1))
done
if [ "$porta" != "$inicial" ]; then
  echo "Porta $inicial ocupada, usando $porta."
fi

url="http://localhost:$porta"

if [ "$app" = "b3" ] && [ ! -f b3/.env ]; then
  echo "Aviso: b3/.env nao existe. O painel sobe, mas as fontes que exigem"
  echo "       RAPIDAPI_KEY ficam indisponiveis. Modelo: b3/.env.example"
  echo
fi

export "$var_porta=$porta"
node "$entrada" &
servidor=$!

trap 'kill "$servidor" 2>/dev/null || true' EXIT INT TERM

# Espera o servidor responder de fato antes de abrir o navegador — abrir antes
# mostra "conexao recusada" e a pessoa acha que quebrou.
responde() {
  node -e '
    const http = require("http");
    const req = http.get(process.argv[1], r => { r.resume(); process.exit(r.statusCode < 500 ? 0 : 1); });
    req.on("error", () => process.exit(1));
    req.setTimeout(1000, () => { req.destroy(); process.exit(1); });
  ' "$url" 2>/dev/null
}

pronto=0
for _ in $(seq 1 60); do
  if ! kill -0 "$servidor" 2>/dev/null; then
    echo "O servidor encerrou sozinho. Veja a mensagem acima." >&2
    exit 1
  fi
  if responde; then pronto=1; break; fi
  sleep 0.25
done

if [ "$pronto" != 1 ]; then
  echo "O servidor nao respondeu a tempo em $url." >&2
  exit 1
fi

abrir_navegador() {
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$1" >/dev/null 2>&1 & return 0; fi
  if command -v open >/dev/null 2>&1; then open "$1" >/dev/null 2>&1 & return 0; fi
  if command -v wslview >/dev/null 2>&1; then wslview "$1" >/dev/null 2>&1 & return 0; fi
  if command -v powershell.exe >/dev/null 2>&1; then
    powershell.exe -NoProfile Start-Process "$1" >/dev/null 2>&1 & return 0
  fi
  return 1
}

echo
echo "  $nome  ->  $url"
echo "  Ctrl+C para encerrar."
echo

if ! abrir_navegador "$url"; then
  echo "  (Nao consegui abrir o navegador daqui — abra o endereco acima na mao.)"
  echo
fi

wait "$servidor"
