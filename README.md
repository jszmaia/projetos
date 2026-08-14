# projetos

Dois aplicativos independentes, cada um autocontido em sua propria pasta. Eles nao compartilham
codigo, dependencias nem configuracao — voce pode trabalhar em um sem tocar no outro.

| Pasta | Projeto | O que e | Como rodar |
|---|---|---|---|
| [`b3/`](b3/README.md) | **B3 Bolsa Monitor** | Painel de mercado brasileiro e global, com dados da B3 e do Yahoo Finance via RapidAPI. Exige uma chave de API. | `npm run b3` → `http://localhost:4173` |
| [`piano/`](piano/README.md) | **Piano Teoria** | Curso de piano e teoria musical, do iniciante ao avancado. Sem dependencias, sem build, sem rede. | `npm run piano` → `http://localhost:4180` |

## Rodar com um comando

```bash
./rodar.sh          # curso de piano (padrao)
./rodar.sh b3       # painel de mercado
```

O script sobe o servidor, **espera ele responder** e abre o navegador sozinho. Se a porta
estiver ocupada, procura a proxima livre em vez de falhar. `Ctrl+C` encerra.

Para escolher a porta: `PIANO_PORT=8080 ./rodar.sh`

Se preferir os comandos crus, cada pasta tem seu proprio `package.json`:

```bash
npm run piano             # ou: cd piano && npm start
npm run b3                # ou: cd b3    && npm start
cd piano && npm test      # testes do motor teorico
```

## Abrir o piano sem terminal

O piano dispensa servidor: da para abrir `piano/index.html` direto no navegador, pelo
protocolo `file://`.

Para levar o curso a um aparelho que nao tem este repositorio — outro computador, um tablet —
gere o arquivo unico:

```bash
node piano/build-single.mjs        # → piano/dist/piano-teoria.html
```

Sai um HTML de ~360 KB com CSS e scripts embutidos. Copie so esse arquivo, de dois cliques e
pronto: abre no navegador, funciona offline, nao precisa de Node nem de terminal.

Um detalhe de navegador, nao do app: o som so comeca depois do primeiro clique na pagina.
Navegadores bloqueiam audio ate haver interacao do usuario.

## Estrutura

```
.
├── b3/        painel de mercado — servidor Node + frontend estatico
│   ├── server.mjs        API + arquivos estaticos (le b3/.env)
│   ├── index.html app.js styles.css
│   └── .env.example      modelo da chave da RapidAPI
│
└── piano/     curso de piano — 100% estatico
    ├── index.html styles.css
    ├── serve.mjs         servidor estatico opcional
    ├── test-theory.mjs   1262 assercoes sobre o motor teorico
    └── js/               motor teorico, teclado SVG, audio, curriculo
```

## Diferencas importantes entre os dois

- **b3/** precisa de rede e de uma chave da RapidAPI configurada em `b3/.env`
  (veja `b3/.env.example`). Sem a chave, o painel ainda mostra os dados oficiais da B3.
- **piano/** nao precisa de nada: funciona ate abrindo `piano/index.html` direto no navegador,
  pelo protocolo `file://`.

O arquivo `.env` esta no `.gitignore` e nunca deve ser versionado.
