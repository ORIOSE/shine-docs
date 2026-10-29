"""E02, paso 3: aplica la revisión Opus y escribe ca-general.csv y los ficheros de revisión."""
import csv, json, sys, collections, glob, random
from pathlib import Path
CATS = {'nom', 'verb', 'adj', 'adv', 'det', 'pron', 'prep', 'conj', 'interj', 'num', 'npropi'}
MARCAS = {'malsonante', 'dialectal', 'extranjera'}
ACC = {'corregir', 'completar', 'descartar', 'marcar', 'fusionar'}
REVIEWED = 36000
rows = json.load(open('base.json'))
for i, r in enumerate(rows, 1): r['rango_base'] = i
by = {r['forma']: r for r in rows}
errors, seen = [], {}
for path in sorted(glob.glob('out/out*.tsv')):
    with open(path, encoding='utf-8') as f:
        for n, e in enumerate(csv.DictReader(f, delimiter='\t', quoting=csv.QUOTE_NONE), 2):
            e = {k: (v or '').strip() for k, v in e.items() if k}
            w = e.get('forma', ''); where = f'{path}:{n} {w}'
            if w not in by: errors.append(where + ': forma fuera de la lista'); continue
            if w in seen: errors.append(where + ': repetida'); continue
            seen[w] = path
            if e.get('accion') not in ACC: errors.append(where + ': acción ' + str(e.get('accion'))); continue
            if e['accion'] in ('corregir', 'completar', 'marcar'):
                if e['categoria'] not in CATS or not e['lema']: errors.append(where + ': lema o categoría'); continue
                if any(m not in MARCAS for m in e['marca'].split('+') if m): errors.append(where + ': marca ' + e['marca']); continue
            if e['accion'] == 'fusionar' and not e['lema']: errors.append(where + ': fusionar sin destino'); continue
            by[w]['revision'] = e
# La norma de 2017 no conserva el diacrítico en compuestos (rodamon, entresol, marededeu): si una
# corrección devuelve el acento a una forma que la conversión automática ya había normalizado, se anula.
TR = str.maketrans('éèóòí', 'eeooi')
for r in rows:
    e = r.get('revision')
    if e and e['accion'] in ('corregir', 'marcar', 'completar') and e['lema'] != r['forma'] and e['lema'].translate(TR) == r['forma'] and r['fusionadas']:
        e['lema'] = r['forma']; e['nota'] = (e.get('nota', '') + ' (acento anulado: norma 2017)').strip()
missing = [r['forma'] for r in rows[:REVIEWED] if r['origen'] == 'pendiente' and 'revision' not in r]
print('errores:', len(errors)); [print('  ' + x) for x in errors[:40]]
print('pendientes sin revisar:', len(missing), missing[:20])
if '--write' not in sys.argv: sys.exit()
dest = Path(sys.argv[sys.argv.index('--write') + 1])
sc = collections.Counter()
for line in open(sys.argv[sys.argv.index('--softcatala') + 1], encoding='utf-8'):
    w, _, n = line.rpartition(', ')
    if n.strip().isdigit(): sc[w.lower()] += int(n)
sc_rank = {w: i for i, (w, _) in enumerate(sorted(sc.items(), key=lambda x: -x[1]), 1)}
# "sóc" no es diacrítico de la norma de 2017 (la lista de 15: bé, déu, és, mà, més, món, pèl, què, sé,
# sí, sòl, són, té, ús, vós): se escribe "soc". Las instrucciones de Opus decían lo contrario.
if 'sóc' in by:
    by['sóc']['revision'] = {'forma': 'sóc', 'accion': 'fusionar', 'lema': 'soc', 'categoria': '', 'marca': '', 'nota': 'diacrític antic (IEC 2017)'}
# fusiones de diacríticos antiguos detectadas por Opus
for r in rows:
    e = r.get('revision')
    if e and e['accion'] == 'fusionar':
        t = by.get(e['lema'])
        if t is not None:
            t['frecuencia'] = round(t['frecuencia'] + r['frecuencia'], 3)
            t['fusionadas'] = (t['fusionadas'] + ' ' + r['forma']).strip()
        else:
            r['forma_destino'] = e['lema']
