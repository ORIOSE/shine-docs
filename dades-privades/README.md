# Dades privades del projecte

Ús intern. Aquesta carpeta és al git de docs (repositori privat) i **no es redistribueix**. Es va
crear el 2026-10-29 per tenir sota control de versions el que abans només era a la màquina, dins de
carpetes de `shine/` ignorades pel git de Drupal.

| Carpeta | Què hi ha | Adreça antiga (ara és un enllaç simbòlic cap aquí) |
|---|---|---|
| `lexico/` | Llistes de freqüència generals i infantils, el build, les revisions i les fonts amb llicència | `shine/private/lexico/` |
| `enviaments/` | Paquets enviats al grup d'experts i les seves respostes | `shine/private/enviament-*` |
| `imatges-revisio/` | Zona de treball del generador d'imatges (candidates, fulls de contactes, prompts, `resumen.md`) | `shine/content/images/_revision/` |
| `scripts-copia/` | **Còpia** dels scripts temporals de `shine/private/scripts/` | (l'original es queda on és: s'executa dins de ddev i un enllaç no funciona al contenidor) |

Fora de git, a propòsit:

- `lexico/fuentes/frecuencia_elementos_corpes_1_5.txt` (130 MB, més que el límit de 100 MB de GitHub).
  Es torna a descarregar de la RAE (CORPES XXI, llistat de freqüències 1.5; vegeu
  `docs/fuentes-de-datos.md` §1.1) i es desa en aquesta mateixa ruta.
- `shine/private/oauth-keys/`, `settings.php` i les còpies de base de dades de `.ddev/`: claus i
  contrasenyes, mai a git.

Els enllaços es van crear des de l'arrel del projecte. En un ordinador nou, després de clonar els tres
repositoris:

```bash
ln -s ../../dades-privades/lexico shine/private/lexico
for e in dades-privades/enviaments/enviament-*; do ln -s ../../$e shine/private/$(basename $e); done
ln -s ../../../dades-privades/imatges-revisio shine/content/images/_revision
mkdir -p shine/private/scripts && cp dades-privades/scripts-copia/* shine/private/scripts/
```
