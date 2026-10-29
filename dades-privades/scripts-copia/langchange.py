#!/usr/bin/env python3
"""Subplan 06, punto 3: cambio de idioma es -> ca de un alumno nuevo, por la API."""
import json
import sys

sys.path.insert(0, __file__.rsplit('/', 1)[0])
import drive_api as drive  # noqa: E402

JSONAPI = drive.JSONAPI
call = drive.call

htok = drive.holder_token()
name = sys.argv[1] if len(sys.argv) > 1 else 'Prova06'

# 1. Alta (es) dentro del cupo.
existing = [l for l in drive.me(htok)['learners'] if l['display_name'] == name and not l['archived_at']]
if existing:
    learner = existing[0]
    print(f"alumno {name} ya existía: {learner['uuid']} ({learner['langcode']})")
else:
    st, learner = call('POST', '/shine/learners', token=htok, headers={'Content-Type': 'application/json'},
                       body={'display_name': name, 'avatar': 'fox', 'langcode': 'es'})
    assert st == 201, (st, learner)
    learner = learner.get('learner', learner)
    print(f"alta: {st} {learner['display_name']} {learner['langcode']} {learner['uuid']}")

ltok = drive.learner_token(htok, learner['uuid'])
u = learner['uuid']

# 2. Una sesión del bloque inicial en castellano, jugada entera.
st, g = call('POST', '/shine/session/generate', token=ltok)
assert st in (200, 201), (st, g)
session, acts = drive.load_session(ltok, g['session'])
print(f"sesión es: '{g['title']}' {session['attributes']['langcode']} con {len(acts)} actividades: " + ', '.join(a['attributes']['langcode'] for a in acts))
for a in acts:
    drive.play(ltok, u, session, a, easy=True)
    call('POST', '/jsonapi/activityfeedback/activityfeedback', token=ltok, headers=JSONAPI, body={'data': {
        'type': 'activityfeedback--activityfeedback', 'attributes': {'rating': 'easy'},
        'relationships': {'session': {'data': {'type': 'node--session', 'id': session['id']}},
                          'activity': {'data': {'type': a['type'], 'id': a['id']}}}}})
st, c = call('POST', f"/shine/session/{g['session']}/complete", token=ltok)
assert st == 200, (st, c)
print('completada; niveles:', ', '.join(f"{x['area_name'][:12]}={x['level']}/{x['probe_level']}" for x in c['areas']))


def counts(tok):
    out = {}
    for bundle in ['summary3_vertical_text_blink', 'summary_image_position', 'summary_letter_matrix', 'summary_rapid_repetition', 'summary_syllable_order', 'summary_word_split']:
        st, d = call('GET', f'/jsonapi/activitysummary/{bundle}?filter[uid.id]={u}', token=tok, headers=JSONAPI)
        out[bundle] = len(d['data']) if st == 200 else f'HTTP {st}'
    st, d = call('GET', f'/jsonapi/activityfeedback/activityfeedback?filter[uid.id]={u}', token=tok, headers=JSONAPI)
    out['activityfeedback'] = len(d['data']) if st == 200 else f'HTTP {st}'
    st, d = call('GET', f'/jsonapi/node/session?filter[uid.id]={u}', token=tok, headers=JSONAPI)
    out['sesiones visibles'] = len(d['data']) if st == 200 else f'HTTP {st}'
    return out


print('antes del cambio:', json.dumps(counts(ltok)))

# 3. Cambio de idioma: PATCH (solo owner) -> reinicio.
st, p = call('PATCH', f'/shine/learners/{u}', token=htok, headers={'Content-Type': 'application/json'}, body={'langcode': 'ca'})
print(f'PATCH langcode=ca: {st} reset={p.get("reset")} langcode={ (p.get("learner") or p).get("langcode") }')
assert st == 200 and p.get('reset') is True, (st, p)

# 4. El token anterior del alumno ya no vale (gotcha 20).
st, _ = call('GET', '/oauth/userinfo', token=ltok)
print(f'token de alumno anterior tras el cambio: HTTP {st}')
ltok2 = drive.learner_token(htok, u)
st, info = call('GET', '/oauth/userinfo', token=ltok2)
print(f'token nuevo: HTTP {st} name={info.get("name")}')

print('después del cambio:', json.dumps(counts(ltok2)))
st, d = call('GET', f'/jsonapi/userarealevel_log/userarealevel_log?filter[uid.id]={u}&sort=created&page[limit]=50', token=ltok2, headers=JSONAPI)
print('logs de nivel:', ', '.join(x['attributes']['reason'] for x in d['data']))
for n, lv, pl, closed, ev in drive.levels(ltok2, u):
    print(f'  {n[:45]:45} {lv} probe={pl} closed={closed}')
st, me = call('GET', '/shine/me', token=htok)
l = [x for x in me['learners'] if x['uuid'] == u][0]
print(f"/shine/me: langcode={l['langcode']} onboarding={l['onboarding_state']}")

# 5. Siguiente sesión, en catalán.
st, g = call('POST', '/shine/session/generate', token=ltok2)
assert st in (200, 201), (st, g)
session, acts = drive.load_session(ltok2, g['session'])
print(f"sesión tras el cambio: '{g['title']}' {session['attributes']['langcode']} branch={g['branch']} actividades: " + ', '.join(f"{a['attributes'].get('field_activity_code')}({a['attributes']['langcode']})" for a in acts))
assert all(a['attributes']['langcode'] == 'ca' for a in acts)

if '--archive' in sys.argv:
    st, d = call('POST', f'/shine/learners/{u}/archive', token=htok)
    print(f'archivado: {st}')
    st, _ = call('GET', '/oauth/userinfo', token=ltok2)
    print(f'token tras archivar: HTTP {st}')
