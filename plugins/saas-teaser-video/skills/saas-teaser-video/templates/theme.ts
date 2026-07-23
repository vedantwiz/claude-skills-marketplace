import { loadFont } from "@remotion/google-fonts/Inter";
// ^ TEMPLATE: swap "Inter" for the brand font extracted in research (must exist on Google Fonts,
//   else use @remotion/fonts with a local file — see remotion-patterns.md)

// loadFont() at module scope — required or the render falls back to system serif
const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

// TEMPLATE: every hex below MUST come from research / brand.json — never ship placeholders
export const theme = {
  bg: "#TODO_BG", // page background (near-white or near-black, never pure)
  text: "#TODO_TEXT", // headline color
  muted: "#TODO_MUTED", // subhead color (derive: text at ~55% strength)
  accent: "#TODO_ACCENT", // brand accent — small elements + one word per headline only
  accentSoft: "#TODO_ACCENT_SOFT", // gradient partner (if brand has one; else = accent)
  surface: "#TODO_SURFACE", // derived tint of accent/bg for chips, glow, panels
  border: "#E8E8E8",
  fontFamily,
  headline: {
    fontFamily,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
  } as const,
};

// SMOOTH — calm entrances. Zero bounce.
export const SMOOTH = { damping: 200 };

// SNAPPY — logo reveal only.
export const SNAPPY = { damping: 14, stiffness: 160, mass: 0.6 };

// POPPY — energetic overshoot for word cascades / chips (upbeat + reel energy)
export const POPPY = { damping: 16, stiffness: 190, mass: 0.7 };
