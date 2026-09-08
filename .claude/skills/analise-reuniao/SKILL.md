---
name: analise-reuniao
description: Analisa transcrições de reuniões de trabalho e entrega um documento .docx com três blocos — o que foi pedido, como deve ser feito e o to-do específico da Joyce. Use sempre que o usuário colar uma transcrição, ata, notas ou resumo de reunião (Teams, Meet, Zoom, gravação transcrita) e pedir para entender o que rolou, o que foi decidido, o que ficou pendente ou quais são as tarefas dele. Também vale quando perguntarem "o que eu preciso fazer depois dessa reunião?", "o que pediram pra mim?" ou "me explica essa reunião". Não use para reescrever atas formais para envio externo nem para transcrever áudio.
---

# Análise de reunião de trabalho

Você recebe uma transcrição (geralmente bagunçada, com fala sobreposta, ruído de
transcrição automática e nomes abreviados) e devolve um entendimento acionável.
A pessoa que lê é a **Joyce** — o objetivo final é ela saber exatamente o que
sair fazendo.

## Antes de escrever

1. Leia a transcrição inteira. Não resuma por trechos.
2. Identifique os participantes e quem tem autoridade de decisão (quem pede,
   quem aprova, quem executa).
3. Separe o que é **decisão fechada** do que é **ideia solta / brainstorm**.
   Transcrição está cheia de "a gente podia..." que nunca virou pedido.
4. Marque tudo que ficou **ambíguo ou sem dono**. Isso é o material mais valioso
   da análise — é o que vira retrabalho depois.
5. Não invente prazo, nome ou decisão que não está na transcrição. Se não foi
   dito, escreva "não definido na reunião".

## Entrega

**Sempre gere um arquivo .docx**, além de mostrar a análise no chat. Não pergunte
se a pessoa quer o documento — ela quer, todas as vezes.

- Use a skill `docx` para gerar. `npm install docx` no diretório de trabalho se
  o `require('docx')` falhar.
- Nome do arquivo: `Analise-Reuniao-<assunto-da-reuniao>.docx`, sem acentos e
  com hifens no lugar de espaços.
- Salve no scratchpad da sessão e **envie com `SendUserFile`** (`status: normal`,
  `display: attach`) para a Joyce baixar. Este ambiente roda em container remoto:
  você não escreve no Desktop dela — o download acontece pelo card do arquivo.
- Cabeçalho do documento: título da reunião, lista de participantes, duração se
  a transcrição informar.
- Formatação: Heading 1 para os três blocos, Heading 2 para cada item dentro
  deles, marcadores de verdade (numbering com `LevelFormat.BULLET`), checklist
  com o caractere `☐`, e os avisos `⚠` em negrito vermelho (`B03A2E`).

## Formato da resposta

Sempre estes três blocos, nesta ordem, com estes títulos — no chat e no .docx.

### 1. O que foi pedido

Lista dos pedidos e decisões concretas. Para cada item:

- **O pedido** em uma frase, no verbo original de quem pediu.
- **Quem pediu** e **para quem** ficou.
- **Contexto**: por que pediram (o problema por trás).
- **Prazo**: o que foi dito, ou "não definido".

Se houver decisão que muda algo já em andamento, destaque com `⚠️ muda o que já estava combinado`.

### 2. Como deve ser feito

Aqui você interpreta, não só transcreve. Para os pedidos principais:

- Critério de pronto: como saber que está entregue (do jeito que a reunião
  descreveu, ou o mais próximo disso).
- Restrições e premissas ditas na reunião (ferramenta, formato, quem valida,
  o que não pode ser feito).
- Ordem sugerida / dependências: o que precisa acontecer antes do quê.
- Riscos e pontos ambíguos: onde a reunião não fechou e vai dar problema.

Quando a reunião não deixou claro o "como", diga isso explicitamente e proponha
um caminho, marcado como **sugestão sua**, não como decisão da reunião.

### 3. To-do da Joyce

Só o que é responsabilidade da Joyce — direta ("Joyce, você faz X") ou implícita
(ela é a única pessoa da área citada, ou assumiu na fala). Checklist:

- [ ] Ação começando com verbo no infinitivo, específica e pequena o bastante para ser feita numa sessão de trabalho — (prazo) — (depende de: …)

Ordene por urgência/dependência, não pela ordem em que apareceu na reunião.

Depois da checklist, dois blocos curtos:

**Perguntas a fazer antes de começar** — o que a Joyce precisa confirmar com
quem, para não trabalhar em cima de suposição.

**O que ficou com outra pessoa** — itens que alguém pode cobrar dela por engano,
com o nome do dono real.

## Tom

Direto, em português do Brasil, sem jargão corporativo vazio. Nada de "alinhar
sinergias". Se a reunião foi confusa ou improdutiva, pode dizer isso — mas
sempre entregando o que dá para extrair.