out, descartes, cambios, fusiones = [], [], [], []
for r in rows:
    e = r.get('revision')
    reviewed = r['rango_base'] <= REVIEWED
    if e and e['accion'] == 'fusionar':
        fusiones.append((r, e))
        if 'forma_destino' not in r: continue
        r['forma'] = r['forma_destino']; e = None
    if e and e['accion'] == 'descartar':
        descartes.append((r, e)); continue
    lema, cat, marca = r['lema'], r['categoria'], ''
    if e:
        if (e['lema'], e['categoria']) != (lema, cat) and r['origen'] != 'pendiente': cambios.append((r, e))
        lema, cat, marca = e['lema'], e['categoria'], e['marca']
    if not reviewed and (r['origen'] == 'pendiente' or r['en_diccionari'] == 'no'):
        descartes.append((r, {'nota': 'sin revisar y fuera del diccionario de Softcatalà'})); continue
    out.append({'forma': r['forma'], 'lema': lema, 'categoria': cat, 'frecuencia': r['frecuencia'], 'marca': marca,
                'anotacion': ('opus' if r['origen'] == 'pendiente' else r['origen'] + ('+opus' if e and e['accion'] == 'corregir' else '')),
                'frecuencia_softcatala': r['frecuencia_softcatala'], 'rango_softcatala': sc_rank.get(r['forma'], ''),
                'fusionadas': r['fusionadas'], 'en_diccionari': r['en_diccionari'], 'revisada': 'sí' if reviewed else 'no',
                'nota': (e or {}).get('nota', '')})
out.sort(key=lambda r: -r['frecuencia'])
for i, r in enumerate(out, 1): r['rango'] = i
cols = ['forma', 'lema', 'categoria', 'frecuencia', 'rango', 'marca', 'anotacion', 'frecuencia_softcatala', 'rango_softcatala', 'fusionadas', 'en_diccionari', 'revisada']
with open(dest / 'ca-general.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, cols, extrasaction='ignore', lineterminator='\n'); w.writeheader(); w.writerows(out)
with open(dest / 'ca-general.revision-descartes.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango_original', 'forma', 'frecuencia', 'motivo'])
    for r, e in sorted(descartes, key=lambda d: d[0]['rango_base']):
        if r['rango_base'] <= REVIEWED: w.writerow([r['rango_base'], r['forma'], r['frecuencia'], e['nota']])
with open(dest / 'ca-general.revision-marcas.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango', 'forma', 'lema', 'categoria', 'marca', 'nota', 'confirmar (sí/no)'])
    for r in out:
        if r['marca']: w.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['marca'], r['nota'], ''])
with open(dest / 'ca-general.revision-cambios.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['forma', 'origen', 'lema_origen', 'categoria_origen', 'lema_final', 'categoria_final', 'nota'])
    for r, e in cambios: w.writerow([r['forma'], r['origen'], r['lema'], r['categoria'], e['lema'], e['categoria'], e['nota']])
with open(dest / 'ca-general.revision-diacritics.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['forma_final', 'formes_antigues_fusionades'])
    for r in out:
        if r['fusionadas']: w.writerow([r['forma'], r['fusionadas']])
random.seed(20261028)
sample = sorted(random.sample([r for r in out if r['rango'] <= 20000], 300), key=lambda r: r['rango'])
with open(dest / 'ca-general.revision-muestra.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['rango', 'forma', 'lema', 'categoria', 'marca', 'anotacion', 'correcto (sí/no)', 'corrección'])
    for r in sample: w.writerow([r['rango'], r['forma'], r['lema'], r['categoria'], r['marca'], r['anotacion'], '', ''])
reasons = collections.Counter()
for r, e in descartes:
    if r['rango_base'] > REVIEWED: continue
    m = e['nota'].lower()
    reasons['castellanisme' if 'castellan' in m else 'errada' if 'errada' in m or 'accent' in m else 'altra llengua' if any(x in m for x in ('castellà', 'anglès', 'francès', 'italià', 'llengua', 'espanyol', 'portuguès', 'occità')) else 'sigla/abreviatura' if any(x in m for x in ('sigla', 'abrevia')) else 'altres'] += 1
st = {'filas': len(out), 'descartes_revisados': sum(1 for r, _ in descartes if r['rango_base'] <= REVIEWED), 'descartes_cola': sum(1 for r, _ in descartes if r['rango_base'] > REVIEWED),
      'motivos': reasons, 'fusiones_opus': len(fusiones), 'con_fusionadas': sum(1 for r in out if r['fusionadas']), 'cambios': len(cambios),
      'marcas': collections.Counter(m for r in out for m in r['marca'].split('+') if m), 'categorias': collections.Counter(r['categoria'] for r in out),
      'opus': sum(r['anotacion'] == 'opus' for r in out), 'forma_20000': out[19999]['forma']}
json.dump(st, open('stats.json', 'w'), ensure_ascii=False, indent=1, default=str); print(json.dumps(st, ensure_ascii=False, default=str))
