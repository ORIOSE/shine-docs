"""E02, paso 1: formas catalanas de wordfreq normalizadas a la norma IEC 2017, con lema y categoría de UD
AnCora catalán (anotación manual) o, si falta, del diccionario de Softcatalà (LanguageTool)."""
import collections, glob, json, re, sys
from pathlib import Path
from wordfreq import top_n_list, word_frequency
SRC = Path(sys.argv[1]); N = int(sys.argv[2])
DT = SRC / 'catalan-dict-tools'
OK = re.compile(r"^[a-zàèéíïòóúüç·]+$")
ELIDED = {'l': ("l'", 'el', 'det'), 'd': ("d'", 'de', 'prep'), 'm': ("m'", 'em', 'pron'), 'n': ("n'", 'en', 'pron'),
          's': ("s'", 'es', 'pron'), 't': ("t'", 'et', 'pron')}
ENCL = {"m": "'m", "t": "'t", "l": "'l", "ls": "'ls", "n": "'n", "ns": "'ns", "s": "'s", "hi": "'hi", "ho": "'ho", "en": "'en", "us": "'us"}
MAP_UD = {'NOUN': 'nom', 'VERB': 'verb', 'AUX': 'verb', 'ADJ': 'adj', 'ADV': 'adv', 'DET': 'det', 'PRON': 'pron',
          'ADP': 'prep', 'CCONJ': 'conj', 'SCONJ': 'conj', 'INTJ': 'interj', 'NUM': 'num', 'PROPN': 'npropi'}
def map_lt(tag):
    if tag.startswith('NP'): return 'npropi'
    if tag.startswith('DN') or tag.startswith('Z'): return 'num'
    return {'N': 'nom', 'V': 'verb', 'A': 'adj', 'R': 'adv', 'D': 'det', 'P': 'pron', 'S': 'prep', 'C': 'conj', 'I': 'interj'}.get(tag[:1])

# Diacríticos antiguos (anteriores a la norma del IEC de 2017) -> forma actual, según Softcatalà.
old = {}
sec = None
for line in open(DT / 'resultats/diacritics-classificats.txt', encoding='utf-8'):
    line = line.strip()
    if line.startswith('*'):
        sec = line; continue
    if not line or sec is None or 'conserven' in sec or 'topònim' in sec or 'Descartats' in sec or 'Problemes' in sec:
        continue
    w = line.split()[0].split(',')[0].lower()
    if w in ('sóc', 'só'): continue   # sóc se conserva; só es dialectal
    plain = w.translate(str.maketrans('éèóòí', 'eeooi'))
    if plain != w: old[w] = plain

# Diccionario de Softcatalà: forma -> [(lema, categoria)]
lt = collections.defaultdict(set)
for line in open(DT / 'resultats/lt/diccionari.txt', encoding='utf-8'):
    p = line.rstrip('\n').split(' ')
    if len(p) == 3:
        k = map_lt(p[2])
        if k: lt[p[0].lower()].add((p[1].lower(), k))
lemfreq = collections.Counter()
for line in open(DT / 'frequencies/frequencies-dict-lemmas.txt', encoding='utf-8'):
    w, _, n = line.rpartition(', ')
    if n.strip().isdigit(): lemfreq[w.lower()] += int(n)
scfreq = collections.Counter()
for line in open(DT / 'frequencies/frequencies-dict-forms.txt', encoding='utf-8'):
    w, _, n = line.rpartition(', ')
    if n.strip().isdigit(): scfreq[w.lower()] += int(n)
sc_total = sum(scfreq.values())

# UD AnCora catalán: forma -> Counter((lema, categoria))
ud = collections.defaultdict(collections.Counter)
for f in glob.glob(str(SRC / 'UD_Catalan-AnCora/*.conllu')):
    for line in open(f, encoding='utf-8'):
        if not line[:1].isdigit(): continue
        c = line.rstrip('\n').split('\t')
        if '-' in c[0] or '.' in c[0] or c[3] not in MAP_UD: continue
        ud[c[1].lower()][(c[2].lower(), MAP_UD[c[3]])] += 1

freq = collections.Counter(); merged = collections.defaultdict(list)
for w in top_n_list('ca', N, wordlist='large'):
    f = word_frequency(w, 'ca') * 1e6
    w = w.replace('l.l', 'l·l').replace('ŀl', 'l·l')
    if "'" in w or '’' in w:                       # enclítico pegado: dona'm -> dona + 'm
        base, _, cl = w.replace('’', "'").partition("'")
        if OK.match(base) and cl in ENCL:
            freq[base] += f; merged[base].append(w); freq[ENCL[cl]] += f
        continue
    if w in ELIDED:
        freq[ELIDED[w][0]] += f; continue
    if not OK.match(w): continue
    if w in old:
        merged[old[w]].append(w); w = old[w]
    freq[w] += f
rows = []
for w, f in sorted(freq.items(), key=lambda x: -x[1]):
    r = {'forma': w, 'frecuencia': round(f, 3), 'fusionadas': ' '.join(sorted(set(merged.get(w, [])))),
         'en_diccionari': 'sí' if (w in lt or w.strip("'") in ELIDED or w in ENCL.values()) else 'no',
         'frecuencia_softcatala': round(scfreq[w] / sc_total * 1e6, 3) if scfreq[w] else ''}
    key = w
    if w.endswith("'") and w[:-1] in ELIDED:
        r.update(lema=ELIDED[w[:-1]][1], categoria=ELIDED[w[:-1]][2], origen='regla', ud_n=0, otras=''); rows.append(r); continue
    cats = ud.get(key)
    if cats:
        (lem, cat), n = cats.most_common(1)[0]
        r.update(lema=lem, categoria=cat, origen='ud', ud_n=sum(cats.values()),
                 otras=';'.join(f'{c}:{l}:{k}' for (l, c), k in cats.most_common()[1:4] if c != cat))
    elif w in lt:
        opts = sorted(lt[w], key=lambda lc: -lemfreq[lc[0]])
        r.update(lema=opts[0][0], categoria=opts[0][1], origen='diccionari', ud_n=0,
                 otras=';'.join(f'{c}:{l}' for l, c in opts[1:4]))
    else:
        r.update(lema='', categoria='', origen='pendiente', ud_n=0, otras='')
    rows.append(r)
json.dump(rows, open('base.json', 'w'), ensure_ascii=False)
c = collections.Counter(r['origen'] for r in rows)
print(len(rows), c, 'fuera de diccionario:', sum(r['en_diccionari'] == 'no' for r in rows))
print('top20000:', collections.Counter(r['origen'] for r in rows[:20000]))
for w in ["de", "l'", "d'", "dona", "venen", "fora", "col·legi", "casa", "menjàvem", "bueno", "xiquet", "'m", "sóc", "és"]:
    x = next((r for r in rows if r['forma'] == w), None); print(w, x and {k: x[k] for k in ('frecuencia', 'lema', 'categoria', 'origen', 'fusionadas', 'en_diccionari')})
print('rang de 20000:', rows[19999]['forma'], rows[19999]['frecuencia'])
