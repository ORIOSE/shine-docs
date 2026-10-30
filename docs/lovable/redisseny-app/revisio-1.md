Review round 1. Good work on the session path, the activity steps, the letter tiles with depth, the reading preferences and the per-area colours. Please apply these changes; keep everything else.

## 1. Colour: lighter, fresher, closer to our references

The home screen combines a beige paper background with a near-black brown hero card, brown primary buttons and a red ribbon. The result feels dull and heavy, and the team prefers the freshness of the original green and white. Do not simply go back to the old teal; instead follow what the reference apps do so that every screen feels pleasant:

- Elevate, Duolingo, Duolingo ABC and Brilliant use a **clean white or very light neutral base** (not beige), **one saturated brand colour** for the primary action (Duolingo's green with a darker bottom edge is the closest to Shine), and saturated area or game colours in **large flat blocks**, with dark text only for text.
- Peak uses dark backgrounds, but only as an immersive mode; we already have that in the attention player and it should stay there.

So:
- Base: white surfaces on a very light cool or neutral grey (no beige, no paper yellow). Keep the lined-paper texture only inside the reading card.
- Brand primary: a fresh, saturated **green** (AA with white text, with a darker green bottom edge for the 3D press), used for every primary button and the active state in navigation. Ink colour for text only, never for big blocks or buttons.
- The "Continuar" hero on Inici: a bright block (brand green, or the colour of the area of the next activity), not dark brown.
- The current-session ribbon: use an accent that does not read as error (for example a warm yellow or the brand green). Avoid red in the whole app except system errors; also the stopwatch in "Lectura en veu alta" must not be red or orange-red.
- Make the area colours a bit more vivid in their blocks (player backgrounds, skills map) while keeping AA contrast for text.
- Update the dark tokens accordingly.

## 2. Restore the areas polygon in "El meu progrés"

The radar polygon of the areas is iconic and recognisably ours; it must come back as the hero of the Progrés screen.
- Today the app shows five vertices (Llenguatge i fonologia, Atenció, Memòria de treball, Discriminació visual, Velocitat de processament) because Funcions executives has no activities yet. Draw a **pentagon** with those five, and make the component accept six vertices (hexagon) when Funcions executives has data.
- Redesign it in the new language: each vertex with its area colour and glyph, level 0 to 10 written at the vertex, the filled shape in brand green with transparency, thicker strokes, no grey axis clutter. Keep "Veure les dades en text" (accessible table) under it.
- Keep the area cards with level and trend, but below the polygon, as detail.

## 3. Reading preferences: two additions

- Add a handwriting typeface option: **Playwrite España** (Google Fonts family "Playwrite ES"). The options become Atkinson, Lexend, OpenDyslexic and "Lletra lligada" (Playwrite ES). Load it from Google Fonts and apply it to the text inside the exercises, with the preview card showing it. Increase its line height and size a little so it stays readable.
- Add a toggle button **[Tot en majúscules]**. It makes all text **inside the exercises** (player: words, letters in the matrix, reading paragraph, syllables, stimuli, the target letter in the instruction) display in uppercase. Tutor screens are not affected. The preview card and the quick "Aa" panel in the player must include it too. Store it with the other preferences in the mock state so every player screen respects it.

## 4. Desktop version (app.shine.com)

The same app will be used on desktop by professionals and centres (therapists, teachers) at app.shine.com. Design a responsive layout that uses the screen instead of a stretched phone:

- Remove the fixed phone frame as the only way to see the app. Make the app itself responsive, and turn the floating "Pantalles" switcher into a switcher with a **viewport selector**: Mòbil (390), Tauleta (834) and Escriptori (1280 or full width).
- Breakpoints: below 640 px, the current mobile layout with bottom navigation. From 640 to 1023 px (tablet), two columns where it helps. From 1024 px, a **left sidebar** navigation (Inici, El meu progrés, Alumnes, Configuració, with the active learner and a learner switcher at the top of the sidebar) and the content in a max width of about 1200 px.
- Inici on desktop: the "Continuar" block and the session path on the left column; on the right, the active learner summary (areas polygon small, streak, this week) so the adult sees everything without scrolling.
- Progrés on desktop: polygon and adult summary side by side, area cards in a 3 column grid, charts and history below at full width.
- Professionals work with many learners: on desktop, "Amb qui treballem avui?" becomes a searchable grid or list of learners (show 12 mock learners for this view), with language, last session and next session.
- Player on desktop and tablet: a centred stage of tablet size (max about 820 px wide), larger tiles and text, the action button at the bottom of the stage. Do not stretch the exercises to full width.

## 5. Smaller fixes found in the review

- Recap de sessió, "Què heu fet": every row is an icon inside a pale rounded square, one of the patterns we asked to avoid. Use the area colour strip or the step shape of the session path instead.
- Inici: "2 dies seguits · 31 activitats i 7 min aquesta setmana" mixes serif numbers inside a sentence; it reads oddly. Either keep the numbers in the UI font or give them their own small row.
- The serif "Fraunces" for numbers: keep it only for big standalone numbers (levels, times) if it still fits the fresher palette; otherwise use the UI font in a heavy weight.
- Keep the matrix grid and the "Comprovar" button inside the viewport at 390 x 844 and at 390 x 667.
