# Resposta del grup als 3 dubtes oberts (2026-10-29)

Resposta del grup d'experts als dubtes enviats el 2026-10-29 (PER-REVISAR.md, punts 2 i 4).
Transcripció del contingut; com s'ha aplicat, al final.

## 1. Marques de les llistes (E01 i E02)

| Paraula | Marca aprovada | Fonament del grup |
|---|---|---|
| culo (es) | malsonant | Connotació vulgar en l'entorn escolar. |
| cul (ca) | sensible | Mot anatòmic i col·loquial estàndard; sensible per prudència familiar (des de Level5). |
| teta (es, ca) | sensible | Mot anatòmic o infantil de lactància, no obscè. |
| polla, cardar (ca) | malsonant | Domina el sentit sexual o vulgar. |
| polla (es) | malsonant | Confirmat. |
| tonto, tonta (ca) | sensible | La guia E11 prohibeix insults i burles; sense marca sortiria a Level0. |
| pedo (es) | sense marca | Escatològic infantil, com caca. |
| pixa (ca) | malsonant | El verb pixar és neutre; el substantiu és vulgar. |
| pitu, tita (ca) | sense marca | Mots familiars; simetria amb pito (es). |
| canalla, chusma, gentuza, desgraciada (es) | sensible | Despectius o literaris: fora de Level0 a Level4, permesos des de Level5. |

## 2. "gust" i "camp" (català)

Passen a Level3. Les codes complexes d'arrel (-st, -mp, -rt, -sc, -xt) es treballen a Level3
(text, verd, disc, camp, gust). A Level2 les úniques excepcions de coda són:

1. el plural regular en -s sobre coda simple (nens, pans, pals);
2. les formes gramaticals i contraccions d'alta freqüència (els, dels, pels, als).

## 3. "al", "del" i "pel" a Level2 (català)

Aprovat. Tenen una estructura de síl·laba tancada simple i són eines gramaticals imprescindibles.

## Com s'ha aplicat (2026-10-29)

- **Marques**: `respostes-2026-10-29/ajustos-llistes.json` (clau `marca`) i
  `ajustos_llistes.py`. Els mots s'han marcat amb totes les formes de la llista: culs, tetes,
  carda, cardo i carden, tetas, canallas, desgraciados... També s'ha aplicat el mateix criteri a
  tonto, tonta, tontos i tontas en castellà, que eren sense marca i a Level0 de la llista infantil, i a
  desgraciat i desgraciada en català (cal confirmar-ho). "canalla" en català (la mainada) no es marca.
  Cap lot publicat feia servir aquests mots per sota del nivell permès.
- **Coda**: es retira l'excepció de monosíl·labs freqüents amb coda doble del 2026-10-27, que era
  per tipus de coda (nt, rt, rm, st, mp, rc, rp, rn, lp, nc). Tots aquests monosíl·labs passen a
  Level3, també dent, pont, porc, serp, forn, guant, talp, llamp, cranc, tronc, surt i dorm (72 mots
  de la llista infantil catalana i 12 noms catalans del banc d'imatges). Lots corregits:
  - REP-CA-L02-VEL-003: dent i pont canviats per nens i pals (plurals de Level2).
  - IMG-L02-MEM-004: topo (talp, ara Level3) i concha (marcada sensible en castellà) canviats per
    pantera i libro (llibre).
- **al, del, pel**: ja aplicat; sense canvis.
