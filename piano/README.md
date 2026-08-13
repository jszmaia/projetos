# Piano Teoria

Aplicativo de estudo de piano e teoria musical em portugues, do iniciante ao avancado.

O material foi escrito com uma premissa: **nada de decorar**. Cada escala, cada acorde e cada
regra e deduzido da fisica do som (serie harmonica) e da aritmetica dos 12 semitons. Quando o
texto diz que a escala maior tem o padrao T-T-S-T-T-T-S, ele mostra de onde esse padrao vem —
sete quintas justas consecutivas reordenadas dentro de uma oitava.

## Como abrir

Duas formas, ambas sem instalar nada:

```bash
# 1. servidor local
npm start              # de dentro desta pasta
npm run piano          # ou, da raiz do repositorio
# abre em http://localhost:4180

# 2. direto no navegador
# basta abrir piano/index.html — os scripts sao classicos, nao modulos ES,
# entao funciona pelo protocolo file://
```

Nao ha build, nao ha dependencias, nao ha rede. Todo o audio e sintetizado pela Web Audio API.

## O que tem dentro

**Curso** — 20 modulos, 53 licoes, em quatro niveis:

| Nivel | Modulos | Conteudo |
|---|---|---|
| Iniciante | 0–5 | teclado, frequencia, temperamento igual, intervalos, serie harmonica, ciclo de quintas, escala maior |
| Intermediario | 6–13 | menores, modos gregos, campo harmonico, tetrades, ii-V-I, pentatonicas, blues, rock, pop |
| Avancado | 14–18 | escalas simetricas, menor melodica e bebop, escalas do mundo, tensoes e reharmonizacao, tecnica e rotina |
| Tecnica | pack `tecnica` | exercicios de mecanismo tocaveis em qualquer tonalidade — Hanon nº 1, escala, arpejo, tercas, movimento contrario, cadencia |

**Ferramentas**

- **Player de exercicios** — piano-roll com as teclas acendendo, tempo ajustavel e maos
  separadas. Troque a tonalidade e o exercicio e regenerado.

- **Explorador de escalas** — 50 escalas com diagrama, formula, graus, vetor intervalar, campo
  harmonico, escalas vizinhas e a razao de existirem.
- **Construtor de acordes** — 33 tipos, todas as inversoes, e quais escalas contem cada acorde.
- **Circulo de quintas** interativo com armaduras e relativos menores.
- **Laboratorio** — calculadora de frequencia, serie harmonica, comparacao entre afinacao justa
  e temperamento igual, os commas, geometria do teclado.
- **Referencia** — tabela filtravel de todas as escalas e acordes.
- **Metronomo** com subdivisao e indicador visual.

## Arquitetura

```
piano/
├── index.html          shell — e a FONTE DE VERDADE da lista de scripts
├── styles.css          tema claro/escuro via light-dark()
├── serve.mjs           servidor estatico minimo (opcional)
├── build-single.mjs    empacota tudo num HTML autocontido
├── test-theory.mjs     1262 assercoes
├── content/            FONTE dos content packs (Markdown revisavel)
│   └── tecnica/        pack.json + uma licao por arquivo .md
├── tools/
│   └── build-content.mjs   content/ → js/pack-<id>.js
└── js/
    ├── theory.js       motor: notas, grafia, intervalos, 50 escalas,
    │                   33 acordes, harmonizacao, armaduras, fisica
    ├── exercises.js    exercicios de tecnica gerados por regra
    ├── keyboard.js     desenho SVG do teclado
    ├── audio.js        sintetizador, metronomo e linha do tempo
    ├── curriculum-a.js modulos 0–9
    ├── curriculum-b.js modulos 10–18
    ├── pack-tecnica.js GERADO por tools/build-content.mjs
    ├── widgets.js      97 visualizacoes usadas nas licoes
    └── app.js          roteamento, views, progresso
```

### Exercicios sao regras, nao notas

`js/exercises.js` guarda o **padrao**, e as notas sao geradas na hora. O Hanon nº 1,
por exemplo, cabe em oito numeros — o padrao em graus da escala:

```
[0, +2, +3, +4, +5, +4, +3, +2]   transposto um grau a cada repeticao
```

Isso gera as 224 notas da mao direita. As consequencias sao praticas: nao ha o que
digitar errado, e o mesmo exercicio existe em **todas as 12 tonalidades**, com as
notas recalculadas — coisa que o livro impresso nao oferece.

Cada exercicio declara sua **proveniencia**, para nao apresentar invencao como fonte
historica:

| `source` | Significado |
|---|---|
| `hanon` | padrao conferido nota a nota contra o texto impresso |
| `derivado` | construido a partir de `theory.js`; correto por construcao, mas nao e transcricao de nenhuma edicao |

