import React from "react";
import ObserveLogo from "../assets/observe_logo_512_og.png";
import { Box } from "@mui/material";

export const ObserveIcon = ({ size, rounded }) => {
  const round_styles = {
    borderRadius: Math.round(size / 2),
    overflow: "hidden",
    height: size,
    width: size,
  };

  return (
    <Box sx={rounded && round_styles}>
      <img src={ObserveLogo} width={size} height={size} />
    </Box>
  );
};
