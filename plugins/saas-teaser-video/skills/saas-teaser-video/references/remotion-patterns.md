# Remotion Patterns — SaaS Teaser

Working code patterns. Adapt values, keep structure.

## Preflight — verify + install dependencies

```bash
node -v                      # must be >= 18; if missing: winget install OpenJS.NodeJS.LTS (Windows) / brew install node (macOS)
npm -v                       # comes with Node
```

Existing Remotion project — check what's installed, add what's missing:

```bash
npm ls remotion @remotion/cli @remotion/transitions @remotion/google-fonts
npm i @remotion/transitions @remotion/google-fonts   # install any that showed "empty" / missing
```

Headless browser for rendering (auto-downloads if absent — run once before first render):

```bash
npx remotion browser ensure
```

No ffmpeg install needed — Remotion v4 ships its own. If `node` install requires elevation or fails, tell the user the exact command to run and stop; don't retry blindly.

## Scaffold (no project yet)

```bash
npx create-video@latest teaser --blank
cd teaser
npm i @remotion/google-fonts @remotion/transitions
```

Project layout:

```
src/
  index.ts          # registerRoot
  Root.tsx          # <Composition>
  Teaser.tsx        # TransitionSeries of scenes
  theme.ts          # brand tokens from research — single source of truth
  scenes/
    Hook.tsx  Agitate.tsx  Reveal.tsx  Feature.tsx  Punch.tsx  Cta.tsx
```

## theme.ts — brand tokens (from research, never invented)

```ts
import { loadFont } from '@remotion/google-fonts/Inter';

// loadFont() at module scope — REQUIRED or the render falls back to system serif
const { fontFamily } = loadFont();

export const theme = {
  bg: '#0F0F13',        // extracted from site
  text: '#FFFFFF',
  muted: '#8A8F98',
  accent: '#5E6AD2',    // extracted from site
  fontFamily,
  headline: {
    fontFamily,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1.05,
  } as const,
};
```

If the brand font isn't on Google Fonts, use `@remotion/fonts` `loadFont({ family, url: staticFile('font.woff2') })` with the file in `public/`, or fall back to Inter and say so.

## Spring presets — the whole motion language

```ts
import { spring } from 'remotion';

// SMOOTH — every text/UI entrance. Zero bounce. This IS the Apple feel.
export const SMOOTH = { damping: 200 };

// SNAPPY — logo pop / punch scene ONLY. Slight overshoot. Max once or twice per video.
export const SNAPPY = { damping: 14, stiffness: 160, mass: 0.6 };
```

## Reusable entrance — the one animation primitive

```tsx
// src/scenes/lib.tsx
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SMOOTH } from '../theme';

export const Rise: React.FC<{
  delay?: number;            // frames — stagger siblings by 5–8
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SMOOTH, durationInFrames: 30 });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
```

## A scene

```tsx
// src/scenes/Hook.tsx
import { AbsoluteFill } from 'remotion';
import { theme } from '../theme';
import { Rise } from './lib';

export const Hook: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: theme.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 120,               // safe margins — text never touches edges
    }}
  >
    <Rise>
      <h1 style={{ ...theme.headline, fontSize: 120, color: theme.text, textAlign: 'center', margin: 0 }}>
        Shipping is slow.
      </h1>
    </Rise>
    <Rise delay={8}>
      <p style={{ fontFamily: theme.fontFamily, fontSize: 40, color: theme.muted, marginTop: 24 }}>
        It doesn't have to be.
      </p>
    </Rise>
  </AbsoluteFill>
);
```

No per-scene fade-out code — transitions are owned by `TransitionSeries`.

## Composition + transitions

```tsx
// src/Teaser.tsx
// These import paths are correct for Remotion v4 — do not "fix" them.
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Hook } from './scenes/Hook';
// ...other scenes

const cut = { timing: linearTiming({ durationInFrames: 1 }) };         // hard cut
const xfade = { presentation: fade(), timing: linearTiming({ durationInFrames: 10 }) };

export const Teaser: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={75}><Hook /></TransitionSeries.Sequence>
    <TransitionSeries.Transition {...xfade} />
    <TransitionSeries.Sequence durationInFrames={75}><Agitate /></TransitionSeries.Sequence>
    {/* ... transitions overlap scenes: total = sum(scenes) − sum(transition durations) */}
  </TransitionSeries>
);
```

