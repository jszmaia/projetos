/*
 * curriculum-b.js — Modulos 10 a 18 (pentatonicas ate rotina de estudo).
 */
(function (global) {
  "use strict";

  global.PT = global.PT || {};
  global.PT.CURRICULUM = global.PT.CURRICULUM || [];

  global.PT.CURRICULUM.push(

  /* =================================================================== *
   * MODULO 10
   * =================================================================== */
  {
    id: "m10",
    title: "Escalas pentatonicas",
    level: "Intermediario",
    tag: "Escalas",
    summary: "Cinco notas, zero notas erradas. Por que a pentatonica aparece em todas as culturas do mundo, de forma independente.",
    goals: [
      "Derivar a pentatonica por quintas e por subtracao",
      "Entender por que ela nunca soa errada",
      "Conhecer os 5 modos pentatonicos",
      "Aplicar em improviso"
    ],
    lessons: [
      {
        id: "m10l1",
        title: "Duas derivacoes e uma prova",
        html: `
<h3>Derivacao 1 — por quintas</h3>
<p>No modulo 3, empilhamos 7 quintas e obtivemos a escala maior. Pare em <strong>5</strong>:</p>
<div class="w" data-w="penta-generation"></div>
<p>Do–Sol–Re–La–Mi, reordenados: <strong>Do Re Mi Sol La</strong>. Pentatonica maior.</p>

<h3>Derivacao 2 — por subtracao</h3>
<p>Tome a escala maior e remova os dois graus que formam semitons com seus vizinhos: o <strong>4o</strong> (Fa, que faz semitom com Mi) e o <strong>7o</strong> (Si, que faz semitom com Do).</p>
<div class="math-box">
  <div class="math-line">Do Re Mi <span class="strike">Fa</span> Sol La <span class="strike">Si</span></div>
  <div class="math-line accent">= 1 2 3 5 6 → passos 2 2 3 2 3</div>
</div>
<div class="w" data-w="scale" data-tonic="C" data-scale="pentatonica-maior"></div>

<h3>A prova: por que nao ha nota errada</h3>
<p>O vetor intervalar da pentatonica maior e <strong>&lt;0, 3, 2, 1, 4, 0&gt;</strong>:</p>
<div class="w" data-w="penta-vector"></div>
<div class="callout callout--key">
<strong>Primeiro numero zero:</strong> nenhum par de notas forma <strong>segunda menor</strong>. <strong>Ultimo numero zero:</strong> nenhum par forma <strong>tritono</strong>. Como semitom e tritono sao as duas fontes de dissonancia aguda do sistema, a pentatonica e literalmente incapaz de produzi-las. Toque qualquer nota dela sobre a harmonia correspondente: nao existe escolha ruim.
</div>
<p>Compare com a escala maior, &lt;2,5,4,3,6,1&gt;: dois semitons e um tritono. Sao eles que criam direcao — e tambem os pontos onde se pode errar. A pentatonica troca direcao por seguranca.</p>

<h3>Por que ela e universal</h3>
<p>Lembre do modulo 1: a convergente <strong>3/5</strong> de log₂(3/2) ja produz uma quinta aceitavel. Ou seja, dividir a oitava em 5 partes e a <em>primeira</em> solucao viavel do problema de aproximacao. Qualquer cultura que buscasse consonancia por quintas chegaria em cinco notas antes de chegar em doze. Foi o que aconteceu na China, na Escocia, na Africa ocidental, na Indonesia e nos Andes — sem contato entre si. Nao e coincidencia cultural, e convergencia matematica.</p>

<h3>Pentatonica menor</h3>
<p>E o 5o modo da maior, ou seja, a relativa menor — mesma logica do modulo 4.</p>
<div class="w" data-w="scale" data-tonic="A" data-scale="pentatonica-menor"></div>
<div class="math-box">
  <div class="math-line">Do pentatonica maior = Do Re Mi Sol La</div>
  <div class="math-line">La pentatonica menor = La Do Re Mi Sol</div>
  <div class="math-note">Mesmas 5 notas. Centro diferente. Formula: 1 ♭3 4 5 ♭7 → 3 2 2 3 2.</div>
</div>
`,
        practice: [
          "Toque so as 5 teclas pretas: e uma pentatonica maior de Fa♯. Improvise nelas — nada soa errado.",
          "Peca a alguem para tocar Fa♯ e Do♯ no baixo enquanto voce improvisa nas pretas."
        ]
      },
      {
        id: "m10l2",
        title: "Os cinco modos e o uso pratico",
        html: `
<p>Como toda escala, a pentatonica tem tantos modos quantas notas. Todos usam as mesmas 5 teclas.</p>
<div class="w" data-w="penta-modes"></div>

<h3>Qual pentatonica usar sobre qual acorde</h3>
<table class="tbl">
<thead><tr><th>Acorde</th><th>Pentatonica</th><th>Resultado</th></tr></thead>
<tbody>
<tr><td>Cmaj7</td><td>Do maior</td><td>1 2 3 5 6 — som direto, consonante</td></tr>
<tr><td>Cmaj7</td><td>Sol maior (da 5a)</td><td>gera 5 6 7 9 3 — mais moderno, destaca a 7a</td></tr>
<tr><td>Cmaj7</td><td>Re maior (da 9a)</td><td>gera 9 3 ♯11 6 7 — som lidio</td></tr>
<tr><td>Dm7</td><td>Re menor</td><td>1 ♭3 4 5 ♭7 — direto</td></tr>
<tr><td>Dm7</td><td>La menor (da 5a)</td><td>gera 5 ♭7 1 9 11 — som dorico aberto</td></tr>
<tr><td>G7</td><td>Sol maior</td><td>1 2 3 5 6 = 13 — dominante suave</td></tr>
<tr><td>G7alt</td><td>La♭ menor (do ♭9)</td><td>gera ♭9 3 ♯9 ♯11 ♭13 — som alterado</td></tr>
<tr><td>Am7</td><td>La menor</td><td>a base do rock e do blues</td></tr>
</tbody>
</table>
<div class="callout callout--tip">
<strong>O truque das pentatonicas deslocadas:</strong> nao troque a escala, troque a tonica dela. Tocar a pentatonica menor uma quinta acima do acorde menor (La menor sobre Dm7) e um dos recursos mais eficientes para sair do obvio sem estudar nada novo.
</div>

<h3>Digitacao no piano</h3>
<p>A pentatonica nao cabe em 5 dedos por oitava de forma confortavel em todas as tonalidades. O padrao mais usado para a mao direita em Do maior:</p>
<div class="w" data-w="penta-fingering"></div>

<h3>Padroes de improviso</h3>
<p>Cinco figuras que cobrem a maior parte do vocabulario pentatonico:</p>
<div class="w" data-w="penta-patterns"></div>
`,
        practice: [
          "Toque a pentatonica maior de Do em 2 oitavas com metronomo.",
          "Improvise 2 minutos sobre um vamp de Am, usando so La pentatonica menor.",
          "Repita usando Mi pentatonica menor (a quinta acima). Compare."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 11
   * =================================================================== */
  {
    id: "m11",
    title: "Blues",
    level: "Intermediario",
    tag: "Estilo",
    summary: "A escala de blues, a blue note, o que ela realmente tenta imitar e por que o piano nunca consegue exatamente.",
    goals: [
      "Entender a origem acustica da blue note",
      "Dominar blues menor, maior e a forma completa",
      "Tocar o blues de 12 compassos",
      "Aplicar o atrito ♭3/3"
    ],
    lessons: [
      {
        id: "m11l1",
        title: "A blue note e o que ela imita",
        html: `
<p>A escala de blues menor e a <strong>pentatonica menor + uma nota</strong>: a ♭5.</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="blues-menor"></div>
<div class="math-box">
  <div class="math-line">Pentatonica menor: 1 ♭3 4 5 ♭7  → 3 2 2 3 2</div>
  <div class="math-line accent">Blues menor:       1 ♭3 4 <strong>♭5</strong> 5 ♭7  → 3 2 <strong>1 1</strong> 3 2</div>
</div>

<h3>De onde vem essa nota</h3>
<p>Aqui a matematica do modulo 3 volta com forca. As tradicoes vocais da Africa ocidental usam alturas que <strong>nao existem no piano</strong>. Duas em particular:</p>
<div class="w" data-w="blue-notes"></div>
<ul class="feature-list">
  <li><strong>7o harmonico (7:4)</strong> — 968,8 cents. A setima menor do piano tem 1000. O piano esta <strong>31,2 cents acima</strong>. Um cantor de blues canta "entre" as teclas.</li>
  <li><strong>Terca "neutra"</strong> — algo perto de 11:9 (347 cents), entre a terca menor (300) e a maior (400). Nem uma nem outra.</li>
</ul>
<div class="callout callout--key">
<strong>A blue note nao e uma nota do piano.</strong> E uma regiao entre teclas. O que o pianista faz e uma <em>aproximacao por vizinhanca</em>: toca ♭3 <em>e</em> 3 quase juntas, ou desliza de ♭5 para 5, criando por atrito a impressao de uma altura intermediaria. Quem toca guitarra faz bend; quem toca piano faz esmagamento e appoggiatura. E o mesmo problema resolvido de formas diferentes.
</div>

<h3>Blues maior</h3>
<p>A outra metade do vocabulario: pentatonica <strong>maior</strong> + ♭3.</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="blues-maior"></div>
<p>Aqui o atrito e entre ♭3 e 3, tocadas a um semitom de distancia. Esse e o som do gospel, do rock and roll, do boogie-woogie e do country.</p>

<h3>A escala completa do pianista de blues</h3>
<p>Na pratica, o pianista nao escolhe entre maior e menor — usa as duas, e a escala real tem <strong>9 notas</strong>:</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="blues-completa"></div>
<div class="math-box">
  <div class="math-line">1  2  ♭3  3  4  ♭5  5  6  ♭7</div>
  <div class="math-note">Blues maior ∪ blues menor. As notas "extras" (♭3, ♭5) sao de passagem, tocadas curtas e resolvidas.</div>
</div>
`,
        practice: [
          "Toque Do e Mi♭ juntos, depois solte o Mi♭ e segure o Mi. Esse esmagamento e a base do piano blues.",
          "Toque a escala de blues de Do em 2 oitavas, deslizando o polegar de Sol♭ para Sol."
        ]
      },
      {
        id: "m11l2",
        title: "A forma de 12 compassos",
        html: `
<p>A estrutura mais reproduzida da musica popular do seculo XX. Doze compassos, tres acordes.</p>
<div class="w" data-w="blues-form"></div>

<h3>A anomalia harmonica que define o estilo</h3>
<p>No blues, <strong>todos os tres acordes sao de setima de dominante</strong> — C7, F7, G7. Isso viola a regra do modulo 9, onde so o V grau produz dominante.</p>
<div class="callout callout--key">
<strong>Por que isso acontece:</strong> a ♭7 nao esta ali como funcao harmonica, e sim como <em>cor melodica</em> vinda da tradicao vocal (o 7o harmonico). O blues empurra a ♭7 para dentro de todos os acordes. Resultado: o sistema tonal europeu com uma sonoridade que ele nao previa. O blues nao "erra" a harmonia funcional — ele usa outra logica sobreposta.
</div>

<h3>Variacoes</h3>
<div class="w" data-w="blues-variants"></div>

<h3>Levadas de mao esquerda</h3>
<p>No piano, a mao esquerda sustenta o estilo. Tres padroes essenciais:</p>
<div class="w" data-w="blues-bass"></div>

<h3>Como improvisar</h3>
<ol class="steps">
  <li><strong>Nivel 1:</strong> use a blues menor da tonica sobre os 3 acordes. Sempre funciona.</li>
  <li><strong>Nivel 2:</strong> alterne blues menor e blues maior. Maior nos compassos de I, menor nos de IV e V.</li>
  <li><strong>Nivel 3:</strong> mude de escala junto com o acorde — mixolidio de cada acorde, com blue notes por cima.</li>
  <li><strong>Nivel 4:</strong> use as alteracoes do V7 (♭9, ♯9) no compasso 9 e no turnaround.</li>
</ol>
<div class="callout callout--tip">
Comece pelo nivel 1 e fique nele ate soar musical. A maior parte dos grandes solos de blues usa uma escala so; o que os torna bons e o <strong>ritmo</strong> e o <strong>espaco</strong>, nao a quantidade de notas.
</div>
`,
        practice: [
          "Toque o blues de 12 compassos em Do com a mao esquerda em shuffle.",
          "Improvise 3 chorus completos usando so Do blues menor.",
          "Transporte a forma para Fa e Sol."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 12
   * =================================================================== */
  {
    id: "m12",
    title: "Rock",
    level: "Intermediario",
    tag: "Estilo",
    summary: "Nao existe uma 'escala de rock' — existe um conjunto de escolhas. Aqui esta exatamente quais sao e por que.",
    goals: [
      "Entender o que realmente se usa no rock",
      "Dominar power chords e sua logica acustica",
      "Conhecer as progressoes fundamentais",
      "Usar o modo mixolidio e o ♭VII"
    ],
    lessons: [
      {
        id: "m12l1",
        title: "O que e a 'escala de rock'",
        html: `
<div class="callout callout--warn">
<strong>Vamos ser diretos:</strong> nao existe uma escala chamada "escala de rock" na teoria musical. O que existe e um <em>conjunto</em> de escalas que o genero usa, com pesos diferentes. Quem vende "a escala do rock" na internet esta, quase sempre, se referindo a pentatonica menor. Ela e a mais usada, mas esta longe de ser a unica.
</div>

<h3>O que o rock realmente usa, em ordem de frequencia</h3>
<div class="w" data-w="rock-scales"></div>

<h3>Os tres sons centrais</h3>
<ul class="feature-list">
  <li><strong>Pentatonica menor</strong> — a base dos riffs e solos. Segura, agressiva, sem semitons a resolver.</li>
  <li><strong>Blues menor</strong> — a pentatonica com a ♭5 de passagem. Praticamente todo solo de rock classico vive aqui.</li>
  <li><strong>Mixolidio</strong> — a escala do riff "maior com ♭7". Sweet Home Alabama, Sympathy for the Devil, praticamente todo AC/DC.</li>
</ul>
<div class="w" data-w="scale" data-tonic="E" data-scale="pentatonica-menor"></div>
<div class="w" data-w="scale" data-tonic="E" data-scale="mixolidio"></div>

<h3>A mistura caracteristica do rock</h3>
<p>O som "rock" vem de sobrepor tercas: harmonia maior com melodia de terca menor. Um riff em Mi maior com solo em Mi pentatonica menor cria o atrito Sol/Sol♯ constantemente. Isso vem direto do blues (modulo 11) — o rock e blues eletrificado, e sua ambiguidade modal e herdada.</p>
<div class="w" data-w="rock-friction"></div>
`,
        practice: [
          "Toque um riff em Mi usando E5-G5-A5 e improvise com Mi pentatonica menor.",
          "Depois troque para Mi mixolidio e ouca a diferenca de cor."
        ]
      },
      {
        id: "m12l2",
        title: "Power chords e progressoes",
        html: `
<h3>Power chord: por que existe</h3>
<p>O acorde 1–5 (sem terca) e chamado "power chord". Nao e preguica: e acustica.</p>
<div class="callout callout--key">
Com distorcao, o amplificador gera <strong>produtos de intermodulacao</strong> — somas e diferencas das frequencias presentes. Com apenas 1 e 5 (razao 3:2), os produtos caem em multiplos harmonicos da fundamental e <em>reforcam</em> a nota. Com uma terca (razao 5:4) somada, os produtos caem em frequencias dissonantes e o som embola. O power chord e a solucao de engenharia para tocar acordes com ganho alto.
</div>
<p>Consequencia: o power chord e <strong>ambiguo</strong> — nao e maior nem menor. Isso permite que o riff funcione tanto sobre harmonia maior quanto menor, e e outra fonte da ambiguidade modal do rock.</p>
<div class="w" data-w="power-chords"></div>

<h3>As progressoes fundamentais</h3>
<div class="w" data-w="rock-progressions"></div>

<h3>O acorde ♭VII: a marca do rock</h3>
<p>O ♭VII (Re maior em Mi menor, Sol maior em La menor) e o acorde mais caracteristico do genero. De onde vem?</p>
<ul>
  <li>Na tonalidade <strong>menor natural</strong>, ele e diatonico: aparece no 7o grau (modulo 8).</li>
  <li>Na tonalidade <strong>maior</strong>, ele e emprestado do mixolidio ou do menor paralelo.</li>
</ul>
<p>Ele funciona porque <strong>nao tem sensivel</strong>. A cadencia ♭VII–I e modal, nao tonal: nao ha tensao de semitom resolvendo, ha um movimento de tom inteiro. Isso soa aberto, arcaico, "sem gravidade" — exatamente o oposto do V7–I classico. E isso que da ao rock seu carater de forca sem submissao.</p>
<div class="w" data-w="flat-seven"></div>
`,
        practice: [
          "Toque i–♭VII–♭VI–♭VII em La menor (Am–G–F–G) com a esquerda em oitavas.",
          "Compare Am–E7–Am (tonal) com Am–G–Am (modal). Ouca a diferenca de gravidade."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 13
   * =================================================================== */
  {
    id: "m13",
    title: "Pop: progressoes e acompanhamento",
    level: "Intermediario",
    tag: "Estilo",
    summary: "As poucas progressoes que sustentam milhares de musicas, e por que funcionam tao bem.",
    goals: [
      "Dominar as 6 progressoes mais usadas",
      "Entender a logica do vi-IV-I-V",
      "Tocar acompanhamento com voicings modernos",
      "Usar sus, add9 e baixos invertidos"
    ],
    lessons: [
      {
        id: "m13l1",
        title: "As progressoes que dominam o pop",
        html: `
<p>Pop nao usa escalas exoticas. Usa a escala maior e a menor natural, com um punhado de progressoes muito eficientes.</p>
<div class="w" data-w="pop-progressions"></div>

<h3>A progressao dos 4 acordes</h3>
<p><strong>I – V – vi – IV</strong> (e sua rotacao <strong>vi – IV – I – V</strong>) e a progressao mais usada da musica popular contemporanea. Por que ela funciona tao bem?</p>
<ol class="steps">
  <li><strong>Contem as tres funcoes.</strong> I e vi (tonica), IV (subdominante), V (dominante). O ciclo completo.</li>
  <li><strong>Ambiguidade maior/menor.</strong> Comecando em I soa maior e otimista; comecando em vi soa menor e melancolica. Sao os mesmos quatro acordes. Isso permite que o refrao "abra" sem trocar de harmonia.</li>
  <li><strong>Circularidade.</strong> IV volta para I sem tensao forte, entao o loop pode repetir infinitamente sem cansar nem exigir conclusao.</li>
  <li><strong>Conducao minima.</strong> Com inversoes, as vozes praticamente nao se movem.</li>
</ol>
<div class="w" data-w="four-chords"></div>

<h3>A progressao "sensivel descendente"</h3>
<p><strong>I – V/vii – vi – V/v – IV</strong>, ou seja, baixo descendo por grau: Do–Si–La–Sol–Fa. Chamada de <em>linha de baixo descendente</em>. Usa inversoes para criar uma melodia no baixo.</p>
<div class="w" data-w="descending-bass"></div>

<h3>Emprestimo modal no pop</h3>
<p>Dois acordes emprestados do menor paralelo aparecem constantemente:</p>
<ul>
  <li><strong>iv menor</strong> (Fm em Do maior) — o som "agridoce" de milhares de refroes. Contem La♭, que desce meio tom para Sol.</li>
  <li><strong>♭VI e ♭VII</strong> (La♭ e Si♭ em Do maior) — som epico, usado em pontes e finais.</li>
</ul>
<div class="w" data-w="modal-borrow"></div>
`,
        practice: [
          "Toque I–V–vi–IV em Do, Sol, Re e Mi♭.",
          "Toque a mesma progressao comecando em vi. Perceba a mudanca de humor.",
          "Substitua o IV por iv menor e ouca o efeito."
        ]
      },
      {
        id: "m13l2",
        title: "Voicings e acompanhamento moderno",
        html: `
<p>Tocar as triades em posicao fundamental soa datado. O pop moderno usa acordes abertos, com quartas e segundas.</p>

<h3>Regra basica de distribuicao</h3>
<div class="callout callout--key">
<strong>Esquerda:</strong> fundamental (sozinha, ou com a quinta) no registro grave.<br>
<strong>Direita:</strong> o resto do acorde, entre Do3 e Do5.<br>
<strong>Nunca</strong> toque tercas fechadas abaixo do Do3 — batimentos (modulo 3). Abra o intervalo ou use quintas.
</div>

<h3>Os voicings essenciais</h3>
<div class="w" data-w="pop-voicings"></div>

<h3>sus2, sus4 e add9</h3>
<p>Substituir ou acrescentar notas remove o peso da terca e abre o som:</p>
<ul>
  <li><strong>sus4</strong> (1 4 5) — a terca vira quarta. Tensao suave que pede resolucao para a terca.</li>
  <li><strong>sus2</strong> (1 2 5) — a terca vira segunda. Aberto, ambiguo, nem maior nem menor.</li>
  <li><strong>add9</strong> (1 3 5 9) — mantem a terca e acrescenta a nona. O som "brilhante" padrao do pop e do worship.</li>
</ul>
<div class="w" data-w="sus-chords"></div>

<h3>Baixos invertidos e pedal</h3>
<p>Cifras como C/G ou F/G indicam um baixo diferente da fundamental. Dois usos:</p>
<ul>
  <li><strong>Linha de baixo por grau</strong> — C – G/B – Am – Am/G – F.</li>
  <li><strong>Pedal</strong> — manter uma nota fixa no baixo enquanto a harmonia muda por cima. Cria tensao acumulada.</li>
</ul>
<div class="w" data-w="slash-chords"></div>

<h3>Padroes de mao (grooves)</h3>
<div class="w" data-w="pop-patterns"></div>
`,
        practice: [
          "Toque I–V–vi–IV em Do usando voicings abertos, sem dobrar a fundamental na direita.",
          "Repita com arpejos em colcheias.",
          "Adicione add9 em todos os acordes e compare."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 14
   * =================================================================== */
  {
    id: "m14",
    title: "Escalas simetricas",
    level: "Avancado",
    tag: "Escalas",
    summary: "Quando se divide a oitava em partes iguais: tons inteiros, diminutas e aumentada. Sons sem gravidade.",
    goals: [
      "Entender simetria como principio construtivo",
      "Saber quantas versoes distintas cada uma tem",
      "Usar cada uma sobre o acorde correto",
      "Explorar modulacao simetrica"
    ],
    lessons: [
      {
        id: "m14l1",
        title: "O principio da divisao igual",
        html: `
<p>Todas as escalas ate aqui tinham passos desiguais — e isso e o que cria hierarquia entre as notas. Uma escala <strong>simetrica</strong> divide os 12 semitons em partes iguais e, com isso, elimina a hierarquia.</p>
<div class="w" data-w="symmetric-divisions"></div>
<div class="math-box">
  <div class="math-line">12 ÷ 6 = 2 → escala de <strong>tons inteiros</strong> (6 notas)</div>
  <div class="math-line">12 ÷ 4 = 3 → acorde <strong>diminuto</strong>, base das escalas diminutas (8 notas)</div>
  <div class="math-line">12 ÷ 3 = 4 → acorde <strong>aumentado</strong>, base da escala aumentada (6 notas)</div>
  <div class="math-line">12 ÷ 2 = 6 → <strong>tritono</strong></div>
</div>

<h3>A consequencia: transposicao limitada</h3>
<div class="callout callout--key">
Se a escala se repete a cada N semitons, entao transpo-la por N semitons devolve <strong>exatamente as mesmas notas</strong>. Por isso ha poucas versoes distintas: <strong>2</strong> escalas de tons inteiros, <strong>3</strong> diminutas e <strong>4</strong> aumentadas. Messiaen chamou isso de "modos de transposicao limitada".
</div>

<h3>A consequencia estetica: sem tonica</h3>
<p>Todas as notas tem exatamente as mesmas relacoes com as vizinhas. Nenhuma e "especial", nenhuma e ponto de repouso. E o oposto exato da propriedade de Myhill do diatonico (modulo 3). Escalas simetricas soam suspensas, sem chao — util para sonho, suspense, transicao e ambiguidade.</p>
`,
        practice: [
          "Toque a escala de tons inteiros e tente terminar uma frase. Perceba a impossibilidade de conclusao."
        ]
      },
      {
        id: "m14l2",
        title: "Tons inteiros, diminutas e aumentada",
        html: `
<h3>Tons inteiros</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="tons-inteiros"></div>
<p>Vetor intervalar <strong>&lt;0,6,0,6,0,3&gt;</strong>: so tons, tercas maiores e tritonos. Nenhuma quarta ou quinta justa — e por isso que ela nao consegue formar acordes estaveis.</p>
<ul>
  <li>So existem <strong>2</strong>: a que contem Do e a que contem Do♯.</li>
  <li>Todas as triades formadas nela sao <strong>aumentadas</strong>.</li>
  <li><strong>Uso:</strong> sobre acordes <strong>7♯5</strong> (ou 7♭13 sem 9). Em Do: C7♯5 = Do Mi Sol♯ Si♭ — todas na escala.</li>
  <li>Debussy e Ravel a usaram como cor; no jazz aparece em Thelonious Monk.</li>
</ul>

<h3>Diminuta (tom-semitom)</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="diminuta-tom-semitom"></div>
<ul>
  <li>8 notas alternando 2-1. So existem <strong>3</strong> distintas.</li>
  <li>Contem <strong>dois</strong> acordes diminutos completos e quatro tritonos.</li>
  <li><strong>Uso:</strong> sobre acordes <strong>dim7</strong>.</li>
</ul>

<h3>Diminuta (semitom-tom)</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="diminuta-semitom-tom"></div>
<p>Mesma escala, rotacionada. Sobre uma fundamental de dominante, ela entrega:</p>
<div class="math-box">
  <div class="math-line">1  ♭9  ♯9  3  ♯11  5  13  ♭7</div>
  <div class="math-note">Todas as tensoes alteradas <strong>exceto</strong> ♭13, e mantendo a quinta justa.</div>
</div>
<p><strong>Uso:</strong> sobre <strong>7♭9</strong>. Compare com a escala alterada (modulo 15), que traz ♭13 mas perde a quinta e a 13. As duas sao complementares.</p>
<div class="w" data-w="dim-vs-alt"></div>

<h3>Aumentada</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="aumentada"></div>
<ul>
  <li>Alterna 3-1. So existem <strong>4</strong> distintas.</li>
  <li>Contem duas triades aumentadas e tres pares maior/menor.</li>
  <li><strong>Uso:</strong> jazz moderno, movimentos por tercas maiores (o "ciclo de Coltrane", que divide a oitava em 3 tonalidades).</li>
</ul>

<h3>Modulacao simetrica</h3>
<p>Como um acorde diminuto e igual em todas as inversoes, ele pode ser reinterpretado de 4 formas — e cada uma leva a uma tonalidade diferente. E o atalho de modulacao mais poderoso que existe.</p>
<div class="w" data-w="dim-modulation"></div>
`,
        practice: [
          "Toque C7♯5 e improvise com tons inteiros por cima.",
          "Toque C7♭9 e improvise com a diminuta semitom-tom.",
          "Use um acorde dim7 para modular de Do maior para Mi♭ maior."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 15
   * =================================================================== */
  {
    id: "m15",
    title: "Jazz: modos da menor melodica e bebop",
    level: "Avancado",
    tag: "Escalas",
    summary: "Os sete modos da menor melodica resolvem quase todos os problemas de improvisacao moderna. E as escalas bebop resolvem um problema ritmico.",
    goals: [
      "Derivar os 7 modos da menor melodica",
      "Dominar a escala alterada",
      "Entender a substituicao por tritono",
      "Saber por que as escalas bebop tem 8 notas"
    ],
    lessons: [
      {
        id: "m15l1",
        title: "Os sete modos da menor melodica",
        html: `
<p>A menor melodica (modulo 6) gera sete modos, e praticamente todos sao usados no jazz — ao contrario dos modos da maior, onde locrio quase nao aparece.</p>
<div class="w" data-w="melodic-modes"></div>

<h3>Os tres mais importantes</h3>

<h4>1. Lidio dominante (4o modo) — sobre 7♯11</h4>
<div class="w" data-w="scale" data-tonic="C" data-scale="lidio-dominante"></div>
<p>Formula 1 2 3 ♯11 5 6 ♭7. E chamada <strong>escala acustica</strong> por um motivo exato: e a escala que mais se aproxima dos harmonicos 8 a 14 da serie natural.</p>
<div class="w" data-w="acoustic-scale"></div>
<p>O ♯11 vem do 11o harmonico (551 cents) e o ♭7 do 7o (969 cents). E a escala que a fisica produz — por isso soa simultaneamente estranha e natural.</p>

<h4>2. Locrio natural 2 (6o modo) — sobre m7♭5</h4>
<div class="w" data-w="scale" data-tonic="C" data-scale="locrio-2"></div>
<p>Melhor que o locrio comum sobre um meio-diminuto: a 9a e natural em vez de ♭9, o que evita o choque de semitom com a fundamental.</p>

<h4>3. Alterada (7o modo) — sobre 7alt</h4>
<div class="w" data-w="scale" data-tonic="C" data-scale="alterada"></div>
<div class="math-box math-box--hero">
  <div class="math-line big">1  ♭9  ♯9  3  ♯11  ♭13  ♭7</div>
  <div class="math-note">A 3a e a ♭7 do dominante, mais <strong>todas as quatro</strong> tensoes alteradas.</div>
</div>
<div class="callout callout--key">
<strong>O atalho que economiza meses:</strong> a escala alterada de X = a menor melodica um <strong>semitom acima</strong> de X. C7alt → Do♯ menor melodica. G7alt → La♭ menor melodica. Voce nao precisa aprender sete escalas novas: precisa saber menor melodica em 12 tonalidades e conhecer as regras de deslocamento.
</div>
<div class="w" data-w="altered-shortcut"></div>
`,
        practice: [
          "Toque menor melodica nas 12 tonalidades, 2 oitavas.",
          "Toque G7alt e improvise com La♭ menor melodica.",
          "Toque Cm7♭5 e improvise com Mi♭ menor melodica (locrio natural 2)."
        ]
      },
      {
        id: "m15l2",
        title: "Substituicao por tritono e escalas bebop",
        html: `
<h3>Substituicao por tritono</h3>
<p>Dois acordes de dominante a um tritono de distancia <strong>compartilham o mesmo tritono interno</strong>, apenas invertido:</p>
<div class="w" data-w="tritone-sub"></div>
<div class="math-box">
  <div class="math-line">G7  = Sol  <strong>Si</strong>  Re  <strong>Fa</strong></div>
  <div class="math-line">D♭7 = Re♭  <strong>Fa</strong>  La♭ <strong>Do♭(=Si)</strong></div>
  <div class="math-note">O par Si/Fa e o mesmo. Como ele e quem define a resolucao, os dois acordes podem se substituir.</div>
</div>
<p>Consequencia pratica: <strong>Dm7 – G7 – Cmaj7</strong> vira <strong>Dm7 – D♭7 – Cmaj7</strong>, com baixo cromatico descendente Re–Re♭–Do. E outra: <strong>a escala alterada de G e a mesma escala lidio dominante de D♭</strong> — porque ambas sao a menor melodica de La♭.</p>
<div class="w" data-w="tritone-sub-demo"></div>

<h3>Escalas bebop: uma solucao ritmica</h3>
<p>As escalas bebop tem <strong>8 notas</strong>. A razao nao e harmonica, e metrica.</p>
<div class="callout callout--key">
Uma escala de 7 notas tocada em colcheias desalinha: em um compasso 4/4 cabem 8 colcheias, entao a cada compasso a escala "vira" e as notas do acorde caem em tempos fracos. Com <strong>8</strong> notas, as notas do acorde (1, 3, 5, ♭7) caem sempre nos <strong>tempos fortes</strong>. A nota cromatica extra e um ajuste de fase.
</div>
<div class="w" data-w="bebop-demo"></div>

<h3>As quatro escalas bebop</h3>
<div class="w" data-w="bebop-scales"></div>
<p>Regra de uso: a nota adicional e sempre <strong>de passagem</strong> — curta, em tempo fraco, entre duas notas do acorde. Se voce a acentuar ou prolongar, o efeito se perde e vira nota errada.</p>
`,
        practice: [
          "Toque a bebop dominante de Sol em colcheias, comecando no tempo 1. Confira: as notas do acorde caem nos tempos.",
          "Toque Dm7–D♭7–Cmaj7 e compare com Dm7–G7–Cmaj7."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 16
   * =================================================================== */
  {
    id: "m16",
    title: "Escalas do mundo e exoticas",
    level: "Avancado",
    tag: "Escalas",
    summary: "Escalas fora do eixo europeu: como funcionam, de onde vem e o que o piano consegue (e nao consegue) reproduzir.",
    goals: [
      "Conhecer as principais escalas nao-ocidentais utilizaveis no piano",
      "Entender a segunda aumentada como recurso, nao como problema",
      "Saber os limites do temperamento igual"
    ],
    lessons: [
      {
        id: "m16l1",
        title: "Oriente Medio e Europa oriental",
        html: `
<p>Estas escalas usam <strong>segundas aumentadas</strong> (3 semitons entre graus vizinhos) como caracteristica expressiva, e nao como efeito colateral a evitar.</p>

<h3>Frigio dominante — o maqam Hijaz</h3>
<div class="w" data-w="scale" data-tonic="E" data-scale="frigio-dominante"></div>
<p>5o modo da menor harmonica: 1 ♭2 3 4 5 ♭6 ♭7. A combinacao de ♭2 com 3a maior e o que produz o som imediatamente reconhecivel do flamenco e da musica arabe. No flamenco, e a base da <strong>cadencia andaluza</strong>: Am–G–F–E.</p>
<div class="w" data-w="andaluza"></div>

<h3>Dupla harmonica (bizantina / Hijaz Kar)</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="dupla-harmonica"></div>
<p>1 ♭2 3 4 5 ♭6 7 — <strong>duas</strong> segundas aumentadas, simetricas em torno da quinta. Essa simetria em espelho e a razao de ela soar tao "fechada" e ritualistica.</p>

<h3>Hungara menor</h3>
<div class="w" data-w="scale" data-tonic="A" data-scale="hungara-menor"></div>
<p>Menor harmonica com ♯4: tambem duas segundas aumentadas. Base da musica cigana da Europa central e de boa parte do metal sinfonico.</p>

<h3>Napolitanas e persa</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="napolitana-menor"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="persa"></div>

<div class="callout callout--warn">
<strong>Limite honesto do piano:</strong> os <em>maqamat</em> arabes e turcos autenticos usam intervalos de quarto de tom (como o maqam Rast e o Bayati), que <strong>nao existem</strong> no teclado. O que se toca no piano e uma aproximacao temperada. Vale conhecer a diferenca em vez de fingir que o piano cobre tudo: assim como no blues (modulo 11), o teclado e uma grade fixa sobre um continuo.
</div>
`,
        practice: [
          "Toque a cadencia andaluza Am–G–F–E e improvise com Mi frigio dominante.",
          "Compare Do dupla harmonica com Do maior. Identifique as duas notas alteradas."
        ]
      },
      {
        id: "m16l2",
        title: "Asia e escalas de cor",
        html: `
<h3>Pentatonicas japonesas</h3>
<p>Diferente das pentatonicas por quintas (modulo 10), estas <strong>contem semitons</strong> — e por isso soam completamente diferentes.</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="hirajoshi"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="in-sen"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="iwato"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="kumoi"></div>
<p>Repare nos saltos de 4 semitons: o espaco vazio e tao importante quanto as notas presentes. E uma estetica de economia, nao de preenchimento.</p>

<h3>Escalas de cor para composicao</h3>
<div class="w" data-w="scale" data-tonic="C" data-scale="enigmatica"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="prometeu"></div>
<div class="w" data-w="scale" data-tonic="C" data-scale="maior-harmonica"></div>

<h3>Como usar escalas exoticas sem soar caricato</h3>
<ol class="steps">
  <li><strong>Sustente um pedal.</strong> Escalas exoticas precisam de um centro fixo, senao viram sequencia aleatoria.</li>
  <li><strong>Use poucos acordes.</strong> Muitas delas nao harmonizam bem em tercas. Prefira quintas, quartas e drones.</li>
  <li><strong>Priorize a nota caracteristica.</strong> Em cada uma ha 1 ou 2 notas que definem a cor.</li>
  <li><strong>Ritmo importa mais que escala.</strong> O que identifica uma tradicao musical e o padrao ritmico, nao apenas o conjunto de notas.</li>
</ol>
<div class="callout callout--tip">
Use o Explorador de escalas para percorrer a categoria "exoticas" inteira, tocando cada uma sobre um pedal. Anote as tres que mais te agradam e trabalhe so nelas — conhecer 40 escalas superficialmente vale menos que dominar 3.
</div>
`,
        practice: [
          "Toque Hirajoshi sobre um pedal de Do e componha uma melodia de 8 compassos.",
          "Percorra a categoria exotica no Explorador e escolha 3 favoritas."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 17
   * =================================================================== */
  {
    id: "m17",
    title: "Tensoes, extensoes e reharmonizacao",
    level: "Avancado",
    tag: "Harmonia",
    summary: "9, 11, 13, alteracoes, dominantes secundarios, emprestimo modal e substituicoes. Como transformar uma harmonia simples em algo rico.",
    goals: [
      "Entender tensoes disponiveis e notas a evitar",
      "Montar voicings de 4 e 5 notas",
      "Usar dominantes secundarios e substituicoes",
      "Reharmonizar uma progressao simples"
    ],
    lessons: [
      {
        id: "m17l1",
        title: "Extensoes: 9, 11 e 13",
        html: `
<p>Continue empilhando tercas alem da setima. Como a escala tem 7 notas, depois da 7a voce volta ao inicio uma oitava acima: a 2a vira <strong>9</strong>, a 4a vira <strong>11</strong>, a 6a vira <strong>13</strong>.</p>
<div class="w" data-w="extensions"></div>
<div class="math-box">
  <div class="math-line">1 → 3 → 5 → 7 → 9 → 11 → 13</div>
  <div class="math-note">Sete tercas empilhadas usam as 7 notas da escala. A proxima terca voltaria a fundamental.</div>
</div>

<h3>Notas a evitar (avoid notes)</h3>
<div class="callout callout--key">
Uma extensao soa bem quando esta a <strong>um tom inteiro ou mais</strong> acima de uma nota do acorde. Se ficar a <strong>meio tom</strong> acima de uma nota estrutural (especialmente a terca), ela cria um choque que anula a identidade do acorde.
</div>
<div class="w" data-w="avoid-notes"></div>
<p>Exemplo classico: sobre <strong>Cmaj7</strong>, a 11a (Fa) fica meio tom acima da 3a (Mi). Resultado: o acorde perde o carater maior. Solucao — elevar para <strong>♯11</strong> (Fa♯), que fica a um tom da terca. Por isso maj7 pede ♯11, e nao 11 natural. E por isso o modo lidio (modulo 7) e o modo "correto" para acordes maj7.</p>

<h3>Tensoes disponiveis por tipo de acorde</h3>
<div class="w" data-w="tension-table"></div>

<h3>Voicings praticos</h3>
<p>Voce nao toca todas as 7 notas. Escolhe as essenciais e as coloridas:</p>
<ul>
  <li><strong>Essenciais:</strong> 3a e 7a — sao elas que definem a qualidade do acorde.</li>
  <li><strong>Dispensaveis:</strong> fundamental (o baixo faz) e 5a justa (nao acrescenta informacao).</li>
  <li><strong>Coloridas:</strong> as tensoes.</li>
</ul>
<div class="w" data-w="rootless-voicings"></div>
`,
        practice: [
          "Toque Cmaj7 e adicione Fa. Depois troque por Fa♯. Ouca a diferenca.",
          "Monte voicings sem fundamental para ii-V-I em Do e transporte para 4 tonalidades."
        ]
      },
      {
        id: "m17l2",
        title: "Reharmonizacao",
        html: `
<h3>1. Dominantes secundarios</h3>
<p>Qualquer acorde maior ou menor da tonalidade pode ganhar seu proprio dominante. Notacao: <strong>V7/x</strong>.</p>
<div class="w" data-w="secondary-dominants"></div>
<p>Em Do: A7 (V7/ii) → Dm7; D7 (V7/V) → G7; E7 (V7/vi) → Am7. Cada um introduz uma nota de fora que "aponta" para o alvo.</p>

<h3>2. ii-V relativos</h3>
<p>Todo dominante secundario pode ser precedido do seu ii. Em vez de <strong>C – A7 – Dm7</strong>, use <strong>C – Em7♭5 – A7 – Dm7</strong>. Isso duplica o movimento harmonico sem mudar o destino.</p>

<h3>3. Substituicao por tritono</h3>
<p>Ja vista no modulo 15. Troque qualquer V7 pelo dominante a um tritono. Resultado: baixo cromatico.</p>
<div class="w" data-w="reharm-tritone"></div>

<h3>4. Emprestimo modal</h3>
<p>Pegue acordes do modo paralelo. Os mais uteis em tonalidade maior:</p>
<div class="w" data-w="borrowed-chords"></div>

<h3>5. Substituicao diatonica</h3>
<p>Acordes que compartilham notas podem se substituir: I ↔ iii ↔ vi (funcao tonica), IV ↔ ii (subdominante), V ↔ vii° (dominante).</p>

<h3>6. Diminuto de passagem</h3>
<p>Um dim7 entre dois acordes a um tom de distancia cria movimento cromatico no baixo: <strong>C – C♯dim7 – Dm7</strong>.</p>

<h3>Exemplo completo</h3>
<p>Uma progressao simples, reharmonizada em quatro niveis:</p>
<div class="w" data-w="reharm-levels"></div>
<div class="callout callout--tip">
Reharmonize gradualmente. Uma substituicao por frase e mais eficaz que quatro por compasso — o ouvinte precisa reconhecer a musica original para perceber a reharmonizacao como enriquecimento e nao como outra musica.
</div>
`,
        practice: [
          "Reharmonize 'Parabens pra voce' usando dominantes secundarios.",
          "Pegue I–vi–ii–V em Do e aplique uma substituicao por tritono em cada dominante."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 18
   * =================================================================== */
  {
    id: "m18",
    title: "Tecnica, ritmo e rotina de estudo",
    level: "Avancado",
    tag: "Pratica",
    summary: "Como transformar tudo isso em habilidade real: postura, digitacao, ritmo, metronomo e um plano de 12 semanas.",
    goals: [
      "Ter postura e movimento corretos",
      "Estudar de forma eficiente, nao apenas longa",
      "Desenvolver independencia ritmica",
      "Seguir um plano concreto de 12 semanas"
    ],
    lessons: [
      {
        id: "m18l1",
        title: "Corpo, som e movimento",
        html: `
<h3>Postura</h3>
<ul>
  <li><strong>Altura do banco:</strong> antebracos paralelos ao chao ou levemente inclinados para baixo. Cotovelos na altura das teclas ou pouco acima.</li>
  <li><strong>Distancia:</strong> sentada na metade da frente do banco, pes apoiados no chao.</li>
  <li><strong>Maos:</strong> arco natural, como segurando uma bola pequena. Pulso alinhado com o antebraco — nem afundado, nem levantado.</li>
  <li><strong>Ombros:</strong> soltos. Se subiram, voce esta com tensao — pare e recomece.</li>
</ul>
<div class="callout callout--warn">
<strong>Dor nunca e normal.</strong> Cansaco muscular leve depois de estudo intenso e esperado. Dor em pulso, antebraco ou dedos e sinal de tecnica errada ou de tempo excessivo sem pausa. Pare imediatamente e reveja o movimento.
</div>

<h3>Som vem do peso, nao da forca</h3>
<p>A tecla e uma alavanca. O que determina o volume e a <strong>velocidade</strong> com que o martelo atinge a corda — nada mais. Depois que a tecla desce, apertar mais nao muda nada, so gera tensao.</p>
<div class="callout callout--key">
Isso tem uma consequencia direta: <strong>toda a expressividade do piano esta na velocidade de ataque e no controle do tempo</strong>. Nao ha vibrato nem bend. Sua dinamica vem do braco relaxado transferindo peso, e seu fraseado vem do controle rigoroso de duracao e silencio.
</div>

<h3>Os cinco toques essenciais</h3>
<ol class="steps">
  <li><strong>Legato</strong> — cada nota so solta quando a proxima soa. Sem sobreposicao, sem buraco.</li>
  <li><strong>Staccato</strong> — nota curta, solta rapido. Movimento do pulso, nao do braco.</li>
  <li><strong>Portato</strong> — meio termo, notas separadas mas com peso.</li>
  <li><strong>Peso de braco</strong> — para notas fortes e acordes. O braco cai, o dedo apenas sustenta.</li>
  <li><strong>Dedo ativo</strong> — para passagens rapidas. So os dedos se movem, a mao fica estavel.</li>
</ol>

<h3>Pedal</h3>
<p>O pedal direito (sustain) levanta os abafadores: as cordas continuam vibrando e, alem disso, todas as outras cordas ressoam por simpatia (serie harmonica outra vez).</p>
<p><strong>Pedal sincopado</strong> — a tecnica essencial: troque o pedal <em>logo depois</em> de tocar o novo acorde, nao junto. Isso liga as harmonias sem borrar.</p>
<div class="math-box">
  <div class="math-line">toca acorde → levanta pedal → abaixa pedal</div>
  <div class="math-note">Nessa ordem, com o intervalo mais curto possivel. Se voce ouve as duas harmonias juntas, atrasou.</div>
</div>
`,
        practice: [
          "Toque uma escala em legato perfeito, gravando. Escute se ha buracos ou sobreposicoes.",
          "Pratique pedal sincopado com C–F–G–C, 60 bpm."
        ]
      },
      {
        id: "m18l2",
        title: "Ritmo e metronomo",
        html: `
<p>Ritmo e a dimensao mais negligenciada por quem estuda sozinho — e a que mais rapidamente denuncia o nivel de um musico.</p>

<h3>Subdivisao</h3>
<p>Sinta sempre a subdivisao menor, mesmo tocando notas longas. Quem conta apenas tempos flutua; quem sente colcheias ou semicolcheias fica firme.</p>
<div class="w" data-w="rhythm-grid"></div>

<h3>Como usar o metronomo de verdade</h3>
<ol class="steps">
  <li><strong>Devagar de verdade.</strong> Comece num tempo em que voce nunca erra. Se errou, esta rapido demais.</li>
  <li><strong>Suba de 4 em 4 bpm.</strong> So depois de 3 repeticoes perfeitas seguidas.</li>
  <li><strong>Metronomo nos tempos 2 e 4.</strong> Quando dominar, coloque o clique so no contratempo. Isso desenvolve pulso interno.</li>
  <li><strong>Metronomo no tempo 1 apenas.</strong> Um clique por compasso. Nivel avancado.</li>
</ol>
<div class="callout callout--tip">
<strong>O teste honesto:</strong> se voce so consegue tocar uma passagem no tempo rapido, voce nao a domina — voce a memorizou motoramente. Dominio e conseguir tocar a 50% do andamento com o mesmo controle.
</div>

<h3>Independencia das maos</h3>
<ol class="steps">
  <li>Mao esquerda em padrao fixo, direita improvisando livre.</li>
  <li>Esquerda em seminimas, direita em colcheias. Depois inverta.</li>
  <li>Esquerda em 3 contra direita em 2 (polirritmia basica).</li>
  <li>Esquerda tocando o groove, direita entrando em contratempo.</li>
</ol>
<div class="w" data-w="polyrhythm"></div>

<h3>Swing</h3>
<p>No jazz e no blues, colcheias nao sao iguais. A proporcao varia entre 2:1 (triplet feel) e algo perto de 1,5:1 em andamentos rapidos.</p>
<div class="w" data-w="swing"></div>
`,
        practice: [
          "Toque uma escala com metronomo apenas nos tempos 2 e 4, por 5 minutos.",
          "Pratique 3 contra 2 ate ficar automatico."
        ]
      },
      {
        id: "m18l3",
        title: "Plano de 12 semanas",
        html: `
<p>Um plano concreto, assumindo 40 minutos por dia, 5 dias por semana. Ele cobre o material inteiro, na ordem certa.</p>
<div class="w" data-w="study-plan"></div>

<h3>Regras que fazem a diferenca</h3>
<div class="callout callout--key">
<strong>1. Frequencia vence duracao.</strong> 30 minutos por dia, 6 dias, batem 3 horas em um dia so. A consolidacao motora acontece no intervalo entre as sessoes, nao durante.<br><br>
<strong>2. Estudo lento e estudo real.</strong> A velocidade e consequencia da precisao, nunca o contrario.<br><br>
<strong>3. Estude o que voce erra.</strong> Repetir o que ja sai bem e agradavel e inutil. Isole os 2 compassos problematicos e trabalhe so neles.<br><br>
<strong>4. Grave-se toda semana.</strong> Voce nao ouve o que toca enquanto toca — sua atencao esta na execucao. A gravacao mostra o que realmente saiu.<br><br>
<strong>5. Toque musica de verdade todo dia.</strong> Tecnica sem repertorio desmotiva e nao se transfere para uso real.
</div>

<h3>Checklist de dominio</h3>
<p>Considere um topico dominado quando conseguir, <strong>sem consultar</strong>:</p>
<ul class="feature-list">
  <li>Explicar por que ele e assim, do inicio (nao apenas o que e)</li>
  <li>Tocar em pelo menos 4 tonalidades</li>
  <li>Reconhecer de ouvido</li>
  <li>Usar em improviso ou composicao</li>
  <li>Ensinar para outra pessoa</li>
</ul>
<p>O ultimo item e o mais rigoroso. Se voce nao consegue explicar por que a escala maior tem o padrao T T S T T T S, releia o modulo 3 — e o alicerce de tudo o mais.</p>

<h3>Depois dos 12 modulos</h3>
<ol class="steps">
  <li><strong>Repertorio dirigido.</strong> Escolha 3 musicas que usem conceitos diferentes e aprenda-as por completo, analisando a harmonia.</li>
  <li><strong>Transcricao.</strong> Tire uma melodia de ouvido por semana. E o exercicio mais completo que existe.</li>
  <li><strong>Composicao.</strong> Escreva 8 compassos por semana usando o conceito da semana.</li>
  <li><strong>Toque com gente.</strong> Nada substitui tocar junto de outra pessoa.</li>
</ol>
`,
        practice: [
          "Imprima ou copie o plano e marque cada semana concluida.",
          "Grave um video de 2 minutos na semana 1 e outro na semana 12. Compare."
        ]
      }
    ]
  }

  );
})(typeof window !== "undefined" ? window : globalThis);
