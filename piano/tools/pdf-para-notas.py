#!/usr/bin/env python3
"""
pdf-para-notas.py — extrai notas de uma partitura em PDF VETORIAL.

Uso:  python3 piano/tools/pdf-para-notas.py partitura.pdf [pagina] [--clave sol|fa|piano]

  --clave piano  (padrao) pautas alternando sol/fa, que e o par do piano
  --clave sol    todas as pautas em clave de sol
  --clave fa     todas em clave de fa

POR QUE ISTO EXISTE
Transcrever partitura olhando para uma foto e adivinhar: nessa resolucao as
cabecas de nota tem poucos pixels e nao da para dizer em que linha estao.
Mas um PDF exportado de editor de partitura guarda a GEOMETRIA exata — as
linhas da pauta e as cabecas sao objetos vetoriais com coordenadas. Dai a
altura de cada nota e aritmetica, nao chute.

LIMITE DECLARADO
So funciona com PDF vetorial. PDF escaneado (uma imagem por pagina) nao tem
geometria nenhuma, e o script diz isso em vez de inventar. Verifique com a
mensagem que ele imprime antes de confiar no resultado.

Isto NAO e reconhecimento de partitura completo. O que ele NAO faz:

  - nao le DURACAO: toda nota sai sem ritmo, voce poe as duracoes
  - nao le ALTERACAO: sustenido e bemol nao sao detectados, nem os da
    armadura. Numa peca em Re maior ele diz "F4" onde se toca Fa#4. Aplique
    a armadura voce mesma, ou confira ouvindo.
  - nao le ligadura, quialtera, articulacao nem dinamica

Ou seja: ele resolve a parte que a vista humana faz mal (dizer em que linha
a cabeca esta) e deixa para voce a parte que a vista humana faz bem.
"""
import sys
from collections import defaultdict

try:
    import pymupdf
except ImportError:
    sys.exit("Falta o pymupdf. Instale com: pip install pymupdf")

LETRAS = ["C", "D", "E", "F", "G", "A", "B"]

# Nota diatonica da linha de BAIXO de cada clave (mesma definicao de staff.js)
CLAVES = {"sol": ("E", 4), "fa": ("F", 2)}


def indice_diatonico(letra, oitava):
    return oitava * 7 + LETRAS.index(letra)


def linhas_de_pauta(pagina, largura_min=100, tol=0.4):
    """Linhas horizontais longas, agrupadas em pautas de 5."""
    ys = []
    x_min = None
    for des in pagina.get_drawings():
        for it in des["items"]:
            if it[0] != "l":
                continue
            p1, p2 = it[1], it[2]
            if abs(p1.y - p2.y) < tol and abs(p1.x - p2.x) > largura_min:
                ys.append(round((p1.y + p2.y) / 2, 2))
                xi = min(p1.x, p2.x)
                x_min = xi if x_min is None else min(x_min, xi)
    ys = sorted(set(ys))

    # agrupa linhas proximas em pautas
    pautas, atual = [], []
    for y in ys:
        if atual and y - atual[-1] > 40:      # salto grande = outra pauta
            if len(atual) >= 5:
                pautas.append(atual)
            atual = []
        atual.append(y)
    if len(atual) >= 5:
        pautas.append(atual)
    return pautas, (x_min if x_min is not None else 0.0)


def cabecas(pagina, espaco):
    """Candidatas a cabeca de nota, filtradas pelo tamanho da pauta.

    Sem o filtro de tamanho, pedacos da clave entram: a espiral da clave de
    sol e o gancho dela sao curvas pequenas e fechadas, do mesmo feitio de
    uma cabeca. Mas cabeca de nota tem tamanho DERIVADO da pauta — largura
    perto de 1,3 espaco e altura perto de 1 espaco — enquanto os pedacos da
    clave nao respeitam essa proporcao.
    """
    out = []
    for des in pagina.get_drawings():
        r = des["rect"]
        larg, alt = r.width, r.height
        if not (0.75 * espaco < alt < 1.45 * espaco):
            continue
        if not (0.9 * espaco < larg < 2.1 * espaco):
            continue
        if larg < alt * 0.85:          # cabeca e mais larga que alta
            continue
        out.append((round(r.x0 + larg / 2, 2), round(r.y0 + alt / 2, 2)))
    return sorted(out)


