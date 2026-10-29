"""E03 y E04: lista infantil a partir de los lemas clasificados por Opus, expandidos a sus formas.

Castellano: formas, etiquetas y frecuencias del CORPES XXI. Catalán: formas y etiquetas del
diccionario de Softcatalà, frecuencia de ca-general.csv (wordfreq). Se excluyen los tiempos que un
niño de 5 a 7 años no usa (imperfecto y futuro de subjuntivo; en catalán, además, el pretérito simple
literario, porque el habla usa el perifrástico "va menjar"). Nivel de la forma = el de su lema.
"""
import collections, csv, json, re, sys, random
from pathlib import Path
sys.path.insert(0, '/Users/josellamas/var/www/shine-project/shine/content/generadores')
from estructura import min_level
S = Path(sys.argv[1]); LEX = Path(sys.argv[2]); lang = sys.argv[3]
CATS = {'nom', 'verb', 'adj', 'adv', 'det', 'pron', 'prep', 'conj', 'interj', 'num'}
OK = re.compile(r"^[a-zñáéíóúüàèòïç·]+$")

# 1. Lemas con nivel
lemmas = {}   # (lema, cat) -> {'nivel', 'fuente'}
cand = {(e['lema'], e['categoria']): e for e in json.load(open(S / f'cand-{lang}.json'))}
for p in sorted(S.glob(f'out/nivel-{lang}*.tsv')):
    for r in csv.DictReader(open(p, encoding='utf-8'), delimiter='\t', quoting=csv.QUOTE_NONE):
        r = {k: (v or '').strip() for k, v in r.items() if k}
        if r.get('nivel') not in ('0', '1', '2'): continue
        l = r.get('lema_correcto') or r['lema']; c = r.get('categoria_correcta') or r['categoria']
        if c not in CATS: continue
        e = cand.get((r['lema'], r['categoria']), {})
        src = 'banco' if e.get('banco') else 'lotes' if e.get('lotes') else 'general'
        k = (l, c); n = int(r['nivel'])
        if k not in lemmas or n < lemmas[k]['nivel']: lemmas[k] = {'nivel': n, 'fuente': src, 'nota': r.get('nota', '')}
for r in csv.DictReader(open(S / f'out/temas-{lang}.tsv', encoding='utf-8'), delimiter='\t', quoting=csv.QUOTE_NONE):
    r = {k: (v or '').strip() for k, v in r.items() if k}
    if r.get('nivel') not in ('0', '1', '2') or r.get('categoria') not in CATS: continue
    k = (r['lema'].lower(), r['categoria'])
    if k not in lemmas: lemmas[k] = {'nivel': int(r['nivel']), 'fuente': 'temas', 'nota': r.get('tema', '')}
by_lemma = collections.defaultdict(list)
for (l, c) in lemmas: by_lemma[l].append(c)

# 2. Formas de cada lema
forms = collections.defaultdict(dict)   # forma -> (lema, cat) -> freq
def cat_es(tag):
    k = tag[:1]
    if k == 'N': return None if tag[3:4] == 'p' else 'nom'
    if k in 'DQWX': return 'pron' if tag[-2:-1] == 'r' else 'det'
    return {'V': 'verb', 'A': 'adj', 'R': 'adv', 'P': 'prep', 'C': 'conj', 'T': 'det', 'L': 'pron', 'H': 'pron', 'M': 'num', 'I': 'interj'}.get(k)
def verb_ok_es(tag):
    return not (tag[1:2] == 's' and tag[5:6] in ('i', 'f'))   # imperfecto y futuro de subjuntivo
def tense_level_es(tag):
    # futuro, condicional y presente de subjuntivo: nivel 1 como mínimo; el resto, el del lema
    if tag[:1] != 'V': return 0
    if tag[1:2] == 's' and tag[5:6] == 'p': return 1
    if tag[1:2] == 'i' and tag[5:6] in ('f', 'c'): return 1
    return 0
def tense_level_ca(tag):
    if tag[:1] != 'V': return 0
    return 1 if tag[2:4] in ('SP', 'IF', 'IC') else 0
def common_es(tag):
    # presente, imperativo y formas no personales entran siempre; los demás tiempos, si son frecuentes
    return tag[:1] != 'V' or tag[1:2] in ('p', '-') or (tag[1:2] == 'i' and tag[5:6] == 'p') or tag[1:2] == 'm'
def cat_ca(tag):
    if tag.startswith('NP'): return None
    if tag.startswith('DN') or tag.startswith('Z'): return 'num'
    return {'N': 'nom', 'V': 'verb', 'A': 'adj', 'R': 'adv', 'D': 'det', 'P': 'pron', 'S': 'prep', 'C': 'conj', 'I': 'interj'}.get(tag[:1])
def verb_ok_ca(tag):
    return not (tag[1:4] in ('MSI', 'ASI', 'SSI') or tag[1:4] in ('MIS', 'AIS', 'SIS'))
general = {}
for r in csv.DictReader(open(LEX / f'{lang}-general.csv', encoding='utf-8')):
    general.setdefault(r['forma'], (float(r['frecuencia']), int(r['rango'])))
