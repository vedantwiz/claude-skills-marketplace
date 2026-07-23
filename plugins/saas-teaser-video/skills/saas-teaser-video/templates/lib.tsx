import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { POPPY, SMOOTH, theme } from "../theme";

export const Rise: React.FC<{
  delay?: number;
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

// Overshoot pop — the default entrance now (feedback: damped fades read as PPT)
export const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: POPPY, durationInFrames: 26 });
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])}) translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Word-by-word cascade — each word pops in staggered
export const WordPop: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  accentWords?: string[];
  style?: React.CSSProperties;
}> = ({ text, delay = 0, stagger = 4, accentWords = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.28em", ...style }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: POPPY, durationInFrames: 24 });
        const clean = w.replace(/[.,!?]/g, "");
        const isAccent = accentWords.includes(clean);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, p * 1.6),
              transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) translateY(${interpolate(p, [0, 1], [46, 0])}px)`,
              color: isAccent ? theme.accent : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Kinetic horizontal slide
export const Slide: React.FC<{
  delay?: number;
  from?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, from = -80, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: POPPY, durationInFrames: 28 });
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `translateX(${interpolate(p, [0, 1], [from, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Continuous slow zoom so no scene ever sits still (feedback: PPT feel)
export const Drift: React.FC<{
  dur: number;
  zoom?: number;
  children: React.ReactNode;
}> = ({ dur, zoom = 1.05, children }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [1, zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, justifyContent: "center", alignItems: "center" }}>
      {children}
    </AbsoluteFill>
  );
};

// Scene backdrop: brand bg + animated warm radial glow (glow breathes slowly)
export const Glow: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({
  children,
  dark = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.08 * Math.sin(frame / 22);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? theme.text : theme.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: dark
            ? `radial-gradient(ellipse 120% 55% at 50% 118%, rgba(255,98,0,0.22) 0%, rgba(13,13,13,0) 70%)`
            : `radial-gradient(ellipse 120% 55% at 50% 118%, ${theme.surface} 0%, ${theme.bg} 70%)`,
          transform: `scale(${breathe})`,
          transformOrigin: "50% 100%",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

// Expanding burst ring (reveal / CTA effect moment)
export const BurstRing: React.FC<{ delay?: number; size?: number; color?: string }> = ({
  delay = 0,
  size = 900,
  color = theme.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SMOOTH, durationInFrames: 40 });
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `4px solid ${color}`,
        opacity: (1 - p) * 0.8,
        transform: `scale(${interpolate(p, [0, 1], [0.25, 1])})`,
      }}
    />
  );
};

// Radial dot burst (confetti-lite, brand colors only)
export const DotBurst: React.FC<{ delay?: number; count?: number; radius?: number }> = ({
  delay = 0,
  count = 10,
  radius = 220,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: SMOOTH, durationInFrames: 45 });
  if (frame < delay) return null;
  return (
    <div style={{ position: "absolute" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = p * radius;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 2 ? 14 : 10,
              height: i % 2 ? 14 : 10,
              borderRadius: "50%",
              backgroundColor: i % 2 ? theme.accent : theme.accentSoft,
              opacity: (1 - p) * 0.9,
              transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

// Floating chip with sine bob — keeps UI scenes alive
export const FloatChip: React.FC<{
  delay?: number;
  phase?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, phase = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: POPPY, durationInFrames: 26 });
  const bob = Math.sin((frame + phase) / 14) * 7;
  return (
    <div
      style={{
        position: "absolute",
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${interpolate(p, [0, 1], [0.5, 1])}) translateY(${bob + interpolate(p, [0, 1], [40, 0])}px)`,
        fontFamily: theme.fontFamily,
        fontSize: 26,
        fontWeight: 600,
        color: theme.text,
        backgroundColor: "#FFFFFF",
        border: `1px solid ${theme.border}`,
        borderRadius: 100,
        padding: "14px 26px",
        boxShadow: "0 12px 34px rgba(13,13,13,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: theme.accent }}>{children}</span>
);
