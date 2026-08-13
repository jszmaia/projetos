/*
 * curriculum-a.js — Modulos 0 a 9 (fundamentos ate tetrades).
 *
 * Cada licao e HTML. Marcadores <div data-w="..."> sao hidratados pelo app
 * com teclados, tabelas e calculos gerados pelo motor teorico.
 */
(function (global) {
  "use strict";

  global.PT = global.PT || {};
  global.PT.CURRICULUM = global.PT.CURRICULUM || [];

  global.PT.CURRICULUM.push(

  /* =================================================================== *
   * MODULO 0
   * =================================================================== */
  {
    id: "m0",
    title: "Como estudar com este material",
    level: "Iniciante",
    tag: "Orientacao",
    summary: "O mapa do caminho, o metodo de estudo e o que voce precisa saber antes de comecar.",
    goals: [
      "Entender a ordem dos modulos e por que ela e essa",
      "Montar uma rotina diaria de 30 a 45 minutos",
      "Saber usar as ferramentas do app"
    ],
    lessons: [
      {
        id: "m0l1",
        title: "O caminho completo",
        html: `
<p>Este material foi construido para ser lido <strong>em linha reta</strong>. Cada modulo so usa o que ja foi explicado antes. Nada aparece do nada: se uma escala e citada, ela ja foi derivada.</p>

<h3>A logica da sequencia</h3>
<p>A ordem nao e arbitraria. Ela segue a cadeia causal real da teoria musical:</p>
<div class="chain">
  <div class="chain-item"><span>1</span><strong>Fisica do som</strong><em>frequencia, oitava, serie harmonica</em></div>
  <div class="chain-item"><span>2</span><strong>Intervalos</strong><em>a distancia entre duas notas</em></div>
  <div class="chain-item"><span>3</span><strong>Escalas</strong><em>colecoes organizadas de intervalos</em></div>
  <div class="chain-item"><span>4</span><strong>Acordes</strong><em>notas da escala empilhadas em tercas</em></div>
  <div class="chain-item"><span>5</span><strong>Harmonia</strong><em>acordes em movimento, com funcao</em></div>
  <div class="chain-item"><span>6</span><strong>Estilo</strong><em>blues, rock, pop, jazz sao escolhas dentro disso</em></div>
</div>
<p>Repare que "escala de blues" ou "escala de rock" aparecem no fim, e nao no comeco. Isso e proposital: elas nao sao entidades independentes, sao <strong>recortes</strong> do mesmo sistema de 12 notas. Quando voce chegar la, ja vai ter as ferramentas para deduzi-las sozinha em vez de decorar.</p>

<h3>Os tres niveis</h3>
<table class="tbl">
<thead><tr><th>Nivel</th><th>Modulos</th><th>O que voce sai sabendo</th></tr></thead>
<tbody>
<tr><td><span class="pill pill--1">Iniciante</span></td><td>0 a 5</td><td>Teclado, intervalos, de onde vem a escala maior, armaduras, tocar em qualquer tonalidade</td></tr>
<tr><td><span class="pill pill--2">Intermediario</span></td><td>6 a 13</td><td>Menores, modos, campo harmonico, tetrades, pentatonicas, blues, rock, pop</td></tr>
<tr><td><span class="pill pill--3">Avancado</span></td><td>14 a 18</td><td>Escalas simetricas, jazz, escalas do mundo, tensoes, reharmonizacao, rotina de tecnica</td></tr>
</tbody>
</table>

<h3>Metodo: o ciclo de quatro passos</h3>
<p>Para cada conceito novo, faca sempre nesta ordem. Pular passos e o motivo mais comum de "eu sei a teoria mas nao consigo usar".</p>
<ol class="steps">
  <li><strong>Entender</strong> — leia a derivacao. Voce precisa conseguir explicar <em>por que</em> aquilo e assim, nao so <em>o que</em> e.</li>
  <li><strong>Ver</strong> — olhe o diagrama do teclado. Identifique o desenho fisico: quais teclas pretas entram, onde estao os semitons.</li>
  <li><strong>Tocar</strong> — toque devagar, com metronomo, dizendo o nome das notas em voz alta.</li>
  <li><strong>Transportar</strong> — repita em outra tonalidade. Se voce so sabe em Do, voce nao sabe.</li>
</ol>

<div class="callout callout--tip">
<strong>Regra de ouro do transporte:</strong> sempre estude um conceito novo em pelo menos tres tonalidades: uma facil (Do, Sol, Fa), uma com varias teclas pretas (Mi bemol, La bemol) e uma "esquisita" (Si, Fa sustenido). A terceira e a que revela se voce entendeu ou decorou.
</div>
`,
        practice: [
          "Escolha um horario fixo do dia. Consistencia vale mais que duracao.",
          "Marque cada licao como concluida so depois de conseguir tocar o conteudo em 3 tonalidades."
        ]
      },
      {
        id: "m0l2",
        title: "Rotina diaria e uso das ferramentas",
        html: `
<h3>Rotina de 40 minutos</h3>
<table class="tbl">
<thead><tr><th>Tempo</th><th>Bloco</th><th>O que fazer</th></tr></thead>
<tbody>
<tr><td>5 min</td><td>Aquecimento</td><td>Escala cromatica lenta, mao separada. Sem metronomo. Foco em som parelho.</td></tr>
<tr><td>10 min</td><td>Tecnica</td><td>Escala do dia (2 oitavas, maos juntas) + arpejo correspondente, com metronomo.</td></tr>
<tr><td>10 min</td><td>Teoria ativa</td><td>Licao do modulo atual. Toque tudo que ler. Nao apenas leia.</td></tr>
<tr><td>10 min</td><td>Aplicacao</td><td>Progressao de acordes ou improviso curto usando o conceito do dia.</td></tr>
<tr><td>5 min</td><td>Repertorio</td><td>Um trecho de musica que voce gosta. Isso mantem o estudo vivo.</td></tr>
</tbody>
</table>

<div class="callout">
<strong>Por que "teoria ativa":</strong> ler sobre a escala frigia e tocar a escala frigia acionam memorias diferentes. A teoria so vira musica quando passa pelos dedos e pelo ouvido no mesmo dia em que passa pelos olhos.
</div>

<h3>As ferramentas do app</h3>
<ul class="feature-list">
  <li><strong>Explorador de escalas</strong> — escolha tonica e escala. Voce recebe o diagrama no teclado, os graus, a formula em semitons, o vetor intervalar, o campo harmonico e as escalas parecidas. Use para conferir tudo que ler aqui.</li>
  <li><strong>Acordes</strong> — monte qualquer acorde, veja as inversoes no teclado e ouca.</li>
  <li><strong>Circulo de quintas</strong> — interativo, com armaduras e relativos menores.</li>
  <li><strong>Laboratorio</strong> — a matematica crua: frequencias, cents, comparacao entre afinacao justa e temperamento igual, serie harmonica.</li>
  <li><strong>Metronomo</strong> — no rodape, sempre disponivel.</li>
</ul>

<h3>Clique para ouvir</h3>
<p>Todos os diagramas de teclado deste material sao interativos: clique em qualquer tecla para ouvi-la. Experimente agora.</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="jonio" data-labels="all"></div>
<p class="fig-caption">Teclado de duas oitavas comecando em Do central (Do4 = MIDI 60). As teclas destacadas formam a escala de Do maior.</p>
`,
        practice: [
          "Clique em cada tecla preta e observe: elas aparecem sempre em grupos de 2 e de 3.",
          "Toque Do e depois o Do da oitava acima. Perceba que soam 'como a mesma nota'. O modulo 1 explica por que."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 1
   * =================================================================== */
  {
    id: "m1",
    title: "O teclado e a matematica do som",
    level: "Iniciante",
    tag: "Fundamentos",
    summary: "Frequencia, oitava, os 12 semitons, por que as teclas pretas estao agrupadas em 2 e 3, e a geometria real das teclas.",
    goals: [
      "Saber o que e frequencia e por que a oitava e 2:1",
      "Entender a formula do temperamento igual",
      "Se localizar no teclado sem contar do inicio",
      "Entender por que existem 12 notas e nao 10 ou 15"
    ],
    lessons: [
      {
        id: "m1l1",
        title: "Som, frequencia e a oitava",
        html: `
<p>Som e ar vibrando. A <strong>frequencia</strong> dessa vibracao, medida em hertz (Hz, ciclos por segundo), determina a altura que voce percebe: mais ciclos por segundo, som mais agudo.</p>

<h3>O fato fundador: a razao 2:1</h3>
<p>Se voce dobra a frequencia, o ouvido humano nao escuta "uma nota diferente". Escuta <em>a mesma nota, mais aguda</em>. Essa e a percepcao mais estavel da musica, presente em todas as culturas conhecidas.</p>
<div class="math-box">
  <div class="math-line">La4 = 440 Hz</div>
  <div class="math-line">La5 = 880 Hz = 440 × 2</div>
  <div class="math-line">La3 = 220 Hz = 440 ÷ 2</div>
  <div class="math-note">Todas sao "La". A relacao 2:1 define a <strong>oitava</strong>.</div>
</div>

<p>Por que isso acontece? Porque uma corda vibrando a 440 Hz tambem vibra, simultaneamente, a 880, 1320, 1760 Hz... (a serie harmonica, modulo 3). Quando voce toca La4 e La5 juntos, <em>todos</em> os harmonicos do La5 ja estao presentes no La4. Nao ha nenhuma frequencia nova brigando: por isso a fusao e total.</p>

<h3>A consequencia estrutural</h3>
<p>Se a oitava e a mesma nota, entao <strong>o sistema musical so precisa ser definido dentro de uma oitava</strong>. Tudo se repete depois. Isso e o que a matematica chama de aritmetica modulo 12: as notas sao um circulo, nao uma reta.</p>
<div class="callout">
<strong>Consequencia pratica:</strong> quando voce aprende um desenho de escala, acorde ou licks em uma oitava, ele vale para o teclado inteiro. Voce nao precisa reaprender nada nas outras regioes.
</div>

<h3>O teclado e o mapa dessa repeticao</h3>
<p>Um piano de 88 teclas cobre de La0 (27,5 Hz) a Do8 (4186 Hz) — pouco mais de 7 oitavas. O padrao visual de 12 teclas (7 brancas + 5 pretas) se repete identico 7 vezes.</p>
<div class="w" data-w="scale" data-tonic="C" data-scale="cromatica" data-labels="all" data-octaves="2" data-octnum="1"></div>
<p class="fig-caption">As 12 notas da oitava (escala cromatica), com numero de oitava. Depois de Si4 vem Do5 e o desenho recomeca.</p>

<h3>Notacao cientifica de altura</h3>
<p>Cada nota tem um numero de oitava. A oitava muda <strong>em Do</strong>, nao em La. Por isso Si3 e Do4 sao vizinhos.</p>
<ul>
  <li><strong>Do4</strong> = 261,63 Hz = "Do central" (middle C) = nota MIDI 60</li>
  <li><strong>La4</strong> = 440 Hz = nota MIDI 69 = a referencia de afinacao internacional</li>
</ul>
`,
        practice: [
          "Localize o Do central no seu piano: e o Do mais proximo do centro, geralmente perto da fechadura ou da marca da marca.",
          "Toque um Do e o Do seguinte, alternando. Depois toque Do e Re. Compare a sensacao de 'mesma nota' contra 'nota diferente'."
        ]
      },
      {
        id: "m1l2",
        title: "Os 12 semitons e o temperamento igual",
        html: `
<p>Dentro de uma oitava, o piano moderno tem <strong>12 degraus iguais</strong>. Cada degrau e um <strong>semitom</strong>: a menor distancia possivel no instrumento, sempre da tecla atual para a tecla imediatamente vizinha — <em>incluindo</em> a preta.</p>

<h3>A formula</h3>
<p>Se 12 passos iguais precisam multiplicar a frequencia por 2, cada passo multiplica por:</p>
<div class="math-box math-box--hero">
  <div class="math-line big">r = 2<sup>1/12</sup> ≈ 1,059463094</div>
  <div class="math-note">Confira: 1,059463<sup>12</sup> = 2 exatamente.</div>
</div>
<p>Isso e o <strong>temperamento igual</strong> (12-TET). Dai sai a formula geral, com a nota MIDI <em>n</em>:</p>
<div class="math-box">
  <div class="math-line">f(n) = 440 × 2<sup>(n − 69)/12</sup></div>
  <div class="math-note">n = 69 e o La4. Cada +1 em n e um semitom acima.</div>
</div>

<div class="w" data-w="freq-table"></div>

<h3>Por que dividir em partes iguais?</h3>
<p>Porque so assim <strong>toda tonalidade soa igual</strong>. Se os semitons tivessem tamanhos diferentes (como em sistemas antigos), Do maior e Fa sustenido maior teriam sonoridades distintas, e transpor uma musica a mudaria. Com o temperamento igual, transpor e apenas somar um numero constante a todas as notas.</p>
<p>O preco: <em>nenhum</em> intervalo, exceto a oitava, e acusticamente puro. Todos estao levemente desafinados. O modulo 3 mede exatamente quanto.</p>

<h3>Cents: a regua fina</h3>
<p>Para comparar afinacoes, divide-se o semitom em 100 partes chamadas <strong>cents</strong>. A oitava tem 1200 cents.</p>
<div class="math-box">
  <div class="math-line">cents = 1200 × log<sub>2</sub>(f₂ / f₁)</div>
  <div class="math-note">Ouvidos treinados percebem diferencas a partir de ~5 cents em notas sustentadas.</div>
</div>

<h3>Tom e semitom</h3>
<ul>
  <li><strong>Semitom (S)</strong> = 1 degrau = 100 cents. Ex.: Mi → Fa, Do → Do♯.</li>
  <li><strong>Tom (T)</strong> = 2 degraus = 200 cents. Ex.: Do → Re, Mi → Fa♯.</li>
</ul>
<div class="callout callout--warn">
<strong>A armadilha classica:</strong> <em>Mi → Fa</em> e <em>Si → Do</em> sao semitons, mesmo sendo duas teclas brancas seguidas, porque nao existe tecla preta entre elas. Todos os outros pares de brancas vizinhas formam um tom. Esse detalhe e a origem de toda a estrutura da escala maior.
</div>
<div class="w" data-w="semitone-map"></div>
`,
        practice: [
          "Toque a escala cromatica de Do a Do usando apenas o dedo 2, dizendo 'semitom' a cada tecla.",
          "Toque Do-Re-Mi-Fa e observe: T, T, S. Sinta que o ultimo passo e menor."
        ]
      },
      {
        id: "m1l3",
        title: "Por que 12 notas? A resposta matematica",
        html: `
<p>Doze e um numero estranho. Por que nao 10, que combinaria com nossos dedos, ou 8, que combinaria com a oitava? A resposta e uma das coisas mais bonitas da teoria musical, e vem de teoria dos numeros.</p>

<h3>O problema</h3>
<p>Depois da oitava (2:1), o intervalo que o ouvido mais aceita e a <strong>quinta justa</strong>, razao <strong>3:2</strong> (motivo no modulo 3). Um sistema musical util precisa conter oitavas <em>e</em> quintas.</p>
<p>Mas ha um obstaculo: <strong>nenhuma pilha de quintas cai exatamente numa oitava</strong>. Formalmente, nao existem inteiros positivos <em>a</em>, <em>b</em> com (3/2)<sup>a</sup> = 2<sup>b</sup>, porque isso exigiria 3<sup>a</sup> = 2<sup>a+b</sup>, e 3 e 2 sao primos distintos. O melhor que se pode fazer e chegar <em>perto</em>.</p>

<h3>A pergunta virada em matematica</h3>
<p>Queremos um numero <em>N</em> de divisoes da oitava tal que alguma quantidade inteira delas caia bem perto de uma quinta justa. Ou seja, queremos aproximar por fracao o numero:</p>
<div class="math-box">
  <div class="math-line">log<sub>2</sub>(3/2) = 0,5849625007…</div>
  <div class="math-note">"A quinta justa vale 0,58496 de uma oitava."</div>
</div>
<p>As melhores aproximacoes racionais de um irracional sao suas <strong>fracoes continuas convergentes</strong>. Para esse numero, elas sao:</p>
<div class="w" data-w="edo-table"></div>

<h3>Leitura do resultado</h3>
<ul>
  <li><strong>3/5</strong> → dividir a oitava em <strong>5</strong> partes ja da uma quinta aceitavel. Nao por acaso, escalas <strong>pentatonicas</strong> aparecem de forma independente na China, na Africa, na Escocia e no Brasil.</li>
  <li><strong>7/12</strong> → dividir em <strong>12</strong> partes da uma quinta com erro de apenas <strong>1,955 cents</strong>, praticamente inaudivel. E o melhor custo-beneficio: erro minusculo com poucas notas.</li>
  <li><strong>24/41</strong> e <strong>31/53</strong> → mais precisos, mas exigiriam 41 ou 53 teclas por oitava. Existem instrumentos assim, mas sao inviaveis na pratica.</li>
</ul>

<div class="callout callout--key">
<strong>Portanto:</strong> 12 nao e tradicao arbitraria nem misticismo. E o menor numero de divisoes iguais da oitava que reproduz a quinta justa com erro despreziveu — e, de quebra, entrega tambem tercas utilizaveis. As teclas do piano sao a solucao de um problema de aproximacao numerica.
</div>

<h3>O erro que sobra: o comma pitagorico</h3>
<p>Empilhando 12 quintas justas puras voce quase volta ao ponto de partida, 7 oitavas acima. Quase:</p>
<div class="math-box">
  <div class="math-line">(3/2)<sup>12</sup> = 129,746337890625</div>
  <div class="math-line">2<sup>7</sup> = 128</div>
  <div class="math-line">razao = 3<sup>12</sup>/2<sup>19</sup> = 531441/524288 = 1,013643265…</div>
  <div class="math-line accent">= 23,460 cents  → o <strong>comma pitagorico</strong></div>
</div>
<p>O temperamento igual resolve isso distribuindo o erro: cada quinta e achatada em 23,46 ÷ 12 = <strong>1,955 cents</strong>. Doze quintas achatadas fecham o circulo perfeitamente. E por isso que o <em>circulo</em> de quintas e um circulo fechado (modulo 4) — no mundo acustico puro, ele seria uma espiral infinita.</p>
`,
        practice: [
          "No Laboratorio, compare a quinta justa pura (3:2) com a quinta do piano. A diferenca de 1,955 cents e praticamente inaudivel.",
          "Depois compare a terca maior pura (5:4) com a do piano: 13,7 cents. Essa da para ouvir."
        ]
      },
      {
        id: "m1l4",
        title: "A geometria do teclado: por que 2 e 3 teclas pretas",
        html: `
<p>Se as 12 notas sao igualmente espacadas, por que o teclado nao e 12 teclas iguais? Porque um teclado assim seria impossivel de navegar: sem pontos de referencia, voce nunca saberia onde esta.</p>

<h3>A solucao: dois grupos assimetricos</h3>
<p>O layout separa as 12 notas em 7 brancas e 5 pretas, e agrupa as pretas em <strong>2 + 3</strong>. Essa assimetria e um sistema de coordenadas visual e tatil:</p>
<ul>
  <li><strong>Do</strong> = a branca imediatamente a esquerda do grupo de <strong>2</strong> pretas.</li>
  <li><strong>Fa</strong> = a branca imediatamente a esquerda do grupo de <strong>3</strong> pretas.</li>
  <li><strong>Mi</strong> = a branca imediatamente a direita do grupo de 2. <strong>Si</strong> = a direita do grupo de 3.</li>
  <li><strong>Re</strong> = no meio do grupo de 2. <strong>Sol</strong> e <strong>La</strong> = entre as 3.</li>
</ul>
<div class="w" data-w="landmarks"></div>
<p class="fig-caption">Os pontos de referencia. Voce nunca precisa contar desde o inicio do teclado.</p>

<div class="callout callout--tip">
<strong>Exercicio de olhos fechados:</strong> feche os olhos, pouse a mao em qualquer lugar e tateie ate achar o grupo de 2 pretas. A branca a esquerda e Do. Repita 10 vezes por dia durante uma semana. Depois disso voce nunca mais procura notas visualmente.
</div>

<h3>Por que 7 brancas?</h3>
<p>Porque as brancas formam exatamente a escala de <strong>Do maior</strong>, e a escala maior tem 7 notas (modulos 3 e 5). O teclado nao e neutro: ele e um instrumento otimizado para tocar musica diatonica, com Do maior como caso "sem acidentes". Isso e uma escolha historica, mas com fundamento acustico — como o modulo 3 mostra.</p>

<h3>A matematica das larguras</h3>
<p>As posicoes das teclas pretas nao sao aleatorias nem simplesmente "centradas na divisa". Elas seguem uma restricao de fabricacao real: dentro de cada grupo, <strong>as partes visiveis das teclas brancas tem todas a mesma largura</strong>, para que a mao encontre espacos uniformes.</p>
<div class="math-box">
  <div class="math-line">Grupo com <em>n</em> brancas (largura W) e <em>k</em> pretas (largura b):</div>
  <div class="math-line">haste = (n·W − k·b) / n</div>
  <div class="math-line">centro da preta <em>i</em> = haste + b/2 + i·(haste + b)</div>
</div>
<p>Com b ≈ 0,58·W (proporcao real: cerca de 13,7 mm contra 23,5 mm), isso produz:</p>
<div class="w" data-w="geometry-table"></div>
<p>Por isso, num piano de verdade, <strong>Do♯ e Fa♯ ficam levemente a esquerda</strong> da divisa entre as brancas, <strong>Sol♯ fica centrado</strong> e <strong>Re♯ e La♯ ficam a direita</strong>. Os diagramas deste app usam exatamente essas posicoes calculadas — nao uma aproximacao.</p>
<div class="w" data-w="geometry-demo"></div>
`,
        practice: [
          "Identifique todos os Fa do seu piano em menos de 10 segundos, usando o grupo de 3 pretas.",
          "Toque so as teclas brancas de Do a Do: voce acabou de tocar Do maior sem saber teoria nenhuma."
        ]
      },
      {
        id: "m1l5",
        title: "Nomes, sustenidos, bemois e enarmonia",
        html: `
<p>As 7 brancas usam as 7 primeiras letras. Em portugues usamos tambem as silabas de Guido d'Arezzo:</p>
<div class="w" data-w="note-names"></div>

<h3>As alteracoes</h3>
<ul>
  <li><strong>Sustenido (♯)</strong> — sobe 1 semitom. Do♯ e a tecla logo a direita de Do.</li>
  <li><strong>Bemol (♭)</strong> — desce 1 semitom. Re♭ e a tecla logo a esquerda de Re.</li>
  <li><strong>Bequadro (♮)</strong> — cancela uma alteracao anterior.</li>
  <li><strong>Dobrado sustenido (𝄪)</strong> e <strong>dobrado bemol (𝄫)</strong> — sobem ou descem 2 semitons. Parecem inuteis, mas sao necessarios: sem eles, algumas escalas nao poderiam ser escritas corretamente (voce ve isso no modulo 6).</li>
</ul>

<h3>Enarmonia: mesma tecla, nomes diferentes</h3>
<p>Do♯ e Re♭ sao a <strong>mesma tecla</strong> no piano. Sao <strong>enarmonicos</strong>. Entao por que dois nomes?</p>
<div class="callout callout--key">
<strong>Porque o nome carrega a funcao, nao apenas o som.</strong> Uma escala de 7 notas precisa usar <strong>cada letra exatamente uma vez</strong> — A, B, C, D, E, F, G — sem repetir nem pular. Isso mantem a leitura na partitura clara: cada linha e cada espaco do pentagrama e usado uma vez.
</div>
<p>Exemplo concreto. Compare as duas grafias possiveis da escala maior comecando na tecla preta entre Fa e Sol:</p>
<table class="tbl tbl--compare">
<thead><tr><th>Grafia</th><th>Notas</th><th>Letras usadas</th><th>Veredito</th></tr></thead>
<tbody>
<tr><td><strong>Fa♯ maior</strong></td><td>Fa♯ Sol♯ La♯ Si Do♯ Re♯ Mi♯</td><td>F G A B C D E — todas, uma vez</td><td class="ok">Correto</td></tr>
<tr><td><strong>Sol♭ maior</strong></td><td>Sol♭ La♭ Si♭ Do♭ Re♭ Mi♭ Fa</td><td>G A B C D E F — todas, uma vez</td><td class="ok">Tambem correto</td></tr>
<tr><td>Grafia mista</td><td>Fa♯ Sol♯ Si♭ Si Do♯ Re♯ Fa</td><td>F G B B C D F — repete B e F, falta A e E</td><td class="bad">Ilegivel</td></tr>
</tbody>
</table>
<p>Note que <strong>Mi♯</strong> (na escala de Fa♯) e a tecla branca Fa, e <strong>Do♭</strong> (na de Sol♭) e a tecla branca Si. Parece bizarro, mas e o que mantem a regra "uma letra por grau". O motor deste app aplica essa regra automaticamente em toda escala de 7 notas.</p>

<h3>Regra pratica de escolha</h3>
<ul>
  <li>Tonalidades com <strong>sustenidos</strong> na armadura usam sustenidos: Sol, Re, La, Mi, Si, Fa♯.</li>
  <li>Tonalidades com <strong>bemois</strong> usam bemois: Fa, Si♭, Mi♭, La♭, Re♭, Sol♭.</li>
  <li>Notas subindo tendem a ser escritas com ♯; descendo, com ♭.</li>
</ul>
<p>O modulo 4 mostra exatamente quantos acidentes cada tonalidade tem, e por que.</p>
`,
        practice: [
          "Escreva as 12 notas cromaticas subindo com sustenidos, depois descendo com bemois.",
          "Ache no teclado: Mi♯, Si♯, Fa♭, Do♭. Confirme que sao teclas brancas."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 2
   * =================================================================== */
  {
    id: "m2",
    title: "Intervalos",
    level: "Iniciante",
    tag: "Fundamentos",
    summary: "A unidade de medida da musica: numero, qualidade, inversao, consonancia e dissonancia.",
    goals: [
      "Nomear qualquer intervalo por numero e qualidade",
      "Contar intervalos em semitons sem hesitar",
      "Entender por que existem 'justos' e 'maiores/menores'",
      "Reconhecer intervalos de ouvido usando musicas de referencia"
    ],
    lessons: [
      {
        id: "m2l1",
        title: "Numero e qualidade",
        html: `
<p>Um <strong>intervalo</strong> e a distancia entre duas notas. Ele tem duas partes independentes, e confundi-las e o erro mais comum de quem estuda sozinho.</p>

<h3>1. O numero — conta letras</h3>
<p>Conte as letras <strong>incluindo as duas pontas</strong>. De Do a Mi: Do(1) Re(2) Mi(3) = <strong>terca</strong>. De Do a Sol: Do Re Mi Fa Sol = <strong>quinta</strong>.</p>
<div class="callout callout--warn">
Como se conta a nota inicial, os intervalos "somam errado": terca + terca = quinta, nao sexta. (3 + 3 − 1 = 5.) Em semitons a soma e normal — mais um motivo para pensar em semitons.
</div>

<h3>2. A qualidade — conta semitons</h3>
<p>Duas tercas podem ter tamanhos diferentes. Do→Mi tem 4 semitons (<strong>terca maior</strong>); Do→Mi♭ tem 3 (<strong>terca menor</strong>). O numero e o mesmo, a qualidade muda.</p>

<h3>Por que "justo" e nao "maior"?</h3>
<p>Uniissono, quarta, quinta e oitava sao chamados <strong>justos</strong> (J). Segunda, terca, sexta e setima sao <strong>maiores</strong> (M) ou <strong>menores</strong> (m). A razao e acustica: os intervalos justos correspondem as razoes mais simples da serie harmonica (2:1, 3:2, 4:3) e existem em uma unica versao estavel. Os outros tem duas versoes utilizaveis.</p>
<div class="w" data-w="interval-table"></div>

<h3>Alteracoes de qualidade</h3>
<p>Apertando ou alargando em um semitom:</p>
<div class="scale-line">
  <span>diminuto</span><span class="arrow">→</span><span>menor</span><span class="arrow">→</span><span><strong>MAIOR</strong></span><span class="arrow">→</span><span>aumentado</span>
</div>
<div class="scale-line">
  <span>diminuto</span><span class="arrow">→</span><span><strong>JUSTO</strong></span><span class="arrow">→</span><span>aumentado</span>
</div>
<p>Note que "justo" nao tem versao menor nem maior: ele pula direto de diminuto para aumentado.</p>

<h3>O tritono</h3>
<p>Seis semitons e o intervalo mais instavel do sistema: e exatamente metade da oitava (6 = 12/2). Chamado <strong>quarta aumentada</strong> (Fa→Si) ou <strong>quinta diminuta</strong> (Si→Fa) conforme a grafia. E o unico intervalo que e sua propria inversao. Foi apelidado de <em>diabolus in musica</em> na Idade Media — e e justamente o motor de toda a harmonia tonal (modulo 9).</p>
<div class="w" data-w="interval-explorer"></div>
`,
        practice: [
          "A partir de Do, toque e nomeie todos os intervalos ate a oitava, subindo.",
          "Repita a partir de Fa e de Si. Preste atencao: os semitons naturais mudam onde o intervalo cai."
        ]
      },
      {
        id: "m2l2",
        title: "Inversao e a regra do 9",
        html: `
<p><strong>Inverter</strong> um intervalo e subir a nota grave uma oitava (ou baixar a aguda). Do→Mi (terca maior) vira Mi→Do (sexta menor).</p>

<h3>Duas regras exatas</h3>
<div class="math-box">
  <div class="math-line">numero + numero invertido = <strong>9</strong></div>
  <div class="math-line">semitons + semitons invertidos = <strong>12</strong></div>
</div>
<p>Por que 9 e nao 8? Porque a nota comum e contada nas duas vezes: (3 + 6) = 9 = 8 + 1.</p>

<h3>A qualidade tambem se inverte</h3>
<table class="tbl">
<thead><tr><th>Original</th><th>Vira</th></tr></thead>
<tbody>
<tr><td>Maior</td><td>menor</td></tr>
<tr><td>menor</td><td>Maior</td></tr>
<tr><td>Justo</td><td>Justo</td></tr>
<tr><td>Aumentado</td><td>diminuto</td></tr>
<tr><td>diminuto</td><td>Aumentado</td></tr>
</tbody>
</table>
<div class="w" data-w="inversion-table"></div>

<div class="callout callout--key">
<strong>Por que isso importa de verdade:</strong> voce so precisa memorizar <em>metade</em> dos intervalos. Sabendo tercas maiores, voce sabe sextas menores de graca. E, mais adiante, essa mesma regra explica as inversoes de acordes (modulo 8) e o motivo de a quinta justa (3:2) e a quarta justa (4:3) serem parentes proximos: 3/2 × 4/3 = 2, ou seja, uma e a inversao da outra.
</div>

<h3>Intervalos compostos</h3>
<p>Acima da oitava, os intervalos continuam: a nona e uma segunda + oitava (14 semitons), a decima primeira e uma quarta + oitava (17), a decima terceira e uma sexta + oitava (21).</p>
<div class="math-box">
  <div class="math-line">numero composto = numero simples + 7</div>
  <div class="math-note">2→9, 4→11, 6→13. Esses nomes voltam nos acordes estendidos (modulo 17).</div>
</div>
`,
        practice: [
          "Toque Do-Mi, depois Mi-Do. Confirme: terca maior e sexta menor.",
          "Preencha de cabeca: 5J invertida = ?; 2m invertida = ?; 4A invertida = ?"
        ]
      },
      {
        id: "m2l3",
        title: "Consonancia, dissonancia e reconhecimento auditivo",
        html: `
<p>Consonancia nao e questao de gosto — tem base fisica. Quanto <strong>mais simples a razao</strong> entre as frequencias, mais harmonicos as duas notas compartilham e menos batimentos aspera o ouvido percebe.</p>
<div class="w" data-w="consonance-table"></div>

<h3>A hierarquia</h3>
<ol>
  <li><strong>Consonancias perfeitas</strong> — oitava (2:1), quinta (3:2), quarta (4:3). Estaveis, "vazias", sem cor emocional definida.</li>
  <li><strong>Consonancias imperfeitas</strong> — tercas (5:4, 6:5) e sextas (5:3, 8:5). Estaveis mas coloridas: sao elas que definem maior/menor.</li>
  <li><strong>Dissonancias</strong> — segundas, setimas, tritono. Instaveis: pedem resolucao. Sao o motor do movimento harmonico.</li>
</ol>
<div class="callout">
Musica nao e feita de consonancia. E feita da <strong>alternancia</strong> entre tensao e repouso. Uma peca so com consonancias e inerte; uma so com dissonancias e ruido. A arte esta na dosagem.
</div>

<h3>Reconhecer de ouvido: musicas de referencia</h3>
<p>Associe cada intervalo ao inicio de uma melodia que voce ja conhece. Este e o metodo mais eficiente para ouvido relativo.</p>
<div class="w" data-w="ear-table"></div>

<h3>Rotina de treino auditivo (5 min/dia)</h3>
<ol class="steps">
  <li>Toque a nota base e cante o intervalo <em>antes</em> de tocar a segunda nota.</li>
  <li>Toque a segunda nota e confira.</li>
  <li>Comece com apenas 3 intervalos (5J, 3M, 3m) ate acertar 9 de 10.</li>
  <li>Acrescente um intervalo novo por semana.</li>
</ol>
<div class="callout callout--tip">
Cantar e obrigatorio, mesmo desafinando. O ouvido interno se desenvolve pela producao, nao so pela escuta passiva. Quem so escuta demora tres vezes mais.
</div>
`,
        practice: [
          "Grave 20 intervalos aleatorios e tente identifica-los no dia seguinte.",
          "Toque uma quinta justa e uma quarta justa em sequencia. Perceba que soam 'parentes' — sao inversoes uma da outra."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 3
   * =================================================================== */
  {
    id: "m3",
    title: "A serie harmonica: de onde as escalas realmente vem",
    level: "Iniciante",
    tag: "Nucleo teorico",
    summary: "O modulo mais importante do material. Aqui a escala maior deixa de ser convencao e passa a ser consequencia.",
    goals: [
      "Entender o que a corda faz quando vibra",
      "Deduzir os intervalos consonantes a partir dos harmonicos",
      "Gerar a escala de 7 notas por quintas",
      "Entender por que o padrao T-T-S-T-T-T-S e o unico possivel"
    ],
    lessons: [
      {
        id: "m3l1",
        title: "A corda que toca varias notas ao mesmo tempo",
        html: `
<p>Quando voce toca Do2 no piano, a corda nao vibra apenas em uma frequencia. Ela vibra <strong>simultaneamente</strong> em toda a serie de multiplos inteiros da sua frequencia fundamental. Isso e fisica de ondas estacionarias, nao teoria musical: uma corda presa nas duas pontas so admite modos de vibracao cujo comprimento de onda cabe um numero inteiro de vezes nela.</p>
<div class="math-box">
  <div class="math-line">f, 2f, 3f, 4f, 5f, 6f, 7f, 8f, …</div>
  <div class="math-note">Esses sao os <strong>harmonicos</strong>. O 1o e a fundamental; os demais sao os <em>parciais</em>, que determinam o timbre.</div>
</div>
<p>Voce ouve isso como <em>uma</em> nota, com um timbre. Mas o conteudo esta la — e e ele que define quais combinacoes de notas soam bem.</p>

<h3>A tabela que gera toda a teoria</h3>
<p>Reduzindo cada harmonico a uma oitava (dividindo por 2 ate cair entre 1 e 2), aparecem intervalos reconheciveis:</p>
<div class="w" data-w="harmonic-series"></div>

<h3>Leitura, harmonico por harmonico</h3>
<ul class="feature-list">
  <li><strong>2:1</strong> — a oitava. Primeiro intervalo que surge, e por isso o mais fundido.</li>
  <li><strong>3:2</strong> — a <strong>quinta justa</strong>. Segundo intervalo novo. Base do ciclo de quintas e de toda a tonalidade.</li>
  <li><strong>4:3</strong> — a quarta justa (inversao da quinta).</li>
  <li><strong>5:4</strong> — a <strong>terca maior</strong>. Com ela nasce o acorde maior: harmonicos 4:5:6 = Do-Mi-Sol.</li>
  <li><strong>6:5</strong> — a terca menor, entre o 5o e o 6o harmonico.</li>
  <li><strong>7:4</strong> — a setima "harmonica", 31 cents mais grave que a setima menor do piano. E ela que o blues persegue e nunca alcanca exatamente no teclado.</li>
  <li><strong>11:8</strong> — 551 cents, entre a quarta e o tritono. E a origem acustica do <strong>#11 lidio</strong>.</li>
  <li><strong>13:8</strong> — 841 cents, perto da sexta menor. Origem do <strong>b13</strong>.</li>
</ul>

<div class="callout callout--key">
<strong>Conclusao:</strong> o acorde maior (1-3-5) nao foi inventado. Ele e <strong>literalmente</strong> os harmonicos 4, 5 e 6 de qualquer nota que voce toque. A musica ocidental construiu seu sistema imitando o que uma corda ja faz sozinha.
</div>
`,
        practice: [
          "No Laboratorio, ouca os harmonicos 1 a 8 em sequencia. Voce vai reconhecer um acorde maior surgindo do harmonico 4 ao 6.",
          "Segure (sem tocar) as teclas Do4-Mi4-Sol4 e toque Do2 forte e curto. Voce vai ouvir as cordas soltas ressoando: sao os harmonicos 4, 5 e 6."
        ]
      },
      {
        id: "m3l2",
        title: "Gerando a escala por quintas",
        html: `
<p>A quinta justa (3:2) e o primeiro intervalo <em>novo</em> depois da oitava. E natural, entao, construir um sistema empilhando quintas. Foi o que os pitagoricos fizeram.</p>

<h3>O experimento</h3>
<p>Comece em <strong>Fa</strong> e suba de quinta em quinta, trazendo tudo para dentro de uma oitava:</p>
<div class="w" data-w="fifth-generation"></div>

<h3>O resultado</h3>
<p>Depois de <strong>7 notas</strong>, algo notavel acontece: voce tem exatamente as 7 teclas brancas. Ordenando-as dentro da oitava a partir de Do:</p>
<div class="scale-line scale-line--big">
  <span>Do</span><span class="gap">T</span><span>Re</span><span class="gap">T</span><span>Mi</span><span class="gap gap--half">S</span><span>Fa</span><span class="gap">T</span><span>Sol</span><span class="gap">T</span><span>La</span><span class="gap">T</span><span>Si</span><span class="gap gap--half">S</span><span>Do</span>
</div>
<div class="math-box math-box--hero">
  <div class="math-line big">T T S T T T S = 2 2 1 2 2 2 1</div>
  <div class="math-note">soma = 12 ✔ — a <strong>escala maior</strong>, deduzida, nao decorada.</div>
</div>

<div class="callout callout--key">
<strong>Este e o ponto central de todo o material.</strong> A escala maior nao e uma escolha estetica. E o que sai quando voce toma 7 quintas justas consecutivas — o intervalo mais consonante depois da oitava — e as reordena dentro de uma oitava. Toda a musica ocidental e uma consequencia dessa operacao.
</div>

<h3>Por que parar em 7?</h3>
<ul>
  <li>Com <strong>5</strong> quintas (Fa Do Sol Re La) voce tem a <strong>pentatonica</strong>: sem semitons, sem tritono, tudo consoante (modulo 10).</li>
  <li>Com <strong>7</strong>, aparece o primeiro tritono (Fa–Si). Isso e uma perda de consonancia, mas um ganho enorme: o tritono cria <em>direcao</em>, e sem direcao nao ha cadencia, nao ha tonalidade, nao ha resolucao.</li>
  <li>Com <strong>8 ou mais</strong> voce comeca a repetir teclas pretas e o sistema perde a distribuicao regular — vira cromatismo.</li>
</ul>
<p>Sete e o ponto de equilibrio: consonancia suficiente para haver repouso, dissonancia suficiente para haver movimento.</p>

<h3>A mesma logica, em outra tonica</h3>
<p>Se voce comecar as 7 quintas em <strong>Do</strong> (Do Sol Re La Mi Si Fa♯), obtem a escala de <strong>Sol maior</strong>: as brancas com Fa♯ no lugar de Fa. Cada deslocamento de uma quinta troca exatamente uma nota. E dai que nasce o circulo de quintas (modulo 4).</p>
`,
        practice: [
          "Toque Fa-Do-Sol-Re-La-Mi-Si em quintas ascendentes, sem se preocupar com a oitava.",
          "Agora toque as mesmas 7 notas em ordem a partir de Do. Voce tocou Do maior."
        ]
      },
      {
        id: "m3l3",
        title: "Por que esse padrao e o melhor possivel",
        html: `
<p>Poderia existir outra forma de distribuir 7 notas em 12 semitons? Sim — matematicamente ha 66 conjuntos de 7 notas distintos. Mas o diatonico tem propriedades que nenhum outro tem, e sao essas propriedades que o tornam util.</p>

<h3>Propriedade 1 — maxima uniformidade</h3>
<p>12 ÷ 7 = 1,714. Nao da divisao exata, entao alguns passos precisam ser 2 e outros 1. Para ficar o mais parelho possivel, sao necessarios cinco passos de 2 e dois de 1 (5×2 + 2×1 = 12). O diatonico distribui esses dois semitons o mais <strong>longe possivel</strong> um do outro: entre eles ha sempre 2 e 3 tons. Nenhuma outra configuracao espalha melhor.</p>
<div class="w" data-w="max-even"></div>

<h3>Propriedade 2 — cada intervalo aparece um numero unico de vezes</h3>
<p>Contando quantas vezes cada distancia aparece entre pares de notas da escala (o <strong>vetor intervalar</strong>):</p>
<div class="w" data-w="vector-compare"></div>
<p>No diatonico, os seis numeros sao <strong>todos diferentes</strong>: &lt;2, 5, 4, 3, 6, 1&gt;. Isso e a <em>propriedade de Myhill</em>, ou "escala profunda".</p>
<div class="callout callout--key">
<strong>Por que isso importa para o ouvido:</strong> como cada intervalo tem uma quantidade unica, cada nota da escala ocupa uma posicao unica na rede de relacoes. Nenhuma nota e ambigua. O ouvido consegue identificar "onde esta" na escala — e e exatamente isso que permite existir uma <strong>tonica</strong>, um centro de gravidade.
</div>
<p>Compare com a escala de tons inteiros &lt;0,6,0,6,0,3&gt;: todas as notas sao intercambiaveis, nenhuma e especial, e por isso ela nao tem tonica (modulo 14). E o contraste perfeito.</p>

<h3>Propriedade 3 — o tritono unico</h3>
<p>O diatonico contem <strong>exatamente um</strong> tritono (na escala de Do: Fa–Si). Um so. Isso e decisivo:</p>
<ul>
  <li>Como so ha um, ele identifica a tonalidade sem ambiguidade — Fa e Si so coexistem em Do maior e suas relativas.</li>
  <li>Ele quer resolver: Si sobe meio tom para Do, Fa desce meio tom para Mi. Essa resolucao para dentro e para fora e a <strong>cadencia V7 → I</strong>, o gesto central da musica tonal (modulo 9).</li>
</ul>
<div class="w" data-w="tritone-resolution"></div>

<h3>Propriedade 4 — gerada por um so intervalo</h3>
<p>A escala inteira sai empilhando um unico intervalo (a quinta). Escalas assim se chamam <em>bem formadas</em>. Consequencia pratica: todas as 12 tonalidades maiores tem exatamente a mesma estrutura interna, e por isso transpor e trivial.</p>

<div class="callout">
<strong>Resumindo os quatro pontos:</strong> a escala maior e (1) a mais uniforme possivel com 7 notas, (2) a unica em que cada nota tem identidade propria, (3) tem um unico tritono que define a direcao harmonica e (4) e gerada por um so intervalo. Nenhuma outra colecao de 7 notas reune tudo isso. Ela nao venceu por tradicao: venceu por estrutura.
</div>
`,
        practice: [
          "Toque Fa e Si juntos. Depois resolva: Si→Do e Fa→Mi. Essa e a cadencia mais importante da musica ocidental.",
          "No Explorador, compare os vetores intervalares da maior, da pentatonica e da de tons inteiros."
        ]
      },
      {
        id: "m3l4",
        title: "O preco do temperamento igual",
        html: `
<p>O sistema foi deduzido a partir de razoes puras (3:2, 5:4). Mas o piano nao toca razoes puras: toca 2<sup>k/12</sup>. Vale a pena saber exatamente o que se perde.</p>
<div class="w" data-w="tuning-compare"></div>

<h3>Como ler a tabela</h3>
<ul>
  <li><strong>Quinta</strong> — erro de −1,96 cents. Inaudivel. Foi por isso que 12 divisoes venceram.</li>
  <li><strong>Terca maior</strong> — erro de +13,7 cents. <em>Audivel.</em> A terca maior do piano e sensivelmente mais alta que a pura. Coros a capella e quartetos de cordas corrigem isso instintivamente; o piano nao pode.</li>
  <li><strong>Terca menor</strong> — erro de −15,6 cents, na direcao oposta.</li>
  <li><strong>Setima menor</strong> — a setima do piano esta 31 cents acima do 7o harmonico. E por isso que um acorde de setima de dominante no piano soa mais tenso que num naipe de metais tocando puro.</li>
</ul>

<h3>Batimentos: o erro que da para contar</h3>
<p>Toque Do4 e Mi4 juntos. O 5o harmonico do Do (5 × 261,63 = 1308,15 Hz) e o 4o harmonico do Mi (4 × 329,63 = 1318,51 Hz) ficam a poucos hertz de distancia e interferem, produzindo uma pulsacao:</p>
<div class="math-box">
  <div class="math-line">batimento = |1318,51 − 1308,15| ≈ <strong>10,4 pulsacoes por segundo</strong></div>
  <div class="math-note">Se a terca fosse pura, esses dois harmonicos coincidiriam e nao haveria pulsacao alguma.</div>
</div>
<p>Segure uma terca maior no registro medio e escute o "tremido". Voce esta ouvindo o comma se manifestando fisicamente.</p>

<div class="callout callout--tip">
<strong>Aplicacao pratica imediata:</strong> tercas maiores soam mais asperas no grave, porque os batimentos ficam lentos e destacados. Por isso, na hora de escolher a posicao de um acorde, evite tercas fechadas abaixo do Do3 — abra o acorde ou use quintas e oitavas. Essa e uma regra de arranjo que sai direto da matematica.
</div>
`,
        practice: [
          "No Laboratorio, ouca a terca maior pura e a temperada em sequencia. Depois ouca as duas juntas.",
          "Toque uma terca maior em Do3 e a mesma em Do5. Compare a aspereza."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 4
   * =================================================================== */
  {
    id: "m4",
    title: "Circulo de quintas e armaduras",
    level: "Iniciante",
    tag: "Organizacao",
    summary: "O mapa de todas as tonalidades, por que os acidentes entram nessa ordem e como saber a armadura de qualquer tom em 2 segundos.",
    goals: [
      "Desenhar o circulo de quintas de memoria",
      "Deduzir a armadura de qualquer tonalidade",
      "Achar o relativo menor instantaneamente",
      "Entender a ordem F-C-G-D-A-E-B"
    ],
    lessons: [
      {
        id: "m4l1",
        title: "Construindo o circulo",
        html: `
<p>No modulo 3 vimos que deslocar a janela de 7 quintas em uma posicao troca exatamente <strong>uma</strong> nota. Repetindo isso 12 vezes, passamos por todas as tonalidades e voltamos ao inicio. Esse e o circulo de quintas.</p>
<div class="w" data-w="circle"></div>

<h3>Como ele funciona</h3>
<ul>
  <li><strong>Horario</strong> = subir uma quinta justa (+7 semitons) = <strong>+1 sustenido</strong> na armadura.</li>
  <li><strong>Anti-horario</strong> = subir uma quarta justa (+5 semitons) = <strong>+1 bemol</strong>.</li>
  <li>O circulo fecha porque 12 quintas temperadas = 7 oitavas exatas (o comma foi absorvido — modulo 1).</li>
</ul>

<h3>Por que a ordem dos sustenidos e F C G D A E B</h3>
<p>Isso costuma ser decorado, mas e dedutivel. Cada nova tonalidade a direita precisa elevar apenas o <strong>setimo grau</strong> (a sensivel) para manter o padrao T T S T T T S:</p>
<div class="w" data-w="sharp-order"></div>
<p>Repare que os sustenidos entram <strong>tambem em ordem de quintas</strong>: F→C→G→D→A→E→B. E o mesmo movimento, um nivel acima. E os bemois entram na ordem exatamente inversa — B E A D G C F — porque andar de quarta e o mesmo que andar de quinta para tras.</p>

<div class="callout callout--tip">
<strong>Mnemonicos:</strong><br>
Sustenidos: <em>Fa Do Sol Re La Mi Si</em><br>
Bemois: <em>Si Mi La Re Sol Do Fa</em> (a mesma lista de tras para frente)
</div>

<h3>Os dois truques de leitura de armadura</h3>
<ol class="steps">
  <li><strong>Sustenidos:</strong> o ultimo sustenido da armadura e a <strong>sensivel</strong>. Suba um semitom e voce tem a tonica. Armadura com Fa♯ Do♯ Sol♯ → ultimo e Sol♯ → tonica = La maior.</li>
  <li><strong>Bemois:</strong> o <strong>penultimo bemol</strong> ja e a tonica. Armadura com Si♭ Mi♭ La♭ → penultimo e Mi♭ → tonica = Mi♭ maior. (Excecao: com um bemol so, e Fa maior.)</li>
</ol>
<div class="w" data-w="key-table"></div>
`,
        practice: [
          "Desenhe o circulo de quintas de memoria, todos os dias, por uma semana.",
          "Sorteie uma tonalidade e diga a armadura em menos de 3 segundos."
        ]
      },
      {
        id: "m4l2",
        title: "Relativos, paralelos e enarmonicos",
        html: `
<h3>Relativo menor: mesma armadura</h3>
<p>Toda tonalidade maior compartilha suas 7 notas com uma menor. A tonica dessa menor esta no <strong>6o grau</strong> da maior — ou, o que da no mesmo, uma <strong>terca menor abaixo</strong>.</p>
<div class="math-box">
  <div class="math-line">relativo menor = tonica maior − 3 semitons</div>
  <div class="math-line">Do maior → La menor · Sol maior → Mi menor · Mi♭ maior → Do menor</div>
</div>
<p>As notas sao identicas; o que muda e qual delas o ouvido toma como centro. E a mesma colecao ouvida de outro ponto de partida — exatamente a ideia de modo (modulo 7).</p>
<div class="w" data-w="relative-demo"></div>

<h3>Paralelo (homonimo): mesma tonica, armadura diferente</h3>
<p>Do maior e Do menor tem a mesma tonica mas armaduras distintas (0 acidentes contra 3 bemois). A diferenca sao tres notas: <strong>3a, 6a e 7a</strong> abaixadas.</p>
<div class="w" data-w="parallel-demo"></div>
<div class="callout">
Essa relacao e a base do <strong>emprestimo modal</strong> (modulo 17): pegar acordes do paralelo menor para usar no maior. E o truque por tras de milhares de musicas pop e do som "IV menor" tao usado em baladas.
</div>

<h3>Enarmonicos: o encontro no fundo do circulo</h3>
<p>Na parte de baixo do circulo, as tonalidades se encontram por caminhos opostos e soam identicas no piano:</p>
<table class="tbl">
<thead><tr><th>Por sustenidos</th><th>Por bemois</th><th>Teclas</th></tr></thead>
<tbody>
<tr><td>Si maior (5♯)</td><td>Do♭ maior (7♭)</td><td>identicas</td></tr>
<tr><td>Fa♯ maior (6♯)</td><td>Sol♭ maior (6♭)</td><td>identicas</td></tr>
<tr><td>Do♯ maior (7♯)</td><td>Re♭ maior (5♭)</td><td>identicas</td></tr>
</tbody>
</table>
<p>Na pratica escolhe-se a grafia com menos acidentes: prefere-se Re♭ (5♭) a Do♯ (7♯). Instrumentistas de sopro costumam preferir bemois; cordas, sustenidos.</p>
`,
        practice: [
          "Toque La menor e Do maior em sequencia. Mesmas teclas, centros diferentes.",
          "Toque Do maior e Do menor. Identifique as tres notas que mudaram."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 5
   * =================================================================== */
  {
    id: "m5",
    title: "A escala maior na pratica",
    level: "Iniciante",
    tag: "Escalas",
    summary: "Graus, nomes funcionais, dedilhado nas 12 tonalidades e as primeiras aplicacoes.",
    goals: [
      "Tocar a escala maior nas 12 tonalidades",
      "Nomear e sentir a funcao de cada grau",
      "Dominar as regras de dedilhado",
      "Construir a escala em qualquer nota sem consultar nada"
    ],
    lessons: [
      {
        id: "m5l1",
        title: "Os sete graus e seus nomes",
        html: `
<p>Cada grau da escala maior tem um nome funcional que descreve seu papel. Nao sao rotulos decorativos: eles explicam o comportamento da nota.</p>
<div class="w" data-w="degree-table"></div>

<h3>Os tres graus que mais importam</h3>
<ul class="feature-list">
  <li><strong>1o — Tonica.</strong> O repouso. Toda a musica tonal e medida em relacao a ela.</li>
  <li><strong>5o — Dominante.</strong> A quinta justa: o intervalo mais forte depois da oitava. Cria expectativa de volta a tonica.</li>
  <li><strong>7o — Sensivel.</strong> Esta a apenas 1 semitom da tonica e "cai" nela quase por gravidade. E a nota que define a tonalidade com mais forca.</li>
</ul>
<div class="callout callout--key">
<strong>Teste que voce pode fazer agora:</strong> toque Do-Re-Mi-Fa-Sol-La-Si e pare. A sensacao de incompletude e fisica — o Si <em>exige</em> o Do. Isso e a sensivel operando. Agora toque a mesma coisa parando no La: a tensao e muito menor. Escalas sem sensivel (como a menor natural) tem uma gravidade muito mais fraca, e o modulo 6 mostra o que se fez para corrigir isso.
</div>

<h3>A escala em todas as tonalidades</h3>
<div class="w" data-w="all-majors"></div>
`,
        practice: [
          "Toque a escala parando em cada grau e cantando o nome funcional.",
          "Construa de cabeca a escala maior de Mi♭ usando T T S T T T S. Confira no Explorador."
        ]
      },
      {
        id: "m5l2",
        title: "Dedilhado: as regras que valem para tudo",
        html: `
<p>Existem 12 escalas maiores, mas nao 12 dedilhados a memorizar. Ha tres principios que resolvem quase tudo.</p>

<h3>Principio 1 — o polegar nunca vai em tecla preta</h3>
<p>Anatomia: o polegar e mais curto e entra por baixo. Numa tecla preta ele forca o pulso e trava a passagem. Essa restricao <em>determina</em> quase todos os dedilhados.</p>

<h3>Principio 2 — o grupo 3 + 4</h3>
<p>Sete notas com cinco dedos exigem uma passagem. A solucao padrao e dividir em um grupo de 3 dedos e um de 4:</p>
<div class="w" data-w="fingering"></div>

<h3>Principio 3 — dedos 3 e 4 nas pretas</h3>
<p>Em tonalidades com muitas teclas pretas, primeiro decida onde caem os dedos 3 e 4 (nas pretas), e o resto se encaixa. Si maior e Fa♯ maior sao, por isso, mais faceis do que parecem — a mao encontra uma forma natural.</p>
<div class="callout callout--tip">
<strong>Ordem inteligente de estudo:</strong> comece por <strong>Si maior</strong> e <strong>Fa♯ maior</strong>, nao por Do maior. Do maior e a mais dificil ergonomicamente: todas as teclas na mesma altura, sem relevo para a mao se orientar. As tonalidades com pretas guiam a mao naturalmente. Esse era o metodo de Chopin.
</div>

<h3>Movimento correto da passagem</h3>
<ol class="steps">
  <li>O polegar comeca a se mover <em>antes</em> de precisar tocar, deslizando por baixo da palma.</li>
  <li>O cotovelo acompanha lateralmente — nao gire o pulso.</li>
  <li>Nada de acento na nota do polegar. Se voce ouve um "bump" a cada 3 ou 4 notas, a passagem esta tardia.</li>
</ol>
`,
        practice: [
          "Estude Si maior mao direita, 2 oitavas, a 60 bpm, uma nota por tempo, por uma semana.",
          "Grave-se e escute: da para ouvir onde o polegar passa? Se sim, corrija."
        ]
      },
      {
        id: "m5l3",
        title: "Construir qualquer escala maior sozinha",
        html: `
<h3>O algoritmo</h3>
<ol class="steps">
  <li>Escreva as <strong>7 letras</strong> em ordem, a partir da tonica. Ex.: Mi♭ → E F G A B C D.</li>
  <li>Aplique <strong>T T S T T T S</strong> contando semitons no teclado.</li>
  <li>Ajuste cada letra com ♯ ou ♭ ate bater com o semitom correto.</li>
  <li>Confira: cada letra aparece <strong>uma unica vez</strong>, e a soma dos passos e 12.</li>
</ol>

<h3>Exemplo completo: Mi♭ maior</h3>
<div class="w" data-w="build-example"></div>

<h3>Metodo alternativo: pela armadura</h3>
<p>Se voce ja sabe a armadura pelo circulo de quintas, e mais rapido: escreva as 7 letras e aplique os acidentes da armadura. Mi♭ maior tem 3 bemois (Si♭, Mi♭, La♭) → E♭ F G A♭ B♭ C D. Pronto.</p>

<h3>Metodo do tetracorde</h3>
<p>A escala maior e feita de <strong>dois tetracordes identicos</strong> (T T S), separados por um tom:</p>
<div class="w" data-w="tetrachord"></div>
<p>Isso tem uma consequencia elegante: o tetracorde superior de uma escala e o tetracorde inferior da escala uma quinta acima. Do maior termina com Sol-La-Si-Do; Sol maior comeca com Sol-La-Si-Do. E outra forma de enxergar o circulo de quintas.</p>
`,
        practice: [
          "Construa no papel, sem instrumento: La maior, Re♭ maior, Si maior, Sol♭ maior.",
          "Confira cada uma no Explorador de escalas."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 6
   * =================================================================== */
  {
    id: "m6",
    title: "As escalas menores",
    level: "Intermediario",
    tag: "Escalas",
    summary: "Natural, harmonica e melodica: nao sao tres escalas soltas, sao tres etapas de um mesmo problema sendo resolvido.",
    goals: [
      "Entender por que existem tres menores",
      "Derivar cada uma da anterior",
      "Saber quando usar cada uma",
      "Dominar a segunda aumentada"
    ],
    lessons: [
      {
        id: "m6l1",
        title: "Menor natural: a maior vista de outro lugar",
        html: `
<p>A escala menor natural e a maior comecando no <strong>6o grau</strong>. Mesmas notas, centro diferente.</p>
<div class="w" data-w="scale" data-tonic="A" data-scale="eolio"></div>
<div class="math-box">
  <div class="math-line">Maior:  T T S T T T S = 2 2 1 2 2 2 1</div>
  <div class="math-line">Menor:  T S T T S T T = 2 1 2 2 1 2 2</div>
  <div class="math-note">A menor e uma <strong>rotacao</strong> da maior: comece no 6o passo e leia em circulo.</div>
</div>

<h3>A formula em graus</h3>
<div class="scale-line scale-line--big">
  <span>1</span><span>2</span><span class="alt">♭3</span><span>4</span><span>5</span><span class="alt">♭6</span><span class="alt">♭7</span>
</div>
<p>Comparada a maior, tres notas descem meio tom: <strong>3a, 6a e 7a</strong>. A <strong>terca menor</strong> e a responsavel pelo carater: 3 semitons em vez de 4.</p>
<div class="w" data-w="compare" data-tonic="C" data-a="jonio" data-b="eolio"></div>

<h3>O problema estrutural</h3>
<p>A menor natural nao tem <strong>sensivel</strong>. O 7o grau esta a um tom inteiro da tonica, nao a um semitom. Consequencias diretas:</p>
<ul>
  <li>A resolucao para a tonica e fraca — falta a "gravidade" do semitom.</li>
  <li>O acorde do 5o grau fica <strong>menor</strong> (Mi menor em La menor), e um acorde menor nao gera tensao dominante.</li>
  <li>Sem V7, nao ha cadencia forte. A tonalidade menor natural soa modal, flutuante, sem direcao definida.</li>
</ul>
<div class="callout">
Isso nao e defeito — e caracteristica. Rock e folk exploram justamente essa flutuacao (i–♭VII–♭VI e a progressao menor mais usada do rock). Mas a musica tonal classica precisava de resolucao forte, e por isso inventou a proxima escala.
</div>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="eolio" data-size="3"></div>
`,
        practice: [
          "Toque La menor natural e tente terminar uma frase de forma conclusiva. Perceba a dificuldade.",
          "Toque a progressao Am – G – F – Am. Esse e o som da menor natural."
        ]
      },
      {
        id: "m6l2",
        title: "Menor harmonica: consertando a cadencia",
        html: `
<p>A solucao e cirurgica: <strong>suba o 7o grau em um semitom</strong>. So isso. Uma unica nota alterada.</p>
<div class="w" data-w="scale" data-tonic="A" data-scale="menor-harmonica"></div>
<div class="math-box">
  <div class="math-line">Menor natural:  1 2 ♭3 4 5 ♭6 ♭7  → 2 1 2 2 1 2 2</div>
  <div class="math-line accent">Menor harmonica: 1 2 ♭3 4 5 ♭6 <strong>7</strong>  → 2 1 2 2 1 <strong>3</strong> 1</div>
</div>

<h3>O que isso resolve</h3>
<ul>
  <li>Nasce a <strong>sensivel</strong>: Sol♯ → La, meio tom. A gravidade volta.</li>
  <li>O acorde de 5o grau vira <strong>maior</strong>: Mi–Sol♯–Si. Com a setima, <strong>E7</strong>.</li>
  <li>Surge o tritono Sol♯–Re, que resolve em La–Do. A cadencia <strong>V7 → i</strong> funciona.</li>
  <li>O 7o grau vira um acorde <strong>diminuto</strong> (Sol♯dim), altamente instavel e util.</li>
</ul>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="menor-harmonica" data-size="4"></div>
<p>Compare com a harmonizacao da menor natural na licao anterior: o grau V mudou de <em>Em7</em> para <em>E7</em>. Essa unica troca e o que torna a tonalidade menor funcional.</p>

<h3>O preco: a segunda aumentada</h3>
<p>Entre ♭6 e 7 abre-se um intervalo de <strong>3 semitons escrito como segunda</strong> (Fa → Sol♯ em La menor). E uma <strong>segunda aumentada</strong>: mesmo som de uma terca menor, mas grafia diferente, porque as letras F e G sao vizinhas.</p>
<div class="callout callout--warn">
Escrever "Fa → La♭" seria errado, ainda que soe igual: a escala pularia a letra G e usaria A duas vezes. A grafia correta e <strong>Fa → Sol♯</strong>. Este e o caso pratico em que a regra "uma letra por grau" do modulo 1 se mostra indispensavel.
</div>
<p>Esse salto e melodicamente incomodo para o canto — e exatamente por isso que existe a terceira menor.</p>

<h3>Onde ela aparece</h3>
<p>Barroco e classico (Bach usa o tempo todo), tango, flamenco, metal neoclassico (Malmsteen, Bach com distorcao) e musica do Oriente Medio, onde a segunda aumentada e um recurso expressivo, nao um problema.</p>
`,
        practice: [
          "Toque La menor harmonica devagar e sinta o salto Fa→Sol♯.",
          "Toque a cadencia E7 – Am. Depois Em7 – Am. Compare a forca das duas."
        ]
      },
      {
        id: "m6l3",
        title: "Menor melodica: consertando a melodia",
        html: `
<p>A menor harmonica resolveu a harmonia e estragou a melodia. A solucao seguinte: se o problema e o buraco entre ♭6 e 7, <strong>suba tambem o 6o grau</strong>.</p>
<div class="w" data-w="scale" data-tonic="A" data-scale="menor-melodica"></div>
<div class="math-box">
  <div class="math-line">Menor harmonica: 1 2 ♭3 4 5 ♭6 7 → 2 1 2 2 <strong>1 3 1</strong></div>
  <div class="math-line accent">Menor melodica:  1 2 ♭3 4 5 <strong>6</strong> 7 → 2 1 2 2 <strong>2 2 1</strong></div>
  <div class="math-note">Sumiu o salto de 3. Todos os passos voltaram a ser 1 ou 2.</div>
</div>

<h3>A definicao mais util</h3>
<div class="callout callout--key">
A menor melodica e simplesmente <strong>uma escala maior com a terca menor</strong>. Compare: maior = 1 2 <strong>3</strong> 4 5 6 7; melodica = 1 2 <strong>♭3</strong> 4 5 6 7. Uma nota de diferenca. Pense assim e voce nunca mais esquece.
</div>
<div class="w" data-w="compare" data-tonic="C" data-a="jonio" data-b="menor-melodica"></div>

<h3>A versao classica e a versao do jazz</h3>
<ul>
  <li><strong>Uso classico:</strong> sobe melodica (com 6 e 7 naturais), <strong>desce natural</strong> (com ♭6 e ♭7). Motivo: subindo, a sensivel puxa para a tonica; descendo, ela nao tem funcao e a escala relaxa. E uma escala com duas formas conforme a direcao.</li>
  <li><strong>Uso no jazz:</strong> a mesma forma subindo e descendo. Por isso e chamada <em>menor melodica de jazz</em>. Dela saem sete modos essenciais, incluindo a escala alterada (modulo 15).</li>
</ul>
<div class="w" data-w="melodic-directions"></div>

<h3>Quadro comparativo das tres menores</h3>
<div class="w" data-w="minors-compare"></div>

<h3>Como escolher na pratica</h3>
<table class="tbl">
<thead><tr><th>Situacao</th><th>Escala</th><th>Por que</th></tr></thead>
<tbody>
<tr><td>Acorde i (Am, Am7)</td><td>Natural ou dorico</td><td>Sem sensivel, som estavel e modal</td></tr>
<tr><td>Acorde V7 (E7 em Am)</td><td>Harmonica (ou frigio dominante)</td><td>Contem Sol♯, a 3a do E7</td></tr>
<tr><td>Acorde imMaj7 (AmMaj7)</td><td>Melodica</td><td>Contem ♭3 e 7 juntos</td></tr>
<tr><td>Melodia subindo para a tonica</td><td>Melodica</td><td>Caminho suave, sem salto</td></tr>
<tr><td>Melodia descendo da tonica</td><td>Natural</td><td>Relaxa, sem tensao de sensivel</td></tr>
<tr><td>Rock, folk, pop menor</td><td>Natural</td><td>♭VII e ♭VI dao o som caracteristico</td></tr>
</tbody>
</table>
`,
        practice: [
          "Toque La menor melodica subindo e La menor natural descendo, seguido — a forma classica.",
          "Toque AmMaj7 (La-Do-Mi-Sol♯) e improvise com a melodica por cima."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 7
   * =================================================================== */
  {
    id: "m7",
    title: "Os modos gregos",
    level: "Intermediario",
    tag: "Escalas",
    summary: "Sete escalas pelo preco de uma. O que muda quando a mesma colecao de notas ganha outro centro.",
    goals: [
      "Derivar os 7 modos por rotacao",
      "Identificar a nota caracteristica de cada modo",
      "Entender a diferenca entre modo relativo e modo paralelo",
      "Usar modos sem perder o centro tonal"
    ],
    lessons: [
      {
        id: "m7l1",
        title: "O que e um modo",
        html: `
<p>Pegue as 7 notas de Do maior. Toque de Re a Re, so brancas. As notas sao as mesmas — mas o som e completamente diferente. Voce tocou o modo <strong>dorico</strong>.</p>
<div class="callout callout--key">
<strong>Um modo e uma escala e um centro.</strong> As mesmas 7 notas geram 7 modos diferentes conforme qual nota funciona como repouso. A colecao nao mudou; o <em>ponto de gravidade</em> mudou. E isso reorganiza todos os intervalos em relacao a tonica — que e o que o ouvido de fato escuta.
</div>
<div class="w" data-w="modes-rotation"></div>

<h3>Os sete modos, do mais brilhante ao mais escuro</h3>
<p>Ha uma ordem natural. Cada modo desta lista difere do anterior por <strong>uma unica nota</strong>, sempre descendo meio tom — e essa ordem e exatamente o circulo de quintas andando para tras:</p>
<div class="w" data-w="brightness"></div>

<h3>A nota caracteristica</h3>
<p>Cada modo tem uma nota que o distingue do modo maior ou menor "padrao". <strong>E ela que voce precisa enfatizar</strong> — se nao tocar essa nota, ninguem percebe que voce esta em um modo.</p>
<div class="w" data-w="modes-table"></div>

<div class="callout callout--tip">
<strong>Regra de ouro para soar modal:</strong> toque a nota caracteristica em tempo forte, prolongue-a, e volte para a tonica do modo. Se voce tocar Re dorico mas ficar resolvendo em Do, o ouvido escuta Do maior e o modo desaparece.
</div>
`,
        practice: [
          "Toque todas as brancas de Re a Re, de Mi a Mi, etc. Ouca a mudanca de cor.",
          "Para cada modo, toque a tonica no baixo com a esquerda e a escala com a direita."
        ]
      },
      {
        id: "m7l2",
        title: "Relativo x paralelo: as duas formas de pensar modos",
        html: `
<p>Ha duas maneiras de chegar em Re dorico. Ambas dao as mesmas notas, mas ensinam coisas diferentes — e voce precisa das duas.</p>

<h3>Pensamento relativo — "que escala maior?"</h3>
<p>"Re dorico = 2o modo de Do maior, entao toco as brancas."</p>
<ul>
  <li><span class="ok">Vantagem:</span> rapido, so precisa saber a escala maior.</li>
  <li><span class="bad">Problema:</span> voce pensa em Do enquanto deveria sentir Re. O ouvido acaba resolvendo no lugar errado, e o modo se dissolve.</li>
</ul>

<h3>Pensamento paralelo — "qual nota mudou?"</h3>
<p>"Re dorico = Re menor com a <strong>6a maior</strong>." Ou seja: Re menor natural, mas com Si natural em vez de Si♭.</p>
<ul>
  <li><span class="ok">Vantagem:</span> voce mantem Re como centro e sabe exatamente qual nota da a cor.</li>
  <li><span class="ok">Vantagem:</span> transporta direto para qualquer tonica.</li>
</ul>
<div class="w" data-w="parallel-modes"></div>

<div class="callout callout--key">
<strong>Use o relativo para achar as notas rapido, e o paralelo para tocar com intencao.</strong> Musicos que so pensam relativo tocam as notas certas com o som errado.
</div>

<h3>Como fazer um modo soar como modo</h3>
<ol class="steps">
  <li><strong>Fixe o baixo.</strong> Um pedal na tonica do modo elimina qualquer ambiguidade.</li>
  <li><strong>Evite a cadencia V–I da tonalidade original.</strong> Em Re dorico, se voce tocar Sol7 → Do, acabou o modo.</li>
  <li><strong>Use os acordes caracteristicos.</strong> Dorico: i–IV (Dm–G). Mixolidio: I–♭VII (G–F). Lidio: I–II (C–D).</li>
  <li><strong>Enfatize a nota caracteristica.</strong> Em tempo forte, longa.</li>
</ol>
<div class="w" data-w="modal-vamps"></div>
`,
        practice: [
          "Toque um pedal de Re no baixo e improvise com brancas. Volte sempre a Re.",
          "Faca o mesmo com Sol (mixolidio) e Fa (lidio)."
        ]
      },
      {
        id: "m7l3",
        title: "Cada modo em detalhe",
        html: `
<div class="w" data-w="mode-detail" data-mode="jonio"></div>
<div class="w" data-w="mode-detail" data-mode="dorico"></div>
<div class="w" data-w="mode-detail" data-mode="frigio"></div>
<div class="w" data-w="mode-detail" data-mode="lidio"></div>
<div class="w" data-w="mode-detail" data-mode="mixolidio"></div>
<div class="w" data-w="mode-detail" data-mode="eolio"></div>
<div class="w" data-w="mode-detail" data-mode="locrio"></div>
`,
        practice: [
          "Escolha um modo por semana. Toque, harmonize e improvise so nele.",
          "Grave um vamp de 2 acordes e improvise por cima por 5 minutos seguidos."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 8
   * =================================================================== */
  {
    id: "m8",
    title: "Triades e campo harmonico",
    level: "Intermediario",
    tag: "Harmonia",
    summary: "Empilhar tercas: como a escala vira acordes, e por que os acordes de cada grau tem a qualidade que tem.",
    goals: [
      "Construir as 4 triades a partir de intervalos",
      "Derivar o campo harmonico maior e menor",
      "Entender funcao tonal",
      "Usar inversoes e conducao de vozes"
    ],
    lessons: [
      {
        id: "m8l1",
        title: "As quatro triades",
        html: `
<p>Um <strong>acorde</strong> e um conjunto de notas soando junto. A forma padrao de constru-lo na musica ocidental e <strong>empilhando tercas</strong>. Por que tercas? Porque, como vimos no modulo 3, os harmonicos 4:5:6 formam exatamente terca maior + terca menor. Empilhar tercas e imitar a serie harmonica.</p>

<h3>As quatro combinacoes possiveis</h3>
<p>Com duas tercas empilhadas (maior = 4 semitons, menor = 3), so ha quatro arranjos:</p>
<div class="w" data-w="triads"></div>

<h3>A logica</h3>
<table class="tbl">
<thead><tr><th>Triade</th><th>Tercas</th><th>Semitons</th><th>5a resultante</th><th>Carater</th></tr></thead>
<tbody>
<tr><td><strong>Maior</strong></td><td>M + m</td><td>4 + 3 = 7</td><td>justa</td><td>Estavel, brilhante</td></tr>
<tr><td><strong>Menor</strong></td><td>m + M</td><td>3 + 4 = 7</td><td>justa</td><td>Estavel, escuro</td></tr>
<tr><td><strong>Diminuta</strong></td><td>m + m</td><td>3 + 3 = 6</td><td>diminuta</td><td>Instavel (tritono)</td></tr>
<tr><td><strong>Aumentada</strong></td><td>M + M</td><td>4 + 4 = 8</td><td>aumentada</td><td>Instavel, simetrica</td></tr>
</tbody>
</table>
<div class="callout callout--key">
Maior e menor sao estaveis porque contem a <strong>quinta justa</strong> (3:2), o intervalo mais consonante depois da oitava. Diminuta e aumentada nao contem quinta justa — e por isso nao servem como ponto de repouso. Toda a estabilidade harmonica se resume a presenca ou ausencia da razao 3:2.
</div>

<h3>A simetria das instaveis</h3>
<p>A triade diminuta divide 12 em partes de 3+3 e a aumentada em 4+4. Como sao simetricas, suas inversoes soam iguais a elas mesmas — nao ha uma fundamental obvia. Isso as torna ambiguas e uteis para modular para qualquer lugar (modulo 14).</p>
`,
        practice: [
          "Toque as 4 triades sobre Do. Depois sobre Fa e sobre Si.",
          "De ouvido: peca a alguem para tocar uma das quatro e tente identificar."
        ]
      },
      {
        id: "m8l2",
        title: "O campo harmonico maior",
        html: `
<p>Construa uma triade sobre <strong>cada grau</strong> da escala, usando apenas notas da propria escala. As qualidades saem automaticamente — voce nao escolhe, a escala decide.</p>
<div class="w" data-w="harmonize" data-tonic="C" data-scale="jonio" data-size="3"></div>

<h3>O padrao universal</h3>
<div class="math-box math-box--hero">
  <div class="math-line big">I  ii  iii  IV  V  vi  vii°</div>
  <div class="math-line">M   m   m    M   M   m   dim</div>
  <div class="math-note">Vale para <strong>todas</strong> as 12 tonalidades maiores, sem excecao.</div>
</div>
<p>Convencao: maiusculas = maior, minusculas = menor, ° = diminuto.</p>

<h3>Por que exatamente essas qualidades?</h3>
<p>Nao e arbitrario. Depende de onde caem os dois semitons da escala (Mi–Fa e Si–Do em Do maior). Verifique voce mesma:</p>
<div class="w" data-w="why-qualities"></div>
<p>Os graus I, IV e V sao maiores porque suas tercas (Do–Mi, Fa–La, Sol–Si) atravessam <em>dois</em> tons inteiros. Os graus ii, iii e vi sao menores porque suas tercas contem um dos semitons naturais. E o vii° e diminuto porque contem <em>ambos</em>.</p>

<h3>Funcao tonal: os tres papeis</h3>
<p>Os sete acordes se agrupam em tres funcoes, definidas por quanta tensao carregam:</p>
<div class="w" data-w="functions"></div>
<ul class="feature-list">
  <li><strong>Tonica (I, vi, iii)</strong> — repouso. Contem o 1o grau da escala.</li>
  <li><strong>Subdominante (IV, ii)</strong> — afastamento. Contem o 4o grau, que se afasta da tonica.</li>
  <li><strong>Dominante (V, vii°)</strong> — tensao maxima. Contem o 7o grau (sensivel) e o tritono.</li>
</ul>
<div class="callout callout--key">
<strong>O ciclo fundamental da musica tonal:</strong> Tonica → Subdominante → Dominante → Tonica. Repouso, afastamento, tensao, retorno. Praticamente toda musica tonal e uma variacao ou expansao desse gesto. Progressoes famosas: I–IV–V–I, I–vi–IV–V, ii–V–I.
</div>

<h3>O campo harmonico menor</h3>
<p>Na menor natural, a mesma operacao produz outro padrao — e como as notas sao as mesmas da relativa maior, os acordes tambem sao, apenas renumerados:</p>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="eolio" data-size="3"></div>
<div class="math-box">
  <div class="math-line">i  ii°  ♭III  iv  v  ♭VI  ♭VII</div>
  <div class="math-note">Note o <strong>v menor</strong>: cadencia fraca. Por isso a pratica usa a menor harmonica para o grau V (modulo 6).</div>
</div>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="menor-harmonica" data-size="3"></div>
`,
        practice: [
          "Toque o campo harmonico de Do maior inteiro, subindo e descendo.",
          "Faca o mesmo em Sol, Fa e Re maior.",
          "Toque I–IV–V–I em 4 tonalidades diferentes."
        ]
      },
      {
        id: "m8l3",
        title: "Inversoes e conducao de vozes",
        html: `
<p>Uma triade tem 3 notas, logo 3 posicoes possiveis conforme qual esta no baixo.</p>
<div class="w" data-w="inversions"></div>
<table class="tbl">
<thead><tr><th>Posicao</th><th>Baixo</th><th>Cifra</th><th>Estrutura</th></tr></thead>
<tbody>
<tr><td>Fundamental</td><td>fundamental</td><td>C</td><td>tercas empilhadas: 3 + 3</td></tr>
<tr><td>1a inversao</td><td>terca</td><td>C/E</td><td>3 + 4 (quarta no topo)</td></tr>
<tr><td>2a inversao</td><td>quinta</td><td>C/G</td><td>4 + 3</td></tr>
</tbody>
</table>

<h3>Para que servem</h3>
<ol class="steps">
  <li><strong>Baixo com melodia propria.</strong> C – F – G – C tem baixo aos saltos. C – F/C – G/B – C tem baixo quase parado e depois por grau.</li>
  <li><strong>Economia de movimento.</strong> A mao pula menos, o som fica mais ligado.</li>
  <li><strong>Continuidade sonora.</strong> Notas comuns permanecem no lugar, o que faz a harmonia "escorregar" em vez de saltar.</li>
</ol>

<h3>As tres regras de conducao de vozes</h3>
<div class="callout callout--key">
<strong>1. Mova o minimo possivel.</strong> Notas comuns entre dois acordes ficam paradas; as outras vao para a vizinha mais proxima.<br>
<strong>2. Resolva as tendencias.</strong> A sensivel sobe meio tom. A setima do acorde de dominante desce meio tom.<br>
<strong>3. Evite quintas e oitavas paralelas.</strong> Duas vozes andando em quintas paralelas fundem-se e o ouvido perde a independencia delas.
</div>
<div class="w" data-w="voice-leading"></div>

<h3>Exercicio central: I–IV–V–I com movimento minimo</h3>
<p>Em Do, mantendo a mao direita quase parada:</p>
<div class="w" data-w="smooth-progression"></div>
<p>Repare que nenhuma voz se move mais que um tom. Esse e o principio que rege desde os corais de Bach ate arranjos de pop moderno.</p>
`,
        practice: [
          "Toque C–F–G–C nas tres posicoes de mao direita possiveis, escolhendo sempre o caminho mais curto.",
          "Faca o mesmo em Fa e em Re maior."
        ]
      }
    ]
  },

  /* =================================================================== *
   * MODULO 9
   * =================================================================== */
  {
    id: "m9",
    title: "Tetrades: acordes de setima",
    level: "Intermediario",
    tag: "Harmonia",
    summary: "Adicionar a quarta nota transforma tudo. Aqui nasce a harmonia funcional de verdade, e o ii-V-I.",
    goals: [
      "Construir os 7 tipos de tetrade",
      "Derivar o campo harmonico com setimas",
      "Entender o tritono como motor da resolucao",
      "Dominar o ii-V-I"
    ],
    lessons: [
      {
        id: "m9l1",
        title: "Os sete tipos de tetrade",
        html: `
<p>Empilhe mais uma terca sobre a triade. A nota resultante esta a uma <strong>setima</strong> da fundamental, e muda tudo: o acorde deixa de ser um bloco estatico e passa a ter direcao.</p>
<div class="w" data-w="sevenths"></div>

<h3>Como cada um se forma</h3>
<table class="tbl">
<thead><tr><th>Cifra</th><th>Formula</th><th>Semitons</th><th>Triade + 7a</th><th>Carater</th></tr></thead>
<tbody>
<tr><td><strong>maj7</strong></td><td>1 3 5 7</td><td>0-4-7-11</td><td>maior + 7a maior</td><td>Doce, repouso colorido</td></tr>
<tr><td><strong>7</strong></td><td>1 3 5 ♭7</td><td>0-4-7-10</td><td>maior + 7a menor</td><td>Tenso, quer resolver</td></tr>
<tr><td><strong>m7</strong></td><td>1 ♭3 5 ♭7</td><td>0-3-7-10</td><td>menor + 7a menor</td><td>Suave, neutro</td></tr>
<tr><td><strong>mMaj7</strong></td><td>1 ♭3 5 7</td><td>0-3-7-11</td><td>menor + 7a maior</td><td>Misterioso, cinematografico</td></tr>
<tr><td><strong>m7♭5</strong></td><td>1 ♭3 ♭5 ♭7</td><td>0-3-6-10</td><td>diminuta + 7a menor</td><td>Meio-diminuto, instavel</td></tr>
<tr><td><strong>dim7</strong></td><td>1 ♭3 ♭5 ♭♭7</td><td>0-3-6-9</td><td>diminuta + 7a diminuta</td><td>Simetrico, maxima tensao</td></tr>
<tr><td><strong>7♯5</strong></td><td>1 3 ♯5 ♭7</td><td>0-4-8-10</td><td>aumentada + 7a menor</td><td>Dominante alterado</td></tr>
</tbody>
</table>

<div class="callout">
<strong>dim7 e perfeitamente simetrico:</strong> 3+3+3+3 = 12. Suas quatro inversoes soam identicas, o que significa que um mesmo acorde diminuto pode resolver em <strong>quatro</strong> tonalidades diferentes. Isso o torna a ferramenta de modulacao mais versatil que existe (modulo 17).
</div>
`,
        practice: [
          "Toque os 7 tipos sobre Do, ouvindo a diferenca que a setima faz.",
          "Compare Cmaj7 e C7 alternando. A ♭7 muda completamente a funcao."
        ]
      },
      {
        id: "m9l2",
        title: "Campo harmonico com setimas e o tritono",
        html: `
<div class="w" data-w="harmonize" data-tonic="C" data-scale="jonio" data-size="4"></div>
<div class="math-box math-box--hero">
  <div class="math-line big">Imaj7  ii7  iii7  IVmaj7  V7  vi7  viiø7</div>
  <div class="math-note">Repare: <strong>so o V grau</strong> produz um acorde de dominante (7).</div>
</div>

<h3>Este e o fato central da harmonia tonal</h3>
<p>Em toda a escala maior, existe <strong>um unico</strong> acorde de setima de dominante: o do 5o grau. E ha uma razao exata para isso — ele e o unico que contem o <strong>unico tritono</strong> da escala.</p>
<div class="w" data-w="tritone-engine"></div>

<h3>Como o tritono resolve</h3>
<p>Em Do maior, o tritono e Si–Fa (dentro de G7). As duas notas tem tendencia oposta e simultanea:</p>
<div class="math-box">
  <div class="math-line">Si (sensivel, 3a do G7)  →  Do   <span class="muted">sobe meio tom, fecha para dentro</span></div>
  <div class="math-line">Fa (7a do G7)            →  Mi   <span class="muted">desce meio tom, abre para fora</span></div>
  <div class="math-note">O tritono (6 semitons) se resolve em terca maior (4) ou em sexta menor (8).</div>
</div>
<p>O movimento contrario por semitom e a resolucao mais forte que existe no sistema. Isso e a <strong>cadencia autentica V7 → I</strong>.</p>
<div class="callout callout--key">
Toda a tonalidade funcional se apoia nisso: um unico ponto de tensao maxima que sabe exatamente para onde ir. Sem tritono nao ha dominante; sem dominante nao ha cadencia; sem cadencia nao ha tonalidade.
</div>

<h3>Campo harmonico menor com setimas</h3>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="eolio" data-size="4"></div>
<div class="w" data-w="harmonize" data-tonic="A" data-scale="menor-harmonica" data-size="4"></div>
<p>Na pratica, tonalidades menores misturam os dois campos: usam <strong>i, iv, ♭VI, ♭VII</strong> da natural e <strong>V7 e vii°7</strong> da harmonica. Isso nao e inconsistencia — e a tonalidade menor "real", que sempre foi um sistema hibrido.</p>
`,
        practice: [
          "Toque G7 e resolva em C, ouvindo Si→Do e Fa→Mi.",
          "Toque o campo harmonico com setimas de Do maior inteiro."
        ]
      },
      {
        id: "m9l3",
        title: "ii-V-I: a progressao mais importante",
        html: `
<p>Se existe um unico padrao harmonico que vale a pena dominar em todas as 12 tonalidades, e este.</p>
<div class="w" data-w="two-five-one"></div>

<h3>Por que funciona tao bem</h3>
<ol class="steps">
  <li><strong>Funcao completa.</strong> ii = subdominante, V = dominante, I = tonica. E o ciclo T–S–D–T inteiro em tres acordes.</li>
  <li><strong>Baixo em quintas.</strong> Re → Sol → Do sao quintas descendentes: o movimento de baixo mais forte que existe, porque imita a serie harmonica ao contrario.</li>
  <li><strong>Conducao minima.</strong> De Dm7 para G7 apenas <em>uma</em> voz se move: Do fica, Fa fica, La → Sol, Re fica. Depois G7 → Cmaj7 tambem move pouco.</li>
</ol>
<div class="w" data-w="two-five-voice-leading"></div>

<h3>A versao menor</h3>
<p>Em tonalidade menor: <strong>iiø7 – V7♭9 – im</strong>. Exemplo em La menor: Bm7♭5 – E7♭9 – Am7. O ii vira meio-diminuto porque sua quinta vem da menor natural; o V continua dominante porque vem da harmonica.</p>
<div class="w" data-w="minor-two-five"></div>

<h3>Estudo sistematico</h3>
<p>O metodo padrao e tocar ii–V–I descendo por quintas, percorrendo as 12 tonalidades e voltando ao inicio. Com boa conducao de vozes, a mao quase nao se move.</p>
<div class="w" data-w="two-five-cycle"></div>
<div class="callout callout--tip">
Faca isso 5 minutos por dia com metronomo a 60 bpm, um acorde por compasso. Em um mes, as 12 tonalidades ficam automaticas. E o investimento com maior retorno de todo o estudo de harmonia.
</div>
`,
        practice: [
          "Toque ii-V-I em Do, Fa, Si♭ e Mi♭ com conducao suave.",
          "Depois percorra o ciclo completo das 12 tonalidades.",
          "Faca a versao menor em La menor, Re menor e Sol menor."
        ]
      }
    ]
  }

  );
})(typeof window !== "undefined" ? window : globalThis);
