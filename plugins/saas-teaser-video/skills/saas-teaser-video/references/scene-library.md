# Scene Library — copy formulas + ICP visual mapping

## ICP → visual language

Pick the row matching the researched ICP. Extracted brand tokens always override this table's palette hints — this table sets tone, density, and pacing.

| ICP | Tone | Background | Pacing | Feature proof style |
|-----|------|-----------|--------|---------------------|
| Developers / eng leads | Engineered, dry, confident. Zero hype words. | Dark (near-black, never pure #000) | Fast cuts, tight staggers | Rebuilt UI panel, keyboard-first hints, terse stat ("2× faster CI") |
| Founders / PMs | Ambitious, momentum. "Ship / build / launch" verbs. | Dark or bold brand color | Fast, one slide transition allowed | Before/after, metric counters |
| Marketing / RevOps | Outcome-first. Pipeline, ROI, attribution words. | Light, airy, lots of white | Medium | Big animated numbers ("+34% conversions"), simple chart bars growing |
| HR / Ops / non-technical | Warm, calm, human. No jargon at all. | Light, soft brand tint | Slower (scenes 90+ frames) | Friendly rebuilt UI, checkmark lists (max 3) |
| Enterprise / security buyers | Trust, control, certainty. | Deep navy/charcoal | Slow, stately, cuts only | Logos-style badges (SOC2, SSO), plain declarative claims |

## Copy formulas per scene

Headlines ≤ 6 words. Subheads ≤ 8. Sentence case (Apple style), period at end of declarative lines.

**1. Hook** — pain as flat statement, or bold claim:
- "`<Painful thing>` is broken."
- "Still doing `<task>` by hand?"
- "`<Outcome>` shouldn't take `<time>`."

**2. Agitate** — make it concrete, muted second line:
- Headline: the cost ("Hours lost. Every week.")
- Sub: the culprits, 2–3 nouns max ("Spreadsheets. Slack threads. Guesswork.")

**3. Reveal** — the turn. Logo mark scales in (SNAPPY spring, the one allowed pop), product name, then:
- "Meet `<Product>`." or "`<Product>`. `<Category>`, rebuilt."

**4–5. Value beats** — one per scene, verb-first headline + visual proof:
- "Track every `<thing>`." / "Automate `<task>`." / "See `<metric>` instantly."
- Visual: rebuilt UI panel sliding up (SMOOTH), or one big stat counting up via `interpolate` on frame → `Math.round`.

**6. Punch** — full-bleed kinetic line, emotional peak, largest type in the video (140px+):
- "`<Verb>` at the speed of `<noun>`." / "Built for `<ICP>`." / "Less `<pain>`. More `<outcome>`."

**7. CTA** — logo small top-center, domain large, one action:
- Domain as the headline ("acme.com")
- Sub: "Start free." / "Get early access." — exactly one CTA, never two.

## Stat counter pattern (value beats)

```tsx
const n = Math.round(
  interpolate(spring({ frame, fps, config: { damping: 200 }, durationInFrames: 45 }), [0, 1], [0, 34])
);
// render: <span>+{n}%</span>  — spring-driven so the count decelerates into place
```

## Duration math sanity

Net frames = `sum(scene durations) − 10 × (scene count − 1)` (10-frame fade overlaps). Target net: 600–750 @30fps (20–25s). Reference: 7 scenes at 90/90/90/105/105/90/105 → 675 − 60 = 615 net. If net exceeds 900, cut a value beat — teasers tease. The Composition's `durationInFrames` must equal this net number exactly.
