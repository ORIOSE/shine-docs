"""E01 v2: CORPES XXI como fuente principal; reaprovecha descartes y marcas de la revisión Opus v1."""
import collections, csv, json, re, sys
from pathlib import Path
SRC = Path(sys.argv[1]); PREV = Path(sys.argv[2]); OUT = Path(sys.argv[3])
MIN_ABS = 100          # 0,22 por millón: corte de ruido
SHARE = 0.10           # categoría secundaria con al menos el 10 % de la forma
OK = re.compile(r"^[a-zñáéíóúü]+$")
SKIP = set('YUJEF')    # puntuación, desconocido, prefijo, raro, extranjero

def cat(tag):
    k = tag[:1]
    if k == 'N': return 'npropi' if tag[3:4] == 'p' else 'nom'
    if k in 'DQWX': return 'pron' if tag[-2:-1] == 'r' else 'det'
    return {'V': 'verb', 'A': 'adj', 'R': 'adv', 'P': 'prep', 'C': 'conj', 'T': 'det', 'L': 'pron',
            'H': 'pron', 'M': 'num', 'I': 'interj'}.get(k)

freq = collections.Counter(); lem = collections.defaultdict(collections.Counter); tags = collections.defaultdict(collections.Counter)
locution = collections.Counter(); loc_cat = collections.defaultdict(collections.Counter)
by_lemma_tag = collections.defaultdict(collections.Counter)   # (lema, etiqueta) -> formas, para el ajuste de vosotros
LOC = {'N': 'nom', 'P': 'prep', 'R': 'adv', 'C': 'conj', 'M': 'num', 'A': 'adj', 'I': 'interj'}
norm_factor = None
with open(SRC, encoding='utf-8') as f:
    for line in f:
        c = line.rstrip('\r\n').split('\t')
        if len(c) != 6 or not c[3].isdigit(): continue
        if norm_factor is None and c[0] == 'de':
            norm_factor = int(c[3]) / float(c[5])        # tokens por millón sin signos ortográficos
        if c[2][:1] in SKIP: continue
        n = int(c[3])
        parts = c[0].lower().split()
        if len(parts) > 1:
            # Elementos de varias palabras: el niño lee cada una, así que su frecuencia se reparte.
            # Tiempos compuestos ("ha sido", lema ser, etiqueta con el participio entre paréntesis):
            # el auxiliar cuenta como haber y el participio como el verbo del lema.
            if not all(OK.match(x) for x in parts): continue
            k0 = c[2][:1]
            if k0 == 'V' and '(' in c[2]:
                for x in parts[:-1]:
                    freq[(x, 'verb')] += n; lem[(x, 'verb')]['haber'] += n; tags[(x, 'verb')][c[2].split('(')[0]] += n
                x = parts[-1]
                freq[(x, 'verb')] += n; lem[(x, 'verb')][c[1].lower()] += n; tags[(x, 'verb')]['V----p0n'] += n
            elif k0 == 'N' and c[2][3:4] == 'p':
                for x in parts:
                    freq[(x, 'npropi')] += n; lem[(x, 'npropi')][x] += n; tags[(x, 'npropi')][c[2]] += n
            else:
                for x in parts:
                    locution[x] += n
                    if k0 in LOC: loc_cat[x][LOC[k0]] += n
            continue
        w = parts[0] if parts else ''
        if not OK.match(w): continue
        k = cat(c[2])
        if not k: continue
        freq[(w, k)] += n; lem[(w, k)][c[1].lower()] += n; tags[(w, k)][c[2]] += n
        if k == 'verb': by_lemma_tag[(c[1].lower(), c[2])][w] += n
# Palabras de locuciones ("sin embargo", "a través de"): su frecuencia va a la categoría principal de
# la forma suelta; si la forma solo existe dentro de locuciones, a la categoría de la locución.
single = collections.defaultdict(collections.Counter)
for (w, k), n in freq.items(): single[w][k] += n
for w, n in locution.items():
    k = single[w].most_common(1)[0][0] if single[w] else (loc_cat[w].most_common(1)[0][0] if loc_cat[w] else None)
    if not k: continue
    freq[(w, k)] += n
    if not lem[(w, k)]: lem[(w, k)][w] += n; tags[(w, k)]['locución'] += n
