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

**Curso** — 19 modulos, 50 licoes, em tres niveis:

| Nivel | Modulos | Conteudo |
|---|---|---|
| Iniciante | 0–5 | teclado, frequencia, temperamento igual, intervalos, serie harmonica, ciclo de quintas, escala maior |
| Intermediario | 6–13 | menores, modos gregos, campo harmonico, tetrades, ii-V-I, pentatonicas, blues, rock, pop |
| Avancado | 14–18 | escalas simetricas, menor melodica e bebop, escalas do mundo, tensoes e reharmonizacao, tecnica e rotina |

**Ferramentas**

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
├── index.html          shell
├── styles.css          tema claro/escuro via light-dark()
├── serve.mjs           servidor estatico minimo (opcional)
├── test-theory.mjs     891 assercoes sobre o motor teorico
└── js/
    ├── theory.js       motor: notas, grafia, intervalos, 50 escalas,
    │                   33 acordes, harmonizacao, armaduras, fisica
    ├── keyboard.js     desenho SVG do teclado
    ├── audio.js        sintetizador e metronomo (Web Audio API)
    ├── curriculum-a.js modulos 0–9
    ├── curriculum-b.js modulos 10–18
    ├── widgets.js      96 visualizacoes usadas nas licoes
    └── app.js          roteamento, views, progresso
```

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

Tambem confere que toda escala e tonica citadas nas licoes existem, e que os 96 widgets
referenciados estao implementados.

## Limites conhecidos

- O piano e uma grade fixa de 12 alturas. As **blue notes** do blues e os intervalos de quarto de
  tom dos *maqamat* arabes e turcos **nao existem** no teclado — o que se toca e uma aproximacao.
  O material diz isso explicitamente nos modulos 11 e 16, em vez de fingir cobertura total.
- O sintetizador soma parciais da serie harmonica; serve para conferir intervalos e escalas, nao
  para substituir o som de um piano.
