#!/usr/bin/env python3
"""Recorrido de la FASE 18 (subplan 06) por la API, como usuario normal.

Usa el grant password del titular y el grant shine_learner del alumno, y
juega sesiones completas por JSON:API igual que la app (logs, summary por
actividad, activityfeedback o sessionfeedback, complete).

    drive.py status Pau
    drive.py session Pau --rating easy [--map "Ling=hard,Mem=ok"] [--overall ok]
    drive.py stats Pau
    drive.py learners
"""
import argparse
import json
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = 'https://shine.ddev.site'
CLIENT = 'shine_expo_app'
HOLDER = ('jose@test.com', 'patata')
CTX = ssl.create_default_context()
JSONAPI = {'Accept': 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json'}

# Bundles de seguimiento por tipo de nodo (shine-app/src/lib/activityKinds).
KINDS = {
    'node--activity_blink': ('activitylog--log3_textlistblink', 'activitysummary--summary3_vertical_text_blink', 'activity_blink'),
    'node--activity': ('activitylog--logverticaltext', 'activitysummary--summary_vertical_text', None),
    'node--activity_image_position': ('activitylog--logimageposition', 'activitysummary--summary_image_position', 'image_position'),
    'node--activity_letter_matrix': ('activitylog--loglettermatrix', 'activitysummary--summary_letter_matrix', 'letter_matrix'),
    'node--activity_rapid_repetition': ('activitylog--lograpidrepetition', 'activitysummary--summary_rapid_repetition', 'rapid_repetition'),
    'node--activity_syllable_order': ('activitylog--logsyllableorder', 'activitysummary--summary_syllable_order', 'syllable_order'),
    'node--activity_word_split': ('activitylog--logwordsplit', 'activitysummary--summary_word_split', 'word_split'),
}


def call(method, path, token=None, body=None, headers=None, form=None):
    url = path if path.startswith('http') else BASE + path
    data = None
    h = dict(headers or {})
    if form is not None:
        data = urllib.parse.urlencode(form).encode()
        h['Content-Type'] = 'application/x-www-form-urlencoded'
    elif body is not None:
        data = json.dumps(body).encode()
    if token:
        h['Authorization'] = 'Bearer ' + token
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, context=CTX) as res:
            raw = res.read()
            return res.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw.decode(errors='replace')


def holder_token():
    st, d = call('POST', '/oauth/token', form={
        'grant_type': 'password', 'client_id': CLIENT, 'username': HOLDER[0],
        'password': HOLDER[1], 'scope': 'authenticated_user_access'})
    assert st == 200, (st, d)
    return d['access_token']


def learner_token(htok, learner_uuid):
    st, d = call('POST', '/oauth/token', token=htok, form={
        'grant_type': 'shine_learner', 'client_id': CLIENT, 'learner': learner_uuid,
        'scope': 'authenticated_user_access'})
    assert st == 200, (st, d)
    assert 'refresh_token' not in d, 'el token de alumno no debe llevar refresh'
    return d['access_token']


def me(htok):
    st, d = call('GET', '/shine/me', token=htok)
    assert st == 200, (st, d)
    return d


def find_learner(htok, name):
    for l in me(htok)['learners']:
        if l['display_name'] == name:
            return l
    sys.exit(f'alumno {name} no encontrado')


def strip(html):
    return re.sub(r'<[^>]+>', '', html or '').strip()


def learner_session(ltok, learner):
    """Token, uuid del alumno (sub) y su idioma."""
    st, info = call('GET', '/oauth/userinfo', token=ltok)
    assert st == 200, (st, info)
    assert info['sub'] == learner['uuid'], ('sub no es el uuid del alumno', info['sub'], learner['uuid'])
    return info


def load_session(ltok, uuid):
    st, d = call('GET', f'/jsonapi/node/session/{uuid}?include=field_activities', token=ltok, headers=JSONAPI)
    assert st == 200, (st, d)
    included = {(x['type'], x['id']): x for x in d.get('included', [])}
    acts = []
    for ref in d['data']['relationships']['field_activities']['data']:
        acts.append(included[(ref['type'], ref['id'])])
    return d['data'], acts


def iteration(ltok, my_uuid, summary_type, activity):
    bundle = summary_type.split('--')[1]
    st, d = call('GET', f'/jsonapi/activitysummary/{bundle}?filter[uid.id]={my_uuid}&filter[field_activityid.id]={activity["id"]}&page[limit]=50', token=ltok, headers=JSONAPI)
    assert st == 200, (st, d)
    return len(d['data']) + 1