total = collections.Counter()
for (w, k), n in freq.items(): total[w] += n
forms = sorted((w for w, n in total.items() if n >= MIN_ABS), key=lambda w: (-total[w], w))

# Revisión v1 (wordfreq + UD + Opus): descartes no ortográficos y marcas, por forma.
prev = {r['forma']: r for r in csv.DictReader(open(PREV / 'es-general.v1.csv', encoding='utf-8'))}
disc = {}
for r in csv.DictReader(open(PREV / 'es-general.revision-descartes.v1.csv', encoding='utf-8')):
    m = r['motivo'].lower()
    if not any(x in m for x in ('tilde', 'error', 'ortogr', 'errata')):
        disc[r['forma']] = r['motivo']
reviewed = set(prev) | {r['forma'] for r in csv.DictReader(open(PREV / 'es-general.revision-descartes.v1.csv', encoding='utf-8'))}
# Revisión Opus de las formas del CORPES que la v1 no tenía (v2/out-corpes.tsv).
fix, marks2 = {}, {}
for rev2 in sorted(OUT.glob('out-corpes*.tsv')):
    for r in csv.DictReader(open(rev2, encoding='utf-8'), delimiter='\t', quoting=csv.QUOTE_NONE):
        r = {k: (v or '').strip() for k, v in r.items() if k}
        if r['accion'] == 'descartar':
            disc[r['forma']] = r['nota'] or 'descartada en la revisión v2'
            continue
        if r['accion'] == 'corregir':
            fix[r['forma']] = (r['lema'], r['categoria'])
        if r['marca']:
            marks2[r['forma']] = r['marca']
        reviewed.add(r['forma'])
for chunk in OUT.glob('chunk-corpes*.tsv'):
    reviewed |= {r['forma'] for r in csv.DictReader(open(chunk, encoding='utf-8'), delimiter='\t')}
# SUBTLEX-ESP (CC BY-NC-SA 4.0, no comercial): solo columna de consulta, no entra en el rango.
subtlex = {}
st_path = SRC.parent / 'subtlex-esp' / 'subtlex-esp.tsv'
if st_path.exists():
    for r in csv.DictReader(open(st_path, encoding='utf-8'), delimiter='\t'):
        subtlex[r['forma']] = (r['frecuencia_pm'], r['rango'])
wf_rank = {w: int(r['rango']) for w, r in prev.items()}
wf_freq = {w: r['frecuencia'] for w, r in prev.items()}

rows, dropped, disagree, rank = [], [], [], 0
for w in forms:
    if w in disc:
        dropped.append((w, total[w], disc[w])); continue
    rank += 1

    rows.append((w, rank))
# categorías por forma (índice en una pasada)
by_form = collections.defaultdict(list)
for (w, k), n in freq.items():
    by_form[w].append((k, n))
out = []
for w, rank in rows:
    cs = sorted(by_form[w], key=lambda x: -x[1])
    t = total[w]
    keep = [cs[0]] + [x for x in cs[1:] if x[1] / t >= SHARE]
    p = prev.get(w)
    for i, (k, n) in enumerate(keep):
        lema = lem[(w, k)].most_common(1)[0][0]
        etiqueta = tags[(w, k)].most_common(1)[0][0] if tags[(w, k)] else ''
        if i == 0 and w in fix:
            lema, k = fix[w]
        out.append({'forma': w, 'lema': lema, 'categoria': k,
                    'frecuencia': round(n / norm_factor, 3), 'rango': rank,
                    'marca': marks2.get(w) or (p['marca'] if p else ''), 'etiqueta_font': etiqueta,
                    'frecuencia_wordfreq': wf_freq.get(w, ''), 'rango_wordfreq': wf_rank.get(w, ''),
                    'frecuencia_subtlex': subtlex.get(w, ('', ''))[0], 'rango_subtlex': subtlex.get(w, ('', ''))[1],
                    'revisada': 'sí' if w in reviewed else 'no'})
    if p and rank <= 20000 and p['categoria'] not in {k for k, _ in keep}:
        disagree.append([rank, w, cs[0][0], lem[(w, cs[0][0])].most_common(1)[0][0], round(cs[0][1] / t * 100), p['categoria'], p['lema']])

