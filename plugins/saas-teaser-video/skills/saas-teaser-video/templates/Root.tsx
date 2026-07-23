import React from "react";
import { Composition } from "remotion";
import { Teaser } from "./Teaser";

// TEMPLATE: durationInFrames MUST equal the TransitionSeries net total
// (sum of scenes minus transition overlaps) — compute it, don't eyeball.
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Teaser"
    component={Teaser}
    durationInFrames={615}
    fps={30}
    width={1920}
    height={1080}
  />
);
