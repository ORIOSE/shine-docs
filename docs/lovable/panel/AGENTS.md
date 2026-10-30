<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Shine panel
- Frontend-only prototype: all data lives in src/data/mock.ts; no backend (future Drupal theme).
- Reusable UI lives in src/components/shine/ (ui.tsx primitives, DataTable, charts via Recharts only); design tokens only in src/styles.css.
- Demo role + font preference live in src/lib/shine-context.tsx; permission checks go through its `can` helpers.