# Ajuste peninsular (criterio 3 del encargo): el CORPES es en su mayor parte americano y deja las
# formas de vosotros muy abajo (tenéis 10.106, frente a tienen 146). Una forma verbal de segunda
# persona del plural toma el rango de su equivalente de tercera (mismo lema, tiempo y modo), y
# vosotros, vosotras, os y vuestro(s), el de ustedes. El rango original queda en rango_corpes.
rank_of = {}
for r in out: rank_of.setdefault(r['forma'], r['rango'])
best = {}
for (l, tg), fs in by_lemma_tag.items(): best[(l, tg)] = fs.most_common(1)[0][0]
PRON2 = {'vosotros', 'vosotras', 'os', 'vuestro', 'vuestra', 'vuestros', 'vuestras'}
adjusted = {}
for r in out:
    w, tg = r['forma'], r['etiqueta_font']
    target = None
    if r['categoria'] == 'verb' and len(tg) >= 5 and tg[2] == 'p' and tg[4] == '2':
        target = best.get((r['lema'], tg[:4] + '3' + tg[5:]))
    elif w in PRON2:
        target = 'ustedes'
    r['rango_corpes'] = r['rango']
    r['ajuste'] = ''
    if target and target in rank_of and rank_of[target] < rank_of[w]:
        adjusted[w] = (rank_of[target], target)
for r in out:
    if r['forma'] in adjusted:
        r['rango'], target = adjusted[r['forma']]
        r['ajuste'] = 'vosotros: rango de ' + target
cols = ['forma', 'lema', 'categoria', 'frecuencia', 'rango', 'marca', 'etiqueta_font', 'frecuencia_wordfreq', 'rango_wordfreq', 'frecuencia_subtlex', 'rango_subtlex', 'rango_corpes', 'ajuste', 'revisada']
with open(OUT / 'es-general.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.DictWriter(f, cols, lineterminator='\n'); wr.writeheader(); wr.writerows(out)
with open(OUT / 'es-general.revision-descartes.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['forma', 'frecuencia_abs_corpes', 'motivo'])
    for d in sorted(dropped, key=lambda d: -d[1]): wr.writerow(d)
with open(OUT / 'es-general.revision-discrepancias.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['rango', 'forma', 'categoria_corpes', 'lema_corpes', '%_de_la_forma', 'categoria_revision_v1', 'lema_revision_v1'])
    wr.writerows(disagree)
unrev = [(w, r) for w, r in rows if w not in reviewed]
json.dump([w for w, r in unrev if r <= 25000], open(OUT / 'pendientes-revision.json', 'w'), ensure_ascii=False)
print(json.dumps({'ajustes_vosotros': len(adjusted), 'tokens_millon': round(norm_factor), 'formas': len(rows), 'filas': len(out), 'descartadas': len(dropped),
    'discrepancias_20000': len(disagree), 'sin_revisar': len(unrev), 'sin_revisar_25000': sum(1 for _, r in unrev if r <= 25000),
    'sin_revisar_20000': sum(1 for _, r in unrev if r <= 20000), 'categorias': collections.Counter(r['categoria'] for r in out)}, ensure_ascii=False))

import random
random.seed(20261028)
principal = {}
for r in out:
    principal.setdefault(r['forma'], r)
top = [r for r in principal.values() if r['rango'] <= 20000]
with open(OUT / 'es-general.revision-muestra.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['rango', 'forma', 'lema', 'categoria', 'etiqueta_font', 'marca', 'correcto (sí/no)', 'corrección'])
    for r in sorted(random.sample(top, 300), key=lambda r: r['rango']):
        wr.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['etiqueta_font'], r['marca'], '', ''])
with open(OUT / 'es-general.revision-marcas.csv', 'w', newline='', encoding='utf-8') as f:
    wr = csv.writer(f, lineterminator='\n'); wr.writerow(['rango', 'forma', 'lema', 'categoria', 'marca', 'confirmar (sí/no)'])
    for r in sorted(principal.values(), key=lambda r: r['rango']):
        if r['marca']: wr.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['marca'], ''])
