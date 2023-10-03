import React from "react";
import ObserveLogo from "../assets/observe_logo_512_og.png";

export const ObserveIcon = ({ size, rounded }) => {
  const round_styles = {
    borderRadius: Math.round(size / 2),
    overflow: "hidden",
    height: size,
    width: size,
  };

  return (
    <div style={rounded && round_styles}>
      <img src={ObserveLogo} width={size} height={size} />
    </div>
  );
};
