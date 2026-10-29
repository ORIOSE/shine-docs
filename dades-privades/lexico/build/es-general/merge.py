"""Paso 3: aplica las revisiones de Opus y escribe es-general.csv y los ficheros de revisión."""
import csv, json, sys, collections, glob, random
CATS = {'nom', 'verb', 'adj', 'adv', 'det', 'pron', 'prep', 'conj', 'interj', 'num', 'npropi'}
MARCAS = {'malsonante', 'americano', 'extranjera'}
ACC = {'corregir', 'completar', 'descartar', 'marcar'}
rows = json.load(open('base.json'))
by = {r['forma']: r for r in rows}
errors, seen = [], {}
for path in sorted(glob.glob('out/out*.tsv')):
    with open(path, encoding='utf-8') as f:
        rd = csv.DictReader(f, delimiter='\t', quoting=csv.QUOTE_NONE)
        for n, e in enumerate(rd, 2):
            e = {k: (v or '').strip() for k, v in e.items() if k}
            w = e.get('forma', '')
            where = f'{path}:{n} {w}'
            if w not in by: errors.append(where + ': forma fuera de la lista'); continue
            if w in seen: errors.append(where + ': repetida (también en ' + seen[w] + ')'); continue
            seen[w] = path
            if e['accion'] not in ACC: errors.append(where + ': acción ' + e['accion']); continue
            if e['accion'] != 'descartar':
                if e['categoria'] not in CATS or not e['lema']: errors.append(where + ': lema o categoría'); continue
                marcas = [m for m in e['marca'].split('+') if m]
                if any(m not in MARCAS for m in marcas): errors.append(where + ': marca ' + e['marca']); continue
            by[w]['revision'] = e
missing = [r['forma'] for r in rows if r['origen'] == 'pendiente' and 'revision' not in r]
print('errores:', len(errors)); [print('  ' + x) for x in errors[:30]]
print('pendientes sin revisar:', len(missing), missing[:20])
if '--write' not in sys.argv: sys.exit()
out, descartes, cambios = [], [], []
for r in rows:
    e = r.get('revision')
    lema, cat, marca, origen = r['lema'], r['categoria'], '', 'ud'
    if e:
        if e['accion'] == 'descartar':
            descartes.append((r, e)); continue
        if (e['lema'], e['categoria']) != (lema, cat):
            cambios.append((r, e))
        lema, cat, marca = e['lema'], e['categoria'], e['marca']
        origen = 'opus' if r['origen'] == 'pendiente' else ('ud+opus' if (e['lema'], e['categoria']) != (r['lema'], r['categoria']) else 'ud')
    out.append({'forma': r['forma'], 'lema': lema, 'categoria': cat, 'frecuencia': r['frecuencia'], 'marca': marca, 'anotacion': origen, 'otras_ud': r['otras'], 'nota': (e or {}).get('nota', '')})
import unicodedata
def plain(w):
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn' or c == '\u0303')
accented = {plain(r['forma']) for r in out if plain(r['forma']) != r['forma']}
keep = []
for r in out:
    if r['categoria'] == 'npropi' and plain(r['forma']) == r['forma'] and r['forma'] in accented:
        descartes.append((by[r['forma']], {'nota': 'sin tilde: nombre propio cuya forma con tilde está en la lista (regla común de la fusión)'}))
    else:
        keep.append(r)
out = keep
for i, r in enumerate(out, 1):
    r['rango'] = i
dest = sys.argv[sys.argv.index('--write') + 1]
cols = ['forma', 'lema', 'categoria', 'frecuencia', 'rango', 'marca', 'anotacion']
with open(dest + '/es-general.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, cols, extrasaction='ignore', lineterminator='\n'); w.writeheader(); w.writerows(out)
with open(dest + '/es-general.revision-descartes.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango_original', 'forma', 'frecuencia', 'motivo'])
    for r, e in sorted(descartes, key=lambda d: rows.index(d[0])): w.writerow([rows.index(r) + 1, r['forma'], r['frecuencia'], e['nota']])
with open(dest + '/es-general.revision-marcas.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango', 'forma', 'lema', 'categoria', 'marca', 'nota'])
    for r in out:
        if r['marca']: w.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['marca'], r['nota']])
with open(dest + '/es-general.revision-cambios.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['forma', 'lema_ud', 'categoria_ud', 'apariciones_ud', 'lema_final', 'categoria_final', 'nota'])
    for r, e in cambios:
        if r['origen'] == 'ud': w.writerow([r['forma'], r['lema'], r['categoria'], r['ud_n'], e['lema'], e['categoria'], e['nota']])
random.seed(20261028)
sample = sorted(random.sample([r for r in out if r['rango'] <= 20000], 300), key=lambda r: r['rango'])
with open(dest + '/es-general.revision-muestra.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango', 'forma', 'lema', 'categoria', 'marca', 'anotacion', 'correcto (sí/no)', 'corrección'])
    for r in sample: w.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['marca'], r['anotacion'], '', ''])
st = {'filas': len(out), 'descartadas': len(descartes), 'cambios_ud': sum(1 for r, e in cambios if r['origen'] == 'ud'),
      'opus': sum(r['anotacion'] == 'opus' for r in out), 'marcas': collections.Counter(m for r in out for m in r['marca'].split('+') if m),
      'categorias': collections.Counter(r['categoria'] for r in out), 'motivos': collections.Counter(e['nota'].split(':')[0].strip().lower()[:30] for _, e in descartes).most_common(12),
      'ultimo_20000': out[19999]['forma'] if len(out) >= 20000 else None,
      'vosotros': [(r['forma'], r['rango']) for r in out if r['forma'] in ('vosotros', 'sois', 'tenéis', 'habéis', 'queréis', 'podéis', 'coméis', 'vais')],
      'sin_tilde_descartadas': sum(1 for _, e in descartes if 'tilde' in e['nota'].lower())}
json.dump(st, open('stats.json', 'w'), ensure_ascii=False, indent=1, default=str); print(json.dumps(st, ensure_ascii=False, default=str, indent=1))
