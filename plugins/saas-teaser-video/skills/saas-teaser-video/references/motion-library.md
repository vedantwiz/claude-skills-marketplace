# Motion Library — named techniques, when to use them, code recipes

The storyboard MUST spec each scene using these names (e.g. "Reveal: BurstRing ×2 + LogoPop + Rise sub"). Build phase translates names to code mechanically — no improvising motion at build time. Reference-video analysis should also tag observed shots with these names.

Springs used below (define in theme.ts):
```ts
export const SMOOTH = { damping: 200 };                          // zero bounce
export const POPPY  = { damping: 16, stiffness: 190, mass: 0.7 }; // overshoot
export const SNAPPY = { damping: 14, stiffness: 160, mass: 0.6 }; // logo pop
```

## Text techniques

### WordSlam
**Job:** force read speed, one word at a time filling the screen — viewer's inner monologue syncs to your rhythm. THE reel cold-open.
**Energy:** reel. **Timing:** 10–14 frames per word, 20–26 for the payoff word.
```tsx
// inside a <Sequence> per word; p = spring(POPPY, dur 9)
transform: `scale(${interpolate(p,[0,1],[1.7,1]) * drift})`  // drift = slow 1→1.1 zoom during hold
// alternate bg dark/light per word (ContrastFlip); payoff word = accent color + BurstRing
```

### WordPop (cascade)
**Job:** headline lands word-by-word with overshoot — energetic but reads as one sentence.
**Energy:** upbeat/reel. **Timing:** stagger 3–5 frames, each word spring POPPY dur 24.
```tsx
words.map((w,i)=> <span style={{opacity:min(1,p*1.6), transform:`scale(${lerp(p,0.5,1)}) translateY(${lerp(p,46,0)}px)`}}>{w}</span>)
// p = spring({frame: frame - delay - i*stagger, config: POPPY})
```

### Rise
**Job:** calm entrance — opacity + translateY 40→0. The Apple default.
**Energy:** calm (also subheads at any energy). **Timing:** SMOOTH dur 30, stagger siblings 5–8.

### Pop
**Job:** single element overshoot entrance (scale 0.6→1). Rise's upbeat sibling.
**Energy:** upbeat/reel. **Timing:** POPPY dur 26.

### TypeOn (+ Caret)
**Job:** URL/code types itself — process made visible, eyes locked to the moving end.
**Energy:** any. **Timing:** 1.4 chars/frame calm, 2.2 reel; caret blinks square-wave `Math.floor(frame/6)%2`.
```tsx
const shown = Math.min(len, Math.floor((frame - start) * charsPerFrame));
{chars.slice(0, shown)}<span style={{opacity: caretOn?1:0, color: accent}}>|</span>
```

### UnderlineSweep
**Job:** punctuates a landed headline; the one sanctioned accent line.
**Timing:** starts 6–16 frames after its headline; spring width 0→200–420px.

## Object / effect techniques

### ChipRain
**Job:** pain made physical — messy items crash in and land crooked.
**Energy:** upbeat/reel (agitate scenes). **Timing:** 5 chips, delays 0/2/4/6/8 (reel) or 0/4/8/12/16 (upbeat); each translateY −260→0 POPPY + rotate 0→±3–8°. Spread positions manually — no overlaps (verify in still).

### BurstRing
**Job:** radial emphasis explosion behind a reveal moment.
**Timing:** expanding circle scale 0.25→1 over 40 frames, opacity (1−p)·0.8; stack two rings 6 frames apart, second in accentSoft.

### DotBurst
**Job:** confetti-lite celebration (CTA), brand colors only.
**Timing:** 10 dots, radial angles, radius spring 0→220, opacity fades out.

### FloatChip
**Job:** keeps UI scenes alive after entrance — proof chips bob around the panel.
**Timing:** Pop entrance + continuous `Math.sin((frame+phase)/14)*7` px bob. Place at panel corners/edges, never over content.

### PillPulse
**Job:** CTA button breathes — signals "press me" without moving layout.
**Timing:** `scale(1 + 0.025*Math.sin(frame/7))` forever.

## Camera / scene techniques

### DriftZoom
**Job:** no frame ever sits still — slow continuous zoom sells "footage" not "slide". Apply to EVERY scene at upbeat/reel.
**Timing:** scale 1→1.04 (calm) / 1.06 (upbeat) / 1.08 (reel) across the scene, clamped.

### ParallaxPan
**Job:** UI screenshot pans inside its cropped window — screenshot becomes footage.
**Timing:** translateY of the <Img> inside overflow-hidden frame, 60–90 frames, 60–80px of travel.

### GlowBreathe
**Job:** background radial glow slowly scales `1 + 0.08*Math.sin(frame/22)` — sub-perceptual life.

### ContrastFlip
**Job:** novelty spike — hard cut to inverted bg (light→dark). Use for punch scenes and word-flash runs. The strongest single retention tool after the cold open.

### SlideOvershoot
**Job:** UI panel punches in from off-screen with POPPY overshoot.
**Timing:** translateX 200–260→0, POPPY dur 28.

### CutOnAction
**Job:** hard cut lands while something is mid-motion — momentum carries across the cut. Prefer hard cuts at reel energy; save fades for the CTA only.

### MetaphorProp
**Job:** the product's promise verb made physical — a small object acts out the value prop on the payoff word (fix → bandage slap, secure → padlock snap, track → pin drop, connect → links click). The one moment that feels authored, not templated.
**Energy:** any. **Timing:** slap/snap entrance with hard overshoot `{damping: 15, stiffness: 220}` scale 2.4→1 + rotation settle (−28°→−10°), lands 6-10 frames after its word finishes popping.
**Rules:** ONE per video · drawn in JSX with realistic muted colors (a bandage is tan, not brand-orange) · small — decorates the word, never covers copy (≈ 0.4× the word's width) · skip entirely if the promise has no physical verb.
```tsx
// anchored inside the word's relative wrapper
<span style={{ position: "relative" }}>
  <WordPop text="links." delay={32} />
  <Prop delay={40} />   // absolute, left ~52%, top ~74%, rotate -10, slap spring
</span>
```

## Secondary motion (promoted rule — upbeat & reel)

Entrances alone read as slideware. Once an element has LANDED it must keep living:

- **Wobble:** landed chips/cards `rotate(base + Math.sin((frame-delay)/11) * 2 * p)` + small y-bob
- **Breathe:** logos/heroes `scale *= 1 + 0.012 * Math.sin(frame/10)`
- **Bob:** panels/bars `translateY(Math.sin(frame/18) * 4)`
- **Press-dip:** buttons dip at an action beat `interpolate(frame, [t, t+4, t+8], [1, 0.93, 1])` — implies a click
- **Late tick:** one counter increments "+1" with a scale pop late in a UI scene — the product looks live
- **Second wave:** a second DotBurst/BurstRing 30-40 frames after the first on reveal/CTA scenes

Budget: 1-2 secondary motions per scene; every UI scene needs at least one.

## Banned (all energies)
Letter-by-letter bounce, typewriter cursors on headlines (TypeOn is for URLs/code only), camera shake, scan lines, gloss/shimmer sweeps, glow-on-everything, rotation entrances (>8°), more than one font.