```tsx
// src/Root.tsx
import { Composition } from 'remotion';
import { Teaser } from './Teaser';

export const RemotionRoot: React.FC = () => (
  <Composition id="Teaser" component={Teaser} durationInFrames={750} fps={30} width={1920} height={1080} />
);
```

`durationInFrames` must equal the TransitionSeries total (scenes minus transition overlaps) — mismatch = frozen tail or cut-off CTA. Compute it, don't eyeball.

## Interpolate — always clamp

```ts
const w = interpolate(frame, [10, 35], [0, 160], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

## Audio slot (default: none)

```tsx
// import { Audio, staticFile } from 'remotion';
// <Audio src={staticFile('music.mp3')} volume={0.8} />   // drop music.mp3 in public/ to enable
```

Tell the user: add a track to `public/music.mp3` and uncomment. Don't fetch or generate music.

## Beat-sync — cuts land on beats

```
framesPerBeat = fps * 60 / BPM        // 30fps @ 120BPM = 15 frames/beat
```

Detect BPM of a supplied track if unknown (ffmpeg installed already):
```bash
ffmpeg -i public/music.mp3 -filter:a ebur128 -f null - 2>&1 | tail -5   # rough check only
# better: ask the user, or use genre default (electronic 120, pop 128, cinematic 90, lo-fi 80)
```

**Grid spacing — the smart-sync rule.** Don't cut on every beat unless energy allows it:

```
minScene = energy minimum scene length (calm 90, upbeat 75, reel 40)
N        = ceil(minScene / framesPerBeat)      // beats to skip between cuts
grid     = N * framesPerBeat                    // every scene duration = multiple of grid
```

Example: calm video (min 90f) + 128BPM track (14.06 f/beat) → N=7 → grid ≈ 98f — cuts every 7th beat, still ON a beat. Reel video (min 40f) + 80BPM lo-fi (22.5 f/beat) → N=2 → grid 45f; if that still drags, subdivide: use half-beats (framesPerBeat/2) as the base unit instead.

Round framesPerBeat to nearest integer per cut and carry the rounding error forward (don't let drift accumulate past ±2 frames over the video — recompute each cut as `Math.round(k * framesPerBeat)` from the origin, not additively).

Genre also shapes the visuals, not just timing: cinematic → longer holds, DriftZoom, fades; electronic → ContrastFlips, WordSlam, hard cuts; pop → WordPop, DotBurst, bright scenes; lo-fi → Rise entrances, soft glow, no slams.

## brand.json — research cache

After Phase 1, write everything extracted to `brand.json` in the project root:

```json
{
  "product": "…", "oneLiner": "…", "icp": "…",
  "tokens": { "bg": "#…", "text": "#…", "accent": "#…", "accentSoft": "#…", "surface": "#…", "font": "Inter" },
  "copy": { "hook": "…", "valueProps": ["…"], "cta": "…" },
  "assets": { "logo": "path", "logoIcon": "path", "screenshots": ["path"] },
  "energy": "upbeat", "music": { "source": "genre|file", "bpm": 120, "grid": 60 }
}
```

On ANY run, check for `brand.json` before researching — if present and the user hasn't pointed at new sources, skip Phase 1 entirely (huge win for 9:16 variants and revision runs).

## UI mockups for feature scenes

Rebuild a simplified product UI in JSX (rounded panel, `#1A1A24`-style surface color derived from brand bg, fake rows/cards) rather than screenshotting — it stays sharp at any scale and animates per-element. If the user supplied real screenshots, use `<Img src={staticFile(...)}>` inside a rounded, shadowed frame.

## Verify + render

```bash
npx remotion studio                                            # interactive preview (NOT `preview` — deprecated)
npx remotion still src/index.ts Teaser out/s1.png --frame=37   # midpoint of scene 1 — repeat per scene
# Read each PNG: font correct? margins safe? colors match brand? nothing clipped?
npx remotion render src/index.ts Teaser out/teaser.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p
```

9:16 variant: second `<Composition>` (1080×1920), same scenes; bump padding, drop fontSize ~20%, stack layouts vertically.

## Determinism rules

- `random('seed-string')` from `remotion`, never `Math.random()` — flickers every frame.
- No `Date.now()`, no `setTimeout`, no CSS `transition`/`animation`, no `requestAnimationFrame`.
- Everything derives from `useCurrentFrame()`.
