# Code → UI rebuild — using the frontend repo effectively in Remotion

For `code only` / `both` UI-proof modes. The goal: scenes that look like the REAL product moving, not a picture of it.

## Rule zero — never import app components

Do NOT import components from the user's repo into the Remotion project. They drag in routers, contexts, data fetching, Tailwind runtime, client hooks — all of which break deterministic rendering (or just don't compile). The repo is a **visual reference**, not a dependency. Read the markup, rebuild simplified.

## What to extract (grep targets)

1. **The target screen's component** — the table/list/form/card you'll show. Note its structure: sidebar? header row? what columns? what's in each row (favicon, title, url, tags, actions)?
2. **Exact microcopy** — JSX string literals: button labels ("Create Link", "Copy & Save"), column headers, placeholder text, empty states. Real microcopy is what makes a rebuild read as authentic.
3. **Design tokens beyond color** — border radius (`rounded-lg` = 8px), shadow classes, row heights, spacing rhythm. Video panels should use the app's radius, not yours.
4. **Inline SVG icons** — copy small SVGs (link icon, chart icon, checkmark) straight into the scene component; they're dependency-free and scale sharp.
5. **Realistic data shapes** — seed/fixture files or the screenshots tell you what real rows look like ("go.linkutm.com/launch · 13 clicks · Jun 11"). Fake data must be plausible — lorem ipsum kills authenticity.

## Tailwind → CSS quick map (common in extracted markup)

| Class | CSS |
|---|---|
| `p-4` / `px-6` | padding 16px / 0 24px |
| `rounded-lg` / `rounded-xl` / `rounded-full` | 8px / 12px / 9999px |
| `text-sm` / `text-xs` | 14px / 12px (SCALE UP ~1.5-2× for video legibility) |
| `shadow-sm` / `shadow-md` | subtle → `0 1px 2px rgba(0,0,0,.05)` — for video use the panel shadow from templates instead |
| `border` | 1px solid theme.border |
| `gap-2` / `gap-4` | 8px / 16px |

## Simplification rules (video ≠ app)

- **Two structure levels max** — e.g. sidebar + content, or header + rows. Never rebuild nav trees, dropdowns, tooltips, modals.
- **Scale text up** — app 13-14px type is unreadable in a video panel; multiply by ~1.5-2× and drop tertiary info.
- **3-4 rows, not 20** — enough to read as a table, few enough to animate individually.
- **Real brand, real copy, fake-but-plausible data.**

## Animating the rebuild — this is the whole point

A JSX rebuild that fades in as one block is a worse screenshot. Per-element motion (names from motion-library.md):

- **Rows cascade:** each row `Rise` or `Pop` staggered 5-8 frames (on beats if grid exists).
- **Counters tick:** spring-driven `Math.round(interpolate(spring(...), [0,1], [0, 13]))` — clicks/stats count up as the row lands.
- **Button "clicks":** `Pop` in, then at the action beat scale dips 1→0.94→1 over 6 frames + pulse ring — reads as a press without a fake cursor.
- **Input types:** `TypeOn` with caret for URL/form fields.
- **Tag chips pop in last** — small delights after the structure lands.
- **No fake mouse cursors** — implied interaction (press dips, focus rings) reads cleaner than a floating pointer.

## When screenshots still win (`both` mode placement)

- Wide establishing shot of the whole app → screenshot with ParallaxPan (rebuild cost too high, motion need low).
- Any scene where ONE element animates individually (dashboard rows, hero input, builder form) → JSX rebuild.
- Extension popups / small cards → rebuild (small scope, big sharpness win).