Hoje so o Hanon nº 1 tem `source: "hanon"`. Os nº 2–60 exigem a partitura em maos;
o motor ja esta pronto para recebe-los — cada um custa uma linha de numeros.

### Notacao: piano-roll, nao pauta

O player desenha um **piano-roll alinhado ao teclado**, com as teclas acendendo. Isso
e uma escolha, nao uma limitacao encontrada: renderizar pauta tradicional e um projeto
inteiro por si so, e para quem esta ao teclado aprendendo, ver a forma do exercicio
subindo e descendo sobre as teclas e mais legivel que ler claves.

### Content packs

Conteudo novo nao precisa tocar na aplicacao: `js/app.js` so le `PT.CURRICULUM`, e
qualquer script carregado antes dele pode acrescentar modulos.

A fonte fica em Markdown, porque escrever conteudo dentro de template literals em JS
e insuportavel (aspas escapadas, diff ilegivel). O JS gerado e **commitado**, para o
runtime continuar sem build.

```bash
node tools/build-content.mjs           # compila todos os packs
node tools/build-content.mjs tecnica   # so um
```

O Markdown aceita um subconjunto (titulos, listas, tabelas, citacao, cerca de codigo),
HTML cru para o que o subconjunto nao cobre, e diretivas de widget:

```markdown
::scale tonic=C scale=jonio
::exercise ex=hanon-1 tonic=C
```

Ao criar um pack novo, acrescente o `<script src>` no `index.html` — o empacotador
deriva a lista dali, entao nao ha uma segunda lista para manter em sincronia.

### Nada e tabelado a mao

Este e o principio de projeto do codigo. As escalas sao armazenadas apenas como **padroes de
passos em semitons**; tudo o mais e calculado:

- A **grafia** das notas vem do ciclo de letras. Uma escala de 7 notas usa cada letra exatamente
  uma vez, e por isso Fa♯ maior sai como `F♯ G♯ A♯ B C♯ D♯ E♯` (com o Mi♯ correto, e nao Fa).
- A **armadura** e obtida contando os acidentes da escala maior grafada, nao consultando uma lista.
- O **campo harmonico** e gerado empilhando tercas sobre cada grau e identificando a qualidade
  resultante contra o catalogo de acordes.
- As **frequencias** saem de `f(n) = 440 × 2^((n−69)/12)`; os **cents**, de `1200 × log₂(r)`.

### A geometria do teclado tambem e calculada

As teclas pretas nao estao centradas na divisa entre as brancas. A posicao sai de uma restricao
real de fabricacao: dentro de cada grupo, as partes visiveis das teclas brancas tem todas a
mesma largura.

```
grupo com n brancas (largura W) e k pretas (largura b):
  haste  = (n·W − k·b) / n
  centro da preta i = haste + b/2 + i·(haste + b)
```

Com `b = 0,58·W` isso produz os deslocamentos reais: Do♯ e Fa♯ ficam a esquerda da divisa,
Sol♯ fica centrado, Re♯ e La♯ ficam a direita. Todos os diagramas usam essas posicoes.

## Testes

```bash
npm test                      # de dentro desta pasta
node piano/test-theory.mjs    # ou, da raiz do repositorio
```

Verifica que os passos de toda escala somam 12, que toda escala de 7 notas usa cada letra uma
unica vez nas 12 tonalidades, que o campo harmonico maior produz `maj7 m7 m7 maj7 7 m7 m7♭5` em
todas as tonalidades, que a escala alterada de X e a menor melodica de X+1 semitom, e que os
numeros fisicos citados no material batem (comma pitagorico = 23,460 cents; quinta justa =
701,955; 7o harmonico = 968,826; batimento da terca maior em Do4 ≈ 10,4 Hz).

Tambem confere que toda escala, tonica e exercicio citados nas licoes existem, que os 97
widgets referenciados estao implementados, que o Hanon nº 1 gerado bate nota a nota com o
texto impresso, que todo exercicio gera MIDI dentro das 88 teclas em todas as tonalidades,
e que a lista de scripts do `index.html` nao divergiu do empacotador.

## Limites conhecidos

- O piano e uma grade fixa de 12 alturas. As **blue notes** do blues e os intervalos de quarto de
  tom dos *maqamat* arabes e turcos **nao existem** no teclado — o que se toca e uma aproximacao.
  O material diz isso explicitamente nos modulos 11 e 16, em vez de fingir cobertura total.
- O sintetizador soma parciais da serie harmonica; serve para conferir intervalos e escalas, nao
  para substituir o som de um piano.