def entries_for(activity):
    """Tres entradas plausibles por actividad, con el material real cuando es fácil sacarlo."""
    a = activity['attributes']
    items = []
    if activity['type'] in ('node--activity_blink', 'node--activity'):
        items = [strip(x.get('processed') or x.get('value')) for x in (a.get('field_text') or [])][:3]
    if activity['type'] == 'node--activity_rapid_repetition':
        items = list(a.get('field_words') or [])[:3]
    if activity['type'] == 'node--activity_word_split':
        items = list(a.get('field_sentences') or [])[:3]
    if not items:
        items = ['ítem 1', 'ítem 2', 'ítem 3']
    return [(i + 1, it, 1500 + 300 * i) for i, it in enumerate(items)]


def play(ltok, my_uuid, session, activity, easy=True):
    """Logs y summary de una actividad. `easy`: todo correcto (sin freno por aciertos)."""
    log_type, summary_type, act_type = KINDS[activity['type']]
    if act_type is None:
        act_type = activity['attributes'].get('field_activity_format') or 'vertical_list'
    it = iteration(ltok, my_uuid, summary_type, activity)
    title = activity['attributes']['title']
    entries = entries_for(activity)
    rels_common = {
        'field_activityid': {'data': {'type': activity['type'], 'id': activity['id']}},
        'field_sessionid': {'data': {'type': 'node--session', 'id': session['id']}},
    }
    log_ids = []
    correct_total = 0
    for weight, item, ms in entries:
        correct = easy or weight != 2
        attrs = {
            'label': f'{title} - {item[:30]}', 'field_item': item, 'field_weight': weight,
            'field_time': ms, 'field_iteration': it, 'field_activity_type': act_type,
        }
        if activity['type'] == 'node--activity_image_position':
            attrs.update({'field_answer': weight if correct else weight + 1, 'field_correct': correct})
        elif activity['type'] == 'node--activity_letter_matrix':
            attrs.update({'field_correct': correct, 'field_correct_count': 4 if correct else 2, 'field_items_count': 4})
        elif activity['type'] == 'node--activity_rapid_repetition':
            attrs.update({'field_repetitions': 9})
        elif activity['type'] in ('node--activity_syllable_order', 'node--activity_word_split'):
            attrs.update({'field_correct': correct, 'field_attempts': 1 if correct else 2})
        correct_total += 1 if correct else 0
        st, d = call('POST', f'/jsonapi/activitylog/{log_type.split("--")[1]}', token=ltok, headers=JSONAPI,
                     body={'data': {'type': log_type, 'attributes': attrs, 'relationships': rels_common}})
        assert st == 201, (st, json.dumps(d)[:600])
        log_ids.append(d['data']['id'])
    sattrs = {'label': f'{title} - intento {it}', 'field_time': sum(e[2] for e in entries), 'field_iteration': it}
    n = len(entries)
    if activity['type'] == 'node--activity_image_position':
        sattrs.update({'field_correct_count': correct_total, 'field_items_count': n})
    elif activity['type'] == 'node--activity_letter_matrix':
        sattrs.update({'field_correct_count': 4 * n if easy else 4 * n - 2, 'field_items_count': 4 * n, 'field_false_marks': 0 if easy else 1})
    elif activity['type'] == 'node--activity_rapid_repetition':
        sattrs.update({'field_repetitions': 9 * n})
    elif activity['type'] in ('node--activity_syllable_order', 'node--activity_word_split'):
        sattrs.update({'field_correct_count': correct_total, 'field_items_count': n})
    rels = dict(rels_common)
    rels['field_activitylogs'] = {'data': [{'type': log_type, 'id': i} for i in log_ids]}
    area = (activity.get('relationships', {}).get('field_main_area', {}) or {}).get('data')
    if area:
        rels['field_main_area'] = {'data': {'type': 'taxonomy_term--areas', 'id': area['id']}}
    levels = (activity.get('relationships', {}).get('field_activity_level', {}) or {}).get('data') or []
    if levels:
        rels['field_activity_level'] = {'data': [{'type': 'taxonomy_term--activity_level', 'id': l['id']} for l in levels]}
    st, d = call('POST', f'/jsonapi/activitysummary/{summary_type.split("--")[1]}', token=ltok, headers=JSONAPI,
                 body={'data': {'type': summary_type, 'attributes': sattrs, 'relationships': rels}})
    assert st == 201, (st, json.dumps(d)[:800])
    return d['data']['id'], it


