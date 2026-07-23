---
name: saas-teaser-video
description: Use when the user provides a website URL, frontend code, or product description and wants a teaser, promo, launch, demo, or product video for a SaaS product — keywords teaser video, launch video, promo video, product video, Remotion, motion graphics, "make a video for my site/app".
---

# SaaS Teaser Video (Remotion)

## Overview

Produce a short (20–25s), catchy, upbeat, Apple-like teaser video for a SaaS product using Remotion. The pipeline is: **Research → Creative brief → Storyboard → Build → Verify → Render.** Never skip research; never animate before the brief exists.

Core principle: **restraint reads as premium.** One idea per scene, huge type, real brand tokens, no gimmicks.

## Model split (when dispatching subagents)

Taste work goes to Opus; mechanical work goes to Sonnet.

| Phase | Model | Why |
|-------|-------|-----|
| 1–3: Research, ICP, creative brief, storyboard, copy, color/typography choices, scene flow | `opus` | Judgment and taste — the video is only as good as this |
| 4: Writing scene components from the approved storyboard | `sonnet` | Mechanical translation of a precise spec |
| 5–6: Stills, checks, render | `sonnet` | Execution |

If working inline (no subagents), the same order holds: finish the entire creative brief + storyboard before any code, and treat the storyboard as a frozen spec while coding. If a scene "feels wrong" during build, go back to the storyboard step — don't improvise motion at code time.

## Phase 1 — Research (mandatory, before any code)

Never invent brand facts. Extract them.

**Zeroth: check for `brand.json`** in the working folder — a previous run's research cache (schema in `references/remotion-patterns.md`). If present and the user hasn't pointed at new sources, load it and skip the rest of Phase 1.

**First: read `references/learnings.md`** and apply every `promoted` entry as a hard rule; treat `candidate` entries as strong defaults. This is how the skill improves over time — skipping it repeats past mistakes.

**Then: ask what source material exists** (interactive runs only — batch this with any Phase 2.5 questions if you prefer one round, but ask BEFORE fetching the site so you research the best source, not the first one):
- **Frontend code:** is the site's/app's repo available locally or cloneable? Code beats a WebFetch — exact tokens, real component structure, logo SVG in `public/`. If yes, get the path and research from code first.
- **Media kit / brand assets:** does a media kit, brand folder, or design-system doc exist (logo SVGs, wordmark, brand hex palette, font files, product screenshots)? If yes, get the path/URL and treat it as the canonical source for logo + colors — use real assets in the video instead of rebuilding them in JSX.

- **Reference videos:** any teaser/ad videos the user wants the vibe of (multiple fine — local files or YouTube links)? If yes, run the reference-analysis pipeline below BEFORE the storyboard so its lessons feed scene flow, pacing, and type scale.

If the user says any of these exist, look ONLY in the current working folder (one `ls`/glob — never a disk-wide search; that burns tokens). Not there → immediately ask for its location — git URL to clone, folder path, or a link (Drive/Notion/zip/YouTube) — for the code, the media kit, and any reference videos. Don't silently fall back to URL research when the user said better sources exist.

### Reference video analysis (when references given)

Videos can't be watched natively — sample smart, not dense:

1. **Get the file:** local path as-is; YouTube → `yt-dlp -f "best[height<=720]" <url> -o ref.mp4` (install via `winget install yt-dlp` / `brew install yt-dlp` if missing). 720p is plenty for style study.
2. **Scene-detect, don't blind-sample:** `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.25)',showinfo" -vsync vfr shots_%02d.png` — keeps a frame only at >25% pixel change = shot boundaries. A 35s ad collapses to ~10-12 unique shots instead of 100s of near-dupe frames. Also grab frame 0 (`-vf "select='eq(n,0)'"`). Use system ffmpeg or `npx remotion ffmpeg` (bundled with Remotion v4). Threshold tune: too few shots → drop to 0.2; too many → raise to 0.35.
3. **Read the shot PNGs** (each frame ≈ 1k tokens — deduped shots keep this cheap; never view raw fps-sampled frames in bulk). Extract per reference: shot count + video length (= pacing), type scale relative to frame, palette discipline, layout patterns (centered vs split), transition style (cut/fade/slide), how product UI is framed.
4. **Distill into the brief:** 3-5 bullet "reference lessons" shown to the user. These shape storyboard rhythm and motion choices; brand tokens still come ONLY from the product's site/code/media kit — references lend structure, never colors or logos.

If the user has neither (or the run is autonomous), fall back to URL research below — don't block.

