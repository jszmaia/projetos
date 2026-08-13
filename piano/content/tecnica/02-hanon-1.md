---
id: tec-l2
title: Hanon nº 1, e por que ele e um algoritmo
practice:
  - Toque a 60 bpm com as duas maos, ouvindo se o dedo 4 sai mais fraco que os vizinhos.
  - Depois de dominar em Do, troque o seletor para Fa sustenido. As teclas pretas guiam a mao e costuma ficar mais facil, nao mais dificil.
---

O primeiro exercicio do *Le Pianiste Virtuose* (Hanon, 1873) e provavelmente o
trecho de piano mais tocado do mundo. Ele parece uma sequencia arbitraria de notas.
Nao e.

## A figura

A mao direita toca **Do Mi Fa Sol La Sol Fa Mi**, e depois repete a mesma forma
comecando um grau acima: **Re Fa Sol La Si La Sol Fa**. E assim por diante,
subindo a escala; na volta, a figura e espelhada.

Escrito em **graus da escala** em vez de nomes de notas, o padrao inteiro cabe em
oito numeros:

```
[ 0, +2, +3, +4, +5, +4, +3, +2 ]
```

Isto e: parta de um grau, pule um, suba tres por grau conjunto, e volte.

## Por que isso importa

Guardar a **regra** em vez das notas nao e economia de espaco — muda o que o
exercicio consegue fazer:

| Guardando notas | Guardando a regra |
|---|---|
| 224 notas digitadas para a mao direita | 8 numeros |
| erros de digitacao possiveis | nao ha o que digitar errado |
| existe em uma tonalidade so | existe em todas as 12 |
| dedilhado fixo | dedilhado recalculado por tonalidade |

O app gera as 224 notas a partir desses oito numeros toda vez que voce troca de
tonalidade. Experimente no seletor abaixo.

::exercise ex=hanon-1 tonic=C

## O que este exercicio realmente treina

Repare na figura: ela usa os dedos **1 2 3 4 5 4 3 2**, e o polegar toca **uma vez
so**, no inicio. O corpo do exercicio fica todo sobre os dedos 2 a 5 — justamente
os fracos, e justamente o 4, que divide tendao com o 3.

Nao e um exercicio de escala disfarçado. E um exercicio de **igualdade entre dedos
desiguais**.

> O criterio de sucesso nao e velocidade: e nao conseguir ouvir qual dedo tocou
> qual nota. Se o La (dedo 5) sai mais fraco ou o Sol (dedo 4) atrasa, diminua o
> andamento ate isso desaparecer. Nao adianta acelerar por cima do defeito.

## Como estudar

1. **Maos separadas primeiro**, a 60 bpm, uma nota por tempo. Sem pedal.
2. Junte as maos so quando cada uma estiver parelha sozinha.
3. Suba de 4 em 4 bpm, e apenas depois de tres repeticoes perfeitas seguidas.
4. Cinco minutos por dia bastam. Vinte minutos de repeticao desatenta nao valem
   mais que cinco atentos — e cansam a mao, o que atrapalha o resto do estudo.

## Honestidade sobre a fonte

O padrao acima foi conferido nota a nota contra o texto impresso do exercicio nº 1.
Os demais exercicios do Hanon (nº 2 a 60) **nao** estao neste app: cada um tem seu
proprio padrao, e transcreve-los exige a partitura em maos. O motor ja esta pronto
para recebe-los — cada exercicio novo custa uma linha de numeros.