def area_names(ltok, lang):
    prefix = '/ca' if lang == 'ca' else ''
    st, d = call('GET', f'{prefix}/jsonapi/taxonomy_term/areas', token=ltok, headers=JSONAPI)
    assert st == 200, (st, d)
    return {x['id']: (x['attributes']['name'], x['attributes']['langcode']) for x in d['data']}


def cmd_learners(args):
    htok = holder_token()
    for l in me(htok)['learners']:
        print(f"{l['display_name']:8} {l['langcode']} {l['onboarding_state']:10} archived={l['archived_at']} {l['uuid']}")


def levels(ltok, my_uuid):
    st, d = call('GET', f'/jsonapi/userarealevel/userarealevel?filter[uid.id]={my_uuid}&include=area,level,probe_level', token=ltok, headers=JSONAPI)
    assert st == 200, (st, d)
    inc = {(x['type'], x['id']): x for x in d.get('included', [])}
    out = []
    for row in d['data']:
        r = row['relationships']
        name = inc[('taxonomy_term--areas', r['area']['data']['id'])]['attributes']['name']
        lv = r['level']['data'] and inc[('taxonomy_term--activity_level', r['level']['data']['id'])]['attributes']['name']
        pl = r.get('probe_level', {}).get('data') and inc[('taxonomy_term--activity_level', r['probe_level']['data']['id'])]['attributes']['name']
        out.append((name, lv, pl, row['attributes'].get('closed'), row['attributes'].get('evidence')))
    return out


def cmd_status(args):
    htok = holder_token()
    learner = find_learner(htok, args.learner)
    ltok = learner_token(htok, learner['uuid'])
    info = learner_session(ltok, learner)
    print(f"{learner['display_name']} ({learner['langcode']}) onboarding={learner['onboarding_state']} sub={info['sub']} name={info.get('name')}")
    for name, lv, pl, closed, ev in levels(ltok, learner['uuid']):
        print(f'  {name[:45]:45} {lv} probe={pl} closed={closed} evidence={ev}')
    st, d = call('GET', f'/jsonapi/node/session?filter[uid.id]={learner["uuid"]}&sort=-created&page[limit]=50', token=ltok, headers=JSONAPI)
    for s in d['data']:
        a = s['attributes']
        print(f"  sesión {a['drupal_internal__nid']} {a['langcode']} {a['field_session_kind']}/{a.get('field_evaluation_reason')} completed={'sí' if a.get('field_completed_at') else 'no'} '{a['title']}'")
    # Las rutas de cuenta deben dar 403 al token de alumno.
    st, _ = call('GET', '/shine/me', token=ltok)
    print(f'  /shine/me con token de alumno: {st}')