**Given a URL:** WebFetch the homepage (plus /pricing or /about if the homepage is thin). Extract:
- Product one-liner (what it does, in their words)
- Top 3 value props / features they lead with
- Exact hex colors (background, text, accent), font family, logo
- Tone: dev-tool dark? consumer light? enterprise trust?

**Given frontend code:** grep `tailwind.config.*` / CSS custom properties / theme files for colors, font imports (`@fontsource`, Google Fonts links, `next/font`) for typography, and `public/` for the logo SVG. Code is ground truth — prefer it over guesses.

**ICP:** Infer who buys (role, seniority, pain). The ICP drives visuals — see the mapping table in `references/scene-library.md`. A video for engineers and a video for HR managers must not look the same.

## Phase 2 — Creative brief

Write a brief (show it to the user in your response) before touching code:

```
Product:      <one-liner>
ICP:          <role + pain>
Hook:         <the one sentence that makes the ICP stop scrolling>
Value props:  <max 3>
Brand tokens: bg #..., text #..., accent #..., font <name>
Tone:         <e.g. "dark, engineered, confident — no hype">
Energy:       calm | upbeat | reel  (from questionnaire — drives pacing, springs, effects)
Format:       1920x1080 @30fps (default; 1080x1920 if user wants Shorts/Reels)
Duration:     20–25s → net 600–750 frames AFTER transition overlaps
Music:        <file+BPM | genre+assumed BPM | none> → beat grid: <N> frames/cut (see beat-sync)
```

After research, cache everything extracted into `brand.json` in the project root (tokens, copy lines, ICP, asset paths, energy, beat grid). Re-runs and format variants (9:16) read the cache and skip research entirely — check for `brand.json` FIRST on any run.

Defaults when user is silent: 16:9, 30fps, ~25s, no music. State the defaults; don't block on questions.

## Phase 2.5 — Cross-question the user (only when real questions exist)

After drafting the brief, before the storyboard: list unknowns that would actually change the video. If none — proceed on defaults. If some — ask **once, batched** (use AskUserQuestion when interactive; no cap on question count — one round of friction is fine when it buys a better video; AskUserQuestion takes 4 per call, so chain calls in the same round if you have more), then freeze answers into the brief.

