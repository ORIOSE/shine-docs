"""Paso 1: formas de wordfreq (es) con lema y categoría de UD AnCora + GSD."""
import re, collections, glob, json, sys
from wordfreq import top_n_list, word_frequency
SRC, N = sys.argv[1], int(sys.argv[2])
OK = re.compile(r"^[a-zñáéíóúü]+$")
MAP = {'NOUN': 'nom', 'VERB': 'verb', 'AUX': 'verb', 'ADJ': 'adj', 'ADV': 'adv', 'DET': 'det',
       'PRON': 'pron', 'ADP': 'prep', 'CCONJ': 'conj', 'SCONJ': 'conj', 'INTJ': 'interj',
       'NUM': 'num', 'PROPN': 'npropi'}
ud = collections.defaultdict(collections.Counter)
for f in sorted(glob.glob(SRC + '/UD_Spanish-*/*.conllu')):
    mwt = None
    for line in open(f, encoding='utf-8'):
        if not line[0].isdigit():
            mwt = None; continue
        c = line.rstrip('\n').split('\t')
        if '.' in c[0]: continue
        if '-' in c[0]:
            a, b = map(int, c[0].split('-')); mwt = [c[1].lower(), a, b, []]; continue
        if mwt and mwt[1] <= int(c[0]) <= mwt[2]:
            mwt[3].append((c[2].lower(), c[3]))
            if int(c[0]) == mwt[2]:
                form, parts = mwt[0], mwt[3]
                head = next((p for p in parts if p[1] in ('VERB', 'AUX')), parts[0])
                if form not in ('al', 'del'):  # contracciones: prep
                    ud[form][(head[0], head[1])] += 1
                else:
                    ud[form][(form, 'ADP')] += 1
                mwt = None
            continue
        if c[3] in MAP:
            ud[c[1].lower()][(c[2].lower(), c[3])] += 1
rows = []
for w in top_n_list('es', N, wordlist='large'):
    if not OK.match(w): continue
    r = {'forma': w, 'frecuencia': round(word_frequency(w, 'es') * 1e6, 2)}
    cats = collections.Counter()
    for (lem, pos), n in ud.get(w, {}).items():
        cats[(lem, MAP[pos])] += n
    if cats:
        (lem, cat), n = cats.most_common(1)[0]
        total = sum(cats.values())
        r.update(lema=lem, categoria=cat, origen='ud', ud_n=total,
                 otras=';'.join(f'{c}:{l}:{k}' for (l, c), k in cats.most_common()[1:4] if c != cat))
    else:
        r.update(lema='', categoria='', origen='pendiente', ud_n=0, otras='')
    rows.append(r)
json.dump(rows, open('base.json', 'w'), ensure_ascii=False)
p = sum(r['origen'] == 'pendiente' for r in rows)
print(len(rows), 'formas;', p, 'sin UD;', sum(1 for r in rows[:20000] if r['origen'] == 'pendiente'), 'sin UD en las 20000 primeras')
print(collections.Counter(r['categoria'] for r in rows if r['categoria']).most_common())
for w in ['hacerlo', 'dime', 'casa', 'como', 'del', 'vosotros', 'coméis', 'sobre', 'bajo', 'madrid', 'jaja']:
    print(w, next((r for r in rows if r['forma'] == w), None))