def altura(y, linhas, clave):
    """Posicao vertical -> nome de nota, pela clave."""
    base_y = linhas[-1]                       # linha de baixo
    espaco = (linhas[-1] - linhas[0]) / 4.0   # distancia entre linhas
    if espaco <= 0:
        return None
    passos = round((base_y - y) / (espaco / 2.0))
    letra_base, oit_base = CLAVES[clave]
    dia = indice_diatonico(letra_base, oit_base) + passos
    return LETRAS[dia % 7] + str(dia // 7)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    caminho = sys.argv[1]
    args = sys.argv[2:]
    modo_clave = "piano"
    if "--clave" in args:
        i = args.index("--clave")
        if i + 1 >= len(args) or args[i + 1] not in ("sol", "fa", "piano"):
            sys.exit("--clave aceita: sol, fa ou piano")
        modo_clave = args[i + 1]
        del args[i:i + 2]
    npag = int(args[0]) - 1 if args else 0

    doc = pymupdf.open(caminho)
    if npag >= doc.page_count:
        sys.exit(f"O PDF tem {doc.page_count} pagina(s).")
    pag = doc[npag]

    des = pag.get_drawings()
    imgs = pag.get_images()
    if not des and imgs:
        sys.exit(
            "Esta pagina e uma IMAGEM, nao vetor — nao ha geometria para ler.\n"
            "PDF escaneado nao serve. Exporte do editor de partitura, ou envie\n"
            "MusicXML/MIDI, ou mande um a dois compassos recortados e grandes."
        )

    pautas, x_pauta = linhas_de_pauta(pag)
    if not pautas:
        sys.exit("Nao achei linhas de pauta nesta pagina.")

    print(f"pagina {npag + 1}: {len(pautas)} pauta(s), {len(des)} objetos vetoriais\n")

    for i, linhas in enumerate(pautas):
        espaco = (linhas[-1] - linhas[0]) / 4.0
        todas = cabecas(pag, espaco)
        # A clave NAO e detectada do desenho: e declarada. Adivinhar pela
        # ordem quebra numa pauta de baixo sozinha, e o erro e silencioso —
        # sai uma lista de notas plausivel e inteiramente errada.
        if modo_clave == "piano":
            clave = "sol" if i % 2 == 0 else "fa"
        else:
            clave = modo_clave
        topo, base = linhas[0] - 60, linhas[-1] + 60
        # A clave ocupa o inicio da pauta e a espiral dela cai exatamente na
        # linha do Sol — vira um falso "G4" se nao for excluida. A armadura,
        # quando existe, vem logo depois. Descartamos essa faixa inicial.
        x_corte = x_pauta + 4.5 * espaco
        minhas = [(x, y) for (x, y) in todas if topo <= y <= base and x > x_corte]
        notas = [altura(y, linhas, clave) for (x, y) in sorted(minhas)]
        notas = [n for n in notas if n]
        print(f"pauta {i + 1} (clave de {clave}, {len(notas)} cabecas):")
        print("  " + " ".join(notas) if notas else "  (nenhuma cabeca detectada)")
        print()

    if modo_clave == "piano":
        print("Claves assumidas: alternando sol/fa (par do piano).")
        print("Se a pagina nao for esse par, rode com --clave sol ou --clave fa.")
    print("NAO le duracao nem alteracao: em tonalidade com armadura, aplique-a.")
    print("Confira ouvindo antes de usar.")


if __name__ == "__main__":
    main()
