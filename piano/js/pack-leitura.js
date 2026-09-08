/*
 * pack-leitura.js — GERADO por tools/build-content.mjs
 * NAO EDITE A MAO. Edite content/leitura/ e recompile.
 *
 * Fonte: Conteudo original. A sequencia didatica segue a pratica corrente de ensino de leitura (notas-ancora e leitura intervalar), nao um texto especifico.
 * Licenca: Conteudo original
 */
(function (global) {
  "use strict";
  global.PT = global.PT || {};
  global.PT.CURRICULUM = global.PT.CURRICULUM || [];
  global.PT.CURRICULUM.push(
    {
      "id": "leitura",
      "title": "Ler partitura passo a passo",
      "level": "Iniciante",
      "tag": "Leitura",
      "order": 7,
      "summary": "Um caminho ordenado para sair do zero ate ler uma linha simples a primeira vista. Sem mnemonico: tres notas-ancora e leitura por intervalo.",
      "goals": [
        "Achar qualquer nota da pauta sem contar linha por linha",
        "Ler a distancia entre duas notas antes de ler o nome delas",
        "Tocar uma linha simples lendo, nao decorando",
        "Entender por que a armadura aparece antes das notas"
      ],
      "lessons": [
        {
          "id": "leit-l1",
          "title": "O que a pauta e, de verdade",
          "html": "<p>Quase todo mundo que desiste de ler partitura desiste pelo mesmo motivo: tentou decorar. Decorou \"Mi-Sol-Si-Re-Fa\" para as linhas, decorou \"Fa-La-Do-Mi\" para os espacos, e depois travou, porque decodificar nota por nota e lento demais para acompanhar musica.</p>\n<p>Ler nao e lembrar. Ler e <strong>medir</strong>.</p>\n<h3>A pauta e um grafico</h3>\n<p>Cinco linhas, quatro espacos. Nove posicoes, alternando linha e espaco, e cada posicao vale <strong>uma letra</strong>. Sobe uma posicao, avanca uma letra. E so isso.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"C4 D4 E4 F4 G4 A4 B4 C5\" data-names=\"1\" data-caption=\"Do a Do. Repare que a nota alterna espaco, linha, espaco, linha — porque as letras alternam.\"></div>\n<p>O eixo vertical e altura. O eixo horizontal e tempo. Uma partitura e um grafico de altura por tempo, e voce ja sabe ler graficos.</p>\n<h3>Por que as letras e nao as teclas</h3>\n<p>Aqui esta a peca que confunde: a pauta tem <strong>sete</strong> posicoes por oitava, e o teclado tem <strong>doze</strong> teclas. Nao batem.</p>\n<p>Isso nao e defeito. A pauta grafa as sete letras — A, B, C, D, E, F, G — e as cinco teclas restantes aparecem como <strong>alteracao</strong> de uma dessas letras, com um sustenido ou bemol na frente. Por isso duas notas que sao a mesma tecla podem ocupar linhas diferentes:</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"F#4 Gb4\" data-names=\"1\" data-caption=\"Fa sustenido e Sol bemol: a mesma tecla do piano, duas posicoes na pauta. A grafia carrega informacao que a tecla nao carrega.\"></div>\n<p>Se a pauta usasse as doze teclas, essa distincao sumiria — e junto com ela sumiria a razao de uma escala se chamar Fa maior e nao Mi sustenido maior.</p>\n<h3>O que vem a seguir</h3>\n<p>Voce ainda nao sabe <strong>qual</strong> letra e cada posicao. Falta uma informacao: a clave. E o assunto da proxima licao, e ela resolve tudo com uma nota so.</p>",
          "practice": [
            "Abra qualquer partitura e nao tente ler nada. So repare: onde as notas sobem, o som sobe. Onde descem, desce.",
            "Ache duas notas na mesma linha em pontos diferentes da pagina. Sao a mesma altura, sempre."
          ]
        },
        {
          "id": "leit-l2",
          "title": "A clave declara uma nota, e o resto se deduz",
          "html": "<p>A pauta sozinha nao diz nada. Nove posicoes, mas comecando em que letra?</p>\n<p>A clave responde. E ela responde declarando <strong>uma unica nota</strong> — a partir dali todo o resto se conta.</p>\n<h3>A clave de sol aponta o Sol</h3>\n<p>O simbolo da clave de sol e uma espiral, e o centro dessa espiral se enrola em volta de uma linha especifica: a <strong>segunda de baixo para cima</strong>. Essa linha e o Sol4.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"G4\" data-names=\"1\" data-caption=\"A espiral da clave se fecha exatamente nesta linha. E a definicao da clave, nao uma convencao arbitraria.\"></div>\n<p>Sabendo isso, tudo se deduz. A linha logo acima do Sol e Si — porque subir uma linha e subir duas letras (pula o espaco). O espaco logo acima do Sol e La.</p>\n<h3>A clave de fa aponta o Fa</h3>\n<p>Mesma logica. O simbolo tem dois pontos, e eles <strong>cercam</strong> uma linha: a quarta de baixo para cima. Essa linha e o Fa3.</p>\n<div class=\"w\" data-w=\"staff\" data-clef=\"fa\" data-notes=\"F3\" data-names=\"1\" data-caption=\"Os dois pontos existem para marcar esta linha. Se a clave for desenhada em outra altura, ela declara outro Fa — e isso acontece de verdade em musica antiga.\"></div>\n<h3>Por que duas claves</h3>\n<p>Porque o piano tem 88 teclas e uma pauta so de cinco linhas cobriria pouco mais de uma oitava. Com duas pautas e duas claves, cobre-se a maior parte do instrumento sem encher a pagina de linhas suplementares.</p>\n<p>A clave de sol costuma servir a mao direita, a de fa a mao esquerda — mas isso e tendencia, nao regra. As duas maos podem tocar em qualquer uma das pautas.</p>",
          "practice": [
            "Desenhe uma pauta vazia no papel e marque so a linha do Sol. Depois preencha as outras posicoes contando para cima e para baixo.",
            "Faca o mesmo com a clave de fa, marcando a linha do Fa."
          ]
        },
        {
          "id": "leit-l3",
          "title": "As tres notas que voce decora — e so essas",
          "html": "<p>Decorar as nove posicoes de cada clave da dezoito coisas para lembrar, e voce vai confundir todas. Decorar <strong>tres</strong> e viavel, e das tres se chega a qualquer outra.</p>\n<p>As tres ancoras:</p>\n<table class=\"tbl\"><thead><tr><th>Nota</th><th>Onde</th><th>Por que esta</th></tr></thead><tbody><tr><td><strong>Do central (Do4)</strong></td><td>primeira linha suplementar abaixo da clave de sol, e acima da de fa</td><td>e o ponto onde as duas pautas se encontram</td></tr><tr><td><strong>Sol4</strong></td><td>segunda linha da clave de sol</td><td>a clave de sol existe para marcar ela</td></tr><tr><td><strong>Fa3</strong></td><td>quarta linha da clave de fa</td><td>a clave de fa existe para marcar ela</td></tr></tbody></table>\n<div class=\"w\" data-w=\"staff\" data-notes=\"C4 G4\" data-names=\"1\" data-caption=\"As duas ancoras da clave de sol. Do central pendurado na linha suplementar, Sol4 abracado pela espiral.\"></div>\n<div class=\"w\" data-w=\"staff\" data-clef=\"fa\" data-notes=\"F3 C4\" data-names=\"1\" data-caption=\"Na clave de fa: Fa3 na linha dos dois pontos, e o mesmo Do central — agora acima da pauta.\"></div>\n<p>Repare que o Do central aparece nas duas imagens. <strong>E a mesma nota, a mesma tecla.</strong> Ele fica pendurado embaixo de uma pauta e em cima da outra porque as duas pautas sao vizinhas na mesma escada. A proxima licao volta nisso.</p>\n<h3>Agora treine</h3>\n<p>O treino abaixo sorteia uma nota e espera que voce a ache <strong>no teclado</strong>. Nao ha botao com o nome da nota, e isso e proposital: ler partitura e ligar simbolo a gesto. Responder o nome com a boca nao treina a mao.</p>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"sol\" data-lo=\"C4\" data-hi=\"G4\" data-caption=\"Faixa curta de proposito: so entre as duas ancoras da clave de sol. A faixa abre nas proximas licoes.\"></div>\n<p>Quando estiver confortavel, passe para a clave de fa:</p>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"fa\" data-lo=\"F3\" data-hi=\"C4\" data-caption=\"Entre o Fa3 e o Do central.\"></div>",
          "practice": [
            "Toque o Do central e diga em voz alta onde ele fica na pauta de cima e na de baixo. Ele aparece nas duas.",
            "No treino desta licao, fique ate acertar 10 seguidas antes de passar adiante."
          ]
        },
        {
          "id": "leit-l4",
          "title": "Ler a distancia antes do nome",
          "html": "<p>Esta e a licao que separa quem le rapido de quem le devagar.</p>\n<p>O leitor lento faz assim: ve a nota, descobre o nome, acha a tecla. Tres passos, para cada nota, sempre.</p>\n<p>O leitor rapido faz assim: ancora uma nota, e <strong>le as seguintes pela distancia</strong>. Um passo.</p>\n<h3>A forma na pagina e a forma no teclado</h3>\n<p>Ha so tres relacoes possiveis entre duas notas vizinhas na pauta:</p>\n<p><strong>Mesma posicao</strong> — repete a nota. A mao nao se move.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"E4 E4\" data-caption=\"Duas vezes a mesma linha: a mesma tecla.\"></div>\n<p><strong>Posicao adjacente</strong> (linha para o espaco vizinho) — segunda. A mao anda para a tecla ao lado.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"E4 F4 G4 A4\" data-caption=\"Espaco, linha, espaco, linha: cada passo e uma segunda. Na pagina isso e a escadinha continua.\"></div>\n<p><strong>Pulando uma posicao</strong> (linha para linha, ou espaco para espaco) — terca. A mao pula uma tecla branca.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"E4 G4 B4 D5\" data-caption=\"Tudo em linha: tercas empilhadas. E exatamente o desenho de um acorde.\"></div>\n<p>Essa ultima e a mais util de todas. <strong>Notas todas em linha, ou todas em espaco, formam acorde.</strong> Voce reconhece um acorde pela forma, sem ler nota nenhuma.</p>\n<h3>Por que isso funciona</h3>\n<p>Porque a pauta e regular. Uma terca <strong>sempre</strong> parece igual, em qualquer altura, em qualquer clave. Um nome de nota muda conforme a clave; uma distancia, nao.</p>\n<p>Ouca a diferenca entre andar de segunda e pular de terca:</p>\n<div class=\"w\" data-w=\"staff-play\" data-notes=\"C4 D4 E4 F4 G4\" data-caption=\"Segundas: escadinha.\"></div>\n<div class=\"w\" data-w=\"staff-play\" data-notes=\"C4 E4 G4 C5\" data-caption=\"Tercas e uma quarta: o mesmo acorde de Do, arpejado.\"></div>",
          "practice": [
            "Pegue qualquer partitura e percorra uma linha melodica dizendo so \"sobe segunda, sobe terca, desce segunda\". Ignore os nomes.",
            "Repita tocando, sem nomear nada. A mao aprende o salto."
          ]
        },
        {
          "id": "leit-l5",
          "title": "As duas pautas sao uma escada so",
          "html": "<p>O erro mais comum de quem esta aprendendo: tratar as duas pautas como dois sistemas separados, cada um com suas regras.</p>\n<p>Elas sao <strong>uma escada continua</strong>, cortada ao meio para caber na pagina.</p>\n<h3>O Do central e a emenda</h3>\n<p>Entre a linha de cima da clave de fa (La3) e a linha de baixo da clave de sol (Mi4) existem tres notas: Si3, <strong>Do4</strong>, Re4. O Do central esta bem no meio, e por isso ele pode ser escrito de dois jeitos: pendurado abaixo da pauta de cima ou acima da pauta de baixo.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"C4 D4 E4\" data-names=\"1\" data-caption=\"Vindo de baixo para a clave de sol: Do central na suplementar, Re no espaco abaixo, Mi ja na primeira linha.\"></div>\n<div class=\"w\" data-w=\"staff\" data-clef=\"fa\" data-notes=\"A3 B3 C4\" data-names=\"1\" data-caption=\"A mesma regiao pela clave de fa: La3 na linha de cima, Si3 no espaco acima, Do central na suplementar.\"></div>\n<p>Nas duas figuras, o Do central e a <strong>mesma tecla</strong>. A escolha de qual pauta usar e so uma questao de qual mao vai tocar e de qual escrita gera menos linhas suplementares.</p>\n<h3>Por que a emenda fica ai</h3>\n<p>Nao e arbitrario. Se voce empilhasse as duas pautas com o espacamento certo, as linhas continuariam na mesma progressao — e o Do central seria exatamente a linha do meio, aquela que foi removida por estar sempre no caminho.</p>\n<p>O nome \"Do central\" vem disso: e o centro do sistema, e tambem fica perto do centro do teclado.</p>\n<h3>Treino cruzando as duas</h3>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"sol\" data-lo=\"C4\" data-hi=\"C5\" data-caption=\"Clave de sol, uma oitava completa a partir do Do central.\"></div>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"fa\" data-lo=\"C3\" data-hi=\"C4\" data-caption=\"Clave de fa, a oitava logo abaixo. Repare que o Do central fecha esta e abre a outra.\"></div>",
          "practice": [
            "Toque Do central com a mao esquerda e depois com a direita. E a mesma tecla, escrita em pautas diferentes.",
            "Suba do Fa3 ate o Sol4 tocando so teclas brancas, e acompanhe onde a nota cruza de uma pauta para a outra."
          ]
        },
        {
          "id": "leit-l6",
          "title": "Duracao e uma divisao por dois",
          "html": "<p>Ate aqui voce sabe <strong>qual</strong> tecla. Falta <strong>por quanto tempo</strong>.</p>\n<p>O sistema de duracao e mais simples do que os nomes sugerem: cada figura vale metade da anterior. So isso.</p>\n<table class=\"tbl\"><thead><tr><th>Figura</th><th>Vale</th><th>Desenho</th></tr></thead><tbody><tr><td>Semibreve</td><td>4 tempos</td><td>cabeca vazada, sem haste</td></tr><tr><td>Minima</td><td>2 tempos</td><td>cabeca vazada, com haste</td></tr><tr><td>Seminima</td><td>1 tempo</td><td>cabeca cheia, com haste</td></tr><tr><td>Colcheia</td><td>1/2 tempo</td><td>cabeca cheia, haste com 1 bandeira</td></tr><tr><td>Semicolcheia</td><td>1/4 tempo</td><td>cabeca cheia, haste com 2 bandeiras</td></tr></tbody></table>\n<p>Repare no padrao do <strong>desenho</strong>, que tambem e sistematico: vazada vira cheia, depois cada bandeira corta pela metade de novo. Voce nao decora cinco simbolos, decora duas transformacoes.</p>\n<h3>O ponto nao e um simbolo novo</h3>\n<p>Um ponto depois da figura acrescenta <strong>metade do valor dela</strong>. Uma minima pontuada vale 2 + 1 = 3 tempos.</p>\n<p>Dois pontos acrescentam metade, depois metade da metade: 2 + 1 + 0,5 = 3,5. E a serie geometrica <code>1 + 1/2 + 1/4 + ...</code>, que nunca chega a dobrar o valor — por isso nao existe figura pontuada que valha o mesmo que a proxima acima.</p>\n<h3>Por que a haste vira para baixo</h3>\n<p>Quando a nota esta acima da linha do meio, a haste desce; abaixo, sobe. Nao e estetica: e para a haste nao sair da pauta. Uma nota alta com haste para cima invadiria a linha de texto acima.</p>\n<div class=\"w\" data-w=\"staff\" data-notes=\"E4 G4 B4 D5 F5\" data-caption=\"Repare onde as hastes viram: da linha do meio para cima, elas passam a descer.\"></div>",
          "practice": [
            "Bata palma numa semibreve contando 4, depois duas minimas contando 2 cada. O total nao muda.",
            "Pegue um compasso qualquer de uma partitura e some as figuras. Tem de fechar exatamente."
          ]
        },
        {
          "id": "leit-l7",
          "title": "A armadura fala antes das notas",
          "html": "<p>Entre a clave e a primeira nota costuma haver um grupo de sustenidos ou bemois. Isso e a <strong>armadura</strong>, e ela vale para a peca inteira.</p>\n<p>Uma armadura com um sustenido no Fa nao quer dizer \"toque Fa sustenido aqui\". Quer dizer: <strong>todo Fa desta peca e sustenido</strong>, em qualquer oitava, ate que se diga o contrario.</p>\n<div class=\"w\" data-w=\"staff\" data-scale=\"jonio\" data-tonic=\"G\" data-key=\"G\" data-caption=\"Sol maior. Um sustenido na armadura, e nenhum acidente escrito nas notas — porque a armadura ja resolveu.\"></div>\n<div class=\"w\" data-w=\"staff\" data-scale=\"jonio\" data-tonic=\"D\" data-key=\"D\" data-caption=\"Re maior: dois sustenidos. Repare que o segundo aparece mais abaixo, e a ordem nunca muda.\"></div>\n<h3>Por que a ordem e sempre a mesma</h3>\n<p>Os sustenidos entram na ordem Fa, Do, Sol, Re, La, Mi, Si. Os bemois entram na ordem inversa: Si, Mi, La, Re, Sol, Do, Fa.</p>\n<p>Isso nao e convencao. Cada tonalidade nova, subindo de quinta em quinta, acrescenta <strong>exatamente um</strong> sustenido, e sempre o proximo da fila. E o circulo de quintas escrito na pauta — o mesmo circulo que voce ja viu no modulo sobre armaduras, agora na forma em que aparece na pagina.</p>\n<div class=\"w\" data-w=\"staff\" data-scale=\"jonio\" data-tonic=\"F\" data-key=\"F\" data-caption=\"Fa maior: um bemol. Os bemois comecam pelo Si e caminham na direcao oposta a dos sustenidos.\"></div>\n<h3>Acidente ocorrente</h3>\n<p>Um sustenido, bemol ou bequadro escrito <strong>junto da nota</strong>, no meio da musica, vale so ate o fim daquele compasso. Depois a armadura volta a mandar.</p>\n<p>E por isso que o bequadro existe: ele nao \"tira\" nada em definitivo, so cancela a armadura por um compasso.</p>\n<h3>Leia a armadura primeiro, sempre</h3>\n<p>Antes de tocar a primeira nota de qualquer peca: olhe a armadura, nomeie a tonalidade, e toque a escala dela uma vez. Isso poe a mao na posicao certa e evita o erro mais comum de leitura — tocar a tecla branca onde a armadura pedia a preta.</p>",
          "practice": [
            "Pegue tres partituras diferentes e leia so a armadura. Diga a tonalidade antes de olhar qualquer nota.",
            "Toque a escala da tonalidade que voce identificou. Confira se as teclas pretas batem com os acidentes da armadura."
          ]
        },
        {
          "id": "leit-l8",
          "title": "Rotina de leitura a primeira vista",
          "html": "<p>Leitura a primeira vista e uma habilidade separada de tocar bem. Da para tocar uma sonata de cor e travar numa cancao simples na primeira leitura. Sao treinos diferentes.</p>\n<p>A regra que mais rende: <strong>leia material facil demais, todo dia, sem repetir</strong>. Quem pratica leitura em peca dificil nao esta lendo, esta decifrando — e decifrar treina o habito errado, o de parar.</p>\n<h3>A varredura de 30 segundos</h3>\n<p>Antes de tocar qualquer coisa nova, olhe nesta ordem:</p>\n<ol><li><strong>Armadura</strong> — qual tonalidade. Toque a escala uma vez.</li><li><strong>Formula de compasso</strong> — quantos tempos por compasso.</li><li><strong>Andamento</strong> — e a velocidade em que voce vai conseguir tocar as passagens</li></ol>\n<p>   dificeis, nao as faceis.</p>\n<ol><li><strong>A nota mais aguda e a mais grave</strong> — dizem onde a mao vai precisar chegar.</li><li><strong>Padroes repetidos</strong> — quase toda musica repete. O que se repete voce le uma</li></ol>\n<p>   vez so.</p>\n<h3>As tres regras durante a leitura</h3>\n<p><strong>Nao pare.</strong> Errar e seguir vale mais que acertar e voltar. A leitura a primeira vista real — num ensaio, acompanhando alguem — nao permite voltar, e o habito de voltar e o mais dificil de desfazer depois.</p>\n<p><strong>Olhe adiante.</strong> Os olhos devem estar sempre um pouco a frente das maos. Quem olha a nota que esta tocando ja esta atrasado.</p>\n<p><strong>Nao olhe as maos.</strong> Voce sabe onde as teclas estao pelo tato. Olhar para baixo custa o lugar na partitura.</p>\n<h3>Treino final</h3>\n<p>Junte tudo: faixa larga, as duas claves, sem aviso previo.</p>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"sol\" data-lo=\"C4\" data-hi=\"G5\" data-caption=\"Clave de sol, faixa completa de leitura inicial.\"></div>\n<div class=\"w\" data-w=\"staff-drill\" data-clef=\"fa\" data-lo=\"F2\" data-hi=\"C4\" data-caption=\"Clave de fa, faixa completa.\"></div>\n<h3>Onde continuar</h3>\n<p>Quando estas duas faixas estiverem confortaveis, o proximo passo nao e ampliar mais a faixa — e ler <strong>ritmo junto</strong>, e depois as duas maos simultaneas. Ler duas pautas ao mesmo tempo e uma habilidade propria, e ela so faz sentido depois que cada pauta sozinha ja esta automatica.</p>",
          "practice": [
            "Cinco minutos por dia, material facil demais, sem repetir a mesma peca. Todo dia.",
            "Antes de tocar, faca a varredura de 30 segundos descrita abaixo. Sempre, mesmo com pressa."
          ]
        }
      ]
    }
  );
})(typeof window !== "undefined" ? window : globalThis);
