# projetos

Dois aplicativos independentes, cada um autocontido em sua propria pasta. Eles nao compartilham
codigo, dependencias nem configuracao — voce pode trabalhar em um sem tocar no outro.

| Pasta | Projeto | O que e | Como rodar |
|---|---|---|---|
| [`b3/`](b3/README.md) | **B3 Bolsa Monitor** | Painel de mercado brasileiro e global, com dados da B3 e do Yahoo Finance via RapidAPI. Exige uma chave de API. | `npm run b3` → `http://localhost:4173` |
| [`piano/`](piano/README.md) | **Piano Teoria** | Curso de piano e teoria musical, do iniciante ao avancado. Sem dependencias, sem build, sem rede. | `npm run piano` → `http://localhost:4180` |

Cada pasta tambem tem seu proprio `package.json`, entao voce pode entrar nela e rodar direto:

```bash
cd b3    && npm start     # painel da B3
cd piano && npm start     # app de piano
cd piano && npm test      # testes do motor teorico
```

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
    ├── test-theory.mjs   891 assercoes sobre o motor teorico
    └── js/               motor teorico, teclado SVG, audio, curriculo
```

## Diferencas importantes entre os dois

- **b3/** precisa de rede e de uma chave da RapidAPI configurada em `b3/.env`
  (veja `b3/.env.example`). Sem a chave, o painel ainda mostra os dados oficiais da B3.
- **piano/** nao precisa de nada: funciona ate abrindo `piano/index.html` direto no navegador,
  pelo protocolo `file://`.

O arquivo `.env` esta no `.gitignore` e nunca deve ser versionado.