if lang == 'es':
    for line in open(LEX / 'fuentes/frecuencia_elementos_corpes_1_5.txt', encoding='utf-8'):
        c = line.rstrip('\r\n').split('\t')
        if len(c) != 6 or not c[3].isdigit(): continue
        l = c[1].lower()
        if l not in by_lemma: continue
        k = cat_es(c[2]); w = c[0].lower()
        if not k or k not in by_lemma[l] or not OK.match(w) or int(c[3]) < 5: continue
        if k == 'verb' and not verb_ok_es(c[2]): continue
        if k == 'verb' and not common_es(c[2]) and int(c[3]) < 20: continue
        f0, t0 = forms[w].get((l, k), (0, 9))
        forms[w][(l, k)] = (f0 + int(c[3]), min(t0, tense_level_es(c[2])))
else:
    for line in open(LEX / 'fuentes/softcatala/diccionari.txt', encoding='utf-8'):
        p = line.rstrip('\n').split(' ')
        if len(p) != 3: continue
        l = p[1].lower()
        if l not in by_lemma: continue
        k = cat_ca(p[2]); w = p[0].lower()
        if not k or k not in by_lemma[l] or not OK.match(w): continue
        if k == 'verb' and not verb_ok_ca(p[2]): continue
        if w not in general and not (k == 'verb' and p[2][2:4] in ('IP', 'M0', 'N0', 'G0', 'P0')) and w != l: continue
        f0, t0 = forms[w].get((l, k), (0, 9))
        forms[w][(l, k)] = (general.get(w, (0,))[0], min(t0, tense_level_ca(p[2])))
# lemas sin formas en la fuente: el propio lema (y plural regular de los nombres castellanos)
for (l, c) in lemmas:
    if any((l, c) in v for v in forms.values()): continue
    forms[l][(l, c)] = (0, 0)
    if lang == 'es' and c == 'nom' and ' ' not in l:
        pl = l + 's' if l[-1] in 'aeiouáéó' else (l[:-1] + 'ces' if l.endswith('z') else l + 'es') if l[-1] not in 'sx' else None
        if pl: forms[pl][(l, c)] = (0, 0)

# 3. Filas
rows = []
for w, ls in forms.items():
    if "'" in w: continue
    best = min(ls, key=lambda k: (max(lemmas[k]['nivel'], ls[k][1]), -ls[k][0]))
    lv, why = min_level(w, lang)
    g = general.get(w)
    rows.append({'forma': w, 'lema': best[0], 'categoria': best[1], 'nivel': max(lemmas[best]['nivel'], ls[best][1]),
                 'frecuencia': g[0] if g else '', 'rango_general': g[1] if g else '',
                 'estructura_min': f'Level{lv}', 'estructura_motivo': why, 'fuente': lemmas[best]['fuente']})
rows.sort(key=lambda r: (r['nivel'], r['rango_general'] if r['rango_general'] != '' else 10**9, r['forma']))
col_nivel = 'nivel' if lang == 'es' else 'nivell'
cols = ['forma', 'lema', 'categoria', col_nivel, 'frecuencia', 'rango_general', 'estructura_min', 'estructura_motivo', 'fuente']
for r in rows: r[col_nivel] = r.pop('nivel') if col_nivel != 'nivel' else r['nivel']
out = S / 'final'; out.mkdir(exist_ok=True)
with open(out / f'{lang}-infantil.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.DictWriter(f, cols, extrasaction='ignore', lineterminator='\n'); wr.writeheader(); wr.writerows(rows)
lv_counts = collections.Counter(r[col_nivel] for r in rows)
lem_counts = collections.Counter(v['nivel'] for v in lemmas.values())
src = collections.Counter(v['fuente'] for v in lemmas.values())
hard = [r for r in rows if int(r['estructura_min'][5:]) > r[col_nivel]]
random.seed(20261028)
with open(out / f'{lang}-infantil.revision-muestra.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['lema', 'categoria', col_nivel, 'fuente', 'correcto (sí/no)', 'nivel correcto'])
    for (l, c), v in sorted(random.sample(sorted(lemmas.items()), 300), key=lambda x: (x[1]['nivel'], x[0])):
        wr.writerow([l, c, v['nivel'], v['fuente'], '', ''])
with open(out / f'{lang}-infantil.revision-lemas.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['lema', 'categoria', col_nivel, 'fuente', 'nota'])
    for (l, c), v in sorted(lemmas.items(), key=lambda x: (x[1]['nivel'], x[0])): wr.writerow([l, c, v['nivel'], v['fuente'], v['nota']])
with open(out / f'{lang}-infantil.revision-estructura.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['forma', 'lema', col_nivel + '_vocabulari', 'estructura_min', 'motiu'])
    for r in hard: wr.writerow([r['forma'], r['lema'], r[col_nivel], r['estructura_min'], r['estructura_motivo']])
st = {'formas': len(rows), 'formas_por_nivel': dict(sorted(lv_counts.items())), 'acumuladas': [sum(v for k, v in lv_counts.items() if k <= n) for n in (0, 1, 2)],
      'lemas': len(lemmas), 'lemas_por_nivel': dict(sorted(lem_counts.items())), 'fuentes_lema': src, 'difíciles_de_leer': len(hard)}
json.dump(st, open(out / f'stats-{lang}.json', 'w'), ensure_ascii=False, indent=1); print(lang, json.dumps(st, ensure_ascii=False))