Question bank (pick only what research couldn't answer). For style questions, always show the CONSEQUENCE in the option description — the user is choosing an outcome, not a label:

- **Channel:** landing-page hero (16:9) vs Reels/Shorts (9:16) vs both?
- **Energy** (always ask unless user already said): how should it feel?
  - `calm` — Apple keynote. 90-frame scenes, fades, Rise entrances, zero overshoot. *Example: headline fades up, holds 2.5s, cross-fades to next.*
  - `upbeat` — product launch. 75-frame scenes, WordPop cascades, SlideOvershoot panels, 2-3 effect moments. *Example: headline pops in word by word, panel punches in from the right, chips float around it.*
  - `reel` — scroll-stopper. 40-60-frame beats, WordSlam cold open, ContrastFlips, hard cuts, effect moment every scene. *Example: four full-screen words slam in 2 seconds with bg flipping black/white, payoff word explodes with rings.*
- **Density:** minimal (3-4 scenes, one message, more air — *viewer remembers ONE thing*) vs standard (7-10 beats — *full pain→proof→CTA arc*)?
- **Color mode:** light brand bg throughout / dark throughout / mixed with ContrastFlip punch scenes (*mixed = strongest retention, default for upbeat+reel*)?
- **UI proof** (always ask when both screenshots AND frontend code exist — never silently default):
  - `images only` — real screenshots in framed panels. *Authentic, fast, but static: UI can only pan/zoom as a picture; baked-in text untouchable.*
  - `code only` — rebuild the real components in JSX from the frontend repo (extraction + animation recipes: `references/code-to-ui.md`). *Razor sharp at any zoom, per-element animation — table rows cascade in on beats, counters tick up, buttons "click". Feels like watching the product work. Slower to build.*
  - `both` — screenshots for wide establishing panels, JSX rebuilds for the 1-2 scenes where elements should animate individually (dashboard, hero input). *Best result-per-effort; recommended default when code is available.*
  - (no code and no screenshots → type-only beats, calm brand-film style)
- **Assets:** frontend code repo? media kit (logo SVG, brand palette, fonts)? real UI screenshots? (skip if already answered in Phase 1 source ask)
- **References:** teaser/ad videos to emulate (local or YouTube, multiple fine)? → run Phase 1 reference-analysis pipeline before storyboard (skip if already answered in Phase 1 source ask)
- **Emphasis:** which ONE feature must survive the cut, if research surfaced more than 3?
- **Music (always ask, two-step):**
  1. "Do you have a track (.mp3) to use?" If yes → get path + BPM if known (else detect: see beat-sync in `remotion-patterns.md`).
  2. If no → "What kind of music will you add later?" (minimal electronic ~120BPM / upbeat pop ~128BPM / cinematic ~90BPM / lo-fi ~80BPM / none-ever). Even without a file, the genre's BPM sets the beat grid the cuts snap to — so when they drop the track in later, cuts already land on beats. `none-ever` → skip beat grid.
  - **Smart sync rule:** never force visuals to match raw tempo. If music is faster than the chosen energy (e.g. calm video + 128BPM), cut on every 2nd/4th beat (downbeats) — grid spacing = smallest multiple of frames-per-beat ≥ the energy's minimum scene length. If energy is faster than the music, subdivide (cut on half-beats). Genre also nudges visuals: cinematic → longer holds + DriftZoom; electronic → ContrastFlips + WordSlam; lo-fi → soft fades, no slams. Mismatch example: user picks calm + fast electro → keep calm scene lengths but snap every cut to a downbeat, so it feels intentional, not slow.
- **Occasion:** Product Hunt launch / GA / funding? (changes CTA copy)

Rules: never ask what the site or code already answered; never ask taste questions ("what colors do you like?" — that's your job, extract from brand); if the user is unreachable or the run is autonomous, apply defaults and list every assumption in the delivery message. One round of questions max — don't re-open after storyboard freeze.

## Phase 3 — Storyboard

5–7 scenes, **90–105 frames each** (net total after transition overlaps: `sum(scenes) − 10 × (scenes − 1)` — must land in 600–750 and must equal the Composition's `durationInFrames`). Standard arc (adapt, don't copy blindly):

| # | Scene | Frames | Job |
|---|-------|--------|-----|
| 1 | Hook — pain or bold claim | 90 | Stop the scroll |
| 2 | Agitate — the old way | 90 | Make pain concrete |
| 3 | Reveal — logo + product name | 90 | The turn |
| 4–5 | Value beats — one feature each | 105 ea | Prove it (UI mockup or big stat) |
| 6 | Punch — kinetic one-liner | 90 | Emotional peak |
| 7 | CTA — logo, domain, one action | 105 | Close |

Example math: 90+90+90+105+105+90+105 = 675; minus 6 transitions × 10 = **615 net** (~20.5s). ✓ If net falls outside 600–750, adjust scene durations in 15-frame steps (or drop/add a value beat) until it lands.

Copy rules: headlines ≤ 6 words. One idea per scene. No paragraph text ever. Copy formulas per scene type: `references/scene-library.md`.

**Spec motion by name.** Every storyboard row lists its techniques from `references/motion-library.md` (e.g. "Scene 3 Reveal — BurstRing ×2 + Pop headline + Rise sub, DriftZoom 1.07"). Build phase translates names to code mechanically — improvised motion at build time is a red flag. If music/beat grid exists, scene durations must be multiples of the grid spacing.

## Phase 4 — Build (Remotion)

**Preflight first — check deps, install what's missing** (exact commands in `references/remotion-patterns.md`):
1. `node -v` — need ≥ 18. Missing/old → install Node LTS (`winget install OpenJS.NodeJS.LTS` on Windows, `brew install node` on macOS), or if that fails surface the install step to the user and stop.
2. No project yet → scaffold one (`create-video`). Existing Remotion project → check `package.json` for `remotion`, `@remotion/cli`, `@remotion/transitions`, `@remotion/google-fonts`; `npm i` the missing ones.
3. `npx remotion browser ensure` — downloads the headless browser if absent (rendering fails without it). No separate ffmpeg needed — Remotion v4 bundles it.

Don't debug a failed render before confirming preflight passed.

**Scaffold from `templates/` — don't retype boilerplate.** The skill ships battle-tested files: copy `templates/package.json`, `tsconfig.json`, `remotion.config.ts` to the project root; `templates/index.ts`, `Root.tsx` to `src/`; `templates/theme.ts` to `src/`; `templates/lib.tsx` to `src/scenes/`. Then: fill every `#TODO_*` token in theme.ts from brand.json (grep for TODO — none may survive), swap the font import if the brand font isn't Inter, and set `durationInFrames` in Root.tsx to the computed net total. Only scene components and Teaser.tsx are written fresh per project — they're the creative part; the rest is plumbing.

Full code patterns, spring presets, and font loading in `references/remotion-patterns.md`. Motion technique recipes in `references/motion-library.md`. If UI-proof mode is `code only` or `both`, also read `references/code-to-ui.md` — never import app components directly; extract markup/microcopy/tokens and rebuild simplified with per-element animation. Non-negotiables:

- **Load fonts with `@remotion/google-fonts`** (`loadFont()`), never a bare `fontFamily` string — unloaded fonts silently render as system serif in the output file.
- **Frame-based animation only** — `useCurrentFrame()` + `spring()`/`interpolate()`. CSS `transition`/`animation` and `setTimeout` produce broken or nondeterministic renders.
- **Springs: `{damping: 200}`** for all entrances (smooth, zero bounce = Apple). The Remotion default spring is bouncy — never use it bare.
- **Clamp every `interpolate`** (`extrapolateLeft/Right: 'clamp'`).
- **`TransitionSeries`** from `@remotion/transitions` for scene changes — don't hand-write fade-out/fade-in per scene.
- Randomness: `random(seed)` from `remotion`, never `Math.random()` (flickers per frame).

### Motion language (Apple-like)

- Entrances: opacity 0→1 + translateY 40→0, or scale 0.96→1. Nothing else.
- Stagger sibling elements by 5–8 frames.
- Transitions: 10-frame fade is the default between every scene; hard cuts allowed for pace. One slide transition max per video (e.g. into a feature scene) — everything else stays fade/cut.
- Type: 90–140px headlines @1080p, weight 600–700, `letterSpacing: '-0.03em'`, `lineHeight: 1.05`.
- Palette: exactly 3 colors from brand (bg, text, accent) + one derived surface tint for UI panels. Accent = small elements only (logo mark, one connector/underline, CTA line) — never full backgrounds, never headline text; judge by screen area, not scene count.
- **Banned:** letter-by-letter bounce, typewriter cursors, camera shake, scan lines, gloss/shimmer sweeps, glows on everything, rotation entrances, more than one font (single exception: system monospace for code/branch-name props in dev-ICP videos).

## Phase 5 — Verify (before final render)

1. `npx remotion studio` for interactive preview (`preview` command is deprecated).
2. Render a still at each scene's midpoint: `npx remotion still src/index.ts Teaser out/s1.png --frame=<n>` — then **Read the PNGs** and check: correct font actually rendered (not serif fallback), text inside safe margins, brand colors right, nothing clipped.
3. **Draft motion check** (stills miss motion problems — mid-animation overlaps, pacing): render a cheap draft `npx remotion render src/index.ts Teaser out/draft.mp4 --scale=0.5 --crf=30`, then run the same ffmpeg scene-detect used for references on your own draft and Read 4-6 of the detected frames — you're checking element collisions mid-entrance and that cuts land where the storyboard says.
4. Fix, re-still/re-draft, then render the final video.

## Phase 6 — Render

```bash
npx remotion render src/index.ts Teaser out/teaser.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p
```

Deliver path + one-line summary of specs. Offer a 9:16 variant as follow-up.

## Phase 7 — Learn (self-improvement loop)

Whenever the user gives feedback on a delivered video — revision requests, "too slow", "love the ending", changed copy, anything — distill it and append an entry to `references/learnings.md` (format + dedupe rules are in that file). Generalizable lessons only; one-off brand tweaks don't qualify. When the same lesson shows up a second time, promote it: set `Status: promoted` AND edit the matching rule in SKILL.md / scene-library / patterns so the main flow carries it permanently. Silence from the user = no entry; don't invent learnings.

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Skipping research, inventing brand colors | WebFetch the site / grep the code first |
| `fontFamily: 'Inter'` with no `loadFont()` | `@remotion/google-fonts` — see patterns file |
| Default bouncy spring | `config: {damping: 200}` |
| Gimmick effects to feel "dynamic" | Delete them; whitespace + timing carry the energy |
| Same visuals for every ICP | Use ICP→visual mapping in scene-library |
| `npx remotion preview` | `npx remotion studio` |
| Rendering final mp4 without checking stills | Still + Read at each scene midpoint first |
| 15s crammed with 7 ideas | 25s, one idea per scene |

## Red flags — stop and re-read this skill

- You're writing a component but have no creative brief in the conversation
- You typed a hex color that didn't come from the site/code
- Your spring config has `damping` under 100 for a text entrance
- You're about to render the mp4 and haven't looked at a single still