def cmd_session(args):
    htok = holder_token()
    learner = find_learner(htok, args.learner)
    lang = learner['langcode']
    ltok = learner_token(htok, learner['uuid'])
    learner_session(ltok, learner)
    st, g = call('POST', '/shine/session/generate', token=ltok)
    if st not in (200, 201):
        print(f'generate: {st} {json.dumps(g, ensure_ascii=False)}')
        return
    print(f"generate {st}: '{g['title']}' kind={g['kind']} reason={g['reason']} branch={g['branch']} created={g['created']} activities={len(g['activities'])}")
    session, acts = load_session(ltok, g['session'])
    assert session['attributes']['langcode'] == lang, ('sesión en otro idioma', session['attributes']['langcode'])
    areas = area_names(ltok, lang)
    rating_map = {}
    for part in filter(None, (args.map or '').split(',')):
        k, v = part.split('=')
        rating_map[k.strip().lower()] = v.strip()
    for a in acts:
        attrs = a['attributes']
        area = (a['relationships'].get('field_main_area', {}) or {}).get('data')
        aname = areas[area['id']][0] if area else '-'
        lv = [l['id'] for l in (a['relationships'].get('field_activity_level', {}) or {}).get('data') or []]
        assert attrs['langcode'] == lang, (f"actividad en otro idioma: {attrs['title']} {attrs['langcode']}")
        rating = args.rating
        for key, val in rating_map.items():
            if aname.lower().startswith(key):
                rating = val
        easy = rating != 'hard'
        sid, it = play(ltok, learner['uuid'], session, a, easy=easy)
        line = f"  {a['type'][6:]:26} {attrs.get('field_activity_code') or '':22} '{attrs['title']}' [{aname}] it={it} summary ok"
        if g['kind'] == 'evaluation':
            st, d = call('POST', '/jsonapi/activityfeedback/activityfeedback', token=ltok, headers=JSONAPI, body={'data': {
                'type': 'activityfeedback--activityfeedback', 'attributes': {'rating': rating},
                'relationships': {'session': {'data': {'type': 'node--session', 'id': session['id']}},
                                  'activity': {'data': {'type': a['type'], 'id': a['id']}}}}})
            assert st == 201, (st, json.dumps(d)[:500])
            line += f' rating={rating}'
        print(line)
    if g['kind'] == 'regular':
        body = {'data': {'type': 'sessionfeedback--sessionfeedback', 'attributes': {'overall': args.overall},
                         'relationships': {'session': {'data': {'type': 'node--session', 'id': session['id']}},
                                           'easiest_activity': {'data': {'type': acts[0]['type'], 'id': acts[0]['id']}},
                                           'hardest_activity': {'data': {'type': acts[-1]['type'], 'id': acts[-1]['id']}}}}}
        st, d = call('POST', '/jsonapi/sessionfeedback/sessionfeedback', token=ltok, headers=JSONAPI, body=body)
        assert st == 201, (st, json.dumps(d)[:500])
        print(f"  sessionfeedback overall={args.overall} easiest='{acts[0]['attributes']['title']}' hardest='{acts[-1]['attributes']['title']}'")
    st, c = call('POST', f"/shine/session/{g['session']}/complete", token=ltok)
    assert st == 200, (st, c)
    print(f"complete: onboarding={c['onboarding_state']} already={c['already_completed']}")
    for ch in c['level_changes']:
        print(f"  cambio: {ch['area_name']} {ch['from']} -> {ch['to']} ({ch['reason']})")
    for ar in c['areas']:
        print(f"  {ar['area_name'][:45]:45} level={ar['level']} probe={ar['probe_level']} closed={ar['closed']} evidence={ar['evidence']}")


def cmd_stats(args):
    htok = holder_token()
    learner = find_learner(htok, args.learner)
    ltok = learner_token(htok, learner['uuid'])
    u = learner['uuid']
    total = 0
    langs = set()
    for bundle in ['summary3_vertical_text_blink', 'summary_vertical_text', 'summary_image_position', 'summary_letter_matrix', 'summary_rapid_repetition', 'summary_syllable_order', 'summary_word_split']:
        st, d = call('GET', f'/jsonapi/activitysummary/{bundle}?filter[uid.id]={u}&include=field_activityid&page[limit]=50', token=ltok, headers=JSONAPI)
        assert st == 200, (st, bundle, d)
        n = len(d['data'])
        total += n
        for inc in d.get('included', []):
            langs.add(inc['attributes'].get('langcode'))
        if n:
            print(f'  {bundle}: {n}')
    print(f'summaries: {total}; idiomas de sus actividades: {sorted(langs)}')
    st, d = call('GET', f'/jsonapi/sessionfeedback/sessionfeedback?filter[uid.id]={u}&include=easiest_activity.field_main_area,hardest_activity.field_main_area', token=ltok, headers=JSONAPI)
    print(f'sessionfeedback: {len(d["data"])}')
    st, d = call('GET', f'/jsonapi/activityfeedback/activityfeedback?filter[uid.id]={u}&page[limit]=50', token=ltok, headers=JSONAPI)
    print(f'activityfeedback: {len(d["data"])}')
    st, d = call('GET', f'/jsonapi/userarealevel_log/userarealevel_log?filter[uid.id]={u}&sort=created&page[limit]=50', token=ltok, headers=JSONAPI)
    print(f'userarealevel_log: {len(d["data"])}: ' + ', '.join(x['attributes']['reason'] for x in d['data']))
    for name, lv, pl, closed, ev in levels(ltok, u):
        print(f'  {name[:45]:45} {lv}')


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('learners').set_defaults(fn=cmd_learners)
    s = sub.add_parser('status'); s.add_argument('learner'); s.set_defaults(fn=cmd_status)
    s = sub.add_parser('session'); s.add_argument('learner'); s.add_argument('--rating', default='easy'); s.add_argument('--map', default=''); s.add_argument('--overall', default='ok'); s.set_defaults(fn=cmd_session)
    s = sub.add_parser('stats'); s.add_argument('learner'); s.set_defaults(fn=cmd_stats)
    a = p.parse_args()
    a.fn(a)
